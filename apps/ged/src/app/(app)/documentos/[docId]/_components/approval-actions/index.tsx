"use client";

// React
import { useState } from "react";

// Libs
import { Check, Loader2, X } from "lucide-react";

// Services
import { useCurrentUser } from "@/services/documents";
import { useDecideApproval } from "@/services/approvals";

// Utils
import { cn } from "@/lib/utils";
import { activeStep, isPendingFor } from "@/utils/approvals";

// Types
import type { GedDocument } from "@/types/ged";

interface ApprovalActionsProps {
  document: GedDocument;
  /** "banner" destaca no topo da página; "inline" encaixa dentro do painel de aprovação. */
  variant?: "banner" | "inline";
}

/**
 * Botões Aprovar/Rejeitar (com comentário) da etapa ativa. Só renderiza quando o
 * usuário logado é o responsável pela etapa atual — caso contrário retorna null.
 * Compartilhado entre o banner do topo (document-detail) e o painel de detalhes.
 */
export default function ApprovalActions({ document, variant = "inline" }: ApprovalActionsProps) {
  const { data: currentUser } = useCurrentUser();
  const decide = useDecideApproval();
  const [comment, setComment] = useState("");
  const [rejecting, setRejecting] = useState(false);

  if (!isPendingFor(document, currentUser)) return null;

  const step = activeStep(document);

  async function apply(decision: "approved" | "rejected") {
    if (decision === "rejected" && !comment.trim()) {
      setRejecting(true);
      return;
    }
    await decide.mutateAsync({ docId: document.id, decision, comment: comment.trim() || undefined });
    setComment("");
    setRejecting(false);
  }

  const box = (
    <>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder={rejecting ? "Comentário obrigatório para rejeitar…" : "Comentário (opcional ao aprovar)"}
        rows={2}
        className={cn(
          "w-full resize-none rounded-lg border bg-surface-elevated px-2.5 py-2 text-[12.5px] text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30",
          rejecting && !comment.trim() ? "border-rose-300" : "border-hairline",
        )}
      />
      <div className="mt-2 flex flex-col-reverse gap-2 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="button"
          onClick={() => apply("rejected")}
          disabled={decide.isPending}
          className="flex h-9 items-center justify-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 text-[13px] font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
        >
          {decide.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Rejeitar
        </button>
        <button
          type="button"
          onClick={() => apply("approved")}
          disabled={decide.isPending}
          className="flex h-9 items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
        >
          {decide.isPending ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
          )}
          Aprovar
        </button>
      </div>
    </>
  );

  if (variant === "banner") {
    return (
      <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50/60 p-4">
        <div className="mb-2 flex items-center gap-2">
          <span className="flex h-2 w-2 rounded-full bg-amber-500" aria-hidden="true" />
          <p className="text-[13px] font-semibold text-ink">Aguardando sua aprovação</p>
          {step ? (
            <span className="rounded-full border border-amber-200 bg-amber-100/70 px-2 py-0.5 text-[10.5px] font-medium text-amber-800">
              {step.label}
            </span>
          ) : null}
        </div>
        <p className="mb-2.5 text-[12.5px] text-ink-muted">
          Você é o responsável pela etapa atual deste documento. Aprove para avançar a cadeia ou
          rejeite com um comentário.
        </p>
        {box}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface/40 p-3">
      <p className="mb-2 text-[12px] font-medium text-ink">Sua decisão</p>
      {box}
    </div>
  );
}
