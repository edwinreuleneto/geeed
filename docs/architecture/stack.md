# Stack

Espelha o projeto irmão (plataforma Nota) para manter consistência entre os apps.

| Camada        | Tecnologia                    | Por quê |
|---------------|-------------------------------|---------|
| Monorepo      | Turborepo + pnpm workspaces   | Pipelines cacheados, packages compartilhados |
| Framework     | Next.js 16 (App Router, RSC)  | Rotas, streaming, server components |
| UI            | React 19                      | Base de componentes |
| Estilo        | Tailwind CSS v4 (`@theme`)    | Design tokens no CSS, zero config JS |
| Dados/estado  | TanStack React Query v5       | Cache, revalidação, suspense |
| Movimento     | Framer Motion                 | Transições suaves |
| Ícones        | lucide-react                  | Ícones consistentes |
| Linguagem     | TypeScript strict             | Segurança de tipos |

## Packages internos
- `@ged/ui` — componentes compartilháveis entre apps.
- `@ged/lib` — utilitários puros (`cn`, `removeEmpty`).
- `@ged/config` — tsconfigs base/nextjs/react-library.

## Versões
Ver `apps/ged/package.json`. Node >= 20, pnpm >= 9.
