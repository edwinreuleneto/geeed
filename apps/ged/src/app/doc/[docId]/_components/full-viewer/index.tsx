"use client";

// Next
import Link from "next/link";
import { notFound } from "next/navigation";

// Libs
import { ArrowLeft } from "lucide-react";

// Components
import DocumentViewer from "@/app/(app)/documentos/[docId]/_components/document-viewer";
import SecurityBadge from "@/components/SecurityBadge";
import StatusBadge from "@/components/StatusBadge";

// Services
import { useDocument } from "@/services/documents";

/** Visualização em tela cheia do documento — aberta em nova aba pelo botão "Abrir doc". */
export default function FullViewer({ docId }: { docId: string }) {
  const { data: document } = useDocument(docId);
  if (!document) notFound();

  return (
    <div className="flex h-screen flex-col bg-surface">
      <header className="flex items-center gap-3 border-b border-hairline bg-surface-elevated px-4 py-3">
        <Link
          href={`/documentos/${document.id}`}
          className="inline-flex items-center gap-1.5 text-[12.5px] text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Detalhes
        </Link>
        <span className="h-4 w-px bg-hairline" aria-hidden="true" />
        <h1 className="min-w-0 flex-1 truncate text-[14px] font-semibold text-ink" title={document.name}>
          {document.name}
        </h1>
        <div className="hidden items-center gap-2 sm:flex">
          <SecurityBadge classification={document.classification} size="md" />
          <StatusBadge status={document.status} size="md" />
        </div>
      </header>

      <div className="min-h-0 flex-1 p-3 md:p-4">
        <DocumentViewer document={document} />
      </div>
    </div>
  );
}
