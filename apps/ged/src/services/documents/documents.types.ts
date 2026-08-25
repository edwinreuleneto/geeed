// Types
import type {
  Classification,
  Department,
  DocumentStatus,
} from "@/types/ged";

export type ClassificationFilter = Classification | "all";
export type StatusFilter = DocumentStatus | "all";
export type DepartmentFilter = Department | "all";

export interface DocumentFilters {
  search?: string;
  folderId?: string | null;
  classification?: ClassificationFilter;
  status?: StatusFilter;
  department?: DepartmentFilter;
  favoritesOnly?: boolean;
  /** Apenas documentos sensíveis (classificação Confidencial ou Restrito). */
  sensitiveOnly?: boolean;
  sort?: "recent" | "name" | "size";
}
