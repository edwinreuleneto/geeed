"use client";

// React
import { useMemo, useState } from "react";

// Next
import Link from "next/link";

// Libs
import { Lock, ShieldAlert, TrendingUp } from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import SecurityBadge from "@/components/SecurityBadge";
import UserAvatar from "@/components/UserAvatar";

// Services
import { useDocuments, useUsers } from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";
import { CLASSIFICATION } from "@/utils/labels";

// Types
import type { Classification, Department } from "@/types/ged";

const CLASS_ORDER: Classification[] = ["publico", "interno", "confidencial", "restrito"];
const DEPARTMENTS: Department[] = ["Financeiro", "Jurídico", "RH", "Comercial", "Operações", "TI"];

export default function SecurityOverview() {
  const [now] = useState(() => Date.now());
  const { data: documents } = useDocuments({ sort: "recent" });
  const { data: users } = useUsers();

  const userMap = useMemo(() => new Map(users.map((u) => [u.id, u])), [users]);

  const counts = useMemo(() => {
    const base: Record<Classification, number> = {
      publico: 0,
      interno: 0,
      confidencial: 0,
      restrito: 0,
    };
    for (const doc of documents) base[doc.classification] += 1;
    return base;
  }, [documents]);

  const total = documents.length;

  const sensitive = useMemo(
    () =>
      documents.filter(
        (d) => d.classification === "confidencial" || d.classification === "restrito",
      ),
    [documents],
  );

  // Matriz departamento × classificação
  const matrix = useMemo(() => {
    const grid = new Map<string, number>();
    for (const doc of documents) {
      const key = `${doc.department}|${doc.classification}`;
      grid.set(key, (grid.get(key) ?? 0) + 1);
    }
    return grid;
  }, [documents]);

  return (
    <div className="flex animate-fade-rise flex-col gap-6">
      {/* Tiles de classificação */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {CLASS_ORDER.map((c) => {
          const tone = CLASSIFICATION[c];
          const value = counts[c];
          const pct = total ? Math.round((value / total) * 100) : 0;
          return (
            <div
              key={c}
              className="rounded-xl border border-hairline bg-surface-elevated p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <SecurityBadge classification={c} />
                <span className="text-[11px] text-ink-faint">{pct}%</span>
              </div>
              <p className="text-[22px] font-semibold tracking-tight text-ink">{value}</p>
              <p className="text-[12px] text-ink-muted">
                {value === 1 ? "documento" : "documentos"}
              </p>
              <div className="mt-3 h-1 overflow-hidden rounded-full bg-surface-alt">
                <span
                  className={cn("block h-full rounded-full", tone.dot)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Matriz de acesso */}
        <div className="rounded-xl border border-hairline bg-surface-elevated p-4">
          <h2 className="mb-1 flex items-center gap-2 text-[14px] font-semibold text-ink">
            <TrendingUp className="h-4 w-4 text-brand-500" aria-hidden="true" />
            Distribuição por departamento
          </h2>
          <p className="mb-4 text-[12px] text-ink-muted">
            Quantos documentos cada área mantém em cada nível de sigilo.
          </p>
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full border-collapse text-[12px]">
              <thead>
                <tr className="text-ink-faint">
                  <th className="pb-2 text-left font-medium">Departamento</th>
                  {CLASS_ORDER.map((c) => (
                    <th key={c} className="pb-2 text-center font-medium">
                      {CLASSIFICATION[c].label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {DEPARTMENTS.map((dept) => (
                  <tr key={dept} className="border-t border-hairline">
                    <td className="py-2 pr-2 font-medium text-ink-soft">{dept}</td>
                    {CLASS_ORDER.map((c) => {
                      const value = matrix.get(`${dept}|${c}`) ?? 0;
                      return (
                        <td key={c} className="py-2 text-center">
                          {value > 0 ? (
                            <span
                              className={cn(
                                "inline-flex h-6 min-w-6 items-center justify-center rounded-md px-1.5 text-[11px] font-medium",
                                CLASSIFICATION[c].wrapper,
                              )}
                            >
                              {value}
                            </span>
                          ) : (
                            <span className="text-ink-faint">·</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Documentos sensíveis */}
        <div className="rounded-xl border border-hairline bg-surface-elevated p-4">
          <h2 className="mb-1 flex items-center gap-2 text-[14px] font-semibold text-ink">
            <ShieldAlert className="h-4 w-4 text-amber-500" aria-hidden="true" />
            Documentos sensíveis
          </h2>
          <p className="mb-4 text-[12px] text-ink-muted">
            Itens confidenciais e restritos que exigem controle de acesso explícito.
          </p>
          <ul className="flex flex-col gap-2">
            {sensitive.map((doc) => {
              const owner = userMap.get(doc.ownerId);
              const grants = doc.permissions.length;
              return (
                <li key={doc.id}>
                  <Link
                    href={`/documentos/${doc.id}`}
                    className="group flex items-center gap-3 rounded-xl border border-hairline bg-surface/40 px-3 py-2 transition-colors hover:border-brand-200 hover:bg-surface-elevated"
                  >
                    <DocTypeIcon kind={doc.kind} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[12.5px] font-medium text-ink">{doc.name}</p>
                      <p className="truncate text-[11px] text-ink-muted">
                        {doc.department} · atualizado {formatRelative(doc.updatedAt, now)}
                      </p>
                    </div>
                    <span className="flex items-center gap-1 text-[11px] text-ink-muted">
                      <Lock className="h-3 w-3" aria-hidden="true" />
                      {grants}
                    </span>
                    {owner ? <UserAvatar user={owner} size="xs" /> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
