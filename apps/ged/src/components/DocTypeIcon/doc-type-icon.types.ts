// Types
import type { DocumentKind } from "@/types/ged";

export interface DocTypeIconProps {
  kind: DocumentKind;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}
