import Link from "next/link";
import type { ReactNode } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { validateLearnerCopyForExamContext } from "@/lib/learner/validate-learner-copy-context";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { compactPathwayLabel } from "@/lib/lessons/lesson-title-presentation";

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
  const compactExamName = compactPathwayLabel(examName);
  validateLearnerCopyForExamContext(pathway, lessonTitle, "lesson_header");

  return (
    <header
      data-nn-pathway-id={pathway.id}
      data-nn-exam-short={examName}
      className="nn-gradient-safe relative overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--theme-primary)_10%,var(--border-subtle))] bg-gradient-to-br from-[var(--nn-presentation-wash)] via-[var(--theme-page-bg)] to-[color-mix(in_srgb,var(--theme-primary)_4%,var(--theme-page-bg))] px-4 py-3 shadow-[var(--shadow-card)] sm:px-5 sm:py-4"
    >
      {/*
        Layout mirrors legacy `client/src/pages/lesson-detail.tsx` title + ~220px action column:
        main study context left, progress / CTAs right on md+.
      */}
      <div
        className="pointer-events-none absolute -right-10 -top-12 h-36 w-36 rounded-full bg-[color-mix(in_srgb,var(--theme-primary)_7%,transparent)] blur-3xl"
        aria-hidden
      />
      <div className="relative">
        {/* Exam-first trust band: shortName + country before topic so REx-PN / NCLEX-PN identity reads clearly (hierarchy). */}
        <div
          className="flex max-w-full flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-xl border border-[color-mix(in_srgb,var(--theme-primary)_12%,var(--border-subtle))] bg-[color-mix(in_srgb,var(--theme-primary)_4.5%,var(--bg-card))] px-3 py-2.5 text-sm shadow-[var(--shadow-card)]"
          role="group"
          aria-label={`${compactExamName}, ${place}, ${bodySystem}`}
        >
          <span className="font-medium text-[var(--theme-heading-text)]">{compactExamName}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span className="text-[var(--theme-body-text)]">{place}</span>
          <span aria-hidden className="text-[var(--theme-muted-text)]">
            ·
          </span>
          <span className="text-[var(--theme-muted-text)]">{bodySystem}</span>
        </div>
        {metaChips ? <div className="mt-3 flex flex-wrap gap-1.5">{metaChips}</div> : null}
        <div className="mt-3 grid grid-cols-1 items-start gap-4 md:grid-cols-[minmax(0,1fr)_minmax(11rem,13.75rem)] md:gap-x-6">
          <div className="min-w-0">
            <h1 className="nn-lesson-page-title mt-1 text-balance">
              {lessonTitle}
            </h1>
            <p className="mt-2 max-w-prose text-sm leading-relaxed text-[var(--theme-body-text)]">
              <span className="font-medium text-[var(--theme-heading-text)]">{lessonTopic}</span>
              <span aria-hidden className="mx-2 text-[var(--theme-muted-text)]">
                ·
              </span>
              Focused lesson content with practice questions and exam-style drills linked below.
            </p>
          </div>
          {trailing ? (
            <div className="flex w-full flex-col gap-2 md:items-stretch md:justify-self-end md:pt-0.5">{trailing}</div>
          ) : null}
        </div>
        <div className="mt-3 border-t border-[color-mix(in_srgb,var(--border-subtle)_88%,var(--theme-primary))] pt-3">
          <Link
            href={lessonsBasePath}
            className="nn-study-pill-secondary inline-flex min-h-10 items-center justify-center px-4 py-2 text-sm font-medium text-primary"
          >
            ← All lessons
          </Link>
        </div>
      </div>
    </header>
  );
}
