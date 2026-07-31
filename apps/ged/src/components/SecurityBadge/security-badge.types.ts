// Types
import type { Classification } from "@/types/ged";

export interface SecurityBadgeProps {
  classification: Classification;
  size?: "sm" | "md";
  withIcon?: boolean;
}
