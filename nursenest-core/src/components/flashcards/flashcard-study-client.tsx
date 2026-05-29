"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
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
import { logDedupedClientDiagnostic } from "@/lib/runtime/client-diagnostic-log";
import { fetchWithRetry } from "@/lib/runtime/fetch-with-retry";

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

type DeckCardLimit = 10 | 20 | 25 | 50 | "all";

const DECK_CARD_LIMITS: readonly DeckCardLimit[] = [10, 20, 25, 50, "all"];

function parseDeckCardLimit(value: string | null | undefined): DeckCardLimit {
  if (value === "all") return "all";
  const parsed = Number(value);
  return parsed === 10 || parsed === 20 || parsed === 25 || parsed === 50 ? parsed : 25;
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

function deckTitleFromRef(deckRef: string): string {
  const decoded = (() => {
    try {
      return decodeURIComponent(deckRef);
    } catch {
      return deckRef;
    }
  })();
  return formatTitleCase(decoded.replace(/[/_-]+/g, " ").replace(/\s+/g, " ").trim() || "Flashcards");
}

function DeckStudyLauncher({
  deckRef,
  title,
  selectedTopic,
  selectedCardLimit,
  onSelectTopic,
  onSelectCardLimit,
  onStart,
  onReturn,
}: {
  deckRef: string;
  title: string;
  selectedTopic: string;
  selectedCardLimit: DeckCardLimit;
  onSelectTopic: (topic: string) => void;
  onSelectCardLimit: (limit: DeckCardLimit) => void;
  onStart: () => void;
  onReturn: () => void;
}) {
  const deckTopic = title || deckTitleFromRef(deckRef);
  const topics = [
    { id: "all", label: "All systems", detail: "Use every available card in this deck." },
    { id: "deck", label: deckTopic, detail: "Focus this session on the selected deck topic." },
  ];

  return (
    <div className="nn-flashcard-study-canvas nn-flashcard-study-canvas--launcher mx-auto px-4 py-6">
      <div className="nn-flashcard-deck-launcher" data-nn-e2e-flashcard-session-launcher>
        <div className="nn-flashcard-deck-launcher__header">
          <button
            type="button"
            onClick={onReturn}
            className="nn-flashcard-deck-launcher__return"
          >
            Back to Flashcards
          </button>
          <div>
            <p className="nn-flashcard-deck-launcher__eyebrow">Study setup</p>
            <h1>{deckTopic}</h1>
            <p>
              Choose your focus and session size before the cards load. NurseNest will keep the study
              flow lightweight once you begin.
            </p>
          </div>
        </div>

        <div className="nn-flashcard-deck-launcher__grid">
          <section className="nn-flashcard-deck-launcher__section" aria-labelledby="deck-launcher-topic">
            <div className="nn-flashcard-deck-launcher__section-heading">
              <h2 id="deck-launcher-topic">Body system or topic</h2>
              <p>Select a focused deck or keep the session broad.</p>
            </div>
            <div className="nn-flashcard-deck-launcher__topic-grid">
              {topics.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  data-nn-e2e-flashcard-launcher-topic={topic.id}
                  data-selected={selectedTopic === topic.id}
                  aria-pressed={selectedTopic === topic.id}
                  className="nn-flashcard-deck-launcher__topic"
                  onClick={() => onSelectTopic(topic.id)}
                >
                  <span>{topic.label}</span>
                  <small>{topic.detail}</small>
                </button>
              ))}
            </div>
          </section>

          <section className="nn-flashcard-deck-launcher__section" aria-labelledby="deck-launcher-count">
            <div className="nn-flashcard-deck-launcher__section-heading">
              <h2 id="deck-launcher-count">Number of cards</h2>
              <p>Pick a quick review or a deeper focused session.</p>
            </div>
            <div className="nn-flashcard-deck-launcher__count-grid" role="group" aria-label="Number of cards">
              {DECK_CARD_LIMITS.map((limit) => {
                const selected = selectedCardLimit === limit;
                return (
                  <button
                    key={String(limit)}
                    type="button"
                    data-nn-e2e-session-size-preset={String(limit)}
                    data-selected={selected}
                    aria-pressed={selected}
                    className="nn-flashcard-deck-launcher__count"
                    onClick={() => onSelectCardLimit(limit)}
                  >
                    {limit === "all" ? "Full review" : limit}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        <div className="nn-flashcard-deck-launcher__footer">
          <p>
            Starts with {selectedCardLimit === "all" ? "the full deck" : `${selectedCardLimit} cards`} · {selectedTopic === "all" ? "All systems" : deckTopic}
          </p>
          <button
            type="button"
            className="nn-flashcard-deck-launcher__start"
            data-nn-e2e-flashcard-launcher-start
            onClick={onStart}
          >
            Start study session
          </button>
        </div>
      </div>
    </div>
  );
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
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [mode, setMode] = useState<"preview" | "subscriber" | null>(null);
  const [queue, setQueue] = useState<CardPayload[]>([]);
  const [sessionMeta, setSessionMeta] = useState<StudyResponse["sessionMeta"] | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [resumeGateOpen, setResumeGateOpen] = useState(false);
  const [resumeInitial, setResumeInitial] = useState({ index: 0, revealed: false });
  const [sessionKey, setSessionKey] = useState(0);
  const [retryNonce, setRetryNonce] = useState(0);
  const [launcherConfirmed, setLauncherConfirmed] = useState(() => searchParams.get("configured") === "1");
  const [hasResumeCheckpoint, setHasResumeCheckpoint] = useState(() => Boolean(getDeckSessionCheckpoint(deckRef)));
  const [selectedTopic, setSelectedTopic] = useState(() => searchParams.get("focus") || "all");
  const [selectedCardLimit, setSelectedCardLimit] = useState<DeckCardLimit>(() => parseDeckCardLimit(searchParams.get("cardLimit")));
  const safeDeckRef = useMemo(() => encodeURIComponent(deckRef), [deckRef]);
  const prefetchedCursors = useRef(new Set<number>());

  useEffect(() => {
    const checkpoint = getDeckSessionCheckpoint(deckRef);
    setHasResumeCheckpoint(Boolean(checkpoint));
  }, [deckRef]);

  // 🚀 fetch cards
  useEffect(() => {
    const shouldFetch = launcherConfirmed || hasResumeCheckpoint;
    if (!shouldFetch) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    const controller = new AbortController();
    const initialLimit = selectedCardLimit === "all" ? 10 : Math.min(selectedCardLimit, 10);

    (async () => {
      setLoading(true);
      setLoadError(null);
      prefetchedCursors.current.clear();
      try {
        const res = await fetchWithRetry(`/api/flashcards/decks/${safeDeckRef}/study?instant=1&limit=${initialLimit}&cursor=0`, {
          credentials: "include",
          cache: "no-store",
          signal: controller.signal,
        }, { attempts: 2, timeoutMs: 8_000 });
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
        const cards = cardsRaw.filter((card) => !isPlaceholderFlashcardStem(card.examMicroQuestion?.questionStem));

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
  }, [deckRef, hasResumeCheckpoint, launcherConfirmed, retryNonce, safeDeckRef, selectedCardLimit]);

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
        }, { attempts: 1, timeoutMs: 6_000 });
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
        const cards = cardsRaw.filter((card) => !isPlaceholderFlashcardStem(card.examMicroQuestion?.questionStem));
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
    setLauncherConfirmed(true);
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
  const launcherTitle = title || deckTitleFromRef(deckRef);

  if (!launcherConfirmed && !hasResumeCheckpoint) {
    return (
      <DeckStudyLauncher
        deckRef={deckRef}
        title={launcherTitle}
        selectedTopic={selectedTopic}
        selectedCardLimit={selectedCardLimit}
        onSelectTopic={setSelectedTopic}
        onSelectCardLimit={setSelectedCardLimit}
        onReturn={() => router.push("/app/flashcards")}
        onStart={() => {
          setQueue([]);
          setSessionMeta(undefined);
          setLoadError(null);
          setLoading(true);
          setLauncherConfirmed(true);
          setSessionKey((k) => k + 1);
        }}
      />
    );
  }

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
        No study cards are available for this deck yet. Return to the hub and choose another deck or pathway.
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
                setLauncherConfirmed(true);
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
                setHasResumeCheckpoint(false);
                setLauncherConfirmed(true);
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
    <div className="nn-flashcard-study-canvas mx-auto px-4 py-6">
      <ExamSessionShell
        examMode="practice"
        className="nn-premium-flashcard-session-root nn-flashcard-study-premium"
      >
        <ActiveStudySession
          key={sessionKey}
          cards={activeCards}
          header={{
            sessionTitle: title || "Flashcards",
            modeLabel: studyMode === "test" ? "Test Mode" : "Focused Study Mode",
            categoriesLabel: selectedTopic === "all" ? "All systems" : launcherTitle,
            exitHref: programHub.href,
          } satisfies ActiveStudyHeader}
          layout="split"
          sessionMode={studyMode}
          initialCardIndex={resumeInitial.index}
          initialRevealed={resumeInitial.revealed}
          sessionMeta={{
            requestedCount: selectedCardLimit === "all" ? sessionMeta?.requestedCount : selectedCardLimit,
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
