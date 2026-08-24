"use client";

// React
import { useMemo, useState } from "react";

// Libs
import { Loader2, Plus, ShieldCheck, Users2, X } from "lucide-react";

// Components
import UserAvatar from "@/components/UserAvatar";

// Services
import { useCurrentUser, useSetClassification, useSetPermissions } from "@/services/documents";
import { useDepartments } from "@/services/approvals";

// Utils
import { cn } from "@/lib/utils";
import { canEdit } from "@/utils/access";
import { CLASSIFICATION, PERMISSION_LABEL } from "@/utils/labels";

// Types
import type {
  Classification,
  GedDocument,
  GedUser,
  Permission,
  PermissionLevel,
  PermissionSubject,
  Role,
} from "@/types/ged";

const CLASSIFICATION_ORDER: Classification[] = ["publico", "interno", "confidencial", "restrito"];

const CLASSIFICATION_HINT: Record<Classification, string> = {
  publico: "Visível a todos, inclusive fora da empresa.",
  interno: "Qualquer colaborador autenticado pode visualizar.",
  confidencial: "Somente quem tem permissão explícita. Marca d'água aplicada.",
  restrito: "Acesso mínimo — só permissão explícita. Marca d'água aplicada.",
};

const ROLES: Role[] = ["admin", "editor", "leitor"];
const ROLE_PLURAL: Record<Role, string> = {
  admin: "Administradores",
  editor: "Editores",
  leitor: "Leitores",
};

const LEVELS: PermissionLevel[] = ["view", "download", "edit", "owner"];

interface SecurityPanelProps {
  document: GedDocument;
  users: GedUser[];
}

export default function SecurityPanel({ document, users }: SecurityPanelProps) {
  const { data: currentUser } = useCurrentUser();
  const { data: departments = [] } = useDepartments();
  const setClassification = useSetClassification();
  const setPermissions = useSetPermissions();

  const editable = canEdit(document, currentUser);

  const userMap = useMemo(() => {
    const map = new Map<string, GedUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  // Formulário de nova permissão
  const [subjectType, setSubjectType] = useState<PermissionSubject>("user");
  const [subjectId, setSubjectId] = useState<string>(users[0]?.id ?? "");
  const [level, setLevel] = useState<PermissionLevel>("view");

  function subjectOptions(type: PermissionSubject): { value: string; label: string }[] {
    if (type === "user") return users.map((u) => ({ value: u.id, label: u.name }));
    if (type === "role") return ROLES.map((r) => ({ value: r, label: ROLE_PLURAL[r] }));
    return departments.map((d) => ({ value: d, label: d }));
  }

  function changeType(type: PermissionSubject) {
    setSubjectType(type);
    setSubjectId(subjectOptions(type)[0]?.value ?? "");
  }

  function addPermission() {
    if (!subjectId) return;
    const next: Permission[] = [
      ...document.permissions.filter(
        (p) => !(p.subjectType === subjectType && p.subjectId === subjectId),
      ),
      { subjectType, subjectId, level },
    ];
    setPermissions.mutate({ docId: document.id, permissions: next });
  }

  function removePermission(index: number) {
    const next = document.permissions.filter((_, i) => i !== index);
    setPermissions.mutate({ docId: document.id, permissions: next });
  }

  function resolve(permission: Permission): { title: string; subtitle: string; user?: GedUser } {
    if (permission.subjectType === "user") {
      const u = userMap.get(permission.subjectId);
      return { title: u?.name ?? permission.subjectId, subtitle: u?.email ?? "Usuário", user: u };
    }
    if (permission.subjectType === "role") {
      return {
        title: ROLE_PLURAL[permission.subjectId as Role] ?? permission.subjectId,
        subtitle: "Todos com este papel",
      };
    }
    return { title: permission.subjectId, subtitle: "Departamento inteiro" };
  }

  const busy = setClassification.isPending || setPermissions.isPending;

  return (
    <div className="flex flex-col gap-4">
      {/* Classificação */}
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
          Classificação (sensibilidade)
        </p>
        <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4">
          {CLASSIFICATION_ORDER.map((c) => {
            const tone = CLASSIFICATION[c];
            const active = document.classification === c;
            return (
              <button
                key={c}
                type="button"
                disabled={!editable || busy}
                onClick={() => setClassification.mutate({ docId: document.id, classification: c })}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border px-2 py-1.5 text-[12px] font-medium transition-colors",
                  active
                    ? tone.wrapper
                    : "border-hairline bg-surface-elevated text-ink-muted hover:text-ink",
                  (!editable || busy) && "cursor-not-allowed opacity-60",
                )}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden="true" />
                {tone.label}
              </button>
            );
          })}
        </div>
        <p className="mt-1.5 text-[11.5px] text-ink-muted">
          {CLASSIFICATION_HINT[document.classification]}
        </p>
      </div>

      {/* Permissões */}
      <div>
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
          Permissões explícitas
        </p>
        <ul className="flex flex-col gap-2">
          {document.permissions.map((permission, i) => {
            const info = resolve(permission);
            return (
              <li
                key={`${permission.subjectType}-${permission.subjectId}-${i}`}
                className="flex items-center gap-3 rounded-xl border border-hairline bg-surface/40 px-3 py-2"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  {info.user ? (
                    <UserAvatar user={info.user} size="sm" />
                  ) : permission.subjectType === "role" ? (
                    <ShieldCheck className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                  ) : (
                    <Users2 className="h-4 w-4" strokeWidth={1.9} aria-hidden="true" />
                  )}
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
                {editable ? (
                  <button
                    type="button"
                    onClick={() => removePermission(i)}
                    disabled={busy}
                    className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:opacity-50"
                    aria-label="Remover permissão"
                  >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Adicionar permissão */}
      {editable ? (
        <div className="rounded-xl border border-hairline bg-surface/40 p-3">
          <p className="mb-2 text-[12px] font-medium text-ink">Conceder acesso</p>

          <div className="mb-2 flex gap-1">
            {(["user", "role", "department"] as PermissionSubject[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => changeType(t)}
                className={cn(
                  "flex-1 rounded-lg px-2 py-1.5 text-[12px] font-medium transition-colors",
                  subjectType === t ? "bg-brand-50 text-brand-700" : "text-ink-muted hover:bg-surface hover:text-ink",
                )}
              >
                {t === "user" ? "Usuário" : t === "role" ? "Papel" : "Departamento"}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="h-9 min-w-0 flex-1 cursor-pointer rounded-lg border border-hairline bg-surface-elevated px-2.5 text-[12.5px] text-ink focus:border-brand-400 focus:outline-none"
              aria-label="Sujeito"
            >
              {subjectOptions(subjectType).map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as PermissionLevel)}
              className="h-9 cursor-pointer rounded-lg border border-hairline bg-surface-elevated px-2.5 text-[12.5px] text-ink focus:border-brand-400 focus:outline-none"
              aria-label="Nível de acesso"
            >
              {LEVELS.map((l) => (
                <option key={l} value={l}>
                  {PERMISSION_LABEL[l]}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={addPermission}
              disabled={busy || !subjectId}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 text-[12.5px] font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
              )}
              Conceder
            </button>
          </div>
        </div>
      ) : (
        <p className="flex items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-3 py-2 text-[11.5px] text-ink-muted">
          <ShieldCheck className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
          Você não tem permissão para editar a segurança deste documento.
        </p>
      )}
    </div>
  );
}
