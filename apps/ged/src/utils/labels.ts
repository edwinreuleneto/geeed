// Fonte única de rótulos e tons por classificação/status/ação/permissão.
// Centralizar aqui garante consistência de cor em toda a UI (ver docs/conventions/ui-style.md).

// Types
import type {
  ActivityAction,
  Classification,
  DocumentStatus,
  PermissionLevel,
} from "@/types/ged";

interface Tone {
  label: string;
  dot: string;
  wrapper: string;
  soft: string;
}

export const CLASSIFICATION: Record<Classification, Tone> = {
  publico: {
    label: "Público",
    dot: "bg-emerald-500",
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
    soft: "bg-emerald-50 text-emerald-700",
  },
  interno: {
    label: "Interno",
    dot: "bg-brand-500",
    wrapper: "border-brand-200 bg-brand-50 text-brand-700",
    soft: "bg-brand-50 text-brand-700",
  },
  confidencial: {
    label: "Confidencial",
    dot: "bg-amber-500",
    wrapper: "border-amber-200 bg-amber-50 text-amber-700",
    soft: "bg-amber-50 text-amber-700",
  },
  restrito: {
    label: "Restrito",
    dot: "bg-rose-500",
    wrapper: "border-rose-200 bg-rose-50 text-rose-700",
    soft: "bg-rose-50 text-rose-700",
  },
};

export const STATUS: Record<DocumentStatus, Tone> = {
  draft: {
    label: "Rascunho",
    dot: "bg-slate-400",
    wrapper: "border-slate-200 bg-slate-50 text-slate-600",
    soft: "bg-slate-100 text-slate-600",
  },
  review: {
    label: "Em revisão",
    dot: "bg-brand-500",
    wrapper: "border-brand-200 bg-brand-50 text-brand-700",
    soft: "bg-brand-50 text-brand-700",
  },
  approved: {
    label: "Aprovado",
    dot: "bg-emerald-500",
    wrapper: "border-emerald-200 bg-emerald-50 text-emerald-700",
    soft: "bg-emerald-50 text-emerald-700",
  },
  archived: {
    label: "Arquivado",
    dot: "bg-slate-400",
    wrapper: "border-slate-200 bg-slate-100 text-slate-600",
    soft: "bg-slate-100 text-slate-600",
  },
};

export const ACTION_LABEL: Record<ActivityAction, string> = {
  view: "visualizou",
  download: "baixou",
  edit: "editou",
  share: "compartilhou",
  approve: "aprovou",
  upload: "enviou",
  permission: "alterou permissões de",
};

export const PERMISSION_LABEL: Record<PermissionLevel, string> = {
  view: "Visualizar",
  download: "Baixar",
  edit: "Editar",
  owner: "Proprietário",
};
