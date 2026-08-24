// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import ApprovalsExplorer from "./_components/approvals-explorer";

export const metadata: Metadata = {
  title: "Aprovações",
};

export default function AprovacoesPage() {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Governança"
          title="Aprovações"
          subtitle="Documentos que aguardam a sua decisão e o acompanhamento do que você enviou."
        />
        <ApprovalsExplorer />
      </div>
    </main>
  );
}
