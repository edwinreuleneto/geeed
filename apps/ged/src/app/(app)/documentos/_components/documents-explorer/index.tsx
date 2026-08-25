"use client";

// React
import { useMemo, useState } from "react";

// Next
import { useSearchParams } from "next/navigation";

// Libs
import { LayoutGrid, List, Search } from "lucide-react";

// Components
import DocumentCard, { LIST_GRID } from "@/components/DocumentCard";

// Services
import {
  useCurrentUserQuery,
  useDocumentsQuery,
  useFoldersQuery,
  useUsersQuery,
} from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { SENSITIVE_LABEL } from "@/utils/classification";
import { STATUS } from "@/utils/labels";

// Types
import type { Department, DocumentStatus, GedUser } from "@/types/ged";
import type {
  ClassificationFilter,
  DocumentFilters,
  StatusFilter,
} from "@/services/documents/documents.types";

const CLASSIFICATIONS: { value: ClassificationFilter; label: string }[] = [
  { value: "all", label: "Toda classificação" },
  { value: "publico", label: "Público" },
  { value: "interno", label: "Interno" },
  { value: "confidencial", label: "Confidencial" },
  { value: "restrito", label: "Restrito" },
];

const SORTS: { value: NonNullable<DocumentFilters["sort"]>; label: string }[] = [
  { value: "recent", label: "Mais recentes" },
  { value: "name", label: "Nome (A–Z)" },
  { value: "size", label: "Tamanho" },
];

export default function DocumentsExplorer() {
  const [now] = useState(() => Date.now());
  const [search, setSearch] = useState("");
  const [classification, setClassification] = useState<ClassificationFilter>("all");
  const [sort, setSort] = useState<NonNullable<DocumentFilters["sort"]>>("recent");
  const [view, setView] = useState<"grid" | "list">("grid");

  // A seleção de pasta/recorte vem da URL (dashboard, menu lateral, atalhos).
  const params = useSearchParams();
  const pasta = params.get("pasta");
  const fav = params.get("fav") === "1";
  const sensivel = params.get("sensivel") === "1";
  const statusParam = params.get("status");
  const status: StatusFilter | undefined = isDocumentStatus(statusParam)
    ? statusParam
    : undefined;
  const deptParam = params.get("depto");
  const department: Department | undefined = isDepartment(deptParam) ? deptParam : undefined;

  const filters: DocumentFilters = {
    search,
    classification,
    sort,
    folderId: pasta,
    favoritesOnly: fav,
    sensitiveOnly: sensivel,
    status,
    department,
  };

  const { data: documents = [] } = useDocumentsQuery(filters);
  const { data: folders = [] } = useFoldersQuery();
  const { data: users = [] } = useUsersQuery();
  const { data: currentUser } = useCurrentUserQuery();

  const userMap = useMemo(() => {
    const map = new Map<string, GedUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const folderMap = useMemo(() => new Map(folders.map((f) => [f.id, f])), [folders]);

  const contextLabel = fav
    ? "Favoritos"
    : sensivel
      ? "Documentos sensíveis"
      : department
        ? department
        : status
          ? STATUS[status].label
          : pasta
            ? (folderMap.get(pasta)?.name ?? "Pasta")
            : "Todos os documentos";

  return (
    <div className="flex flex-col gap-4">
      {/* Contexto da pasta/recorte atual */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <h2 className="text-[17px] font-semibold tracking-tight text-ink">{contextLabel}</h2>
          <span className="text-[13px] text-ink-muted">
            {documents.length} {documents.length === 1 ? "item" : "itens"}
          </span>
        </div>
        {sensivel ? (
          <p className="text-[12px] text-ink-muted">
            Sensível ={" "}
            <span className="font-medium text-ink-soft">{SENSITIVE_LABEL}</span> — as duas
            classificações mais altas.
          </p>
        ) : null}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <label className="relative min-w-[200px] flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint"
            aria-hidden="true"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar nesta pasta…"
            className="h-9 w-full rounded-[10px] border border-hairline bg-surface-elevated pl-9 pr-3 text-[13.5px] text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100/60"
          />
        </label>

        <select
          value={classification}
          onChange={(e) => setClassification(e.target.value as ClassificationFilter)}
          className="h-9 rounded-[10px] border border-hairline bg-surface-elevated px-3 text-[13px] text-ink-soft focus:border-brand-400 focus:outline-none"
        >
          {CLASSIFICATIONS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as NonNullable<DocumentFilters["sort"]>)}
          className="h-9 rounded-[10px] border border-hairline bg-surface-elevated px-3 text-[13px] text-ink-soft focus:border-brand-400 focus:outline-none"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="flex h-9 items-center rounded-[10px] border border-hairline bg-surface-elevated p-0.5">
          <ViewToggle active={view === "grid"} onClick={() => setView("grid")} label="Grade">
            <LayoutGrid className="h-4 w-4" aria-hidden="true" />
          </ViewToggle>
          <ViewToggle active={view === "list"} onClick={() => setView("list")} label="Lista">
            <List className="h-4 w-4" aria-hidden="true" />
          </ViewToggle>
        </div>
      </div>

      {/* Resultados */}
      {documents.length === 0 ? (
        <EmptyState />
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {documents.map((doc, i) =>
            currentUser ? (
              <div
                key={doc.id}
                className="animate-fade-rise"
                style={{ animationDelay: `${Math.min(i, 12) * 22}ms` }}
              >
                <DocumentCard
                  document={doc}
                  owner={userMap.get(doc.ownerId)}
                  folder={folderMap.get(doc.folderId)}
                  currentUser={currentUser}
                  view="grid"
                  now={now}
                />
              </div>
            ) : null,
          )}
        </div>
      ) : (
        <div className="overflow-hidden rounded-[18px] bg-surface-elevated ring-1 ring-hairline">
          <div
            className={cn(
              "grid",
              LIST_GRID,
              "items-center gap-3 border-b border-hairline px-3.5 py-2.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint",
            )}
          >
            <span>Nome</span>
            <span className="hidden md:block">Classificação</span>
            <span className="hidden md:block">Modificado</span>
            <span className="hidden md:block">Tamanho</span>
            <span />
          </div>
          <div className="p-1.5">
            {documents.map((doc) =>
              currentUser ? (
                <DocumentCard
                  key={doc.id}
                  document={doc}
                  owner={userMap.get(doc.ownerId)}
                  folder={folderMap.get(doc.folderId)}
                  currentUser={currentUser}
                  view="list"
                  now={now}
                />
              ) : null,
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DOCUMENT_STATUSES: DocumentStatus[] = [
  "draft",
  "review",
  "in_approval",
  "approved",
  "archived",
];

function isDocumentStatus(value: string | null): value is DocumentStatus {
  return value != null && (DOCUMENT_STATUSES as string[]).includes(value);
}

const DEPARTMENTS: Department[] = [
  "Financeiro",
  "Jurídico",
  "RH",
  "Comercial",
  "Operações",
  "TI",
];

function isDepartment(value: string | null): value is Department {
  return value != null && (DEPARTMENTS as string[]).includes(value);
}

function ViewToggle({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
        active ? "bg-surface-alt text-ink" : "text-ink-faint hover:text-ink-soft",
      )}
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-[18px] bg-surface-elevated px-6 py-20 text-center ring-1 ring-hairline">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt text-ink-faint">
        <Search className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className="text-[15px] font-medium text-ink">Nenhum documento aqui</p>
      <p className="mt-1 max-w-xs text-[13px] text-ink-muted">
        Ajuste os filtros ou selecione outra pasta no menu. Documentos restritos podem não aparecer
        para o seu perfil.
      </p>
    </div>
  );
}
