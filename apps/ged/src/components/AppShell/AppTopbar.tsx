"use client";

// Next
import { usePathname } from "next/navigation";

// Libs
import { Menu, Search } from "lucide-react";

// Components
import { useCommandPalette } from "@/components/CommandPalette";

// Utils
import { cn } from "@/lib/utils";

const SECTION_LABEL: { match: (p: string) => boolean; label: string }[] = [
  { match: (p) => p.startsWith("/inicio"), label: "Visão geral" },
  { match: (p) => p.startsWith("/documentos"), label: "Documentos" },
  { match: (p) => p.startsWith("/hierarquia"), label: "Hierarquia" },
  { match: (p) => p.startsWith("/aprovacoes"), label: "Aprovações" },
  { match: (p) => p.startsWith("/seguranca"), label: "Segurança & Acesso" },
  { match: (p) => p.startsWith("/responsaveis"), label: "Responsáveis" },
  { match: (p) => p.startsWith("/times"), label: "Times" },
  { match: (p) => p.startsWith("/conectores"), label: "Conectores" },
];

interface AppTopbarProps {
  onMenu: () => void;
}

export default function AppTopbar({ onMenu }: AppTopbarProps) {
  const pathname = usePathname() ?? "";
  const { open } = useCommandPalette();
  const section = SECTION_LABEL.find((s) => s.match(pathname))?.label ?? "GED";

  return (
    <header className="glass sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-hairline px-4 md:px-8">
      <button
        type="button"
        onClick={onMenu}
        aria-label="Abrir navegação"
        className="flex h-9 w-9 items-center justify-center rounded-lg text-ink-soft transition-colors hover:bg-surface md:hidden"
      >
        <Menu className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="flex min-w-0 items-center gap-2">
        <span className="truncate text-[13px] font-medium text-ink-soft">{section}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          type="button"
          onClick={open}
          className={cn(
            "flex h-9 items-center gap-2 rounded-full border border-hairline bg-surface-elevated/70 pl-3 pr-2.5 text-[13px] text-ink-faint transition-colors hover:border-hairline-strong",
          )}
        >
          <Search className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">Buscar</span>
          <kbd className="hidden rounded border border-hairline bg-surface px-1 font-mono text-[10px] text-ink-muted sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
}
