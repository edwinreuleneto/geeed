// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import ConnectorPanel from "./_components/connector-panel";

export const metadata: Metadata = {
  title: "Conectores",
};

export default function ConectoresPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Integrações"
          title="Conectores"
          subtitle="Fontes de documentos conectadas ao GED e a saúde de cada sincronização."
        />
        <ConnectorPanel />
      </div>
    </main>
  );
}
