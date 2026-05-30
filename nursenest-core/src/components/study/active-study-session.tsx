"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import {
  ArrowLeft,
  BarChart3,
  Bookmark,
  ChevronRight,
  ChevronsRight,
  CheckCircle2,
  Clock3,
  Home,
  Keyboard,
  Pause,
  Play,
  RefreshCw,
  Target,
} from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getStudyItemState, setStudyItemState } from "@/lib/flashcards/study-session-persistence";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { DecorativeThemeWatermark } from "@/components/brand/decorative-theme-watermark";
import { SuccessLeaf } from "@/components/ui/success-leaf";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";
import { ExamMeasurementUnitToggle } from "@/components/measurements/exam-measurement-unit-toggle";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { resolveMeasurementSystemForLearnerPathway } from "@/lib/measurements/measurement-system";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { useFlashcardStudyTelemetry, deriveCardFlags } from "@/lib/flashcards/use-flashcard-study-telemetry";
import type { CardEventMeta } from "@/lib/flashcards/use-flashcard-study-telemetry";
import {
  CANONICAL_LEARNER_SURFACE_VERSION,
  type UnifiedExamWorkspaceMode,
} from "@/lib/exam-workspace/unified-exam-workspace";
import { resolveTierPedagogyProfile } from "@/lib/nursing-tiers/tier-pedagogy-profile";
import { MobileFlashcardFlow } from "@/components/study/mobile-flashcard-flow";
import { CommunityPerformancePanel } from "@/components/flashcards/community-performance-panel";
import { AdaptiveRemediationPanel } from "@/components/flashcards/adaptive-remediation-panel";
import { WeakAreaRecoveryBanner, updateTopicPerformance, detectWeakTopics, type TopicPerformanceMap } from "@/components/flashcards/weak-area-recovery-banner";
import { MasteryMoment, updateMasteryStreak, detectMasteredTopics, type MasteryStreakMap } from "@/components/flashcards/mastery-moment";
import type { WeakAreaPlan } from "@/lib/flashcards/flashcard-ecosystem-resolver";
import { buildRelatedLearningPlan, buildWeakTopicRemediationPlan } from "@/lib/flashcards/related-learning-engine";
import {
  buildLearningInsights,
  buildRecommendedNextSteps,
  calculateConfidenceAccuracyGap,
  calculateLearnerReadinessIndex,
  summarizeStudyStreak,
  type FlashcardLearningSignal,
} from "@/lib/flashcards/learning-insight-engine";

/* ================= TYPES ================= */

export type ActiveStudyCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
  examMicroQuestion?: ExamMicroQuestionPayload | null;
  topic?: string | null;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  topicSlug?: string | null;
  distractors?: Array<{ option: string; rationale: string }>;
  /** Deep link to the pathway lesson this card was synthesized from (custom session). */
  lessonHref?: string | null;
  lessonTitle?: string | null;
  /** When the hub URL includes a topic filter, link to the matching bank drill (pathway-scoped). */
  practiceTopicHref?: string | null;
  /** Practice-tests hub for the same pathway + catalog topic slug (never cross-tier). */
  practiceTestsTopicHref?: string | null;
  /** HTTPS clinical image from exam bank — omit when absent (no placeholder chrome). */
  clinicalImageUrl?: string | null;
};

export type ActiveStudyHeader = {
  sessionTitle: string;
  modeLabel: string;
  categoriesLabel: string;
  exitHref: string;
  /** Tier hub label for merged topbar return link, e.g. "RN Hub". */
  hubLabel?: string;
};

type Props = {
  cards: ActiveStudyCard[];
  header: ActiveStudyHeader;
  loading?: boolean;
  onRate?: (cardId: string, rating: "again" | "hard" | "good" | "easy") => Promise<void>;
  onExit?: () => void;
  sessionMeta?: {
    requestedCount?: number;
    returnedCount?: number;
    totalAvailable?: number;
    hasMore?: boolean;
  };
  layout?: "split" | "card";
  sessionMode?: "learn" | "test";
  initialCardIndex?: number;
  initialRevealed?: boolean;
  onStudyProgress?: (state: { index: number; revealed: boolean }) => void;
  onNeedMore?: (state: { loadedCount: number; index: number }) => void;
  onSessionComplete?: () => void;
  onSessionRestart?: () => void;
  /** Local-only star / review flags (localStorage) for flashcard-style sessions. */
  enableLocalStudyPins?: boolean;
};

/* ================= HELPERS ================= */

function isValidCard(c: unknown): c is ActiveStudyCard {
  if (!c || typeof c !== "object") return false;
  const card = c as Record<string, unknown>;
  return (
    typeof card.id === "string" &&
    card.id.trim().length > 0 &&
    typeof card.prompt === "string" &&
    typeof card.answer === "string"
  );
}

function dedupeCardsById(cards: ActiveStudyCard[]): ActiveStudyCard[] {
  const seen = new Set<string>();
  return cards.filter((c) => {
    if (!isValidCard(c) || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
}

function resolveExamPathwayLabel(pathwayId: string | null): string {
  if (!pathwayId) return "NCLEX";
  if (/rex|rpn/.test(pathwayId)) return "REx-PN";
  if (/cnple|np/.test(pathwayId)) return "CNPLE";
  return "NCLEX";
}

function buildClinicalPearl(card: ActiveStudyCard, fallback: string): string {
  const src =
    card.examMicroQuestion?.rationaleCorrect ||
    card.explanation ||
    card.answer ||
    "";

  const first = src.split(".").map((s) => s.trim()).find(Boolean);
  return first ? (first.endsWith(".") ? first : `${first}.`) : fallback;
}

function formatElapsed(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

function formatTopicLine(card: ActiveStudyCard): string | null {
  const a = card.topic?.trim() || "";
  const b = card.subtopic?.trim() || "";
  if (a && b) return `${a} · ${b}`;
  if (a) return a;
  if (b) return b;
  return null;
}

function buildCardMeta(card: ActiveStudyCard): CardEventMeta {
  const exam = card.examMicroQuestion;
  const sata = isSataPayload(exam);
  const questionType = sata ? "SATA" : exam ? "MCQ" : "plain";
  const flags = deriveCardFlags({
    topic: card.topic,
    questionStem: exam?.questionStem,
    sourceKey: card.sourceKey,
  });
  return {
    itemKind: exam?.itemKind ?? null,
    questionType,
    topic: card.topic ?? null,
    domain: card.subtopic ?? null,
    ...flags,
  };
}

/* ================= COMPONENT ================= */

export function ActiveStudySession({
  cards,
  header,
  loading = false,
  onRate,
  onExit,
  sessionMeta,
  layout = "split",
  initialCardIndex = 0,
  initialRevealed = false,
  onStudyProgress,
  onNeedMore,
  onSessionComplete,
  onSessionRestart,
}: Props) {
  const { t } = useMarketingI18n();
  const [, bumpPins] = useReducer((x: number) => x + 1, 0);

  const deduped = useMemo(() => {
    const result = dedupeCardsById(cards);
    if (process.env.NODE_ENV === "development" && result.length < cards.length) {
      console.warn("[active-study-session] dropped cards: invalid or duplicate", {
        total: cards.length,
        kept: result.length,
      });
    }
    return result;
  }, [cards]);
  const sessionPathwayIdEarly = useMemo(
    () => deduped.find((c) => c.pathwayId)?.pathwayId ?? null,
    [deduped],
  );
  const fallbackMeasurementSystem = useMemo(() => {
    const pid = sessionPathwayIdEarly;
    if (!pid) return "US" as const;
    const pathway = getExamPathwayById(pid);
    const countryMap = pathway
      ? { [pid]: String(pathway.countryCode) }
      : undefined;
    return resolveMeasurementSystemForLearnerPathway(pid, countryMap);
  }, [sessionPathwayIdEarly]);
  const tierPedagogyProfile = useMemo(() => {
    const pathway = sessionPathwayIdEarly ? getExamPathwayById(sessionPathwayIdEarly) : undefined;
    return resolveTierPedagogyProfile({
      roleTrack: pathway?.roleTrack,
      stripeTier: pathway?.stripeTier,
    });
  }, [sessionPathwayIdEarly]);
  const { measurementSystem } = useMeasurementPreference(fallbackMeasurementSystem, null, { locked: true });

  const [sessionCards, setSessionCards] = useState(deduped);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [ratingTally, setRatingTally] = useState({ again: 0, hard: 0, good: 0, easy: 0 });
  const [hintOpen, setHintOpen] = useState(false);
  const [confidence, setConfidence] = useState<1 | 2 | 3 | 4 | 5 | null>(null);
  const lastCardsSignature = useRef<string>("");

  // Adaptive ecosystem 3.0 — session-level topic tracking
  const [topicPerf, setTopicPerf] = useState<TopicPerformanceMap>(new Map());
  const [masteryStreaks, setMasteryStreaks] = useState<MasteryStreakMap>(new Map());
  const [weakAreaDismissed, setWeakAreaDismissed] = useState<Set<string>>(new Set());
  const [masteryTopic, setMasteryTopic] = useState<string | null>(null);
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState<boolean | null>(null);
  const [learningSignals, setLearningSignals] = useState<FlashcardLearningSignal[]>([]);

  const current = sessionCards[index] ?? null;
  const pinState = current?.id ? getStudyItemState(current.id) : {};

  // Derive stable session-level pathwayId from the first card with one.
  // This avoids recreating telemetry callbacks on every card change.
  const sessionPathwayId = useMemo(
    () => sessionCards.find((c) => c.pathwayId)?.pathwayId ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionCards.length],
  );
  const telemetry = useFlashcardStudyTelemetry({ pathwayId: sessionPathwayId });

  useEffect(() => {
    const nextSignature = deduped.map((card) => card.id).join("|");
    setSessionCards((prev) => {
      const previousSignature = lastCardsSignature.current;
      const appended =
        prev.length > 0 &&
        deduped.length >= prev.length &&
        deduped.slice(0, prev.length).every((card, i) => card.id === prev[i]?.id);
      lastCardsSignature.current = nextSignature;
      if (appended && nextSignature !== previousSignature) {
        return deduped;
      }
      setIndex(initialCardIndex);
      const initialCard = deduped[initialCardIndex] ?? null;
      setRevealed(Boolean(initialRevealed && !initialCard?.examMicroQuestion));
      setCompleted(false);
      setIsPaused(false);
      setElapsed(0);
      setRatingTally({ again: 0, hard: 0, good: 0, easy: 0 });
      setConfidence(null);
      return deduped;
    });
  }, [deduped, initialCardIndex, initialRevealed]);

  // Track dwell time from card front shown → reveal. Fires on mount (card 0) and each card advance.
  const currentId = current?.id ?? null;
  useEffect(() => {
    if (!currentId) return;
    telemetry.onCardShown();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentId]);

  useEffect(() => {
    onStudyProgress?.({ index, revealed });
  }, [index, onStudyProgress, revealed]);

  useEffect(() => {
    if (!sessionMeta?.hasMore) return;
    if (sessionCards.length - index <= 2) {
      onNeedMore?.({ loadedCount: sessionCards.length, index });
    }
  }, [index, onNeedMore, sessionCards.length, sessionMeta?.hasMore]);

  useEffect(() => {
    setHintOpen(false);
    setConfidence(null);
    setLastAnswerCorrect(null);
  }, [currentId]);

  useEffect(() => {
    if (completed || isPaused) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [completed, isPaused]);

  const submitRating = useCallback(
    async (rating: "again" | "hard" | "good" | "easy") => {
      const card = sessionCards[index];
      if (!card) return;
      setSaving(true);

      setRatingTally((t) => ({ ...t, [rating]: t[rating] + 1 }));
      telemetry.onRated(card.id, rating, buildCardMeta(card));

      // Track topic performance for weak area + mastery detection
      const isCorrect = lastAnswerCorrect ?? (rating === "good" || rating === "easy");
      setLastAnswerCorrect(isCorrect);
      setLearningSignals((prev) => [
        ...prev.slice(-24),
        {
          cardId: card.id,
          topic: card.topic,
          subtopic: card.subtopic,
          isCorrect,
          confidence,
          rating,
          timestamp: Date.now(),
        },
      ]);
      if (card.topic) {
        setTopicPerf((prev) => updateTopicPerformance(prev, card.topic, isCorrect));
        setMasteryStreaks((prev) => {
          const next = updateMasteryStreak(prev, card.topic, isCorrect);
          const mastered = detectMasteredTopics(next, 5);
          if (mastered.includes(card.topic ?? "") && !masteryTopic) {
            setMasteryTopic(card.topic ?? null);
          }
          return next;
        });
      }

      await onRate?.(card.id, rating);

      if (index >= sessionCards.length - 1 && sessionMeta?.hasMore) {
        onNeedMore?.({ loadedCount: sessionCards.length, index });
      } else if (index >= sessionCards.length - 1) {
        setCompleted(true);
        onSessionComplete?.();
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }

      setSaving(false);
    },
    [confidence, index, lastAnswerCorrect, masteryTopic, onNeedMore, onRate, onSessionComplete, sessionCards, sessionMeta?.hasMore, telemetry],
  );

  const goPrevious = useCallback(() => {
    setRevealed(false);
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    if (index >= sessionCards.length - 1) {
      setCompleted(true);
      onSessionComplete?.();
      return;
    }
    setRevealed(false);
    setIndex((i) => Math.min(sessionCards.length - 1, i + 1));
  }, [index, onSessionComplete, sessionCards.length]);

  const finishSession = useCallback(() => {
    setCompleted(true);
    onSessionComplete?.();
  }, [onSessionComplete]);

  const toggleMarked = useCallback(() => {
    if (!current?.id) return;
    setStudyItemState(current.id, { starred: !pinState.starred });
    bumpPins();
  }, [current?.id, pinState.starred]);

  const rateConfidence = useCallback(
    (score: 1 | 2 | 3 | 4 | 5) => {
      setConfidence(score);
    },
    [],
  );

  // Keyboard shortcuts — declared unconditionally (Rules of Hooks).
  // Guards inside prevent execution when the session is in a non-interactive state.
  useEffect(() => {
    if (loading || !current || completed) return;

    function onKeyDown(e: KeyboardEvent) {
      const el = e.target as HTMLElement | null;
      if (el?.closest("input, textarea, select, [contenteditable=true]")) return;

      if ((e.key === " " || e.key === "Enter") && !revealed && !current.examMicroQuestion) {
        e.preventDefault();
        setRevealed(true);
        if (current.id) telemetry.onReveal(current.id, buildCardMeta(current));
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setRevealed(false);
        setIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        if (!revealed) return;
        e.preventDefault();
        setRevealed(false);
        setIndex((i) => Math.min(sessionCards.length - 1, i + 1));
        return;
      }
      if (revealed && !saving && ["1", "2", "3", "4"].includes(e.key)) {
        e.preventDefault();
        const ratingMap = { "1": "again", "2": "hard", "3": "good", "4": "easy" } as const;
        void submitRating(ratingMap[e.key as "1" | "2" | "3" | "4"]);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [completed, current, loading, revealed, saving, sessionCards.length, submitRating, telemetry]);

  const adaptiveStudyStreak = summarizeStudyStreak(learningSignals);
  const adaptiveLearningInsights = buildLearningInsights(learningSignals);
  const adaptiveConfidenceGap = calculateConfidenceAccuracyGap(learningSignals);
  const adaptiveReadinessIndex = calculateLearnerReadinessIndex(learningSignals);
  const adaptiveNextSteps = buildRecommendedNextSteps(learningSignals);

  if (loading) {
    return (
      <FlashcardStudySessionSkeleton
        message={t("learner.loading.flashcards")}
        detail="Preparing the card, rationale, and confidence controls."
      />
    );
  }

  if (!current) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 text-sm text-[var(--semantic-text-secondary)]">
        {t("flashcards.noCardsMatch")}
      </div>
    );
  }

  if (!isValidCard(current)) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-6 text-sm text-[var(--semantic-text-secondary)]">
        {t("flashcards.noCardsMatch")}
      </div>
    );
  }

  if (completed) {
    return (
      <div className="nn-premium-flashcard-completion mx-auto flex max-w-lg flex-col items-center gap-5 px-6 py-10 text-center sm:px-8">
        <SuccessLeaf show size={40} />
        <div>
          <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">{t("flashcards.sessionComplete")}</h2>
          <p className="mt-2 text-sm text-[var(--semantic-text-secondary)]">{t("flashcards.sessionProgress")}</p>
        </div>
        {adaptiveStudyStreak.reviewed > 0 ? (
          <div className="w-full rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-left shadow-[var(--semantic-shadow-soft)]">
            <span className="text-xs font-bold uppercase tracking-wide text-[var(--semantic-text-muted)]">
              Recommended next step
            </span>
            <p className="mt-1 text-sm font-semibold text-[var(--semantic-text-primary)]">{adaptiveNextSteps[0]}</p>
            <p className="mt-2 text-xs text-[var(--semantic-text-secondary)]">
              Session summary: {adaptiveStudyStreak.reviewed} reviewed · {adaptiveStudyStreak.mastered} mastered · {adaptiveStudyStreak.needsReview} needs review · {adaptiveReadinessIndex.level}
            </p>
          </div>
        ) : null}
        <div className="flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:justify-center">
          <button
            type="button"
            className="inline-flex min-h-11 min-w-[11rem] items-center justify-center gap-2 rounded-full px-6 py-2.5 text-sm font-semibold nn-text-on-solid-fill shadow-md transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
            }}
            onClick={() => {
              onSessionRestart?.();
              setIndex(0);
              setCompleted(false);
            }}
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            {t("flashcards.newSession")}
          </button>
          <Link
            href={header.exitHref}
            className="nn-premium-flashcard-nav-btn !min-h-11 !justify-center !no-underline px-6"
            onClick={onExit}
          >
            <Home className="h-4 w-4" aria-hidden />
            {t("flashcards.backToMyCards")}
          </Link>
        </div>
      </div>
    );
  }

  const remainingCards = Math.max(0, sessionCards.length - index - 1);
  const ratedSession = ratingTally.again + ratingTally.hard + ratingTally.good + ratingTally.easy;
  const focusLabel = header.categoriesLabel?.trim() || formatTopicLine(current) || "Adaptive review";
  const displayExam = current.examMicroQuestion ?? null;
  const displayPrompt = resolveMeasurementTokens(displayExam?.questionStem ?? current.prompt, measurementSystem);
  const displayExplanation = resolveMeasurementTokens(
    current.explanation ?? displayExam?.rationaleCorrect ?? "",
    measurementSystem,
  );

  // Adaptive ecosystem 3.0 — ecosystem plan for current card
  const ecosystemPlan = buildRelatedLearningPlan({
    cardId: current.id,
    topic: current.topic ?? null,
    subtopic: current.subtopic ?? null,
    pathwayId: sessionPathwayId,
    lessonHref: current.lessonHref,
    lessonTitle: current.lessonTitle,
    practiceTopicHref: current.practiceTopicHref,
    practiceTestsTopicHref: current.practiceTestsTopicHref,
    isIncorrect: lastAnswerCorrect === false,
  });

  const weakTopics = detectWeakTopics(topicPerf);
  const activeWeakTopics = weakTopics.filter((w) => !weakAreaDismissed.has(w.topic));
  const weakAreaPlans = new Map<string, WeakAreaPlan>(
    activeWeakTopics.map((w) => [
      w.topic,
      buildWeakTopicRemediationPlan({
        topic: w.topic,
        missCount: w.total - w.correct,
        totalCount: w.total,
        pathwayId: sessionPathwayId,
        lessonHref: current.topic === w.topic ? current.lessonHref : undefined,
        practiceTopicHref: current.topic === w.topic ? current.practiceTopicHref : undefined,
        practiceTestsTopicHref: current.topic === w.topic ? current.practiceTestsTopicHref : undefined,
      }),
    ]),
  );
  const studyStreak = adaptiveStudyStreak;
  const learningInsights = adaptiveLearningInsights;
  const confidenceGap = adaptiveConfidenceGap;
  const readinessIndex = adaptiveReadinessIndex;
  const nextSteps = adaptiveNextSteps;

  return (
    <div
      className="nn-active-flashcard-session nn-unified-exam-workspace relative space-y-3"
      data-nn-premium-flashcard-active-session
      data-nn-flashcard-branding-revamp=""
      data-nn-flashcard-layout-refinement=""
      data-nn-flashcard-study-session=""
      data-nn-canonical-learner-surface={CANONICAL_LEARNER_SURFACE_VERSION}
      data-nn-pedagogy-tier={tierPedagogyProfile.tier}
      data-nn-unified-exam-workspace=""
      data-nn-exam-workspace-mode={"flashcards" satisfies UnifiedExamWorkspaceMode}
    >
      {/* ── ADAPTIVE ECOSYSTEM OVERLAYS ─────────────────────────── */}
      {masteryTopic ? (
        <div className="absolute inset-x-3 top-14 z-40 sm:inset-x-6 sm:top-16">
          <MasteryMoment
            topic={masteryTopic}
            streakCount={masteryStreaks.get(masteryTopic) ?? 5}
            onDismiss={() => setMasteryTopic(null)}
          />
        </div>
      ) : null}
      {activeWeakTopics.length > 0 && revealed ? (
        <div className="absolute inset-x-3 bottom-20 z-30 sm:inset-x-6 sm:bottom-24">
          <WeakAreaRecoveryBanner
            weakTopics={activeWeakTopics}
            plans={weakAreaPlans}
            onDismiss={() => setWeakAreaDismissed((prev) => new Set([...prev, activeWeakTopics[0]?.topic ?? ""]))}
          />
        </div>
      ) : null}

      {/* ── MOBILE FLOW (sm and below only) ──────────────────────── */}
      <div className="flex flex-col flex-1 min-h-0 overflow-hidden sm:hidden">
        <MobileFlashcardFlow
          card={current}
          cardIndex={index}
          totalCards={sessionCards.length}
          elapsed={elapsed}
          saving={saving}
          examPathwayLabel={resolveExamPathwayLabel(sessionPathwayId)}
          pathwayId={sessionPathwayId}
          onAnswerSubmitted={(isCorrect) => {
            setRevealed(true);
            setLastAnswerCorrect(isCorrect);
            if (current?.id) telemetry.onReveal(current.id, buildCardMeta(current));
          }}
          onRevealComplete={() => {
            if (index >= sessionCards.length - 1) {
              setCompleted(true);
              onSessionComplete?.();
            } else {
              setIndex((i) => i + 1);
              setRevealed(false);
              setLastAnswerCorrect(null);
            }
          }}
          onRate={async (rating) => {
            const isCorrect = rating === "good" || rating === "easy";
            await onRate?.(current.id, rating);
            setRatingTally((t) => ({ ...t, [rating]: t[rating] + 1 }));
            telemetry.onRated(current.id, rating, buildCardMeta(current));
            setLearningSignals((prev) => [
              ...prev.slice(-24),
              {
                cardId: current.id,
                topic: current.topic,
                subtopic: current.subtopic,
                isCorrect,
                rating,
                timestamp: Date.now(),
              },
            ]);
            if (current.topic) {
              setTopicPerf((prev) => updateTopicPerformance(prev, current.topic, isCorrect));
              setMasteryStreaks((prev) => {
                const next = updateMasteryStreak(prev, current.topic, isCorrect);
                const mastered = detectMasteredTopics(next, 5);
                if (mastered.includes(current.topic ?? "") && !masteryTopic) {
                  setMasteryTopic(current.topic ?? null);
                }
                return next;
              });
            }
          }}
        />
      </div>

      {/* ── DESKTOP / TABLET LAYOUT (sm and above only) ─────────── */}
      <div className="hidden sm:contents">

      <DecorativeThemeWatermark
        position="top-right"
        size={300}
        opacity="opacity-[0.03]"
        className="hidden sm:block"
      />
      <DecorativeThemeWatermark
        position="bottom-left"
        size={220}
        opacity="opacity-[0.02]"
        className="hidden md:block"
      />
      <div className="nn-flashcard-learning-topbar" aria-label="Flashcard session">
        <div className="nn-flashcard-topbar-left min-w-0 flex-1">
          <Link href={header.exitHref} className="nn-flashcard-return-link" onClick={onExit}>
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
            Return to {header.hubLabel ?? "Hub"}
          </Link>
          <span className="nn-flashcard-topbar-sep" aria-hidden />
          <span className="nn-flashcard-chip nn-flashcard-chip--mode">{header.modeLabel}</span>
          <span className="nn-flashcard-topbar-focus-note max-w-[min(100%,12rem)] truncate">
            Focused study · distractions reduced
          </span>
        </div>

        <div className="nn-flashcard-learning-topbar__meta">
          <div className="nn-flashcard-topbar-progress">
            <span className="nn-flashcard-topbar-stat-label">
              <BarChart3 className="h-3.5 w-3.5" aria-hidden />
              Progress
            </span>
            <strong>{index + 1} <span className="font-normal opacity-60">of</span> {sessionCards.length}</strong>
            <div
              className="nn-flashcard-topbar-progress-track"
              role="progressbar"
              aria-valuenow={index + 1}
              aria-valuemin={1}
              aria-valuemax={sessionCards.length}
              aria-label={`Card ${index + 1} of ${sessionCards.length}`}
            >
              <div
                className="nn-flashcard-topbar-progress-fill"
                style={{ width: `${((index + 1) / Math.max(1, sessionCards.length)) * 100}%` }}
              />
            </div>
          </div>
          <div className="max-sm:hidden">
            <span className="nn-flashcard-topbar-stat-label">
              <Target className="h-3.5 w-3.5" aria-hidden />
              Focus
            </span>
            <strong>{focusLabel}</strong>
          </div>
          <div>
            <span className="nn-flashcard-topbar-stat-label">
              <Clock3 className="h-3.5 w-3.5" aria-hidden />
              Elapsed
            </span>
            <strong className="font-mono">{formatElapsed(elapsed)}</strong>
          </div>
          <ExamMeasurementUnitToggle fallbackSystem={fallbackMeasurementSystem} locked className="nn-flashcard-measurement-toggle" />
          <button
            type="button"
            className="nn-flashcard-shell-action"
            onClick={() => setIsPaused((p) => !p)}
          >
            {isPaused ? <Play className="h-4 w-4" aria-hidden /> : <Pause className="h-4 w-4" aria-hidden />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button type="button" className="nn-flashcard-shell-action nn-flashcard-shell-action--primary" onClick={finishSession}>
            Finish
          </button>
        </div>
      </div>

      {/* MAIN CARD */}
      <FlashcardStudyQuestionStack
        examPathwayLabel={resolveExamPathwayLabel(sessionPathwayId)}
        topicLine={formatTopicLine(current)}
        examMicroQuestion={displayExam}
        clinicalImageUrl={current.clinicalImageUrl?.trim() || null}
        prompt={displayPrompt}
        answer={resolveMeasurementTokens(current.answer, measurementSystem)}
        explanation={displayExplanation}
        pearl={buildClinicalPearl(current, "No clinical pearl available.")}
        revealed={revealed}
        onReveal={() => {
          setRevealed(true);
          if (current?.id) telemetry.onReveal(current.id, buildCardMeta(current));
        }}
        onAnswerSubmitted={(letter, isCorrect) => {
          if (!current?.id) return;
          setLastAnswerCorrect(isCorrect);
          const meta = buildCardMeta(current);
          telemetry.onAnswerSubmitted(current.id, {
            selectedLetter: letter,
            correctLetter: displayExam && !isSataPayload(displayExam)
              ? displayExam.correctLetter
              : undefined,
            isCorrect,
            meta,
          });
        }}
        onRationaleOpened={() => {
          if (!current?.id) return;
          telemetry.onRationaleOpened(current.id, buildCardMeta(current));
        }}
        onSataReveal={(selectedLetters, correctLetters) => {
          if (!current?.id) return;
          const allCorrectSelected =
            correctLetters.length > 0 &&
            correctLetters.every((l) => selectedLetters.includes(l)) &&
            selectedLetters.every((l) => correctLetters.includes(l));
          setLastAnswerCorrect(allCorrectSelected);
          telemetry.onAnswerSubmitted(current.id, {
            selectedLetters,
            correctLetters,
            isCorrect: allCorrectSelected,
            meta: buildCardMeta(current),
          });
        }}
        labels={{
          revealHint: undefined,
          answerHeading: t("flashcards.answer"),
          whyCorrectHeading: t("flashcards.rationale"),
          whyIncorrectHeading: t("pages.flashcards.whyOtherOptionsAreIncorrect"),
          takeawayHeading: t("pages.flashcards.pearl"),
          answerChoicesHeading: "Answer choices",
        }}
        questionLabel={undefined}
        marked={Boolean(pinState.starred)}
        onToggleMark={toggleMarked}
        onAdvance={goNext}
        revealLinksSection={revealed ? (
          <div className="space-y-3" data-testid="flashcard-ecosystem-links">
            <CommunityPerformancePanel
              flashcardId={current.id}
              revealed={revealed}
              correctLetter={displayExam && !isSataPayload(displayExam) ? displayExam.correctLetter : undefined}
            />
            <AdaptiveRemediationPanel
              plan={ecosystemPlan}
              isIncorrect={lastAnswerCorrect === false}
              topic={current.topic}
            />
          </div>
        ) : null}
        mainFooter={(
          <>
            <div className="nn-flashcard-study-support-strip" data-nn-flashcard-support-strip>
              <div>
                <span className="font-semibold text-[var(--semantic-text-primary)]">Coach</span>
                <span className="text-[var(--semantic-text-secondary)]">
                  {revealed
                    ? `${ratedSession} confidence rating${ratedSession === 1 ? "" : "s"} logged · ${remainingCards} remaining`
                    : "Think: what finding changes risk fastest, and why would the wrong options distract you?"}
                </span>
              </div>
              <div className="hidden items-center gap-2 text-[11px] text-[var(--semantic-text-muted)] sm:flex">
                <Keyboard className="h-3.5 w-3.5" aria-hidden />
                <span><kbd className="nn-flashcard-kbd">1</kbd> Need repetition</span>
                <span><kbd className="nn-flashcard-kbd">2</kbd> Unsure</span>
                <span><kbd className="nn-flashcard-kbd">3</kbd> Got it</span>
              </div>
            </div>

            <div className="nn-flashcard-coach-panel">
              {studyStreak.reviewed > 0 ? (
                <div className="nn-flashcard-coach-panel__section nn-flashcard-coach-panel__section--insight">
                  <span>Today</span>
                  <p>
                    {studyStreak.reviewed} reviewed · {studyStreak.mastered} mastered · {studyStreak.improving} improving · {studyStreak.needsReview} needs review
                  </p>
                </div>
              ) : null}
              <div className="nn-flashcard-coach-panel__section">
                <span>Hint</span>
                {hintOpen ? (
                  <p>{formatTopicLine(current) ? `Connect this to ${formatTopicLine(current)}.` : "Look for the safest clinical priority before choosing."}</p>
                ) : (
                  <button type="button" className="nn-flashcard-hint-reveal" onClick={() => setHintOpen(true)}>
                    Reveal hint
                  </button>
                )}
              </div>
              <div className="nn-flashcard-coach-panel__section">
                <span>Why This Matters</span>
                <p>{buildClinicalPearl(current, "This concept connects recall to clinical judgment.")}</p>
              </div>
              <div className="nn-flashcard-coach-panel__section">
                <span>Related Lesson</span>
                {current.lessonHref ? (
                  <Link href={current.lessonHref}>{current.lessonTitle?.trim() || "Go to lesson"} <ChevronRight className="h-3.5 w-3.5" aria-hidden /></Link>
                ) : (
                  <p>{current.topic || "Review linked study from the flashcards hub."}</p>
                )}
              </div>
              <div className="nn-flashcard-confidence-scale" data-nn-premium-flashcard-confidence>
                <span>How confident are you?</span>
                <div>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <button
                      key={score}
                      type="button"
                      aria-label={`Confidence ${score}`}
                      aria-pressed={confidence === score}
                      data-nn-flashcard-rating={score}
                      onClick={() => rateConfidence(score as 1 | 2 | 3 | 4 | 5)}
                      disabled={!revealed || saving}
                    >
                      {score}
                    </button>
                  ))}
                </div>
                <p><span>Not confident</span><span>Very confident</span></p>
              </div>
              {learningInsights[0] ? (
                <div className="nn-flashcard-coach-panel__section nn-flashcard-coach-panel__section--insight">
                  <span>Learning Insight</span>
                  <p>{learningInsights[0].message}</p>
                </div>
              ) : null}
              {confidenceGap.message ? (
                <div className="nn-flashcard-coach-panel__section nn-flashcard-coach-panel__section--insight">
                  <span>Confidence Check</span>
                  <p>{confidenceGap.message}</p>
                </div>
              ) : null}
              {studyStreak.reviewed >= 3 ? (
                <div className="nn-flashcard-coach-panel__section nn-flashcard-coach-panel__section--insight">
                  <span>Learner Readiness Index</span>
                  <p>{readinessIndex.level} · {readinessIndex.score}/100</p>
                </div>
              ) : null}
              {completed || learningSignals.length >= 5 ? (
                <div className="nn-flashcard-coach-panel__section nn-flashcard-coach-panel__section--insight">
                  <span>Recommended Next Step</span>
                  <p>{nextSteps[0]}</p>
                </div>
              ) : null}
            </div>

            <div className="nn-flashcard-rating-dock" aria-label="Grade this flashcard">
              {(["again", "hard", "good", "easy"] as const).map((rating) => {
                const labelMap = { again: "Again", hard: "Hard", good: "Good", easy: "Easy" } as const;
                const iconMap = {
                  again: <RefreshCw  className="h-4 w-4" aria-hidden />,
                  hard:  <BarChart3  className="h-4 w-4" aria-hidden />,
                  good:  <CheckCircle2 className="h-4 w-4" aria-hidden />,
                  easy:  <ChevronsRight className="h-4 w-4" aria-hidden />,
                };
                return (
                  <button
                    key={rating}
                    type="button"
                    data-nn-flashcard-grade={rating}
                    onClick={() => void submitRating(rating)}
                    disabled={!revealed || saving}
                  >
                    {iconMap[rating]}
                    {labelMap[rating]}
                  </button>
                );
              })}
            </div>
          </>
        )}
      />

      </div>{/* end sm:contents desktop wrapper */}
    </div>
  );
}
