# ADR 0001 — Monorepo com Turborepo + pnpm

- **Status**: aceito
- **Contexto**: precisamos de consistência com o projeto Nota e compartilhar UI/lib entre apps.
- **Decisão**: monorepo pnpm workspaces + Turborepo, com packages `@ged/{ui,lib,config}`.
- **Consequências**: pipelines cacheados; imports `workspace:*`; um único lockfile.
