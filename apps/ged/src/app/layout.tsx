// Next
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

// Providers
import QueryProvider from "@/providers/QueryProvider";

// Styles
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-primary",
  display: "swap",
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-primary-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MinimalTech · GED",
    template: "%s · MinimalTech",
  },
  description: "MinimalTech — Gestão Eletrônica de Documentos, segura e conectada ao Microsoft 365",
  robots: { index: false, follow: false },
  openGraph: {
    title: "MinimalTech · GED",
    description: "Gestão Eletrônica de Documentos, segura e conectada ao Microsoft 365",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
