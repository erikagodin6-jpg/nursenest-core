"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";

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
  const searchParams = useSearchParams();
  const pathwayId = searchParams.get("pathwayId")?.trim() || null;
  const flashcardsHubHref = pathwayId
    ? `/app/flashcards?pathwayId=${encodeURIComponent(pathwayId)}`
    : "/app/flashcards";

  const [queue, setQueue] = useState<WeakCard[]>([]);
  const [weakTopics, setWeakTopics] = useState<string[]>([]);
  const [hint, setHint] = useState<string | null>(null);
  const [pathwayRequired, setPathwayRequired] = useState(false);
  const [resolvedPathwayId, setResolvedPathwayId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams();
      if (pathwayId) qs.set("pathwayId", pathwayId);
      const url = qs.toString() ? `/api/flashcards/weak-queue?${qs.toString()}` : "/api/flashcards/weak-queue";
      const res = await fetch(url, { credentials: "include" });
      const data = (await res.json()) as {
        cards?: WeakCard[];
        weakTopics?: string[];
        hint?: string | null;
        pathwayId?: string | null;
        pathwayRequired?: boolean;
        error?: string;
      };
      if (!res.ok) {
        throw new Error(data.error ?? "Could not load weak-area cards");
      }
      setPathwayRequired(Boolean(data.pathwayRequired));
      setResolvedPathwayId(typeof data.pathwayId === "string" && data.pathwayId.trim() ? data.pathwayId.trim() : null);
      setQueue(data.cards ?? []);
      setWeakTopics(data.weakTopics ?? []);
      setHint(data.hint ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error");
      setQueue([]);
    } finally {
      setLoading(false);
    }
  }, [pathwayId]);

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
        headers: { "Content-Type": "application/json", "x-nn-study-launch-surface": "flashcards" },
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
        <Link href={flashcardsHubHref} className="mt-4 inline-block text-sm font-semibold text-primary">
          ← All decks
        </Link>
      </div>
    );
  }

  if (queue.length === 0) {
    const questionsHref = resolvedPathwayId ? pathwayHubAppQuestionsHref(resolvedPathwayId) : "/app/questions";
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-lg font-semibold text-[var(--theme-heading-text)]">
          {pathwayRequired ? "Pick your exam track for weak-area flashcards" : "No weak-area cards yet"}
        </p>
        {pathwayRequired ? (
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {hint ??
              "Weak-area cards stay on one subscription pathway. Set your track in Study preferences or open this page from Flashcards with a pathway selected."}
          </p>
        ) : hint ? (
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">{hint}</p>
        ) : null}
        {weakTopics.length > 0 ? (
          <p className="mt-2 text-xs text-[var(--theme-muted-text)]">Topics we are watching: {weakTopics.join(", ")}</p>
        ) : null}
        <div className="mt-8 flex flex-col gap-3">
          {pathwayRequired ? (
            <Link
              href="/app/account/study-preferences"
              className="rounded-full bg-role-cta px-5 py-2.5 text-sm font-semibold text-role-cta-foreground"
            >
              Study preferences
            </Link>
          ) : null}
          <Link
            href={flashcardsHubHref}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
              pathwayRequired ? "border border-border text-[var(--theme-heading-text)]" : "bg-role-cta text-role-cta-foreground"
            }`}
          >
            Browse decks
          </Link>
          <Link href={questionsHref} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold">
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
        <Link href={flashcardsHubHref} className="text-sm font-medium text-primary">
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
          exitHref: flashcardsHubHref,
        }}
        onRate={onRate}
      />
    </div>
  );
}
