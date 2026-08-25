// Times do Microsoft Teams configurados no ambiente (Microsoft 365) do cliente — mock.
// Cada Team é um Grupo do M365 com um site do SharePoint por trás; cada canal vira uma
// pasta na biblioteca de documentos. Ver docs/domain/connectors/sharepoint.md.

export type TeamVisibility = "private" | "public";
export type ChannelKind = "standard" | "private" | "shared";
export type Sensitivity = "Público" | "Interno" | "Confidencial" | "Altamente Confidencial";

export interface TeamChannel {
  name: string;
  kind: ChannelKind;
}

export interface MsTeam {
  id: string;
  name: string;
  description: string;
  visibility: TeamVisibility;
  sensitivity: Sensitivity;
  guestAccess: boolean;
  ownerId: string;
  memberIds: string[];
  channels: TeamChannel[];
  libraryName: string;
  siteUrl: string;
  itemCount: number;
  storageMb: number;
  lastActivityAt: string; // ISO
  accent: string; // cor do ícone (hex)
}

export const TEAMS: MsTeam[] = [
  {
    id: "team-financeiro",
    name: "Financeiro & Controladoria",
    description: "Fechamentos, orçamento, conciliação e notas fiscais.",
    visibility: "private",
    sensitivity: "Confidencial",
    guestAccess: false,
    ownerId: "u-marina",
    memberIds: ["u-marina", "u-edwin", "u-lucia"],
    channels: [
      { name: "Geral", kind: "standard" },
      { name: "Fechamento Mensal", kind: "standard" },
      { name: "Orçamento 2027", kind: "private" },
    ],
    libraryName: "Documentos - Financeiro",
    siteUrl: "https://minimaltech.sharepoint.com/sites/financeiro",
    itemCount: 312,
    storageMb: 1840,
    lastActivityAt: "2026-07-30T08:40:00Z",
    accent: "#34c759",
  },
  {
    id: "team-juridico",
    name: "Jurídico",
    description: "Contratos, aditivos, pareceres e compliance.",
    visibility: "private",
    sensitivity: "Altamente Confidencial",
    guestAccess: true,
    ownerId: "u-rafael",
    memberIds: ["u-rafael", "u-marina", "u-edwin"],
    channels: [
      { name: "Geral", kind: "standard" },
      { name: "Contratos", kind: "standard" },
      { name: "Assinaturas", kind: "shared" },
    ],
    libraryName: "Documentos - Jurídico",
    siteUrl: "https://minimaltech.sharepoint.com/sites/juridico",
    itemCount: 486,
    storageMb: 2610,
    lastActivityAt: "2026-07-29T17:10:00Z",
    accent: "#0071e3",
  },
  {
    id: "team-comercial",
    name: "Comercial & Vendas",
    description: "Propostas, clientes e material de marca.",
    visibility: "private",
    sensitivity: "Interno",
    guestAccess: true,
    ownerId: "u-diego",
    memberIds: ["u-diego", "u-bianca", "u-edwin"],
    channels: [
      { name: "Geral", kind: "standard" },
      { name: "Propostas", kind: "standard" },
      { name: "Cliente Aurora", kind: "private" },
    ],
    libraryName: "Documentos - Comercial",
    siteUrl: "https://minimaltech.sharepoint.com/sites/comercial",
    itemCount: 208,
    storageMb: 3120,
    lastActivityAt: "2026-07-30T09:05:00Z",
    accent: "#af52de",
  },
  {
    id: "team-operacoes",
    name: "Operações & Engenharia",
    description: "Obras, plantas, logística e registros de campo.",
    visibility: "private",
    sensitivity: "Confidencial",
    guestAccess: false,
    ownerId: "u-lucia",
    memberIds: ["u-lucia", "u-diego", "u-edwin"],
    channels: [
      { name: "Geral", kind: "standard" },
      { name: "Obra Galpão", kind: "standard" },
      { name: "Plantas", kind: "standard" },
    ],
    libraryName: "Documentos - Operações",
    siteUrl: "https://minimaltech.sharepoint.com/sites/operacoes",
    itemCount: 174,
    storageMb: 5240,
    lastActivityAt: "2026-07-28T14:20:00Z",
    accent: "#ff9f0a",
  },
  {
    id: "team-diretoria",
    name: "Diretoria",
    description: "Atas, estratégia e material executivo.",
    visibility: "private",
    sensitivity: "Altamente Confidencial",
    guestAccess: false,
    ownerId: "u-edwin",
    memberIds: ["u-edwin", "u-marina", "u-rafael"],
    channels: [
      { name: "Geral", kind: "standard" },
      { name: "Atas", kind: "private" },
    ],
    libraryName: "Documentos - Diretoria",
    siteUrl: "https://minimaltech.sharepoint.com/sites/diretoria",
    itemCount: 96,
    storageMb: 720,
    lastActivityAt: "2026-07-27T19:00:00Z",
    accent: "#ff3b30",
  },
  {
    id: "team-rh",
    name: "RH & Pessoas",
    description: "Políticas, admissões e folha de pagamento.",
    visibility: "private",
    sensitivity: "Confidencial",
    guestAccess: false,
    ownerId: "u-bianca",
    memberIds: ["u-bianca", "u-edwin"],
    channels: [
      { name: "Geral", kind: "standard" },
      { name: "Folha", kind: "private" },
      { name: "Políticas", kind: "standard" },
    ],
    libraryName: "Documentos - RH",
    siteUrl: "https://minimaltech.sharepoint.com/sites/rh",
    itemCount: 143,
    storageMb: 980,
    lastActivityAt: "2026-07-25T13:30:00Z",
    accent: "#5ac8fa",
  },
];
