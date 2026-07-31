# Estrutura de pastas

Segue **fielmente** a convenção do projeto Nota.

```
app/                              raiz do monorepo
├─ apps/ged/                      aplicação Next.js
│  └─ src/
│     ├─ app/                     App Router
│     │  ├─ layout.tsx            html/body, fontes, providers
│     │  ├─ page.tsx              redireciona → /documentos
│     │  └─ (app)/                route group da área logada
│     │     ├─ layout.tsx         AppShell (sidebar + conteúdo)
│     │     ├─ documentos/
│     │     │  ├─ page.tsx
│     │     │  ├─ loading.tsx
│     │     │  ├─ _components/    componentes de feature (escopo local)
│     │     │  └─ [docId]/
│     │     │     ├─ page.tsx  loading.tsx  not-found.tsx
│     │     │     └─ _components/
│     │     ├─ seguranca/page.tsx
│     │     └─ conectores/page.tsx
│     ├─ components/              componentes COMPARTILHADOS (um por pasta)
│     │  └─ <Componente>/index.tsx + <componente>.types.ts
│     ├─ data/                    mock DB em memória + seed
│     ├─ hooks/                   hooks reutilizáveis
│     ├─ lib/                     api.ts (client fetch) + utils.ts (re-export cn)
│     ├─ providers/QueryProvider/ React Query provider
│     ├─ services/<dominio>/      index.ts (hooks/queries) + <dominio>.types.ts
│     ├─ styles/globals.css       Tailwind v4 + tokens (@theme)
│     ├─ types/                   tipos globais
│     └─ utils/                   helpers puros (format, greeting…)
└─ packages/{ui,lib,config}/
```

## Regras
- **Componente compartilhado** → `components/<Nome>/index.tsx` (+ `.types.ts` em kebab-case).
- **Componente de feature** → `_components/` ao lado da página que o usa.
- **Acesso a dados** → sempre via `services/<dominio>`, nunca `fetch` solto no componente.
- **Import alias** → `@/` aponta para `apps/ged/src`.
- **Headers de comentário** por seção: `// Next`, `// Libs`, `// Components`, `// Utils`, `// Types`.
