import Link from "next/link";
import * as React from "react";
import type { ReactNode } from "react";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";
import { validateLearnerCopyForExamContext } from "@/lib/learner/validate-learner-copy-context";
import { pathwayCountryLabel, pathwayRegionAwareExamName } from "@/lib/lessons/pathway-lesson-hub-seo";
import { cleanLessonTitleForDisplay, compactPathwayLabel } from "@/lib/lessons/lesson-title-presentation";

type Props = {
  pathway: ExamPathwayDefinition;
  lessonsBasePath: string;
  lessonTitle: string;
  lessonTopic: string;
  bodySystem: string;
  /** Optional clinical hero (e.g. matched inventory image) — rendered below the title block, centered. */
  heroBelowTitle?: ReactNode;
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
  /** Centered marketing hero: title, topic, and chips align to the middle; wayfinding stays readable above. */
  heroLayout?: "default" | "centered";
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
      className="nn-premium-pathway-lesson-header rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_98%,var(--semantic-panel-muted)_2%)] px-4 py-3 sm:px-5 sm:py-4"
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
  heroBelowTitle,
  trailing,
  metaChips,
  studyQuickLinks,
  assessmentFlowHint,
  heroLayout = "default",
}: Props) {
  const place = pathwayCountryLabel(pathway);
  const examName = pathwayRegionAwareExamName(pathway);
  const compactExamName = compactPathwayLabel(examName);
  const hasTrailing = Boolean(trailing);
  const centered = heroLayout === "centered";
  validateLearnerCopyForExamContext(pathway, lessonTitle, "lesson_header");
  const displayLessonTitle = cleanLessonTitleForDisplay(lessonTitle);

  return (
    <header
      data-nn-pathway-id={pathway.id}
      data-nn-exam-short={examName}
      data-nn-lesson-hero-centered={centered ? "true" : undefined}
      data-nn-premium-lessons-reading-hero
      className={[
        "nn-premium-pathway-lesson-header relative overflow-hidden rounded-xl border px-4 py-3.5 sm:px-5 sm:py-4",
        centered
          ? "nn-lesson-detail-hero border-[color-mix(in_srgb,var(--semantic-border-soft)_85%,var(--semantic-brand)_15%)] bg-[linear-gradient(165deg,color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--theme-page-bg))_0%,color-mix(in_srgb,var(--semantic-panel-positive)_12%,var(--theme-page-bg))_48%,color-mix(in_srgb,var(--semantic-panel-warm)_10%,var(--theme-page-bg))_100%)] shadow-[0_1px_0_color-mix(in_srgb,var(--semantic-border-soft)_70%,transparent)]"
          : "rounded-lg border-[color-mix(in_srgb,var(--semantic-border-soft)_90%,var(--semantic-brand)_10%)] bg-[color-mix(in_srgb,var(--theme-page-bg)_97%,var(--semantic-panel-cool)_3%)]",
      ].join(" ")}
    >
      <nav
        aria-label="Lesson location"
        className={[
          "flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-[var(--theme-muted-text)] sm:text-xs",
          centered ? "justify-center opacity-90" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link
          href={lessonsBasePath}
          className="text-[var(--semantic-brand)] underline-offset-2 hover:text-[var(--theme-heading-text)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_40%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)]"
        >
          Lesson Hub
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

      <div
        className={[
          "mt-2",
          centered ? "text-center" : "",
          !centered && hasTrailing ? "lg:flex lg:items-start lg:justify-between lg:gap-6" : "",
          centered && hasTrailing ? "lg:grid lg:grid-cols-[1fr_auto] lg:items-start lg:gap-4 lg:text-left" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className={["min-w-0", !centered && hasTrailing ? "flex-1" : "", centered && hasTrailing ? "text-center lg:text-left" : centered ? "mx-auto max-w-3xl text-center" : ""].filter(Boolean).join(" ")}>
          <h1 className={["nn-lesson-page-title text-balance", centered ? "text-center" : ""].filter(Boolean).join(" ")}>
            {displayLessonTitle}
          </h1>
          <p
            className={[
              "mt-1.5 text-sm font-medium leading-snug text-[var(--theme-heading-text)] sm:text-[0.9375rem]",
              centered ? "mx-auto max-w-2xl" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {lessonTopic}
          </p>
          {assessmentFlowHint ? (
            <p
              className={[
                "mt-2 max-w-prose text-xs leading-relaxed text-[var(--theme-muted-text)] sm:text-sm",
                centered ? "mx-auto" : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {assessmentFlowHint}
            </p>
          ) : null}
          {metaChips ? (
            <div className={["mt-2.5 flex flex-wrap gap-1.5 sm:mt-3", centered ? "justify-center" : ""].filter(Boolean).join(" ")}>
              {metaChips}
            </div>
          ) : null}
          {studyQuickLinks ? (
            <div className={["mt-3 flex flex-wrap gap-2", centered ? "justify-center" : ""].filter(Boolean).join(" ")}>
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
          {heroBelowTitle ? (
            <div className={["mt-4 flex w-full flex-col items-center sm:mt-5", centered ? "" : "max-w-[44rem]"].filter(Boolean).join(" ")}>
              {heroBelowTitle}
            </div>
          ) : null}
        </div>
        {trailing ? (
          <div
            className={[
              "mt-3 flex shrink-0 flex-col gap-2",
              centered ? "items-center justify-center lg:mt-0 lg:items-end lg:justify-self-end lg:pt-0.5" : "lg:mt-0 lg:items-end lg:pt-0.5",
            ].join(" ")}
          >
            {trailing}
          </div>
        ) : null}
      </div>

      <div
        className={[
          "mt-2.5 border-t border-[color-mix(in_srgb,var(--semantic-border-soft)_92%,var(--semantic-brand)_8%)] pt-2",
          centered ? "text-center" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Link
          href={lessonsBasePath}
          className="text-[11px] font-medium text-[var(--theme-muted-text)] underline-offset-2 hover:text-[var(--semantic-brand)] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] sm:text-xs"
        >
          ← All Lessons
        </Link>
      </div>
    </header>
  );
}
