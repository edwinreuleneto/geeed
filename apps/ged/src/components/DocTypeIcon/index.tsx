// Utils
import { cn } from "@/lib/utils";

// Types
import type { DocumentKind } from "@/types/ged";
import type { DocTypeIconProps } from "./doc-type-icon.types";

// Ícone de arquivo realista (folha com canto dobrado + faixa da extensão),
// no estilo Finder / Google Drive, com as cores de sistema da Apple.
const CONFIG: Record<DocumentKind, { color: string; ext: string }> = {
  pdf: { color: "#ff3b30", ext: "PDF" },
  docx: { color: "#0071e3", ext: "DOC" },
  xlsx: { color: "#34c759", ext: "XLS" },
  pptx: { color: "#ff9f0a", ext: "PPT" },
  image: { color: "#af52de", ext: "IMG" },
  cad: { color: "#5e5ce6", ext: "DWG" },
  other: { color: "#8e8e93", ext: "FILE" },
};

const HEIGHTS = { sm: 30, md: 38, lg: 46, xl: 60 };

export default function DocTypeIcon({ kind, size = "md", className }: DocTypeIconProps) {
  const cfg = CONFIG[kind];
  const h = HEIGHTS[size];
  const w = Math.round(h * 0.8);

  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 32 40"
      fill="none"
      className={cn("shrink-0", className)}
      role="img"
      aria-label={cfg.ext}
    >
      {/* Folha */}
      <path
        d="M9 2h13l6 6v27a3 3 0 0 1-3 3H9a3 3 0 0 1-3-3V5a3 3 0 0 1 3-3z"
        fill="#ffffff"
        stroke="rgba(0,0,0,0.12)"
        strokeWidth="1"
      />
      {/* Canto dobrado */}
      <path d="M22 2v6h6" fill="none" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <path d="M22 2l6 6h-5a1 1 0 0 1-1-1V2z" fill="rgba(0,0,0,0.05)" />
      {/* Linhas de conteúdo */}
      <rect x="10" y="13.5" width="8" height="1.6" rx="0.8" fill="rgba(0,0,0,0.10)" />
      <rect x="10" y="17" width="12" height="1.6" rx="0.8" fill="rgba(0,0,0,0.08)" />
      {/* Faixa da extensão */}
      <rect x="9" y="24" width="17" height="9" rx="2" fill={cfg.color} />
      <text
        x="17.5"
        y="30.5"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        letterSpacing="0.2"
        fill="#ffffff"
        style={{ fontFamily: "var(--font-sans)" }}
      >
        {cfg.ext}
      </text>
    </svg>
  );
}
