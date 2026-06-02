import type { ReactNode } from "react";

/**
 * Contained nav block for the unified lesson-hub study links:
 *   Row 1: study-surface quick links (Questions, CAT, Flashcards…)
 *   Row 2: clinical module links (Labs, ECG, OSCE… — compact mode)
 *
 * Non-sticky so it never overlaps headings or content below it.
 */
export function MarketingLessonsHubStickyStudyChrome({ children }: { children: ReactNode }) {
  return (
    <div
      className="mb-6 rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_60%,var(--semantic-surface))] px-3 py-3"
      data-testid="lesson-hub-sticky-nav"
    >
      {children}
    </div>
  );
}
