// Libs
import { Lock, ShieldCheck, ShieldAlert, Globe } from "lucide-react";

// Utils
import { cn } from "@/lib/utils";
import { CLASSIFICATION } from "@/utils/labels";

// Types
import type { Classification } from "@/types/ged";
import type { SecurityBadgeProps } from "./security-badge.types";

const ICON: Record<Classification, typeof Lock> = {
  publico: Globe,
  interno: ShieldCheck,
  confidencial: ShieldAlert,
  restrito: Lock,
};

export default function SecurityBadge({
  classification,
  size = "sm",
  withIcon = true,
}: SecurityBadgeProps) {
  const tone = CLASSIFICATION[classification];
  const Icon = ICON[classification];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium",
        size === "sm" ? "px-1.5 py-0.5 text-[10.5px]" : "px-2 py-1 text-[11.5px]",
        tone.soft,
      )}
    >
      {withIcon ? (
        <Icon className="h-3 w-3 opacity-80" strokeWidth={2} aria-hidden="true" />
      ) : (
        <span className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      )}
      {tone.label}
    </span>
  );
}
