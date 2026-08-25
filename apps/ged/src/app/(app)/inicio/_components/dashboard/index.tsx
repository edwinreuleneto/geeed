"use client";

// React
import { useEffect, useMemo, useState } from "react";

// Next
import Link from "next/link";

// Libs
import { ArrowUpRight, CalendarClock, CheckCircle2, FolderOpen, ShieldAlert } from "lucide-react";

// Components
import AvatarStack from "@/components/AvatarStack";
import DocTypeIcon from "@/components/DocTypeIcon";
import StatusBadge from "@/components/StatusBadge";
import UserAvatar from "@/components/UserAvatar";

// Services
import { useCurrentUser, useDocuments, useExpirations, useUsers } from "@/services/documents";
import { useApprovalQueue } from "@/services/approvals";
import { useTeams } from "@/services/teams";

// Utils
import { isSensitive, SENSITIVE_LABEL } from "@/utils/classification";
import { formatRelative } from "@/utils/format";
import { greeting } from "@/utils/greeting";
import { ACTION_LABEL } from "@/utils/labels";

// Types
import type { ExpirationItem } from "@/data";
import type { Classification, Department, GedDocument, GedUser } from "@/types/ged";

const CLASS_META: { key: Classification; label: string; color: string }[] = [
  { key: "publico", label: "Público", color: "#34c759" },
  { key: "interno", label: "Interno", color: "#0071e3" },
  { key: "confidencial", label: "Confidencial", color: "#ff9f0a" },
  { key: "restrito", label: "Restrito", color: "#ff3b30" },
];

const DEPARTMENTS: Department[] = ["Financeiro", "Jurídico", "RH", "Comercial", "Operações", "TI"];

export default function Dashboard() {
  const [now] = useState(() => Date.now());
  const [hello, setHello] = useState("Olá");
  const [today, setToday] = useState("Visão geral");

  const { data: documents } = useDocuments({ sort: "recent" });
  const { data: users } = useUsers();
  const { data: currentUser } = useCurrentUser();
  const { data: teams } = useTeams();
  const { data: expirations } = useExpirations();
  const { data: approvalQueue = [] } = useApprovalQueue();

  // Pendentes = documentos aguardando a SUA decisão (mesma fila do menu e da tela /aprovacoes).
  const pending = approvalQueue.length;

  const storage = useMemo(() => {
    const usedGb = teams.reduce((s, t) => s + t.storageMb, 0) / 1024;
    const quotaGb = 100;
    return { usedGb, quotaGb, pct: Math.min(100, Math.round((usedGb / quotaGb) * 100)) };
  }, [teams]);

  useEffect(() => {
    const d = new Date();
    setHello(greeting(d.getHours()));
    setToday(d.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" }));
  }, []);

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const attention = useMemo(
    () => documents.filter((d) => d.status === "review" || d.status === "draft").slice(0, 5),
    [documents],
  );

  const activity = useMemo(() => {
    const events = documents.flatMap((doc) =>
      doc.activity.map((ev) => ({ ...ev, key: `${doc.id}-${ev.id}`, docId: doc.id, docName: doc.name })),
    );
    events.sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
    return events.slice(0, 7);
  }, [documents]);

  const classCounts = useMemo(() => {
    const c: Record<Classification, number> = { publico: 0, interno: 0, confidencial: 0, restrito: 0 };
    for (const d of documents) c[d.classification] += 1;
    return c;
  }, [documents]);

  const deptCounts = useMemo(() => {
    const c = new Map<Department, number>();
    for (const d of documents) c.set(d.department, (c.get(d.department) ?? 0) + 1);
    return c;
  }, [documents]);

  const stats = useMemo(() => {
    const review = documents.filter((d) => d.status === "review").length;
    const sensitive = documents.filter(isSensitive).length;
    const favs = documents.filter((d) => d.favorite).length;
    return { total: documents.length, review, sensitive, favs };
  }, [documents]);

  const firstName = currentUser.name.split(" ")[0];

  return (
    <div className="flex animate-fade-rise flex-col gap-6">
      {/* Herói */}
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          {today}
        </p>
        <h1 className="display mt-1.5 text-[clamp(1.75rem,2.6vw,2.125rem)] font-semibold text-ink">
          {hello}, {firstName}
        </h1>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-muted">
          {stats.review > 0
            ? `Você tem ${stats.review} ${stats.review === 1 ? "documento" : "documentos"} aguardando revisão e ${stats.sensitive} itens sensíveis sob controle.`
            : "Tudo em dia. Nenhuma revisão pendente no momento."}
        </p>
      </div>

      {/* KPIs — numerais grandes. Cada card leva à lista que contém exatamente esse total. */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline lg:grid-cols-5">
        <Kpi label="Documentos" value={stats.total} href="/documentos" />
        <Kpi label="Em revisão" value={stats.review} href="/documentos?status=review" accent="#ff9f0a" />
        <Kpi
          label="Pendentes"
          value={pending}
          href="/aprovacoes"
          accent="#ffcc00"
          hint="Aguardando sua decisão"
        />
        <Kpi
          label="Sensíveis"
          value={stats.sensitive}
          href="/documentos?sensivel=1"
          accent="#ff3b30"
          hint={SENSITIVE_LABEL}
        />
        <Kpi label="Favoritos" value={stats.favs} href="/documentos?fav=1" accent="#0071e3" />
      </div>

      {/* Atalhos rápidos */}
      <div className="flex flex-wrap gap-2">
        <Shortcut
          href="/aprovacoes"
          icon={CheckCircle2}
          label="Documentos para aprovação"
          badge={pending}
        />
        <Shortcut href="/documentos?sensivel=1" icon={ShieldAlert} label="Documentos sensíveis" />
        <Shortcut href="/documentos" icon={FolderOpen} label="Todos os documentos" />
      </div>

      {/* Bento */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Panel className="lg:col-span-7" eyebrow="Sensibilidade" title="Classificação da base">
          <ClassificationDonut counts={classCounts} total={stats.total} />
        </Panel>

        <Panel className="lg:col-span-5" eyebrow="Pendências" title="Precisa de atenção">
          {attention.length === 0 ? (
            <Empty label="Nada pendente. Tudo em dia." />
          ) : (
            <ul className="flex flex-col">
              {attention.map((doc) => (
                <DocRow key={doc.id} doc={doc} owner={userMap.get(doc.ownerId)} now={now} />
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="lg:col-span-4" eyebrow="Volume" title="Por departamento">
          <DepartmentBars counts={deptCounts} />
        </Panel>

        <Panel className="lg:col-span-4" eyebrow="SharePoint" title="Armazenamento">
          <StorageWidget usedGb={storage.usedGb} quotaGb={storage.quotaGb} pct={storage.pct} teams={teams.length} />
        </Panel>

        <Panel className="lg:col-span-4" eyebrow="Equipe" title="Pessoas">
          <PeopleWidget users={users} />
        </Panel>

        <Panel className="lg:col-span-4" eyebrow="Metadados · IA" title="Vencimentos & renovações">
          <ExpirationsWidget items={expirations} now={now} />
        </Panel>

        <Panel className="lg:col-span-8" eyebrow="Tempo real" title="Atividade recente">
          <ul className="grid grid-cols-1 gap-x-8 gap-y-1 md:grid-cols-2">
            {activity.map((ev) => {
              const actor = userMap.get(ev.actorId);
              return (
                <li key={ev.key}>
                  <Link
                    href={`/documentos/${ev.docId}`}
                    className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-alt"
                  >
                    {actor ? <UserAvatar user={actor} size="sm" /> : null}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] leading-snug text-ink">
                        <span className="font-medium">{actor?.name.split(" ")[0] ?? "Alguém"}</span>{" "}
                        <span className="text-ink-muted">{ACTION_LABEL[ev.action]}</span>{" "}
                        <span className="text-ink group-hover:underline">{ev.docName}</span>
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-faint">{formatRelative(ev.at, now)}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

/* --- KPI editorial --------------------------------------------------------- */

function Kpi({
  label,
  value,
  href,
  accent,
  hint,
}: {
  label: string;
  value: number;
  href: string;
  accent?: string;
  hint?: string;
}) {
  return (
    <Link
      href={href}
      title={hint}
      className="group relative bg-surface-elevated p-5 transition-colors hover:bg-surface-alt"
    >
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-[12px] font-medium text-ink-muted">
          {accent ? (
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent }} aria-hidden="true" />
          ) : (
            <span className="h-1.5 w-1.5 rounded-full bg-ink" aria-hidden="true" />
          )}
          {label}
        </span>
        <ArrowUpRight className="h-4 w-4 text-ink-faint opacity-0 transition-opacity group-hover:opacity-100" aria-hidden="true" />
      </div>
      <p className="display mt-3 text-[2.25rem] font-semibold leading-none text-ink">{value}</p>
      {hint ? <p className="mt-1.5 text-[11px] text-ink-faint">{hint}</p> : null}
    </Link>
  );
}

/* --- Atalhos --------------------------------------------------------------- */

function Shortcut({
  href,
  icon: Icon,
  label,
  badge,
}: {
  href: string;
  icon: typeof CheckCircle2;
  label: string;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-2 rounded-full border border-hairline bg-surface-elevated px-3.5 py-2 text-[12.5px] font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-ink"
    >
      <Icon className="h-3.5 w-3.5 text-ink-faint transition-colors group-hover:text-brand-600" aria-hidden="true" />
      {label}
      {badge && badge > 0 ? (
        <span className="ml-0.5 rounded-full bg-brand-50 px-1.5 py-0.5 text-[10.5px] font-semibold tabular-nums text-brand-700">
          {badge}
        </span>
      ) : null}
    </Link>
  );
}

/* --- Gráficos (SVG leve) --------------------------------------------------- */

function ClassificationDonut({
  counts,
  total,
}: {
  counts: Record<Classification, number>;
  total: number;
}) {
  const r = 52;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative h-[136px] w-[136px] shrink-0">
        <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
          <circle cx="70" cy="70" r={r} fill="none" stroke="var(--color-surface-alt)" strokeWidth="16" />
          {CLASS_META.map((m) => {
            const value = counts[m.key];
            if (value === 0 || total === 0) return null;
            const len = (value / total) * c;
            const el = (
              <circle
                key={m.key}
                cx="70"
                cy="70"
                r={r}
                fill="none"
                stroke={m.color}
                strokeWidth="16"
                strokeDasharray={`${Math.max(len - 3, 0)} ${c}`}
                strokeDashoffset={-offset}
              />
            );
            offset += len;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="display text-[2rem] font-semibold leading-none text-ink">{total}</span>
          <span className="mt-1 text-[10.5px] text-ink-muted">documentos</span>
        </div>
      </div>

      <ul className="flex flex-1 flex-col gap-2.5">
        {CLASS_META.map((m) => {
          const value = counts[m.key];
          const pct = total ? Math.round((value / total) * 100) : 0;
          return (
            <li key={m.key} className="flex items-center gap-2.5 text-[12.5px]">
              <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: m.color }} />
              <span className="flex-1 text-ink-soft">{m.label}</span>
              <span className="font-medium text-ink">{value}</span>
              <span className="w-8 text-right text-ink-faint">{pct}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function DepartmentBars({ counts }: { counts: Map<Department, number> }) {
  const max = Math.max(1, ...DEPARTMENTS.map((d) => counts.get(d) ?? 0));
  return (
    <ul className="flex flex-col gap-3 py-1">
      {DEPARTMENTS.map((dept) => {
        const value = counts.get(dept) ?? 0;
        const pct = (value / max) * 100;
        return (
          <li key={dept} className="flex items-center gap-3 text-[12px]">
            <span className="w-24 shrink-0 truncate text-ink-soft">{dept}</span>
            <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-alt">
              <span className="block h-full rounded-full bg-brand-500" style={{ width: `${pct}%` }} />
            </span>
            <span className="w-5 text-right font-medium tabular-nums text-ink">{value}</span>
          </li>
        );
      })}
    </ul>
  );
}

function StorageWidget({
  usedGb,
  quotaGb,
  pct,
  teams,
}: {
  usedGb: number;
  quotaGb: number;
  pct: number;
  teams: number;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline gap-1.5">
        <span className="display text-[1.9rem] font-semibold leading-none text-ink">
          {usedGb.toFixed(1)}
        </span>
        <span className="text-[13px] text-ink-muted">/ {quotaGb} GB</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-surface-alt">
        <span
          className="block h-full rounded-full"
          style={{
            width: `${pct}%`,
            background: pct > 85 ? "#ff3b30" : "#0071e3",
          }}
        />
      </div>
      <p className="text-[12px] text-ink-muted">
        {pct}% usado · {teams} bibliotecas do SharePoint
      </p>
    </div>
  );
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrador",
  editor: "Editor",
  leitor: "Leitor",
};

function PeopleWidget({ users }: { users: GedUser[] }) {
  return (
    <div className="flex flex-col gap-3">
      <AvatarStack users={users} size="md" max={6} />
      <ul className="flex flex-col gap-2">
        {users.slice(0, 4).map((u) => (
          <li key={u.id} className="flex items-center gap-2.5">
            <UserAvatar user={u} size="xs" />
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink">{u.name}</span>
            <span className="text-[11px] text-ink-muted">{ROLE_LABEL[u.role] ?? u.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ExpirationsWidget({ items, now }: { items: ExpirationItem[]; now: number }) {
  const dayMs = 86_400_000;
  if (items.length === 0) {
    return <Empty label="Nenhum vencimento mapeado." />;
  }
  return (
    <ul className="flex flex-col gap-1">
      {items.slice(0, 5).map((it) => {
        const days = Math.round((new Date(it.expiresAt).getTime() - now) / dayMs);
        const tone = days < 30 ? "#ff3b30" : days < 90 ? "#ff9f0a" : "#8e8e93";
        const rel =
          days < 0 ? "vencido" : days === 0 ? "hoje" : days < 45 ? `em ${days} dias` : formatRelative(it.expiresAt, now);
        return (
          <li key={it.docId}>
            <Link
              href={`/documentos/${it.docId}`}
              className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-alt"
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full" style={{ background: tone }} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12.5px] font-medium text-ink" title={it.name}>
                  {it.name}
                </p>
                <p className="truncate text-[11px] text-ink-muted">{it.contentType}</p>
              </div>
              <span className="shrink-0 text-[11.5px] font-medium tabular-nums" style={{ color: tone }}>
                {rel}
              </span>
            </Link>
          </li>
        );
      })}
      <li className="mt-1 flex items-center gap-1.5 px-2 text-[11px] text-ink-faint">
        <CalendarClock className="h-3 w-3" aria-hidden="true" />
        datas extraídas dos documentos pela IA
      </li>
    </ul>
  );
}

/* --- Blocos ---------------------------------------------------------------- */

function Panel({
  eyebrow,
  title,
  className,
  children,
}: {
  eyebrow: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={`rounded-2xl border border-hairline bg-surface-elevated p-5 ${className ?? ""}`}>
      <div className="mb-4">
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="mt-1.5 text-[15px] font-semibold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function DocRow({ doc, owner, now }: { doc: GedDocument; owner?: GedUser; now: number }) {
  return (
    <li>
      <Link
        href={`/documentos/${doc.id}`}
        className="group -mx-2 flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-surface-alt"
      >
        <DocTypeIcon kind={doc.kind} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[12.5px] font-medium text-ink" title={doc.name}>
            {doc.name}
          </p>
          <p className="truncate text-[11px] text-ink-muted">{formatRelative(doc.updatedAt, now)}</p>
        </div>
        <StatusBadge status={doc.status} />
        {owner ? <UserAvatar user={owner} size="xs" /> : null}
      </Link>
    </li>
  );
}

function Empty({ label }: { label: string }) {
  return <p className="px-2 py-6 text-center text-[12.5px] text-ink-muted">{label}</p>;
}
