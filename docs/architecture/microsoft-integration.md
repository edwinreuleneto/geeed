# Integração real com a Microsoft (arquitetura de referência)

Guia para transformar o protótipo (mock) em produto conectado ao **Microsoft 365 /
SharePoint / Teams**, com IA. Serve de base para a construção da API (BFF).

> Princípio de projeto: o app é **mock-first** e toda leitura de dados passa por
> `apps/ged/src/services/*`, que hoje batem em `data/*`. A virada para o real é
> trocar essa fonte por chamadas ao **Microsoft Graph** via um BFF — **sem alterar a UI**.

---

## 1. Arquitetura de referência

```
┌──────────────┐   HTTPS/JSON   ┌───────────────┐   Graph/REST   ┌──────────────────────┐
│  App Next.js │ ─────────────▶ │   BFF / API   │ ─────────────▶ │  Microsoft Graph      │
│ (services/)  │ ◀───────────── │ (Node/.NET)   │ ◀───────────── │  + Azure AI services  │
└──────────────┘                └───────────────┘                └──────────────────────┘
        │  MSAL (login/token)          │  token cache, throttling,          │
        └──────────────────────────────┘  cache, webhooks, jobs de sync ────┘
```

- **App**: mantém a experiência atual; consome o BFF pelos mesmos hooks de `services/`.
- **BFF**: guarda segredos do app, faz *token exchange* (On-Behalf-Of), cache, tratamento de
  *throttling*, agrega chamadas do Graph e expõe endpoints simples ao front.
- **Graph + Azure**: fonte de verdade (SharePoint/Teams/Entra) e serviços de IA.

---

## 2. Autenticação e autorização (Microsoft Entra ID)

- **App registration** no Entra ID (client id/secret ou certificado).
- **MSAL** no front (login) → token; BFF usa **On-Behalf-Of** para chamar o Graph com o
  contexto do usuário (**delegado**) e um fluxo **app-only** (client credentials) para o
  **sync em background**.
- **Escopos** (menor privilégio; a maioria exige **consentimento de admin**):
  - `User.Read`, `User.Read.All`, `People.Read` (perfil/fotos)
  - `Sites.Read.All` / `Sites.ReadWrite.All`, `Files.Read.All` / `Files.ReadWrite.All`
  - `Group.Read.All`, `Team.ReadBasic.All`, `Channel.ReadBasic.All`
  - `AuditLog.Read.All` (auditoria) · `InformationProtectionPolicy.Read` (rótulos)

---

## 3. Mapa: recurso do produto → serviço Microsoft

| Recurso (tela) | Serviço / API real | Observações |
|---|---|---|
| Login / conta | Entra ID + MSAL (OAuth2/OIDC) | Padrão |
| Biblioteca, pastas, arquivos | Graph `drives` / `driveItems` | Core |
| Versões | Graph `/items/{id}/versions` | |
| Upload | Graph `PUT /content` ou *upload session* | >4MB usa session |
| Preview de documento | Graph `/items/{id}/preview` (WOPI/Office Online) + `/thumbnails` | Office preview exige M365 |
| Download | `@microsoft.graph.downloadUrl` ou `/content` | |
| Permissões / compartilhar | Graph `/items/{id}/permissions`, `/createLink` | |
| Classificação / sigilo | **Purview / MIP** sensitivity labels | Governança |
| Times / canais / membros | Graph `/teams`, `/groups`, `/channels`, `/filesFolder` | Canal ↔ pasta |
| Fotos de pessoas | Graph `/users/{id}/photo/$value` | |
| Metadados (colunas/content types) | SharePoint columns/content types + **term store** via Graph | Força do SharePoint |
| Auditoria | **Purview audit** / Graph `/drive/activities` | |
| Sync incremental / tempo real | Graph **delta** + **webhooks** (`/subscriptions`) | |
| Vencimentos / retenção | **Purview** retention labels + alertas | |

---

## 4. Endpoints do Graph por tela (roteiro para a API)

- **Documentos (lista/pastas)**
  `GET /sites/{siteId}/drive/root/children` · filtro por pasta: `/items/{folderId}/children`
  · busca: `/drive/root/search(q='...')`
- **Detalhe do documento**
  `GET /drive/items/{id}` · versões `/versions` · permissões `/permissions`
  · preview `/preview` · thumbnails `/thumbnails` · metadados `listItem/fields`
- **Segurança & Acesso**
  Permissões por item + rótulos de sensibilidade (Purview) · relatório agregado no BFF.
- **Times**
  `GET /me/joinedTeams` → por time: `/teams/{id}/channels`, `/groups/{id}/members`,
  `/teams/{id}/channels/{cid}/filesFolder`, `/groups/{id}` (visibilidade, rótulo, convidados).
- **Conectores / status**
  Saúde = validade do token + ping ao Graph · última sync = estado do job de delta.
- **Dashboard**
  Agregações no BFF a partir das chamadas acima (contagens, storage via `/drive` quota,
  atividade via `/drive/activities`, vencimentos via metadados).
- **Upload**
  Pequeno: `PUT /items/{parent}:/{nome}:/content` · grande: `POST .../createUploadSession`.

---

## 5. Camada de IA (o "trabalho leve nos docs")

| Capacidade (no app) | Produto Microsoft / Azure | Uso |
|---|---|---|
| Extração de metadados, classificação, OCR | **Microsoft Syntex (SharePoint Premium)** ou **Azure AI Document Intelligence** | Lê o conteúdo → preenche colunas/entidades com confiança |
| Resumo, destaques, tags, Q&A | **Azure OpenAI** (GPT) + RAG sobre o conteúdo | Painel "Resumo inteligente" |
| Busca por contexto (semântica) | **Azure AI Search** (vetorial/semântica) ou **índice do M365 Copilot** | ⌘K "por contexto" |
| Entidades reconhecidas | Document Intelligence / OpenAI (extração estruturada) | Painel de metadados |

Fluxo típico: no **upload/sync**, dispara pipeline → OCR/Document Intelligence → extração de
campos → (opcional) OpenAI para resumo/tags → grava metadados nas colunas do SharePoint e
indexa no Azure AI Search para a busca semântica.

---

## 6. Sync (incremental e tempo real)

- **Delta**: job app-only chama `/drive/root/delta` com *delta token*; processa só o que mudou.
- **Webhooks**: `POST /subscriptions` em `drive/root` para notificação *near-real-time*;
  renovar antes de expirar; validar `clientState`.
- **Estado** exposto ao front: última sync, itens sincronizados, latência, saúde.

---

## 7. Licenciamento

- **Microsoft 365 E3/E5** (SharePoint/Teams/Purview).
- **Syntex / SharePoint Premium** (por uso ou por usuário) para a IA de documentos.
- **Azure** por consumo: **OpenAI**, **AI Search**, **AI Document Intelligence**.

---

## 8. Governança e limitações (atenção)

- **Consentimento de admin** e escopos de menor privilégio.
- **Throttling** do Graph (429 + `Retry-After`): backoff no BFF, cache, `$select`/`$batch`.
- **DLP / rótulos de sensibilidade** podem bloquear ações — respeitar no fluxo.
- **Preview de Office** e **IA** dependem de produtos pagos (não são "grátis" como no mock).
- **Residência de dados / compliance** conforme o tenant do cliente.

---

## 9. Plano de migração (a partir do mock)

Trocar apenas a fonte de dados; a UI e os hooks continuam:

1. `apps/ged/src/lib/api.ts` já é o cliente HTTP → apontar para o BFF (`/api/proxy`).
2. Reescrever `apps/ged/src/services/*` para chamar o BFF em vez de `db` (`data/*`).
3. Aposentar `apps/ged/src/data/*` (mock) — os **tipos** em `types/ged.ts` viram os
   contratos da API (DTOs), mapeando 1:1 com o Graph no BFF.
4. Auth: adicionar MSAL no app + fluxo OBO no BFF.

---

## 10. Esforço aproximado

- **MVP real** (login + navegar + upload + preview + permissões + Times): ~**3–5 semanas**.
- **+ Metadados (Syntex/Doc Intelligence) + busca semântica (Azure AI Search)**: +algumas
  semanas, incluindo tuning de modelos e pipeline de indexação.

---

## Referências

- Microsoft Graph — Files/Drives, Sites, Teams, Subscriptions, Permissions
- Microsoft Entra ID (MSAL, On-Behalf-Of)
- Microsoft Syntex / SharePoint Premium
- Azure AI Document Intelligence · Azure OpenAI · Azure AI Search · Microsoft Purview

Ver também [`docs/domain/connectors/sharepoint.md`](../domain/connectors/sharepoint.md).
