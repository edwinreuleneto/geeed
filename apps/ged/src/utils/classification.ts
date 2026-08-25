// Definição única de "documento sensível". Um documento é sensível quando sua
// classificação é Confidencial ou Restrito — os dois níveis mais altos.
// Manter esta regra em um só lugar para dashboard, filtros e legendas baterem.

// Types
import type { Classification, GedDocument } from "@/types/ged";

/** Classificações consideradas sensíveis. */
export const SENSITIVE_CLASSIFICATIONS: readonly Classification[] = ["confidencial", "restrito"];

/** Rótulo humano da regra, para legendas na UI. */
export const SENSITIVE_LABEL = "Confidencial + Restrito";

/** O documento é sensível? (Confidencial ou Restrito) */
export function isSensitive(doc: GedDocument): boolean {
  return SENSITIVE_CLASSIFICATIONS.includes(doc.classification);
}
