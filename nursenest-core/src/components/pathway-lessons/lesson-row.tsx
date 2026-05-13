import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DifficultyBadge } from "@/components/pathway-lessons/difficulty-badge";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import type { LessonDifficulty } from "@/components/pathway-lessons/lesson-board-metadata";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

type Props = {
  href: string;
  title: string;
  progressStatus: PathwayLessonProgressStatus;
  showProgress?: boolean;
  durationLabel: string;
  difficulty: LessonDifficulty;
  yieldBadgeLabel?: string | null;
};

export function LessonRow({ href, title, progressStatus, showProgress = false, durationLabel, difficulty, yieldBadgeLabel }: Props) {
  const cleaned = cleanLessonTitleForDisplay(title);
  const displayTitle = cleaned.trim().length > 0 ? cleaned : title.trim() || "Lesson";
  return (
    <Link
      href={href}
      data-testid="lesson-card-link"
      className="nn-qa-pathway-lesson-card group flex min-h-[44px] items-center gap-2 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)] sm:min-h-0"
    >
      {/* Progress badge (subscribers) */}
      {showProgress ? (
        <PathwayLessonProgressBadge
          status={progressStatus}
          className="shrink-0"
          data-testid="lesson-row-progress-badge"
        />
      ) : null}

      {/* Title — single line with truncation */}
      <p
        data-testid="lesson-card-title"
        className="min-w-0 flex-1 truncate text-sm font-medium leading-snug text-[var(--theme-body-text)]"
      >
        {displayTitle}
      </p>

      {/* Metadata: yield · duration · difficulty — right-aligned, compact */}
      <span className="ml-auto flex shrink-0 items-center gap-1.5 pl-2" aria-hidden>
        {yieldBadgeLabel ? (
          <span className="hidden rounded-full border border-[var(--semantic-border-soft)] px-1.5 py-px text-[9px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)] sm:inline">
            {yieldBadgeLabel}
          </span>
        ) : null}
        <span className="hidden text-[11px] text-[var(--theme-muted-text)] sm:inline">
          {durationLabel}
        </span>
        <DifficultyBadge difficulty={difficulty} />
        <ChevronRight
          className="h-3 w-3 shrink-0 text-[var(--semantic-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--theme-heading-text)]"
        />
      </span>
    </Link>
  );
}
