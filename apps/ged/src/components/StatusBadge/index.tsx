// Utils
import { cn } from "@/lib/utils";
import { STATUS } from "@/utils/labels";

// Types
import type { StatusBadgeProps } from "./status-badge.types";

export default function StatusBadge({ status, size = "sm" }: StatusBadgeProps) {
  const tone = STATUS[status];
  const pulse = status === "review" || status === "in_approval";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-medium text-ink-muted",
        size === "sm" ? "text-[10.5px]" : "text-[11.5px]",
      )}
    >
      <span className="relative flex h-1.5 w-1.5 shrink-0 items-center justify-center">
        {pulse ? (
          <span
            className={cn("absolute inline-flex h-full w-full rounded-full opacity-60", tone.dot)}
            style={{ animation: "ping-soft 1.8s cubic-bezier(0, 0, 0.2, 1) infinite" }}
            aria-hidden="true"
          />
        ) : null}
        <span className={cn("relative h-1.5 w-1.5 rounded-full", tone.dot)} aria-hidden="true" />
      </span>
      {tone.label}
    </span>
  );
}
