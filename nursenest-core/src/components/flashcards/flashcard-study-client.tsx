"use client";

import { LearnerNoteScope } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

type CardPayload = {
  id: string;
  front: string;
  back: string;
  fullBackAvailable: boolean;
  topic?: string;
  subtopic?: string | null;
};

type StudyResponse = {
  mode: "preview" | "subscriber";
  deckId: string;
  slug: string;
  cards: CardPayload[];
  session: { cursor: number; queueLength: number; done: boolean; batchSize?: number } | null;
};

const SIMPLE = ["incorrect", "unsure", "known"] as const;

export function FlashcardStudyClient({
  deckRef,
  userId,
  userLabel,
  protectionFlags,
  shuffleInitially = false,
}: {
  deckRef: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  /** From `?shuffle=1` — new sessions shuffle the queue. */
  shuffleInitially?: boolean;
}) {
  const [title, setTitle] = useState<string>("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [sessionMeta, setSessionMeta] = useState<StudyResponse["session"]>(null);
  const [resetToken, setResetToken] = useState(0);
  const [shuffleOn, setShuffleOn] = useState(shuffleInitially);

  const current = queue[idx] ?? null;

  const fetchBatch = useCallback(
    async (reset: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const q = reset ? "&reset=1" : "";
        const sh = shuffleOn ? "&shuffle=1" : "";
        const res = await fetch(
          `/api/flashcards/decks/${encodeURIComponent(deckRef)}/study?limit=8${q}${sh}`,
          {
            credentials: "include",
          },
        );
        const data = (await res.json()) as StudyResponse & { error?: string; code?: string };
        if (!res.ok) {
          throw new Error(data.error ?? "Could not load cards");
        }
        setMode(data.mode);
        setQueue(data.cards);
        setIdx(0);
        setFlipped(false);
        setSessionMeta(data.session);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Error");
        setQueue([]);
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

  const onRate = async (rating: (typeof SIMPLE)[number]) => {
    if (!current || mode !== "subscriber") return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/flashcards/decks/${encodeURIComponent(deckRef)}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: current.id, rating }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Could not save review");
      }
      setFlipped(false);
      if (idx + 1 < queue.length) {
        setIdx(idx + 1);
      } else {
        setIdx(0);
        await fetchBatch(false);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
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

  if (!current && mode === "subscriber" && sessionMeta?.done) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[var(--theme-heading-text)]">Queue complete for now</p>
        <p className="mt-2 text-sm text-[var(--theme-muted-text)]">Come back when cards are due again.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            className="rounded-full border border-border bg-card px-5 py-2.5 text-sm font-semibold"
            onClick={() => setResetToken((t) => t + 1)}
          >
            Rebuild queue
          </button>
          <Link href="/app/flashcards" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            All decks
          </Link>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">
        No cards in this deck.
        <div className="mt-6">
          <Link href="/app/flashcards" className="font-semibold text-primary">
            ← Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <Link href="/app/flashcards" className="text-sm font-medium text-primary">
          ← Decks
        </Link>
        {mode === "subscriber" ? (
          <div className="flex flex-wrap items-center gap-2">
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
            <button
              type="button"
              className="text-xs font-medium text-[var(--theme-muted-text)] underline"
              onClick={() => setResetToken((t) => t + 1)}
            >
              Reset session
            </button>
          </div>
        ) : null}
      </div>

      {title ? <h1 className="text-lg font-bold text-[var(--theme-heading-text)]">{title}</h1> : null}

      {current.topic ? (
        <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
          <span className="font-semibold text-[var(--theme-heading-text)]">Topic:</span> {current.topic}
          {current.subtopic ? ` · ${current.subtopic}` : ""}
        </p>
      ) : null}

      {mode === "preview" ? (
        <p className="mt-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          Preview sample. Subscribe for full decks, backs, and spaced repetition.
        </p>
      ) : null}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      {mode === "subscriber" ? (
        <p className="mt-4 text-xs text-[var(--theme-muted-text)]">
          Premium content is for individual subscriber use. Notes are printable; protected card text is not.
        </p>
      ) : null}

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          disabled={idx <= 0}
          onClick={() => {
            setFlipped(false);
            setIdx((i) => Math.max(0, i - 1));
          }}
        >
          Previous
        </button>
        <button
          type="button"
          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
          disabled={idx + 1 >= queue.length}
          onClick={() => {
            setFlipped(false);
            setIdx((i) => Math.min(queue.length - 1, i + 1));
          }}
        >
          Next
        </button>
      </div>

      {mode === "subscriber" ? (
        <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} className="mt-6" telemetrySurface="flashcards">
          <button
            type="button"
            className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            onClick={() => setFlipped(!flipped)}
            aria-label={flipped ? "Show front" : "Show back"}
          >
            <div
              className={`relative min-h-[220px] rounded-2xl border-2 border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 shadow-sm transition duration-200 ${
                flipped ? "ring-2 ring-primary/30" : ""
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">{flipped ? "Back" : "Front"}</p>
              <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-[var(--theme-heading-text)]">
                {flipped ? current.back : current.front}
              </p>
              <p className="mt-6 text-center text-xs text-[var(--theme-muted-text)]">Tap to flip</p>
            </div>
          </button>
        </ProtectedPremiumContent>
      ) : (
        <button
          type="button"
          className="mt-8 w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setFlipped(!flipped)}
          aria-label={flipped ? "Show front" : "Show back"}
        >
          <div
            className={`relative min-h-[220px] rounded-2xl border-2 border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 shadow-sm transition duration-200 ${
              flipped ? "ring-2 ring-primary/30" : ""
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{flipped ? "Back" : "Front"}</p>
            <p className="mt-4 whitespace-pre-wrap text-base leading-relaxed text-[var(--theme-heading-text)]">
              {flipped ? current.back : current.front}
            </p>
            <p className="mt-6 text-center text-xs text-[var(--theme-muted-text)]">Tap to flip</p>
          </div>
        </button>
      )}

      {mode === "subscriber" ? (
        <div className="mt-6">
          <StudyNotesPanel
            userId={userId}
            scope={LearnerNoteScope.FLASHCARD_DECK}
            contextId={deckRef}
            topic={title || current.topic || null}
            sourceLabel={title ? `Flashcards · ${title}` : `Flashcards · ${deckRef.slice(0, 12)}`}
            userLabel={userLabel}
            flags={protectionFlags}
          />
        </div>
      ) : null}

      {mode === "subscriber" ? (
        <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <p className="mb-2 text-center text-xs text-[var(--theme-muted-text)]">
            {sessionMeta
              ? `Card ${sessionMeta.cursor + idx + 1} of ${sessionMeta.queueLength || queue.length}`
              : `Card ${idx + 1} of ${queue.length}`}
          </p>
          <p className="mb-2 text-center text-[10px] text-[var(--theme-muted-text)]">Incorrect · Unsure · Known (spaced repetition)</p>
          <div className="grid grid-cols-3 gap-2">
            {SIMPLE.map((r) => (
              <button
                key={r}
                type="button"
                disabled={saving || !flipped}
                onClick={() => void onRate(r)}
                className="min-h-[48px] rounded-xl border border-border bg-card text-sm font-semibold capitalize text-[var(--theme-heading-text)] transition enabled:hover:border-primary/40 disabled:opacity-40"
              >
                {r === "incorrect" ? "Incorrect" : r === "unsure" ? "Unsure" : "Known"}
              </button>
            ))}
          </div>
          {!flipped ? <p className="mt-2 text-center text-xs text-[var(--theme-muted-text)]">Flip the card to rate</p> : null}
        </div>
      ) : (
        <p className="mt-8 text-center text-sm text-[var(--theme-muted-text)]">
          <Link href="/pricing" className="font-semibold text-primary underline">
            View plans
          </Link>{" "}
          to unlock full study and scheduling.
        </p>
      )}
    </div>
  );
}
