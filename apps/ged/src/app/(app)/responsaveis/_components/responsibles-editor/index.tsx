"use client";

// React
import { useState } from "react";

// Libs
import { ArrowDown, ArrowUp, FolderPlus, Plus, Trash2, X } from "lucide-react";

// Components
import UserAvatar from "@/components/UserAvatar";

// Services
import { useUsersQuery } from "@/services/documents";
import {
  useAddDepartment,
  useDepartments,
  useRemoveDepartment,
  useResponsibles,
  useSetDepartmentChain,
} from "@/services/approvals";

// Utils
import { stepLabelFor } from "@/app/(app)/documentos/[docId]/_components/publish-button/chain";

// Types
import type { GedUser } from "@/types/ged";

export default function ResponsiblesEditor() {
  const { data: users = [] } = useUsersQuery();
  const { data: departments = [] } = useDepartments();
  const { data: responsibles } = useResponsibles();
  const setChain = useSetDepartmentChain();
  const addDepartment = useAddDepartment();
  const removeDepartment = useRemoveDepartment();

  const [newDept, setNewDept] = useState("");

  const userMap = new Map<string, GedUser>(users.map((u) => [u.id, u]));

  function update(department: string, approverIds: string[]) {
    setChain.mutate({ department, approverIds });
  }

  function createDept(e: React.FormEvent) {
    e.preventDefault();
    const name = newDept.trim();
    if (!name) return;
    addDepartment.mutate(name);
    setNewDept("");
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Novo departamento */}
      <form
        onSubmit={createDept}
        className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-elevated p-2.5"
      >
        <FolderPlus className="ml-1 h-4 w-4 shrink-0 text-ink-faint" aria-hidden="true" />
        <input
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          placeholder="Novo departamento ou setor…"
          className="h-9 min-w-0 flex-1 rounded-lg border border-hairline bg-surface-alt/60 px-3 text-[13px] text-ink placeholder:text-ink-faint focus:border-brand-400 focus:bg-surface-elevated focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newDept.trim() || addDepartment.isPending}
          className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-brand-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          Criar
        </button>
      </form>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {departments.map((dept) => {
          const chain = responsibles?.[dept] ?? [];
          const available = users.filter((u) => !chain.includes(u.id));
          return (
            <div key={dept} className="rounded-xl border border-hairline bg-surface-elevated p-3.5">
              <div className="mb-2.5 flex items-center justify-between gap-2">
                <p className="text-[13px] font-semibold text-ink">{dept}</p>
                <button
                  type="button"
                  onClick={() => removeDepartment.mutate(dept)}
                  className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-rose-50 hover:text-rose-600"
                  aria-label={`Remover ${dept}`}
                  title="Remover departamento"
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>

              {chain.length === 0 ? (
                <p className="mb-2 text-[12px] text-ink-faint">
                  Sem responsáveis — cai na cadeia padrão (Diretoria).
                </p>
              ) : (
                <ol className="mb-2.5 flex flex-col gap-1.5">
                  {chain.map((id, i) => {
                    const user = userMap.get(id);
                    return (
                      <li
                        key={id}
                        className="flex items-center gap-2 rounded-lg border border-hairline bg-surface/50 px-2 py-1.5"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-50 text-[10px] font-semibold text-brand-700 tabular-nums">
                          {i + 1}
                        </span>
                        {user ? <UserAvatar user={user} size="xs" /> : null}
                        <div className="min-w-0 flex-1 leading-tight">
                          <p className="truncate text-[12px] font-medium text-ink">
                            {user?.name ?? id}
                          </p>
                          <p className="truncate text-[10.5px] text-ink-faint">
                            {stepLabelFor(i + 1, chain.length)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => update(dept, move(chain, i, -1))}
                          disabled={i === 0}
                          className="rounded p-1 text-ink-faint transition-colors hover:text-ink disabled:opacity-30"
                          aria-label="Subir"
                        >
                          <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => update(dept, move(chain, i, 1))}
                          disabled={i === chain.length - 1}
                          className="rounded p-1 text-ink-faint transition-colors hover:text-ink disabled:opacity-30"
                          aria-label="Descer"
                        >
                          <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => update(dept, chain.filter((x) => x !== id))}
                          className="rounded p-1 text-ink-faint transition-colors hover:text-rose-600"
                          aria-label="Remover responsável"
                        >
                          <X className="h-3.5 w-3.5" aria-hidden="true" />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}

              {/* Adicionar responsável */}
              {available.length > 0 ? (
                <label className="relative flex items-center gap-2 rounded-lg border border-dashed border-hairline-strong bg-surface/40 px-2.5 py-1.5 text-[12px] text-ink-muted transition-colors focus-within:border-brand-400">
                  <Plus className="h-3.5 w-3.5 shrink-0 text-brand-500" aria-hidden="true" />
                  <span className="shrink-0">Adicionar responsável</span>
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value) update(dept, [...chain, e.target.value]);
                    }}
                    className="ml-auto min-w-0 flex-1 cursor-pointer bg-transparent text-right text-[12px] text-ink-soft focus:outline-none"
                    aria-label={`Adicionar responsável em ${dept}`}
                  >
                    <option value="">selecionar…</option>
                    {available.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </label>
              ) : (
                <p className="text-[11.5px] text-ink-faint">Todos os usuários já são responsáveis.</p>
              )}
            </div>
          );
        })}
      </div>

      {departments.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-hairline-strong px-4 py-12 text-center">
          <FolderPlus className="h-5 w-5 text-ink-faint" aria-hidden="true" />
          <p className="text-[13px] text-ink-muted">Nenhum departamento. Crie o primeiro acima.</p>
        </div>
      ) : null}
    </div>
  );
}

/** Move um item da cadeia para cima/baixo, retornando um novo array. */
function move(chain: string[], index: number, dir: -1 | 1): string[] {
  const next = [...chain];
  const target = index + dir;
  if (target < 0 || target >= next.length) return next;
  [next[index], next[target]] = [next[target]!, next[index]!];
  return next;
}
