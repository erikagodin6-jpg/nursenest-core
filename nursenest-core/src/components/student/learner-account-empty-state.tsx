import Link from "next/link";

/**
 * Low-data / onboarding empty state for account hub pages — reassuring, not “broken”.
 */
export function LearnerAccountEmptyState({
  title,
  body,
  ctaHref,
  ctaLabel,
  secondaryHref,
  secondaryLabel,
}: {
  title: string;
  body: string;
  ctaHref: string;
  ctaLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="rounded-2xl border border-dashed border-primary/25 bg-gradient-to-br from-primary/[0.04] via-transparent to-emerald-500/[0.03] p-8 text-center">
      <p className="text-sm font-semibold text-[var(--theme-heading-text)]">{title}</p>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">{body}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        <Link
          href={ctaHref}
          className="inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:opacity-95"
        >
          {ctaLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="inline-flex rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted/80"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
