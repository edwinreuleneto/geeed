// Uploads temporários (em memória, apenas nesta sessão). Documentos enviados pelo
// usuário aparecem na biblioteca e podem ser abertos de verdade (imagem/PDF via
// object URL). Não persistem em refresh — é uma demonstração funcional.

// Types
import type { DocumentKind, GedDocument } from "@/types/ged";

/** Documentos enviados nesta sessão (mais recentes primeiro). */
export const UPLOADS: GedDocument[] = [];

/** docId → object URL do arquivo, para pré-visualização real. */
const FILE_URLS = new Map<string, string>();

let counter = 0;

function kindFromName(name: string): DocumentKind {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "pdf") return "pdf";
  if (["doc", "docx", "rtf", "odt"].includes(ext)) return "docx";
  if (["xls", "xlsx", "csv", "ods"].includes(ext)) return "xlsx";
  if (["ppt", "pptx", "odp"].includes(ext)) return "pptx";
  if (["png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"].includes(ext)) return "image";
  if (["dwg", "dxf"].includes(ext)) return "cad";
  return "other";
}

export function isPreviewable(kind: DocumentKind): boolean {
  return kind === "image" || kind === "pdf";
}

export function isUploadId(id: string): boolean {
  return id.startsWith("up-");
}

export function getUploadUrl(id: string): string | undefined {
  return FILE_URLS.get(id);
}

/** Cria um documento a partir de um arquivo enviado e o registra na sessão. */
export function addUpload(file: File): GedDocument {
  counter += 1;
  const id = `up-${counter}-${file.name.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
  const nowIso = new Date().toISOString();
  const kind = kindFromName(file.name);
  const sizeKb = Math.max(1, Math.round(file.size / 1024));

  const doc: GedDocument = {
    id,
    name: file.name,
    kind,
    folderId: "",
    classification: "interno",
    status: "draft",
    department: "TI",
    ownerId: "u-edwin",
    tags: ["upload", "sessão"],
    sizeKb,
    pages: 1,
    source: "upload",
    createdAt: nowIso,
    updatedAt: nowIso,
    versions: [
      { version: "v1", label: "Envio", authorId: "u-edwin", at: nowIso, sizeKb, note: "Enviado nesta sessão" },
    ],
    activity: [{ id: "a1", actorId: "u-edwin", action: "upload", at: nowIso }],
    permissions: [
      { subjectType: "user", subjectId: "u-edwin", level: "owner" },
      { subjectType: "role", subjectId: "admin", level: "owner" },
    ],
    favorite: false,
  };

  UPLOADS.unshift(doc);
  if (typeof URL !== "undefined" && isPreviewable(kind)) {
    FILE_URLS.set(id, URL.createObjectURL(file));
  }
  return doc;
}
