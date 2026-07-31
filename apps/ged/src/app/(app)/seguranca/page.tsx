// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import SecurityOverview from "./_components/security-overview";

export const metadata: Metadata = {
  title: "Segurança & Acesso",
};

export default function SegurancaPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Governança"
          title="Segurança & Acesso"
          subtitle="Panorama de classificação, sensibilidade e controle de acesso de toda a base."
        />
        <SecurityOverview />
      </div>
    </main>
  );
}
