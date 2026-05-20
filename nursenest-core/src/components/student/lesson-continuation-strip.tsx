import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import type { LessonContinuationRow } from "@/lib/learner/pathway-lesson-continuation";

export function LessonContinuationStrip({ rows }: { rows: LessonContinuationRow[] }) {
  if (rows.length === 0) return null;

  return (
    <section className="nn-card p-5" aria-labelledby="lesson-continuation-heading">
      <div className="flex flex-wrap items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" aria-hidden />
        <h2 id="lesson-continuation-heading" className="text-lg font-semibold text-[var(--theme-heading-text)]">
          Continue lessons
        </h2>
      </div>
      <p className="mt-1 text-xs text-muted">Resume where you left off on each track.</p>
      <ul className="mt-4 space-y-2">
        {rows.map((row) => (
          <li key={row.kind}>
            <Link
              href={row.href}
              className="flex flex-wrap items-baseline justify-between gap-2 rounded-lg border border-border/60 bg-muted/15 px-3 py-2.5 text-sm transition-colors hover:bg-muted/30"
            >
              <span className="font-semibold text-primary">{row.title}</span>
              <span className="flex items-center gap-1 text-xs text-muted">
                {row.pathwayShortName}
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
