import Link from "next/link";
import type { ProgrammaticInternalLink } from "@/lib/seo/programmatic-seo-engine/types";

/**
 * Server-rendered crawlable block for high-intent study continuation links.
 * Renders nothing when the planner returns too few destinations (anti-spam).
 */
export function ProgrammaticSeoContinuationSection({
  heading = "Continue studying",
  links,
}: {
  heading?: string;
  links: ProgrammaticInternalLink[];
}) {
  if (links.length < 2) return null;
  return (
    <nav
      className="not-prose mt-10 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-5"
      aria-label="Related study destinations"
    >
      <h2 className="text-base font-semibold text-[var(--theme-heading-text)]">{heading}</h2>
      <p className="mt-1 text-sm text-[var(--theme-muted-text)]">
        Pathway-aligned lessons, practice, and review — same exam scope as this article.
      </p>
      <ul className="mt-4 space-y-2 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="font-medium text-primary hover:underline">
              {l.anchor}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
