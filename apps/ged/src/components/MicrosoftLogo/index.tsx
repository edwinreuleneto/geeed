// Utils
import { cn } from "@/lib/utils";

interface MicrosoftLogoProps {
  className?: string;
}

/** Logo oficial da Microsoft (quatro quadrados). */
export default function MicrosoftLogo({ className }: MicrosoftLogoProps) {
  return (
    <svg viewBox="0 0 24 24" className={cn("shrink-0", className)} aria-label="Microsoft" role="img">
      <rect x="1" y="1" width="10.2" height="10.2" fill="#F25022" />
      <rect x="12.8" y="1" width="10.2" height="10.2" fill="#7FBA00" />
      <rect x="1" y="12.8" width="10.2" height="10.2" fill="#00A4EF" />
      <rect x="12.8" y="12.8" width="10.2" height="10.2" fill="#FFB900" />
    </svg>
  );
}
