"use client";

// React
import { useRef, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Libs
import { AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";

// Components
import UploadSync from "../upload-sync";

// Data
import { addUpload } from "@/data/uploads";

// Services
import { documentsKeys } from "@/services/documents";

// Types
import type { GedDocument } from "@/types/ged";

export default function UploadButton() {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const queryClient = useQueryClient();
  const [sync, setSync] = useState<{ docs: GedDocument[]; label: string } | null>(null);

  function onFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    const docs = list.map(addUpload);
    const label = docs.length === 1 ? docs[0]!.name : `${docs.length} arquivos`;
    setSync({ docs, label });
  }

  function handleComplete() {
    // Só agora o documento "aparece" na biblioteca — o efeito mágico do sync.
    queryClient.invalidateQueries({ queryKey: documentsKeys.all });
    queryClient.invalidateQueries({ queryKey: documentsKeys.folders() });
  }

  function handleView() {
    const id = sync?.docs[0]?.id;
    setSync(null);
    if (id) router.push(`/documentos/${id}`);
  }

  return (
    <>
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

      <AnimatePresence>
        {sync ? (
          <UploadSync
            fileLabel={sync.label}
            kind={sync.docs[0]!.kind}
            onComplete={handleComplete}
            onView={handleView}
            onClose={() => setSync(null)}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
