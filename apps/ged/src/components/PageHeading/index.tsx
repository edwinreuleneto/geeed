// Types
import type { PageHeadingProps } from "./page-heading.types";

export default function PageHeading({ eyebrow, title, subtitle, actions }: PageHeadingProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-faint">
          {eyebrow}
        </p>
        <h1 className="display mt-1.5 text-[clamp(1.75rem,2.6vw,2.125rem)] font-semibold text-ink">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-2 max-w-xl text-[14px] leading-relaxed text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      {actions ? <div className="shrink-0 pb-1">{actions}</div> : null}
    </div>
  );
}
