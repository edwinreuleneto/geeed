"use client";

// React
import { useMemo, useState } from "react";

// Libs
import { Check, CornerDownLeft, Sparkles, Tag } from "lucide-react";

// Services
import { useAiInsight } from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { formatRelative } from "@/utils/format";
import { semanticScore } from "@/utils/semantic";

interface AiPanelProps {
  docId: string;
  now: number;
}

export default function AiPanel({ docId, now }: AiPanelProps) {
  const { data: insight } = useAiInsight(docId);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);

  // Candidatos de resposta = frases do resumo + destaques (recuperação simples).
  const candidates = useMemo(() => {
    if (!insight) return [];
    const sentences = insight.summary.split(/(?<=[.!?])\s+/).filter((s) => s.length > 12);
    return [...sentences, ...insight.highlights];
  }, [insight]);

  if (!insight) return null;

  function ask(q: string) {
    const query = q.trim();
    if (!query) return;
    setQuestion(query);
    let best = insight!.summary;
    let bestScore = 0;
    for (const c of candidates) {
      const { score } = semanticScore(query, c);
      if (score > bestScore) {
        bestScore = score;
        best = c;
      }
    }
    setAnswer(best);
  }

  const confidencePct = Math.round(insight.confidence * 100);

  return (
    <section className="overflow-hidden rounded-xl border border-hairline bg-surface-elevated">
      <header className="flex items-center gap-2 border-b border-hairline px-4 py-3">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-brand-50 text-brand-600">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <h2 className="text-[13.5px] font-semibold text-ink">Resumo inteligente</h2>
        <span className="ml-auto rounded-full bg-surface-alt px-2 py-0.5 text-[10.5px] font-medium text-ink-muted">
          IA · {confidencePct}%
        </span>
      </header>

      <div className="flex flex-col gap-3.5 p-4">
        <p className="text-[12.5px] leading-relaxed text-ink-soft">{insight.summary}</p>

        <div>
          <p className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            Destaques
          </p>
          <ul className="flex flex-col gap-1.5">
            {insight.highlights.map((h) => (
              <li key={h} className="flex items-start gap-2 text-[12.5px] text-ink-soft">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" aria-hidden="true" />
                {h}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
            <Tag className="h-3 w-3" aria-hidden="true" />
            Tags sugeridas
          </p>
          <div className="flex flex-wrap gap-1.5">
            {insight.suggestedTags.map((t) => (
              <span
                key={t}
                className="rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Perguntar à IA */}
        <div className="border-t border-hairline pt-3.5">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              ask(question);
            }}
            className="relative"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Pergunte sobre este documento…"
              className="h-9 w-full rounded-lg border border-hairline bg-surface-alt/60 pl-3 pr-9 text-[12.5px] text-ink placeholder:text-ink-faint focus:border-brand-400 focus:bg-surface-elevated focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Perguntar"
              className="absolute right-1.5 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-ink-faint hover:text-ink"
            >
              <CornerDownLeft className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          </form>

          {answer ? (
            <div className="mt-2.5 animate-fade-rise rounded-lg bg-brand-50/60 p-3">
              <p className="flex items-center gap-1.5 text-[11px] font-medium text-brand-700">
                <Sparkles className="h-3 w-3" aria-hidden="true" />
                Resposta da IA
              </p>
              <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{answer}</p>
            </div>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {insight.suggestedQuestions.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => ask(q)}
                  className={cn(
                    "rounded-full border border-hairline bg-surface-elevated px-2.5 py-1 text-[11px] text-ink-soft transition-colors hover:border-brand-300 hover:text-brand-700",
                  )}
                >
                  {q}
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10.5px] text-ink-faint">
          Processado por IA · {formatRelative(insight.processedAt, now)} · revise antes de decisões
          críticas.
        </p>
      </div>
    </section>
  );
}
