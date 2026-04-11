"use client";

import { FlashcardDeckCard, type DeckCardRow } from "@/components/study/flashcard-deck-card";

type FlashcardDeckGridProps = {
  decks: DeckCardRow[];
  loading?: boolean;
  emptyMessage?: string;
  /** Due summary per deckId — merged in from the due-summary API. */
  dueByDeckId?: Record<string, { due: number; overdue: number }>;
};

/**
 * FlashcardDeckGrid — Responsive, palette-varied grid of deck cards.
 *
 * Layout:
 *   - Mobile: 1 column
 *   - Tablet+: 2 columns
 *   - Desktop: 2-3 columns depending on available width
 *
 * Each card gets its own surface accent based on source type, preventing
 * the monochromatic "wall of identical cards" anti-pattern.
 */
export function FlashcardDeckGrid({
  decks,
  loading = false,
  emptyMessage = "No decks found. Try adjusting your filters.",
  dueByDeckId = {},
}: FlashcardDeckGridProps) {
  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <DeckSkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (decks.length === 0) {
    return (
      <div
        className="rounded-2xl border p-10 text-center text-sm"
        style={{
          background:
            "color-mix(in srgb, var(--surface-soft-a, var(--theme-card-bg)) 60%, transparent)",
          borderColor: "var(--border-subtle, var(--theme-card-border))",
          color: "var(--theme-muted-text)",
        }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2" role="list">
      {decks.map((deck) => {
        const due = dueByDeckId[deck.id];
        return (
          <li key={deck.id}>
            <FlashcardDeckCard
              deck={{
                ...deck,
                due: due?.due ?? 0,
                overdue: due?.overdue ?? 0,
              }}
            />
          </li>
        );
      })}
    </ul>
  );
}

function DeckSkeletonCard() {
  return (
    <div
      className="h-52 animate-pulse rounded-2xl"
      style={{
        background:
          "color-mix(in srgb, var(--surface-soft-a, var(--theme-card-bg)) 60%, transparent)",
        border: "1px solid var(--border-subtle, var(--theme-card-border))",
      }}
    />
  );
}
