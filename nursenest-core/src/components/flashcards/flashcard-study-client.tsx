"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

type CardPayload = {
  id: string;
  front: string;
  back: string;
  fullBackAvailable: boolean;
  /** Optional teaching line from locale overlay (`educational-overlays/<locale>/flashcards.json`). */
  explanation?: string;
  topic?: string;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
};

type StudyResponse = {
  mode: "preview" | "subscriber";
  deckId: string;
  slug: string;
  cards: CardPayload[];
  session: { cursor: number; queueLength: number; done: boolean; batchSize?: number } | null;
  sessionMeta?: {
    requestedCount?: number;
    returnedCount?: number;
    totalAvailable?: number;
    hasMore?: boolean;
  };
};

type ReviewRating = "incorrect" | "unsure" | "known";

export function FlashcardStudyClient({
  deckRef,
  shuffleInitially = false,
}: {
  deckRef: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  /** From `?shuffle=1` — new sessions shuffle the queue. */
  shuffleInitially?: boolean;
}) {
  const DECK_SESSION_REQUEST_COUNT = 40;
  const [title, setTitle] = useState<string>("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [studyMeta, setStudyMeta] = useState<StudyResponse["sessionMeta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const [shuffleOn, setShuffleOn] = useState(shuffleInitially);

  const fetchBatch = useCallback(
    async (reset: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const q = reset ? "&reset=1" : "";
        const sh = shuffleOn ? "&shuffle=1" : "";
        const res = await fetch(`/api/flashcards/decks/${encodeURIComponent(deckRef)}/study?limit=${DECK_SESSION_REQUEST_COUNT}${q}${sh}`, {
          credentials: "include",
        });
        const data = (await res.json()) as StudyResponse & { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Could not load cards");
        }
        setMode(data.mode);
        setQueue(data.cards);
        setStudyMeta(data.sessionMeta ?? null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
        setQueue([]);
        setStudyMeta(null);
      } finally {
        setLoading(false);
      }
    },
    [deckRef, shuffleOn],
  );

  useEffect(() => {
    void fetchBatch(resetToken > 0);
  }, [deckRef, resetToken, fetchBatch]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meta = await fetch(`/api/flashcards/decks/${encodeURIComponent(deckRef)}`, { credentials: "include" });
      if (!meta.ok || cancelled) return;
      const m = await meta.json();
      if (!cancelled && m.deck?.title) setTitle(m.deck.title);
    })();
    return () => {
      cancelled = true;
    };
  }, [deckRef]);

  const onRate = async (cardId: string, rating: ReviewRating) => {
    if (!cardId || mode !== "subscriber") return;
    setError(null);
    try {
      const res = await fetch(`/api/flashcards/decks/${encodeURIComponent(deckRef)}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: cardId, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save review");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    }
  };

  if (loading && queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">Loading deck…</div>
    );
  }

  if (error && queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/app/flashcards" className="mt-4 inline-block text-sm font-semibold text-primary">
          ← All decks
        </Link>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">
        No cards are available for this deck right now.
        <div className="mt-6">
          <Link href="/app/flashcards" className="font-semibold text-primary">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  const activeCards: ActiveStudyCard[] = queue.map((card) => ({
    id: card.id,
    prompt: card.front,
    answer: card.back,
    explanation: card.explanation,
    topic: card.topic ?? null,
    subtopic: card.subtopic ?? null,
    sourceKey: card.sourceKey ?? null,
    pathwayId: card.pathwayId ?? null,
    topicSlug: card.subtopic ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link href="/app/flashcards" className="text-sm font-medium text-primary">
          ← Back to Flashcards
        </Link>
        {mode === "subscriber" ? (
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--theme-muted-text)]">
              <input
                type="checkbox"
                checked={shuffleOn}
                onChange={(e) => {
                  setShuffleOn(e.target.checked);
                  setResetToken((t) => t + 1);
                }}
                className="rounded border-border"
              />
              Shuffle
            </label>
            <button type="button" className="text-xs font-medium text-[var(--theme-muted-text)] underline" onClick={() => setResetToken((t) => t + 1)}>
              Reset Session
            </button>
          </div>
        ) : null}
      </div>

      {mode === "preview" ? (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Preview sample. Subscribe for full study scheduling and premium progression.
        </p>
      ) : null}

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      <ActiveStudySession
        cards={activeCards}
        loading={loading}
        sessionMeta={{
          requestedCount: studyMeta?.requestedCount ?? DECK_SESSION_REQUEST_COUNT,
          returnedCount: studyMeta?.returnedCount ?? activeCards.length,
          totalAvailable: studyMeta?.totalAvailable ?? activeCards.length,
          hasMore: studyMeta?.hasMore ?? false,
        }}
        header={{
          sessionTitle: title || "Flashcard Study Session",
          modeLabel: "Active Recall",
          categoriesLabel: "Deck Session",
          exitHref: "/app/flashcards",
        }}
        onRate={mode === "subscriber" ? onRate : undefined}
      />
    </div>
  );
}
