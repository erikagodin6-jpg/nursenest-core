import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PathwayLessonAdjacentHrefs = {
  prev: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
};

const navLinkClass =
  "inline-flex min-h-10 w-full flex-col items-stretch justify-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] sm:min-h-[2.35rem] sm:px-3 border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_96%,var(--semantic-panel-muted)_4%)] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--bg-card)_90%,var(--semantic-panel-positive)_10%)]";

const navLinkClassEnd =
  "inline-flex min-h-10 w-full flex-col items-stretch justify-center gap-0.5 rounded-lg border px-2.5 py-1.5 text-right text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] sm:min-h-[2.35rem] sm:px-3 border-[color-mix(in_srgb,var(--semantic-border-soft)_88%,var(--semantic-brand)_12%)] bg-[color-mix(in_srgb,var(--bg-card)_96%,var(--semantic-panel-muted)_4%)] text-[var(--theme-heading-text)] hover:border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--bg-card)_90%,var(--semantic-panel-positive)_10%)]";

const navDisabledClass =
  "inline-flex min-h-10 w-full cursor-not-allowed flex-col justify-center rounded-lg border px-2.5 py-1.5 text-left text-xs font-semibold opacity-60 sm:min-h-[2.35rem] sm:px-3 border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-muted-surface)_45%,var(--bg-card))] text-[var(--theme-muted-text)]";

const navDisabledClassEnd =
  "inline-flex min-h-10 w-full cursor-not-allowed flex-col justify-center rounded-lg border px-2.5 py-1.5 text-right text-xs font-semibold opacity-60 sm:min-h-[2.35rem] sm:px-3 border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--theme-muted-surface)_45%,var(--bg-card))] text-[var(--theme-muted-text)]";

const titleLineClass = "block max-w-full truncate text-[0.68rem] font-normal leading-tight text-[var(--theme-muted-text)]";

/**
 * Pathway lesson sequence: previous / next in hub order (`sort_order`, then slug).
 * Renders both controls; missing neighbor shows as disabled (first/last lesson in pathway).
 */
export function PathwayLessonSequenceNavBar({
  adjacent,
  className = "",
  previousLessonLabel = "Previous lesson",
  nextLessonLabel = "Next lesson",
}: {
  adjacent: PathwayLessonAdjacentHrefs;
  className?: string;
  previousLessonLabel?: string;
  nextLessonLabel?: string;
}) {
  const { prev, next } = adjacent;
  if (!prev && !next) return null;

  return (
    <nav
      className={`grid grid-cols-1 gap-1.5 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] pb-2 sm:grid-cols-2 ${className}`.trim()}
      aria-label="Previous and next lesson in this pathway"
    >
      <div className="min-w-0">
        {prev ? (
          <Link href={prev.href} className={`group ${navLinkClass}`} title={prev.title}>
            <span className="inline-flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              <span>{previousLessonLabel}</span>
            </span>
            <span className={titleLineClass}>{prev.title}</span>
          </Link>
        ) : (
          <span className={navDisabledClass} aria-disabled="true">
            <span className="inline-flex items-center gap-1.5">
              <ChevronLeft className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
              <span>{previousLessonLabel}</span>
            </span>
          </span>
        )}
      </div>
      <div className="min-w-0">
        {next ? (
          <Link href={next.href} className={`group ${navLinkClassEnd}`} title={next.title}>
            <span className="inline-flex items-center justify-end gap-1.5">
              <span>{nextLessonLabel}</span>
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
            <span className={`${titleLineClass} text-right`}>{next.title}</span>
          </Link>
        ) : (
          <span className={navDisabledClassEnd} aria-disabled="true">
            <span className="inline-flex items-center justify-end gap-1.5">
              <span>{nextLessonLabel}</span>
              <ChevronRight className="h-4 w-4 shrink-0 opacity-50" aria-hidden />
            </span>
          </span>
        )}
      </div>
    </nav>
  );
}
