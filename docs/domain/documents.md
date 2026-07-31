# Domínio: Documentos

## Modelo `GedDocument`
| Campo            | Tipo                         | Descrição |
|------------------|------------------------------|-----------|
| `id`             | string                       | Identificador estável |
| `name`           | string                       | Nome do arquivo exibido |
| `kind`           | `DocumentKind`               | pdf, docx, xlsx, pptx, image, cad, other |
| `folderId`       | string                       | Pasta/coleção onde vive |
| `classification` | `Classification`             | ver [security-model](security-model.md) |
| `status`         | `DocumentStatus`             | draft, review, approved, archived |
| `department`     | `Department`                 | Financeiro, Jurídico, RH, Comercial, Operações, TI |
| `ownerId`        | string                       | Dono (usuário) |
| `tags`           | string[]                     | Rótulos livres |
| `sizeKb`         | number                       | Tamanho aproximado |
| `source`         | `DocumentSource`             | sharepoint, upload, scan |
| `createdAt`      | string ISO                   | Criação |
| `updatedAt`      | string ISO                   | Última alteração |
| `versions`       | `DocumentVersion[]`          | Histórico (mais recente primeiro) |
| `activity`       | `ActivityEvent[]`            | Trilha de auditoria |
| `permissions`    | `Permission[]`               | Concessões por usuário/papel |
| `favorite`       | boolean                      | Marcado como favorito |

## Ciclo de vida (status)
`draft → review → approved → archived`. Um documento só é baixável por quem tem
permissão de nível `download`+ (ver modelo de segurança).

## Versões
`DocumentVersion` = `{ version, label, authorId, at, sizeKb, note }`.
Cada nova versão empilha no topo; a auditoria registra o evento `edit`.

## Auditoria
`ActivityEvent` = `{ id, actorId, action, at }` com
`action ∈ view | download | edit | share | approve | upload | permission`.
Toda tela que exibe um documento deve emitir `view` (no mock, já vem semeado).
