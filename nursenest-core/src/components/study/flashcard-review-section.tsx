/**
 * FlashcardReviewSection
 *
 * Shows flashcard decks with cards due for SM-2 spaced repetition review.
 * Displays per-deck due/overdue counts with ease factor trends and direct
 * "Review" CTAs that navigate to the deck's review mode.
 *
 * Server Component — data pre-loaded, links only.
 */

import Link from "next/link";
import { Layers, TrendingDown, TrendingUp, Clock } from "lucide-react";
import type { UnifiedReviewItem } from "@/lib/study/unified-review-types";
import type { FlashcardDeckReviewData } from "@/lib/study/unified-review-types";

// ── Ease factor indicator ─────────────────────────────────────────────────────

function EaseIndicator({ ef }: { ef: number }) {
  // SM-2 ease factor: 1.3 = struggling, 2.5 = default, 3.5+ = very well-learned
  const isLow = ef < 2.0;
  const isHigh = ef >= 3.0;
  const color = isLow
    ? "var(--semantic-warning, #f59e0b)"
    : isHigh
    ? "var(--semantic-success, #22c55e)"
    : "var(--theme-muted-text, var(--muted-foreground))";
  const Icon = isLow ? TrendingDown : TrendingUp;
  const label = isLow ? "Struggling" : isHigh ? "Well learned" : "Average";

  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-medium"
      style={{ color }}
      title={`Average ease factor: ${ef} (${label})`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </span>
  );
}

// ── Due count chips ───────────────────────────────────────────────────────────

function DueChips({ deck }: { deck: FlashcardDeckReviewData }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {deck.overdueCount > 0 ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
          style={{
            background:
              "color-mix(in srgb, var(--semantic-danger, #ef4444) 12%, var(--bg-card))",
            border:
              "1px solid color-mix(in srgb, var(--semantic-danger, #ef4444) 28%, var(--border-subtle))",
            color: "var(--semantic-danger, #ef4444)",
          }}
        >
          <Clock className="h-2.5 w-2.5" aria-hidden />
          {deck.overdueCount} overdue
        </span>
      ) : null}
      {deck.dueTodayCount > 0 ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold"
          style={{
            background:
              "color-mix(in srgb, var(--semantic-warning, #f59e0b) 12%, var(--bg-card))",
            border:
              "1px solid color-mix(in srgb, var(--semantic-warning, #f59e0b) 28%, var(--border-subtle))",
            color: "var(--semantic-warning, #f59e0b)",
          }}
        >
          {deck.dueTodayCount} due today
        </span>
      ) : null}
      {deck.dueSoonCount > 0 ? (
        <span
          className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          style={{
            background:
              "color-mix(in srgb, var(--semantic-info, #38bdf8) 10%, var(--bg-card))",
            border:
              "1px solid color-mix(in srgb, var(--semantic-info, #38bdf8) 22%, var(--border-subtle))",
            color: "var(--semantic-info, #38bdf8)",
          }}
        >
          {deck.dueSoonCount} this week
        </span>
      ) : null}
    </div>
  );
}

// ── Single deck row ───────────────────────────────────────────────────────────

function DeckRow({ item }: { item: UnifiedReviewItem }) {
  const deck = item.flashcardData;
  if (!deck) return null;

  const urgencyBorderColor =
    deck.overdueCount > 0
      ? "var(--semantic-danger, #ef4444)"
      : deck.dueTodayCount > 0
      ? "var(--semantic-warning, #f59e0b)"
      : "var(--semantic-info, #38bdf8)";

  return (
    <li
      className="flex flex-col gap-3 overflow-hidden rounded-xl px-4 py-3.5 sm:flex-row sm:items-center sm:gap-4"
      style={{
        background: "var(--bg-card, var(--theme-card-bg))",
        border: "1px solid var(--border-subtle, var(--theme-border))",
        borderLeft: `3px solid ${urgencyBorderColor}`,
      }}
    >
      {/* Left: deck info */}
      <div className="min-w-0 flex-1">
        <p
          className="text-sm font-bold leading-snug"
          style={{ color: "var(--theme-heading-text, var(--foreground))" }}
        >
          {deck.deckName}
        </p>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <DueChips deck={deck} />
        </div>
        <div className="mt-1.5 flex items-center gap-3">
          <EaseIndicator ef={deck.avgEaseFactor} />
          <span
            className="text-[10px]"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            {deck.progressedCount} card{deck.progressedCount !== 1 ? "s" : ""} studied
          </span>
        </div>
      </div>

      {/* Right: review CTA */}
      <Link
        href={deck.reviewHref}
        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-all hover:opacity-85 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2"
        style={{
          background:
            deck.overdueCount > 0
              ? "var(--semantic-danger, #ef4444)"
              : "var(--theme-primary)",
          color: "var(--theme-primary-foreground, #fff)",
        }}
      >
        <Layers className="h-3.5 w-3.5" aria-hidden />
        Review cards
      </Link>
    </li>
  );
}

// ── FlashcardReviewSection ────────────────────────────────────────────────────

export function FlashcardReviewSection({ items }: { items: UnifiedReviewItem[] }) {
  const flashcardItems = items.filter((i) => i.kind === "flashcard");
  if (flashcardItems.length === 0) return null;

  const totalOverdue = flashcardItems.reduce(
    (sum, i) => sum + (i.flashcardData?.overdueCount ?? 0),
    0,
  );

  return (
    <section
      className="overflow-hidden rounded-2xl"
      aria-labelledby="flashcard-review-heading"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 5%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 20%, var(--border-subtle, var(--theme-border)))",
      }}
    >
      {/* Section header */}
      <div className="flex items-start gap-3 px-5 py-4 sm:px-6">
        <Layers
          className="mt-0.5 h-5 w-5 flex-shrink-0"
          aria-hidden="true"
          style={{ color: "var(--semantic-chart-3, #a78bfa)" }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            <h2
              id="flashcard-review-heading"
              className="text-sm font-bold sm:text-base"
              style={{ color: "var(--theme-heading-text, var(--foreground))" }}
            >
              Flashcard Decks Due
            </h2>
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold"
              style={{
                background:
                  "color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 15%, var(--bg-card))",
                border:
                  "1px solid color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 30%, var(--border-subtle))",
                color: "var(--semantic-chart-3, #a78bfa)",
              }}
            >
              {flashcardItems.length} deck{flashcardItems.length !== 1 ? "s" : ""}
            </span>
          </div>
          <p
            className="mt-0.5 text-xs leading-snug"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            {totalOverdue > 0
              ? `${totalOverdue} card${totalOverdue !== 1 ? "s" : ""} past their scheduled review — review now to stay on track.`
              : "Cards due today or this week based on your SM-2 schedule."}
          </p>
        </div>
      </div>

      {/* Deck rows */}
      <div
        className="border-t px-4 pb-4 pt-3 sm:px-5"
        style={{
          borderColor:
            "color-mix(in srgb, var(--semantic-chart-3, #a78bfa) 15%, var(--border-subtle))",
        }}
      >
        <ul className="space-y-2.5">
          {flashcardItems.map((item) => (
            <DeckRow key={item.id} item={item} />
          ))}
        </ul>

        {/* Link to all flashcards */}
        <div className="mt-4 flex justify-end">
          <Link
            href="/app/flashcards"
            className="text-xs font-medium hover:underline focus-visible:outline-none"
            style={{ color: "var(--semantic-chart-3, #a78bfa)" }}
          >
            Browse all decks →
          </Link>
        </div>
      </div>
    </section>
  );
}
