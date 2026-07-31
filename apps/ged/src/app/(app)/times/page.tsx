// Next
import type { Metadata } from "next";

// Components
import PageHeading from "@/components/PageHeading";
import TeamsView from "./_components/teams-view";

export const metadata: Metadata = {
  title: "Times",
};

export default function TimesPage() {
  return (
    <main className="mx-auto w-full max-w-[1400px] flex-1 px-4 py-8 md:px-8 md:py-10">
      <div className="flex flex-col gap-8">
        <PageHeading
          eyebrow="Microsoft 365"
          title="Times"
          subtitle="Equipes do Microsoft Teams do ambiente do cliente e as bibliotecas do SharePoint conectadas a cada uma."
        />
        <TeamsView />
      </div>
    </main>
  );
}
