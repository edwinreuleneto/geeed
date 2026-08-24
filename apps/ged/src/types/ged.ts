// Tipos de domínio do GED — compartilhados entre services, componentes e mock DB.
// Ver docs/domain/documents.md e docs/domain/security-model.md.

export type DocumentKind = "pdf" | "docx" | "xlsx" | "pptx" | "image" | "cad" | "other";

export type Classification = "publico" | "interno" | "confidencial" | "restrito";

export type DocumentStatus = "draft" | "review" | "in_approval" | "approved" | "archived";

export type DocumentSource = "sharepoint" | "upload" | "scan";

export type Department =
  | "Financeiro"
  | "Jurídico"
  | "RH"
  | "Comercial"
  | "Operações"
  | "TI";

export type Role = "admin" | "editor" | "leitor";

export type PermissionLevel = "view" | "download" | "edit" | "owner";

export type PermissionSubject = "user" | "role" | "department";

export type ActivityAction =
  | "view"
  | "download"
  | "edit"
  | "share"
  | "approve"
  | "upload"
  | "permission";

export interface GedUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  department: Department;
  initials: string;
  accent: string; // tint de fallback do avatar
  avatarUrl: string; // foto do usuário
}

export interface DocumentVersion {
  version: string;
  label: string;
  authorId: string;
  at: string; // ISO
  sizeKb: number;
  note: string;
}

export interface ActivityEvent {
  id: string;
  actorId: string;
  action: ActivityAction;
  at: string; // ISO
  detail?: string;
}

export interface Permission {
  subjectType: PermissionSubject;
  subjectId: string; // userId, Role ou Department
  level: PermissionLevel;
}

// --- Aprovação (fluxo sequencial multinível) ----------------------------------

export type ApprovalDecision = "pending" | "approved" | "rejected";

export interface ApprovalStep {
  order: number; // 1-based, define a sequência da cadeia
  label: string; // "Responsável da área", "Diretoria", "Etapa N"
  approverId: string; // usuário responsável por esta etapa
  decision: ApprovalDecision;
  decidedAt?: string; // ISO
  comment?: string;
}

export interface DocumentApproval {
  state: "in_progress" | "approved" | "rejected";
  currentStep: number; // order da etapa ativa (após concluído, aponta além da última)
  submittedById: string;
  submittedAt: string; // ISO
  steps: ApprovalStep[];
}

export interface Folder {
  id: string;
  name: string;
  description: string;
  icon: string; // nome do ícone lucide
  accent: { bg: string; text: string };
  parentId?: string | null; // pasta pai; ausente/null = raiz
}

export interface AiInsight {
  summary: string;
  highlights: string[];
  suggestedTags: string[];
  confidence: number; // 0–1
  processedAt: string; // ISO
  suggestedQuestions: string[];
}

// --- Metadados (estilo colunas/content types do SharePoint) -------------------

export type MetaFieldType = "text" | "date" | "money" | "number" | "choice" | "tags" | "boolean";
export type MetaSource = "system" | "manual" | "ai";

export interface MetaField {
  key: string;
  label: string;
  value: string;
  type: MetaFieldType;
  source: MetaSource;
  confidence?: number; // 0–1, quando extraído por IA
  icon?: string; // nome do ícone lucide
}

export interface DocEntity {
  label: string;
  value: string;
}

export interface DocumentMetadata {
  contentType: string; // tipo de conteúdo (SharePoint content type)
  fields: MetaField[];
  entities: {
    people: string[];
    organizations: string[];
    dates: DocEntity[];
    amounts: DocEntity[];
    identifiers: DocEntity[];
  };
  expiresAt?: string; // ISO — vencimento (alimenta alertas)
  extractedAt: string; // ISO
  aiFieldsFilled: number;
}

export interface GedDocument {
  id: string;
  name: string;
  kind: DocumentKind;
  folderId: string;
  classification: Classification;
  status: DocumentStatus;
  department: Department;
  ownerId: string;
  tags: string[];
  sizeKb: number;
  pages: number;
  source: DocumentSource;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  versions: DocumentVersion[];
  activity: ActivityEvent[];
  permissions: Permission[];
  favorite: boolean;
  approval?: DocumentApproval; // presente após publicar para aprovação
}
