"use client";

import type { ReactNode } from "react";

/**
 * Practice exam progress row: localized question summary + percent + semantic progress fill.
 * Parent supplies translated `progressLead` and `sessionProgressAriaLabel` via `tx()`.
 */
export function PracticeExamProgressHeader({
  questionIndexOneBased,
  total,
  toolbar,
  progressLead,
  sessionProgressAriaLabel,
  sessionBadge,
}: {
  questionIndexOneBased: number;
  total: number;
  /** Theme toggle, timer, end session, etc. */
  toolbar?: ReactNode;
  /** Localized primary line (e.g. “Question 3 of 40”). */
  progressLead: ReactNode;
  /** Localized aria-label for the session progress meter. */
  sessionProgressAriaLabel: string;
  /** Optional mode chip (e.g. tutor vs timed) — keeps practice visually distinct from CAT exam shells. */
  sessionBadge?: ReactNode;
}) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.max(0, (questionIndexOneBased / safeTotal) * 100));

  return (
    <div className="nn-practice-exam-progress nn-practice-exam-progress-premium shrink-0 border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2 sm:px-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0 space-y-1">
          <p className="m-0 text-sm font-semibold tabular-nums text-[var(--semantic-text-primary)] sm:text-base">
            {progressLead}
          </p>
          {sessionBadge ? (
            <div className="flex flex-wrap items-center gap-2">{sessionBadge}</div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2">
          <span
            className="text-sm font-semibold tabular-nums text-[var(--semantic-text-secondary)] sm:text-base"
            aria-hidden={false}
          >
            {Math.round(pct)}%
          </span>
          {toolbar}
        </div>
      </div>
      <div
        className="nn-practice-exam-progress__track nn-progress-track-semantic nn-progress-track-semantic--md mt-2 w-full"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={sessionProgressAriaLabel}
      >
        <div
          className="nn-practice-exam-progress__fill nn-progress-fill-semantic-brand h-full rounded-full motion-reduce:transition-none transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
