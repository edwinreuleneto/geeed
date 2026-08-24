// Mutações do mock DB (em memória, apenas nesta sessão). Operam sobre os arrays
// fonte (UPLOADS/DOCUMENTS), pois `db.documents()` devolve clones. A borda `db`
// (data/index.ts) envolve estas funções com latência + clone + remap.

// Data
import { DOCUMENTS } from "./documents";
import { UPLOADS } from "./uploads";
import { CURRENT_USER_ID } from "./users";
import { getChain, stepLabel } from "./responsibles";

// Types
import type {
  ActivityAction,
  ApprovalStep,
  Classification,
  GedDocument,
  Permission,
} from "@/types/ged";

/** Localiza o documento fonte (não o clone) por id. */
function findSource(id: string): GedDocument | undefined {
  return UPLOADS.find((d) => d.id === id) ?? DOCUMENTS.find((d) => d.id === id);
}

/** Empurra um evento de atividade no topo da trilha. */
function pushActivity(
  doc: GedDocument,
  detail: string,
  at: string,
  action: ActivityAction = "approve",
): void {
  doc.activity.unshift({
    id: `ev-${at}-${doc.activity.length}`,
    actorId: CURRENT_USER_ID,
    action,
    at,
    detail,
  });
}

/** Publica um rascunho: monta a cadeia do departamento e entra em aprovação. */
export function submitForApproval(id: string): GedDocument | null {
  const doc = findSource(id);
  if (!doc) return null;

  const nowIso = new Date().toISOString();
  const chain = getChain(doc.department);
  const total = chain.length;
  const steps: ApprovalStep[] = chain.map((approverId, i) => ({
    order: i + 1,
    label: stepLabel(i + 1, total),
    approverId,
    decision: "pending",
  }));

  doc.approval = {
    state: "in_progress",
    currentStep: 1,
    submittedById: CURRENT_USER_ID,
    submittedAt: nowIso,
    steps,
  };
  doc.status = "in_approval";
  doc.updatedAt = nowIso;
  pushActivity(doc, "Enviado para aprovação", nowIso);
  return doc;
}

/** Decide a etapa ativa em nome do usuário logado (aprovar/rejeitar). */
export function decideApproval(
  id: string,
  decision: "approved" | "rejected",
  comment?: string,
): GedDocument | null {
  const doc = findSource(id);
  if (!doc || !doc.approval) return null;

  const approval = doc.approval;
  const step = approval.steps.find((s) => s.order === approval.currentStep);
  if (!step) return doc;

  const nowIso = new Date().toISOString();
  step.decision = decision;
  step.decidedAt = nowIso;
  if (comment) step.comment = comment;

  if (decision === "rejected") {
    approval.state = "rejected";
    doc.status = "draft";
    pushActivity(doc, comment ? `Rejeitado — ${comment}` : "Rejeitado", nowIso);
  } else if (approval.currentStep >= approval.steps.length) {
    approval.state = "approved";
    approval.currentStep = approval.steps.length + 1;
    doc.status = "approved";
    pushActivity(doc, "Aprovação concluída", nowIso);
  } else {
    approval.currentStep += 1;
    pushActivity(doc, `Etapa ${step.order} aprovada`, nowIso);
  }

  doc.updatedAt = nowIso;
  return doc;
}

/** Altera a classificação (sensibilidade) do documento. */
export function setClassification(
  id: string,
  classification: Classification,
): GedDocument | null {
  const doc = findSource(id);
  if (!doc) return null;

  const nowIso = new Date().toISOString();
  doc.classification = classification;
  doc.updatedAt = nowIso;
  pushActivity(doc, `Classificação alterada para ${classification}`, nowIso, "permission");
  return doc;
}

/** Substitui a lista de permissões do documento. */
export function setPermissions(id: string, permissions: Permission[]): GedDocument | null {
  const doc = findSource(id);
  if (!doc) return null;

  const nowIso = new Date().toISOString();
  doc.permissions = permissions.map((p) => ({ ...p }));
  doc.updatedAt = nowIso;
  pushActivity(doc, "Permissões atualizadas", nowIso, "permission");
  return doc;
}
