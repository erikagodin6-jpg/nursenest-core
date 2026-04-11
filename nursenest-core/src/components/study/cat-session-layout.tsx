import type { ReactNode } from "react";

/**
 * CatSessionLayout — outer container for the CAT exam session.
 * Max-width 1200px, centered, 24px horizontal padding.
 */
export function CatSessionLayout({ children }: { children: ReactNode }) {
  return <div className="nn-cat-session">{children}</div>;
}

/**
 * CatTopBar — slim top bar (≤64px) with question counter, completion %, and 6px progress bar.
 * Only the progress fill uses a color token (theme-primary). Everything else is neutral.
 */
export function CatTopBar({
  current,
  total,
  saving,
  timerSlot,
}: {
  current: number;
  total: number;
  saving?: boolean;
  timerSlot?: ReactNode;
}) {
  const pct = total > 0 ? Math.min(100, Math.max(0, Math.round((current / total) * 100))) : 0;

  return (
    <div className="nn-cat-top-bar">
      <div className="nn-cat-top-bar__row">
        <div className="min-w-0">
          <p className="nn-cat-top-bar__counter">
            Question <span className="tabular-nums">{current}</span>{" "}
            <span className="nn-cat-top-bar__meta">
              of <span className="tabular-nums">{total}</span>
              {saving ? (
                <span className="ml-2 font-normal text-[var(--semantic-text-muted)]">
                  · Saving…
                </span>
              ) : null}
            </span>
          </p>
        </div>
        <div className="nn-cat-top-bar__right">
          {timerSlot}
          <p className="nn-cat-top-bar__pct">
            <span className="tabular-nums">{pct}%</span> complete
          </p>
        </div>
      </div>
      <div
        className="nn-cat-top-bar__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Exam progress: question ${current} of ${total}`}
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
