"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useMarketingI18n } from "@/lib/marketing-i18n";
import {
  getStudyItemState,
  setStudyItemState,
  type StudyItemState,
} from "@/lib/flashcards/study-session-persistence";
import { resolveFlashcardRelatedLessonLink } from "@/lib/flashcards/flashcard-study-links";
import { ExamSessionThemeTrigger } from "@/components/exam/exam-session-theme-trigger";

export type ActiveStudyCard = {
  id: string;
  prompt: string;
  answer: string;
  explanation?: string;
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
   * `card` = FAQ-aligned two-column flashcard study: stem/controls left, answer + rationale + takeaway right (same product layout as practice questions).
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

const RATINGS: Array<{ id: "incorrect" | "unsure" | "known"; label: string }> = [
  { id: "incorrect", label: "Incorrect" },
  { id: "unsure", label: "Unsure" },
  { id: "known", label: "Known" },
];

function buildClinicalPearl(card: ActiveStudyCard): string {
  if (card.explanation?.trim()) {
    const firstSentence = card.explanation
      .split(".")
      .map((part) => part.trim())
      .find(Boolean);
    if (firstSentence) return firstSentence.endsWith(".") ? firstSentence : `${firstSentence}.`;
  }
  return "A clinical pearl is not available for this item yet.";
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
  const [sessionCards, setSessionCards] = useState<ActiveStudyCard[]>(dedupedCards);
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
    setSessionCards(dedupedCards);
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
        label: "Browse Related Lessons" as const,
      };

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
    setSessionCards(nextCards);
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
      await onRate?.(current.id, rating);
      setReviewedIds((prev) => ({ ...prev, [current.id]: true }));
      setRatingStats((prev) => ({
        known: prev.known + (rating === "known" ? 1 : 0),
        unsure: prev.unsure + (rating === "unsure" ? 1 : 0),
        incorrect: prev.incorrect + (rating === "incorrect" ? 1 : 0),
      }));
      if (index >= sessionCards.length - 1) {
        setCompleted(true);
        setCompletedCount(sessionCards.length);
        onSessionComplete?.();
        return;
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
        Preparing Study Session…
      </div>
    );
  }

  if (!current) {
    return (
      <div className="rounded-xl border border-border p-5 text-sm text-[var(--theme-muted-text)]">
        No items match this Study Session.
      </div>
    );
  }

  if (completed) {
    return (
      <div className="space-y-4">
        <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Session Complete</p>
          <h2 className="mt-1 text-lg font-bold text-[var(--theme-heading-text)]">{header.sessionTitle}</h2>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            You completed {completedCount} item{completedCount === 1 ? "" : "s"} in {header.modeLabel}.
          </p>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            This session:{" "}
            <span className="font-semibold text-[var(--semantic-success)]">{ratingStats.known} knew</span>
            {" · "}
            <span className="font-semibold text-[var(--semantic-warning)]">{ratingStats.unsure} unsure</span>
            {" · "}
            <span className="font-semibold text-[var(--semantic-danger)]">{ratingStats.incorrect} missed</span>
          </p>
          <p className="mt-1 text-xs text-[var(--theme-muted-text)]">Categories: {header.categoriesLabel}</p>
        </section>

        <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Completion Summary</p>
          <div className="mt-2 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Total Items Completed</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completedCount}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Starred</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.starred}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Saved / Bookmarked</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.saved}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Revisit / Confusing</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.confusing}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Notes</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.noted}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Items Rated</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.reviewedCount}</p>
            </div>
            <div className="rounded-xl border border-border px-3 py-2 text-sm">
              <p className="text-xs text-[var(--theme-muted-text)]">Rationale Highlights</p>
              <p className="font-semibold text-[var(--theme-heading-text)]">{completionSummary.highlighted}</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Next Actions</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {completionSummary.revisitCards.length > 0 ? (
              <button
                type="button"
                onClick={() => restartWith(completionSummary.revisitCards)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                Study Revisit Items
              </button>
            ) : null}
            {completionSummary.starredCards.length > 0 ? (
              <button
                type="button"
                onClick={() => restartWith(completionSummary.starredCards)}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
              >
                Study Starred Items
              </button>
            ) : null}
            <button
              type="button"
              onClick={restartCurrentSession}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              Start New Session
            </button>
            <Link
              href={header.exitHref}
              onClick={onExit}
              className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              Exit Back to Flashcards
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              Study Session
            </p>
            <h1 className="text-lg font-bold text-[var(--theme-heading-text)]">{header.sessionTitle}</h1>
            <p className="text-xs text-[var(--theme-muted-text)]">
              {progressLabel} · {header.modeLabel} · {header.categoriesLabel}
            </p>
            <p className="mt-1 text-[10px] text-[var(--theme-muted-text)]">
              Keyboard: Space/Enter to reveal · ←/→ to navigate · After reveal: 1 Incorrect · 2 Unsure · 3 Known
            </p>
            {(typeof sessionMeta?.requestedCount === "number" ||
              typeof sessionMeta?.returnedCount === "number") ? (
              <p className="mt-1 text-xs text-[var(--theme-muted-text)]">
                Requested {sessionMeta?.requestedCount ?? sessionCount} · Loaded{" "}
                {sessionMeta?.returnedCount ?? sessionCount}
                {typeof sessionMeta?.totalAvailable === "number"
                  ? ` · Available ${sessionMeta.totalAvailable}`
                  : ""}
                {sessionMeta?.hasMore ? " · More Available" : ""}
              </p>
            ) : null}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <ExamSessionThemeTrigger />
            <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-muted-text)]">
              Progress: {progressLabel}
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]">
              {ratingStats.known} knew
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]">
              {ratingStats.unsure} unsure
            </span>
            <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-danger)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] px-2.5 py-1 text-[11px] font-semibold text-[var(--semantic-text-primary)]">
              {ratingStats.incorrect} missed
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
              Exit Session
            </Link>
          </div>
        </div>
      </section>

      {layout === "card" ? (
        <>
          <div className="nn-progress-track-semantic nn-progress-track-semantic--md">
            <div
              className="h-full rounded-full nn-progress-fill-semantic-brand transition-[width] duration-500"
              style={{ width: `${Math.min(100, ((index + 1) / sessionCount) * 100)}%` }}
            />
          </div>

          <div className="nn-question-session--split px-0 pb-0 pt-1">
            <div className="nn-question-session-primary space-y-4">
              <div
                role="button"
                tabIndex={0}
                onClick={() => !revealed && setRevealed(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    if (!revealed) setRevealed(true);
                  }
                }}
                className={`nn-question-stem-card text-left ${
                  !revealed
                    ? "cursor-pointer transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-panel-warm)_45%,var(--semantic-surface))]"
                    : ""
                }`}
              >
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--semantic-text-muted)]">
                  {sessionMode === "test" ? "Test mode · Front" : "Card front"}
                </p>
                <div className="nn-question-stem-wrap !mb-0 !border-b-0 !pb-0">
                  <p className="nn-question-stem">{current.prompt}</p>
                </div>
                {current.topic || current.subtopic ? (
                  <p className="mt-3 text-xs text-[var(--semantic-text-secondary)]">
                    {current.topic ?? "General"}
                    {current.subtopic ? ` · ${current.subtopic}` : ""}
                  </p>
                ) : null}
                {!revealed ? (
                  <p className="mt-5 text-center text-[10px] font-semibold uppercase tracking-widest text-[var(--semantic-text-secondary)]">
                    Tap or press Space to reveal — answer & rationale on the right
                  </p>
                ) : null}
              </div>

              {revealed ? (
                <>
                  <div className="space-y-3 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                    <p className="text-center text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--semantic-text-secondary)]">
                      How well did you know this?
                    </p>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void submitRating("incorrect")}
                        className="min-h-[88px] rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_8%,var(--semantic-surface))] px-3 py-4 text-left text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-40"
                      >
                        <span className="block text-[10px] text-[var(--semantic-danger)]">1 · Incorrect</span>
                        <span className="mt-1 block">Need more review</span>
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void submitRating("unsure")}
                        className="min-h-[88px] rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] px-3 py-4 text-left text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-40"
                      >
                        <span className="block text-[10px] text-[var(--semantic-warning)]">2 · Unsure</span>
                        <span className="mt-1 block">Almost there</span>
                      </button>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() => void submitRating("known")}
                        className="min-h-[88px] rounded-2xl border-2 border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] px-3 py-4 text-left text-sm font-semibold text-[var(--semantic-text-primary)] disabled:opacity-40"
                      >
                        <span className="block text-[10px] text-[var(--semantic-success)]">3 · Known</span>
                        <span className="mt-1 block">Got it</span>
                      </button>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--theme-card-bg)] p-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Card tools</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => applyItemState({ starred: !itemState.starred })}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                      >
                        {itemState.starred ? "Starred" : "Star"}
                      </button>
                      <button
                        type="button"
                        onClick={() => applyItemState({ confusing: !itemState.confusing })}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                      >
                        {itemState.confusing ? "Revisit" : "Mark confusing"}
                      </button>
                      <button
                        type="button"
                        onClick={goPrevious}
                        disabled={index <= 0}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
                      >
                        Previous
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={!revealed || index + 1 >= sessionCards.length}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
                      >
                        Next
                      </button>
                    </div>
                    <label className="mt-3 block text-xs font-semibold text-[var(--theme-muted-text)]">
                      Note
                      <textarea
                        value={currentNote}
                        onChange={(event) => {
                          const value = event.target.value;
                          setLocalNotes((prev) => ({ ...prev, [current.id]: value }));
                          applyItemState({ note: value });
                        }}
                        rows={2}
                        className="mt-1 w-full rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm"
                      />
                    </label>
                  </div>

                  <p className="text-center text-[10px] text-[var(--theme-muted-text)]">
                    <Link href={relatedLessonLink.href} className="font-semibold text-[var(--semantic-brand)] underline">
                      {relatedLessonLink.label}
                    </Link>
                  </p>
                </>
              ) : null}
            </div>

            <aside className="nn-question-session-rationale space-y-4">
              {!revealed ? (
                <div className="nn-question-rationale-placeholder">
                  <p className="nn-marketing-caption font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    {t("learner.qbank.split.rationaleHeading")}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
                    {t("learner.flashcards.split.rationalePlaceholder")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                      Correct answer
                    </p>
                    <p className="mt-2 text-sm font-semibold leading-relaxed text-[var(--semantic-text-primary)]">
                      {current.answer}
                    </p>
                  </div>
                  <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 shadow-sm">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--semantic-text-muted)]">
                      Rationale
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
                      {current.explanation?.trim()
                        ? current.explanation
                        : "Detailed explanation is not available for this item yet."}
                    </p>
                  </div>
                  <div className="nn-rationale-key-point">
                    <p className="nn-rationale-key-point__label">
                      <span>Key takeaway</span>
                    </p>
                    <p className="nn-rationale-key-point__body">{buildClinicalPearl(current)}</p>
                  </div>
                </>
              )}
            </aside>
          </div>
        </>
      ) : (
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(300px,1fr)]">
        <div className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">Prompt</p>
          <h2 className="mt-2 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
            {current.prompt}
          </h2>
          {current.topic || current.subtopic ? (
            <p className="mt-2 text-xs text-[var(--theme-muted-text)]">
              {current.topic ?? "General"}
              {current.subtopic ? ` · ${current.subtopic}` : ""}
            </p>
          ) : null}

          {!revealed ? (
            <button
              type="button"
              onClick={() => setRevealed(true)}
              className="mt-4 rounded-xl border border-border px-4 py-2 text-sm font-semibold text-[var(--theme-heading-text)]"
            >
              Reveal Answer
            </button>
          ) : (
            <div className="mt-4 rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-panel-cool)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                Correct Answer
              </p>
              <p className="mt-1 text-sm font-medium leading-relaxed text-[var(--theme-heading-text)]">
                {current.answer}
              </p>
            </div>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={goPrevious}
              disabled={index <= 0}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={!revealed || index + 1 >= sessionCards.length}
              className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2">
            {RATINGS.map((rating) => (
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

        <aside className="space-y-3">
          <div
            className={`rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4 ${itemState.highlighted ? "ring-1 ring-[var(--semantic-brand)]" : ""}`}
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              Rationale
            </p>
            {!revealed ? (
              <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
                Reveal the answer to see detailed rationale.
              </p>
            ) : (
              <div className="mt-2 space-y-3 text-sm">
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    1. Correct Answer
                  </h3>
                  <p className="mt-1 font-medium text-[var(--theme-heading-text)]">{current.answer}</p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    2. Why It Is Correct
                  </h3>
                  <p className="mt-1 text-[var(--theme-heading-text)]">
                    {current.explanation ?? "Detailed explanation is not available for this item yet."}
                  </p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    3. Why the Other Options Are Wrong
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
                      Detailed distractor explanations are not available for this item yet.
                    </p>
                  )}
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    4. Clinical Pearl / Exam Tip
                  </h3>
                  <p className="mt-1 text-[var(--theme-heading-text)]">{buildClinicalPearl(current)}</p>
                </section>
                <section>
                  <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
                    5. Related Lesson Link
                  </h3>
                  <Link
                    href={relatedLessonLink.href}
                    className="mt-1 inline-flex font-semibold text-[var(--semantic-brand)] underline underline-offset-2"
                  >
                    {relatedLessonLink.label}
                  </Link>
                </section>
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-[var(--theme-card-bg)] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--theme-muted-text)]">
              Item Actions
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyItemState({ starred: !itemState.starred })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.starred ? "Starred" : "Star for Later"}
              </button>
              <button
                type="button"
                onClick={() => applyItemState({ saved: !itemState.saved })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.saved ? "Saved" : "Save for Later"}
              </button>
              <button
                type="button"
                onClick={() => applyItemState({ confusing: !itemState.confusing })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.confusing ? "Marked for Revisit" : "Mark as Confusing"}
              </button>
              <button
                type="button"
                onClick={() => applyItemState({ highlighted: !itemState.highlighted })}
                className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-[var(--theme-heading-text)]"
              >
                {itemState.highlighted ? "Highlighted" : "Highlight Rationale"}
              </button>
            </div>
            <label className="mt-3 block text-xs font-semibold text-[var(--theme-muted-text)]">
              Personal Note
              <textarea
                value={currentNote}
                onChange={(event) => {
                  const value = event.target.value;
                  setLocalNotes((prev) => ({ ...prev, [current.id]: value }));
                  applyItemState({ note: value });
                }}
                rows={3}
                className="mt-1 w-full rounded-lg border border-border bg-[var(--theme-card-bg)] px-3 py-2 text-sm text-[var(--theme-heading-text)]"
                placeholder="Capture your nursing takeaway for this item."
              />
            </label>
          </div>
        </aside>
      </section>
      )}
    </div>
  );
}
