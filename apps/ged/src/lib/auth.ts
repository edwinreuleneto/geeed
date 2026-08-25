// Autenticação mock da demonstração. Credencial fixa (única aceita), persistida no
// localStorage. Sem backend — a troca por um provedor real (Entra ID) fica restrita aqui.

const AUTH_KEY = "ged.auth.v1";

/** Única credencial aceita nesta demonstração. */
export const DEMO_EMAIL = "luiz@campolongo.io";
export const DEMO_PASSWORD = "540@@";

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "1";
}

/** Valida a credencial fixa; em caso de sucesso, marca a sessão. */
export function login(email: string, password: string): boolean {
  const ok = email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD;
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_KEY, "1");
  }
  return ok;
}

export function logout(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(AUTH_KEY);
}
