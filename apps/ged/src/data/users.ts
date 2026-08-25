// Usuários semente do GED (mock) — equipe da MinimalTech por departamento.

// Types
import type { GedUser } from "@/types/ged";

export const USERS: GedUser[] = [
  {
    id: "u-luiz",
    name: "Luiz MinimalTech",
    email: "luiz.minimaltech@minimaltech.com.br",
    role: "admin",
    department: "Comercial",
    initials: "LC",
    accent: "bg-amber-100 text-amber-700",
    avatarUrl: "/team/luiz.png",
  },
  {
    id: "u-edwin",
    name: "Edwin Reule",
    email: "edwin.reule@minimaltech.com.br",
    role: "admin",
    department: "TI",
    initials: "ER",
    accent: "bg-blue-100 text-blue-700",
    avatarUrl: "/team/edwin.png",
  },
  {
    id: "u-rafael",
    name: "Rafael Costa",
    email: "rafael.costa@minimaltech.com.br",
    role: "editor",
    department: "Jurídico",
    initials: "RC",
    accent: "bg-indigo-100 text-indigo-700",
    avatarUrl: "",
  },
  {
    id: "u-marina",
    name: "Marina Alves",
    email: "marina.alves@minimaltech.com.br",
    role: "editor",
    department: "Financeiro",
    initials: "MA",
    accent: "bg-emerald-100 text-emerald-700",
    avatarUrl: "",
  },
  {
    id: "u-bianca",
    name: "Bianca Rocha",
    email: "bianca.rocha@minimaltech.com.br",
    role: "editor",
    department: "RH",
    initials: "BR",
    accent: "bg-sky-100 text-sky-700",
    avatarUrl: "",
  },
  {
    id: "u-lucia",
    name: "Lúcia Ferraz",
    email: "lucia.ferraz@minimaltech.com.br",
    role: "editor",
    department: "Operações",
    initials: "LF",
    accent: "bg-violet-100 text-violet-700",
    avatarUrl: "",
  },
  {
    id: "u-diego",
    name: "Diego Santos",
    email: "diego.santos@minimaltech.com.br",
    role: "editor",
    department: "Comercial",
    initials: "DS",
    accent: "bg-rose-100 text-rose-700",
    avatarUrl: "",
  },
];

/** Usuário atualmente logado nesta simulação. */
export const CURRENT_USER_ID = "u-luiz";

/** IDs válidos de usuário. */
export const ALLOWED_USER_IDS = new Set(USERS.map((u) => u.id));

/** Mantém ids conhecidos; qualquer id desconhecido cai no usuário logado. */
export function remapUserId(id: string): string {
  return ALLOWED_USER_IDS.has(id) ? id : "u-luiz";
}
