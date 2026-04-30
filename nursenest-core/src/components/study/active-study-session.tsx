"use client";

import Link from "next/link";
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { AlertCircle, CheckCircle2, ChevronLeft, ChevronRight, Home, RefreshCw, Star, XCircle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getStudyItemState, setStudyItemState } from "@/lib/flashcards/study-session-persistence";
import { ExamSessionThemeTrigger } from "@/components/exam/exam-session-theme-trigger";
import { ExamSessionProgressStrip } from "@/components/exam/exam-session-shell";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { firstTeachingLine, FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

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
  onRate?: (cardId: string, rating: "incorrect" | "unsure" | "known") => Promise<void>;
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

  const [sessionCards, setSessionCards] = useState(deduped);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const current = sessionCards[index] ?? null;
  const pinState = current?.id && enableLocalStudyPins ? getStudyItemState(current.id) : {};

  useEffect(() => {
    setSessionCards(deduped);
    setIndex(initialCardIndex);
    setRevealed(initialRevealed);
    setCompleted(false);
    setElapsed(0);
  }, [deduped, initialCardIndex, initialRevealed]);

  useEffect(() => {
    onStudyProgress?.({ index, revealed });
  }, [index, revealed]);

  useEffect(() => {
    if (sessionMode !== "test" || completed) return;
    const id = setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [sessionMode, completed]);

  if (loading) {
    return <div className="p-4 text-sm">Loading session...</div>;
  }

  if (!current) {
    return <div className="p-4 text-sm">No cards available.</div>;
  }

  if (completed) {
    return (
      <div className="p-6">
        <h2 className="text-lg font-bold">Session complete</h2>
        <button
          onClick={() => {
            onSessionRestart?.();
            setIndex(0);
            setCompleted(false);
          }}
        >
          Restart
        </button>
      </div>
    );
  }

  async function submitRating(rating: "incorrect" | "unsure" | "known") {
    if (!current) return;
    setSaving(true);

    await onRate?.(current.id, rating);

    if (index >= sessionCards.length - 1) {
      setCompleted(true);
      onSessionComplete?.();
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }

    setSaving(false);
  }

  return (
    <div className="space-y-4">

      {/* HEADER */}
      <div className="flex items-center justify-between border p-3 rounded-xl">
        <div>
          <h1 className="font-bold">{header.sessionTitle}</h1>
          <p className="text-xs text-[var(--semantic-text-secondary)]">
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

        <div className="flex items-center gap-2">
          {sessionMode === "test" && (
            <span className="font-mono text-sm">{formatElapsed(elapsed)}</span>
          )}

          <Link href={header.exitHref} onClick={onExit}>
            <Home />
          </Link>
        </div>
      </div>

      {/* MAIN CARD */}
      <FlashcardStudyQuestionStack
        sessionModeLabel={header.modeLabel}
        topicLine={current.topic}
        examMicroQuestion={current.examMicroQuestion}
        prompt={current.prompt}
        answer={current.answer}
        explanation={current.explanation ?? current.examMicroQuestion?.rationaleCorrect}
        pearl={buildClinicalPearl(current, "No clinical pearl available.")}
        revealed={revealed}
        onReveal={() => setRevealed(true)}
        labels={{
          revealHint: "Tap to reveal",
          answerHeading: "Answer",
          whyCorrectHeading: "Why correct",
          whyIncorrectHeading: "Why incorrect",
          takeawayHeading: "Clinical pearl",
          answerChoicesHeading: "Choices",
        }}
      />

      {revealed && (current.lessonHref || current.practiceTopicHref || current.practiceTestsTopicHref) ? (
        <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-4 text-sm">
          {current.lessonHref ? (
            <div
              className={
                current.practiceTopicHref || current.practiceTestsTopicHref ? "mb-3" : ""
              }
            >
              <div className="mb-2 text-xs font-semibold uppercase text-[var(--theme-muted-text)]">
                {t("learner.qbank.ui.relatedLesson")}
              </div>
              <Link
                href={current.lessonHref}
                data-testid="active-study-review-lesson"
                className="font-medium text-primary underline underline-offset-2"
              >
                {current.lessonTitle?.trim() || t("learner.studyLoop.reviewLessonCta")}
              </Link>
            </div>
          ) : null}
          {current.practiceTestsTopicHref ? (
            <div className={current.practiceTopicHref ? "mb-3" : ""}>
              <div className="mb-2 text-xs font-semibold uppercase text-[var(--theme-muted-text)]">
                {t("learner.studyLoop.topicPracticeTestsCta")}
              </div>
              <Link
                href={current.practiceTestsTopicHref}
                data-testid="active-study-practice-tests-topic"
                className="font-medium text-[var(--semantic-chart-2)] underline underline-offset-2"
              >
                {t("learner.studyLoop.practiceQuestionsThisTopic")}
              </Link>
            </div>
          ) : null}
          {current.practiceTopicHref ? (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase text-[var(--theme-muted-text)]">
                {t("learner.studyLoop.practiceTopic")}
              </div>
              <Link
                href={current.practiceTopicHref}
                className="font-medium text-[var(--semantic-info)] underline underline-offset-2"
              >
                {t("learner.qbank.ui.topicDrillSameCode")}
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}

      {revealed && enableLocalStudyPins && current?.id ? (
        <div className="flex flex-wrap gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] p-3">
          <button
            type="button"
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

      {/* RATING */}
      {revealed && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
            onClick={() => submitRating("incorrect")}
            disabled={saving}
          >
            <XCircle className="h-4 w-4" aria-hidden /> Incorrect
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-muted)] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
            onClick={() => submitRating("unsure")}
            disabled={saving}
          >
            <RefreshCw className="h-4 w-4" aria-hidden /> Unsure
          </button>
          <button
            type="button"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-success)_32%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-2 text-sm font-semibold text-[var(--semantic-text-primary)]"
            onClick={() => submitRating("known")}
            disabled={saving}
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden /> Known
          </button>
        </div>
      )}

      {/* NAV */}
      <div className="flex justify-between">
        <button onClick={() => setIndex((i) => Math.max(0, i - 1))}>
          <ChevronLeft /> Prev
        </button>
        <button
          onClick={() => setIndex((i) => Math.min(sessionCards.length - 1, i + 1))}
          disabled={!revealed}
        >
          Next <ChevronRight />
        </button>
      </div>
    </div>
  );
}