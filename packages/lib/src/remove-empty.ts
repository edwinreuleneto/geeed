/**
 * Remove chaves com valores nulos, indefinidos ou string vazia de um objeto.
 * Útil para montar payloads e query strings enxutos.
 */
export function removeEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    ),
  ) as Partial<T>;
}
