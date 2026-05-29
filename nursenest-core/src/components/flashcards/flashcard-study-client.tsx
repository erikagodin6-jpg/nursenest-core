"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { ActiveStudySession, type ActiveStudyCard, type ActiveStudyHeader } from "@/components/study/active-study-session";
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
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";

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
  title?: string;
  cards: CardPayload[];
  sessionMeta?: {
    requestedCount?: number;
    returnedCount?: number;
    totalAvailable?: number | null;
    hasMore?: boolean;
  };
};

function hasUsableExamQuestion(card: CardPayload): boolean {
  const exam = card.examMicroQuestion;
  return Boolean(
    exam?.questionStem?.trim() &&
      Array.isArray(exam.answerOptions) &&
      exam.answerOptions.length === 4 &&
      !isSataPayload(exam) &&
      !isPlaceholderFlashcardStem(exam.questionStem),
  );
}

function isPlaceholderFlashcardStem(stem: string | null | undefined): boolean {
  const normalized = String(stem ?? "").replace(/\s+/g, " ").trim().toLowerCase();
  return (
    normalized.length < 20 ||
    normalized.includes("which finding or action best reflects the clinical principle being reviewed") ||
    /\b([a-z]+)\s*-\s*\1\b/.test(normalized)
  );
}

function resolveProgramHub(cards: readonly CardPayload[], deckRef: string): { label: string; href: string } {
  const raw = `${cards.find((card) => card.pathwayId)?.pathwayId ?? ""} ${deckRef}`.toLowerCase();
  if (raw.includes("np") || raw.includes("cnple")) return { label: "NP", href: "/canada/np/cnple" };
  if (raw.includes("pn") || raw.includes("rpn") || raw.includes("lpn") || raw.includes("rex-pn")) {
    return { label: "PN", href: "/canada/pn/nclex-pn" };
  }
  return { label: "RN", href: "/canada/rn/nclex-rn" };
}

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
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [sessionMeta, setSessionMeta] = useState<StudyResponse["sessionMeta"] | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resumeGateOpen, setResumeGateOpen] = useState(false);
  const [resumeInitial, setResumeInitial] = useState({ index: 0, revealed: false });
  const [sessionKey, setSessionKey] = useState(0);
  const [retryNonce, setRetryNonce] = useState(0);
  const safeDeckRef = useMemo(() => encodeURIComponent(deckRef), [deckRef]);
  const prefetchedCursors = useRef(new Set<number>());

  // 🚀 fetch cards
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      setLoading(true);
      setLoadError(null);
      prefetchedCursors.current.clear();
      try {
        const res = await fetchWithRetry(`/api/flashcards/decks/${safeDeckRef}/study?instant=1&limit=1&cursor=0`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        }, { attempts: 2, timeoutMs: 12_000 });
        if (!res.ok) {
          throw new Error(`study_http_${res.status}`);
        }
        const data = (await res.json()) as StudyResponse;
        const cardsRaw = Array.isArray(data.cards)
          ? data.cards.filter(
              (card): card is CardPayload =>
                card != null &&
                typeof card.id === "string" &&
                card.id.length > 0 &&
                typeof card.front === "string" &&
                typeof card.back === "string",
            )
          : [];
        const cards = cardsRaw.filter(hasUsableExamQuestion);

        if (!cancelled) {
          setMode(data.mode === "preview" ? "preview" : "subscriber");
          setQueue(cards);
          setSessionMeta(data.sessionMeta);
          if (data.title) setTitle(formatTitleCase(data.title));
        }
      } catch (error) {
        if (controller.signal.aborted || cancelled) return;
        logDedupedClientDiagnostic("flashcard_deck_study", "load_failed", deckRef, {
          deckRef,
          message: error instanceof Error ? error.message : "unknown",
        });
        setQueue([]);
        setLoadError("We could not load this flashcard session. Retry from here or return to the hub.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [deckRef, safeDeckRef, retryNonce]);

  const prefetchMore = useCallback(
    async (loadedCount: number) => {
      if (!sessionMeta?.hasMore) return;
      if (prefetchedCursors.current.has(loadedCount)) return;
      prefetchedCursors.current.add(loadedCount);
      const controller = new AbortController();
      try {
        const res = await fetchWithRetry(`/api/flashcards/decks/${safeDeckRef}/study?instant=1&limit=4&cursor=${loadedCount}`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        }, { attempts: 1, timeoutMs: 10_000 });
        if (!res.ok) return;
        const data = (await res.json()) as StudyResponse;
        const cardsRaw = Array.isArray(data.cards)
          ? data.cards.filter(
              (card): card is CardPayload =>
                card != null &&
                typeof card.id === "string" &&
                card.id.length > 0 &&
                typeof card.front === "string" &&
                typeof card.back === "string",
            )
          : [];
        const cards = cardsRaw.filter(hasUsableExamQuestion);
        setQueue((prev) => {
          const seen = new Set(prev.map((card) => card.id));
          const merged = [...prev];
          for (const card of cards) {
            if (!seen.has(card.id)) merged.push(card);
          }
          return merged;
        });
        setSessionMeta(data.sessionMeta);
      } catch {
        prefetchedCursors.current.delete(loadedCount);
      }
    },
    [safeDeckRef, sessionMeta?.hasMore],
  );

  // 🧠 resume logic
  useLayoutEffect(() => {
    if (loading || queue.length === 0) return;

    const ck = getDeckSessionCheckpoint(deckRef);
    if (!ck) return;

    setResumeGateOpen(true);
    setResumeInitial({ index: Math.min(ck.index, Math.max(0, queue.length - 1)), revealed: ck.revealed });
  }, [loading, queue.length, deckRef]);

  const retryLoad = useCallback(() => {
    setRetryNonce((n) => n + 1);
  }, []);

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
  const programHub = useMemo(() => resolveProgramHub(queue, deckRef), [deckRef, queue]);

  if (loading) {
    return (
      <FlashcardStudySessionSkeleton
        message={t("learner.loading.flashcards")}
        detail="Opening your deck and preparing due cards."
      />
    );
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg space-y-4 px-4 py-16 text-center text-sm text-[var(--semantic-text-secondary)]">
        <p>{loadError}</p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={retryLoad}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2.5 text-sm font-semibold text-white"
          >
            Retry
          </button>
          <Link href="/app/flashcards" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-5 py-2.5 text-sm font-semibold text-[var(--semantic-brand)]">
            Back to Flashcards
          </Link>
        </div>
      </div>
    );
  }

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--semantic-text-secondary)]">
        No NCLEX multiple-choice study cards are available for this deck yet. Return to the hub and start a bank-backed RN/PN/NP set.
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
              {t("learner.flashcards.hub.ctaStart")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="nn-flashcard-study-canvas mx-auto max-w-6xl px-4 py-6">
      {/* header */}
      <div className="nn-flashcard-study-breadcrumb-row mb-5 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => router.push(programHub.href)}
          className="text-sm font-semibold text-[var(--semantic-brand)] underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
        >
          ← Back to {programHub.label} Hub
        </button>

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
            exitHref: programHub.href,
          } satisfies ActiveStudyHeader}
          layout="split"
          sessionMode={studyMode}
          initialCardIndex={resumeInitial.index}
          initialRevealed={resumeInitial.revealed}
          sessionMeta={{
            requestedCount: sessionMeta?.requestedCount,
            returnedCount: queue.length,
            totalAvailable: sessionMeta?.totalAvailable ?? undefined,
            hasMore: Boolean(sessionMeta?.hasMore),
          }}
          onNeedMore={({ loadedCount }) => void prefetchMore(loadedCount)}
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
