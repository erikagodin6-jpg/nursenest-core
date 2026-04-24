"use client";

import type { ReactNode } from "react";

/**
 * Practice exam progress row: "Question X of Y" + percent + thin primary fill bar.
 * Matches learner practice exam reference layout; uses theme primary (not hardcoded blues).
 */
export function PracticeExamProgressHeader({
  questionIndexOneBased,
  total,
  toolbar,
}: {
  questionIndexOneBased: number;
  total: number;
  /** Theme toggle, timer, end session, etc. */
  toolbar?: ReactNode;
}) {
  const safeTotal = Math.max(total, 1);
  const pct = Math.min(100, Math.max(0, (questionIndexOneBased / safeTotal) * 100));

  return (
    <div className="nn-practice-exam-progress shrink-0 border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-2.5 sm:px-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <p className="m-0 text-sm font-semibold tabular-nums text-[var(--semantic-text-primary)] sm:text-base">
          Question <span className="tabular-nums">{questionIndexOneBased}</span> of{" "}
          <span className="tabular-nums">{safeTotal}</span>
        </p>
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
        className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-panel-muted))]"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pct)}
        aria-label={`Question ${questionIndexOneBased} of ${safeTotal}, ${Math.round(pct)} percent through this session`}
      >
        <div
          className="h-full rounded-full bg-[var(--semantic-brand)] motion-reduce:transition-none transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
