"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronLeft, ChevronRight, Home, RefreshCw, XCircle } from "lucide-react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  getStudyItemState,
  setStudyItemState,
  type StudyItemState,
} from "@/lib/flashcards/study-session-persistence";
import { resolveFlashcardRelatedLessonLink } from "@/lib/flashcards/flashcard-study-links";
import { ExamSessionThemeTrigger } from "@/components/exam/exam-session-theme-trigger";
import { ExamSessionProgressStrip } from "@/components/exam/exam-session-shell";
import { SiteBrandLogoMark } from "@/components/brand/site-brand-logo";
import { FlashcardRichContent } from "@/components/flashcards/flashcard-rich-content";
import { FlashcardStudyQuestionStack } from "@/components/flashcards/flashcard-study-question-stack";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";

export type ActiveStudyCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
  /** NCLEX-style micro-question payload when the API serialized `examMicroQuestion`. */
  examMicroQuestion?: ExamMicroQuestionPayload | null;
  topic?: string | null;
  subtopic?: string | null;
  sourceKey?: string | null;
  pathwayId?: string | null;
  topicSlug?: string | null;
  distractors?: Array<{ option: string; rationale: string }>;
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
  /**
   * `split` = prompt + rationale sidebar (custom/weak sessions).
   * `card` = deck study: question-stem stack (answer + rationale below), rating row, fixed bottom tools.
   */
  layout?: "split" | "card";
  /** `test` shows an elapsed timer (legacy DeckStudyTest). */
  sessionMode?: "learn" | "test";
  /** When cards load, start here (legacy resume). Clamped to deck length. */
  initialCardIndex?: number;
  initialRevealed?: boolean;
  /** Fire when position changes (for local resume checkpoints). */
  onStudyProgress?: (state: { index: number; revealed: boolean }) => void;
  onSessionComplete?: () => void;
  /** User restarted from completion or sub-session (clear local resume checkpoints). */
  onSessionRestart?: () => void;
};

function examItemKindCaptionForCard(
  exam: ExamMicroQuestionPayload | null | undefined,
  t: (key: string, params?: Record<string, string | number | undefined>) => string,
): string | null {
  if (!exam) return null;
  const labelKey: Record<string, string> = {
    RECALL: "learner.flashcards.session.examItemKindRecall",
    CLINICAL: "learner.flashcards.session.examItemKindClinical",
    PRIORITY: "learner.flashcards.session.examItemKindPriority",
    CONCEPT: "learner.flashcards.session.examItemKindConcept",
  };
  const lk = labelKey[String(exam.itemKind)] ?? "learner.flashcards.session.examItemKindConcept";
  return t("learner.flashcards.session.examItemKindBadge", { label: t(lk) });
}

function buildClinicalPearl(card: ActiveStudyCard, emptyPearlMessage: string): string {
  if (card.examMicroQuestion?.rationaleCorrect?.trim()) {
    const firstSentence = card.examMicroQuestion.rationaleCorrect
      .split(".")
      .map((part) => part.trim())
      .find(Boolean);
    if (firstSentence) return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }
  if (card.explanation?.trim()) {
    const firstSentence = card.explanation
      .split(".")
      .map((part) => part.trim())
      .find(Boolean);
    if (firstSentence) return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }
  if (card.answer?.trim()) {
    const first = card.answer
      .split(".")
      .map((part) => part.trim())
      .find(Boolean);
    if (first) return first.endsWith(".") ? first : `${first}.`;
  }
  return emptyPearlMessage;
}

function dedupeCardsById(cards: ActiveStudyCard[]): ActiveStudyCard[] {
  const seen = new Set<string>();
  const kept: ActiveStudyCard[] = [];
  for (const card of cards) {
    if (!card.id || seen.has(card.id)) continue;
    seen.add(card.id);
    kept.push(card);
  }
  return kept;
}

/** Queue row: stable React key + optional learn-mode retry (legacy `DeckStudyLearn`). */
type InternalStudyCard = ActiveStudyCard & { _queueKey: string; _retry?: boolean };

function toInternalQueue(cards: ActiveStudyCard[]): InternalStudyCard[] {
  return cards.map((c) => ({ ...c, _queueKey: c.id }));
}

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
}: Props) {
  const { t } = useMarketingI18n();
  const dedupedCards = useMemo(() => dedupeCardsById(cards), [cards]);
  const [sessionCards, setSessionCards] = useState<InternalStudyCard[]>(() => toInternalQueue(dedupedCards));
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [completedCount, setCompletedCount] = useState(0);
  const [localState, setLocalState] = useState<Record<string, StudyItemState>>({});
  const [localNotes, setLocalNotes] = useState<Record<string, string>>({});
  const [reviewedIds, setReviewedIds] = useState<Record<string, true>>({});
  const [ratingStats, setRatingStats] = useState({ known: 0, unsure: 0, incorrect: 0 });
  const [elapsedSec, setElapsedSec] = useState(0);

  useEffect(() => {
    setSessionCards(toInternalQueue(dedupedCards));
    const maxIdx = Math.max(0, dedupedCards.length - 1);
    const start = Math.min(Math.max(0, initialCardIndex), maxIdx);
    setIndex(dedupedCards.length ? start : 0);
    setRevealed(dedupedCards.length ? initialRevealed : false);
    setCompleted(false);
    setCompletedCount(0);
    setReviewedIds({});
    setRatingStats({ known: 0, unsure: 0, incorrect: 0 });
    setElapsedSec(0);
  }, [dedupedCards, initialCardIndex, initialRevealed]);

  useEffect(() => {
    onStudyProgress?.({ index, revealed });
  }, [index, revealed, onStudyProgress]);

  useEffect(() => {
    if (sessionMode !== "test" || completed || loading) return;
    const t = window.setInterval(() => setElapsedSec((s) => s + 1), 1000);
    return () => window.clearInterval(t);
  }, [sessionMode, completed, loading]);

  const formatElapsed = (s: number) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const current = sessionCards[index] ?? null;
  const sessionCount = Math.max(
    1,
    typeof sessionMeta?.returnedCount === "number" ? sessionMeta.returnedCount : sessionCards.length,
  );
  const progressLabel = `${Math.min(index + 1, sessionCount)} of ${sessionCount}`;

  const itemState = useMemo(() => {
    if (!current) return {};
    const cached = localState[current.id];
    if (cached) return cached;
    return getStudyItemState(current.id);
  }, [current, localState]);

  const currentNote = current ? localNotes[current.id] ?? itemState.note ?? "" : "";

  const relatedLessonLink = current
    ? resolveFlashcardRelatedLessonLink({
        sourceKey: current.sourceKey,
        topic: current.topic,
        topicSlug: current.topicSlug ?? current.subtopic,
        pathwayId: current.pathwayId,
      })
    : {
        href: "/app/lessons",
        isExactLesson: false as const,
        labelKey: "learner.flashcards.session.linkBrowseRelated" as const,
      };

  const ratings = useMemo(
    () =>
      [
        { id: "incorrect" as const, label: t("learner.flashcards.session.ratingIncorrect") },
        { id: "unsure" as const, label: t("learner.flashcards.session.ratingUnsure") },
        { id: "known" as const, label: t("learner.flashcards.session.ratingKnown") },
      ] as const,
    [t],
  );

  const applyItemState = (patch: Partial<StudyItemState>) => {
    if (!current) return;
    const next = setStudyItemState(current.id, patch);
    setLocalState((prev) => ({ ...prev, [current.id]: next }));
  };

  const goPrevious = () => {
    setIndex((prev) => Math.max(0, prev - 1));
    setRevealed(false);
  };

  const goNext = () => {
    setIndex((prev) => Math.min(sessionCards.length - 1, prev + 1));
    setRevealed(false);
  };

  const restartWith = (nextCards: ActiveStudyCard[]) => {
    onSessionRestart?.();
    setSessionCards(toInternalQueue(nextCards));
    setIndex(0);
    setRevealed(false);
    setCompleted(false);
    setCompletedCount(0);
    setReviewedIds({});
    setRatingStats({ known: 0, unsure: 0, incorrect: 0 });
    setElapsedSec(0);
  };

  const restartCurrentSession = () => {
    restartWith(dedupedCards);
  };

  const submitRating = async (rating: "incorrect" | "unsure" | "known") => {
    if (!current || !revealed) return;
    setSaving(true);
    try {
      const lenBefore = sessionCards.length;
      if (index >= lenBefore - 1) {
        await onRate?.(current.id, rating);
        setReviewedIds((prev) => ({ ...prev, [current.id]: true }));
        setRatingStats((prev) => ({
          known: prev.known + (rating === "known" ? 1 : 0),
          unsure: prev.unsure + (rating === "unsure" ? 1 : 0),
          incorrect: prev.incorrect + (rating === "incorrect" ? 1 : 0),
        }));
        setCompleted(true);
        setCompletedCount(lenBefore);
        onSessionComplete?.();
        return;
      }

      await onRate?.(current.id, rating);
      setReviewedIds((prev) => ({ ...prev, [current.id]: true }));
      setRatingStats((prev) => ({
        known: prev.known + (rating === "known" ? 1 : 0),
        unsure: prev.unsure + (rating === "unsure" ? 1 : 0),
        incorrect: prev.incorrect + (rating === "incorrect" ? 1 : 0),
      }));

      if (rating === "incorrect" && sessionMode === "learn" && layout === "card") {
        setSessionCards((prev) => {
          const next = [...prev];
          const ins = Math.min(index + 4, next.length);
          const retryCard: InternalStudyCard = {
            ...current,
            _queueKey: `${current.id}-retry-${ins}-${Date.now()}`,
            _retry: true,
          };
          next.splice(ins, 0, retryCard);
          return next;
        });
      }

      goNext();
    } finally {
      setSaving(false);
    }
  };

  const submitRatingRef = useRef(submitRating);
  submitRatingRef.current = submitRating;

  /** Classic study-flow shortcuts (legacy monolith parity): do not hijack typing in notes. */
  useEffect(() => {
    if (sessionCards.length === 0) return;
    const onKey = (e: KeyboardEvent) => {
      if (completed || loading) return;
      const t = e.target;
      if (t instanceof HTMLTextAreaElement || t instanceof HTMLInputElement || t instanceof HTMLSelectElement) {
        return;
      }
      if (e.key === " " || e.key === "Enter") {
        if (!revealed) {
          e.preventDefault();
          setRevealed(true);
        }
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setIndex((prev) => Math.max(0, prev - 1));
        setRevealed(false);
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        if (!revealed) {
          setRevealed(true);
          return;
        }
        setIndex((prev) => Math.min(Math.max(0, sessionCards.length - 1), prev + 1));
        setRevealed(false);
        return;
      }
      if (revealed && !saving) {
        if (e.key === "1" || e.key === "Digit1") {
          e.preventDefault();
          void submitRatingRef.current("incorrect");
          return;
        }
        if (e.key === "2" || e.key === "Digit2") {
          e.preventDefault();
          void submitRatingRef.current("unsure");
          return;
        }
        if (e.key === "3" || e.key === "Digit3") {
          e.preventDefault();
          void submitRatingRef.current("known");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [completed, loading, revealed, saving, sessionCards.length]);

  const completionSummary = useMemo(() => {
    const aggregate = {
      starred: 0,
      saved: 0,
      confusing: 0,
      noted: 0,
      highlighted: 0,
    };
    const starredCards: ActiveStudyCard[] = [];
    const revisitCards: ActiveStudyCard[] = [];
    for (const card of sessionCards) {
      const persisted = getStudyItemState(card.id);
      const local = localState[card.id] ?? {};
      const merged: StudyItemState = { ...persisted, ...local };
      const noteValue = localNotes[card.id];
      if (typeof noteValue === "string") merged.note = noteValue;
      if (merged.starred) {
        aggregate.starred += 1;
        starredCards.push(card);
      }
      if (merged.saved) aggregate.saved += 1;
      if (merged.confusing) {
        aggregate.confusing += 1;
        revisitCards.push(card);
      }
      if (merged.highlighted) aggregate.highlighted += 1;
      if (merged.note && merged.note.trim().length > 0) aggregate.noted += 1;
    }
    return {
      ...aggregate,
      starredCards,
      revisitCards,
      reviewedCount: Object.keys(reviewedIds).length,
    };
  }, [sessionCards, localState, localNotes, reviewedIds]);

  if (loading) {
    return (
      <div className="rounded-xl border border-border p-4 text-sm text-[var(--theme-muted-text)]">
        {t("learner.flashcards.session.loadingPreparing")}
      </div>
    );
  }

  if (dedupedCards.length === 0) {
    return (
      <div className="space-y-3 rounded-xl border border-border p-5 text-sm text-[var(--theme-muted-text)]">
        <p className="leading-relaxed text-[var(--theme-muted-text)]">{t("learner.flashcards.session.emptyBuilding")}</p>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/app/questions"
            className="inline-flex min-h-10 items-center rounded-lg border border-border bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold text-primary hover:bg-muted/40"
          >
            {t("learner.flashcards.session.emptyCtaQuestions")}
          </Link>
          <Link
            href="/app/lessons"
            className="inline-flex min-h-10 items-center rounded-lg border border-border bg-[var(--theme-card-bg)] px-4 py-2 text-sm font-semibold text-primary hover:bg-muted/40"
          >
            {t("learner.flashcards.session.emptyCtaLessons")}
          </Link>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="rounded-xl border border-border p-5 text-sm text-[var(--theme-muted-text)]">
        {t("learner.flashcards.session.emptyNoItems")}
      </div>
    );
  }

  if (completed) {
    return (
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            {t("learner.flashcards.session.completionEyebrow")}
          </p>
          <h2 className="mt-1 text-lg font-bold text-[var(--theme-heading-text)]">{header.sessionTitle}</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {completedCount === 1
              ? t("learner.flashcards.session.completionBody_one", {
                  count: completedCount,
                  mode: header.modeLabel,
                })
              : t("learner.flashcards.session.completionBody_other", {
                  count: completedCount,
                  mode: header.modeLabel,
                })}
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            {t("learner.flashcards.session.completionStatsIntro")}{" "}
            <span className="font-semibold text-[var(--semantic-success)]">
              {t("learner.flashcards.session.statKnown", { n: ratingStats.known })}
            </span>
            {" · "}
            <span className="font-semibold text-[var(--semantic-warning)]">
              {t("learner.flashcards.session.statUnsure", { n: ratingStats.unsure })}
            </span>
            {" · "}
            <span className="font-semibold text-[var(--semantic-danger)]">
              {t("learner.flashcards.session.statMissed", { n: ratingStats.incorrect })}
            </span>
          </p>
          <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
            {t("learner.flashcards.session.categoriesPrefix")} {header.categoriesLabel}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            {t("learner.flashcards.session.completionSummaryHeading")}
          </p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">
                {t("learner.flashcards.session.summaryTotalItems")}
              </p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">{t("learner.flashcards.session.summaryStarred")}</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.starred}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">{t("learner.flashcards.session.summarySaved")}</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.saved}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">{t("learner.flashcards.session.summaryRevisit")}</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.confusing}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">{t("learner.flashcards.session.summaryNotes")}</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.noted}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">{t("learner.flashcards.session.summaryRated")}</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.reviewedCount}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">{t("learner.flashcards.session.summaryHighlights")}</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.highlighted}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            {t("learner.flashcards.session.nextActions")}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {completionSummary.revisitCards.length > 0 ? (
              <button
                type="button"
                onClick={() => restartWith(completionSummary.revisitCards)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                {t("learner.flashcards.session.btnStudyRevisit")}
              </button>
            ) : null}
            {completionSummary.starredCards.length > 0 ? (
              <button
                type="button"
                onClick={() => restartWith(completionSummary.starredCards)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                {t("learner.flashcards.session.btnStudyStarred")}
              </button>
            ) : null}
            <button
              type="button"
              onClick={restartCurrentSession}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              {t("learner.flashcards.session.btnStartNewSession")}
            </button>
            <Link
              href={header.exitHref}
              onClick={onExit}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              {t("learner.flashcards.session.btnExitToFlashcards")}
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const queueLen = Math.max(1, sessionCards.length);
  const stripPct = Math.min(100, ((index + 1) / queueLen) * 100);

  return (
    <div className="space-y-4">
      {layout !== "card" ? (
      <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              {t("learner.flashcards.session.studySessionLabel")}
            </p>
            <h1 className="text-lg font-bold text-[var(--theme-heading-text)]">{header.sessionTitle}</h1>
            <p className="text-xs text-[var(--theme-muted-text)]">
              {progressLabel} · {t("learner.flashcards.session.modeSurfaceLabel")} · {header.modeLabel} ·{" "}
              {header.categoriesLabel}
            </p>
            <p className="mt-1 text-[10px] text-[var(--theme-muted-text)]">
              {t("learner.flashcards.session.keyboardHint")}
            </p>
            {(typeof sessionMeta?.requestedCount === "number" ||
              typeof sessionMeta?.returnedCount === "number") ? (
              <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
                {[
                  t("learner.flashcards.session.metaRequested", {
                    n: sessionMeta?.requestedCount ?? sessionCount,
                  }),
                  t("learner.flashcards.session.metaLoaded", {
                    n: sessionMeta?.returnedCount ?? sessionCount,
                  }),
                  ...(typeof sessionMeta?.totalAvailable === "number"
                    ? [
                        t("learner.flashcards.session.metaAvailable", {
                          n: sessionMeta.totalAvailable,
                        }),
                      ]
                    : []),
                  ...(sessionMeta?.hasMore
                    ? [t("learner.flashcards.session.metaMoreSuffix")]
                    : []),
                ].join(" · ")}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExamSessionThemeTrigger />
            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
              {t("learner.flashcards.session.progressChip", { label: progressLabel })}
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]">
              {t("learner.flashcards.session.statKnown", { n: ratingStats.known })}
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]">
              {t("learner.flashcards.session.statUnsure", { n: ratingStats.unsure })}
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]">
              {t("learner.flashcards.session.statMissed", { n: ratingStats.incorrect })}
            </span>
            {sessionMode === "test" ? (
              <span className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-[var(--theme-muted-text)]">
                {formatElapsed(elapsedSec)}
              </span>
            ) : null}
            <Link
              href={header.exitHref}
              onClick={onExit}
              className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
            >
              {t("learner.flashcards.session.exitSession")}
            </Link>
          </div>
        </div>
      </section>
      ) : null}

      {layout === "card" ? (
        <div className="relative pb-[calc(5.5rem+env(safe-area-inset-bottom))]">
          <div className="sticky top-0 z-30 border-b border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-brand)_5%,var(--semantic-surface))] shadow-sm">
            <ExamSessionProgressStrip pct={stripPct} />
            <div className="mx-auto flex max-w-3xl flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2.5 sm:px-4">
              <Link
                href="/app"
                className="shrink-0 rounded-md p-0.5 opacity-90 hover:opacity-100"
                aria-label="NurseNest home"
              >
                <SiteBrandLogoMark variant="learner" className="h-7 max-h-7" />
              </Link>
              <Link
                href={header.exitHref}
                onClick={onExit}
                className="inline-flex items-center gap-1 text-sm font-medium text-[var(--semantic-brand)] hover:underline"
              >
                <Home className="h-4 w-4 shrink-0" aria-hidden />
                <span className="hidden sm:inline">{t("learner.flashcards.session.breadcrumbHub")}</span>
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
              <span className="max-w-[10rem] truncate text-sm font-semibold text-[var(--semantic-text-primary)] sm:max-w-[14rem]">
                {header.sessionTitle}
              </span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-text-muted)]" aria-hidden />
              <span className="max-w-[12rem] truncate text-sm font-medium text-[var(--semantic-text-secondary)] sm:max-w-[18rem]">
                {t("learner.flashcards.session.modeSurfaceLabel")} · {header.modeLabel}
              </span>
              <div className="ml-auto flex flex-wrap items-center justify-end gap-2 sm:gap-3">
                <ExamSessionThemeTrigger variant="pill" />
                <span className="hidden font-mono text-xs tabular-nums text-[var(--semantic-text-muted)] sm:inline">
                  {progressLabel}
                </span>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-text-primary)] sm:text-[11px]">
                  {t("learner.flashcards.session.statKnownShort", { n: ratingStats.known })}
                </span>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-text-primary)] sm:text-[11px]">
                  {t("learner.flashcards.session.statUnsureShort", { n: ratingStats.unsure })}
                </span>
                <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-2 py-0.5 text-[10px] font-semibold text-[var(--semantic-text-primary)] sm:text-[11px]">
                  {t("learner.flashcards.session.statMissedShort", { n: ratingStats.incorrect })}
                </span>
                {sessionMode === "test" ? (
                  <span className="font-mono text-xs tabular-nums text-[var(--semantic-text-primary)]">
                    {formatElapsed(elapsedSec)}
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-2xl space-y-4 px-3 pt-4 sm:px-4">
            {(typeof sessionMeta?.requestedCount === "number" ||
              typeof sessionMeta?.returnedCount === "number") ? (
              <p className="text-center text-[11px] text-[var(--semantic-text-muted)]">
                {[
                  t("learner.flashcards.session.metaRequested", {
                    n: sessionMeta?.requestedCount ?? sessionCount,
                  }),
                  t("learner.flashcards.session.metaLoaded", {
                    n: sessionMeta?.returnedCount ?? sessionCount,
                  }),
                  ...(typeof sessionMeta?.totalAvailable === "number"
                    ? [
                        t("learner.flashcards.session.metaAvailable", {
                          n: sessionMeta.totalAvailable,
                        }),
                      ]
                    : []),
                  ...(sessionMeta?.hasMore ? [t("learner.flashcards.session.metaMoreSuffix")] : []),
                ].join(" · ")}
              </p>
            ) : null}

            {current._retry ? (
              <div className="flex items-center gap-2 rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_38%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-4 py-2.5 text-xs font-medium text-[var(--semantic-text-primary)]">
                <RefreshCw className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
                {t("learner.flashcards.session.retryBanner")}
              </div>
            ) : null}

            <div className="flex justify-center">
              <FlashcardStudyQuestionStack
                sessionModeLabel={
                  sessionMode === "test"
                    ? t("learner.flashcards.session.cardFrontTest")
                    : t("learner.flashcards.session.cardFrontLearn")
                }
                topicLine={
                  current.topic || current.subtopic
                    ? `${current.topic ?? t("learner.flashcards.session.topicGeneral")}${current.subtopic ? ` · ${current.subtopic}` : ""}`
                    : null
                }
                examMicroQuestion={current.examMicroQuestion ?? null}
                itemKindCaption={examItemKindCaptionForCard(current.examMicroQuestion, t)}
                prompt={current.prompt}
                answer={current.answer}
                explanation={current.explanation}
                pearl={buildClinicalPearl(current, t("learner.flashcards.session.clinicalPearlMissing"))}
                revealed={revealed}
                onReveal={() => setRevealed(true)}
                labels={{
                  revealCta: t("learner.flashcards.session.flipCardCta"),
                  revealHint: t("learner.flashcards.session.revealHint"),
                  answerHeading: t("learner.flashcards.session.correctAnswerHeading"),
                  rationaleHeading: t("learner.flashcards.session.rationaleBlockHeading"),
                  takeawayHeading: t("learner.flashcards.session.keyTakeawayHeading"),
                  answerChoicesHeading: t("learner.flashcards.session.answerChoicesHeading"),
                  distractorAnalysisHeading: t("learner.flashcards.session.rationaleStepWhyWrong"),
                  emptyPearlMessage: t("learner.flashcards.session.clinicalPearlMissing"),
                }}
              />
            </div>

            {revealed ? (
              <div className="space-y-3">
                <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--semantic-text-secondary)]">
                  {t("learner.flashcards.session.howWellLabel")}
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submitRating("incorrect")}
                    className="flex min-h-[5.25rem] items-start gap-2 rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-danger)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-3 py-4 text-left text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm disabled:opacity-40"
                  >
                    <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
                    <span>
                      <span className="block text-[10px] text-[var(--semantic-danger)]">
                        {t("learner.flashcards.session.ratingRowIncorrect")}
                      </span>
                      <span className="mt-1 block leading-snug">{t("learner.flashcards.session.ratingSubIncorrect")}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submitRating("unsure")}
                    className="flex min-h-[5.25rem] items-start gap-2 rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-warning)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-3 py-4 text-left text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm disabled:opacity-40"
                  >
                    <RefreshCw className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-warning)]" aria-hidden />
                    <span>
                      <span className="block text-[10px] text-[var(--semantic-warning)]">
                        {t("learner.flashcards.session.ratingRowUnsure")}
                      </span>
                      <span className="mt-1 block leading-snug">{t("learner.flashcards.session.ratingSubUnsure")}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => void submitRating("known")}
                    className="flex min-h-[5.25rem] items-start gap-2 rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-success)_42%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] px-3 py-4 text-left text-sm font-semibold text-[var(--semantic-text-primary)] shadow-sm disabled:opacity-40"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                    <span>
                      <span className="block text-[10px] text-[var(--semantic-success)]">
                        {t("learner.flashcards.session.ratingRowKnown")}
                      </span>
                      <span className="mt-1 block leading-snug">{t("learner.flashcards.session.ratingSubKnown")}</span>
                    </span>
                  </button>
                </div>
              </div>
            ) : null}

            <p className="pb-2 text-center text-[10px] text-[var(--semantic-text-muted)]">
              {t("learner.flashcards.session.keyboardHint")}
            </p>
          </div>

          <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_color-mix(in_srgb,var(--semantic-text-primary)_6%,transparent)]">
            <div className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => applyItemState({ starred: !itemState.starred })}
                  className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] min-h-[44px]"
                >
                  {itemState.starred
                    ? t("learner.flashcards.session.starredState")
                    : t("learner.flashcards.session.starVerb")}
                </button>
                <button
                  type="button"
                  onClick={() => applyItemState({ confusing: !itemState.confusing })}
                  className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-2 text-xs font-semibold text-[var(--semantic-text-primary)] min-h-[44px]"
                >
                  {itemState.confusing
                    ? t("learner.flashcards.session.revisitState")
                    : t("learner.flashcards.session.markConfusingVerb")}
                </button>
                <Link
                  href={relatedLessonLink.href}
                  className="rounded-full border border-[var(--semantic-border-soft)] px-3 py-2 text-xs font-semibold text-[var(--semantic-brand)] min-h-[44px] inline-flex items-center"
                >
                  {t(relatedLessonLink.labelKey)}
                </Link>
              </div>
              <div className="flex flex-wrap items-center justify-end gap-2">
                <span className="mr-auto text-[11px] text-[var(--semantic-text-muted)] sm:mr-0 sm:px-2">
                  {t("learner.flashcards.session.bottomProgress", {
                    cur: index + 1,
                    total: queueLen,
                  })}
                </span>
                <button
                  type="button"
                  onClick={goPrevious}
                  disabled={index <= 0}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4 sm:mr-1" aria-hidden />
                  <span className="hidden sm:inline">{t("learner.flashcards.session.navPrevious")}</span>
                </button>
                <button
                  type="button"
                  onClick={goNext}
                  disabled={!revealed || index + 1 >= sessionCards.length}
                  className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-[var(--semantic-border-soft)] px-4 text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-40"
                >
                  <span className="hidden sm:inline">{t("learner.flashcards.session.reviewAgainNav")}</span>
                  <ChevronRight className="h-4 w-4 sm:ml-1" aria-hidden />
                </button>
              </div>
            </div>
            <label className="mx-auto mt-2 block max-w-2xl px-0 text-[11px] font-semibold text-[var(--semantic-text-muted)]">
              <span className="sr-only">{t("learner.flashcards.session.noteLabel")}</span>
              <textarea
                value={currentNote}
                onChange={(event) => {
                  const value = event.target.value;
                  setLocalNotes((prev) => ({ ...prev, [current.id]: value }));
                  applyItemState({ note: value });
                }}
                rows={2}
                placeholder={t("learner.flashcards.session.notePlaceholderShort")}
                className="mt-1 w-full rounded-lg border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--semantic-text-primary)]"
              />
            </label>
          </div>
        </div>
      ) : (
      <section className="grid min-w-0 gap-4 min-[1100px]:grid-cols-[minmax(0,1.15fr)_minmax(420px,1fr)]">
        <div className="min-w-0 rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
            {t("learner.flashcards.session.splitPromptHeading")}
          </p>
          <div className="nn-question-stem-card mt-2 text-left">
            <div className="nn-question-stem-wrap">
              <FlashcardRichContent text={current.prompt} />
            </div>
          </div>
          {current.examMicroQuestion ? (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--theme-muted-text)]">
                {t("learner.flashcards.session.answerChoicesHeading")}
              </p>
              <ul className="space-y-2" aria-label={t("learner.flashcards.session.answerChoicesHeading")}>
                {current.examMicroQuestion.answerOptions.map((o) => (
                  <li
                    key={o.letter}
                    className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-2)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_42%,var(--semantic-surface))] px-3 py-2.5 text-sm leading-snug text-[var(--semantic-text-primary)]"
                  >
                    <div className="flex gap-2">
                      <span className="shrink-0 font-mono text-xs font-bold text-[var(--semantic-chart-2)]">{o.letter}.</span>
                      <FlashcardRichContent text={o.text} className="min-w-0 flex-1 [&_p]:mb-1 [&_p:last-child]:mb-0" />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {current.topic || current.subtopic ? (
            <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
              {current.topic ?? t("learner.flashcards.session.topicGeneral")}
              {current.subtopic ? ` · ${current.subtopic}` : ""}
            </p>
          ) : null}

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              {t("learner.flashcards.session.flipCardCta")}
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                {t("learner.flashcards.session.correctAnswerLabel")}
              </p>
              <div className="mt-1 text-sm font-medium leading-relaxed text-[var(--theme-heading-text)]">
                <FlashcardRichContent text={current.answer} />
              </div>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goPrevious}
              disabled={index <= 0}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              {t("learner.flashcards.session.navPrevious")}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!revealed || index + 1 >= sessionCards.length}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              {t("learner.flashcards.session.reviewAgainNav")}
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {ratings.map((rating) => (
              <button
                key={rating.id}
                type="button"
                disabled={!revealed || saving}
                onClick={() => void submitRating(rating.id)}
                className="rounded-xl border border-border px-2 py-2 text-xs font-semibold text-[var(--theme-heading-text)] disabled:opacity-40"
              >
                {rating.label}
              </button>
            ))}
          </div>
        </div>

        <aside className="flex min-h-0 min-w-0 flex-col space-y-3">
          <div
            className={`min-h-0 min-w-0 max-h-[min(72vh,40rem)] overflow-x-hidden overflow-y-auto overscroll-contain rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm ${itemState.highlighted ? "ring-1 ring-[var(--semantic-brand)]" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              {t("learner.flashcards.session.rationaleAsideHeading")}
            </p>
            {!revealed ? (
              <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
                {t("learner.flashcards.session.revealToSeeRationale")}
              </p>
            ) : (
              <div className="mt-2 space-y-3 text-sm">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {t("learner.flashcards.session.rationaleStepCorrect")}
                  </h3>
                  <div className="mt-1 font-medium text-[var(--theme-heading-text)]">
                    <FlashcardRichContent text={current.answer} />
                  </div>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {t("learner.flashcards.session.rationaleStepWhyCorrect")}
                  </h3>
                  {current.explanation?.trim() ? (
                    <div className="mt-1 text-[var(--theme-heading-text)]">
                      <FlashcardRichContent text={current.explanation} />
                    </div>
                  ) : (
                    <p className="mt-1 text-[var(--theme-heading-text)]">
                      {t("learner.flashcards.session.explanationMissing")}
                    </p>
                  )}
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {t("learner.flashcards.session.rationaleStepWhyWrong")}
                  </h3>
                  {current.distractors && current.distractors.length > 0 ? (
                    <ul className="mt-1 space-y-1 text-[var(--theme-heading-text)]">
                      {current.distractors.map((d) => (
                        <li key={d.option}>
                          <span className="font-semibold">{d.option}:</span> {d.rationale}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-1 text-[var(--theme-muted-text)]">
                      {t("learner.flashcards.session.distractorMissing")}
                    </p>
                  )}
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {t("learner.flashcards.session.rationaleStepPearl")}
                  </h3>
                  <p className="mt-1 text-[var(--theme-heading-text)]">
                    {buildClinicalPearl(current, t("learner.flashcards.session.clinicalPearlMissing"))}
                  </p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    {t("learner.flashcards.session.rationaleStepRelated")}
                  </h3>
                  <Link
                    href={relatedLessonLink.href}
                    className="mt-1 inline-flex font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
                  >
                    {t(relatedLessonLink.labelKey)}
                  </Link>
                </section>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              {t("learner.flashcards.session.itemActionsHeading")}
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyItemState({ starred: !itemState.starred })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.starred
                  ? t("learner.flashcards.session.starredState")
                  : t("learner.flashcards.session.starForLater")}
              </button>
              <button
                type="button"
                onClick={() => applyItemState({ saved: !itemState.saved })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.saved
                  ? t("learner.flashcards.session.savedState")
                  : t("learner.flashcards.session.saveForLater")}
              </button>
              <button
                type="button"
                onClick={() => applyItemState({ confusing: !itemState.confusing })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.confusing
                  ? t("learner.flashcards.session.markedRevisit")
                  : t("learner.flashcards.session.markConfusingFull")}
              </button>
              <button
                type="button"
                onClick={() => applyItemState({ highlighted: !itemState.highlighted })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.highlighted
                  ? t("learner.flashcards.session.highlightedState")
                  : t("learner.flashcards.session.highlightRationale")}
              </button>
            </div>
            <label className="mt-3 block text-xs font-semibold text-[var(--theme-muted-text)]">
              {t("learner.flashcards.session.personalNoteLabel")}
              <textarea
                value={currentNote}
                onChange={(event) => {
                  const value = event.target.value;
                  setLocalNotes((prev) => ({ ...prev, [current.id]: value }));
                  applyItemState({ note: value });
                }}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--theme-heading-text)]"
                placeholder={t("learner.flashcards.session.notePlaceholder")}
              />
            </label>
          </div>
        </aside>
      </section>
      )}
    </div>
  );
}
