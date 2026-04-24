"use client";

import type { ReactNode } from "react";

/** Right column card wrapper for linear practice “Rationale & Review”. */
export function PracticeExamRationalePanel({ children }: { children: ReactNode }) {
  return (
    <aside
      className="nn-practice-exam-rationale-panel flex min-h-0 min-w-0 flex-col"
      aria-label="Rationale and review"
    >
      <div className="nn-practice-exam-rationale-panel__card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--nn-review-panel-bg,var(--semantic-surface))] shadow-[var(--semantic-shadow-soft)]">
        {children}
      </div>
    </aside>
  );
}
