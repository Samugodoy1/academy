# Prompt para o agente do backend (odontohub-api)

Copie o bloco abaixo e cole como tarefa para o agente que vai alterar o repositório da API central (`odontohub-api`, produção em `https://api.odontohub.app.br`).

---

## Tarefa

O frontend do OdontoHub Academy (`https://academy.odontohub.app.br`, repo `Samugodoy1/academy`) já consome o contrato abaixo para **cupons de desconto de embaixadores**.

O admin cadastra um código (ex.: `SAMU20`) ligado a um embaixador. O aluno aplica o código no checkout do plano **Academy Student**. O admin pode **cancelar** um cupom a qualquer momento; cupom cancelado deixa de valer em novos checkouts. Assinaturas já pagas com aquele cupom **não** são desfeitas.

Não invente outro formato. O Academy já envia exatamente o que está abaixo.

## Contexto do produto

- Produto: `academy` (header `x-product: academy` e campo `product: "academy"` no body).
- Auth: JWT Bearer (os mesmos `Authorization` e `x-auth-token` do login atual).
- Papel admin: `user.role` (ou `global_role`) `ADMIN` — as rotas `/api/admin/coupons*` só para admin.
- Checkout atual: `POST /api/subscriptions/create` com Mercado Pago (`init_point`). O cupom precisa entrar **antes** de criar a preferência/assinatura, para o `amount` cobrado já sair com desconto.
- CORS: `https://academy.odontohub.app.br` e localhost do Vite, com `credentials`.

## Schema sugerido

```sql
academy_ambassador_coupons (
  id                 SERIAL PRIMARY KEY,
  product            TEXT NOT NULL DEFAULT 'academy',
  code               TEXT NOT NULL,                 -- sempre UPPERCASE, único por product
  ambassador_name    TEXT NOT NULL,
  ambassador_user_id INTEGER NULL REFERENCES users(id),
  discount_type      TEXT NOT NULL CHECK (discount_type IN ('percent', 'amount')),
  discount_value     NUMERIC(10,2) NOT NULL CHECK (discount_value > 0),
  max_redemptions    INTEGER NULL CHECK (max_redemptions > 0),
  redemption_count   INTEGER NOT NULL DEFAULT 0,
  expires_at         TIMESTAMPTZ NULL,
  status             TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  notes              TEXT NULL,
  created_by         INTEGER NULL REFERENCES users(id),
  created_at         TIMESTAMPTZ NOT NULL DEFAULT now(),
  cancelled_at       TIMESTAMPTZ NULL,
  cancelled_by       INTEGER NULL REFERENCES users(id),
  UNIQUE (product, code)
);

academy_coupon_redemptions (
  id              SERIAL PRIMARY KEY,
  coupon_id       INTEGER NOT NULL REFERENCES academy_ambassador_coupons(id),
  user_id         INTEGER NOT NULL REFERENCES users(id),
  subscription_id INTEGER NULL,
  amount_original NUMERIC(10,2) NOT NULL,
  amount_charged  NUMERIC(10,2) NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (coupon_id, user_id)   -- um uso por aluno por cupom
);
```

Regras de `status` efetivo (além da coluna):

- `cancelled` se `status = cancelled` ou `cancelled_at` preenchido.
- `expired` se passou `expires_at` **ou** `redemption_count >= max_redemptions`.
- Só `active` pode ser aplicado no checkout.

## 1) Listar cupons (admin)

`GET /api/admin/coupons?product=academy`

Auth + role ADMIN.

`200`:

```json
{
  "coupons": [
    {
      "id": 7,
      "product": "academy",
      "code": "SAMU20",
      "ambassador_name": "Samuel Godoy",
      "ambassador_user_id": null,
      "discount_type": "percent",
      "discount_value": 20,
      "max_redemptions": 50,
      "redemption_count": 3,
      "expires_at": "2026-12-31T23:59:59.000Z",
      "status": "active",
      "notes": null,
      "created_at": "2026-09-14T12:00:00.000Z",
      "cancelled_at": null
    }
  ]
}
```

Sem linhas → `200` `{ "coupons": [] }`. Não devolva 404.

## 2) Cadastrar cupom (admin)

`POST /api/admin/coupons`

Auth + role ADMIN.

Body (o frontend manda exatamente isto):

```json
{
  "product": "academy",
  "code": "SAMU20",
  "ambassador_name": "Samuel Godoy",
  "discount_type": "percent",
  "discount_value": 20,
  "max_redemptions": 50,
  "expires_at": "2026-12-31T23:59:59.000Z",
  "notes": null
}
```

Regras:

- Normalize `code` para uppercase, sem espaços.
- Código: `^[A-Z0-9][A-Z0-9_-]{2,31}$`. Fora disso → `400` `{ "error": "Codigo de cupom invalido." }`.
- `ambassador_name` obrigatório (mín. 2 caracteres).
- `discount_type`: `percent` ou `amount`.
- `percent`: `discount_value` entre 1 e 100.
- `amount`: `discount_value` > 0, em BRL.
- `max_redemptions` omitido/null = ilimitado.
- `expires_at` omitido/null = sem validade.
- Código já existente no mesmo `product` (mesmo cancelado) → `409` `{ "error": "Ja existe um cupom com esse codigo." }`. Não recicle código cancelado; o admin cria outro.
- `200` ou `201` devolvendo `{ "coupon": { ...mesmo shape da listagem... } }`.

## 3) Cancelar cupom (admin)

`POST /api/admin/coupons/:id/cancel`

Auth + role ADMIN.

Body:

```json
{ "product": "academy" }
```

- Cupom inexistente ou de outro produto → `404` `{ "error": "Cupom nao encontrado." }`.
- Já cancelado → `200` com o registro atual (idempotente).
- Marque `status = cancelled`, `cancelled_at = now()`, `cancelled_by = admin`.
- Não apague o registro. Não altere `redemption_count`.
- `200` `{ "coupon": { ...status cancelled... } }`.

## 4) Preview no checkout (aluno autenticado)

`POST /api/coupons/preview`

Auth + acesso ao produto academy. **Não** é rota admin.

Body:

```json
{
  "product": "academy",
  "code": "SAMU20",
  "plan_id": 2
}
```

`plan_id` é o plano pago do Academy (Student). Use o `amount` vigente desse plano.

Cupom válido → `200`:

```json
{
  "valid": true,
  "code": "SAMU20",
  "ambassador_name": "Samuel Godoy",
  "discount_type": "percent",
  "discount_value": 20,
  "original_amount": "29.90",
  "discounted_amount": "23.92",
  "currency": "BRL"
}
```

Cupom inválido, cancelado, expirado, esgotado, de outro produto, ou aluno já usou esse código → `200` (preferível, o frontend já trata) ou `400`:

```json
{
  "valid": false,
  "error": "Cupom invalido ou expirado."
}
```

Mensagens úteis (pode usar estas):

- `"Cupom invalido ou expirado."`
- `"Este cupom foi cancelado."`
- `"Este cupom esgotou."`
- `"Voce ja usou este cupom."`

Não revele se o código “existe mas está cancelado” vs “nunca existiu” se quiser evitar enumeração; a mensagem genérica serve. Se for mais simples para o admin acompanhar suporte, as mensagens específicas acima também são aceitas.

## 5) Aplicar no create da assinatura (obrigatório)

`POST /api/subscriptions/create` **já existe**. Passe a aceitar `coupon_code` opcional.

Body que o frontend agora envia:

```json
{
  "product": "academy",
  "plan_id": 2,
  "coupon_code": "SAMU20"
}
```

Sem `coupon_code` (ou string vazia): comportamento atual, valor cheio.

Com `coupon_code`:

1. Normalize e valide como no preview.
2. Recalcule `amount` = desconto sobre o valor do plano.
3. Crie a preferência/assinatura no Mercado Pago **com o valor com desconto**.
4. Grave a redemption (pode ficar `pending` até o pagamento autorizar; o importante é não deixar o mesmo aluno usar o cupom duas vezes em checkouts concorrentes — unique `(coupon_id, user_id)` + transação).
5. Incremente `redemption_count` de forma atômica. Se estourar `max_redemptions`, recuse com `400` `{ "error": "Este cupom esgotou." }` e **não** crie a assinatura.
6. Resposta igual à de hoje (`init_point`, etc.). Se puder, inclua também:

```json
{
  "init_point": "https://www.mercadopago.com.br/...",
  "coupon_code": "SAMU20",
  "original_amount": "29.90",
  "amount": "23.92"
}
```

`POST /api/subscriptions/resume` pode ignorar o cupom (a pending já nasceu com um amount). Não quebre o resume.

Webhook/pagamento: se a assinatura pending expirar sem pagar, libere a redemption desse user+cupom (delete ou marque `released`) e decremente `redemption_count`, senão o aluno fica preso sem ter pago.

## 6) O que NÃO fazer

- Não dê cupom no plano Free. Só no plano pago Academy (Student).
- Não aplique cupom de `academy` em `odontohub`.
- Não apague cupom cancelado.
- Não recicle o mesmo `code` depois de cancelar.
- Não cobre o valor cheio no Mercado Pago e “devolva depois”. O `init_point` já tem que nascer com o desconto.
- Não permita que um aluno não-admin liste ou cancele cupons.

## 7) Como validar

1. Admin `POST /api/admin/coupons` com `SAMU20` / 20% → `201` + código `SAMU20`.
2. `GET /api/admin/coupons?product=academy` devolve o mesmo registro.
3. Aluno `POST /api/coupons/preview` com `SAMU20` → `valid: true` e `discounted_amount` = 80% do plano.
4. Aluno `POST /api/subscriptions/create` com `coupon_code: "SAMU20"` → `init_point` e o amount no MP é o valor com desconto.
5. Admin `POST /api/admin/coupons/:id/cancel` → status `cancelled`.
6. Preview / create com o mesmo código → inválido.
7. Código inexistente → `valid: false`, sem 500.
8. Usuário sem ADMIN em `/api/admin/coupons` → `403`.

## 8) Arquivos do frontend que já consomem isto

- `src/features/admin/AmbassadorCouponsPanel.tsx` → `GET/POST /api/admin/coupons` e `POST /api/admin/coupons/:id/cancel`
- `src/features/coupons/api.ts` e `src/features/coupons/CouponApplyField.tsx` → `POST /api/coupons/preview`
- `src/components/SubscriptionManagement.tsx` → `POST /api/subscriptions/create` com `coupon_code`

Quando essas rotas responderem `2xx` gravando no banco, o painel Admin e o checkout do Academy passam a funcionar de ponta a ponta.
