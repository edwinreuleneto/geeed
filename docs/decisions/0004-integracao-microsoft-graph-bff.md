# ADR 0004 — Integração real via Microsoft Graph + BFF

- **Status**: aceito (a implementar)
- **Contexto**: o produto precisa conectar de verdade ao Microsoft 365 (SharePoint, Teams,
  Entra) e à IA de documentos, mantendo a UI atual.
- **Decisão**: expor um **BFF** entre o app e o **Microsoft Graph**; autenticar com **Entra ID
  (MSAL + On-Behalf-Of)**; usar **Syntex / Azure AI Document Intelligence / Azure OpenAI /
  Azure AI Search** para a camada de IA. A troca fica restrita à camada de dados (`services/`
  → BFF), sem alterar componentes.
- **Consequências**: exige consentimento de admin, licenças (E3/E5, Syntex, Azure) e tratamento
  de throttling/DLP; em troca, cada recurso simulado passa a ter contrapartida real.
- **Detalhes**: ver [architecture/microsoft-integration.md](../architecture/microsoft-integration.md).
