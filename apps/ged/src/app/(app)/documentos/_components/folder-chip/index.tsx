"use client";

// Libs
import {
  BarChart3,
  FileSignature,
  LayoutGrid,
  Receipt,
  Ruler,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Mapeia o nome do ícone (string vinda do mock) para o componente lucide.
const ICONS: Record<string, LucideIcon> = {
  LayoutGrid,
  FileSignature,
  Receipt,
  Users,
  BarChart3,
  Ruler,
  ShieldCheck,
};

interface FolderChipProps {
  active: boolean;
  name: string;
  description: string;
  icon: string;
  accent: { bg: string; text: string };
  onClick: () => void;
}

export default function FolderChip({
  active,
  name,
  description,
  icon,
  accent,
  onClick,
}: FolderChipProps) {
  const Icon = ICONS[icon] ?? LayoutGrid;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "group flex min-w-[160px] shrink-0 items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-colors",
        active
          ? "border-hairline-strong bg-surface-elevated"
          : "border-transparent bg-surface-alt/50 hover:bg-surface-alt",
      )}
    >
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
          active ? `${accent.bg} ${accent.text}` : "bg-surface-elevated text-ink-faint",
        )}
      >
        <Icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 leading-tight">
        <span className={cn("block truncate text-[12.5px]", active ? "font-semibold text-ink" : "font-medium text-ink-soft")}>
          {name}
        </span>
        <span className="block truncate text-[10.5px] text-ink-muted">{description}</span>
      </span>
    </button>
  );
}
