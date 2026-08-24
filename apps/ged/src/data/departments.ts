// Departamentos/setores do GED (mock, mutável em memória). A lista alimenta a
// configuração de responsáveis por aprovação e pode ser editada em /responsaveis.

// Data
import { removeChain } from "./responsibles";

const DEPARTMENTS: string[] = [
  "Financeiro",
  "Jurídico",
  "RH",
  "Comercial",
  "Operações",
  "TI",
];

/** Lista atual de departamentos (cópia). */
export function getDepartments(): string[] {
  return [...DEPARTMENTS];
}

/** Cria um departamento (ignora vazios e duplicados, sem diferenciar acentos/caixa). */
export function addDepartment(name: string): string[] {
  const trimmed = name.trim();
  const exists = DEPARTMENTS.some(
    (d) => d.localeCompare(trimmed, "pt-BR", { sensitivity: "base" }) === 0,
  );
  if (trimmed && !exists) DEPARTMENTS.push(trimmed);
  return getDepartments();
}

/** Remove um departamento e a sua cadeia de responsáveis. */
export function removeDepartment(name: string): string[] {
  const idx = DEPARTMENTS.indexOf(name);
  if (idx >= 0) {
    DEPARTMENTS.splice(idx, 1);
    removeChain(name);
  }
  return getDepartments();
}
