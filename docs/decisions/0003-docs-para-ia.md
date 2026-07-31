# ADR 0003 — Base de docs para IA

- **Status**: aceito
- **Contexto**: queremos, no futuro, alimentar agentes de IA/RAG com o conhecimento do projeto.
- **Decisão**: manter `docs/` na raiz com arquivos Markdown curtos e temáticos (um assunto por
  arquivo), organizados por `architecture/`, `domain/`, `conventions/`, `decisions/`.
- **Consequências**: bom para leitura humana e ótimo para chunking/embeddings. Ao evoluir o
  produto, atualizar o doc correspondente e registrar decisões relevantes como novos ADRs.
