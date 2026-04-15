"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard } from "@/components/study/active-study-session";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import {
  clearDeckSessionCheckpoint,
  getDeckSessionCheckpoint,
  saveDeckSessionCheckpoint,
} from "@/lib/flashcards/study-session-persistence";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";

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
  studyMode = "learn",
}: {
  deckRef: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  /** From `?shuffle=1` — new sessions shuffle the queue. */
  shuffleInitially?: boolean;
  /** From `?mode=test` — legacy-style timed study shell (elapsed timer). */
  studyMode?: "learn" | "test";
}) {
  const { t } = useMarketingI18n();
  const DECK_SESSION_REQUEST_COUNT = 40;
  const [title, setTitle] = useState<string>("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [studyMeta, setStudyMeta] = useState<StudyResponse["sessionMeta"] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resetToken, setResetToken] = useState(0);
  const [shuffleOn, setShuffleOn] = useState(shuffleInitially);
  /** When true, a local checkpoint exists and the learner must pick Resume vs Start fresh before the session mounts. */
  const [resumeGateOpen, setResumeGateOpen] = useState(false);
  const [resumeInitial, setResumeInitial] = useState<{ index: number; revealed: boolean }>({ index: 0, revealed: false });
  const [sessionMountKey, setSessionMountKey] = useState(0);
  /** Avoid mounting the study surface before localStorage resume checkpoint is evaluated (subscriber only). */
  const [resumeCheckpointReady, setResumeCheckpointReady] = useState(false);

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

  useLayoutEffect(() => {
    if (loading || queue.length === 0) {
      setResumeCheckpointReady(false);
      return;
    }
    if (mode !== "subscriber") {
      setResumeGateOpen(false);
      setResumeInitial({ index: 0, revealed: false });
      setResumeCheckpointReady(true);
      return;
    }
    const ck = getDeckSessionCheckpoint(deckRef);
    if (!ck || ck.deckRef !== deckRef) {
      setResumeGateOpen(false);
      setResumeInitial({ index: 0, revealed: false });
      setResumeCheckpointReady(true);
      return;
    }
    const maxIdx = queue.length - 1;
    const idx = Math.min(Math.max(0, ck.index), maxIdx);
    const canResume = idx > 0 || ck.revealed;
    if (canResume) {
      setResumeGateOpen(true);
      setResumeInitial({ index: idx, revealed: ck.revealed });
    } else {
      setResumeGateOpen(false);
      setResumeInitial({ index: 0, revealed: false });
    }
    setResumeCheckpointReady(true);
  }, [loading, queue.length, deckRef, resetToken, mode]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const meta = await fetch(`/api/flashcards/decks/${encodeURIComponent(deckRef)}`, { credentials: "include" });
      if (!meta.ok || cancelled) return;
      const m = await meta.json();
      if (!cancelled && m.deck?.title) setTitle(formatTitleCase(String(m.deck.title)));
    })();
    return () => {
      cancelled = true;
    };
  }, [deckRef]);

  const onStudyProgress = useCallback(
    (state: { index: number; revealed: boolean }) => {
      if (mode !== "subscriber" || resumeGateOpen) return;
      saveDeckSessionCheckpoint(deckRef, state.index, state.revealed);
    },
    [deckRef, mode, resumeGateOpen],
  );

  const onSessionComplete = useCallback(() => {
    clearDeckSessionCheckpoint(deckRef);
  }, [deckRef]);

  const onSessionRestart = useCallback(() => {
    clearDeckSessionCheckpoint(deckRef);
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
        throw new Error(data.error ?? t("learner.flashcards.deckStudy.reviewSaveFailed"));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : t("learner.flashcards.deckStudy.genericError"));
    }
  };

  const activeCards: ActiveStudyCard[] = useMemo(
    () =>
      queue.map((card) => ({
        id: card.id,
        prompt: card.front,
        answer: card.back,
        explanation: card.explanation,
        topic: card.topic ?? null,
        subtopic: card.subtopic ?? null,
        sourceKey: card.sourceKey ?? null,
        pathwayId: card.pathwayId ?? null,
        topicSlug: card.subtopic ?? null,
      })),
    [queue],
  );

  if (loading && queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">
        {t("learner.flashcards.deckStudy.loadingDeck")}
      </div>
    );
  }

  if (error && queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <p className="text-sm text-red-600">{error}</p>
        <Link href="/app/flashcards" className="mt-4 inline-block text-sm font-semibold text-primary">
          {t("learner.flashcards.deckStudy.backToAllDecks")}
        </Link>
      </div>
    );
  }

  const pendingResume = mode === "subscriber" && resumeGateOpen;
  const subscriberSessionBlocked = mode === "subscriber" && !resumeCheckpointReady && queue.length > 0;

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--theme-muted-text)]">
        {t("learner.flashcards.deckStudy.noCardsBody")}
        <div className="mt-6">
          <Link href="/app/flashcards" className="font-semibold text-primary">
            {t("learner.flashcards.deckStudy.backShort")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[min(112rem,100%)] px-4 py-6">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Link href="/app/flashcards" className="text-sm font-medium text-primary">
          {t("learner.flashcards.deckStudy.backToFlashcards")}
        </Link>
        {mode === "subscriber" ? (
          <div className="flex items-center gap-2">
            <label className="flex cursor-pointer items-center gap-1.5 text-xs text-[var(--theme-muted-text)]">
              <input
                type="checkbox"
                checked={shuffleOn}
                onChange={(e) => {
                  clearDeckSessionCheckpoint(deckRef);
                  setShuffleOn(e.target.checked);
                  setResetToken((x) => x + 1);
                }}
                className="rounded border-border"
              />
              {t("learner.flashcards.deckStudy.shuffle")}
            </label>
            <button
              type="button"
              className="text-xs font-medium text-[var(--theme-muted-text)] underline"
              onClick={() => {
                clearDeckSessionCheckpoint(deckRef);
                setResumeGateOpen(false);
                setSessionMountKey((k) => k + 1);
                setResetToken((x) => x + 1);
              }}
            >
              {t("learner.flashcards.deckStudy.resetSession")}
            </button>
          </div>
        ) : null}
      </div>

      {mode === "preview" ? (
        <p className="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-950">
          {t("learner.flashcards.deckStudy.previewBanner")}
        </p>
      ) : null}

      {error ? <p className="mb-3 text-sm text-red-600">{error}</p> : null}

      {subscriberSessionBlocked ? (
        <div className="mb-4 rounded-xl border border-border bg-[var(--theme-card-bg)] px-4 py-10 text-center text-sm text-[var(--theme-muted-text)]">
          {t("learner.flashcards.deckStudy.preparingShell")}
        </div>
      ) : null}

      {!subscriberSessionBlocked && pendingResume ? (
        <div className="mb-4 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-info)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_10%,var(--semantic-surface))] p-4 text-sm text-[var(--semantic-text-primary)] shadow-sm">
          <p className="font-semibold text-[var(--semantic-text-primary)]">{t("learner.flashcards.deckStudy.resumeTitle")}</p>
          <p className="mt-1 text-xs text-[var(--semantic-text-secondary)]">
            {t("learner.flashcards.deckStudy.resumeBody", {
              n: resumeInitial.index + 1,
              revealed: resumeInitial.revealed ? t("learner.flashcards.deckStudy.resumeRevealedSuffix") : "",
            })}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-[color-mix(in_srgb,var(--semantic-brand)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-brand)_12%,var(--semantic-surface))] px-4 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
              onClick={() => {
                setResumeGateOpen(false);
                setSessionMountKey((k) => k + 1);
              }}
            >
              {t("learner.flashcards.deckStudy.resumeCta")}
            </button>
            <button
              type="button"
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
              onClick={() => {
                clearDeckSessionCheckpoint(deckRef);
                setResumeInitial({ index: 0, revealed: false });
                setResumeGateOpen(false);
                setSessionMountKey((k) => k + 1);
              }}
            >
              {t("learner.flashcards.deckStudy.startFresh")}
            </button>
          </div>
        </div>
      ) : null}

      {!subscriberSessionBlocked && !pendingResume ? (
        <ExamSessionShell neutralPalette immersive className="overflow-hidden shadow-md">
          <ActiveStudySession
            key={`${deckRef}-${sessionMountKey}-${resetToken}`}
            cards={activeCards}
            loading={loading}
            layout="card"
            sessionMode={studyMode === "test" ? "test" : "learn"}
            initialCardIndex={resumeInitial.index}
            initialRevealed={resumeInitial.revealed}
            sessionMeta={{
              requestedCount: studyMeta?.requestedCount ?? DECK_SESSION_REQUEST_COUNT,
              returnedCount: studyMeta?.returnedCount ?? activeCards.length,
              totalAvailable: studyMeta?.totalAvailable ?? activeCards.length,
              hasMore: studyMeta?.hasMore ?? false,
            }}
            header={{
              sessionTitle: title || t("learner.flashcards.deckStudy.defaultTitle"),
              modeLabel:
                studyMode === "test"
                  ? t("learner.flashcards.deckStudy.modeTest")
                  : t("learner.flashcards.deckStudy.modeLearn"),
              categoriesLabel: t("learner.flashcards.deckStudy.sessionKind"),
              exitHref: "/app/flashcards",
            }}
            onRate={mode === "subscriber" ? onRate : undefined}
            onStudyProgress={mode === "subscriber" ? onStudyProgress : undefined}
            onSessionComplete={mode === "subscriber" ? onSessionComplete : undefined}
            onSessionRestart={mode === "subscriber" ? onSessionRestart : undefined}
          />
        </ExamSessionShell>
      ) : !subscriberSessionBlocked ? (
        <div className="rounded-xl border border-border bg-[var(--theme-card-bg)] p-8 text-center text-sm text-[var(--theme-muted-text)]">
          {t("learner.flashcards.deckStudy.chooseBefore")}{" "}
          <span className="font-semibold text-[var(--semantic-text-primary)]">
            {t("learner.flashcards.deckStudy.resumeCta")}
          </span>{" "}
          {t("learner.flashcards.deckStudy.chooseOr")}{" "}
          <span className="font-semibold text-[var(--semantic-text-primary)]">
            {t("learner.flashcards.deckStudy.startFresh")}
          </span>{" "}
          {t("learner.flashcards.deckStudy.chooseAfter")}
        </div>
      ) : null}
    </div>
  );
}
