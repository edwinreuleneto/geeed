// Helpers de formatação puros (pt-BR).

/** Formata tamanho em KB para uma string legível (KB/MB). */
export function formatSize(sizeKb: number): string {
  if (sizeKb < 1024) return `${Math.round(sizeKb)} KB`;
  return `${(sizeKb / 1024).toFixed(1)} MB`;
}

/** Data absoluta curta: 30 jul 2026. */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

/** Data + hora: 30 jul 2026, 09:15. */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Tempo relativo ("há 3 dias"). Recebe o "agora" como parâmetro para manter a
 * função pura e determinística (o chamador injeta Date.now()).
 */
export function formatRelative(iso: string, now: number): string {
  const diff = now - new Date(iso).getTime();
  const abs = Math.abs(diff);
  const minute = 60_000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (abs < minute) return "agora";
  if (abs < hour) {
    const m = Math.round(abs / minute);
    return `há ${m} min`;
  }
  if (abs < day) {
    const h = Math.round(abs / hour);
    return `há ${h} h`;
  }
  const d = Math.round(abs / day);
  if (d < 30) return `há ${d} ${d === 1 ? "dia" : "dias"}`;
  return formatDate(iso);
}
