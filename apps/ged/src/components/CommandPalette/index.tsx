"use client";

// React
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

// Next
import { useRouter } from "next/navigation";

// Libs
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  FileText,
  ShieldCheck,
  Plug,
  CornerDownLeft,
  ArrowDown,
  ArrowUp,
  Sparkles,
  LayoutDashboard,
  FolderTree,
  CheckCircle2,
  UserCog,
  UsersRound,
} from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import SecurityBadge from "@/components/SecurityBadge";

// Services
import { useDocumentsQuery } from "@/services/documents";
import { useSemanticSearch } from "@/services/search";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { CommandPaletteContextValue } from "./command-palette.types";

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null);

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) throw new Error("useCommandPalette deve ser usado dentro de CommandPaletteProvider");
  return ctx;
}

interface NavCommand {
  href: string;
  label: string;
  icon: typeof FileText;
}

const NAV_COMMANDS: NavCommand[] = [
  { href: "/inicio", label: "Ir para Visão geral", icon: LayoutDashboard },
  { href: "/documentos", label: "Ir para Documentos", icon: FileText },
  { href: "/hierarquia", label: "Ir para Hierarquia", icon: FolderTree },
  { href: "/aprovacoes", label: "Ir para Aprovações", icon: CheckCircle2 },
  { href: "/seguranca", label: "Ir para Segurança & Acesso", icon: ShieldCheck },
  { href: "/responsaveis", label: "Ir para Responsáveis", icon: UserCog },
  { href: "/times", label: "Ir para Times", icon: UsersRound },
  { href: "/conectores", label: "Ir para Conectores", icon: Plug },
];

export function CommandPaletteProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  const value = useMemo(() => ({ open, close, toggle, isOpen }), [open, close, toggle, isOpen]);

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
      <AnimatePresence>{isOpen ? <Palette onClose={close} /> : null}</AnimatePresence>
    </CommandPaletteContext.Provider>
  );
}

function Palette({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const trimmed = query.trim();
  const searching = trimmed.length > 1;

  const { data: semantic = [] } = useSemanticSearch(query, 6);
  const { data: recents = [] } = useDocumentsQuery({ sort: "recent" });

  const navMatches = useMemo(() => {
    const term = trimmed.toLowerCase();
    if (!term) return NAV_COMMANDS;
    return NAV_COMMANDS.filter((c) => c.label.toLowerCase().includes(term));
  }, [trimmed]);

  // Documentos: por contexto (IA) quando há consulta; recentes quando vazia.
  const docMatches = useMemo(
    () =>
      searching
        ? semantic.map((r) => ({ doc: r.doc, matched: r.matched }))
        : recents.slice(0, 5).map((doc) => ({ doc, matched: [] as string[] })),
    [searching, semantic, recents],
  );

  // Lista unificada para navegação por teclado.
  const items = useMemo(
    () => [
      ...navMatches.map((c) => ({ type: "nav" as const, nav: c })),
      ...docMatches.map((d) => ({ type: "doc" as const, doc: d.doc })),
    ],
    [navMatches, docMatches],
  );

  useEffect(() => {
    setActive(0);
  }, [query]);

  const go = useCallback(
    (index: number) => {
      const item = items[index];
      if (!item) return;
      if (item.type === "nav") router.push(item.nav.href);
      else router.push(`/documentos/${item.doc.id}`);
      onClose();
    },
    [items, router, onClose],
  );

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Escape") return onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, items.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      go(active);
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div
        className="absolute inset-0 bg-ink/20 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Busca de comandos"
        className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-hairline bg-surface-elevated soft-shadow-lg"
        initial={{ opacity: 0, y: -8, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.98 }}
        transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-hairline px-4">
          <Search className="h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pergunte por contexto: “multa por atraso”, “orçamento do próximo ano”…"
            className="h-12 w-full bg-transparent text-[14px] text-ink placeholder:text-ink-faint focus:outline-none"
          />
          <kbd className="hidden rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[10px] text-ink-muted md:inline-block">
            Esc
          </kbd>
        </div>

        <div className="max-h-[52vh] overflow-y-auto p-2 scrollbar-hide">
          {navMatches.length > 0 ? (
            <Section title="Navegação">
              {navMatches.map((cmd, i) => {
                const index = i;
                return (
                  <Row key={cmd.href} activeRow={active === index} onSelect={() => go(index)}>
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-50 text-brand-600">
                      <cmd.icon className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
                    </span>
                    <span className="text-[13px] text-ink">{cmd.label}</span>
                  </Row>
                );
              })}
            </Section>
          ) : null}

          {docMatches.length > 0 ? (
            <Section
              title={
                searching ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-brand-500" aria-hidden="true" />
                    Por contexto · IA
                  </span>
                ) : (
                  "Recentes"
                )
              }
            >
              {docMatches.map((item, i) => {
                const index = navMatches.length + i;
                const { doc, matched } = item;
                return (
                  <Row key={doc.id} activeRow={active === index} onSelect={() => go(index)}>
                    <DocTypeIcon kind={doc.kind} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] text-ink">{doc.name}</span>
                      {matched.length > 0 ? (
                        <span className="mt-0.5 block truncate text-[11px] text-ink-muted">
                          Relacionado a: {matched.slice(0, 4).join(", ")}
                        </span>
                      ) : null}
                    </span>
                    <SecurityBadge classification={doc.classification} />
                  </Row>
                );
              })}
            </Section>
          ) : null}

          {items.length === 0 ? (
            <p className="px-3 py-10 text-center text-[13px] text-ink-muted">
              {searching
                ? `Nada relacionado a “${trimmed}”. Tente descrever o assunto.`
                : "Comece a digitar para buscar por contexto."}
            </p>
          ) : null}
        </div>

        <div className="flex items-center gap-3 border-t border-hairline px-4 py-2 text-[11px] text-ink-muted">
          <span className="inline-flex items-center gap-1">
            <ArrowUp className="h-3 w-3" /> <ArrowDown className="h-3 w-3" /> navegar
          </span>
          <span className="inline-flex items-center gap-1">
            <CornerDownLeft className="h-3 w-3" /> abrir
          </span>
          <span className="ml-auto inline-flex items-center gap-1 text-ink-faint">
            <Sparkles className="h-3 w-3 text-brand-500" /> busca por contexto
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Section({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <div className="mb-1">
      <p className="px-3 pb-1 pt-2 text-[10px] font-medium uppercase tracking-[0.16em] text-ink-faint">
        {title}
      </p>
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  );
}

function Row({
  activeRow,
  onSelect,
  children,
}: {
  activeRow: boolean;
  onSelect: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseMove={(e) => e.currentTarget.focus()}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left transition-colors",
        activeRow ? "bg-brand-50/70" : "hover:bg-surface",
      )}
    >
      {children}
    </button>
  );
}
