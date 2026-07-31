// Types
import type { GedUser } from "@/types/ged";

export interface UserAvatarProps {
  user: Pick<GedUser, "initials" | "accent" | "name" | "avatarUrl">;
  size?: "xs" | "sm" | "md" | "lg";
  showStatus?: boolean;
}
