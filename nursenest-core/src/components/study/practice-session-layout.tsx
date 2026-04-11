import type { ReactNode } from "react";

/**
 * PracticeSessionLayout — outer viewport-height container for the practice session.
 *
 * On desktop (≥1024px): takes up `calc(100dvh - 120px)`, preventing the main
 * page from scrolling. Inner columns scroll independently via overflow-y: auto.
 *
 * On mobile: normal flow; vertical scrolling allowed as per spec §11.
 */
export function PracticeSessionLayout({ children }: { children: ReactNode }) {
  return <div className="nn-practice-session">{children}</div>;
}

/**
 * PracticeTopBar — compact header above the content grid (spec §3).
 *
 * Shows "Question X of Y" on the left, an optional right label, and a
 * 6px progress bar underneath.
 */
export function PracticeTopBar({
  current,
  total,
  rightLabel,
  progressPct,
  saving,
}: {
  current: number;
  total: number;
  rightLabel?: string | null;
  progressPct: number;
  saving?: boolean;
}) {
  return (
    <div className="nn-practice-top-bar">
      <div className="nn-practice-top-bar__row">
        <p className="nn-practice-top-bar__left">
          Question{" "}
          <span className="tabular-nums">{current}</span>
          {" of "}
          <span className="tabular-nums">{total}</span>
          {saving ? (
            <span className="ml-2 text-xs font-normal text-[var(--semantic-text-muted)]">
              · Saving…
            </span>
          ) : null}
        </p>
        {rightLabel ? (
          <p className="nn-practice-top-bar__right">{rightLabel}</p>
        ) : null}
      </div>
      <div
        className="nn-practice-top-bar__progress"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progressPct)}
        aria-label={`Question ${current} of ${total}`}
      >
        <div
          className="nn-practice-top-bar__progress-fill"
          style={{ width: `${progressPct}%` }}
        />
      </div>
    </div>
  );
}

/**
 * PracticeSessionGrid — 60/40 content grid.
 *
 * Accepts exactly two children: left (question) and right (rationale).
 * On desktop, both scroll independently within the fixed-height layout.
 */
export function PracticeSessionGrid({ children }: { children: ReactNode }) {
  return <div className="nn-practice-session-grid">{children}</div>;
}
