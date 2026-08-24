// Rótulo da etapa a partir da posição na cadeia (espelha data/responsibles).

export function stepLabelFor(order: number, total: number): string {
  if (total <= 1) return "Responsável";
  if (order === 1) return "Responsável da área";
  if (order === total) return "Diretoria";
  return `Etapa ${order}`;
}
