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
    default: "GED",
    template: "%s · GED",
  },
  description: "Gestão Eletrônica de Documentos — segura, rastreável e conectada",
  robots: { index: false, follow: false },
  openGraph: {
    title: "GED",
    description: "Gestão Eletrônica de Documentos — segura, rastreável e conectada",
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
