import Link from "next/link";

const linkClass = "font-semibold text-primary underline-offset-4 hover:underline";

/**
 * Shared internal links for crawl paths: lessons hub, tools, blog, pricing.
 * Keeps marketing surfaces from dead-ending after long-form content.
 */
export function MarketingStudyCrossLinks({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 sm:p-8 ${className}`}
      aria-labelledby="study-cross-links-heading"
    >
      <h2 id="study-cross-links-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
        Keep building readiness
      </h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        Pair reading with structured lessons, free calculators, and guides—then choose a pathway-aligned plan when you want
        full question banks and exams.
      </p>
      <ul className="mt-4 flex flex-col gap-2 text-sm sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
        <li>
          <Link href="/exam-lessons" className={linkClass}>
            Exam lesson hubs
          </Link>
        </li>
        <li>
          <Link href="/tools" className={linkClass}>
            Clinical tools (free)
          </Link>
        </li>
        <li>
          <Link href="/blog" className={linkClass}>
            Blog
          </Link>
        </li>
        <li>
          <Link href="/pricing" className={linkClass}>
            Plans & pricing
          </Link>
        </li>
      </ul>
    </aside>
  );
}
