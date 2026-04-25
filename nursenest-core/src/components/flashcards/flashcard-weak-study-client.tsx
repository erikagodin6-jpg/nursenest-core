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

      const res = await fetch(
        `/api/flashcards/weak-queue${qs.toString() ? `?${qs}` : ""}`,
        { credentials: "include" }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? "Load failed");

      setQueue(data.cards ?? []);
      setWeakTopics(data.weakTopics ?? []);
      setHint(data.hint ?? null);
      setPathwayRequired(Boolean(data.pathwayRequired));
      setResolvedPathwayId(data.pathwayId ?? null);
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
    const card = queue.find((c) => c.id === cardId);
    if (!card) return;

    try {
      await fetch(`/api/flashcards/decks/${card.deckSlug}/review`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flashcardId: card.id, rating }),
      });
    } catch {
      setError("Failed to save review");
    }
  };

  // 🧠 Loading
  if (loading && queue.length === 0) {
    return (
      <div className="text-center py-20 text-sm text-gray-400">
        Building your weak-area session…
      </div>
    );
  }

  // ❌ Error
  if (error && queue.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-red-600 text-sm">{error}</p>
        <Link href={flashcardsHubHref} className="mt-4 inline-block text-blue-600">
          ← Back
        </Link>
      </div>
    );
  }

  // 📭 Empty
  if (queue.length === 0) {
    const questionsHref = resolvedPathwayId
      ? pathwayHubAppQuestionsHref(resolvedPathwayId)
      : "/app/questions";

    return (
      <div className="max-w-lg mx-auto text-center py-20">
        <h2 className="text-lg font-semibold mb-2">
          {pathwayRequired ? "Select your exam track" : "No weak cards yet"}
        </h2>

        <p className="text-sm text-gray-500 mb-6">
          {hint ?? "Answer questions to build your weak-area set"}
        </p>

        {weakTopics.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Tracking: {weakTopics.join(", ")}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {pathwayRequired && (
            <Link
              href="/app/account/study-preferences"
              className="bg-blue-600 text-white rounded-full py-2"
            >
              Set study preferences
            </Link>
          )}

          <Link href={flashcardsHubHref} className="border rounded-full py-2">
            Browse decks
          </Link>

          <Link href={questionsHref} className="border rounded-full py-2">
            Question bank
          </Link>
        </div>
      </div>
    );
  }

  // 🎯 Session cards
  const activeCards: ActiveStudyCard[] = queue.map((c) => ({
    id: c.id,
    prompt: c.front,
    answer: c.back,
    topic: c.topic,
    subtopic: c.subtopic,
  }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <Link href={flashcardsHubHref} className="text-sm text-blue-600">
          ← Flashcards
        </Link>

        <button onClick={load} className="text-xs text-gray-500 underline">
          Refresh
        </button>
      </div>

      {/* SESSION */}
      <ActiveStudySession
        cards={activeCards}
        layout="split"
        header={{
          sessionTitle: "Weak Areas",
          modeLabel: "Active Recall",
          categoriesLabel: weakTopics.join(", ") || "Focus",
          exitHref: flashcardsHubHref,
        }}
        onRate={onRate}
      />
    </div>
  );
}