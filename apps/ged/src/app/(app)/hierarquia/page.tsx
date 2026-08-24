// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import HierarchyTree from "./_components/hierarchy-tree";

export const metadata: Metadata = {
  title: "Hierarquia",
};

export default function HierarquiaPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Biblioteca"
          title="Hierarquia de documentos"
          subtitle="Navegue pela estrutura de pastas e subpastas até os documentos."
        />
        <HierarchyTree />
      </div>
    </main>
  );
}
