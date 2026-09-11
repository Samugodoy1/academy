# Prompt para o agente do backend (odontohub-api)

Copie o bloco abaixo e cole como tarefa para o agente que vai alterar o repositório da API central (`odontohub-api`, produção em `https://api.odontohub.app.br`).

---

## Tarefa

O frontend do OdontoHub Academy (`https://academy.odontohub.app.br`, repo `Samugodoy1/academy`) já está ligado a estes contratos. Implemente e persista de verdade no banco. Hoje cores, widgets e o progresso do jogo **não sobrevivem** a um reload em outro dispositivo porque a API ignora os campos e o workaround de gravar no `bio` / `clinic_address` também não fica.

Não invente outro formato. O Academy já envia exatamente o que está abaixo.

## Contexto do produto

- Produto: `academy` (header `x-product: academy` e campo `product: "academy"` no body).
- Auth: JWT Bearer (os mesmos `Authorization` e `x-auth-token` do login atual).
- Login com Google **já existe** em `POST /api/auth/google`. O Academy passou a usar o mesmo endpoint do Sistema. Confirme que ele aceita `product: "academy"`, cria/vincula usuário e devolve `{ token, user }` no mesmo formato de `POST /api/auth/login`.
- Client ID Google já usado no Sistema e no Academy:

```
223513165936-6o0tr737hdbhsrlcmgjpssc4mf4a8gqm.apps.googleusercontent.com
```

No Google Cloud Console deste client, as **Authorized JavaScript origins** precisam incluir:

- `https://academy.odontohub.app.br`
- `https://sistema.odontohub.app.br`
- `http://localhost:5173`
- `http://localhost:3000`

Authorized redirect URIs não são usadas neste fluxo (GIS ID token / One Tap). O frontend manda o `credential` (JWT do Google) no body.

## 1) Login Google — só ajuste se faltar

`POST /api/auth/google` (público)

Body:

```json
{
  "credential": "<JWT id_token do Google Identity Services>",
  "rememberMe": true,
  "product": "academy",
  "acceptedTerms": false,
  "acceptedPrivacyPolicy": false,
  "acceptedResponsibility": false
}
```

Comportamento esperado (já parcialmente implementado; confirme):

- Sem `credential` → `400` `{ "error": "Credencial do Google nao informada." }`
- Sem `product` válido → `400` `{ "error": "Produto invalido ou nao informado." }`
- Token Google inválido → `401` `{ "error": "Nao foi possivel validar sua conta Google." }`
- Token válido:
  1. Valida o ID token com o client ID acima (`aud` tem que bater).
  2. Se `google_sub` / email já existe, faz login.
  3. Se o email existe sem Google, vincula o `google_sub` nessa conta.
  4. Se não existe, cria usuário Academy (role de estudante/dentista acadêmico, `product_accesses` com `product: "academy"`, plano `free`, `approval_status` no padrão atual do register).
  5. Resposta `200` idêntica ao login por senha: `{ "token": "<jwt>", "user": { "id", "name", "role", "current_product", "product_accesses", ... } }`.
- Os flags `acceptedTerms*` só importam na **criação**. Se o usuário já existe, ignore. Se a API hoje exige termos para criar conta Academy, aceite-os quando `true`; se vierem `false` num cadastro novo, ou crie mesmo assim (o Sistema já faz isso) ou devolva `400` pedindo os termos — mas não quebre o login de quem já tem conta.

CORS: `academy.odontohub.app.br` precisa estar na allowlist, com `credentials` (o frontend manda `credentials: "include"`).

## 2) Preferências Academy — cores e widgets (obrigatório)

Crie tabela (ou colunas JSON no usuário/perfil) e rotas **dedicadas**. Não dependa de `bio` nem de `clinic_address`. Esses campos já foram usados como envelope `[[OH_ACADEMY]]...[[/OH_ACADEMY]]` e **não permanecem**.

Sugestão de schema:

```sql
-- uma linha por usuário (dentist_id / user_id)
academy_prefs (
  user_id        PK FK,
  academy_neo    TEXT NOT NULL DEFAULT 'laranja',
  academy_widgets JSONB NOT NULL DEFAULT '[]',
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

Valores válidos de `academy_neo`:

`laranja` | `lima` | `azul` | `rosa` | `violeta`

Widget:

```ts
{
  id: string;          // obrigatório
  kind: 'clock' | 'next' | 'hoje' | 'pacientes' | 'agenda' | 'estudos' | 'agendar' | 'photo' | 'note' | 'wash';
  size: 'sm' | 'md' | 'lg';
  photo?: string;      // https://... ou data:image... (até ~1.5MB)
  note?: string;       // max 140
  wash?: string;       // max 24
}
```

### `GET /api/academy/prefs` (auth + x-product: academy)

`200`:

```json
{
  "academy_neo": "lima",
  "academy_widgets": [
    { "id": "clock", "kind": "clock", "size": "md" },
    { "id": "next", "kind": "next", "size": "sm" },
    { "id": "photo", "kind": "photo", "size": "sm", "photo": "https://res.cloudinary.com/..." }
  ]
}
```

Se ainda não houver linha, `200` com `academy_neo: "laranja"` e `academy_widgets: []` (o frontend preenche o default e faz PUT). **Não** devolva 404.

### `PUT /api/academy/prefs` (auth + x-product: academy)

Body (o frontend manda exatamente isto):

```json
{
  "academy_neo": "violeta",
  "academy_widgets": [
    { "id": "clock", "kind": "clock", "size": "md" },
    { "id": "photo", "kind": "photo", "size": "sm", "photo": "https://..." }
  ]
}
```

- Upsert por `user_id`.
- Rejeite `academy_neo` desconhecido com `400`.
- Ignore widget sem `id`/`kind` válido; persista o array restante.
- Persista `photo` (URL https ou data URI). Sem isso a foto do widget some.
- `200` devolvendo o registro gravado (mesmo shape do GET).
- Também pode aceitar `PATCH` com o mesmo body.

O frontend **ainda tenta**, se o PUT falhar:

1. `PATCH /api/profile/academy` com o mesmo body
2. `POST /api/profile` com `academy_neo`, `academy_widgets`, `settings.{academy_neo,academy_widgets}` e o envelope no `bio`

Se for mais barato, faça `PATCH /api/profile/academy` virar alias do PUT acima. O importante é a linha no banco, não o envelope no bio.

`GET /api/profile` deve passar a incluir `academy_neo` e `academy_widgets` no JSON do perfil (além das rotas novas). Sem strip desses campos no serializer.

## 3) Estado do jogo Cola (obrigatório)

O jogo (XP, vidas, ofensiva, cristais, missões, unidades, erros) hoje só vive em `localStorage` (`academy_cola_game_v1`). O frontend agora faz:

- `GET /api/academy/game` ao abrir o treino
- `PUT /api/academy/game` debounce 800ms a cada mudança (lição, loja, meta, som, regen)

Schema sugerido:

```sql
academy_game (
  user_id     PK FK,
  version     INTEGER NOT NULL DEFAULT 2,
  state       JSONB NOT NULL,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
)
```

### `GET /api/academy/game` (auth)

`200` se existir:

```json
{
  "version": 2,
  "updatedAt": 1778000000000,
  "state": { "...GameState..." }
}
```

Também aceito devolver o `GameState` no root (o frontend lê `body.state` ou o próprio body).

Se não existir linha: `200` com `state` vazio/`null` **ou** `404`. Os dois servem; o frontend cai no local e depois faz PUT. Prefira `200` + `state: null` para não parecer “rota inexistente”.

### `PUT /api/academy/game` (auth)

Body que o frontend envia:

```json
{
  "version": 2,
  "updatedAt": 1778000000000,
  "state": {
    "version": 2,
    "xp": 0,
    "hearts": 5,
    "heartsAt": 1778000000000,
    "streak": 0,
    "lastDay": null,
    "dayKey": "2026-09-10",
    "dayXp": 0,
    "dailyGoal": 30,
    "units": { "anestesia": { "lessons": 2, "crowns": 1 } },
    "mistakes": ["anestesia-q3"],
    "sound": true,
    "totalCorrect": 0,
    "totalAnswered": 0,
    "lessonsDone": 0,
    "perfectLessons": 0,
    "bestCombo": 0,
    "gems": 0,
    "freezes": 0,
    "bestStreak": 0,
    "history": [],
    "frozen": [],
    "lostStreak": null,
    "milestone": 0,
    "quests": [
      { "id": "xp-hoje", "kind": "xp", "title": "Ganhe 30 XP hoje", "target": 30, "progress": 0, "gems": 10 }
    ],
    "dayLessons": 0
  }
}
```

Regras:

- Upsert por `user_id`. Grave o JSON **inteiro**. Não normalize demais: o frontend já sanitiza.
- `state.units` é mapa `topic -> { lessons: number, crowns: 0..3 }`.
- `state.lostStreak` é `{ value: number, day: "YYYY-MM-DD" }` ou `null`.
- `state.quests` é array de `{ id, kind, title, target, progress, gems }`.
- Tamanho: o JSON cabe em poucos KB. Recuse se passar de ~100KB.
- `200` devolvendo o mesmo envelope.
- Merge no servidor: se quiser evitar lost update, compare `updatedAt` e fique com o `state` de maior `xp + lessonsDone`. O frontend já faz esse merge local; last-write-wins simples também serve.

Não coloque o jogo no `bio`. Não misture com `academy_prefs`.

## 4) Auth, produto e CORS

- Todas as rotas `/api/academy/*` exigem JWT válido.
- Usuário sem acesso ao produto `academy` → `403` (mesma regra das outras rotas Academy).
- `OPTIONS` + CORS para `https://academy.odontohub.app.br` e localhost de Vite.
- Cookie/credentials: o frontend manda `credentials: include`; não quebre o JWT no header.

## 5) O que NÃO fazer

- Não apague `bio` visível do aluno ao salvar prefs.
- Não recuse `photo` em data URI ou URL https do widget.
- Não exija senha em conta criada pelo Google.
- Não implemente outro OAuth redirect/callback no Academy — o fluxo é GIS + `credential`.
- Não mude o shape do login por email/senha.

## 6) Como validar

1. `POST /api/auth/google` com token real → `200` + JWT + `product_accesses` contendo `academy`.
2. `PUT /api/academy/prefs` → `GET` devolve a mesma cor e os mesmos widgets, inclusive `photo`.
3. Logout / outro browser / outro device → cor e widgets iguais.
4. `PUT /api/academy/game` com `xp: 120, lessonsDone: 3` → `GET` devolve os mesmos números.
5. Jogar uma lição no Academy, recarregar, conferir XP/ofensiva/vidas.
6. `GET /api/profile` inclui `academy_neo` e `academy_widgets`.
7. Conta só-Sistema (`odontohub`) não precisa dessas tabelas; isolamento por `user_id` basta.

## 7) Arquivos do frontend que já consomem isto

- `src/features/auth/GoogleSignInButton.tsx` → `POST /api/auth/google`
- `src/theme/academyAccount.ts` → `GET/PUT /api/academy/prefs` (fallback `PATCH /api/profile/academy` + `POST /api/profile`)
- `src/features/game/sync.ts` → `GET/PUT /api/academy/game`

Quando as rotas ` /api/academy/prefs` e `/api/academy/game` responderem `2xx` gravando no banco, o Academy para de depender do localStorage e do envelope no bio.
