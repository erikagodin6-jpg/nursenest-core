"use client";

import Link from "next/link";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard, type ActiveStudyHeader } from "@/components/study/active-study-session";
import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { formatTitleCase } from "@/lib/format/text-case";
import type { PremiumProtectionFlags } from "@/lib/premium-protection/config";
import {
  clearDeckSessionCheckpoint,
  getDeckSessionCheckpoint,
  saveDeckSessionCheckpoint,
} from "@/lib/flashcards/study-session-persistence";
import { ExamSessionShell } from "@/components/exam/exam-session-shell";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { buildAppPracticeTestsTopicHref } from "@/lib/learner/app-study-internal-links";
import { pathwayHubAppQuestionsHref } from "@/lib/marketing/pathway-hub-app-questions-href";
import { FlashcardSrsStatsStrip } from "@/components/flashcards/flashcard-srs-stats-strip";

type CardPayload = {
  id: string;
  front: string;
  back: string;
  fullBackAvailable: boolean;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload;
  topic?: string;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  lessonStudyHref?: string;
  lessonStudyTitle?: string;
};

type StudyResponse = {
  mode: "preview" | "subscriber";
  cards: CardPayload[];
  sessionMeta?: {
    requestedCount?: number;
    returnedCount?: number;
    totalAvailable?: number;
    hasMore?: boolean;
  };
};

export function FlashcardStudyClient({
  deckRef,
  shuffleInitially = false,
  studyMode = "learn",
}: {
  deckRef: string;
  userId: string;
  userLabel: string;
  protectionFlags: PremiumProtectionFlags;
  shuffleInitially?: boolean;
  studyMode?: "learn" | "test";
}) {
  const { t } = useMarketingI18n();

  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeGateOpen, setResumeGateOpen] = useState(false);
  const [resumeInitial, setResumeInitial] = useState({ index: 0, revealed: false });
  const [sessionKey, setSessionKey] = useState(0);

  // 🚀 fetch cards
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`/api/flashcards/decks/${deckRef}/study`, {
          credentials: "include",
        });
        const data = (await res.json()) as StudyResponse;

        if (!cancelled) {
          setMode(data.mode);
          setQueue(data.cards);
        }
      } catch {
        setQueue([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [deckRef]);

  // 🧠 resume logic
  useLayoutEffect(() => {
    if (loading || queue.length === 0) return;

    const ck = getDeckSessionCheckpoint(deckRef);
    if (!ck) return;

    setResumeGateOpen(true);
    setResumeInitial({ index: ck.index, revealed: ck.revealed });
  }, [loading, queue.length, deckRef]);

  // 🏷 title
  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/flashcards/decks/${deckRef}`);
      const data = await res.json();
      if (data?.deck?.title) {
        setTitle(formatTitleCase(data.deck.title));
      }
    })();
  }, [deckRef]);

  const activeCards: ActiveStudyCard[] = useMemo(
    () =>
      queue.map((c) => {
        const pid = c.pathwayId?.trim() || null;
        const topicSlug = c.subtopic?.trim() || null;
        return {
          id: c.id,
          prompt: c.front,
          answer: c.back,
          explanation: c.explanation,
          examMicroQuestion: c.examMicroQuestion,
          topic: c.topic ?? null,
          subtopic: c.subtopic ?? null,
          sourceKey: c.sourceKey ?? null,
          pathwayId: pid,
          topicSlug,
          lessonHref: c.lessonStudyHref?.trim() ? c.lessonStudyHref : null,
          lessonTitle: c.lessonStudyTitle?.trim() ? c.lessonStudyTitle : null,
          practiceTopicHref: pid && topicSlug ? pathwayHubAppQuestionsHref(pid, topicSlug) : null,
          practiceTestsTopicHref: pid && topicSlug ? buildAppPracticeTestsTopicHref(pid, topicSlug) : null,
        };
      }),
    [queue],
  );

  if (loading) {
    return (
      <BrandedPageLoader message={t("learner.loading.flashcards")} contentClassName="!p-0">
        <FlashcardStudySessionSkeleton withRouteAria={false} />
      </BrandedPageLoader>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--semantic-text-secondary)]">
        {t("flashcards.noCardsMatch")}
      </div>
    );
  }

  // 🟡 RESUME UI (cleaner)
  if (resumeGateOpen) {
    return (
      <div className="mx-auto mt-10 max-w-lg px-4">
        <div className="nn-premium-flashcard-resume-card p-6 sm:p-8">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">
            {t("learner.dailyGoal.resumeHeading")}?
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Continue where you left off or start a new session.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
              style={{
                background: "var(--role-cta, var(--semantic-brand))",
              }}
              onClick={() => {
                setResumeGateOpen(false);
                setSessionKey((k) => k + 1);
              }}
            >
              {t("learner.dailyGoal.resumeHeading")}
            </button>

            <button
              type="button"
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm transition hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-info)_40%,transparent)]"
              onClick={() => {
                clearDeckSessionCheckpoint(deckRef);
                setResumeInitial({ index: 0, revealed: false });
                setResumeGateOpen(false);
                setSessionKey((k) => k + 1);
              }}
            >
              Start fresh
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      {/* header */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/app/flashcards"
          className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
        >
          ← {t("learner.flashcards.hub.title")}
        </Link>

        <div className="flex flex-wrap items-center gap-3">
          <FlashcardSrsStatsStrip className="hidden sm:flex" />
          <div className="max-w-[min(100%,14rem)] truncate text-sm font-semibold text-[var(--semantic-text-primary)] sm:max-w-md">
            {title || t("learner.flashcards.hub.title")}
          </div>
        </div>
      </div>

      {/* session */}
      <ExamSessionShell
        examMode="practice"
        className="nn-premium-flashcard-session-root nn-flashcard-study-premium"
      >
        <ActiveStudySession
          key={sessionKey}
          cards={activeCards}
          header={{
            sessionTitle: title || "Flashcards",
            modeLabel: studyMode === "test" ? "Test" : "Learn",
            categoriesLabel: "",
            exitHref: "/app/flashcards",
          } satisfies ActiveStudyHeader}
          layout="split"
          sessionMode={studyMode}
          initialCardIndex={resumeInitial.index}
          initialRevealed={resumeInitial.revealed}
          onStudyProgress={(s) =>
            saveDeckSessionCheckpoint(deckRef, s.index, s.revealed)
          }
          onSessionComplete={() =>
            clearDeckSessionCheckpoint(deckRef)
          }
        />
      </ExamSessionShell>
    </div>
  );
}