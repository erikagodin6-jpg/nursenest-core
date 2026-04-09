import Link from "next/link";
import { BookOpen, ChevronRight, GraduationCap } from "lucide-react";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";

/**
 * Continue learning strip: last touched lesson, next recommended, pathway completion counts.
 */
export function PathwayLessonsResumeHub({
  pathwayShortName,
  resume,
}: {
  pathwayShortName: string;
  resume: PathwayHubResumePayload;
}) {
  const { lastTouched, nextRecommended, lessonsCompleted, lessonsInProgress } = resume;
  const nextBlock =
    nextRecommended && (!lastTouched || nextRecommended.slug !== lastTouched.slug) ? nextRecommended : null;

  if (!lastTouched && !nextBlock && lessonsCompleted === 0 && lessonsInProgress === 0) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]">
      <div className="nn-spectrum-rule-top" aria-hidden />
      <div className="p-4 sm:p-5 sm:pt-4">
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--semantic-border-soft)] pb-3">
          <GraduationCap className="h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
          <p className="text-xs font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">Continue learning</p>
          <span className="text-[var(--semantic-text-muted)]">·</span>
          <p className="text-xs font-semibold text-[var(--semantic-text-primary)]">{pathwayShortName}</p>
        </div>

        {lastTouched ? (
        <div className="mt-4">
          <div className="flex flex-wrap items-center gap-2">
            <BookOpen className="h-4 w-4 shrink-0 text-[var(--semantic-info)]" aria-hidden />
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Pick up where you left off
            </p>
            {lastTouched.completed ? (
              <span className="rounded-full border border-[var(--semantic-border-soft)] bg-[var(--role-success-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--role-success-text)]">
                Completed
              </span>
            ) : (
              <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-info-soft)] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-info-contrast)]">
                In progress
              </span>
            )}
          </div>
          <Link
            href={lastTouched.href}
            className="mt-2 block text-lg font-semibold text-[var(--semantic-text-primary)] hover:text-[var(--semantic-brand)] hover:underline"
          >
            {lastTouched.title}
          </Link>
          <Link
            href={lastTouched.href}
            className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-[var(--semantic-info)] underline-offset-4 hover:underline"
          >
            Resume lesson
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
        ) : null}

        {nextBlock ? (
        <div className={lastTouched ? "mt-5 border-t border-[var(--semantic-border-soft)] pt-4" : "mt-4"}>
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Next in your pathway
          </p>
          <Link
            href={nextBlock.href}
            className="mt-2 inline-flex items-center gap-1 text-base font-semibold text-[var(--semantic-text-primary)] hover:text-[var(--semantic-brand)] hover:underline"
          >
            {nextBlock.title}
            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden />
          </Link>
        </div>
        ) : null}

        {lessonsCompleted > 0 || lessonsInProgress > 0 ? (
        <div className="mt-5 border-t border-[var(--semantic-border-soft)] pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
            Pathway progress
          </p>
          <div className="mt-2 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-[var(--semantic-text-secondary)]">
            {lessonsCompleted > 0 ? (
              <span>
                <span className="font-semibold tabular-nums text-[var(--semantic-text-primary)]">{lessonsCompleted}</span>{" "}
                completed
              </span>
            ) : null}
            {lessonsInProgress > 0 ? (
              <span>
                <span className="font-semibold tabular-nums text-[var(--semantic-text-primary)]">{lessonsInProgress}</span>{" "}
                in progress
              </span>
            ) : null}
          </div>
        </div>
        ) : null}
      </div>
    </div>
  );
}
