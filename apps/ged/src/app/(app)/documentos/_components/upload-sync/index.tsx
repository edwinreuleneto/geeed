"use client";

// React
import { useEffect, useRef, useState } from "react";

// Libs
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Cloud, FileSearch, Loader2, Search, Sparkles, Upload } from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import MicrosoftLogo from "@/components/MicrosoftLogo";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { DocumentKind } from "@/types/ged";

interface UploadSyncProps {
  fileLabel: string;
  kind: DocumentKind;
  onComplete: () => void; // invalida as queries (o doc "aparece" na biblioteca)
  onView: () => void;
  onClose: () => void;
}

const STEPS = [
  { label: "Enviando arquivo", icon: Upload },
  { label: "Sincronizando com o SharePoint", icon: Cloud },
  { label: "Extraindo metadados com IA", icon: Sparkles },
  { label: "Indexando para busca", icon: Search },
];

const STEP_MS = 720;

export default function UploadSync({ fileLabel, kind, onComplete, onView, onClose }: UploadSyncProps) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const timers: number[] = [];
    STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setStep(i + 1), (i + 1) * STEP_MS));
    });
    timers.push(
      window.setTimeout(() => {
        setDone(true);
        completeRef.current();
      }, STEPS.length * STEP_MS + 450),
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  const progress = done ? 100 : Math.round((step / STEPS.length) * 100);

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
    >
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-md" onClick={done ? onClose : undefined} aria-hidden="true" />

      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label="Sincronizando com o Microsoft 365"
        className="relative w-full max-w-[420px] overflow-hidden rounded-[24px] border border-hairline bg-surface-elevated soft-shadow-lg"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.97 }}
        transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* brilho de fundo */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-40 opacity-70"
          style={{
            background:
              "radial-gradient(60% 100% at 50% 0%, rgba(0,113,227,0.14), transparent 70%)",
          }}
          aria-hidden="true"
        />

        <div className="relative flex flex-col items-center px-6 pt-8 pb-6">
          {/* Anel mágico */}
          <div className="relative h-28 w-28">
            {/* sparkles orbitando */}
            {!done ? (
              <>
                <Sparkles className="absolute -left-1 top-2 h-4 w-4 text-brand-400 animate-halo-pulse" aria-hidden="true" />
                <Sparkles className="absolute -right-1 bottom-4 h-3.5 w-3.5 text-amber-400 animate-halo-pulse" style={{ animationDelay: "0.5s" }} aria-hidden="true" />
                <Sparkles className="absolute right-4 -top-1 h-3 w-3 text-emerald-400 animate-halo-pulse" style={{ animationDelay: "1s" }} aria-hidden="true" />
              </>
            ) : null}

            <div
              className={cn("absolute inset-0 rounded-full", !done && "animate-spin")}
              style={
                done
                  ? { background: "#34c759" }
                  : {
                      background:
                        "conic-gradient(from 0deg, #F25022, #7FBA00, #00A4EF, #FFB900, #F25022)",
                      animationDuration: "2.6s",
                    }
              }
              aria-hidden="true"
            />
            <div className="absolute inset-[4px] flex items-center justify-center rounded-full bg-surface-elevated">
              {done ? (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 16 }}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500 text-white"
                >
                  <Check className="h-7 w-7" strokeWidth={3} aria-hidden="true" />
                </motion.span>
              ) : (
                <div className="relative flex items-center justify-center">
                  <DocTypeIcon kind={kind} size="lg" />
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-surface-elevated ring-1 ring-hairline">
                    <MicrosoftLogo className="h-3.5 w-3.5" />
                  </span>
                </div>
              )}
            </div>
          </div>

          <h2 className="mt-5 text-center text-[17px] font-semibold tracking-tight text-ink">
            {done ? "Sincronizado com o Microsoft 365" : "Sincronizando com o Microsoft 365"}
          </h2>
          <p className="mt-1 max-w-[300px] truncate text-center text-[12.5px] text-ink-muted" title={fileLabel}>
            {fileLabel}
          </p>

          {/* Barra de progresso */}
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-surface-alt">
            <motion.span
              className="block h-full rounded-full"
              style={{ background: done ? "#34c759" : "#0071e3" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Etapas */}
        <div className="relative border-t border-hairline px-6 py-4">
          <ul className="flex flex-col gap-2.5">
            {STEPS.map((s, i) => {
              const stepDone = done || i < step;
              const active = !done && i === step;
              return (
                <li key={s.label} className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors",
                      stepDone
                        ? "bg-emerald-100 text-emerald-600"
                        : active
                          ? "bg-brand-50 text-brand-600"
                          : "bg-surface-alt text-ink-faint",
                    )}
                  >
                    {stepDone ? (
                      <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
                    ) : active ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
                    ) : (
                      <s.icon className="h-3 w-3" aria-hidden="true" />
                    )}
                  </span>
                  <span className={cn("text-[13px]", stepDone || active ? "text-ink" : "text-ink-faint")}>
                    {s.label}
                  </span>
                  {active ? (
                    <span className="ml-auto text-[11px] text-brand-600">processando…</span>
                  ) : stepDone ? (
                    <Check className="ml-auto h-3.5 w-3.5 text-emerald-500" aria-hidden="true" />
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Rodapé */}
        <div className="relative flex items-center gap-2 border-t border-hairline bg-surface-alt/40 px-6 py-3.5">
          <span className="flex items-center gap-1.5 text-[11.5px] text-ink-muted">
            <FileSearch className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
            seguro, versionado e indexado
          </span>
          <div className="ml-auto flex items-center gap-2">
            <AnimatePresence>
              {done ? (
                <motion.div
                  initial={{ opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className="h-8 rounded-full px-3 text-[12.5px] font-medium text-ink-soft transition-colors hover:bg-black/[0.05]"
                  >
                    Concluir
                  </button>
                  <button
                    type="button"
                    onClick={onView}
                    className="flex h-8 items-center gap-1.5 rounded-full bg-brand-600 px-3.5 text-[12.5px] font-medium text-white transition-colors hover:bg-brand-700"
                  >
                    Ver documento
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </motion.div>
              ) : (
                <span className="text-[12px] font-medium tabular-nums text-ink-muted">{progress}%</span>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
