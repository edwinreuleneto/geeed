"use client";

// React
import { useMemo, useState } from "react";

// Libs
import {
  Check,
  ChevronDown,
  Clock,
  History,
  ListChecks,
  Loader2,
  ShieldCheck,
  X,
} from "lucide-react";

// Components
import UserAvatar from "@/components/UserAvatar";
import SecurityPanel from "../security-panel";

// Services
import { useCurrentUser } from "@/services/documents";
import { useDecideApproval } from "@/services/approvals";

// Utils
import { cn } from "@/lib/utils";
import { isPendingFor } from "@/utils/approvals";
import { formatDateTime, formatRelative, formatSize } from "@/utils/format";
import { ACTION_LABEL, APPROVAL_DECISION } from "@/utils/labels";

// Types
import type { GedDocument, GedUser } from "@/types/ged";

interface DetailTabsProps {
  document: GedDocument;
  users: GedUser[];
  now: number;
  defaultOpen?: boolean;
}

type TabId = "approval" | "versions" | "permissions" | "activity";

export default function DetailTabs({ document, users, now, defaultOpen = false }: DetailTabsProps) {
  const [open, setOpen] = useState(defaultOpen);
  const [tab, setTab] = useState<TabId>(document.approval ? "approval" : "versions");

  const userMap = useMemo(() => {
    const map = new Map<string, GedUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const TABS: { id: TabId; label: string; icon: typeof History; count: number }[] = [
    { id: "approval", label: "Aprovação", icon: ListChecks, count: document.approval?.steps.length ?? 0 },
    { id: "versions", label: "Versões", icon: History, count: document.versions.length },
    { id: "permissions", label: "Segurança", icon: ShieldCheck, count: document.permissions.length },
    { id: "activity", label: "Atividade", icon: Clock, count: document.activity.length },
  ];

  return (
    <div className="rounded-xl border border-hairline bg-surface-elevated">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-4 py-3 text-left transition-colors hover:bg-surface/60"
      >
        <h2 className="text-[13.5px] font-semibold text-ink">Detalhes</h2>
        <span className="rounded-full bg-surface-alt px-2 py-0.5 text-[10.5px] font-medium text-ink-muted">
          aprovação · versões · atividade
        </span>
        <ChevronDown
          className={cn("ml-auto h-4 w-4 shrink-0 text-ink-faint transition-transform", open ? "" : "-rotate-90")}
          aria-hidden="true"
        />
      </button>

      {open ? (
      <>
      <div className="flex items-center gap-1 border-t border-b border-hairline p-1.5">
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

      <div className="p-4">
        {tab === "approval" ? <ApprovalPanel document={document} userMap={userMap} now={now} /> : null}
        {tab === "versions" ? <VersionsPanel document={document} userMap={userMap} /> : null}
        {tab === "permissions" ? <SecurityPanel document={document} users={users} /> : null}
        {tab === "activity" ? (
          <ActivityPanel document={document} userMap={userMap} now={now} />
        ) : null}
      </div>
      </>
      ) : null}
    </div>
  );
}

function ApprovalPanel({
  document,
  userMap,
  now,
}: {
  document: GedDocument;
  userMap: Map<string, GedUser>;
  now: number;
}) {
  const { data: currentUser } = useCurrentUser();
  const decide = useDecideApproval();
  const [comment, setComment] = useState("");
  const [rejecting, setRejecting] = useState(false);

  const approval = document.approval;

  if (!approval) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-4 py-8 text-center">
        <ListChecks className="h-5 w-5 text-ink-faint" aria-hidden="true" />
        <p className="text-[12.5px] text-ink-muted">Documento ainda não publicado para aprovação.</p>
        <p className="text-[11.5px] text-ink-faint">
          Publique um rascunho para acionar a cadeia de responsáveis do departamento.
        </p>
      </div>
    );
  }

  const canDecide = isPendingFor(document, currentUser);

  async function apply(decision: "approved" | "rejected") {
    if (decision === "rejected" && !comment.trim()) {
      setRejecting(true);
      return;
    }
    await decide.mutateAsync({ docId: document.id, decision, comment: comment.trim() || undefined });
    setComment("");
    setRejecting(false);
  }

  const submitter = userMap.get(approval.submittedById);

  return (
    <div className="flex flex-col gap-4">
      {/* Resumo do estado */}
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-1.5 text-[11.5px] text-ink-faint">
          {submitter ? <UserAvatar user={submitter} size="xs" /> : null}
          Enviado por {submitter?.name ?? "—"} · {formatRelative(approval.submittedAt, now)}
        </p>
        <span
          className={cn(
            "rounded-full px-2 py-0.5 text-[10.5px] font-medium",
            approval.state === "approved"
              ? APPROVAL_DECISION.approved.soft
              : approval.state === "rejected"
                ? APPROVAL_DECISION.rejected.soft
                : APPROVAL_DECISION.pending.soft,
          )}
        >
          {approval.state === "approved"
            ? "Aprovado"
            : approval.state === "rejected"
              ? "Rejeitado"
              : "Em aprovação"}
        </span>
      </div>

      {/* Stepper */}
      <ol className="relative flex flex-col gap-4 pl-4">
        <span className="absolute bottom-2 left-[5px] top-2 w-px bg-hairline-strong" aria-hidden="true" />
        {approval.steps.map((step) => {
          const approver = userMap.get(step.approverId);
          const active = approval.state === "in_progress" && step.order === approval.currentStep;
          const tone = APPROVAL_DECISION[step.decision];
          return (
            <li key={step.order} className="relative">
              <span
                className={cn(
                  "absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated",
                  step.decision === "approved"
                    ? "bg-emerald-500"
                    : step.decision === "rejected"
                      ? "bg-rose-500"
                      : active
                        ? "bg-amber-500"
                        : "bg-ink-faint",
                )}
                aria-hidden="true"
              />
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                    {step.label}
                    {active ? (
                      <span className="rounded-full border border-amber-200 bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                        etapa atual
                      </span>
                    ) : null}
                  </p>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-faint">
                    {approver ? <UserAvatar user={approver} size="xs" /> : null}
                    {approver?.name ?? step.approverId}
                    {step.decidedAt ? ` · ${formatDateTime(step.decidedAt)}` : null}
                  </p>
                  {step.comment ? (
                    <p className="mt-1 rounded-lg bg-surface px-2 py-1 text-[11.5px] text-ink-muted">
                      “{step.comment}”
                    </p>
                  ) : null}
                </div>
                <span className={cn("shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-medium", tone.soft)}>
                  {tone.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>

      {/* Ações do aprovador */}
      {canDecide ? (
        <div className="rounded-xl border border-hairline bg-surface/40 p-3">
          <p className="mb-2 text-[12px] font-medium text-ink">Sua decisão</p>
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
          <div className="mt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => apply("rejected")}
              disabled={decide.isPending}
              className="flex h-9 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-3.5 text-[13px] font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:opacity-60"
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
              className="flex h-9 items-center gap-2 rounded-full bg-emerald-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-emerald-700 disabled:opacity-60"
            >
              {decide.isPending ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Aprovar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function VersionsPanel({
  document,
  userMap,
}: {
  document: GedDocument;
  userMap: Map<string, GedUser>;
}) {
  return (
    <ol className="relative flex flex-col gap-4 pl-4">
      <span className="absolute bottom-2 left-[5px] top-2 w-px bg-hairline-strong" aria-hidden="true" />
      {document.versions.map((version, i) => {
        const author = userMap.get(version.authorId);
        const current = i === 0;
        return (
          <li key={version.version} className="relative">
            <span
              className={cn(
                "absolute -left-4 top-1 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated",
                current ? "bg-brand-500" : "bg-ink-faint",
              )}
              aria-hidden="true"
            />
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
                  {version.version} · {version.label}
                  {current ? (
                    <span className="rounded-full border border-brand-200 bg-brand-50 px-1.5 py-0.5 text-[10px] font-medium text-brand-700">
                      atual
                    </span>
                  ) : null}
                </p>
                {version.note ? (
                  <p className="mt-0.5 text-[12px] text-ink-muted">{version.note}</p>
                ) : null}
                <p className="mt-1 flex items-center gap-1.5 text-[11px] text-ink-faint">
                  {author ? <UserAvatar user={author} size="xs" /> : null}
                  {author?.name ?? "—"} · {formatDateTime(version.at)} · {formatSize(version.sizeKb)}
                </p>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ActivityPanel({
  document,
  userMap,
  now,
}: {
  document: GedDocument;
  userMap: Map<string, GedUser>;
  now: number;
}) {
  return (
    <ol className="relative flex flex-col gap-3.5 pl-4">
      <span className="absolute bottom-2 left-[5px] top-2 w-px bg-hairline-strong" aria-hidden="true" />
      {document.activity.map((event) => {
        const actor = userMap.get(event.actorId);
        return (
          <li key={event.id} className="relative">
            <span
              className="absolute -left-4 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated bg-ink-faint"
              aria-hidden="true"
            />
            <p className="text-[12.5px] text-ink">
              <span className="font-medium">{actor?.name ?? "Alguém"}</span>{" "}
              <span className="text-ink-muted">{ACTION_LABEL[event.action]}</span>{" "}
              <span className="text-ink-muted">este documento</span>
              {event.detail ? <span className="text-ink-faint"> · {event.detail}</span> : null}
            </p>
            <p className="mt-0.5 text-[11px] text-ink-faint">{formatRelative(event.at, now)}</p>
          </li>
        );
      })}
    </ol>
  );
}
