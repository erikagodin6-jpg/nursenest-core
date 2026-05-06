import React, { type CSSProperties } from "react";
import Link from "next/link";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";
import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import {
  lessonDifficultyLabel,
  lessonEstimatedDurationLabel,
} from "@/components/pathway-lessons/lesson-board-metadata";
import { LessonRow } from "@/components/pathway-lessons/lesson-row";
import { pathwayLessonYieldLabel } from "@/lib/lessons/pathway-lesson-yield";
import type {
  PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { pathwayLessonMarketingHubVerifiedCardHref } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

/** Hub preview: keep sections scannable; full library via “View all”. Exported for hub diagnostics (`RN_LESSONS_HUB_ACTUAL_COUNTS`). */
export const LESSON_SYSTEM_HUB_CARD_PREVIEW_MAX = 10;
const LESSON_SYSTEM_PREVIEW = LESSON_SYSTEM_HUB_CARD_PREVIEW_MAX;

type Props = {
  section: PathwayLessonSystemSection;
  lessonsBasePath: string;
  progressMap: Record<string, PathwayLessonProgressStatus>;
  showProgress: boolean;
};

export function LessonSystemCard({
  section,
  lessonsBasePath,
  progressMap,
  showProgress,
}: Props) {
  const visual = getLessonHubSystemVisual(section.systemLabel);
  const Icon = visual.icon;
  const systemStyle = { "--nn-system-accent": `var(${visual.accentVar})` } as CSSProperties;
  /** Rows that actually render a link — counts and progress must match visible cards, not raw section length. */
  const linkableLessons = section.lessons.filter(
    (lesson) => pathwayLessonMarketingHubVerifiedCardHref(lessonsBasePath, lesson) != null,
  );
  const displayCount = linkableLessons.length;
  const { completedCount, inProgressCount, percentComplete } = showProgress
    ? buildLessonCategoryProgress({ lessons: linkableLessons, progressMap })
    : { completedCount: 0, inProgressCount: 0, percentComplete: 0 };
  const previewLessons = linkableLessons.slice(0, LESSON_SYSTEM_PREVIEW);
  const hiddenLessonCount = Math.max(0, linkableLessons.length - previewLessons.length);

  return (
    <section
      id={section.id}
      style={systemStyle}
      className="nn-qa-pathway-lessons-group nn-lesson-system-card rounded-[1.35rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-3.5 sm:p-4"
      aria-labelledby={`lesson-system-card-${section.id}`}
    >
      <div className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <h2
              id={`lesson-system-card-${section.id}`}
              className="line-clamp-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]"
            >
              {section.label}
            </h2>
            <span className="shrink-0 text-right text-xs font-semibold text-[var(--theme-muted-text)]">
              {showProgress ? (
                <>
                  <span className="hidden sm:inline">
                    {percentComplete}% complete ·{" "}
                  </span>
                  {completedCount} of {displayCount} lessons
                </>
              ) : (
                <>
                  {displayCount} lesson{displayCount === 1 ? "" : "s"}
                </>
              )}
            </span>
          </div>
          {showProgress ? (
            <CategoryProgressBar
              completedCount={completedCount}
              inProgressCount={inProgressCount}
              totalCount={Math.max(displayCount, 1)}
            />
          ) : null}
        </div>
      </div>

      <div className="mt-3.5 min-h-[4.5rem] space-y-1">
        {previewLessons.map((lesson) => {
          const href = pathwayLessonMarketingHubVerifiedCardHref(lessonsBasePath, lesson);
          if (!href) return null;

          return (
            <LessonRow
              key={lesson.slug}
              href={href}
              title={lesson.title}
              progressStatus={showProgress ? (progressMap[lesson.slug] ?? "not_started") : "not_started"}
              showProgress={showProgress}
              yieldBadgeLabel={pathwayLessonYieldLabel(lesson.activeExamMeta?.yieldLevel)}
              durationLabel={lessonEstimatedDurationLabel(lesson)}
              difficulty={lessonDifficultyLabel(lesson)}
            />
          );
        })}
        {hiddenLessonCount > 0 ? (
          <div className="pt-1">
            <Link
              href={`${lessonsBasePath}#pathway-lesson-library`}
              className="inline-flex text-xs font-semibold text-primary underline-offset-2 hover:underline"
            >
              View all {displayCount} lessons in library
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
