// Regras auxiliares do fluxo de aprovação (mock). Reutiliza utils/access.ts.

// Utils
import { isOwner } from "@/utils/access";

// Types
import type { ApprovalStep, Folder, GedDocument, GedUser } from "@/types/ged";

/** Etapa ativa da cadeia (a que aguarda decisão), ou null. */
export function activeStep(doc: GedDocument): ApprovalStep | null {
  const approval = doc.approval;
  if (!approval || approval.state !== "in_progress") return null;
  return approval.steps.find((s) => s.order === approval.currentStep) ?? null;
}

/** Usuário responsável pela etapa ativa, ou null. */
export function currentApprover(doc: GedDocument): string | null {
  return activeStep(doc)?.approverId ?? null;
}

/** O documento aguarda a decisão deste usuário agora? */
export function isPendingFor(doc: GedDocument, user: GedUser): boolean {
  return currentApprover(doc) === user.id;
}

/** O usuário pode publicar este documento para aprovação? */
export function canSubmitForApproval(doc: GedDocument, user: GedUser): boolean {
  if (doc.status !== "draft") return false;
  return doc.ownerId === user.id || isOwner(doc, user);
}

/** Progresso da cadeia: etapas decididas (aprovadas) / total. */
export function approvalProgress(doc: GedDocument): { done: number; total: number } {
  const steps = doc.approval?.steps ?? [];
  return {
    done: steps.filter((s) => s.decision === "approved").length,
    total: steps.length,
  };
}

// --- Hierarquia de pastas -----------------------------------------------------

export interface FolderNode extends Folder {
  children: FolderNode[];
}

/** Monta a árvore de pastas a partir de `parentId` (raiz = parentId ausente/null). */
export function buildFolderTree(folders: Folder[]): FolderNode[] {
  const byId = new Map<string, FolderNode>();
  for (const f of folders) byId.set(f.id, { ...f, children: [] });

  const roots: FolderNode[] = [];
  for (const node of byId.values()) {
    const parent = node.parentId ? byId.get(node.parentId) : undefined;
    if (parent) parent.children.push(node);
    else roots.push(node);
  }
  return roots;
}

/** Total de documentos numa pasta e em toda a sua descendência. */
export function rollupCount(node: FolderNode, countByFolder: Record<string, number>): number {
  let total = countByFolder[node.id] ?? 0;
  for (const child of node.children) total += rollupCount(child, countByFolder);
  return total;
}
