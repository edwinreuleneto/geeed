// Metadados dos documentos (estilo colunas/content types do SharePoint), com
// extração por IA. Alguns documentos têm metadados ricos autorais; os demais são
// gerados a partir dos campos + insights de IA. Ver docs/domain/documents.md.

// Utils
import { formatDate, formatSize } from "@/utils/format";

// Data
import { AI_INSIGHTS } from "./ai";

// Types
import type { DocumentMetadata, GedDocument, MetaField } from "@/types/ged";

const CONTENT_TYPE_BY_FOLDER: Record<string, string> = {
  "f-contratos": "Contrato",
  "f-fiscal": "Documento Fiscal",
  "f-rh": "Documento de RH",
  "f-financeiro": "Relatório Financeiro",
  "f-projetos": "Documento de Projeto",
  "f-diretoria": "Documento Executivo",
};

const CLASS_LABEL: Record<string, string> = {
  publico: "Público",
  interno: "Interno",
  confidencial: "Confidencial",
  restrito: "Restrito",
};

// Metadados autorais (extração de IA "de alta confiança") para os documentos-chave.
const EXPLICIT: Record<string, DocumentMetadata> = {
  "d-contrato-fornecimento": {
    contentType: "Contrato de Fornecimento",
    extractedAt: "2026-07-22T18:06:00Z",
    aiFieldsFilled: 7,
    expiresAt: "2028-05-12T00:00:00Z",
    fields: [
      { key: "type", label: "Tipo de contrato", value: "Fornecimento", type: "choice", source: "ai", confidence: 0.97, icon: "FileSignature" },
      { key: "counterparty", label: "Contraparte", value: "Vale Verde Ltda.", type: "text", source: "ai", confidence: 0.95, icon: "Building2" },
      { key: "number", label: "Nº do contrato", value: "CT-2026-0148", type: "text", source: "ai", confidence: 0.93, icon: "Hash" },
      { key: "value", label: "Valor global", value: "R$ 1.240.000,00", type: "money", source: "ai", confidence: 0.9, icon: "CircleDollarSign" },
      { key: "term", label: "Vigência", value: "24 meses", type: "text", source: "ai", confidence: 0.94, icon: "CalendarClock" },
      { key: "start", label: "Início", value: "12 mai 2026", type: "date", source: "ai", confidence: 0.96, icon: "Calendar" },
      { key: "end", label: "Vencimento", value: "12 mai 2028", type: "date", source: "ai", confidence: 0.96, icon: "CalendarClock" },
      { key: "readjust", label: "Reajuste", value: "IPCA anual", type: "text", source: "ai", confidence: 0.88, icon: "TrendingUp" },
      { key: "retention", label: "Retenção", value: "10 anos após término", type: "text", source: "manual", icon: "Archive" },
      { key: "department", label: "Departamento", value: "Jurídico", type: "choice", source: "system", icon: "Building2" },
    ],
    entities: {
      people: ["Rafael Costa", "Marina Alves"],
      organizations: ["Vale Verde Ltda.", "MinimalTech S.A."],
      dates: [
        { label: "Assinatura", value: "22 jul 2026" },
        { label: "Vencimento", value: "12 mai 2028" },
      ],
      amounts: [
        { label: "Valor global", value: "R$ 1.240.000,00" },
        { label: "Multa por atraso", value: "2%" },
      ],
      identifiers: [
        { label: "CNPJ", value: "12.345.678/0001-90" },
        { label: "Contrato", value: "CT-2026-0148" },
      ],
    },
  },
  "d-orcamento-2027": {
    contentType: "Orçamento Estratégico",
    extractedAt: "2026-07-29T17:51:00Z",
    aiFieldsFilled: 5,
    expiresAt: "2026-08-15T00:00:00Z",
    fields: [
      { key: "type", label: "Tipo", value: "Orçamento anual", type: "choice", source: "ai", confidence: 0.94, icon: "BarChart3" },
      { key: "period", label: "Exercício", value: "2027", type: "number", source: "ai", confidence: 0.98, icon: "Calendar" },
      { key: "capex", label: "CAPEX previsto", value: "R$ 8.500.000,00", type: "money", source: "ai", confidence: 0.86, icon: "CircleDollarSign" },
      { key: "scenarios", label: "Cenários", value: "Conservador · Agressivo", type: "text", source: "ai", confidence: 0.9, icon: "GitBranch" },
      { key: "approval", label: "Aprovação até", value: "15 ago 2026", type: "date", source: "ai", confidence: 0.82, icon: "CalendarClock" },
      { key: "department", label: "Departamento", value: "Financeiro", type: "choice", source: "system", icon: "Building2" },
      { key: "owner", label: "Responsável", value: "Marina Alves", type: "text", source: "manual", icon: "UserRound" },
    ],
    entities: {
      people: ["Marina Alves"],
      organizations: ["Diretoria Financeira"],
      dates: [{ label: "Aprovação até", value: "15 ago 2026" }],
      amounts: [
        { label: "CAPEX", value: "R$ 8.500.000,00" },
        { label: "Meta de receita", value: "R$ 62.000.000,00" },
      ],
      identifiers: [{ label: "Exercício", value: "2027" }],
    },
  },
  "d-nfe-julho": {
    contentType: "NF-e Consolidada",
    extractedAt: "2026-07-28T14:36:00Z",
    aiFieldsFilled: 5,
    expiresAt: "2026-08-20T00:00:00Z",
    fields: [
      { key: "type", label: "Tipo fiscal", value: "NF-e (saída)", type: "choice", source: "ai", confidence: 0.96, icon: "Receipt" },
      { key: "competence", label: "Competência", value: "Julho/2026", type: "text", source: "ai", confidence: 0.97, icon: "Calendar" },
      { key: "total", label: "Total das notas", value: "R$ 318.420,00", type: "money", source: "ai", confidence: 0.91, icon: "CircleDollarSign" },
      { key: "taxes", label: "Impostos apurados", value: "R$ 57.315,00", type: "money", source: "ai", confidence: 0.89, icon: "Percent" },
      { key: "due", label: "Recolhimento até", value: "20 ago 2026", type: "date", source: "ai", confidence: 0.85, icon: "CalendarClock" },
      { key: "department", label: "Departamento", value: "Financeiro", type: "choice", source: "system", icon: "Building2" },
    ],
    entities: {
      people: ["Marina Alves"],
      organizations: ["Receita Federal", "SEFAZ"],
      dates: [{ label: "Recolhimento", value: "20 ago 2026" }],
      amounts: [
        { label: "Total", value: "R$ 318.420,00" },
        { label: "Impostos", value: "R$ 57.315,00" },
      ],
      identifiers: [{ label: "CNPJ emitente", value: "12.345.678/0001-90" }],
    },
  },
  "d-politica-home-office": {
    contentType: "Política Interna",
    extractedAt: "2026-06-18T09:46:00Z",
    aiFieldsFilled: 4,
    expiresAt: "2026-09-04T00:00:00Z",
    fields: [
      { key: "type", label: "Tipo", value: "Política de RH", type: "choice", source: "ai", confidence: 0.95, icon: "ShieldCheck" },
      { key: "model", label: "Modelo", value: "Híbrido 3x2", type: "text", source: "ai", confidence: 0.93, icon: "Users" },
      { key: "effective", label: "Vigente desde", value: "18 jun 2026", type: "date", source: "ai", confidence: 0.9, icon: "Calendar" },
      { key: "review", label: "Revisão anual", value: "04 set 2026", type: "date", source: "ai", confidence: 0.8, icon: "CalendarClock" },
      { key: "audience", label: "Público-alvo", value: "Todos os colaboradores", type: "text", source: "manual", icon: "Users" },
      { key: "department", label: "Departamento", value: "RH", type: "choice", source: "system", icon: "Building2" },
    ],
    entities: {
      people: ["Bianca Souza"],
      organizations: ["Recursos Humanos"],
      dates: [
        { label: "Vigente desde", value: "18 jun 2026" },
        { label: "Revisão", value: "04 set 2026" },
      ],
      amounts: [{ label: "Auxílio home office", value: "R$ 150,00/mês" }],
      identifiers: [{ label: "Documento", value: "POL-RH-014" }],
    },
  },
  "d-aditivo-contrato": {
    contentType: "Aditivo Contratual",
    extractedAt: "2026-07-29T10:31:00Z",
    aiFieldsFilled: 4,
    expiresAt: "2026-09-15T00:00:00Z",
    fields: [
      { key: "type", label: "Tipo", value: "Aditivo de prazo", type: "choice", source: "ai", confidence: 0.94, icon: "FileSignature" },
      { key: "parent", label: "Contrato vinculado", value: "CT-2026-0148", type: "text", source: "ai", confidence: 0.9, icon: "Link" },
      { key: "extension", label: "Prorrogação", value: "+180 dias", type: "text", source: "ai", confidence: 0.88, icon: "CalendarClock" },
      { key: "newdate", label: "Novo prazo", value: "15 set 2026", type: "date", source: "ai", confidence: 0.86, icon: "Calendar" },
      { key: "department", label: "Departamento", value: "Jurídico", type: "choice", source: "system", icon: "Building2" },
    ],
    entities: {
      people: ["Rafael Costa"],
      organizations: ["Vale Verde Ltda."],
      dates: [{ label: "Novo prazo", value: "15 set 2026" }],
      amounts: [],
      identifiers: [{ label: "Contrato", value: "CT-2026-0148" }],
    },
  },
};

// Gerador de metadados para documentos sem entrada autoral.
function generateMetadata(doc: GedDocument): DocumentMetadata {
  const ai = AI_INSIGHTS[doc.id];
  const fields: MetaField[] = [
    {
      key: "type",
      label: "Tipo de conteúdo",
      value: CONTENT_TYPE_BY_FOLDER[doc.folderId] ?? "Documento",
      type: "choice",
      source: "ai",
      confidence: 0.82,
      icon: "FileText",
    },
    { key: "department", label: "Departamento", value: doc.department, type: "choice", source: "system", icon: "Building2" },
    { key: "classification", label: "Classificação", value: CLASS_LABEL[doc.classification] ?? doc.classification, type: "choice", source: "system", icon: "ShieldCheck" },
    { key: "created", label: "Criado em", value: formatDate(doc.createdAt), type: "date", source: "system", icon: "Calendar" },
    { key: "modified", label: "Modificado em", value: formatDate(doc.updatedAt), type: "date", source: "system", icon: "Calendar" },
    { key: "size", label: "Tamanho", value: formatSize(doc.sizeKb), type: "number", source: "system", icon: "HardDrive" },
  ];

  if (ai?.suggestedTags.length) {
    fields.push({
      key: "tags",
      label: "Assunto",
      value: ai.suggestedTags.slice(0, 3).join(", "),
      type: "tags",
      source: "ai",
      confidence: 0.8,
      icon: "Tag",
    });
  }

  return {
    contentType: CONTENT_TYPE_BY_FOLDER[doc.folderId] ?? "Documento",
    extractedAt: ai?.processedAt ?? doc.updatedAt,
    aiFieldsFilled: fields.filter((f) => f.source === "ai").length,
    fields,
    entities: {
      people: [],
      organizations: [],
      dates: [{ label: "Modificado", value: formatDate(doc.updatedAt) }],
      amounts: [],
      identifiers: [],
    },
  };
}

export function getMetadata(doc: GedDocument): DocumentMetadata {
  return EXPLICIT[doc.id] ?? generateMetadata(doc);
}
