"use client";

// React
import { useState } from "react";

// Libs
import {
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  ExternalLink,
  FolderTree,
  Gauge,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

// Services
import { useConnector } from "@/services/connectors";

// Utils
import { cn } from "@/lib/utils";
import { formatDateTime, formatRelative } from "@/utils/format";

// Types
import type { ConnectorHealth, SyncEvent } from "@/data/connectors";

const HEALTH: Record<ConnectorHealth, { label: string; dot: string; wrapper: string }> = {
  healthy: { label: "Saudável", dot: "bg-emerald-500", wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700" },
  degraded: { label: "Degradado", dot: "bg-amber-500", wrapper: "border-amber-200 bg-amber-50 text-amber-700" },
  down: { label: "Offline", dot: "bg-rose-500", wrapper: "border-rose-200 bg-rose-50 text-rose-700" },
};

const SYNC_STATUS: Record<SyncEvent["status"], { label: string; className: string }> = {
  ok: { label: "OK", className: "text-emerald-600" },
  partial: { label: "Parcial", className: "text-amber-600" },
  error: { label: "Erro", className: "text-rose-600" },
};

export default function ConnectorPanel() {
  const [now] = useState(() => Date.now());
  const { data: connector } = useConnector();
  const health = HEALTH[connector.health];

  return (
    <div className="flex animate-fade-rise flex-col gap-5">
      {/* Card principal */}
      <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface-elevated p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
              <Cloud className="h-5 w-5" strokeWidth={1.9} aria-hidden="true" />
            </span>
            <div>
              <h2 className="flex items-center gap-2 text-[16px] font-semibold tracking-tight text-ink">
                {connector.provider}
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[11px] font-medium",
                    health.wrapper,
                  )}
                >
                  <span className="relative flex h-1.5 w-1.5 items-center justify-center">
                    <span
                      className={cn("absolute inline-flex h-full w-full rounded-full opacity-70", health.dot)}
                      style={{ animation: "ping-soft 2s cubic-bezier(0,0,0.2,1) infinite" }}
                    />
                    <span className={cn("relative h-1.5 w-1.5 rounded-full", health.dot)} />
                  </span>
                  {health.label}
                </span>
              </h2>
              <p className="mt-0.5 text-[12.5px] text-ink-muted">{connector.siteName}</p>
              <a
                href={connector.siteUrl}
                className="mt-1 inline-flex items-center gap-1 text-[12px] text-brand-600 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {connector.siteUrl}
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </div>
          </div>

          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-lg border border-hairline bg-surface-elevated px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:border-brand-200 hover:text-ink"
          >
            <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />
            Sincronizar agora
          </button>
        </div>

        {/* Métricas */}
        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Metric icon={Database} label="Itens rastreados" value={connector.itemsTracked.toLocaleString("pt-BR")} />
          <Metric icon={FolderTree} label="Bibliotecas" value={String(connector.librariesTracked)} />
          <Metric icon={Gauge} label="Latência" value={`${connector.latencyMs} ms`} />
          <Metric
            icon={Clock}
            label="Última sync"
            value={formatRelative(connector.lastSyncAt, now)}
          />
        </div>

        {/* Escopos */}
        <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-hairline pt-4">
          <span className="flex items-center gap-1.5 text-[11.5px] font-medium text-ink-soft">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
            Escopos concedidos:
          </span>
          {connector.scopes.map((scope) => (
            <span
              key={scope}
              className="rounded-md border border-hairline bg-surface/60 px-2 py-0.5 font-mono text-[11px] text-ink-soft"
            >
              {scope}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.3fr_1fr]">
        {/* Histórico de sync */}
        <div className="rounded-xl border border-hairline bg-surface-elevated p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <RefreshCw className="h-4 w-4 text-brand-500" aria-hidden="true" />
              Histórico de sincronização
            </h3>
            <span className="text-[11.5px] text-ink-muted">
              próxima {formatRelative(connector.nextSyncAt, now)}
            </span>
          </div>
          <ol className="flex flex-col divide-y divide-hairline">
            {connector.history.map((event) => {
              const status = SYNC_STATUS[event.status];
              return (
                <li key={event.id} className="flex items-center gap-3 py-2.5">
                  <CheckCircle2
                    className={cn("h-4 w-4 shrink-0", status.className)}
                    aria-hidden="true"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] text-ink">{event.detail}</p>
                    <p className="text-[11px] text-ink-faint">{formatDateTime(event.at)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[12px] font-medium text-ink">
                      {event.itemsSynced} {event.itemsSynced === 1 ? "item" : "itens"}
                    </p>
                    <p className={cn("text-[11px] font-medium", status.className)}>
                      {status.label} · {(event.durationMs / 1000).toFixed(1)}s
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* Conectores disponíveis */}
        <div className="rounded-xl border border-hairline bg-surface-elevated p-4">
          <h3 className="mb-1 flex items-center gap-2 text-[14px] font-semibold text-ink">
            <Plus className="h-4 w-4 text-brand-500" aria-hidden="true" />
            Adicionar conector
          </h3>
          <p className="mb-4 text-[12px] text-ink-muted">
            Amplie a base conectando outras fontes de documentos.
          </p>
          <ul className="flex flex-col gap-2">
            {[
              { name: "OneDrive", desc: "Arquivos pessoais e compartilhados" },
              { name: "Google Drive", desc: "Documentos e planilhas do Workspace" },
              { name: "Dropbox", desc: "Pastas de equipe" },
            ].map((c) => (
              <li
                key={c.name}
                className="flex items-center gap-3 rounded-xl border border-dashed border-hairline-strong px-3 py-2.5"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-ink-faint">
                  <Cloud className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[12.5px] font-medium text-ink-soft">{c.name}</p>
                  <p className="truncate text-[11px] text-ink-muted">{c.desc}</p>
                </div>
                <span className="rounded-full border border-hairline bg-surface px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-ink-muted">
                  soon
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function Metric({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Database;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg bg-surface-alt/60 p-3">
      <p className="flex items-center gap-1.5 text-[11px] text-ink-muted">
        <Icon className="h-3.5 w-3.5 text-ink-faint" strokeWidth={1.9} aria-hidden="true" />
        {label}
      </p>
      <p className="mt-1 text-[16px] font-semibold tracking-tight text-ink">{value}</p>
    </div>
  );
}
