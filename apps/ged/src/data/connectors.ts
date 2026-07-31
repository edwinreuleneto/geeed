// Estado simulado do conector SharePoint. Ver docs/domain/connectors/sharepoint.md.

export type ConnectorHealth = "healthy" | "degraded" | "down";

export interface SyncEvent {
  id: string;
  at: string; // ISO
  itemsSynced: number;
  durationMs: number;
  status: "ok" | "partial" | "error";
  detail: string;
}

export interface ConnectorStatus {
  id: string;
  provider: "SharePoint Online";
  siteName: string;
  siteUrl: string;
  health: ConnectorHealth;
  connectedSince: string; // ISO
  lastSyncAt: string; // ISO
  nextSyncAt: string; // ISO
  itemsTracked: number;
  librariesTracked: number;
  latencyMs: number;
  scopes: string[];
  history: SyncEvent[];
}

export const SHAREPOINT_CONNECTOR: ConnectorStatus = {
  id: "conn-sharepoint",
  provider: "SharePoint Online",
  siteName: "Campolongo — Portal Corporativo",
  siteUrl: "https://campolongo.sharepoint.com/sites/portal",
  health: "healthy",
  connectedSince: "2026-04-01T12:00:00Z",
  lastSyncAt: "2026-07-30T08:45:00Z",
  nextSyncAt: "2026-07-30T09:15:00Z",
  itemsTracked: 1284,
  librariesTracked: 7,
  latencyMs: 218,
  scopes: ["Sites.Read.All", "Files.Read.All", "User.Read"],
  history: [
    { id: "s1", at: "2026-07-30T08:45:00Z", itemsSynced: 12, durationMs: 3400, status: "ok", detail: "Sync incremental (delta)" },
    { id: "s2", at: "2026-07-30T08:15:00Z", itemsSynced: 4, durationMs: 2100, status: "ok", detail: "Sync incremental (delta)" },
    { id: "s3", at: "2026-07-30T07:45:00Z", itemsSynced: 0, durationMs: 1800, status: "ok", detail: "Sem alterações" },
    { id: "s4", at: "2026-07-30T07:15:00Z", itemsSynced: 31, durationMs: 5200, status: "partial", detail: "2 itens sem permissão de leitura" },
    { id: "s5", at: "2026-07-30T06:45:00Z", itemsSynced: 9, durationMs: 2600, status: "ok", detail: "Sync incremental (delta)" },
  ],
};
