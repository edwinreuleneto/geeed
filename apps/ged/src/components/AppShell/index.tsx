"use client";

// React
import { useState } from "react";

// Components
import Sidebar from "./Sidebar";
import AppTopbar from "./AppTopbar";
import MobileNav from "./MobileNav";
import { CommandPaletteProvider } from "@/components/CommandPalette";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [mobileNav, setMobileNav] = useState(false);

  return (
    <CommandPaletteProvider>
      <div className="flex min-h-screen bg-surface">
        <aside className="sticky top-0 hidden h-screen md:block">
          <Sidebar />
        </aside>

        <MobileNav open={mobileNav} onClose={() => setMobileNav(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <AppTopbar onMenu={() => setMobileNav(true)} />
          {children}
        </div>
      </div>
    </CommandPaletteProvider>
  );
}
