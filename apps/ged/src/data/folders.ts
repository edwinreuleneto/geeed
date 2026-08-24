// Pastas/coleções semente do GED (mock).

// Types
import type { Folder } from "@/types/ged";

export const FOLDERS: Folder[] = [
  {
    id: "f-contratos",
    name: "Contratos",
    description: "Acordos, aditivos e minutas jurídicas",
    icon: "FileSignature",
    accent: { bg: "bg-brand-50", text: "text-brand-600" },
  },
  {
    id: "f-fiscal",
    name: "Fiscal & Notas",
    description: "Notas fiscais, XMLs e comprovantes",
    icon: "Receipt",
    accent: { bg: "bg-emerald-50", text: "text-emerald-600" },
  },
  {
    id: "f-rh",
    name: "RH & Pessoas",
    description: "Admissões, políticas e folha",
    icon: "Users",
    accent: { bg: "bg-sky-50", text: "text-sky-600" },
  },
  {
    id: "f-financeiro",
    name: "Financeiro",
    description: "Relatórios, orçamentos e conciliações",
    icon: "BarChart3",
    accent: { bg: "bg-amber-50", text: "text-amber-600" },
  },
  {
    id: "f-projetos",
    name: "Projetos & Engenharia",
    description: "Plantas, especificações e propostas",
    icon: "Ruler",
    accent: { bg: "bg-violet-50", text: "text-violet-600" },
  },
  {
    id: "f-diretoria",
    name: "Diretoria",
    description: "Atas, estratégia e material confidencial",
    icon: "ShieldCheck",
    accent: { bg: "bg-rose-50", text: "text-rose-600" },
  },

  // --- Subpastas (hierarquia aninhada) ----------------------------------------
  {
    id: "f-contratos-2026",
    name: "2026",
    description: "Contratos e aditivos do exercício de 2026",
    icon: "FileSignature",
    accent: { bg: "bg-brand-50", text: "text-brand-600" },
    parentId: "f-contratos",
  },
  {
    id: "f-contratos-fornecedores",
    name: "Fornecedores",
    description: "Acordos de fornecimento e SLAs",
    icon: "FileSignature",
    accent: { bg: "bg-brand-50", text: "text-brand-600" },
    parentId: "f-contratos-2026",
  },
  {
    id: "f-rh-admissoes",
    name: "Admissões",
    description: "Documentos de contratação e onboarding",
    icon: "Users",
    accent: { bg: "bg-sky-50", text: "text-sky-600" },
    parentId: "f-rh",
  },
  {
    id: "f-projetos-plantas",
    name: "Plantas & CAD",
    description: "Desenhos técnicos e arquivos de engenharia",
    icon: "Ruler",
    accent: { bg: "bg-violet-50", text: "text-violet-600" },
    parentId: "f-projetos",
  },
];
