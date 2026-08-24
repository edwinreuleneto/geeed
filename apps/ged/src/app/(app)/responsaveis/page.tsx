// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import ResponsiblesEditor from "./_components/responsibles-editor";

export const metadata: Metadata = {
  title: "Responsáveis",
};

export default function ResponsaveisPage() {
  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Governança"
          title="Responsáveis por aprovação"
          subtitle="Crie setores e defina a cadeia de aprovadores de cada um. A ordem determina as etapas do fluxo."
        />
        <ResponsiblesEditor />
      </div>
    </main>
  );
}
