// Types
import type { Folder, GedDocument, GedUser } from "@/types/ged";

export interface DocumentCardProps {
  document: GedDocument;
  owner?: GedUser;
  folder?: Folder;
  currentUser: GedUser;
  view?: "grid" | "list";
  now: number;
}
