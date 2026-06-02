import Link from "next/link";
import type { PathwayHubResumePayload } from "@/lib/learner/pathway-lesson-continuation";

type Props = {
  resume: PathwayHubResumePayload;
};

/**
 * Compact continue strip — secondary to the category grid (H11 hub layout).
 */
export function LessonsHubResumeCompact({ resume }: Props) {
  const last = resume.lastTouched;
  const next = resume.nextRecommended;
  const href = last?.href ?? next?.href;
  const title = last?.title ?? next?.title;
  if (!href || !title) return null;

  const inProgress = Boolean(last && !last.completed);

  return (
    <div
      className="nn-lessons-hub-resume-compact flex flex-wrap items-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3.5 py-2.5 text-xs shadow-[var(--semantic-shadow-soft)] sm:gap-3 sm:px-4"
      data-nn-lessons-hub-resume-compact
    >
      <span
        className="h-2 w-2 shrink-0 rounded-full bg-[var(--semantic-brand)]"
        aria-hidden
      />
      <span className="font-bold uppercase tracking-wide text-[var(--theme-muted-text)]">
        Continue
      </span>
      <Link
        href={href}
        className="min-w-0 truncate font-semibold text-[var(--theme-heading-text)] hover:text-[var(--semantic-brand)]"
      >
        {title}
      </Link>
      {inProgress ? (
        <span className="hidden text-[var(--theme-muted-text)] sm:inline">In progress</span>
      ) : null}
      <span className="flex-1" aria-hidden />
      <Link
        href={href}
        className="inline-flex h-8 shrink-0 items-center justify-center rounded-lg bg-[var(--role-cta)] px-3 text-[11px] font-bold text-[var(--role-cta-foreground)] hover:bg-[var(--role-cta-hover)]"
      >
        Resume
      </Link>
    </div>
  );
}
