// Utils
import { cn } from "@/lib/utils";

// Types
import type { UserAvatarProps } from "./user-avatar.types";

const SIZES = {
  xs: "h-6 w-6 text-[10px]",
  sm: "h-8 w-8 text-[11.5px]",
  md: "h-10 w-10 text-[13px]",
  lg: "h-14 w-14 text-[16px]",
};

export default function UserAvatar({ user, size = "sm", showStatus = false }: UserAvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full font-medium ring-1 ring-black/[0.06]",
        SIZES[size],
        user.accent,
      )}
      title={user.name}
    >
      {user.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={user.avatarUrl}
          alt={user.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      ) : (
        <span aria-hidden="true">{user.initials}</span>
      )}
      {showStatus ? (
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface-elevated bg-emerald-500" />
      ) : null}
    </span>
  );
}
