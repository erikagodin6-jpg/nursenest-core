"use client";

import { useCallback, useEffect, useState } from "react";

// ── Shared card type ──────────────────────────────────────────────────────────

export type ViewerCard = {
  id: string;
  front: string;
  back: string;
  topic?: string | null;
  subtopic?: string | null;
  explanation?: string;
  /** Used only for rationale-derived cards to show a hint on the front. */
  hint?: string;
};

// ── Session info from the study API ──────────────────────────────────────────

export type ViewerSession = {
  cursor: number;
  queueLength: number;
  done: boolean;
  batchSize?: number;
};

// ── Rating type mirroring the review API ─────────────────────────────────────

export type CardRating = "again" | "hard" | "good" | "easy";

const RATING_CONFIG: {
  value: CardRating;
  label: string;
  accentVar: string;
  key: string;
}[] = [
  { value: "again", label: "Again", accentVar: "var(--semantic-danger, #ef4444)", key: "1" },
  { value: "hard", label: "Hard", accentVar: "var(--semantic-warning, #f59e0b)", key: "2" },
  { value: "good", label: "Good", accentVar: "var(--semantic-success, #22c55e)", key: "3" },
  { value: "easy", label: "Easy", accentVar: "var(--semantic-brand, var(--theme-primary))", key: "4" },
];

// ── FlashcardFront ────────────────────────────────────────────────────────────

type FlashcardFrontProps = {
  card: ViewerCard;
  onReveal: () => void;
};

export function FlashcardFront({ card, onReveal }: FlashcardFrontProps) {
  return (
    <div
      className="flex min-h-[260px] flex-col justify-between rounded-2xl px-7 py-8"
      style={{
        background:
          "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 8%, var(--bg-card, var(--theme-card-bg)))",
        border: "1px solid var(--border-subtle, var(--theme-card-border))",
        boxShadow:
          "0 2px 16px -4px rgba(0,0,0,0.07), 0 1px 4px -1px rgba(0,0,0,0.05)",
      }}
      role="region"
      aria-label="Flashcard front"
    >
      {/* Topic label */}
      <div className="flex items-center justify-between">
        {card.topic ? (
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
            style={{
              background:
                "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 16%, transparent)",
              color: "var(--theme-muted-text)",
            }}
          >
            {card.topic}
          </span>
        ) : (
          <span />
        )}
        {card.subtopic ? (
          <span
            className="text-[10px] font-medium uppercase tracking-wide"
            style={{ color: "var(--theme-muted-text)" }}
          >
            {card.subtopic}
          </span>
        ) : null}
      </div>

      {/* Prompt */}
      <div className="flex flex-1 items-center py-6">
        <p
          className="text-lg font-semibold leading-relaxed"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {card.front}
        </p>
      </div>

      {/* Hint (optional) */}
      {card.hint ? (
        <p
          className="mb-4 text-xs"
          style={{ color: "var(--theme-muted-text)" }}
        >
          {card.hint}
        </p>
      ) : null}

      {/* Reveal button */}
      <button
        type="button"
        onClick={onReveal}
        className="mt-2 w-full rounded-xl py-3 text-sm font-semibold transition"
        style={{
          background:
            "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 20%, transparent)",
          color: "var(--theme-heading-text)",
          border:
            "1px solid color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 30%, transparent)",
        }}
      >
        Show answer
        <span className="ml-2 text-xs opacity-50" aria-hidden>
          (Space)
        </span>
      </button>
    </div>
  );
}

// ── FlashcardBack ─────────────────────────────────────────────────────────────

type FlashcardBackProps = {
  card: ViewerCard;
  onRate: (rating: CardRating) => void;
  submitting: boolean;
};

export function FlashcardBack({ card, onRate, submitting }: FlashcardBackProps) {
  return (
    <div
      className="flex min-h-[260px] flex-col justify-between rounded-2xl px-7 py-8"
      style={{
        background:
          "color-mix(in srgb, var(--surface-soft-b, var(--theme-primary)) 8%, var(--bg-card, var(--theme-card-bg)))",
        border: "1px solid var(--border-subtle, var(--theme-card-border))",
        boxShadow:
          "0 2px 16px -4px rgba(0,0,0,0.07), 0 1px 4px -1px rgba(0,0,0,0.05)",
      }}
      role="region"
      aria-label="Flashcard back"
    >
      {/* Topic label */}
      {card.topic ? (
        <span
          className="inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide"
          style={{
            background:
              "color-mix(in srgb, var(--surface-soft-b, var(--theme-primary)) 18%, transparent)",
            color: "var(--theme-muted-text)",
          }}
        >
          {card.topic}
        </span>
      ) : null}

      {/* Answer */}
      <div className="flex-1 py-5">
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {card.back}
        </p>
        {card.explanation && card.explanation !== card.back ? (
          <p
            className="mt-3 border-t pt-3 text-xs leading-relaxed"
            style={{
              color: "var(--theme-muted-text)",
              borderColor: "var(--border-subtle, var(--theme-card-border))",
            }}
          >
            {card.explanation}
          </p>
        ) : null}
      </div>

      {/* Rating buttons */}
      <div>
        <p
          className="mb-2 text-xs font-medium"
          style={{ color: "var(--theme-muted-text)" }}
        >
          How well did you know this?
        </p>
        <div className="grid grid-cols-4 gap-2">
          {RATING_CONFIG.map((r) => (
            <button
              key={r.value}
              type="button"
              disabled={submitting}
              onClick={() => onRate(r.value)}
              className="rounded-lg py-2 text-xs font-semibold transition disabled:opacity-50"
              aria-label={`Rate: ${r.label} (key ${r.key})`}
              style={{
                background: `color-mix(in srgb, ${r.accentVar} 14%, var(--bg-card, #fff))`,
                color: r.accentVar,
                border: `1px solid color-mix(in srgb, ${r.accentVar} 28%, transparent)`,
              }}
            >
              {r.label}
              <span className="ml-1 text-[10px] opacity-50" aria-hidden>
                {r.key}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="relative h-1.5 flex-1 overflow-hidden rounded-full"
        style={{
          background:
            "color-mix(in srgb, var(--theme-primary) 12%, var(--bg-page, #f9fafb))",
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label={`Progress: card ${current} of ${total}`}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{
            width: `${pct}%`,
            background: "var(--theme-primary)",
          }}
        />
      </div>
      <span
        className="shrink-0 text-xs tabular-nums"
        style={{ color: "var(--theme-muted-text)" }}
      >
        {current} / {total}
      </span>
    </div>
  );
}

// ── Done screen ───────────────────────────────────────────────────────────────

function DoneScreen({ onReset, deckRef }: { onReset: () => void; deckRef?: string }) {
  return (
    <div
      className="flex flex-col items-center gap-5 rounded-2xl px-8 py-12 text-center"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-success, #22c55e) 8%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 22%, transparent)",
      }}
    >
      <div
        className="flex h-14 w-14 items-center justify-center rounded-full text-2xl"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-success, #22c55e) 16%, transparent)",
        }}
        aria-hidden
      >
        ✓
      </div>
      <div>
        <p
          className="text-lg font-semibold"
          style={{ color: "var(--theme-heading-text)" }}
        >
          Session complete
        </p>
        <p
          className="mt-1 text-sm"
          style={{ color: "var(--theme-muted-text)" }}
        >
          You reviewed all cards in this batch. Great work.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onReset}
          className="rounded-full px-5 py-2 text-sm font-semibold transition"
          style={{
            background: "var(--role-cta, var(--theme-primary))",
            color: "var(--role-cta-foreground, #fff)",
          }}
        >
          Study again
        </button>
        {deckRef ? (
          <a
            href={`/app/flashcards/${deckRef}?shuffle=1`}
            className="rounded-full border px-5 py-2 text-sm font-semibold transition"
            style={{
              borderColor: "var(--border-subtle, var(--theme-card-border))",
              color: "var(--theme-heading-text)",
            }}
          >
            Shuffle & retry
          </a>
        ) : null}
      </div>
    </div>
  );
}

// ── FlashcardViewer ───────────────────────────────────────────────────────────

export type FlashcardViewerProps = {
  /**
   * Initial batch of cards to show. The viewer will call `onLoadMore`
   * when approaching the end of the current batch.
   */
  initialCards: ViewerCard[];
  /**
   * Server-side session cursor info (used to know total queue length).
   * Pass `null` for sessions without server-side cursors (e.g. generated cards).
   */
  session: ViewerSession | null;
  /**
   * Optional callback to load the next batch of cards.
   * Receives the current cursor position; returns next batch + updated session.
   */
  onLoadMore?: (cursor: number) => Promise<{ cards: ViewerCard[]; session: ViewerSession }>;
  /**
   * Optional callback when the user rates a card.
   * Receives cardId and rating; handle the API call in the consumer.
   */
  onRate?: (cardId: string, rating: CardRating) => Promise<void>;
  /** Passed through to the done screen for "Shuffle & retry" link. */
  deckRef?: string;
  /** Reset the viewer and reload from the start. */
  onReset?: () => void;
};

const PRELOAD_THRESHOLD = 3; // load next batch when within this many cards of the end

export function FlashcardViewer({
  initialCards,
  session: initialSession,
  onLoadMore,
  onRate,
  deckRef,
  onReset,
}: FlashcardViewerProps) {
  const [cards, setCards] = useState<ViewerCard[]>(initialCards);
  const [cardIndex, setCardIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [session, setSession] = useState<ViewerSession | null>(initialSession);
  const [loadingMore, setLoadingMore] = useState(false);
  const [done, setDone] = useState(false);

  // Preload next batch as user approaches end of current batch
  useEffect(() => {
    if (!onLoadMore || loadingMore || !session) return;
    if (session.done) return;
    const remaining = cards.length - cardIndex;
    if (remaining > PRELOAD_THRESHOLD) return;
    void (async () => {
      setLoadingMore(true);
      try {
        const { cards: next, session: nextSession } = await onLoadMore(session.cursor);
        if (next.length > 0) {
          setCards((prev) => [...prev, ...next]);
          setSession(nextSession);
        }
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [cardIndex, cards.length, loadingMore, onLoadMore, session]);

  // Keyboard shortcuts: Space to reveal, 1-4 to rate
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return;
      if (e.code === "Space" && !revealed && !done) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed && !done && !submitting) {
        const rating = RATING_CONFIG.find((r) => r.key === e.key);
        if (rating) void handleRate(rating.value);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, done, submitting, cardIndex, cards]);

  const handleReveal = useCallback(() => setRevealed(true), []);

  const advance = useCallback(() => {
    const nextIndex = cardIndex + 1;
    if (nextIndex >= cards.length) {
      // Check if truly done (session.done or no loadMore)
      if (!onLoadMore || session?.done) {
        setDone(true);
      } else {
        // Still loading more — show last card until more arrive
        setCardIndex(nextIndex - 1);
      }
      return;
    }
    setCardIndex(nextIndex);
    setRevealed(false);
  }, [cardIndex, cards.length, onLoadMore, session]);

  const handleRate = useCallback(
    async (rating: CardRating) => {
      const card = cards[cardIndex];
      if (!card) return;
      setSubmitting(true);
      try {
        await onRate?.(card.id, rating);
      } finally {
        setSubmitting(false);
        advance();
      }
    },
    [advance, cardIndex, cards, onRate],
  );

  const handleReset = useCallback(() => {
    setCards(initialCards);
    setCardIndex(0);
    setRevealed(false);
    setDone(false);
    setSession(initialSession);
    onReset?.();
  }, [initialCards, initialSession, onReset]);

  const currentCard = cards[cardIndex];
  const totalKnown = session?.queueLength ?? cards.length;

  if (done || (!currentCard && cards.length > 0)) {
    return <DoneScreen onReset={handleReset} deckRef={deckRef} />;
  }

  if (!currentCard) {
    return (
      <div
        className="rounded-2xl p-10 text-center text-sm"
        style={{ color: "var(--theme-muted-text)" }}
      >
        No cards available for this session.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Progress */}
      <ProgressBar current={cardIndex + 1} total={totalKnown} />

      {/* Card (flip between front and back) */}
      <div>
        {!revealed ? (
          <FlashcardFront card={currentCard} onReveal={handleReveal} />
        ) : (
          <FlashcardBack
            card={currentCard}
            onRate={handleRate}
            submitting={submitting}
          />
        )}
      </div>

      {/* Load-more indicator */}
      {loadingMore ? (
        <p
          className="text-center text-xs"
          style={{ color: "var(--theme-muted-text)" }}
        >
          Loading next batch…
        </p>
      ) : null}

      {/* Keyboard hint */}
      <p
        className="text-center text-[10px]"
        style={{ color: "var(--theme-muted-text)", opacity: 0.6 }}
      >
        {!revealed
          ? "Press Space to reveal"
          : "Press 1 (Again) · 2 (Hard) · 3 (Good) · 4 (Easy)"}
      </p>
    </div>
  );
}
