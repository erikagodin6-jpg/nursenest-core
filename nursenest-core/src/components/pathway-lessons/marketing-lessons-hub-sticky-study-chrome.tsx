import type { ReactNode } from "react";

/**
 * Sticky wrapper for the unified lesson-hub top-nav:
 *   Row 1: study-surface quick links (Questions, CAT, Flashcards…)
 *   Row 2: clinical module links (Labs, ECG, OSCE… — compact mode)
 *
 * Both rows are rendered as children so the server-async clinical modules
 * strip can slot in without any client-side state.
 */
export function MarketingLessonsHubStickyStudyChrome({ children }: { children: ReactNode }) {
  return (
    <div
      className="sticky top-16 z-20 -mx-1 mb-3 border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,transparent)] px-1 pb-2 pt-2 backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--semantic-surface)_72%,transparent)] sm:top-20"
      data-testid="lesson-hub-sticky-nav"
    >
      {children}
    </div>
  );
}
