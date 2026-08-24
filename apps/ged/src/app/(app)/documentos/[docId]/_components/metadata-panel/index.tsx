"use client";

// React
import { useState } from "react";

// Libs
import {
  Archive,
  BarChart3,
  Building2,
  Calendar,
  CalendarClock,
  ChevronDown,
  CircleDollarSign,
  FileSignature,
  FileText,
  GitBranch,
  HardDrive,
  Hash,
  Link as LinkIcon,
  Percent,
  Receipt,
  ShieldCheck,
  Sparkles,
  Tag,
  TrendingUp,
  UserRound,
  Users,
  type LucideIcon,
} from "lucide-react";

// Services
import { useDocumentMetadata } from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";

// Types
import type { MetaField } from "@/types/ged";

const ICONS: Record<string, LucideIcon> = {
  FileSignature,
  Building2,
  Hash,
  CircleDollarSign,
  CalendarClock,
  Calendar,
  TrendingUp,
  Archive,
  BarChart3,
  GitBranch,
  UserRound,
  Receipt,
  Percent,
  ShieldCheck,
  Users,
  Link: LinkIcon,
  FileText,
  Tag,
  HardDrive,
};

interface MetadataPanelProps {
  docId: string;
  now: number;
  defaultOpen?: boolean;
}

export default function MetadataPanel({ docId, now, defaultOpen = false }: MetadataPanelProps) {
  const { data: meta } = useDocumentMetadata(docId);
  const [open, setOpen] = useState(defaultOpen);
  if (!meta) return null;

  const { entities } = meta;
  const hasEntities =
    entities.people.length > 0 ||
    entities.organizations.length > 0 ||
    entities.dates.length > 0 ||
    entities.amounts.length > 0 ||
    entities.identifiers.length > 0;

  return (
    <section className="overflow-hidden rounded-[18px] bg-surface-elevated ring-1 ring-hairline">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-surface/60"
      >
        <h2 className="text-[13.5px] font-semibold text-ink">Metadados</h2>
        <span className="rounded-full bg-surface-alt px-2 py-0.5 text-[11px] font-medium text-ink-muted">
          {meta.contentType}
        </span>
        <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-brand-600">
          <Sparkles className="h-3 w-3" aria-hidden="true" />
          {meta.aiFieldsFilled} por IA
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 text-ink-faint transition-transform", open ? "" : "-rotate-90")}
          aria-hidden="true"
        />
      </button>

      {open ? (
      <>
      <ul className="flex flex-col border-t border-hairline px-4">
        {meta.fields.map((field) => (
          <FieldRow key={field.key} field={field} />
        ))}
      </ul>

      {hasEntities ? (
        <div className="border-t border-hairline px-4 py-3.5">
          <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            <Sparkles className="h-3 w-3 text-brand-500" aria-hidden="true" />
            Entidades reconhecidas
          </p>
          <div className="flex flex-col gap-2.5">
            <EntityRow label="Pessoas" items={entities.people} />
            <EntityRow label="Organizações" items={entities.organizations} />
            <EntityRow label="Datas" items={entities.dates.map((d) => `${d.label}: ${d.value}`)} />
            <EntityRow label="Valores" items={entities.amounts.map((a) => `${a.label}: ${a.value}`)} tone="emerald" />
            <EntityRow label="Identificadores" items={entities.identifiers.map((i) => `${i.label}: ${i.value}`)} mono />
          </div>
        </div>
      ) : null}

      <p className="border-t border-hairline px-4 py-2.5 text-[11px] text-ink-faint">
        Extraído por IA · {formatRelative(meta.extractedAt, now)} · confira antes de decisões críticas.
      </p>
      </>
      ) : null}
    </section>
  );
}

function FieldRow({ field }: { field: MetaField }) {
  const Icon = (field.icon && ICONS[field.icon]) || FileText;
  const isAi = field.source === "ai";

  return (
    <li className="flex items-center gap-3 border-b border-hairline py-2.5 last:border-0">
      <span
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
          isAi ? "bg-brand-50 text-brand-600" : "bg-surface-alt text-ink-faint",
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[11.5px] text-ink-muted">{field.label}</p>
        <p className="truncate text-[13.5px] font-medium text-ink" title={field.value}>
          {field.value}
        </p>
      </div>
      {isAi ? (
        <span
          className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10.5px] font-medium text-brand-700"
          title={`Extraído por IA · ${Math.round((field.confidence ?? 0) * 100)}% de confiança`}
        >
          <Sparkles className="h-2.5 w-2.5" aria-hidden="true" />
          {Math.round((field.confidence ?? 0) * 100)}%
        </span>
      ) : (
        <span className="shrink-0 text-[10.5px] text-ink-faint">
          {field.source === "manual" ? "manual" : "sistema"}
        </span>
      )}
    </li>
  );
}

function EntityRow({
  label,
  items,
  mono,
  tone,
}: {
  label: string;
  items: string[];
  mono?: boolean;
  tone?: "emerald";
}) {
  if (items.length === 0) return null;
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[10.5px] font-medium uppercase tracking-wide text-ink-faint">{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {items.map((it) => (
          <span
            key={it}
            className={cn(
              "rounded-md px-2 py-0.5 text-[11.5px]",
              tone === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-surface-alt text-ink-soft",
              mono && "font-mono text-[11px]",
            )}
          >
            {it}
          </span>
        ))}
      </div>
    </div>
  );
}
