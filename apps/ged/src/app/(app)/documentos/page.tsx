// React
import { Suspense } from "react";

// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import UploadButton from "./_components/upload-button";
import DocumentsExplorer from "./_components/documents-explorer";

export const metadata: Metadata = {
  title: "Documentos",
};

export default function DocumentosPage() {
  return (
    <main className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Biblioteca"
          title="Documentos"
          subtitle="Todo o acervo da Campolongo em um só lugar — seguro, versionado e conectado ao SharePoint."
          actions={<UploadButton />}
        />
        <Suspense fallback={<div className="h-64 animate-pulse rounded-[18px] bg-black/5" />}>
          <DocumentsExplorer />
        </Suspense>
      </div>
    </main>
  );
}
