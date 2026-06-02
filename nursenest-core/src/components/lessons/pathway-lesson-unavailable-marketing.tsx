import Link from "next/link";
import { buildExamPathwayPath } from "@/lib/exam-pathways/build-exam-pathway-path";
import { marketingPathwayLessonsIndexPath } from "@/lib/lessons/lesson-routes";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

type Props = {
  pathway: ExamPathwayDefinition;
  requestedSlug: string;
  reason: string;
};

/**
 * Soft landing when a marketing lesson URL does not resolve to a public lesson document
 * (missing slug, renamed slug without redirect, incomplete publish, or transient load failure).
 */
export function PathwayLessonUnavailableMarketing({ pathway, requestedSlug, reason }: Props) {
  const hubHref = marketingPathwayLessonsIndexPath(pathway);
  const overviewHref = buildExamPathwayPath(pathway);
  return (
    <div className="mx-auto max-w-lg rounded-[1.5rem] border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 shadow-[var(--semantic-shadow-soft)]">
      <h1 className="text-xl font-semibold text-[var(--theme-heading-text)]">Lesson unavailable</h1>
      <p className="mt-3 text-sm text-[var(--theme-muted-text)]">
        We could not load this lesson for {pathway.shortName}. The link may be outdated or this lesson may still be
        in preparation.
      </p>
      <p className="mt-2 font-mono text-xs text-[var(--theme-muted-text)]">
        <span className="font-sans font-medium text-[var(--theme-heading-text)]">Requested slug:</span>{" "}
        {requestedSlug.length > 0 ? requestedSlug : "(empty)"}
      </p>
      {process.env.NODE_ENV !== "production" ? (
        <p className="mt-2 text-xs text-[var(--semantic-warning)]">Diagnostic: {reason}</p>
      ) : null}
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={hubHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Back to lesson hub
        </Link>
        <Link
          href={overviewHref}
          className="inline-flex min-h-[44px] items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-card"
        >
          Exam overview
        </Link>
      </div>
    </div>
  );
}
