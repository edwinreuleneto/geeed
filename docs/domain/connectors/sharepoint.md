# Conector: SharePoint

Hoje **simulado**; o objetivo é sincronizar bibliotecas do SharePoint Online
como fonte dos documentos do GED.

## Plano de integração (futuro)
1. **Auth**: Microsoft Entra ID (Azure AD) via OAuth2 / MSAL — app registration com
   permissões `Sites.Read.All` / `Files.Read.All` (elevar conforme necessidade).
2. **API**: Microsoft Graph (`/sites/{id}/drives/{id}/root/children`,
   `/drive/items/{id}`, delta queries para sync incremental).
3. **Mapeamento**: item do Graph → `GedDocument` (nome, tamanho, versões, autor).
   Permissões do SharePoint → nosso `Permission[]`.
4. **Sync**: job incremental via `delta` token; webhook opcional para near-real-time.
5. **Preview**: usar `@microsoft/mgt` ou endpoints de thumbnail do Graph.

## Estado simulado (mock)
`services/connectors` expõe: última sincronização, contagem de itens, latência,
saúde (`healthy | degraded | down`) e histórico de sync — para a tela `/conectores`.

## Onde trocar mock → real
Substituir o mock DB em `data/` por chamadas em `lib/api.ts` (`apiFetch`) apontando
a um backend/BFF que fala com o Graph. Os hooks em `services/` não mudam.
