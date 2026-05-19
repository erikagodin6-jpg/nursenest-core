"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Home,
  Keyboard,
  RefreshCw,
  Star,
  XCircle,
} from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getStudyItemState, setStudyItemState } from "@/lib/flashcards/study-session-persistence";
import { ExamSessionProgressStrip } from "@/components/exam/exam-session-shell";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
import { BrandedPageLoader } from "@/components/ui/premium-loader";
import { SuccessLeaf } from "@/components/ui/success-leaf";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import { isSataPayload } from "@/lib/flashcards/flashcard-exam-style";
import { resolveMeasurementTokens } from "@/lib/measurements/measurement-tokens";
import { useMeasurementPreference } from "@/lib/measurements/use-measurement-preference";
import { useFlashcardStudyTelemetry, deriveCardFlags } from "@/lib/flashcards/use-flashcard-study-telemetry";
import type { CardEventMeta } from "@/lib/flashcards/use-flashcard-study-telemetry";

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
  onSessionComplete?: () => void;
  onSessionRestart?: () => void;
  /** Local-only star / review flags (localStorage) for flashcard-style sessions. */
  enableLocalStudyPins?: boolean;
};

/* ================= HELPERS ================= */

function dedupeCardsById(cards: ActiveStudyCard[]): ActiveStudyCard[] {
  const seen = new Set<string>();
  return cards.filter((c) => {
    if (!c.id || seen.has(c.id)) return false;
    seen.add(c.id);
    return true;
  });
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
  sessionMode = "learn",
  initialCardIndex = 0,
  initialRevealed = false,
  onStudyProgress,
  onSessionComplete,
  onSessionRestart,
  enableLocalStudyPins = false,
}: Props) {
  const { t } = useMarketingI18n();
  const [, bumpPins] = useReducer((x: number) => x + 1, 0);

  const deduped = useMemo(() => dedupeCardsById(cards), [cards]);
  const { measurementSystem } = useMeasurementPreference("US");

  const [sessionCards, setSessionCards] = useState(deduped);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [ratingTally, setRatingTally] = useState({ again: 0, hard: 0, good: 0, easy: 0 });

  const current = sessionCards[index] ?? null;
  const pinState = current?.id && enableLocalStudyPins ? getStudyItemState(current.id) : {};

  // Derive stable session-level pathwayId from the first card with one.
  // This avoids recreating telemetry callbacks on every card change.
  const sessionPathwayId = useMemo(
    () => sessionCards.find((c) => c.pathwayId)?.pathwayId ?? null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sessionCards.length],
  );
  const telemetry = useFlashcardStudyTelemetry({ pathwayId: sessionPathwayId });

  useEffect(() => {
    setSessionCards(deduped);
    setIndex(initialCardIndex);
    setRevealed(initialRevealed);
    setCompleted(false);
    setElapsed(0);
    setRatingTally({ again: 0, hard: 0, good: 0, easy: 0 });
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
    if (sessionMode !== "test" || completed) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionMode, completed]);

  const progressPct =
    sessionCards.length > 0 ? Math.min(100, Math.round(((index + 1) / sessionCards.length) * 100)) : 0;

  const submitRating = useCallback(
    async (rating: "again" | "hard" | "good" | "easy") => {
      const card = sessionCards[index];
      if (!card) return;
      setSaving(true);

      setRatingTally((t) => ({ ...t, [rating]: t[rating] + 1 }));
      telemetry.onRated(card.id, rating, buildCardMeta(card));

      await onRate?.(card.id, rating);

      if (index >= sessionCards.length - 1) {
        setCompleted(true);
        onSessionComplete?.();
      } else {
        setIndex((i) => i + 1);
        setRevealed(false);
      }

      setSaving(false);
    },
    [index, onRate, onSessionComplete, sessionCards, telemetry],
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
        setIndex((i) => Math.max(0, i - 1));
        return;
      }
      if (e.key === "ArrowRight") {
        if (!revealed) return;
        e.preventDefault();
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

  if (loading) {
    return (
      <BrandedPageLoader message={t("learner.loading.flashcards")} contentClassName="!p-0">
        <FlashcardStudySessionSkeleton withRouteAria={false} />
      </BrandedPageLoader>
    );
  }

  if (!current) {
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
  const readinessLabel = Math.min(100, progressPct);
  const focusLabel = header.categoriesLabel?.trim() || formatTopicLine(current) || "Adaptive review";

  return (
    <div className="nn-active-flashcard-session space-y-4" data-nn-premium-flashcard-active-session>
      <ExamSessionProgressStrip pct={progressPct} />

      {/* HEADER */}
      <div className="nn-premium-flashcard-session-header nn-exam-session-topbar flex flex-wrap items-start justify-between gap-3 p-3 sm:p-4">
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-base font-bold text-[var(--semantic-text-primary)] sm:text-lg">
            {header.sessionTitle}
          </h1>
          <p className="mt-0.5 text-xs text-[var(--semantic-text-secondary)]">
            {index + 1} / {sessionCards.length}
            {sessionMeta?.returnedCount != null || sessionMeta?.totalAvailable != null ? (
              <span className="ml-1.5 text-[var(--semantic-text-secondary)]">
                · {sessionMeta.returnedCount ?? sessionCards.length} in session
                {sessionMeta.totalAvailable != null ? ` · ${sessionMeta.totalAvailable} matched filters` : ""}
                {sessionMeta.requestedCount != null ? ` · up to ${sessionMeta.requestedCount} requested` : ""}
              </span>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {sessionMode === "test" && (
            <span
              className="rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-2 py-1 font-mono text-xs text-[var(--semantic-text-primary)]"
              aria-live="polite"
            >
              {formatElapsed(elapsed)}
            </span>
          )}

          <Link
            href={header.exitHref}
            onClick={onExit}
            aria-label={t("flashcards.exitSession")}
            className="rounded-lg p-2 text-[var(--semantic-brand)] transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_90%,var(--semantic-surface))] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
          >
            <Home className="h-5 w-5" aria-hidden />
          </Link>
        </div>
      </div>

      <section
        className="nn-flashcard-study-micro-status"
        aria-label="Flashcard study progress"
        data-nn-flashcard-horizontal-status
      >
        <div>
          <span className="nn-flashcard-study-micro-status__label">Micro-practice</span>
          <strong>{index + 1} of {sessionCards.length}</strong>
        </div>
        <div>
          <span className="nn-flashcard-study-micro-status__label">Focus</span>
          <strong>{focusLabel}</strong>
        </div>
        <div>
          <span className="nn-flashcard-study-micro-status__label">Confidence logged</span>
          <strong>{ratedSession}</strong>
        </div>
        <div>
          <span className="nn-flashcard-study-micro-status__label">Remaining</span>
          <strong>{remainingCards}</strong>
        </div>
      </section>

      {/* MAIN CARD */}
      <FlashcardStudyQuestionStack
        sessionModeLabel={header.modeLabel}
        topicLine={formatTopicLine(current)}
        examMicroQuestion={current.examMicroQuestion}
        clinicalImageUrl={current.clinicalImageUrl?.trim() || null}
        prompt={resolveMeasurementTokens(current.prompt, measurementSystem)}
        answer={resolveMeasurementTokens(current.answer, measurementSystem)}
        explanation={resolveMeasurementTokens(current.explanation ?? current.examMicroQuestion?.rationaleCorrect ?? "", measurementSystem)}
        pearl={buildClinicalPearl(current, "No clinical pearl available.")}
        revealed={revealed}
        onReveal={() => {
          setRevealed(true);
          if (current?.id) telemetry.onReveal(current.id, buildCardMeta(current));
        }}
        onAnswerSubmitted={(letter, isCorrect) => {
          if (!current?.id) return;
          const meta = buildCardMeta(current);
          telemetry.onAnswerSubmitted(current.id, {
            selectedLetter: letter,
            correctLetter: current.examMicroQuestion && !isSataPayload(current.examMicroQuestion)
              ? current.examMicroQuestion.correctLetter
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
          telemetry.onAnswerSubmitted(current.id, {
            selectedLetters,
            correctLetters,
            isCorrect: allCorrectSelected,
            meta: buildCardMeta(current),
          });
        }}
        labels={{
          revealHint: t("flashcards.tapToReveal"),
          answerHeading: t("flashcards.answer"),
          whyCorrectHeading: t("flashcards.rationale"),
          whyIncorrectHeading: t("pages.flashcards.whyOtherOptionsAreIncorrect"),
          takeawayHeading: t("pages.flashcards.pearl"),
          answerChoicesHeading: "Answer choices",
        }}
        revealLinksSection={
          revealed && (current.lessonHref || current.practiceTestsTopicHref || current.practiceTopicHref) ? (
            <div
              className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_18%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-surface)_96%,var(--semantic-panel-muted))] px-3 py-2.5"
              data-testid="flashcard-inline-study-links"
            >
              <div className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[var(--semantic-text-muted)]">
                Related study
              </div>
              <div className="flex flex-col gap-1.5">
                {current.lessonHref ? (
                  <Link
                    href={current.lessonHref}
                    data-testid="flashcard-lesson-link-inline"
                    className="text-xs font-medium text-[var(--semantic-brand)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-brand)_45%,transparent)]"
                  >
                    {current.lessonTitle?.trim() || t("learner.studyLoop.reviewLessonCta")}
                  </Link>
                ) : null}
                {current.practiceTestsTopicHref ? (
                  <Link
                    href={current.practiceTestsTopicHref}
                    data-testid="flashcard-practice-tests-link-inline"
                    className="text-xs font-medium text-[var(--semantic-chart-2)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-chart-2)_45%,transparent)]"
                  >
                    {t("learner.studyLoop.practiceQuestionsThisTopic")}
                  </Link>
                ) : null}
                {current.practiceTopicHref ? (
                  <Link
                    href={current.practiceTopicHref}
                    data-testid="flashcard-topic-drill-link-inline"
                    className="text-xs font-medium text-[var(--semantic-info)] underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[color-mix(in_srgb,var(--semantic-info)_45%,transparent)]"
                  >
                    {t("learner.qbank.ui.topicDrillSameCode")}
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null
        }
        mainFooter={
          <>
            <div className="nn-flashcard-study-support-strip" data-nn-flashcard-support-strip>
              <div>
                <span className="font-semibold text-[var(--semantic-text-primary)]">Spaced repetition</span>
                <span className="text-[var(--semantic-text-secondary)]">
                  Rate confidence so weak concepts resurface without turning this into a dashboard.
                </span>
              </div>
              <div className="hidden items-center gap-2 text-[11px] text-[var(--semantic-text-muted)] sm:flex">
                <Keyboard className="h-3.5 w-3.5" aria-hidden />
                <span><kbd className="nn-flashcard-kbd">1</kbd> Need repetition</span>
                <span><kbd className="nn-flashcard-kbd">2</kbd> Unsure</span>
                <span><kbd className="nn-flashcard-kbd">3</kbd> Got it</span>
              </div>
            </div>

            {revealed && enableLocalStudyPins && current?.id ? (
              <div
                className="nn-flashcard-bookmark-controls flex flex-wrap gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3"
                data-nn-premium-flashcard-bookmarks
              >
                <button
                  type="button"
                  data-nn-flashcard-control="star"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    pinState.starred
                      ? "border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
                  }`}
                  onClick={() => {
                    setStudyItemState(current.id, { starred: !pinState.starred });
                    bumpPins();
                  }}
                >
                  <Star className="h-3.5 w-3.5" aria-hidden />
                  {pinState.starred ? "Starred" : "Star card"}
                </button>
                <button
                  type="button"
                  data-nn-flashcard-control="weak"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold ${
                    pinState.confusing
                      ? "border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] text-[var(--semantic-text-primary)]"
                      : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)]"
                  }`}
                  onClick={() => {
                    setStudyItemState(current.id, { confusing: !pinState.confusing });
                    bumpPins();
                  }}
                >
                  <AlertCircle className="h-3.5 w-3.5" aria-hidden />
                  {pinState.confusing ? "Flagged weak" : "Flag weak"}
                </button>
                <span className="self-center text-[10px] text-[var(--semantic-text-secondary)]">
                  Saved on this device for starred / weak filters on the hub.
                </span>
              </div>
            ) : null}

            {revealed ? (
              <div className="nn-flashcard-confidence-controls grid grid-cols-1 gap-2 sm:grid-cols-3" data-nn-premium-flashcard-confidence>
                <button
                  type="button"
                  data-nn-flashcard-rating="again"
                  aria-label="Need repetition — needs more review (key 1)"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[color-mix(in_srgb,var(--semantic-danger)_14%,var(--semantic-surface))]"
                  onClick={() => submitRating("again")}
                  disabled={saving}
                >
                  <XCircle className="h-4 w-4 shrink-0" aria-hidden /> Need repetition
                </button>
                <button
                  type="button"
                  data-nn-flashcard-rating="hard"
                  aria-label="Unsure — struggled (key 2)"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))]"
                  onClick={() => submitRating("hard")}
                  disabled={saving}
                >
                  <RefreshCw className="h-4 w-4 shrink-0" aria-hidden /> Unsure
                </button>
                <button
                  type="button"
                  data-nn-flashcard-rating="good"
                  aria-label="Got it — recalled with effort (key 3)"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:bg-[color-mix(in_srgb,var(--semantic-success)_16%,var(--semantic-surface))]"
                  onClick={() => submitRating("good")}
                  disabled={saving}
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden /> Got it
                </button>
              </div>
            ) : null}

            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--semantic-border-soft)] pt-3">
              <button
                type="button"
                className="nn-premium-flashcard-nav-btn"
                onClick={() => setIndex((i) => Math.max(0, i - 1))}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                {t("flashcards.previous")}
              </button>
              <button
                type="button"
                className="nn-premium-flashcard-nav-btn"
                onClick={() => setIndex((i) => Math.min(sessionCards.length - 1, i + 1))}
                disabled={!revealed}
              >
                {t("flashcards.next")}
                <ChevronRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </>
        }
      />
    </div>
  );
}
