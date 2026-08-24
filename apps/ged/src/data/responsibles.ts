// Responsáveis por aprovação, por departamento (mock, mutável em memória).
// A lista é ORDENADA: a posição define a etapa da cadeia sequencial (0 = etapa 1).

/** Cadeia padrão quando um departamento não tem responsáveis configurados. */
export const DEFAULT_CHAIN: string[] = ["u-edwin"];

/** department → cadeia ordenada de aprovadores (userIds). */
const CHAINS: Record<string, string[]> = {
  Financeiro: ["u-marina", "u-edwin"],
  Jurídico: ["u-rafael", "u-luiz"],
  RH: ["u-bianca", "u-edwin"],
  Comercial: ["u-luiz", "u-edwin"],
  Operações: ["u-lucia"],
  TI: ["u-edwin"],
};

/** Rótulo da etapa a partir da posição na cadeia. */
export function stepLabel(order: number, total: number): string {
  if (total <= 1) return "Responsável";
  if (order === 1) return "Responsável da área";
  if (order === total) return "Diretoria";
  return `Etapa ${order}`;
}

/** Snapshot de todas as cadeias (cópia rasa por departamento). */
export function getResponsibles(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const dept of Object.keys(CHAINS)) out[dept] = [...CHAINS[dept]!];
  return out;
}

/** Cadeia de um departamento (fallback para a cadeia padrão se vazia). */
export function getChain(department: string): string[] {
  const chain = CHAINS[department];
  return chain && chain.length > 0 ? [...chain] : [...DEFAULT_CHAIN];
}

/** Redefine a cadeia ordenada de um departamento. */
export function setDepartmentChain(department: string, approverIds: string[]): void {
  CHAINS[department] = [...approverIds];
}

/** Remove a cadeia de um departamento (ao excluí-lo). */
export function removeChain(department: string): void {
  delete CHAINS[department];
}
