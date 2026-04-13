import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PathwayLessonProgressBadge } from "@/components/lessons/pathway-lesson-progress-badge";
import { StatusBadge } from "@/components/ui/study-card";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";

export function LessonBubble({
  href,
  title,
  progressStatus,
  showProgress,
  showLockedState,
}: {
  href: string;
  title: string;
  progressStatus: PathwayLessonProgressStatus;
  showProgress: boolean;
  showLockedState: boolean;
}) {
  const displayTitle = cleanLessonTitleForDisplay(title);
  return (
    <Link
      href={href}
      className="group flex min-h-[5.25rem] h-full flex-col justify-between rounded-[1.45rem] border border-[color-mix(in_srgb,var(--nn-system-accent)_16%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--nn-system-accent)_3%,var(--semantic-surface))] px-4 py-3.5 shadow-[0_8px_24px_color-mix(in_srgb,var(--nn-system-accent)_7%,transparent)] transition duration-200 hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--nn-system-accent)_28%,var(--semantic-border-soft))] hover:bg-[color-mix(in_srgb,var(--nn-system-accent)_5%,var(--semantic-surface))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--nn-system-accent)_26%,transparent)]"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold leading-6 text-[var(--theme-heading-text)]">{displayTitle}</p>
        <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-text-tertiary)] transition group-hover:text-[var(--nn-system-accent)]" aria-hidden />
      </div>
      <div className="mt-3 flex items-center justify-start">
        {showLockedState ? <StatusBadge status="locked" size="xs" /> : null}
        {!showLockedState && showProgress ? <PathwayLessonProgressBadge status={progressStatus} /> : null}
      </div>
    </Link>
  );
}
