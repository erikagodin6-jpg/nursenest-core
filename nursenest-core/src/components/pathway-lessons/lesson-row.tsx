import Link from "next/link";
import { ChevronRight, Circle, CircleCheckBig, CircleDot } from "lucide-react";
import { DifficultyBadge } from "@/components/pathway-lessons/difficulty-badge";
import type { LessonDifficulty } from "@/components/pathway-lessons/lesson-board-metadata";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

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
};

export function LessonRow({ href, title, progressStatus, durationLabel, difficulty }: Props) {
  return (
    <Link
      href={href}
      className="group flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_24%,transparent)]"
    >
      <StatusIcon status={progressStatus} />
      <span className="min-w-0 flex-1 truncate font-medium text-[var(--theme-heading-text)]">{title}</span>
      <span className="shrink-0 text-xs font-medium text-[var(--theme-muted-text)]">{durationLabel}</span>
      <DifficultyBadge difficulty={difficulty} />
      <ChevronRight
        className="h-4 w-4 shrink-0 text-[var(--semantic-text-muted)] transition-transform group-hover:translate-x-0.5 group-hover:text-[var(--theme-heading-text)]"
        aria-hidden
      />
    </Link>
  );
}
