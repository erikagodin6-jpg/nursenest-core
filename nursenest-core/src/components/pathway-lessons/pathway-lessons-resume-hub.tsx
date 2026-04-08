import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";

export function PathwayLessonsResumeHub({
  pathwayShortName,
  resume,
}: {
  pathwayShortName: string;
  resume: PathwayHubResumePayload;
}) {
  const { lastTouched, nextRecommended, lessonsCompleted } = resume;
  const nextBlock =
    nextRecommended && (!lastTouched || nextRecommended.slug !== lastTouched.slug) ? nextRecommended : null;

  if (!lastTouched && !nextBlock && lessonsCompleted === 0) return null;

  return (
    <div className="nn-card space-y-4 border-primary/25 bg-primary/[0.04] p-4 sm:p-5">
      {lastTouched ? (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">Continue your last lesson</p>
          <Link
            href={lastTouched.href}
            className="mt-1 block text-lg font-semibold text-primary hover:underline"
          >
            {lastTouched.title}
          </Link>
          <Link
            href={lastTouched.href}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-foreground underline-offset-4 hover:underline"
          >
            Resume studying
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      ) : null}

      {nextBlock ? (
        <div className={lastTouched ? "border-t border-border/50 pt-4" : ""}>
          <p className="text-xs font-semibold uppercase text-muted">Next recommended lesson</p>
          <Link
            href={nextBlock.href}
            className="mt-1 inline-flex items-center gap-1 text-base font-semibold text-primary hover:underline"
          >
            {nextBlock.title}
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
      ) : null}

      {lessonsCompleted > 0 ? (
        <p className="text-sm text-muted">
          <span className="font-medium text-foreground">{lessonsCompleted}</span> lesson
          {lessonsCompleted === 1 ? "" : "s"} completed in {pathwayShortName}
        </p>
      ) : null}
    </div>
  );
}
