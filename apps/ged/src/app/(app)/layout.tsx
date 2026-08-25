// Components
import AppShell from "@/components/AppShell";
import DemoReset from "@/components/DemoReset";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <DemoReset />
      <AppShell>{children}</AppShell>
    </>
  );
}
