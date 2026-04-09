import { CheckCircle2, CircleDot, Circle } from "lucide-react";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";

export function PathwayLessonProgressBadge({
  status,
  className = "",
}: {
  status: PathwayLessonProgressStatus;
  className?: string;
}) {
  if (status === "completed") {
    return (
      <span
        className={`inline-flex min-h-[1.5rem] items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--role-success)_35%,var(--semantic-border-soft))] bg-[var(--role-success-soft)] px-2 py-0.5 text-[11px] font-semibold text-[var(--role-success-text)] ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Completed
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span
        className={`inline-flex min-h-[1.5rem] items-center gap-1 rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] px-2 py-0.5 text-[11px] font-semibold text-[var(--semantic-text-primary)] ${className}`}
      >
        <CircleDot className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-brand)]" aria-hidden />
        In progress
      </span>
    );
  }
  return (
    <span
      className={`inline-flex min-h-[1.5rem] items-center gap-1 rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2 py-0.5 text-[11px] font-medium text-[var(--semantic-text-muted)] ${className}`}
    >
      <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Not started
    </span>
  );
}
