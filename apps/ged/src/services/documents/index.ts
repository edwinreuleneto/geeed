// Libs
import { keepPreviousData, useQuery, useSuspenseQuery } from "@tanstack/react-query";

// Data
import { db } from "@/data";

// Utils
import { canView } from "@/utils/access";

// Types
import type { GedDocument, GedUser } from "@/types/ged";
import type { DocumentFilters } from "./documents.types";

// --- Fonte de dados (mock hoje; API amanhã) -----------------------------------

async function fetchContext(): Promise<{
  documents: GedDocument[];
  currentUser: GedUser;
}> {
  const [documents, currentUser] = await Promise.all([
    db.documents(),
    db.currentUser(),
  ]);
  return { documents, currentUser };
}

/** Aplica os filtros e o controle de acesso do usuário logado sobre a lista. */
function applyFilters(
  documents: GedDocument[],
  currentUser: GedUser,
  filters: DocumentFilters,
): GedDocument[] {
  const term = filters.search?.trim().toLowerCase();

  let result = documents.filter((doc) => canView(doc, currentUser));

  if (filters.folderId) {
    result = result.filter((doc) => doc.folderId === filters.folderId);
  }
  if (filters.classification && filters.classification !== "all") {
    result = result.filter((doc) => doc.classification === filters.classification);
  }
  if (filters.status && filters.status !== "all") {
    result = result.filter((doc) => doc.status === filters.status);
  }
  if (filters.department && filters.department !== "all") {
    result = result.filter((doc) => doc.department === filters.department);
  }
  if (filters.favoritesOnly) {
    result = result.filter((doc) => doc.favorite);
  }
  if (term) {
    result = result.filter(
      (doc) =>
        doc.name.toLowerCase().includes(term) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(term)),
    );
  }

  const sort = filters.sort ?? "recent";
  result = [...result].sort((a, b) => {
    if (sort === "name") return a.name.localeCompare(b.name, "pt-BR");
    if (sort === "size") return b.sizeKb - a.sizeKb;
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  return result;
}

// --- Query keys ---------------------------------------------------------------

export const documentsKeys = {
  all: ["documents"] as const,
  list: (filters: DocumentFilters) => [...documentsKeys.all, "list", filters] as const,
  detail: (id: string) => [...documentsKeys.all, "detail", id] as const,
  folders: () => ["folders"] as const,
  users: () => ["users"] as const,
  currentUser: () => ["current-user"] as const,
};

// --- Hooks --------------------------------------------------------------------

export function useDocuments(filters: DocumentFilters = {}) {
  return useSuspenseQuery({
    queryKey: documentsKeys.list(filters),
    queryFn: async () => {
      const { documents, currentUser } = await fetchContext();
      return applyFilters(documents, currentUser, filters);
    },
  });
}

export function useDocument(id: string) {
  return useSuspenseQuery({
    queryKey: documentsKeys.detail(id),
    queryFn: () => db.document(id),
  });
}

export function useAiInsight(id: string) {
  return useSuspenseQuery({
    queryKey: [...documentsKeys.detail(id), "ai"],
    queryFn: () => db.aiInsight(id),
  });
}

export function useDocumentMetadata(id: string) {
  return useSuspenseQuery({
    queryKey: [...documentsKeys.detail(id), "metadata"],
    queryFn: () => db.metadata(id),
  });
}

export function useExpirations() {
  return useSuspenseQuery({
    queryKey: [...documentsKeys.all, "expirations"],
    queryFn: () => db.expirations(),
  });
}

export function useFolders() {
  return useSuspenseQuery({
    queryKey: documentsKeys.folders(),
    queryFn: () => db.folders(),
  });
}

/** Versão não-suspense de folders, para telas interativas. */
export function useFoldersQuery() {
  return useQuery({
    queryKey: documentsKeys.folders(),
    queryFn: () => db.folders(),
  });
}

export function useUsers() {
  return useSuspenseQuery({
    queryKey: documentsKeys.users(),
    queryFn: () => db.users(),
  });
}

/** Versão não-suspense de users, para telas interativas. */
export function useUsersQuery() {
  return useQuery({
    queryKey: documentsKeys.users(),
    queryFn: () => db.users(),
  });
}

export function useCurrentUser() {
  return useSuspenseQuery({
    queryKey: documentsKeys.currentUser(),
    queryFn: () => db.currentUser(),
  });
}

/** Versão não-suspense, para o chrome (sidebar) renderizar sem gatilho de Suspense. */
export function useCurrentUserQuery() {
  return useQuery({
    queryKey: documentsKeys.currentUser(),
    queryFn: () => db.currentUser(),
  });
}

/** Versão não-suspense, útil no command palette (fora de boundary de Suspense). */
export function useDocumentsQuery(filters: DocumentFilters = {}, enabled = true) {
  return useQuery({
    queryKey: documentsKeys.list(filters),
    queryFn: async () => {
      const { documents, currentUser } = await fetchContext();
      return applyFilters(documents, currentUser, filters);
    },
    enabled,
    placeholderData: keepPreviousData,
  });
}
