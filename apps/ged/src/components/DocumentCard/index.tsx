// Next
import Link from "next/link";

// Libs
import { Lock, Star } from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import SecurityBadge from "@/components/SecurityBadge";
import StatusBadge from "@/components/StatusBadge";
import UserAvatar from "@/components/UserAvatar";

// Utils
import { canDownload } from "@/utils/access";
import { formatRelative, formatSize } from "@/utils/format";

// Types
import type { DocumentCardProps } from "./document-card.types";

// Colunas compartilhadas com o cabeçalho da lista (mantêm o alinhamento de tabela).
export const LIST_GRID = "grid-cols-[1fr_130px_110px_84px_36px]";

export default function DocumentCard({
  document,
  owner,
  folder,
  currentUser,
  view = "grid",
  now,
}: DocumentCardProps) {
  const downloadable = canDownload(document, currentUser);
  const href = `/documentos/${document.id}`;

  if (view === "list") {
    return (
      <Link
        href={href}
        className={`group grid ${LIST_GRID} items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-surface-alt`}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <DocTypeIcon kind={document.kind} size="sm" />
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="truncate text-[13px] font-medium text-ink" title={document.name}>
              {document.name}
            </span>
            {document.favorite ? (
              <Star className="h-3 w-3 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
            ) : null}
          </span>
        </div>
        <div className="hidden md:block">
          <SecurityBadge classification={document.classification} />
        </div>
        <span className="hidden text-[12px] text-ink-muted md:block">
          {formatRelative(document.updatedAt, now)}
        </span>
        <span className="hidden text-[12px] text-ink-muted md:block">
          {formatSize(document.sizeKb)}
        </span>
        <span className="flex items-center justify-end">
          {owner ? (
            <UserAvatar user={owner} size="xs" />
          ) : (
            <Lock className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
          )}
        </span>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-[18px] bg-surface-elevated ring-1 ring-hairline transition-all duration-200 hover:-translate-y-0.5 hover:ring-hairline-strong hover:soft-shadow"
    >
      {/* Preview */}
      <div className="relative flex h-[136px] items-center justify-center bg-surface-alt/70">
        <DocTypeIcon kind={document.kind} size="xl" />
        <div className="absolute right-3 top-3 flex items-center gap-1.5 text-ink-faint">
          {document.favorite ? (
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden="true" />
          ) : null}
          {!downloadable ? (
            <span
              className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-elevated text-ink-muted soft-shadow"
              title="Sem permissão para baixar"
            >
              <Lock className="h-3 w-3" aria-hidden="true" />
            </span>
          ) : null}
        </div>
      </div>

      {/* Corpo */}
      <div className="p-3.5">
        <p className="truncate text-[14px] font-medium text-ink" title={document.name}>
          {document.name}
        </p>
        <p className="mt-1 truncate text-[12.5px] text-ink-muted">
          {folder?.name ?? "Sem pasta"} · {formatSize(document.sizeKb)} ·{" "}
          {formatRelative(document.updatedAt, now)}
        </p>
        <div className="mt-3.5 flex items-center justify-between">
          <SecurityBadge classification={document.classification} />
          <div className="flex items-center gap-2">
            <StatusBadge status={document.status} />
            {owner ? <UserAvatar user={owner} size="xs" /> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
