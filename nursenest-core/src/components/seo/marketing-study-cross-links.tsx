import Link from "next/link";
import { HUB } from "@/lib/marketing/marketing-entry-routes";

const linkClass = "nn-marketing-body-sm font-semibold text-primary underline-offset-4 hover:underline";

/**
 * Shared internal links for crawl paths: lessons, practice exams, question bank, tools, pricing.
 * Keeps marketing surfaces from dead-ending after long-form content.
 */
export function MarketingStudyCrossLinks({ className = "" }: { className?: string }) {
  return (
    <aside
      className={`rounded-2xl border border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 sm:p-8 ${className}`}
      aria-labelledby="study-cross-links-heading"
    >
      <h2 id="study-cross-links-heading" className="nn-marketing-h3">
        Keep building readiness
      </h2>
      <p className="mt-2 nn-marketing-body-sm text-[var(--theme-muted-text)]">
        Pair reading with structured lessons, then move into the question bank or practice exams on your pathway. Use free tools
        while you decide; upgrade when you want full banks and saved history.
      </p>
      <ul className="mt-4 flex flex-col gap-2 nn-marketing-body-sm sm:flex-row sm:flex-wrap sm:gap-x-6 sm:gap-y-2">
        <li>
          <Link href="/lessons" className={linkClass}>
            Clinical lessons by pathway
          </Link>
        </li>
        <li>
          <Link href={HUB.questionBank} className={linkClass}>
            Question bank overview
          </Link>
        </li>
        <li>
          <Link href={HUB.practiceExams} className={linkClass}>
            Practice exams overview
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
