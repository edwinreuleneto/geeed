# GED — Gestão Eletrônica de Documentos

Plataforma de GED conectada ao ecossistema **Microsoft 365 / SharePoint**, com
**IA** (resumo, extração de metadados e busca por contexto), visualização de
documentos, segurança/permissões, times e dashboard executivo.

> Monorepo **Turborepo + pnpm**. App em `apps/ged` (Next.js 16 · React 19 ·
> Tailwind v4 · TanStack Query · Framer Motion). Estética Apple (light).

## Rodando localmente

```bash
pnpm install
pnpm dev        # abre em http://localhost:3002
```

Outros scripts: `pnpm build`, `pnpm typecheck`, `pnpm lint`.

## Estrutura

```
apps/ged/           aplicação Next.js (App Router)
packages/ui         componentes compartilhados (@ged/ui)
packages/lib        utilitários (@ged/lib: cn, removeEmpty)
packages/config     tsconfigs base/nextjs/react-library (@ged/config)
docs/               base de conhecimento (arquitetura, domínio, decisões)
```

Detalhes em [`docs/`](docs/README.md).

## Recursos

- Biblioteca com navegação estilo *source list* (macOS), pastas, filtros e busca.
- **Command palette (⌘K)** com **busca por contexto (IA/semântica)**.
- Visualizador de documentos (conteúdo real: contrato, planilha, imagem) com
  versões, permissões e trilha de auditoria.
- **IA por documento**: resumo, destaques, tags e Q&A.
- **Metadados** estilo colunas/content types do SharePoint, extraídos por IA
  (com % de confiança) e entidades reconhecidas — alimentam alertas de vencimento.
- **Segurança & Acesso**, **Conectores (SharePoint)** e **Times (Microsoft Teams)**.
- Dashboard executivo (classificação, armazenamento, pessoas, atividade, vencimentos).
- **Upload funcional temporário** (em memória na sessão) com pré-visualização real.

> Os dados são **mock em memória** (`apps/ged/src/data`), servidos por uma camada
> de `services/` desenhada como API assíncrona — a troca por SharePoint (Microsoft
> Graph) fica restrita a essa camada.

## Deploy na Vercel

Este é um monorepo pnpm/Turborepo. Configuração recomendada no painel da Vercel:

- **Root Directory**: `apps/ged` (marque *Include files outside of the Root
  Directory* — a Vercel ativa automaticamente para monorepos).
- **Framework Preset**: Next.js (detecta sozinho).
- **Install Command**: `pnpm install` (padrão).
- **Build Command**: `next build` (padrão).
- **Output**: `.next` (padrão).

O `next build` roda o `typecheck` (TypeScript) e passa limpo. No Next 16 o ESLint
não roda no `build`, então não bloqueia o deploy.
