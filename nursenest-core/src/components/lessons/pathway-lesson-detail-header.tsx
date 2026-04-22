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
  /** Exam alignment chips (relevance, tier, geography) — compact row below title. */
  metaChips?: ReactNode;
  /** Optional app links (same targets as bottom actions) — shown as quiet secondary row. */
  studyQuickLinks?: {
    practiceHref: string;
    flashcardsHref: string;
    practiceLabel: ReactNode;
    flashcardsLabel: ReactNode;
  } | null;
  /** One line when pre/post assessments exist (set by parent). */
  assessmentFlowHint?: string | null;
};

/**
 * Shown while lesson document / entitlements resolve (Suspense fallback). Matches the real header’s
 * `data-nn-pathway-id` / layout so route-level loading never swaps in a hub skeleton without this landmark.
 */
export function PathwayLessonDetailHeaderSkeleton({ pathway }: { pathway: ExamPathwayDefinition }) {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const compactExamName = compactPathwayLabel(examName);
  return (
    <header
      data-nn-pathway-id={pathway.id}
      data-nn-exam-short={examName}
      aria-busy="true"
      aria-label={`${compactExamName}, ${place} — loading lesson`}
      className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_98%,var(--semantic-panel-muted)_2%)] px-4 py-3 sm:px-5 sm:py-4"
    >
      <div className="nn-skeleton mb-2 h-3 w-48 rounded" />
      <div className="nn-skeleton h-8 w-[min(100%,24rem)] rounded-lg" />
      <div className="nn-skeleton mt-2 h-3 w-40 rounded" />
    </header>
  );
}

/** Pathway lesson detail — compact hero: hub wayfinding, title, topic, optional study links (marketing). */
export function PathwayLessonDetailHeader({
  pathway,
  lessonsBasePath,
  lessonTitle,
  lessonTopic,
  bodySystem,
  trailing,
  metaChips,
  studyQuickLinks,
  assessmentFlowHint,
}: Props) {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const compactExamName = compactPathwayLabel(examName);
  const hasTrailing = Boolean(trailing);
  validateLearnerCopyForExamContext(pathway, lessonTitle, "lesson_header");

  return (
    <header
      data-nn-pathway-id={pathway.id}
      data-nn-exam-short={examName}
      className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_10%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_97%,var(--semantic-panel-cool)_3%)] px-4 py-3 sm:px-5 sm:py-4"
    >
      <nav aria-label="Lesson location" className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[11px] font-medium text-[var(--theme-muted-text)] sm:text-xs">
        <Link
          href={lessonsBasePath}
          className="text-[var(--semantic-brand)] underline-offset-2 hover:text-[var(--theme-heading-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
        >
          Lesson hub
        </Link>
        <span aria-hidden className="text-[var(--semantic-border-soft)]">
          /
        </span>
        <span>{place}</span>
        {bodySystem?.trim() ? (
          <>
            <span aria-hidden className="text-[var(--semantic-border-soft)]">
              ·
            </span>
            <span className="text-[var(--theme-body-text)]">{bodySystem.trim()}</span>
          </>
        ) : null}
        <span className="sr-only"> ({compactExamName})</span>
      </nav>

      <div className={`mt-2.5 ${hasTrailing ? "lg:flex lg:items-start lg:justify-between lg:gap-6" : ""}`}>
        <div className="min-w-0 flex-1">
          <h1 className="nn-lesson-page-title text-balance">{lessonTitle}</h1>
          <p className="mt-1.5 text-sm font-medium leading-snug text-[var(--theme-heading-text)] sm:text-[0.9375rem]">
            {lessonTopic}
          </p>
          {assessmentFlowHint ? (
            <p className="mt-2 max-w-prose text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm">
              {assessmentFlowHint}
            </p>
          ) : null}
          {metaChips ? <div className="mt-3 flex flex-wrap gap-1.5">{metaChips}</div> : null}
          {studyQuickLinks ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Link
                href={studyQuickLinks.practiceHref}
                data-nn-pathway-id={pathway.id}
                className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--semantic-brand)] px-3.5 py-2 text-xs font-semibold text-[var(--text-on-dark)] shadow-sm transition hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:text-sm"
              >
                {studyQuickLinks.practiceLabel}
              </Link>
              <Link
                href={studyQuickLinks.flashcardsHref}
                data-nn-pathway-id={pathway.id}
                className="inline-flex min-h-10 items-center justify-center rounded-md border border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--semantic-brand)_15%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_92%,var(--semantic-surface)_8%)] px-3.5 py-2 text-xs font-semibold text-[var(--theme-heading-text)] transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--theme-page-bg))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:text-sm"
              >
                {studyQuickLinks.flashcardsLabel}
              </Link>
            </div>
          ) : null}
        </div>
        {trailing ? <div className="mt-3 flex shrink-0 flex-col gap-2 lg:mt-0 lg:items-end lg:pt-0.5">{trailing}</div> : null}
      </div>

      <div className="mt-3 border-t border-[var(--semantic-border-soft)] pt-2.5">
        <Link
          href={lessonsBasePath}
          className="text-xs font-medium text-[var(--semantic-brand)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:text-sm"
        >
          ← All lessons
        </Link>
      </div>
    </header>
  );
}
