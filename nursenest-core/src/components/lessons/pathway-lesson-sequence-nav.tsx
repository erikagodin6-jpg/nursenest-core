import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export type PathwayLessonAdjacentHrefs = {
  prev: { href: string; title: string } | null;
  next: { href: string; title: string } | null;
};

/**
 * Classic NurseNest lesson chrome: horizontal prev / next strip (see `client/src/pages/lesson-detail.tsx`
 * ~`nav-prev-next`). Theme tokens only — no hardcoded grays.
 */
export function PathwayLessonSequenceNavBar({
  adjacent,
  className = "",
}: {
  adjacent: PathwayLessonAdjacentHrefs;
  /** Extra classes on the wrapper (e.g. `hidden md:grid` when a sticky mobile bar is present). */
  className?: string;
}) {
  const { prev, next } = adjacent;
  if (!prev && !next) return null;

  return (
    <nav
      className={`grid min-h-[2.25rem] grid-cols-[minmax(0,1fr)_2rem_minmax(0,1fr)] items-center gap-x-2 border-b border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] pb-3 ${className}`.trim()}
      aria-label="Previous and next lesson in this pathway"
    >
      <div className="min-w-0 overflow-hidden">
        {prev ? (
          <Link
            href={prev.href}
            className="group inline-flex max-w-full items-center gap-1.5 text-sm text-[var(--theme-muted-text)] transition-colors hover:text-primary"
          >
            <ChevronLeft className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-x-0.5" aria-hidden />
            <span className="hidden min-w-0 truncate sm:inline" title={prev.title}>
              {prev.title}
            </span>
            <span className="sm:hidden">Previous</span>
          </Link>
        ) : (
          <span className="select-none text-sm text-transparent" aria-hidden>
            —
          </span>
        )}
      </div>
      <div aria-hidden className="text-center text-[var(--theme-separator)]">
        ·
      </div>
      <div className="flex min-w-0 justify-end overflow-hidden">
        {next ? (
          <Link
            href={next.href}
            className="group inline-flex max-w-full items-center gap-1.5 text-sm text-[var(--theme-muted-text)] transition-colors hover:text-primary"
          >
            <span className="hidden min-w-0 truncate sm:inline" title={next.title}>
              {next.title}
            </span>
            <span className="sm:hidden">Next</span>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ) : (
          <span className="select-none text-sm text-transparent" aria-hidden>
            —
          </span>
        )}
      </div>
    </nav>
  );
}
