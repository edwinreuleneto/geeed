# ADR 0002 — Mock-first com camada de services

- **Status**: aceito
- **Contexto**: o SharePoint ainda não está conectado, mas queremos navegar o produto real hoje.
- **Decisão**: dados semente em memória (`data/`) servidos por uma camada de `services/`
  desenhada como uma API assíncrona (Promises + pequeno atraso). A UI consome via React Query.
- **Consequências**: a troca para o SharePoint é local à camada de dados (`data/` → `lib/api.ts`);
  hooks e componentes não mudam. Navegação instantânea sem backend.
