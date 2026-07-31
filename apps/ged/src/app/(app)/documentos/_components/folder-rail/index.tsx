"use client";

// Libs
import {
  BarChart3,
  FileSignature,
  LayoutGrid,
  Receipt,
  Ruler,
  ShieldCheck,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { Folder } from "@/types/ged";

const ICONS: Record<string, LucideIcon> = {
  FileSignature,
  Receipt,
  Users,
  BarChart3,
  Ruler,
  ShieldCheck,
};

export type RailSelection = { type: "all" } | { type: "favorites" } | { type: "folder"; id: string };

interface FolderRailProps {
  folders: Folder[];
  counts: Record<string, number>;
  totalCount: number;
  favoritesCount: number;
  selection: RailSelection;
  onSelect: (selection: RailSelection) => void;
}

export default function FolderRail({
  folders,
  counts,
  totalCount,
  favoritesCount,
  selection,
  onSelect,
}: FolderRailProps) {
  return (
    <aside className="hidden w-52 shrink-0 lg:block">
      <div className="sticky top-20 flex flex-col gap-0.5">
        <RailItem
          icon={LayoutGrid}
          label="Todos os documentos"
          count={totalCount}
          active={selection.type === "all"}
          onClick={() => onSelect({ type: "all" })}
        />
        <RailItem
          icon={Star}
          label="Favoritos"
          count={favoritesCount}
          active={selection.type === "favorites"}
          onClick={() => onSelect({ type: "favorites" })}
        />

        <p className="px-2 pb-1 pt-4 text-[10px] font-medium uppercase tracking-[0.14em] text-ink-faint">
          Pastas
        </p>

        {folders.map((folder) => {
          const Icon = ICONS[folder.icon] ?? LayoutGrid;
          return (
            <RailItem
              key={folder.id}
              icon={Icon}
              label={folder.name}
              count={counts[folder.id] ?? 0}
              active={selection.type === "folder" && selection.id === folder.id}
              onClick={() => onSelect({ type: "folder", id: folder.id })}
            />
          );
        })}
      </div>
    </aside>
  );
}

function RailItem({
  icon: Icon,
  label,
  count,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "true" : undefined}
      className={cn(
        "group flex h-8 items-center gap-2.5 rounded-lg px-2 text-left text-[13px] transition-colors",
        active ? "bg-surface-elevated font-medium text-ink soft-shadow" : "text-ink-soft hover:bg-surface-elevated/60",
      )}
    >
      <Icon
        className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-ink-faint")}
        strokeWidth={1.9}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate">{label}</span>
      <span className={cn("text-[11px] tabular-nums", active ? "text-ink-muted" : "text-ink-faint")}>
        {count}
      </span>
    </button>
  );
}
