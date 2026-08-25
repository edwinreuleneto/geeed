"use client";

// React
import { useEffect, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Lib
import { isAuthenticated } from "@/lib/auth";

/**
 * Portão de autenticação (client-side, mock). Renderiza o conteúdo apenas quando há
 * sessão; caso contrário, redireciona para /login. Como não há backend, a checagem
 * roda no cliente após a montagem.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setAuthed(true);
    } else {
      router.replace("/login");
    }
  }, [router]);

  if (!authed) return null;

  return <>{children}</>;
}
