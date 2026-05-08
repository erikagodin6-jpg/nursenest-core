"use client";

import type { ReactNode } from "react";

/** Right column card wrapper for linear practice “Rationale & Review”. */
export function PracticeExamRationalePanel({
  children,
  ariaLabel = "Rationale and review",
}: {
  children: ReactNode;
  /** Localized accessible name for the rationale column. */
  ariaLabel?: string;
}) {
  return (
    <aside
      data-nn-qa-practice-rationale-column
      className="nn-practice-exam-rationale-panel nn-premium-practice-exam-rationale flex min-h-0 min-w-0 flex-col"
      aria-label={ariaLabel}
    >
      <div className="nn-practice-exam-rationale-panel__card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--nn-review-panel-bg,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]">
        {children}
      </div>
    </aside>
  );
}
