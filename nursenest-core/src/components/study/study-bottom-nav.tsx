import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type NavLink = {
  label: string;
  href: string;
};

type Props = {
  prev?: NavLink;
  next?: NavLink;
  /** Related quick-links shown in the bottom row */
  relatedLinks?: NavLink[];
};

/**
 * Shared bottom navigation block used on both Lessons and Questions hub pages.
 * Shows prev/next page-level navigation and a row of related surface links.
 */
export function StudyBottomNav({ prev, next, relatedLinks }: Props) {
  if (!prev && !next && (!relatedLinks || relatedLinks.length === 0)) return null;

  return (
    <nav
      aria-label="Page navigation"
      className="mt-12 border-t border-[var(--semantic-border-soft)] pt-8"
    >
      {(prev ?? next) ? (
        <div className="flex items-center justify-between gap-4">
          {prev ? (
            <Link
              href={prev.href}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[var(--semantic-brand)] hover:text-[var(--semantic-brand)]"
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
              {prev.label}
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={next.href}
              className="group inline-flex items-center gap-2 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)] shadow-[var(--semantic-shadow-soft)] transition-colors hover:border-[var(--semantic-brand)] hover:text-[var(--semantic-brand)]"
            >
              {next.label}
              <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </Link>
          ) : null}
        </div>
      ) : null}

      {relatedLinks && relatedLinks.length > 0 ? (
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          <span className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            Also on this pathway:
          </span>
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-[var(--semantic-brand)] hover:underline"
            >
              {link.label}
            </Link>
          ))}
        </div>
      ) : null}
    </nav>
  );
}
