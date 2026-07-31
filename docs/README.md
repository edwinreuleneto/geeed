# Base de conhecimento — GED

Documentação de engenharia deste projeto. Cada arquivo é curto e temático,
propositalmente, para servir de contexto a humanos **e** a agentes de IA/RAG no futuro.

> Convenção: um assunto por arquivo, títulos claros, exemplos concretos.
> Ao mudar uma decisão relevante, registre um ADR em `decisions/`.

## Índice

### Arquitetura
- [Visão geral](architecture/overview.md) — o que é o GED e como as peças se encaixam
- [Stack](architecture/stack.md) — tecnologias e por quê
- [Estrutura de pastas](architecture/folder-structure.md) — onde cada coisa mora
- [Integração real com a Microsoft](architecture/microsoft-integration.md) — arquitetura de referência (Graph, Entra, Syntex/Azure AI) para construir a API

### Domínio
- [Documentos](domain/documents.md) — modelo, tipos, ciclo de vida, versões, auditoria
- [Modelo de segurança](domain/security-model.md) — classificação, permissões, papéis
- [Conector SharePoint](domain/connectors/sharepoint.md) — plano de integração e status simulado

### Convenções
- [Estilo de código](conventions/code-style.md) — padrões TS/React seguidos
- [Estilo de UI](conventions/ui-style.md) — paleta, tokens, componentes, movimento

### Decisões (ADRs)
- [0001 — Monorepo com Turborepo + pnpm](decisions/0001-monorepo-turbo-pnpm.md)
- [0002 — Mock-first com camada de services](decisions/0002-mock-first.md)
- [0003 — Base de docs para IA](decisions/0003-docs-para-ia.md)
- [0004 — Integração via Microsoft Graph + BFF](decisions/0004-integracao-microsoft-graph-bff.md)
