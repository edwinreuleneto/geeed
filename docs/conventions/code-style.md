# Estilo de código

Herdado do projeto Nota. Seguir à risca para manter os apps homogêneos.

## Organização de arquivos
- Componente compartilhado: `components/<Nome>/index.tsx` (default export).
- Tipos do componente: `components/<Nome>/<nome>.types.ts` (kebab-case).
- Componente de feature: `_components/` ao lado da página.
- Serviço de dados: `services/<dominio>/index.ts` + `<dominio>.types.ts`.

## Headers de comentário (na ordem de import)
```ts
// Next
// React
// Libs        (terceiros: react-query, framer-motion, lucide-react…)
// Providers
// Components
// Services
// Utils
// Types
```

## React Query
- Chaves centralizadas por domínio: `documentsKeys = { all, list, detail(id) }`.
- Providers com `staleTime`, `refetchOnWindowFocus: false`, `retry: 1`.
- Leitura em páginas com `useSuspenseQuery` + `loading.tsx`.

## TypeScript
- `strict`, `noUncheckedIndexedAccess`. Preferir tipos explícitos em bordas públicas.
- Sem `any`; usar `unknown` + narrowing.

## Nomes
- Componentes/Tipos: `PascalCase`. Hooks: `useAlgo`. Arquivos `.types.ts`: kebab-case.
- Textos de UI em **pt-BR**.
