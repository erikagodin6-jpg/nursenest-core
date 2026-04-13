import Link from "next/link";
import { ChevronRight, Circle, CircleCheckBig, CircleDot } from "lucide-react";
import { DifficultyBadge } from "@/components/pathway-lessons/difficulty-badge";
import type { LessonDifficulty } from "@/components/pathway-lessons/lesson-board-metadata";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

function StatusIcon({ status }: { status: PathwayLessonProgressStatus }) {
  if (status === "completed") {
    return <CircleCheckBig className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />;
  }
  if (status === "in_progress") {
    return <CircleDot className="h-4 w-4 shrink-0 text-[var(--semantic-brand)]" aria-hidden />;
  }
  return <Circle className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />;
}

type Props = {
  href: string;
  title: string;
  progressStatus: PathwayLessonProgressStatus;
  durationLabel: string;
  difficulty: LessonDifficulty;
  yieldBadgeLabel?: string | null;
};

export function LessonRow({ href, title, progressStatus, durationLabel, difficulty, yieldBadgeLabel }: Props) {
  const displayTitle = cleanLessonTitleForDisplay(title);
  return (
    <Link
      href={href}
      className="group block rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
    >
      <div className="flex items-start gap-3">
        <StatusIcon status={progressStatus} />
        <div className="min-w-0 flex-1">
          <p className="line-clamp-3 text-sm font-medium leading-snug text-[var(--theme-heading-text)] sm:line-clamp-2">
            {displayTitle}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {yieldBadgeLabel ? (
              <span className="rounded-full border border-[var(--semantic-border-soft)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                {yieldBadgeLabel}
              </span>
            ) : null}
            <span className="text-xs font-medium text-[var(--theme-muted-text)]">{durationLabel}</span>
            <DifficultyBadge difficulty={difficulty} />
          </div>
        </div>
        <ChevronRight
          className="mt-1 h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--theme-heading-text)]"
          aria-hidden
        />
      </div>
    </Link>
  );
}
