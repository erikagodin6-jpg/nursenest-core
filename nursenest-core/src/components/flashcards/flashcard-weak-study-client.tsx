"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";

type WeakCard = {
  id: string;
  front: string;
  back: string;
  deckSlug: string;
  pathwayId: string | null;
  sourceKey: string | null;
  topic: string;
  subtopic: string | null;
  lessonStudyHref?: string;
  lessonStudyTitle?: string;
};

const SIMPLE = ["again", "hard", "good", "easy"] as const;

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
      <div
        className="py-20 text-center text-sm text-[var(--semantic-text-muted)]"
        data-nn-e2e-flashcards-weak-study-loading
      >
        Building your weak-area session…
      </div>
    );
  }

  // ❌ Error
  if (error && queue.length === 0) {
    return (
      <div className="py-20 text-center" data-nn-e2e-flashcards-weak-study-error>
        <p className="text-sm text-[var(--semantic-danger)]">{error}</p>
        <Link
          href={flashcardsHubHref}
          className="mt-4 inline-block text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
        >
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
      <div
        className="mx-auto max-w-lg py-20 text-center"
        data-nn-e2e-flashcards-weak-study-empty
      >
        <h2 className="mb-2 text-lg font-semibold">
          {pathwayRequired ? "Select your exam track" : "No weak cards yet"}
        </h2>

        <p className="mb-6 text-sm text-[var(--semantic-text-secondary)]">
          {hint ?? "Answer questions to build your weak-area set"}
        </p>

        {weakTopics.length > 0 && (
          <p className="mb-4 text-xs text-[var(--semantic-text-muted)]">
            Tracking: {weakTopics.join(", ")}
          </p>
        )}

        <div className="flex flex-col gap-3">
          {pathwayRequired && (
            <Link
              href="/app/account/study-preferences"
              className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
              style={{ background: "var(--role-cta, var(--semantic-brand))" }}
            >
              Set study preferences
            </Link>
          )}

          <Link
            href={flashcardsHubHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-info)_40%,transparent)]"
          >
            Browse decks
          </Link>

          <Link
            href={questionsHref}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-info)_40%,transparent)]"
          >
            Question bank
          </Link>
        </div>
      </div>
    );
  }

  // 🎯 Session cards
  const activeCards: ActiveStudyCard[] = queue.map((c) => {
    const pid = c.pathwayId?.trim() || null;
    const topicSlug = c.subtopic?.trim() || null;
    return {
      id: c.id,
      prompt: c.front,
      answer: c.back,
      topic: c.topic,
      subtopic: c.subtopic,
      sourceKey: c.sourceKey,
      pathwayId: pid,
      topicSlug,
      lessonHref: c.lessonStudyHref?.trim() ? c.lessonStudyHref : null,
      lessonTitle: c.lessonStudyTitle?.trim() ? c.lessonStudyTitle : null,
      practiceTopicHref: pid && topicSlug ? pathwayHubAppQuestionsHref(pid, topicSlug) : null,
      practiceTestsTopicHref: pid && topicSlug ? buildAppPracticeTestsTopicHref(pid, topicSlug) : null,
    };
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-6" data-nn-e2e-flashcards-weak-study-root>
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <Link
          href={flashcardsHubHref}
          className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
        >
          ← Flashcards
        </Link>

        <button
          type="button"
          onClick={() => void load()}
          className="text-xs text-[var(--semantic-text-muted)] underline underline-offset-2 hover:text-[var(--semantic-text-secondary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-info)_40%,transparent)]"
        >
          Refresh
        </button>
      </div>

      {/* SESSION — match deck/custom premium shell for visual + readiness parity */}
      <ExamSessionShell examMode="practice" className="nn-premium-flashcard-session-root nn-flashcard-study-premium">
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
      </ExamSessionShell>
    </div>
  );
}