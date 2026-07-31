// Libs
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Data
import { db } from "@/data";
import { AI_INSIGHTS } from "@/data/ai";

// Utils
import { canView } from "@/utils/access";
import { semanticScore } from "@/utils/semantic";

// Types
import type { GedDocument } from "@/types/ged";

export interface SemanticResult {
  doc: GedDocument;
  score: number;
  matched: string[];
}

/** Texto pesquisável de um documento — inclui o resumo e as tags geradas pela IA. */
function searchableText(doc: GedDocument): string {
  const ai = AI_INSIGHTS[doc.id];
  return [
    doc.name,
    doc.tags.join(" "),
    doc.department,
    ai?.summary ?? "",
    ai?.highlights.join(" ") ?? "",
    ai?.suggestedTags.join(" ") ?? "",
  ].join(" ");
}

async function fetchSemantic(query: string): Promise<SemanticResult[]> {
  const [documents, currentUser] = await Promise.all([db.documents(), db.currentUser()]);
  return documents
    .filter((doc) => canView(doc, currentUser))
    .map((doc) => {
      const { score, matched } = semanticScore(query, searchableText(doc));
      return { doc, score, matched };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export const searchKeys = {
  semantic: (query: string) => ["search", "semantic", query] as const,
};

/** Busca por contexto (semântica). Vazia quando a consulta está em branco. */
export function useSemanticSearch(query: string, limit = 6) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: searchKeys.semantic(trimmed),
    queryFn: async () => (await fetchSemantic(trimmed)).slice(0, limit),
    enabled: trimmed.length > 1,
    placeholderData: keepPreviousData,
  });
}
