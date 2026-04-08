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
        className={`inline-flex min-h-[1.5rem] items-center gap-1 rounded-full border border-border bg-role-success-soft px-2 py-0.5 text-[11px] font-semibold text-role-success-text ${className}`}
      >
        <CheckCircle2 className="h-3.5 w-3.5 shrink-0" aria-hidden />
        Completed
      </span>
    );
  }
  if (status === "in_progress") {
    return (
      <span
        className={`inline-flex min-h-[1.5rem] items-center gap-1 rounded-full border border-primary/30 bg-primary/[0.08] px-2 py-0.5 text-[11px] font-semibold text-primary ${className}`}
      >
        <CircleDot className="h-3.5 w-3.5 shrink-0" aria-hidden />
        In progress
      </span>
    );
  }
  return (
    <span
      className={`inline-flex min-h-[1.5rem] items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-muted ${className}`}
    >
      <Circle className="h-3.5 w-3.5 shrink-0" aria-hidden />
      Not started
    </span>
  );
}
