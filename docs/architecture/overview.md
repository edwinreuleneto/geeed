# Visão geral

O **GED** é uma plataforma de Gestão Eletrônica de Documentos. Objetivo do produto:
guardar, organizar, visualizar e **controlar quem acessa** documentos corporativos,
com trilha de auditoria e versões — e, no futuro, sincronizar com o **SharePoint**.

## Princípios de produto
- **Leve e suave**: navegação instantânea, transições curtas, zero travamento.
- **Segurança em primeiro lugar**: todo documento tem classificação e permissões explícitas.
- **Rastreável**: cada visualização, download e edição vira evento de auditoria.
- **Pronto para conectar**: a camada de dados é desenhada como se já falasse com uma API
  externa (SharePoint), mesmo estando em mock hoje.

## Peças principais
- **Biblioteca** (`/documentos`): pastas + grade/lista de documentos, busca e filtros.
- **Visualizador** (`/documentos/[docId]`): preview, metadados, permissões, versões, auditoria.
- **Segurança** (`/seguranca`): visão de classificação e gestão de acesso.
- **Conectores** (`/conectores`): saúde e status do sync com SharePoint.
- **Command palette (⌘K)**: busca e navegação por teclado em qualquer tela.

## Fluxo de dados (hoje)
`componentes → hooks do React Query (services/) → mock DB em memória (data/)`.
Amanhã, basta trocar o mock DB por `apiFetch` (lib/api.ts) apontando ao SharePoint.
