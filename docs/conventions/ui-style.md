# Estilo de UI

DNA visual compartilhado com o Nota: **warm, suave, refinado** — e, por decisão do produto,
deliberadamente **contido e leve** (evitar "cara de layout gerado por IA").

## Princípios de contenção (importante)
- **Cor com parcimônia**: superfícies e texto em tons neutros; cor só onde carrega significado
  (classificação de sigilo, tipo de arquivo, estado). Nada de gradientes decorativos.
- **Avatares achatados**: inicial sobre tinta suave sólida (`bg-*-100 text-*-700`), sem gradiente.
- **Sombra mínima**: preferir `border-hairline`; sombra só no hover ou em elementos flutuantes (modais).
- **Sem brilhos**: as utilities `surface-aurora*` existem mas **não são usadas** nas telas; ficam
  como recurso opcional. Evitar.
- **Um sinal por vez**: não empilhar vários badges coloridos; status é ponto + texto neutro.
- **Ar e tipografia**: hierarquia por peso/cor de texto e espaçamento, não por blocos coloridos.

## Tokens (definidos em `styles/globals.css` via `@theme`)
- **Superfícies**: `surface` (#f6f2ea creme), `surface-alt`, `surface-elevated` (branco).
- **Tinta (texto)**: `ink`, `ink-soft`, `ink-muted`, `ink-faint`.
- **Marca**: `brand-50…900` (índigo). **Acento**: `peach-*`.
- **Hairlines**: `hairline`, `hairline-strong` (bordas quase invisíveis).

## Utilitários próprios
- `soft-shadow`, `soft-shadow-lg` — sombras difusas e quentes.
- `surface-aurora` + `surface-aurora-bg` — brilho gradiente sutil de fundo.
- `animate-ping-soft`, `animate-halo-pulse`, `scrollbar-hide`.

## Componentes: princípios
- Cantos arredondados (`rounded-lg`/`xl`), bordas `border-hairline`, fundo branco elevado.
- Ícones `lucide-react` com `strokeWidth` ~1.75–2, tamanho ~3.5 (h-3.5).
- Badges com ponto colorido + rótulo; `animate-ping-soft` para estados "vivos".

## Movimento (Framer Motion)
- Transições curtas (150–250ms), `ease-out`. Nada de bounce exagerado.
- Preferir `opacity`/`translate` pequenos. Respeitar `prefers-reduced-motion`.

## Classificação → cor (consistência)
`publico`=esmeralda · `interno`=brand · `confidencial`=âmbar · `restrito`=rosa.
