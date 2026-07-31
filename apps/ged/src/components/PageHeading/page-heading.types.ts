// Types
import type { ReactNode } from "react";

export interface PageHeadingProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}
