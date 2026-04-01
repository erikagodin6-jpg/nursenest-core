"use client";

import { LearnerNoteScope } from "@prisma/client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ProtectedPremiumContent } from "@/components/student/protected-premium-content";
import { StudyNotesPanel } from "@/components/student/study-notes-panel";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

type WeakCard = {
  id: string;
  front: string;
  back: string;
  deckSlug: string;
  topic: string;
  subtopic: string | null;
};

const SIMPLE = ["incorrect", "unsure", "known"] as const;

export function FlashcardWeakStudyClient({
  userId,
  userLabel,
  protectionFlags,
}: {
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
}) {
  const [queue, setQueue] = useState<WeakCard[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const current = queue[idx] ?? null;

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/flashcards/weak-queue", { credentials: "include" });
      const data = (await res.json()) as {
        cards?: WeakCard[];
        weakTopics?: string[];
        hint?: string | null;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not load weak-area cards");
      }
      setQueue(data.cards ?? []);
      setWeakTopics(data.weakTopics ?? []);
      setHint(data.hint ?? null);
      setIdx(0);
      setFlipped(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const onRate = async (rating: (typeof SIMPLE)[number]) => {
    if (!current) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch(`/api/flashcards/decks/${encodeURIComponent(current.deckSlug)}/review`, {
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
        await load();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading && queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">
        Building your weak-area set…
      </div>
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

  if (!current) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[var(--theme-heading-text)]">No weak-area cards yet</p>
        {hint ? <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{hint}</p> : null}
        {weakTopics.length > 0 ? (
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">Topics we are watching: {weakTopics.join(", ")}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/app/flashcards" className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
            Browse decks
          </Link>
          <Link href="/app/questions" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
            Question bank
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-28">
      <div className="mb-4 flex items-center justify-between gap-2">
        <Link href="/app/flashcards" className="text-sm font-medium text-primary">
          ← Decks
        </Link>
        <button type="button" className="text-xs font-medium text-[var(--theme-muted-text)] underline" onClick={() => void load()}>
          Refresh set
        </button>
      </div>

      <h1 className="text-lg font-bold text-[var(--theme-heading-text)]">Weak-area flashcards</h1>
      <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
        Cards from your decks that match topics you have missed in practice. Each review saves to the original deck.
      </p>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <p className="mt-3 text-xs text-[var(--theme-muted-text)]">
        Card {idx + 1} of {queue.length}
        {current.topic ? (
          <>
            {" "}
            · <span className="font-medium text-[var(--theme-heading-text)]">{current.topic}</span>
            {current.subtopic ? ` · ${current.subtopic}` : ""}
          </>
        ) : null}
      </p>

      <div className="mt-4 flex gap-2">
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

      <ProtectedPremiumContent userLabel={userLabel} flags={protectionFlags} className="mt-6">
        <button
          type="button"
          className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          onClick={() => setFlipped(!flipped)}
          aria-label={flipped ? "Show front" : "Show back"}
        >
          <div
            className={`relative min-h-[220px] rounded-2xl border-2 border-[var(--theme-card-border)] bg-[var(--theme-card-bg)] p-6 shadow-sm transition ${
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

      <div className="mt-6">
        <StudyNotesPanel
          userId={userId}
          scope={LearnerNoteScope.FLASHCARD_DECK}
          contextId={current.deckSlug}
          topic={current.topic}
          sourceLabel={`Weak areas · ${current.topic}`}
          userLabel={userLabel}
          flags={protectionFlags}
        />
      </div>

      <div className="fixed bottom-0 left-0 right-0 border-t border-border bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <p className="mb-2 text-center text-xs text-[var(--theme-muted-text)]">How well did you know it?</p>
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
    </div>
  );
}
