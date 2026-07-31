// Ponto único de acesso ao mock DB. Simula uma fonte de dados assíncrona
// (Promises + pequeno atraso) para que a troca por uma API real — ex.: SharePoint —
// fique restrita a esta camada. Ver docs/decisions/0002-mock-first.md.

// Data
import { DOCUMENTS } from "./documents";
import { FOLDERS } from "./folders";
import { USERS, CURRENT_USER_ID, remapUserId } from "./users";
import { SHAREPOINT_CONNECTOR } from "./connectors";
import { AI_INSIGHTS } from "./ai";
import { TEAMS } from "./teams";
import { getMetadata } from "./metadata";
import { UPLOADS } from "./uploads";

// Types
import type {
  AiInsight,
  DocumentKind,
  DocumentMetadata,
  GedDocument,
  Folder,
  GedUser,
  PermissionLevel,
} from "@/types/ged";
import type { ConnectorStatus } from "./connectors";
import type { MsTeam } from "./teams";

export interface ExpirationItem {
  docId: string;
  name: string;
  kind: DocumentKind;
  contentType: string;
  expiresAt: string;
}

/** Latência artificial para simular rede e exercitar estados de loading. */
const LATENCY_MS = 220;

function delay<T>(value: T, ms = LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

/** Clona para evitar mutação acidental do "banco" em memória. */
function clone<T>(value: T): T {
  return structuredClone(value);
}

// --- Redução para dois usuários -----------------------------------------------
// Os dados semente citam 6 pessoas; como agora só existem Edwin e Luiz, remapeamos
// aqui (na borda de dados) para que dono/atores/membros/permissões sempre resolvam.

const LEVEL_RANK: Record<PermissionLevel, number> = { view: 0, download: 1, edit: 2, owner: 3 };

function remapDocument(doc: GedDocument): GedDocument {
  doc.ownerId = remapUserId(doc.ownerId);
  for (const ev of doc.activity) ev.actorId = remapUserId(ev.actorId);
  for (const p of doc.permissions) {
    if (p.subjectType === "user") p.subjectId = remapUserId(p.subjectId);
  }
  // Remove permissões duplicadas (o remapeamento pode colidir), mantendo o maior nível.
  const byKey = new Map<string, (typeof doc.permissions)[number]>();
  for (const p of doc.permissions) {
    const key = `${p.subjectType}:${p.subjectId}`;
    const existing = byKey.get(key);
    if (!existing || LEVEL_RANK[p.level] > LEVEL_RANK[existing.level]) byKey.set(key, p);
  }
  doc.permissions = [...byKey.values()];
  return doc;
}

function remapTeam(team: MsTeam): MsTeam {
  team.ownerId = remapUserId(team.ownerId);
  team.memberIds = [...new Set(team.memberIds.map(remapUserId))];
  return team;
}

export const db = {
  documents: (): Promise<GedDocument[]> =>
    delay(clone([...UPLOADS, ...DOCUMENTS]).map(remapDocument)),
  // Retorna null (não undefined) quando não encontrado: useSuspenseQuery rejeita
  // `data: undefined`, mas aceita `null` — o que permite tratar 404 na UI.
  document: (id: string): Promise<GedDocument | null> => {
    const found = UPLOADS.find((d) => d.id === id) ?? DOCUMENTS.find((d) => d.id === id);
    return delay(found ? remapDocument(clone(found)) : null);
  },
  folders: (): Promise<Folder[]> => delay(clone(FOLDERS)),
  users: (): Promise<GedUser[]> => delay(clone(USERS)),
  user: (id: string): Promise<GedUser | undefined> =>
    delay(clone(USERS.find((u) => u.id === id))),
  currentUser: (): Promise<GedUser> =>
    delay(clone(USERS.find((u) => u.id === CURRENT_USER_ID)!)),
  connector: (): Promise<ConnectorStatus> => delay(clone(SHAREPOINT_CONNECTOR)),
  aiInsight: (id: string): Promise<AiInsight | null> => delay(clone(AI_INSIGHTS[id] ?? null)),
  teams: (): Promise<MsTeam[]> => delay(clone(TEAMS).map(remapTeam)),
  metadata: (id: string): Promise<DocumentMetadata | null> => {
    const doc = UPLOADS.find((d) => d.id === id) ?? DOCUMENTS.find((d) => d.id === id);
    return delay(doc ? clone(getMetadata(doc)) : null);
  },
  expirations: (): Promise<ExpirationItem[]> => {
    const items: ExpirationItem[] = DOCUMENTS.map((d) => ({ doc: d, meta: getMetadata(d) }))
      .filter((x) => Boolean(x.meta.expiresAt))
      .map((x) => ({
        docId: x.doc.id,
        name: x.doc.name,
        kind: x.doc.kind,
        contentType: x.meta.contentType,
        expiresAt: x.meta.expiresAt as string,
      }))
      .sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime());
    return delay(clone(items));
  },
};

export { CURRENT_USER_ID };
