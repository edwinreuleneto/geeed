"use client";

// React
import { useState } from "react";

// Libs
import { ChevronLeft, ChevronRight, Download, ExternalLink, Maximize2, Minus, Plus } from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";

// Services
import { useAiInsight } from "@/services/documents";

// Data
import { getUploadUrl } from "@/data/uploads";

// Utils
import { cn } from "@/lib/utils";
import { formatDate } from "@/utils/format";
import { CLASSIFICATION } from "@/utils/labels";

// Types
import type { GedDocument } from "@/types/ged";

interface DocumentViewerProps {
  document: GedDocument;
}

// Fotos reais para os documentos do tipo imagem.
const IMAGE_URLS: Record<string, string> = {
  "d-foto-obra":
    "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
};

const BODY = [
  "O presente documento consolida as informações pertinentes ao seu objeto, estabelecendo as condições, responsabilidades e diretrizes aplicáveis. As partes reconhecem a validade das cláusulas aqui dispostas e comprometem-se ao seu fiel cumprimento.",
  "Os valores, prazos e demais parâmetros indicados neste instrumento foram apurados com base nos registros oficiais da organização e permanecem sujeitos às políticas internas de governança, segurança da informação e conformidade regulatória vigentes.",
  "Quaisquer alterações deverão ser formalizadas por aditivo próprio, devidamente aprovado pelas áreas competentes e registrado na biblioteca do SharePoint conectada, preservando-se o histórico de versões e a trilha de auditoria.",
];

export default function DocumentViewer({ document }: DocumentViewerProps) {
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const { data: insight } = useAiInsight(document.id);

  const showWatermark =
    document.classification === "confidencial" || document.classification === "restrito";
  const isImage = document.kind === "image";
  const uploadUrl = getUploadUrl(document.id);

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-[18px] bg-surface-elevated ring-1 ring-hairline">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-2 border-b border-hairline bg-surface-alt/40 px-3 py-2">
        <div className="flex items-center gap-1">
          <ToolbarButton label="Página anterior" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>
          <span className="min-w-[68px] text-center text-[12px] tabular-nums text-ink-soft">
            {page} / {document.pages}
          </span>
          <ToolbarButton
            label="Próxima página"
            disabled={page >= document.pages}
            onClick={() => setPage((p) => Math.min(document.pages, p + 1))}
          >
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>
        </div>
        <div className="flex items-center gap-1">
          <ToolbarButton label="Diminuir zoom" disabled={zoom <= 60} onClick={() => setZoom((z) => Math.max(60, z - 20))}>
            <Minus className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>
          <span className="min-w-[44px] text-center text-[12px] tabular-nums text-ink-soft">{zoom}%</span>
          <ToolbarButton label="Aumentar zoom" disabled={zoom >= 160} onClick={() => setZoom((z) => Math.min(160, z + 20))}>
            <Plus className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton label="Tela cheia" disabled>
            <Maximize2 className="h-4 w-4" aria-hidden="true" />
          </ToolbarButton>
        </div>
      </div>

      {/* Palco */}
      <div className="relative flex flex-1 items-start justify-center overflow-auto bg-[#f0f0f2] p-6 scrollbar-hide">
        {uploadUrl ? (
          // Arquivo real enviado nesta sessão.
          document.kind === "pdf" ? (
            <iframe
              src={uploadUrl}
              title={document.name}
              className="h-full min-h-[70vh] w-full max-w-[820px] rounded-[6px] bg-white shadow-[0_10px_40px_-16px_rgba(0,0,0,0.35)]"
            />
          ) : document.kind === "image" ? (
            <div className="w-full max-w-[640px]">
              <div className={cn(PAPER, "overflow-hidden p-2")}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={uploadUrl} alt={document.name} className="w-full rounded-[3px] object-contain" />
                <p className="px-1 py-2 text-[11px] text-neutral-500">{document.name}</p>
              </div>
            </div>
          ) : (
            <UploadFallback url={uploadUrl} document={document} />
          )
        ) : (
        <div
          className="relative w-full max-w-[560px] origin-top transition-transform duration-200"
          style={{ transform: `scale(${zoom / 100})` }}
        >
          {isImage ? (
            <ImagePreview document={document} />
          ) : document.kind === "xlsx" ? (
            <SpreadsheetPreview document={document} />
          ) : (
            <TextPreview document={document} summary={insight?.summary} highlights={insight?.highlights ?? []} />
          )}

          {showWatermark && !isImage ? (
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center" aria-hidden="true">
              <span
                className={cn(
                  "select-none text-[44px] font-bold uppercase tracking-[0.2em] opacity-[0.06]",
                  document.classification === "restrito" ? "text-rose-900" : "text-amber-900",
                )}
                style={{ transform: "rotate(-24deg)" }}
              >
                {CLASSIFICATION[document.classification].label}
              </span>
            </span>
          ) : null}
        </div>
        )}
      </div>
    </div>
  );
}

function ToolbarButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="flex h-8 w-8 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-black/[0.06] hover:text-ink disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}

const PAPER =
  "rounded-[6px] bg-white text-neutral-800 shadow-[0_10px_40px_-16px_rgba(0,0,0,0.35)]";

function TextPreview({
  document,
  summary,
  highlights,
}: {
  document: GedDocument;
  summary?: string;
  highlights: string[];
}) {
  const title = document.name.replace(/\.[a-z0-9]+$/i, "");
  const isContract = document.folderId === "f-contratos";

  return (
    <div className={cn(PAPER, "px-12 py-14")}>
      <div className="mb-8 flex items-center justify-between border-b border-neutral-200 pb-3 text-[10px] uppercase tracking-[0.12em] text-neutral-400">
        <span>{document.department}</span>
        <span>{formatDate(document.updatedAt)}</span>
      </div>

      <h1 className="text-[19px] font-semibold leading-tight text-neutral-900">{title}</h1>
      <p className="mt-1 text-[11px] text-neutral-400">
        Versão {document.versions[0]?.version ?? "v1"} · {document.department}
      </p>

      {summary ? (
        <p className="mt-6 text-[12.5px] leading-relaxed text-neutral-700">{summary}</p>
      ) : null}

      <p className="mt-4 text-[12.5px] leading-relaxed text-neutral-700">{BODY[0]}</p>

      {highlights.length > 0 ? (
        <div className="mt-5">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-neutral-500">
            {isContract ? "Cláusulas principais" : "Pontos principais"}
          </p>
          <ol className="flex flex-col gap-2 text-[12.5px] leading-relaxed text-neutral-700">
            {highlights.map((h, i) => (
              <li key={h} className="flex gap-2">
                <span className="font-semibold text-neutral-500">{i + 1}.</span>
                <span>{h}</span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <p className="mt-5 text-[12.5px] leading-relaxed text-neutral-700">{BODY[1]}</p>
      <p className="mt-4 text-[12.5px] leading-relaxed text-neutral-700">{BODY[2]}</p>

      {isContract ? (
        <div className="mt-12 grid grid-cols-2 gap-8">
          {["Contratante", "Contratada"].map((role) => (
            <div key={role}>
              <div className="h-9 border-b border-neutral-400" />
              <p className="mt-1 text-[10px] uppercase tracking-wide text-neutral-400">{role}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function SpreadsheetPreview({ document }: { document: GedDocument }) {
  const cols = ["Item", "Qtde", "Valor unit.", "Impostos", "Total"];
  const rows = Array.from({ length: 12 }).map((_, i) => {
    const qtde = 3 + ((i * 7) % 20);
    const unit = 120 + ((i * 53) % 900);
    const impostos = Math.round(unit * qtde * 0.18);
    const total = unit * qtde + impostos;
    return {
      item: `${document.department.slice(0, 3).toUpperCase()}-${1000 + i}`,
      qtde,
      unit,
      impostos,
      total,
    };
  });
  const fmt = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  const grand = rows.reduce((s, r) => s + r.total, 0);

  return (
    <div className={cn(PAPER, "overflow-hidden p-0")}>
      <div className="flex items-center justify-between border-b border-neutral-200 px-4 py-2.5">
        <span className="text-[12px] font-semibold text-neutral-700">
          {document.name.replace(/\.[a-z0-9]+$/i, "")}
        </span>
        <span className="text-[10px] text-neutral-400">Planilha · {document.department}</span>
      </div>
      <table className="w-full border-collapse text-[11px]">
        <thead>
          <tr className="bg-emerald-50 text-emerald-800">
            {cols.map((c) => (
              <th key={c} className="border border-neutral-200 px-2.5 py-1.5 text-left font-semibold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.item} className="text-neutral-700 odd:bg-white even:bg-neutral-50/60">
              <td className="border border-neutral-200 px-2.5 py-1.5 font-mono text-[10.5px]">{r.item}</td>
              <td className="border border-neutral-200 px-2.5 py-1.5 tabular-nums">{r.qtde}</td>
              <td className="border border-neutral-200 px-2.5 py-1.5 tabular-nums">{fmt(r.unit)}</td>
              <td className="border border-neutral-200 px-2.5 py-1.5 tabular-nums">{fmt(r.impostos)}</td>
              <td className="border border-neutral-200 px-2.5 py-1.5 text-right font-medium tabular-nums">
                {fmt(r.total)}
              </td>
            </tr>
          ))}
          <tr className="bg-neutral-100 font-semibold text-neutral-800">
            <td className="border border-neutral-200 px-2.5 py-1.5" colSpan={4}>
              Total geral
            </td>
            <td className="border border-neutral-200 px-2.5 py-1.5 text-right tabular-nums">{fmt(grand)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Arquivo enviado que o navegador não pré-visualiza nativamente (docx, xlsx, pptx…).
function UploadFallback({ url, document }: { url: string; document: GedDocument }) {
  return (
    <div className="w-full max-w-[440px]">
      <div className={cn(PAPER, "flex flex-col items-center gap-4 px-8 py-12 text-center")}>
        <DocTypeIcon kind={document.kind} size="xl" />
        <div>
          <p className="text-[15px] font-semibold text-neutral-800">{document.name}</p>
          <p className="mt-1 text-[12.5px] leading-relaxed text-neutral-500">
            Este tipo de arquivo não é pré-visualizado no navegador. Abra ou baixe o arquivo
            enviado — no ambiente real, abriria direto no Microsoft 365.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 items-center gap-2 rounded-full bg-neutral-900 px-4 text-[13px] font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Abrir arquivo
          </a>
          <a
            href={url}
            download={document.name}
            className="flex h-9 items-center gap-2 rounded-full border border-neutral-200 px-4 text-[13px] font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            Baixar
          </a>
        </div>
      </div>
    </div>
  );
}

function ImagePreview({ document }: { document: GedDocument }) {
  const url = IMAGE_URLS[document.id];
  return (
    <div className={cn(PAPER, "overflow-hidden p-2")}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={document.name} className="w-full rounded-[3px] object-cover" />
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center rounded-[3px] bg-neutral-100 text-neutral-400">
          Sem pré-visualização
        </div>
      )}
      <p className="px-1 py-2 text-[11px] text-neutral-500">{document.name}</p>
    </div>
  );
}
