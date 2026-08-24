// Libs
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Data
import { db } from "@/data";

// Services
import { documentsKeys } from "@/services/documents";

// Utils
import { isPendingFor } from "@/utils/approvals";

// Types
import type { GedDocument, GedUser } from "@/types/ged";

// --- Contexto -----------------------------------------------------------------

async function fetchContext(): Promise<{ documents: GedDocument[]; currentUser: GedUser }> {
  const [documents, currentUser] = await Promise.all([db.documents(), db.currentUser()]);
  return { documents, currentUser };
}

// --- Query keys ---------------------------------------------------------------

export const approvalsKeys = {
  all: ["approvals"] as const,
  queue: () => [...approvalsKeys.all, "queue"] as const,
  mine: () => [...approvalsKeys.all, "mine"] as const,
  responsibles: () => [...approvalsKeys.all, "responsibles"] as const,
  departments: () => [...approvalsKeys.all, "departments"] as const,
};

// --- Hooks --------------------------------------------------------------------

/** Documentos aguardando a decisão do usuário logado (etapa ativa). */
export function useApprovalQueue() {
  return useQuery({
    queryKey: approvalsKeys.queue(),
    queryFn: async () => {
      const { documents, currentUser } = await fetchContext();
      return documents
        .filter((doc) => isPendingFor(doc, currentUser))
        .sort(
          (a, b) =>
            new Date(a.approval?.submittedAt ?? a.updatedAt).getTime() -
            new Date(b.approval?.submittedAt ?? b.updatedAt).getTime(),
        );
    },
  });
}

/** Documentos que o usuário logado enviou para aprovação (em andamento + concluídos). */
export function useMyApprovalRequests() {
  return useQuery({
    queryKey: approvalsKeys.mine(),
    queryFn: async () => {
      const { documents, currentUser } = await fetchContext();
      return documents
        .filter((doc) => doc.approval?.submittedById === currentUser.id)
        .sort(
          (a, b) =>
            new Date(b.approval?.submittedAt ?? b.updatedAt).getTime() -
            new Date(a.approval?.submittedAt ?? a.updatedAt).getTime(),
        );
    },
  });
}

/** Documentos já decididos (aprovados/rejeitados) em que o usuário participou. */
export function useApprovalHistory() {
  return useQuery({
    queryKey: [...approvalsKeys.all, "history"],
    queryFn: async () => {
      const { documents, currentUser } = await fetchContext();
      return documents
        .filter((doc) => {
          const a = doc.approval;
          if (!a || a.state === "in_progress") return false;
          const involved =
            a.submittedById === currentUser.id ||
            a.steps.some((s) => s.approverId === currentUser.id);
          return involved;
        })
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    },
  });
}

/** Cadeias de responsáveis por departamento. */
export function useResponsibles() {
  return useQuery({
    queryKey: approvalsKeys.responsibles(),
    queryFn: () => db.responsibles(),
  });
}

/** Lista de departamentos/setores. */
export function useDepartments() {
  return useQuery({
    queryKey: approvalsKeys.departments(),
    queryFn: () => db.departments(),
  });
}

// --- Mutations ----------------------------------------------------------------

function useApprovalInvalidation() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: documentsKeys.all });
    queryClient.invalidateQueries({ queryKey: approvalsKeys.all });
    queryClient.invalidateQueries({ queryKey: documentsKeys.currentUser() });
  };
}

/** Publica um rascunho para aprovação. */
export function useSubmitForApproval() {
  const invalidate = useApprovalInvalidation();
  return useMutation({
    mutationFn: (docId: string) => db.submitForApproval(docId),
    onSuccess: invalidate,
  });
}

/** Aprova ou rejeita a etapa ativa. */
export function useDecideApproval() {
  const invalidate = useApprovalInvalidation();
  return useMutation({
    mutationFn: (input: { docId: string; decision: "approved" | "rejected"; comment?: string }) =>
      db.decideApproval(input.docId, input.decision, input.comment),
    onSuccess: invalidate,
  });
}

/** Redefine a cadeia de aprovadores de um departamento. */
export function useSetDepartmentChain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: { department: string; approverIds: string[] }) =>
      db.setDepartmentChain(input.department, input.approverIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: approvalsKeys.responsibles() });
    },
  });
}

/** Cria um novo departamento/setor. */
export function useAddDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => db.addDepartment(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: approvalsKeys.departments() });
    },
  });
}

/** Remove um departamento/setor e a sua cadeia. */
export function useRemoveDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => db.removeDepartment(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: approvalsKeys.departments() });
      queryClient.invalidateQueries({ queryKey: approvalsKeys.responsibles() });
    },
  });
}
