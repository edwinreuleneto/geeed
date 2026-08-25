// Persistência do mock DB no localStorage (somente no cliente). Mantém aprovações,
// classificação, permissões, uploads e a trilha de atividade após um refresh — sem
// backend. A troca por uma API real permanece restrita a data/index.ts.
//
// Reset é intencionalmente ESCONDIDO da UI: só via console (window.__gedReset()) ou
// limpando a chave abaixo do localStorage.

// Data (arrays fonte — mutados in place para preservar as referências importadas)
import { DOCUMENTS } from "./documents";
import { UPLOADS } from "./uploads";

// Types
import type { GedDocument } from "@/types/ged";

const STORAGE_KEY = "ged.state.v1";

interface PersistedState {
  documents: GedDocument[];
  uploads: GedDocument[];
}

let hydrated = false;

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

/** Substitui o conteúdo de um array in place, preservando a referência. */
function replaceInPlace<T>(target: T[], next: T[]): void {
  target.splice(0, target.length, ...next);
}

/** Salva o estado atual dos arrays fonte. No-op fora do navegador. */
export function saveState(): void {
  if (!isBrowser()) return;
  try {
    const state: PersistedState = { documents: DOCUMENTS, uploads: UPLOADS };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Cota cheia ou modo privado: ignora silenciosamente (degradação para memória).
  }
}

/** Apaga o estado salvo e recarrega, voltando aos dados semente. Uso via console. */
export function resetState(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
}

/**
 * Hidrata os arrays fonte a partir do localStorage na primeira chamada (cliente).
 * Idempotente e seguro no SSR (onde apenas mantém a semente).
 */
export function ensureHydrated(): void {
  if (hydrated || !isBrowser()) return;
  hydrated = true;

  // Expõe o reset escondido no console (sem entrada na UI).
  (window as unknown as { __gedReset?: () => void }).__gedReset = resetState;

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const state = JSON.parse(raw) as Partial<PersistedState>;
    if (Array.isArray(state.documents)) replaceInPlace(DOCUMENTS, state.documents);
    if (Array.isArray(state.uploads)) replaceInPlace(UPLOADS, state.uploads);
  } catch {
    // Estado corrompido: descarta e segue com a semente.
    window.localStorage.removeItem(STORAGE_KEY);
  }
}
