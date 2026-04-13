import type { ReactNode } from "react";

/**
 * CatSessionLayout — outer container for the CAT exam session.
 * Max-width 1200px, centered, 24px horizontal padding.
 */
export function CatSessionLayout({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`nn-cat-session ${className ?? ""}`.trim()}>{children}</div>;
}

/**
 * CatTopBar — slim top bar (≤64px) with question counter, completion %, and 6px progress bar.
 * Only the progress fill uses a color token (theme-primary). Everything else is neutral.
 */
export function CatTopBar({
  examName,
  current,
  total,
  saving,
  timerSlot,
  labels,
}: {
  examName?: string | null;
  current: number;
  total: number;
  saving?: boolean;
  timerSlot?: ReactNode;
  labels?: {
    question?: string;
    of?: string;
    complete?: string;
    saving?: string;
    progressAria?: string;
  };
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, Math.round((current / total) * 100))) : 0;
  const questionLabel = labels?.question ?? "Question";
  const ofLabel = labels?.of ?? "of";
  const completeLabel = labels?.complete ?? "complete";
  const savingLabel = labels?.saving ?? "Saving...";
  const progressAria =
    labels?.progressAria ?? `${examName ?? "Exam"} progress: question ${current} of ${total}`;

  return (
    <div className="nn-cat-top-bar">
      <div className="nn-cat-top-bar__row">
        <div className="min-w-0">
          {examName ? <p className="nn-cat-top-bar__exam-name">{examName}</p> : null}
          <p className="nn-cat-top-bar__counter">
            {questionLabel} <span className="tabular-nums">{current}</span>{" "}
            <span className="nn-cat-top-bar__meta">
              {ofLabel} <span className="tabular-nums">{total}</span>
              {saving ? (
                <span className="ml-2 font-normal text-[var(--semantic-text-muted)]">
                  · {savingLabel}
                </span>
              ) : null}
            </span>
          </p>
        </div>
        <div className="nn-cat-top-bar__right">
          {timerSlot}
          <p className="nn-cat-top-bar__pct">
            <span className="tabular-nums">{pct}%</span> {completeLabel}
          </p>
        </div>
      </div>
      <div
        className="nn-cat-top-bar__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={progressAria}
      >
        <div className="nn-cat-top-bar__progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

/**
 * CatContentGrid — the 65/35 two-column grid.
 * Used in CAT STUDY mode (catFeedbackStudy=true): question left, rationale right.
 * Stacks vertically on mobile, side-by-side at ≥1024px.
 */
export function CatContentGrid({ children }: { children: ReactNode }) {
  return <div className="nn-cat-grid">{children}</div>;
}

/**
 * CatExamCol — single-column centered wrapper for CAT EXAM mode.
 *
 * Used when `isExamStyle = catMode && !catFeedbackStudy`.
 * The question card takes up the full centered width (max 780px).
 * No right-side rationale panel — matches real NCLEX exam experience.
 *
 * Spec §1: "CAT exam mode = minimal, exam-like, single-column"
 */
export function CatExamCol({ children }: { children: ReactNode }) {
  return <div className="nn-cat-exam-col">{children}</div>;
}
