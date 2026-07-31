"use client";

// React
import { Suspense, useState } from "react";

// Next
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";

// Libs
import {
  BarChart3,
  ChevronDown,
  ChevronRight,
  ChevronsUpDown,
  FileSignature,
  FolderOpen,
  Layers,
  LayoutDashboard,
  Plug,
  Receipt,
  Ruler,
  Search,
  ShieldCheck,
  Star,
  Users,
  UsersRound,
  type LucideIcon,
} from "lucide-react";

// Components
import UserAvatar from "@/components/UserAvatar";
import MicrosoftLogo from "@/components/MicrosoftLogo";
import { useCommandPalette } from "@/components/CommandPalette";

// Services
import { useCurrentUserQuery, useDocumentsQuery, useFoldersQuery } from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";

const FOLDER_ICONS: Record<string, LucideIcon> = {
  FileSignature,
  Receipt,
  Users,
  BarChart3,
  Ruler,
  ShieldCheck,
};

export default function Sidebar() {
  return (
    <nav
      aria-label="Navegação principal"
      className="glass relative flex h-full w-[264px] shrink-0 flex-col overflow-hidden border-r border-hairline"
    >
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarInner />
      </Suspense>
    </nav>
  );
}

function SidebarInner() {
  const pathname = usePathname() ?? "";
  const params = useSearchParams();
  const { open } = useCommandPalette();
  const { data: user } = useCurrentUserQuery();
  const { data: folders = [] } = useFoldersQuery();
  const { data: allDocs = [] } = useDocumentsQuery({ sort: "recent" });

  const onDocs = pathname.startsWith("/documentos");
  const [docsOpen, setDocsOpen] = useState(onDocs);
  const pasta = params.get("pasta");
  const fav = params.get("fav") === "1";
  const docsExpanded = docsOpen || onDocs;

  const counts: Record<string, number> = {};
  for (const d of allDocs) counts[d.folderId] = (counts[d.folderId] ?? 0) + 1;
  const favCount = allDocs.filter((d) => d.favorite).length;

  const docsAllActive = pathname === "/documentos" && !pasta && !fav;

  return (
    <>
      {/* Brand */}
      <div className="relative flex items-start gap-3 px-4 pt-4 pb-3">
        <button
          type="button"
          className="group flex w-full items-center gap-3 rounded-xl px-1.5 py-1.5 text-left transition-colors hover:bg-black/[0.04]"
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[11px] text-[15px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
            style={{ backgroundImage: "linear-gradient(140deg, #0a84ff 0%, #0071e3 55%, #0058b0 100%)" }}
          >
            C
          </span>
          <span className="flex min-w-0 flex-1 flex-col items-start leading-none">
            <span className="text-[15px] font-semibold tracking-tight text-ink">Campolongo</span>
            <span className="mt-1 text-[12px] text-ink-muted">GED · Microsoft 365</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-ink-faint transition-colors group-hover:text-ink-soft" aria-hidden="true" />
        </button>
      </div>

      {/* Busca */}
      <div className="relative px-4 pb-4">
        <button
          type="button"
          onClick={open}
          className="relative flex h-9 w-full items-center gap-2 rounded-[10px] bg-black/[0.05] pl-8 pr-9 text-left text-[13.5px] text-ink-muted transition-colors hover:bg-black/[0.07]"
        >
          <Search
            className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          Buscar
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 text-[12px] font-medium text-ink-faint md:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Source list */}
      <div className="relative flex-1 overflow-y-auto px-3 scrollbar-hide">
        <ul className="flex flex-col gap-0.5">
          <NavRow
            href="/inicio"
            icon={LayoutDashboard}
            label="Visão geral"
            active={pathname.startsWith("/inicio")}
          />

          {/* Documentos — grupo com divulgação */}
          <li>
            <div
              className={cn(
                "group flex h-9 items-center gap-1 rounded-[10px] pr-2 transition-colors",
                docsAllActive ? "bg-brand-600/[0.12]" : "hover:bg-black/[0.04]",
              )}
            >
              <button
                type="button"
                onClick={() => setDocsOpen((v) => !v)}
                aria-label={docsExpanded ? "Recolher" : "Expandir"}
                className="flex h-9 w-6 items-center justify-center text-ink-faint"
              >
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform", docsExpanded ? "" : "-rotate-90")}
                  aria-hidden="true"
                />
              </button>
              <Link
                href="/documentos"
                className={cn(
                  "flex h-9 flex-1 items-center gap-3 text-[14px] transition-colors",
                  docsAllActive ? "font-medium text-brand-700" : "text-ink-soft group-hover:text-ink",
                )}
              >
                <FolderOpen
                  className={cn("h-[18px] w-[18px]", docsAllActive ? "text-brand-600" : "text-ink-muted")}
                  strokeWidth={2}
                  aria-hidden="true"
                />
                Documentos
              </Link>
            </div>

            {docsExpanded ? (
              <ul className="mt-0.5 flex flex-col gap-0.5 pl-[22px]">
                <ChildRow
                  href="/documentos"
                  icon={Layers}
                  label="Todos"
                  count={allDocs.length}
                  active={docsAllActive}
                />
                <ChildRow
                  href="/documentos?fav=1"
                  icon={Star}
                  label="Favoritos"
                  count={favCount}
                  active={pathname === "/documentos" && fav}
                />
                {folders.map((folder) => {
                  const Icon = FOLDER_ICONS[folder.icon] ?? FolderOpen;
                  return (
                    <ChildRow
                      key={folder.id}
                      href={`/documentos?pasta=${folder.id}`}
                      icon={Icon}
                      label={folder.name}
                      count={counts[folder.id] ?? 0}
                      active={pathname === "/documentos" && pasta === folder.id}
                    />
                  );
                })}
              </ul>
            ) : null}
          </li>

          <NavRow
            href="/seguranca"
            icon={ShieldCheck}
            label="Segurança & Acesso"
            active={pathname.startsWith("/seguranca")}
          />

          <li className="px-2.5 pb-1 pt-4">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink-faint">
              Microsoft 365
            </span>
          </li>
          <NavRow
            href="/times"
            icon={UsersRound}
            label="Times"
            active={pathname.startsWith("/times")}
          />
          <NavRow
            href="/conectores"
            icon={Plug}
            label="Conectores"
            active={pathname.startsWith("/conectores")}
          />

          <li>
            <span className="flex h-9 cursor-default items-center gap-3 rounded-[10px] px-2.5 text-[14px] text-ink-faint">
              <BarChart3 className="h-[18px] w-[18px] text-ink-faint" strokeWidth={2} aria-hidden="true" />
              Relatórios
              <span className="ml-auto text-[11px] text-ink-faint">em breve</span>
            </span>
          </li>
        </ul>
      </div>

      {/* Rodapé */}
      <div className="relative p-3">
        {/* Status da conta Microsoft 365 — vivo/interativo */}
        <Link
          href="/conectores"
          className="group relative mb-2 block overflow-hidden rounded-xl border border-hairline bg-surface-elevated transition-all hover:border-brand-200 hover:soft-shadow"
        >
          {/* brilho suave que pulsa no fundo */}
          <span
            className="pointer-events-none absolute -right-6 -top-8 h-24 w-24 rounded-full opacity-60 animate-halo-pulse"
            style={{ background: "radial-gradient(closest-side, rgba(0,113,227,0.28), transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative flex items-center gap-2.5 px-2.5 py-2.5">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-alt ring-1 ring-hairline">
              {/* halo pulsante atrás do logo */}
              <span
                className="absolute inset-0 rounded-lg opacity-70 animate-halo-pulse"
                style={{ boxShadow: "0 0 0 3px rgba(0,113,227,0.12)" }}
                aria-hidden="true"
              />
              <MicrosoftLogo className="relative h-[18px] w-[18px]" />
            </span>
            <div className="min-w-0 flex-1 leading-tight">
              <p className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                Microsoft 365
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 animate-ping-soft" aria-hidden="true" />
                  <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/20" aria-hidden="true" />
                </span>
              </p>
              <p className="truncate text-[11px] text-ink-muted">empresa.onmicrosoft.com</p>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint transition-all group-hover:translate-x-0.5 group-hover:text-brand-500" aria-hidden="true" />
          </div>

          <div className="relative flex items-center gap-1.5 border-t border-hairline bg-surface-alt/40 px-2.5 py-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-wide text-emerald-700">
              <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
              Conectado
            </span>
            <span className="truncate text-[10.5px] text-ink-muted">SharePoint &amp; Teams · sincronizando</span>
          </div>

          {/* barra de sync ao vivo (shimmer) */}
          <span className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] overflow-hidden bg-brand-100/60" aria-hidden="true">
            <span
              className="block h-full w-1/3 rounded-full animate-progress-indeterminate"
              style={{ background: "linear-gradient(90deg, transparent, #0071e3, transparent)" }}
            />
          </span>
        </Link>

        <div className="flex items-center gap-2.5 rounded-xl bg-black/[0.03] p-2 transition-colors hover:bg-black/[0.05]">
          {user ? (
            <>
              <UserAvatar user={user} size="md" showStatus />
              <div className="min-w-0 flex-1 leading-tight">
                <p className="truncate text-[13.5px] font-medium text-ink">{user.name}</p>
                <p className="truncate text-[11.5px] text-ink-muted">{user.email}</p>
              </div>
              <ChevronsUpDown className="h-4 w-4 text-ink-faint" aria-hidden="true" />
            </>
          ) : (
            <div className="flex items-center gap-2.5">
              <span className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-black/10" />
              <span className="h-3 w-24 animate-pulse rounded bg-black/10" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function NavRow({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-9 items-center gap-3 rounded-[10px] px-2.5 text-[14px] transition-colors",
          active ? "bg-brand-600/[0.12] font-medium text-brand-700" : "text-ink-soft hover:bg-black/[0.04]",
        )}
      >
        <Icon
          className={cn("h-[18px] w-[18px]", active ? "text-brand-600" : "text-ink-muted")}
          strokeWidth={2}
          aria-hidden="true"
        />
        {label}
      </Link>
    </li>
  );
}

function ChildRow({
  href,
  icon: Icon,
  label,
  count,
  active,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  count: number;
  active: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex h-8 items-center gap-2.5 rounded-[8px] px-2.5 text-[13px] transition-colors",
          active ? "bg-brand-600/[0.12] font-medium text-brand-700" : "text-ink-soft hover:bg-black/[0.04]",
        )}
      >
        <Icon
          className={cn("h-4 w-4 shrink-0", active ? "text-brand-600" : "text-ink-faint")}
          strokeWidth={2}
          aria-hidden="true"
        />
        <span className="min-w-0 flex-1 truncate">{label}</span>
        <span className={cn("text-[11.5px] tabular-nums", active ? "text-brand-700/70" : "text-ink-faint")}>
          {count}
        </span>
      </Link>
    </li>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-1 flex-col gap-2 p-4">
      <div className="h-9 w-full animate-pulse rounded-xl bg-black/5" />
      <div className="h-9 w-full animate-pulse rounded-[10px] bg-black/5" />
      <div className="mt-2 flex flex-col gap-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-8 w-full animate-pulse rounded-[10px] bg-black/5" />
        ))}
      </div>
    </div>
  );
}
