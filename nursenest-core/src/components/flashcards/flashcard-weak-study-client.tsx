"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";

type WeakCard = {
  id: string;
  front: string;
  back: string;
  deckSlug: string;
  pathwayId: string | null;
  sourceKey: string | null;
  topic: string;
  subtopic: string | null;
};

const SIMPLE = ["incorrect", "unsure", "known"] as const;

export function FlashcardWeakStudyClient({
  userId: _userId,
  userLabel: _userLabel,
  protectionFlags: _protectionFlags,
}: {
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
}) {
  const [queue, setQueue] = useState<WeakCard[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const onRate = async (cardId: string, rating: (typeof SIMPLE)[number]) => {
    const card = queue.find((item) => item.id === cardId);
    if (!card) return;
    setError(null);
    try {
      const res = await fetch(`/api/flashcards/decks/${encodeURIComponent(card.deckSlug)}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: card.id, rating }),
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

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[var(--theme-heading-text)]">No weak-area cards yet</p>
        {hint ? <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{hint}</p> : null}
        {weakTopics.length > 0 ? (
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">Topics we are watching: {weakTopics.join(", ")}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3">
          <Link href="/app/flashcards" className="rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground">
            Browse decks
          </Link>
          <Link href="/app/questions" className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
            Question bank
          </Link>
        </div>
      </div>
    );
  }

  const activeCards: ActiveStudyCard[] = queue.map((card) => ({
    id: card.id,
    prompt: card.front,
    answer: card.back,
    topic: card.topic,
    subtopic: card.subtopic,
    sourceKey: card.sourceKey,
    pathwayId: card.pathwayId,
    topicSlug: card.subtopic,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link href="/app/flashcards" className="text-sm font-medium text-primary">
          ← Back to Flashcards
        </Link>
        <button type="button" className="text-xs font-medium text-[var(--theme-muted-text)] underline" onClick={() => void load()}>
          Refresh Set
        </button>
      </div>
      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}
      <ActiveStudySession
        cards={activeCards}
        loading={loading}
        sessionMeta={{
          requestedCount: activeCards.length,
          returnedCount: activeCards.length,
          totalAvailable: activeCards.length,
          hasMore: false,
        }}
        header={{
          sessionTitle: "Weak-Area Study Session",
          modeLabel: "Active Recall",
          categoriesLabel: weakTopics.length > 0 ? weakTopics.join(", ") : "Weak Areas",
          exitHref: "/app/flashcards",
        }}
        onRate={onRate}
      />
    </div>
  );
}
