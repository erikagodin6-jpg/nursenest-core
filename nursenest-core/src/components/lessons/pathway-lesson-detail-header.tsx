import Link from "next/link";
import type { ReactNode } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { pathwayCountryLabel } from "@/lib/lessons/pathway-lesson-hub-seo";

type Props = {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  lessonTitle: string;
  lessonTopic: string;
  bodySystem: string;
  /** Right column: progress badge live, etc. */
  trailing?: ReactNode;
  /** Exam alignment chips (relevance, tier, geography) — below the eyebrow row. */
  metaChips?: ReactNode;
};

/**
 * Pathway lesson detail — title band, exam context, back link to hub (marketing).
 */
export function PathwayLessonDetailHeader({
  pathway,
  lessonsBasePath,
  lessonTitle,
  lessonTopic,
  bodySystem,
  trailing,
  metaChips,
}: Props) {
  const place = pathwayCountryLabel(pathway);

  return (
    <header className="relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_12%,var(--border-subtle))] bg-gradient-to-br from-[var(--nn-presentation-wash)] via-[var(--theme-page-bg)] to-[color-mix(in_srgb,var(--theme-primary)_5%,var(--theme-page-bg))] px-5 py-7 shadow-[var(--shadow-card)] sm:px-8 sm:py-9">
      <div
        className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_7%,transparent)] blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wide text-primary">
          <span>{lessonTopic}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span>{pathway.shortName}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span>{place}</span>
        </div>
        {metaChips ? <div className="mt-3 flex flex-wrap gap-1.5">{metaChips}</div> : null}
        <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="nn-marketing-caption font-semibold text-[var(--theme-muted-text)]">{pathway.displayName}</p>
            <h1 className="mt-2 text-balance text-3xl font-extrabold tracking-tight text-[var(--theme-heading-text)] sm:text-[2rem] sm:leading-tight">
              {lessonTitle}
            </h1>
            <p className="nn-marketing-body-sm mt-4 text-[var(--theme-muted-text)]">
              <span className="font-medium text-[var(--theme-heading-text)]">{bodySystem}</span>
              <span aria-hidden className="mx-2 text-[var(--theme-muted-text)]">
                ·
              </span>
              Exam-scoped lesson — not generic nursing overview. Use the study strip at the end to practice in the same scope.
            </p>
          </div>
          {trailing ? <div className="shrink-0">{trailing}</div> : null}
        </div>
        <div className="mt-6 border-t border-[color-mix(in_srgb,var(--border-subtle)_85%,transparent)] pt-5">
          <Link
            href={lessonsBasePath}
            className="inline-flex min-h-10 items-center text-sm font-semibold text-primary hover:underline"
          >
            ← All lessons · {pathway.shortName}
          </Link>
        </div>
      </div>
    </header>
  );
}
