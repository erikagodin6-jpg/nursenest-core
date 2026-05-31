import React, { type CSSProperties } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { getLessonHubSystemVisual } from "@/components/pathway-lessons/lesson-system-hub-visuals";
import { CategoryProgressBar } from "@/components/pathway-lessons/category-progress-bar";
import { buildLessonCategoryProgress } from "@/lib/lessons/build-lesson-category-progress";
import {
  lessonDifficultyLabel,
  lessonEstimatedDurationLabel,
} from "@/components/pathway-lessons/lesson-board-metadata";
import { LessonRow } from "@/components/pathway-lessons/lesson-row";
import { marketingLessonsTopicClusterPath } from "@/lib/lessons/lesson-routes";
import { primaryLessonSystemTopicSlug } from "@/lib/lessons/lesson-system-navigation";
import { pathwayLessonYieldLabel } from "@/lib/lessons/pathway-lesson-yield";
import type {
  PathwayLessonSystemSection,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { pathwayLessonMarketingHubVerifiedCardHref } from "@/lib/lessons/pathway-lesson-types";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

/** Hub preview: keep sections scannable; full library via "View all". Exported for hub diagnostics (`RN_LESSONS_HUB_ACTUAL_COUNTS`). */
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
  const systemTopicSlug =
    linkableLessons.find((lesson) => lesson.topicSlug?.trim())?.topicSlug?.trim() ??
    primaryLessonSystemTopicSlug(section.systemLabel);
  const systemHref = systemTopicSlug ? marketingLessonsTopicClusterPath(lessonsBasePath, systemTopicSlug) : lessonsBasePath;

  return (
    <section
      id={section.id}
      style={systemStyle}
      className="nn-qa-pathway-lessons-group nn-lesson-system-card rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)]"
      aria-labelledby={`lesson-system-card-${section.id}`}
    >
      {/* Accent stripe across the top — 3px, inner radius matches card (xl=12px minus 1px border). */}
      <div className="h-[3px] w-full rounded-t-[11px] bg-[var(--nn-system-accent)] opacity-60" aria-hidden />

      <div className="px-3 pb-3 pt-2.5 sm:px-3.5 sm:pb-3.5">
        {/* Section header: icon + label + count */}
        <Link
          href={systemHref}
          className="flex items-center gap-2 border-b border-[var(--semantic-border-soft)] pb-2 rounded-lg -m-1 p-1 transition-colors hover:bg-[color-mix(in_srgb,var(--nn-system-accent)_7%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--nn-system-accent)_28%,transparent)]"
          aria-label={`Open ${section.label} lessons`}
          data-testid={`lesson-system-link-${section.systemLabel}`}
        >
          <span
            className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--nn-system-accent)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_9%,var(--semantic-panel-muted))] text-[var(--nn-system-accent)]"
            aria-hidden
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <h2
            id={`lesson-system-card-${section.id}`}
            className="min-w-0 flex-1 truncate text-sm font-semibold leading-snug text-[var(--theme-heading-text)]"
          >
            {section.label}
          </h2>
          <span className="shrink-0 text-[11px] font-semibold text-[var(--theme-muted-text)]">
            {showProgress ? (
              <>
                <span className="hidden sm:inline">{percentComplete}% · </span>
                <span aria-hidden>{completedCount}/{displayCount}</span>
                <span className="sr-only">{`${completedCount} of ${displayCount} lessons completed`}</span>
              </>
            ) : (
              <>{displayCount}</>
            )}
          </span>
        </Link>

        {/* Progress bar (subscribers only) */}
        {showProgress ? (
          <div className="mt-1.5">
            <CategoryProgressBar
              completedCount={completedCount}
              inProgressCount={inProgressCount}
              totalCount={Math.max(displayCount, 1)}
            />
          </div>
        ) : null}

        {/* Lesson rows with dividers */}
        <div className="mt-1 divide-y divide-[var(--semantic-border-soft)]">
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
        </div>

        {/* View-all link when preview is truncated */}
        {hiddenLessonCount > 0 ? (
          <div className="mt-2 flex items-center justify-between border-t border-[var(--semantic-border-soft)] pt-2">
            <Link
              href={`${lessonsBasePath}#pathway-lesson-library`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--semantic-brand)] underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
            >
              <span>+{hiddenLessonCount} more</span>
              <ChevronRight className="h-3 w-3" aria-hidden />
            </Link>
            <span className="text-[10px] text-[var(--theme-muted-text)]">
              {displayCount} total
            </span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
