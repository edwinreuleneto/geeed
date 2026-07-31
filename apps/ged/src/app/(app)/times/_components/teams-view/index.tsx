"use client";

// React
import { useMemo, useState } from "react";

// Libs
import {
  ExternalLink,
  Hash,
  HardDrive,
  Lock,
  Share2,
  ShieldCheck,
  UserPlus,
  Users,
} from "lucide-react";

// Components
import AvatarStack from "@/components/AvatarStack";
import UserAvatar from "@/components/UserAvatar";

// Services
import { useTeams } from "@/services/teams";
import { useUsers } from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";

// Types
import type { ChannelKind, MsTeam, Sensitivity } from "@/data/teams";
import type { GedUser } from "@/types/ged";

const SENSITIVITY_TONE: Record<Sensitivity, string> = {
  Público: "bg-emerald-50 text-emerald-700",
  Interno: "bg-brand-50 text-brand-700",
  Confidencial: "bg-amber-50 text-amber-700",
  "Altamente Confidencial": "bg-rose-50 text-rose-700",
};

const CHANNEL_ICON: Record<ChannelKind, typeof Hash> = {
  standard: Hash,
  private: Lock,
  shared: Share2,
};

export default function TeamsView() {
  const [now] = useState(() => Date.now());
  const { data: teams } = useTeams();
  const { data: users } = useUsers();

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const totals = useMemo(() => {
    const members = new Set<string>();
    let items = 0;
    let storage = 0;
    for (const t of teams) {
      t.memberIds.forEach((m) => members.add(m));
      items += t.itemCount;
      storage += t.storageMb;
    }
    return { teams: teams.length, members: members.size, items, storageGb: storage / 1024 };
  }, [teams]);

  return (
    <div className="flex animate-fade-rise flex-col gap-6">
      {/* Resumo */}
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline lg:grid-cols-4">
        <Summary label="Times" value={String(totals.teams)} />
        <Summary label="Membros" value={String(totals.members)} />
        <Summary label="Itens sincronizados" value={totals.items.toLocaleString("pt-BR")} />
        <Summary label="Armazenamento" value={`${totals.storageGb.toFixed(1)} GB`} />
      </div>

      {/* Times */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {teams.map((team) => (
          <TeamCard
            key={team.id}
            team={team}
            owner={userMap.get(team.ownerId)}
            members={team.memberIds.map((id) => userMap.get(id)).filter(Boolean) as GedUser[]}
            now={now}
          />
        ))}
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-elevated p-5">
      <span className="text-[12px] font-medium text-ink-muted">{label}</span>
      <p className="display mt-2 text-[2rem] font-semibold leading-none text-ink">{value}</p>
    </div>
  );
}

function TeamCard({
  team,
  owner,
  members,
  now,
}: {
  team: MsTeam;
  owner?: GedUser;
  members: GedUser[];
  now: number;
}) {
  return (
    <section className="flex flex-col overflow-hidden rounded-[18px] bg-surface-elevated ring-1 ring-hairline">
      {/* Header */}
      <div className="flex items-start gap-3.5 p-5">
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[14px] text-white"
          style={{ background: team.accent }}
        >
          <Users className="h-6 w-6" strokeWidth={2} aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[16px] font-semibold tracking-tight text-ink">{team.name}</h2>
          <p className="mt-0.5 line-clamp-1 text-[13px] text-ink-muted">{team.description}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <Badge className={SENSITIVITY_TONE[team.sensitivity]}>
              <ShieldCheck className="h-3 w-3" aria-hidden="true" />
              {team.sensitivity}
            </Badge>
            <Badge className="bg-surface-alt text-ink-muted">
              <Lock className="h-3 w-3" aria-hidden="true" />
              {team.visibility === "private" ? "Privado" : "Público"}
            </Badge>
            {team.guestAccess ? (
              <Badge className="bg-surface-alt text-ink-muted">
                <UserPlus className="h-3 w-3" aria-hidden="true" />
                Convidados
              </Badge>
            ) : null}
          </div>
        </div>
        <AvatarStack users={members} size="sm" max={4} />
      </div>

      {/* Canais */}
      <div className="border-t border-hairline px-5 py-4">
        <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Canais</p>
        <ul className="flex flex-wrap gap-1.5">
          {team.channels.map((ch) => {
            const Icon = CHANNEL_ICON[ch.kind];
            return (
              <li
                key={ch.name}
                className="inline-flex items-center gap-1.5 rounded-lg bg-surface-alt px-2.5 py-1 text-[12.5px] text-ink-soft"
              >
                <Icon className="h-3 w-3 text-ink-faint" aria-hidden="true" />
                {ch.name}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Rodapé: biblioteca + métricas */}
      <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-hairline px-5 py-3.5 text-[12.5px] text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          {owner ? <UserAvatar user={owner} size="xs" /> : null}
          <span>Proprietário {owner?.name.split(" ")[0]}</span>
        </span>
        <span className="inline-flex items-center gap-1.5">
          <HardDrive className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
          {team.itemCount} itens · {(team.storageMb / 1024).toFixed(1)} GB
        </span>
        <span className="text-ink-faint">atividade {formatRelative(team.lastActivityAt, now)}</span>
        <a
          href={team.siteUrl}
          target="_blank"
          rel="noreferrer"
          className="ml-auto inline-flex items-center gap-1 text-brand-600 hover:underline"
        >
          {team.libraryName}
          <ExternalLink className="h-3 w-3" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium",
        className,
      )}
    >
      {children}
    </span>
  );
}
