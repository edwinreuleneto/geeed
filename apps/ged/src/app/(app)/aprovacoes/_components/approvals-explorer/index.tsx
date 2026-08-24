"use client";

// React
import { useState } from "react";

// Next
import Link from "next/link";

// Libs
import { Check, Inbox, Loader2, Send, SquareArrowOutUpRight } from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import StatusBadge from "@/components/StatusBadge";
import UserAvatar from "@/components/UserAvatar";

// Services
import { useCurrentUserQuery, useUsersQuery } from "@/services/documents";
import {
  useApprovalHistory,
  useApprovalQueue,
  useDecideApproval,
  useMyApprovalRequests,
} from "@/services/approvals";

// Utils
import { cn } from "@/lib/utils";
import { activeStep } from "@/utils/approvals";
import { formatRelative } from "@/utils/format";

// Types
import type { GedDocument, GedUser } from "@/types/ged";

type TabId = "queue" | "mine" | "history";

export default function ApprovalsExplorer() {
  const [tab, setTab] = useState<TabId>("queue");
  const [now] = useState(() => Date.now());

  const { data: users = [] } = useUsersQuery();
  const { data: currentUser } = useCurrentUserQuery();
  const { data: queue = [] } = useApprovalQueue();
  const { data: mine = [] } = useMyApprovalRequests();
  const { data: history = [] } = useApprovalHistory();

  const userMap = new Map<string, GedUser>(users.map((u) => [u.id, u]));

  const TABS: { id: TabId; label: string; icon: typeof Inbox; count: number }[] = [
    { id: "queue", label: "Aguardando você", icon: Inbox, count: queue.length },
    { id: "mine", label: "Enviados por você", icon: Send, count: mine.length },
    { id: "history", label: "Histórico", icon: Check, count: history.length },
  ];

  const rows = tab === "queue" ? queue : tab === "mine" ? mine : history;

  return (
    <div className="flex flex-col gap-4">
      {/* Abas */}
      <div className="flex items-center gap-1 rounded-xl border border-hairline bg-surface-elevated p-1.5">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              tab === t.id ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-surface hover:text-ink",
            )}
          >
            <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
            {t.label}
            <span
              className={cn(
                "rounded-full px-1.5 text-[10px] tabular-nums",
                tab === t.id ? "bg-brand-100 text-brand-700" : "bg-surface text-ink-faint",
              )}
            >
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {/* Lista */}
      {rows.length === 0 ? (
        <EmptyState tab={tab} />
      ) : (
        <ul className="flex flex-col gap-2">
          {rows.map((doc) => (
            <ApprovalRow
              key={doc.id}
              document={doc}
              userMap={userMap}
              now={now}
              actionable={tab === "queue" && currentUser != null}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function ApprovalRow({
  document,
  userMap,
  now,
  actionable,
}: {
  document: GedDocument;
  userMap: Map<string, GedUser>;
  now: number;
  actionable: boolean;
}) {
  const decide = useDecideApproval();
  const step = activeStep(document);
  const approver = step ? userMap.get(step.approverId) : undefined;
  const submitter = document.approval ? userMap.get(document.approval.submittedById) : undefined;

  return (
    <li className="flex items-center gap-3 rounded-xl border border-hairline bg-surface-elevated px-3 py-2.5 transition-colors hover:border-brand-200">
      <DocTypeIcon kind={document.kind} size="sm" />
      <div className="min-w-0 flex-1">
        <Link
          href={`/documentos/${document.id}`}
          className="truncate text-[13px] font-medium text-ink transition-colors hover:text-brand-700"
        >
          {document.name}
        </Link>
        <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] text-ink-faint">
          <StatusBadge status={document.status} size="sm" />
          <span>{document.department}</span>
          {submitter ? (
            <span className="flex items-center gap-1">
              <UserAvatar user={submitter} size="xs" />
              {submitter.name}
            </span>
          ) : null}
          {step && approver ? (
            <span className="text-ink-muted">
              · {step.label}: {approver.name}
            </span>
          ) : null}
          <span>· {formatRelative(document.approval?.submittedAt ?? document.updatedAt, now)}</span>
        </div>
      </div>

      {actionable ? (
        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={`/documentos/${document.id}`}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-hairline bg-surface-elevated px-2.5 text-[12px] font-medium text-ink-soft transition-colors hover:text-ink"
          >
            <SquareArrowOutUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            Revisar
          </Link>
          <button
            type="button"
            onClick={() => decide.mutate({ docId: document.id, decision: "approved" })}
            disabled={decide.isPending}
            className="flex h-8 items-center gap-1.5 rounded-full bg-emerald-600 px-3 text-[12px] font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
          >
            {decide.isPending ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            Aprovar
          </button>
        </div>
      ) : null}
    </li>
  );
}

function EmptyState({ tab }: { tab: TabId }) {
  const message =
    tab === "queue"
      ? "Nada aguardando sua decisão no momento."
      : tab === "mine"
        ? "Você ainda não enviou documentos para aprovação."
        : "Nenhuma aprovação concluída por aqui ainda.";
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-4 py-12 text-center">
      <Inbox className="h-5 w-5 text-ink-faint" aria-hidden="true" />
      <p className="text-[13px] text-ink-muted">{message}</p>
    </div>
  );
}
