# Scrum Poker - Guia do Projeto (Codex)

## Objetivo
Projeto pessoal de scrum poker com front web, API e servidor de jogo em tempo real.
Este arquivo serve como referencia rapida para entender a estrutura e onde mexer.

## Stack
- Monorepo: pnpm workspaces + turbo
- Web: Next.js 15 (App Router), React 19, Tailwind, Radix UI, React Query, NextAuth
- API: NestJS 10, Fastify, TypeORM, Swagger, Socket.IO
- Game Server: Colyseus (real-time)
- Shared: @scrum-poker/env (dotenv + zod)

## Estrutura
- apps/api
  - src/main.ts (bootstrap)
  - src/app.module.ts
  - src/application, src/config, src/infrastructure, src/presentation, src/shared, src/types
- apps/web
  - src/app (rotas App Router)
  - src/modules (features)
  - src/assets, src/locales
  - middleware.ts
- apps/game-server
  - src/index.ts (bootstrap)
  - src/modules
  - loadtest, test
- packages/env
  - index.ts (schema + load do .env)
- root
  - .env, turbo.json, pnpm-workspace.yaml

## Fluxo (alto nivel)
- Web chama a API para dados e autenticacao.
- Web conecta no Game Server (Colyseus/WebSocket) para salas e tempo real.
- API usa Postgres.

## Scripts principais
- Root: pnpm dev | build | lint | test (via turbo)
- apps/web: dev | build | start | lint
- apps/api: dev | start | build | test | typeorm
- apps/game-server: dev | build | test | loadtest

## Variaveis de ambiente (root .env)
- NODE_ENV, PORT_WEB, PORT_NEST
- NEXTAUTH_DEBUG, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET
- DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE

## Notas para edicao
- Config de env centralizada em packages/env.
- Frontend: priorize changes em src/modules e rotas em src/app.
- API: organizacao por camadas (application/infrastructure/presentation).
- Testes: sempre adicionar um comentario em portugues explicando a intencao de cada teste.

## Padrao de commit
- Formato: `<tipo>(<escopo>): <resumo no imperativo>`
- Tipos recomendados: `feat`, `fix`, `refactor`, `test`, `docs`, `chore`.
- Escopo recomendado: `api`, `web`, `game-server`, `env`, `repo`.
- Corpo opcional (quando necessario): listar impactos, risco de regressao e passos de validacao.
- Exemplo 1: `fix(api): alinhar versoes do fastify e plugins`
- Exemplo 2: `refactor(web): simplificar estado do dashboard`
