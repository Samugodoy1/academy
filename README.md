# OdontoHub Academy

Frontend React + Vite para a plataforma educacional OdontoHub Academy.

## Arquitetura

Este repositório contém **apenas o frontend** (SPA). Todas as chamadas de API são direcionadas à API central:

```
https://api.odontohub.app.br
```

O backend centralizado está no repositório [odontohub-api](https://github.com/Samugodoy1/odontohub-api).

## Tecnologias

- **React 19** — Biblioteca para construção de interfaces
- **Vite** — Ferramenta de build e desenvolvimento
- **Tailwind CSS v4** — Framework CSS utilitário
- **Lucide React** — Ícones SVG
- **Motion / Framer Motion** — Animações

## Requisitos

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

## Como executar localmente

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure a variável de ambiente:
   ```bash
   cp .env.example .env
   # Edite .env se necessário (para dev local, pode usar http://localhost:3001)
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## Variáveis de Ambiente

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_API_URL` | URL da API central | `https://api.odontohub.app.br` |

## Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (Vite) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build local |
| `npm run lint` | Verificação de tipos TypeScript |
