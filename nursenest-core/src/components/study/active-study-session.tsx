"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import {
  Bookmark,
  ChevronRight,
  Home,
  Keyboard,
  Pause,
  Play,
  RefreshCw,
} from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import { getStudyItemState, setStudyItemState } from "@/lib/flashcards/study-session-persistence";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import { FlashcardStudySessionSkeleton } from "@/components/skeletons/hub-page-skeleton";
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
import type { UnifiedExamWorkspaceMode } from "@/lib/exam-workspace/unified-exam-workspace";

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

function stripStudyPromptNoise(value: string | null | undefined): string {
  return String(value ?? "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .replace(/^\s*(?:question\s*)?\d+[\).:\-\s]+/i, "")
    .replace(/^\s*(?:clinical\s+recall|recall|prompt|front)[:\-\s]+/i, "")
    .trim();
}

function shortClinicalText(value: string | null | undefined, fallback: string): string {
  const clean = stripStudyPromptNoise(value)
    .replace(/^correct\s*:\s*[A-D]\)?\s*/i, "")
    .replace(/^answer\s*:\s*/i, "")
    .trim();
  if (!clean) return fallback;
  return clean.length > 190 ? `${clean.slice(0, 187).trim()}...` : clean;
}

function hashCardId(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function buildNclexFallbackExam(card: ActiveStudyCard): ExamMicroQuestionPayload {
  const topic = formatTopicLine(card) || "this clinical concept";
  const prompt = stripStudyPromptNoise(card.prompt);
  const isQuestion = /\?\s*$/.test(prompt) && prompt.length <= 220;
  const questionStem = isQuestion
    ? prompt
    : `A client is being assessed for ${topic}. Which finding or action best reflects the clinical principle being reviewed?`;
  const correctText = shortClinicalText(
    card.answer,
    "Apply the highest-priority assessment or intervention supported by the clinical finding.",
  );
  const distractors = [
    "Delay intervention until the client develops additional unrelated symptoms.",
    "Document the finding without reassessing risk or updating the plan of care.",
    "Prioritize routine comfort measures before addressing the underlying clinical issue.",
  ];
  const correctIndex = hashCardId(card.id) % 4;
  const allOptions = [...distractors];
  allOptions.splice(correctIndex, 0, correctText);
  const correctLetter = String.fromCharCode("A".charCodeAt(0) + correctIndex);
  const rationaleCorrect = shortClinicalText(
    card.explanation || card.answer,
    "This option best connects the concept to safe nursing judgment and prioritization.",
  );

  return {
    itemKind: "CLINICAL" as ExamMicroQuestionPayload["itemKind"],
    questionStem,
    answerOptions: allOptions.map((text, idx) => ({
      letter: String.fromCharCode("A".charCodeAt(0) + idx),
      text,
    })),
    correctLetter,
    rationaleCorrect,
    rationaleIncorrect: allOptions
      .map((_, idx) => String.fromCharCode("A".charCodeAt(0) + idx))
      .filter((letter) => letter !== correctLetter)
      .map((letter) => ({
        letter,
        rationale: "This choice is less safe because it does not address the primary clinical mechanism, risk, or priority.",
      })),
  };
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
  const { measurementSystem } = useMeasurementPreference(fallbackMeasurementSystem);

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
    setSessionCards(deduped);
    setIndex(initialCardIndex);
    const initialCard = deduped[initialCardIndex] ?? null;
    setRevealed(Boolean(initialRevealed && !initialCard?.examMicroQuestion));
    setCompleted(false);
    setIsPaused(false);
    setElapsed(0);
    setRatingTally({ again: 0, hard: 0, good: 0, easy: 0 });
    setConfidence(null);
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
    setHintOpen(false);
    setConfidence(null);
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
  const displayExam = current.examMicroQuestion ?? buildNclexFallbackExam(current);
  const displayPrompt = resolveMeasurementTokens(displayExam.questionStem, measurementSystem);
  const displayExplanation = resolveMeasurementTokens(
    current.explanation ?? displayExam.rationaleCorrect ?? "",
    measurementSystem,
  );

  return (
    <div
      className="nn-active-flashcard-session nn-unified-exam-workspace space-y-3"
      data-nn-premium-flashcard-active-session
      data-nn-unified-exam-workspace=""
      data-nn-exam-workspace-mode={"flashcards" satisfies UnifiedExamWorkspaceMode}
    >
      <div className="nn-flashcard-learning-topbar" aria-label="Flashcard session">
        <div className="min-w-0">
          <p className="nn-flashcard-learning-topbar__mode">{header.modeLabel}</p>
          <h1>{header.sessionTitle}</h1>
        </div>

        <div className="nn-flashcard-learning-topbar__meta">
          <div>
            <span>Progress</span>
            <strong>{index + 1} of {sessionCards.length}</strong>
            <i aria-hidden>
              <b style={{ width: `${((index + 1) / Math.max(1, sessionCards.length)) * 100}%` }} />
            </i>
          </div>
          <div className="max-sm:hidden">
            <span>Focus</span>
            <strong>{focusLabel}</strong>
          </div>
          <div>
            <span>Time elapsed</span>
            <strong className="font-mono">{formatElapsed(elapsed)}</strong>
          </div>
          <div>
            <span>Questions</span>
            <strong>{index + 1} of {sessionCards.length}</strong>
          </div>
          <ExamMeasurementUnitToggle fallbackSystem={fallbackMeasurementSystem} />
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
        sessionModeLabel={header.modeLabel}
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
          telemetry.onAnswerSubmitted(current.id, {
            selectedLetters,
            correctLetters,
            isCorrect: allCorrectSelected,
            meta: buildCardMeta(current),
          });
        }}
        labels={{
          revealHint: "Select an answer, then submit to see the rationale.",
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
              <div className="nn-flashcard-coach-panel__section nn-flashcard-coach-panel__section--coach">
                <span>Coach</span>
              </div>
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
            </div>

            <div className="nn-flashcard-rating-dock" aria-label="Grade this flashcard">
              {([
                ["again", "Again"],
                ["hard", "Hard"],
                ["good", "Good"],
                ["easy", "Easy"],
              ] as const).map(([rating, label]) => (
                <button
                  key={rating}
                  type="button"
                  data-nn-flashcard-grade={rating}
                  onClick={() => void submitRating(rating)}
                  disabled={!revealed || saving}
                >
                  {label}
                </button>
              ))}
            </div>
          </>
        }
      />
    </div>
  );
}
