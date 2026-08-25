// Components
import AppShell from "@/components/AppShell";
import DemoReset from "@/components/DemoReset";
import AuthGuard from "@/components/AuthGuard";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <DemoReset />
      <AppShell>{children}</AppShell>
    </AuthGuard>
  );
}
