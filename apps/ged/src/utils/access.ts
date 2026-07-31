// Regras de acesso efetivo (mock). Ver docs/domain/security-model.md.

// Types
import type {
  GedDocument,
  GedUser,
  Permission,
  PermissionLevel,
} from "@/types/ged";

const LEVEL_ORDER: Record<PermissionLevel, number> = {
  view: 0,
  download: 1,
  edit: 2,
  owner: 3,
};

/** Uma permissão concede pelo menos `min`? */
function grants(permission: Permission, min: PermissionLevel): boolean {
  return LEVEL_ORDER[permission.level] >= LEVEL_ORDER[min];
}

/** As permissões do documento que se aplicam a este usuário. */
function applicable(doc: GedDocument, user: GedUser): Permission[] {
  return doc.permissions.filter((p) => {
    if (p.subjectType === "user") return p.subjectId === user.id;
    if (p.subjectType === "role") return p.subjectId === user.role;
    if (p.subjectType === "department") return p.subjectId === user.department;
    return false;
  });
}

/** Maior nível de permissão que o usuário tem sobre o documento (ou null). */
export function effectiveLevel(
  doc: GedDocument,
  user: GedUser,
): PermissionLevel | null {
  if (user.role === "admin") return "owner";

  const mine = applicable(doc, user);
  if (mine.length === 0) {
    // Sem concessão explícita: público é sempre visível; interno para autenticados.
    if (doc.classification === "publico") return "view";
    if (doc.classification === "interno") return "view";
    return null;
  }

  let best: PermissionLevel = mine[0]!.level;
  for (const p of mine) {
    if (LEVEL_ORDER[p.level] > LEVEL_ORDER[best]) best = p.level;
  }
  return best;
}

export function canView(doc: GedDocument, user: GedUser): boolean {
  const level = effectiveLevel(doc, user);
  return level !== null;
}

export function canDownload(doc: GedDocument, user: GedUser): boolean {
  const mine = applicable(doc, user);
  if (user.role === "admin") return true;
  // Público/interno permitem visualizar, mas download exige concessão >= download.
  return mine.some((p) => grants(p, "download"));
}

export function canEdit(doc: GedDocument, user: GedUser): boolean {
  if (user.role === "admin") return true;
  return applicable(doc, user).some((p) => grants(p, "edit"));
}

export function isOwner(doc: GedDocument, user: GedUser): boolean {
  if (user.role === "admin") return true;
  return applicable(doc, user).some((p) => grants(p, "owner"));
}
