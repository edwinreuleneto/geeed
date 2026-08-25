"use client";

// React
import { useState } from "react";

// Next
import Link from "next/link";
import { notFound } from "next/navigation";

// Libs
import { ArrowLeft, Download, ExternalLink, Lock, Pencil, Share2, Star } from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import SecurityBadge from "@/components/SecurityBadge";
import StatusBadge from "@/components/StatusBadge";
import UserAvatar from "@/components/UserAvatar";
import DocumentViewer from "../document-viewer";
import MetadataPanel from "../metadata-panel";
import DetailTabs from "../detail-tabs";
import AiPanel from "../ai-panel";
import PublishButton from "../publish-button";
import ApprovalActions from "../approval-actions";

// Services
import {
  useCurrentUser,
  useDocument,
  useFolders,
  useUsers,
} from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { canDownload, canEdit } from "@/utils/access";
import { canSubmitForApproval } from "@/utils/approvals";
import { formatRelative } from "@/utils/format";

interface DocumentDetailProps {
  docId: string;
}

export default function DocumentDetail({ docId }: DocumentDetailProps) {
  const [now] = useState(() => Date.now());
  const { data: document } = useDocument(docId);
  const { data: users } = useUsers();
  const { data: folders } = useFolders();
  const { data: currentUser } = useCurrentUser();

  if (!document) notFound();

  const owner = users.find((u) => u.id === document.ownerId);
  const folder = folders.find((f) => f.id === document.folderId);
  const downloadable = canDownload(document, currentUser);
  const editable = canEdit(document, currentUser);
  const publishable = canSubmitForApproval(document, currentUser);

  return (
    <main className="mx-auto w-full max-w-7xl flex-1 animate-fade-rise px-4 py-6 md:px-8 md:py-8">
      {/* Breadcrumb */}
      <Link
        href="/documentos"
        className="mb-4 inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted transition-colors hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Documentos
        {folder ? <span className="text-ink-faint">/ {folder.name}</span> : null}
      </Link>

      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4 rounded-xl border border-hairline bg-surface-elevated p-4">
        <div className="flex min-w-0 items-start gap-3.5">
          <DocTypeIcon kind={document.kind} size="lg" />
          <div className="min-w-0">
            <h1 className="display flex items-start gap-2 text-[clamp(1.5rem,2.4vw,2rem)] font-semibold text-ink">
              <span className="min-w-0 break-words">{document.name}</span>
              {document.favorite ? (
                <Star className="mt-1.5 h-4 w-4 shrink-0 fill-amber-400 text-amber-400" aria-hidden="true" />
              ) : null}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <SecurityBadge classification={document.classification} size="md" />
              <StatusBadge status={document.status} size="md" />
              <span className="flex items-center gap-1.5 text-[12px] text-ink-muted">
                {owner ? <UserAvatar user={owner} size="xs" /> : null}
                {owner?.name ?? "—"}
              </span>
              <span className="text-[12px] text-ink-faint">
                · atualizado {formatRelative(document.updatedAt, now)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">
          <a
            href={`/doc/${document.id}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-9 items-center gap-2 rounded-lg border border-hairline bg-surface-elevated px-3 text-[13px] font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-ink"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
            Abrir doc
          </a>
          {publishable ? <PublishButton document={document} users={users} /> : null}
          <ActionButton disabled title="Compartilhamento em breve">
            <Share2 className="h-3.5 w-3.5" aria-hidden="true" />
            Compartilhar
          </ActionButton>
          {editable ? (
            <ActionButton disabled title="Edição em breve">
              <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
              Editar
            </ActionButton>
          ) : null}
          {downloadable ? (
            <button
              type="button"
              className="flex h-9 items-center gap-2 rounded-full bg-brand-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
            >
              <Download className="h-3.5 w-3.5" aria-hidden="true" />
              Baixar
            </button>
          ) : (
            <span
              className="flex h-9 items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3.5 text-[13px] font-medium text-amber-700"
              title="Você não tem permissão para baixar este documento"
            >
              <Lock className="h-3.5 w-3.5" aria-hidden="true" />
              Sem acesso a download
            </span>
          )}
        </div>
      </div>

      {/* Banner de aprovação — visível quando o usuário logado é o responsável da etapa atual */}
      <ApprovalActions document={document} variant="banner" />

      {/* Conteúdo */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="min-h-[360px] sm:min-h-[520px] lg:h-[calc(100vh-13rem)] lg:sticky lg:top-6">
          <DocumentViewer document={document} />
        </div>
        <div className="flex flex-col gap-5">
          <AiPanel docId={document.id} now={now} />
          <MetadataPanel docId={document.id} now={now} />
          <DetailTabs
            document={document}
            users={users}
            now={now}
            defaultOpen={document.approval?.state === "in_progress"}
          />
        </div>
      </div>
    </main>
  );
}

function ActionButton({
  children,
  disabled,
  title,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      className={cn(
        "flex h-9 items-center gap-2 rounded-lg border border-hairline bg-surface-elevated px-3 text-[13px] font-medium text-ink-soft transition-colors",
        disabled ? "cursor-not-allowed opacity-60" : "hover:border-brand-200 hover:text-ink",
      )}
    >
      {children}
    </button>
  );
}
