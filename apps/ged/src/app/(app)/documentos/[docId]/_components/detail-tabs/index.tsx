"use client";

// React
import { useMemo, useState } from "react";

// Libs
import {
  Clock,
  History,
  ShieldCheck,
  Users2,
} from "lucide-react";

// Components
import UserAvatar from "@/components/UserAvatar";

// Utils
import { cn } from "@/lib/utils";
import { formatDateTime, formatRelative, formatSize } from "@/utils/format";
import { ACTION_LABEL, PERMISSION_LABEL } from "@/utils/labels";

// Types
import type { GedDocument, GedUser, Permission, Role } from "@/types/ged";

interface DetailTabsProps {
  document: GedDocument;
  users: GedUser[];
  now: number;
}

type TabId = "versions" | "permissions" | "activity";

const ROLE_PLURAL: Record<Role, string> = {
  admin: "Administradores",
  editor: "Editores",
  leitor: "Leitores",
};

export default function DetailTabs({ document, users, now }: DetailTabsProps) {
  const [tab, setTab] = useState<TabId>("versions");

  const userMap = useMemo(() => {
    const map = new Map<string, GedUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const TABS: { id: TabId; label: string; icon: typeof History; count: number }[] = [
    { id: "versions", label: "Versões", icon: History, count: document.versions.length },
    { id: "permissions", label: "Permissões", icon: ShieldCheck, count: document.permissions.length },
    { id: "activity", label: "Atividade", icon: Clock, count: document.activity.length },
  ];

  return (
    <div className="rounded-xl border border-hairline bg-surface-elevated">
      <div className="flex items-center gap-1 border-b border-hairline p-1.5">
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
        {tab === "versions" ? <VersionsPanel document={document} userMap={userMap} /> : null}
        {tab === "permissions" ? <PermissionsPanel document={document} userMap={userMap} /> : null}
        {tab === "activity" ? (
          <ActivityPanel document={document} userMap={userMap} now={now} />
        ) : null}
      </div>
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

function PermissionsPanel({
  document,
  userMap,
}: {
  document: GedDocument;
  userMap: Map<string, GedUser>;
}) {
  function resolve(permission: Permission): { title: string; subtitle: string; icon: typeof Users2 } {
    if (permission.subjectType === "user") {
      const u = userMap.get(permission.subjectId);
      return { title: u?.name ?? permission.subjectId, subtitle: u?.email ?? "Usuário", icon: Users2 };
    }
    if (permission.subjectType === "role") {
      return {
        title: ROLE_PLURAL[permission.subjectId as Role] ?? permission.subjectId,
        subtitle: "Todos com este papel",
        icon: ShieldCheck,
      };
    }
    return { title: permission.subjectId, subtitle: "Departamento inteiro", icon: Users2 };
  }

  return (
    <ul className="flex flex-col gap-2">
      {document.permissions.map((permission, i) => {
        const info = resolve(permission);
        return (
          <li
            key={`${permission.subjectType}-${permission.subjectId}-${i}`}
            className="flex items-center gap-3 rounded-xl border border-hairline bg-surface/40 px-3 py-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
              <info.icon className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12.5px] font-medium text-ink">{info.title}</p>
              <p className="truncate text-[11px] text-ink-muted">{info.subtitle}</p>
            </div>
            <span
              className={cn(
                "rounded-full border px-2 py-0.5 text-[11px] font-medium",
                permission.level === "owner"
                  ? "border-brand-200 bg-brand-50 text-brand-700"
                  : "border-hairline bg-surface text-ink-soft",
              )}
            >
              {PERMISSION_LABEL[permission.level]}
            </span>
          </li>
        );
      })}
      <li className="mt-1 flex items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-3 py-2 text-[11.5px] text-ink-muted">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
        Acesso efetivo calculado por classificação + concessões. Ver Segurança & Acesso.
      </li>
    </ul>
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
