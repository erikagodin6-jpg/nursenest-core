import Link from "next/link";
import type { ReactNode } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { validateLearnerCopyForExamContext } from "@/lib/learner/validate-learner-copy-context";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";

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
  const examName = pathwayRegionAwareExamName(pathway);
  validateLearnerCopyForExamContext(pathway, lessonTitle, "lesson_header");

  return (
    <header
      data-nn-pathway-id={pathway.id}
      data-nn-exam-short={examName}
      className="nn-gradient-safe relative overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] bg-gradient-to-br from-[var(--nn-presentation-wash)] via-[var(--theme-page-bg)] to-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-page-bg))] px-4 py-5 shadow-[var(--shadow-card)] sm:px-6 sm:py-6"
    >
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_7%,transparent)] blur-3xl"
        aria-hidden
      />
      <div className="relative">
        {/* Exam-first trust band: shortName + country before topic so REx-PN / NCLEX-PN identity reads clearly (hierarchy). */}
        <div
          className="flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-xl border border-[color-mix(in_srgb,var(--theme-primary)_12%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_4.5%,var(--bg-card))] px-3 py-2.5 text-sm shadow-[var(--shadow-card)]"
          role="group"
          aria-label={`${examName}, ${place}`}
        >
          <span className="font-semibold text-[var(--theme-heading-text)]">{examName}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span className="text-[var(--theme-body-text)]">{place}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span className="text-[var(--theme-muted-text)]">{lessonTopic}</span>
        </div>
        {metaChips ? <div className="mt-3 flex flex-wrap gap-1.5">{metaChips}</div> : null}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="nn-marketing-caption font-semibold text-[var(--theme-muted-text)]">{pathway.displayName}</p>
            <h1 className="nn-marketing-h2 mt-2 text-balance">
              {lessonTitle}
            </h1>
            <p className="nn-marketing-body-sm mt-3 text-[var(--theme-muted-text)]">
              <span className="font-medium text-[var(--theme-heading-text)]">{bodySystem}</span>
              <span aria-hidden className="mx-2 text-[var(--theme-muted-text)]">
                ·
              </span>
              Exam-scoped lesson — not generic nursing overview. Use the study strip at the end to practice in the same scope.
            </p>
          </div>
          {trailing ? <div className="shrink-0">{trailing}</div> : null}
        </div>
        <div className="mt-4 border-t border-[color-mix(in_srgb,var(--border-subtle)_88%,var(--theme-primary))] pt-3.5">
          <Link
            href={lessonsBasePath}
            className="nn-study-pill-secondary inline-flex min-h-11 items-center justify-center px-5 py-2.5 text-sm font-semibold text-primary"
          >
            ← All lessons · {examName}
          </Link>
        </div>
      </div>
    </header>
  );
}
