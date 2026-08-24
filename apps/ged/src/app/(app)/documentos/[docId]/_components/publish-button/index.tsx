"use client";

// React
import { useState } from "react";

// Libs
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Loader2, Send, X } from "lucide-react";

// Components
import UserAvatar from "@/components/UserAvatar";

// Services
import { useResponsibles, useSubmitForApproval } from "@/services/approvals";

// Utils
import { stepLabelFor } from "./chain";

// Types
import type { GedDocument, GedUser } from "@/types/ged";

interface PublishButtonProps {
  document: GedDocument;
  users: GedUser[];
}

export default function PublishButton({ document, users }: PublishButtonProps) {
  const [open, setOpen] = useState(false);
  const { data: responsibles } = useResponsibles();
  const submit = useSubmitForApproval();

  const chain = responsibles?.[document.department] ?? [];
  const effectiveChain = chain.length > 0 ? chain : ["u-edwin"];

  function userById(id: string): GedUser | undefined {
    return users.find((u) => u.id === id);
  }

  async function handleConfirm() {
    await submit.mutateAsync(document.id);
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex h-9 items-center gap-2 rounded-full bg-brand-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
      >
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        Publicar para aprovação
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/20 p-4 pt-[12vh] backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            onClick={() => !submit.isPending && setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Confirmar publicação para aprovação"
          >
            <motion.div
              className="w-full max-w-md overflow-hidden rounded-2xl border border-hairline bg-surface-elevated soft-shadow-lg"
              initial={{ opacity: 0, y: -8, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.98 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-3 border-b border-hairline px-4 py-3.5">
                <div className="min-w-0">
                  <h2 className="text-[14px] font-semibold text-ink">Publicar para aprovação</h2>
                  <p className="mt-0.5 truncate text-[12px] text-ink-muted">{document.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={submit.isPending}
                  className="rounded-lg p-1 text-ink-faint transition-colors hover:bg-surface hover:text-ink disabled:opacity-50"
                  aria-label="Fechar"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="px-4 py-4">
                <p className="mb-3 text-[12.5px] text-ink-muted">
                  A cadeia de aprovação do departamento{" "}
                  <span className="font-medium text-ink-soft">{document.department}</span> será
                  acionada em ordem:
                </p>

                <ol className="relative flex flex-col gap-3 pl-4">
                  <span
                    className="absolute bottom-2 left-[5px] top-2 w-px bg-hairline-strong"
                    aria-hidden="true"
                  />
                  {effectiveChain.map((approverId, i) => {
                    const user = userById(approverId);
                    return (
                      <li key={`${approverId}-${i}`} className="relative flex items-center gap-2.5">
                        <span
                          className="absolute -left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border-2 border-surface-elevated bg-amber-500"
                          aria-hidden="true"
                        />
                        {user ? <UserAvatar user={user} size="sm" /> : null}
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-medium text-ink">{user?.name ?? approverId}</p>
                          <p className="text-[11px] text-ink-faint">
                            {stepLabelFor(i + 1, effectiveChain.length)}
                          </p>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-hairline px-4 py-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  disabled={submit.isPending}
                  className="flex h-9 items-center rounded-lg border border-hairline bg-surface-elevated px-3.5 text-[13px] font-medium text-ink-soft transition-colors hover:text-ink disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={submit.isPending}
                  className="flex h-9 items-center gap-2 rounded-full bg-brand-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
                >
                  {submit.isPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                  ) : (
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                  Publicar
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
