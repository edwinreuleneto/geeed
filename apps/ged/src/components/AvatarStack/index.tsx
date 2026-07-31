// Components
import UserAvatar from "@/components/UserAvatar";

// Utils
import { cn } from "@/lib/utils";

// Types
import type { GedUser } from "@/types/ged";

interface AvatarStackProps {
  users: GedUser[];
  max?: number;
  size?: "xs" | "sm" | "md";
}

const RING = {
  xs: "ring-2",
  sm: "ring-2",
  md: "ring-[3px]",
};

export default function AvatarStack({ users, max = 4, size = "sm" }: AvatarStackProps) {
  const shown = users.slice(0, max);
  const extra = users.length - shown.length;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {shown.map((u) => (
          <span
            key={u.id}
            className={cn("rounded-full ring-surface-elevated", RING[size])}
          >
            <UserAvatar user={u} size={size} />
          </span>
        ))}
        {extra > 0 ? (
          <span
            className={cn(
              "flex items-center justify-center rounded-full bg-surface-alt font-medium text-ink-muted ring-surface-elevated",
              RING[size],
              size === "xs" ? "h-6 w-6 text-[10px]" : size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-[12px]",
            )}
          >
            +{extra}
          </span>
        ) : null}
      </div>
    </div>
  );
}
