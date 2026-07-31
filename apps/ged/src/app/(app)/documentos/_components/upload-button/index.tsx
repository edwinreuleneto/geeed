"use client";

// React
import { useRef, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Libs
import { useQueryClient } from "@tanstack/react-query";
import { Check, Upload } from "lucide-react";

// Data
import { addUpload } from "@/data/uploads";

// Services
import { documentsKeys } from "@/services/documents";

export default function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [added, setAdded] = useState<string | null>(null);

  function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const docs = list.map(addUpload);

    queryClient.invalidateQueries({ queryKey: documentsKeys.all });
    queryClient.invalidateQueries({ queryKey: documentsKeys.folders() });

    setAdded(docs.length === 1 ? docs[0]!.name : `${docs.length} arquivos`);
    router.push("/documentos");
    window.setTimeout(() => setAdded(null), 4000);
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          onFiles(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-9 items-center gap-2 rounded-full bg-brand-600 px-4 text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
      >
        <Upload className="h-3.5 w-3.5" aria-hidden="true" />
        Enviar documento
      </button>

      {added ? (
        <div className="absolute right-0 top-12 z-10 flex w-72 animate-fade-rise items-start gap-2.5 rounded-xl border border-hairline bg-surface-elevated p-3 soft-shadow-lg">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
          </span>
          <div className="min-w-0">
            <p className="text-[12.5px] font-medium text-ink">Enviado nesta sessão</p>
            <p className="mt-0.5 truncate text-[11.5px] text-ink-muted" title={added}>
              {added} · disponível na biblioteca
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
