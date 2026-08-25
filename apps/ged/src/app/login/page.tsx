"use client";

// React
import { useEffect, useState } from "react";

// Next
import { useRouter } from "next/navigation";

// Libs
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck } from "lucide-react";

// Components
import MicrosoftLogo from "@/components/MicrosoftLogo";

// Lib
import { isAuthenticated, login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Já autenticado: pula direto para o app.
  useEffect(() => {
    if (isAuthenticated()) router.replace("/inicio");
  }, [router]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    if (login(email, password)) {
      router.replace("/inicio");
    } else {
      setError(true);
      setSubmitting(false);
    }
  }

  return (
    <main className="grid min-h-screen bg-surface lg:grid-cols-[1.05fr_1fr]">
      {/* Painel de marca (desktop) */}
      <aside
        className="relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"
        style={{ backgroundImage: "linear-gradient(150deg, #0a84ff 0%, #0071e3 52%, #0052a8 100%)" }}
      >
        {/* brilhos decorativos */}
        <span
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full opacity-40"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.5), transparent 70%)" }}
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full opacity-30"
          style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.35), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-white/15 text-[17px] font-semibold ring-1 ring-white/25 backdrop-blur-sm">
            M
          </span>
          <span className="text-[15px] font-semibold tracking-tight">MinimalTech</span>
        </div>

        <div className="relative max-w-md">
          <h2 className="display text-[30px] font-semibold leading-[1.15] tracking-tight">
            A gestão dos seus documentos, segura e conectada.
          </h2>
          <p className="mt-4 text-[14px] leading-relaxed text-white/80">
            Aprovações, classificação de sensibilidade e trilha de auditoria — integrados ao
            Microsoft 365.
          </p>
        </div>

        <div className="relative inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 text-[12px] font-medium ring-1 ring-white/20 backdrop-blur-sm">
          <MicrosoftLogo className="h-4 w-4" />
          Conectado ao SharePoint &amp; Teams
          <span className="relative ml-0.5 flex h-2 w-2">
            <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-emerald-300 opacity-75" aria-hidden="true" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" aria-hidden="true" />
          </span>
        </div>
      </aside>

      {/* Formulário */}
      <section className="relative flex items-center justify-center px-5 py-10">
        {/* brilho suave no mobile */}
        <span
          className="pointer-events-none absolute -top-24 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-60 lg:hidden"
          style={{ background: "radial-gradient(closest-side, rgba(0,113,227,0.14), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="relative w-full max-w-[360px] animate-fade-rise">
          {/* Marca (mobile) */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <span
              className="flex h-12 w-12 items-center justify-center rounded-[14px] text-[19px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]"
              style={{ backgroundImage: "linear-gradient(140deg, #0a84ff 0%, #0071e3 55%, #0058b0 100%)" }}
            >
              M
            </span>
          </div>

          <div className="mb-6">
            <h1 className="display text-[24px] font-semibold tracking-tight text-ink">Entrar</h1>
            <p className="mt-1.5 text-[13.5px] text-ink-muted">
              Acesse a Gestão Eletrônica de Documentos da MinimalTech.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-soft">E-mail</span>
              <span className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                <input
                  type="email"
                  autoComplete="username"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError(false);
                  }}
                  placeholder="voce@empresa.com"
                  className="h-11 w-full rounded-[12px] border border-hairline bg-surface-elevated pl-9 pr-3 text-[14px] text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100/60"
                  required
                />
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[12.5px] font-medium text-ink-soft">Senha</span>
              <span className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" aria-hidden="true" />
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(false);
                  }}
                  placeholder="••••••"
                  className="h-11 w-full rounded-[12px] border border-hairline bg-surface-elevated pl-9 pr-3 text-[14px] text-ink placeholder:text-ink-faint focus:border-brand-400 focus:outline-none focus:ring-4 focus:ring-brand-100/60"
                  required
                />
              </span>
            </label>

            {error ? (
              <p className="rounded-[10px] border border-rose-200 bg-rose-50 px-3 py-2 text-[12.5px] text-rose-700">
                E-mail ou senha inválidos.
              </p>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="group mt-1 flex h-11 items-center justify-center gap-2 rounded-full bg-brand-600 px-4 text-[14px] font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 flex items-center justify-center gap-1.5 text-[11.5px] text-ink-faint">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            Acesso restrito · conexão segura
          </p>
        </div>
      </section>
    </main>
  );
}
