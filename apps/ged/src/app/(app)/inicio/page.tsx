// Next
import type { Metadata } from "next";

// Components
import Dashboard from "./_components/dashboard";

export const metadata: Metadata = {
  title: "Visão geral",
};

export default function InicioPage() {
  return (
    <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 md:px-8 md:py-8">
      <Dashboard />
    </main>
  );
}
