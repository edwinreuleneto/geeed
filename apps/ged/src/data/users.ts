// Usuários semente do GED (mock).

// Types
import type { GedUser } from "@/types/ged";

export const USERS: GedUser[] = [
  {
    id: "u-edwin",
    name: "Edwin Reule",
    email: "edwinreule@gmail.com",
    role: "admin",
    department: "TI",
    initials: "ER",
    accent: "bg-blue-100 text-blue-700",
    avatarUrl: "/team/edwin.png",
  },
  {
    id: "u-luiz",
    name: "Luiz Campolongo",
    email: "luiz.campolongo@campolongo.com.br",
    role: "admin",
    department: "Comercial",
    initials: "LC",
    accent: "bg-amber-100 text-amber-700",
    avatarUrl: "/team/luiz.png",
  },
];

/** Usuário atualmente logado nesta simulação. */
export const CURRENT_USER_ID = "u-luiz";

/** IDs válidos após a redução para dois usuários. */
export const ALLOWED_USER_IDS = new Set(USERS.map((u) => u.id));

/** Remapeia qualquer usuário antigo (dos dados semente) para Luiz Campolongo. */
export function remapUserId(id: string): string {
  return ALLOWED_USER_IDS.has(id) ? id : "u-luiz";
}
