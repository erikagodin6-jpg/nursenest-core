import type { ReactNode } from "react";

/**
 * Sticky wrapper for pathway study shortcuts (questions, CAT, flashcards, etc.) on public lesson hubs.
 */
export function MarketingLessonsHubStickyStudyChrome({ children }: { children: ReactNode }) {
  return (
    <div className="sticky top-16 z-20 -mx-1 mb-4 border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_88%,transparent)] px-1 py-2 backdrop-blur-md supports-[backdrop-filter]:bg-[color-mix(in_srgb,var(--semantic-surface)_72%,transparent)] sm:top-20">
      {children}
    </div>
  );
}
