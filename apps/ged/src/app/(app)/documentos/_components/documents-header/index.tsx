"use client";

// React
import { useState } from "react";

// Libs
import { Upload } from "lucide-react";

export default function DocumentsHeader() {
  const [hint, setHint] = useState(false);

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-[26px] font-semibold tracking-tight text-ink">Documentos</h1>
        <p className="mt-1 text-[13.5px] text-ink-muted">
          Biblioteca corporativa — segura, versionada e conectada.
        </p>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setHint((v) => !v)}
          className="flex h-9 items-center gap-2 rounded-full bg-brand-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
        >
          <Upload className="h-3.5 w-3.5" aria-hidden="true" />
          Enviar
        </button>
        {hint ? (
          <div className="absolute right-0 top-11 z-10 w-64 animate-fade-rise rounded-xl border border-hairline bg-surface-elevated p-3 text-[12px] text-ink-soft soft-shadow-lg">
            <p className="font-medium text-ink">Em breve</p>
            <p className="mt-1 text-ink-muted">
              O envio publicará direto na biblioteca do SharePoint conectada. Por ora, é uma
              simulação.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
