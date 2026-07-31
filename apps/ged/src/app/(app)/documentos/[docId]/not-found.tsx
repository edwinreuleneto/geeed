// Next
import Link from "next/link";

// Libs
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-50 text-brand-500">
        <FileQuestion className="h-6 w-6" aria-hidden="true" />
      </div>
      <h1 className="text-[18px] font-semibold text-ink">Documento não encontrado</h1>
      <p className="mt-1 max-w-sm text-[13px] text-ink-muted">
        Ele pode ter sido movido, arquivado ou você não tem permissão para vê-lo.
      </p>
      <Link
        href="/documentos"
        className="mt-5 inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3.5 py-2 text-[13px] font-medium text-white transition-colors hover:bg-brand-700"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Voltar aos documentos
      </Link>
    </main>
  );
}
