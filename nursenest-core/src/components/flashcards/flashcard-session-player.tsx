"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { BookmarkIcon, CheckCircle2, XCircle } from "lucide-react";
import {
  sessionRuntimeReducer,
} from "@/lib/flashcards/session-runtime-reducer";
import {
  recordAttemptAction,
  completeSessionAction,
} from "@/app/actions/flashcards/session-actions";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { flashcardDeckHref, STUDY_TOOL_ROUTES, withStudyToolPathwayQuery } from "@/lib/study-tools/study-tool-routes";
import type { HydratedSession, SessionCardPayload } from "@/lib/flashcards/session-runtime-types";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
import {
  CANONICAL_LEARNER_SURFACE_VERSION,
  type UnifiedExamWorkspaceMode,
} from "@/lib/exam-workspace/unified-exam-workspace";
import type { FlashcardItemKind } from "@prisma/client";

// ── Helpers ─────────────────────────────────────────────────────────────────

function toExamPayload(card: SessionCardPayload): ExamMicroQuestionPayload {
  return {
    itemKind: card.itemKind as FlashcardItemKind,
    questionStem: card.questionStem,
    answerOptions: card.answerOptions,
    correctLetter: card.correctLetter,
    rationaleCorrect: card.rationaleCorrect,
    rationaleIncorrect: card.rationaleIncorrect,
  };
}

// ── Types ────────────────────────────────────────────────────────────────────

type Props = {
  session: HydratedSession;
  deckId: string;
};

function hubHrefForPathway(pathwayId: string | null): string {
  const id = pathwayId?.trim().toLowerCase() ?? "";
  if (id.includes("pn") || id.includes("rpn") || id.includes("lpn")) {
    return "/canada/pn/nclex-pn";
  }
  return "/canada/rn/nclex-rn";
}

// ── Component ────────────────────────────────────────────────────────────────

export function FlashcardSessionPlayer({ session, deckId }: Props) {
  const [runtime, dispatch] = useReducer(sessionRuntimeReducer, session.runtime);
  const recordedRef = useRef(new Set<string>());

  const currentCard = runtime.cards[runtime.currentIndex];
  const currentPayload = session.cards.find((c) => c.cardId === currentCard?.cardId);
  const isLastCard = runtime.currentIndex >= runtime.totalCards - 1;

  // ── Keyboard shortcuts ───────────────────────────────────────────────────

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "ArrowRight" && currentCard?.state === "REVEALED") {
        void handleAdvance();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentCard?.state, runtime.currentIndex]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  function handlePickLetter(letter: string) {
    if (!currentCard) return;
    dispatch({ type: "PICK_ANSWER", cardId: currentCard.cardId, selectedAnswerId: letter });
  }

  function handleReveal() {
    if (!currentCard || !currentPayload) return;
    if (currentCard.state !== "ANSWERED") return;
    const correct = currentCard.selectedAnswerId === currentPayload.correctLetter;
    dispatch({ type: "REVEAL", cardId: currentCard.cardId, correct });
  }

  const handleAdvance = useCallback(async () => {
    if (!currentCard || currentCard.state !== "REVEALED") return;

    if (!recordedRef.current.has(currentCard.cardId) && currentCard.attempt) {
      recordedRef.current.add(currentCard.cardId);
      void recordAttemptAction({
        sessionId: runtime.sessionId,
        flashcardId: currentCard.cardId,
        selectedKey: currentCard.selectedAnswerId ?? null,
        isCorrect: currentCard.attempt.correct,
        guessed: currentCard.attempt.guessed ?? false,
        confidence: currentCard.attempt.confidence ?? null,
        bookmarked: currentCard.attempt.bookmarked ?? false,
      });
    }

    if (isLastCard) {
      dispatch({ type: "COMPLETE" });
      void completeSessionAction(runtime.sessionId);
    } else {
      dispatch({ type: "ADVANCE" });
    }
  }, [currentCard, isLastCard, runtime.sessionId]);

  // ── Completion screen ────────────────────────────────────────────────────

  if (runtime.completed) {
    const { correct, incorrect } = runtime.metrics;
    const pct = runtime.totalCards > 0 ? Math.round((correct / runtime.totalCards) * 100) : 0;
    const flashcardsHref = withStudyToolPathwayQuery(STUDY_TOOL_ROUTES.flashcardsHub, session.deck.pathwayId);
    const hubHref = hubHrefForPathway(session.deck.pathwayId);
    const hubLabel = hubHref.includes("/pn/") ? "Back to PN Hub" : "Back to RN Hub";

    return (
      <div
        data-nn-flashcard-study-session=""
        className="mx-auto max-w-lg px-4 py-12 text-center"
      >
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 shadow-sm">
          <h2 className="text-xl font-semibold text-[var(--semantic-text-primary)]">
            Session Complete
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Great work — review another deck or return to the {hubLabel.replace("Back to ", "")}.
          </p>
          <p className="mt-1 text-xs text-[var(--semantic-text-muted)]">{session.deck.title}</p>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-success)_20%,var(--semantic-border-soft))] p-3">
              <div className="text-2xl font-bold text-[var(--semantic-success)]">{correct}</div>
              <div className="text-xs text-[var(--semantic-text-muted)]">Correct</div>
            </div>
            <div className="rounded-xl bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-danger)_20%,var(--semantic-border-soft))] p-3">
              <div className="text-2xl font-bold text-[var(--semantic-danger)]">{incorrect}</div>
              <div className="text-xs text-[var(--semantic-text-muted)]">Incorrect</div>
            </div>
          </div>

          <p className="mt-3 text-2xl font-bold text-[var(--semantic-text-primary)]">{pct}%</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={flashcardsHref}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95"
              style={{ background: "var(--role-cta, var(--semantic-brand))" }}
            >
              Back to Flashcards
            </Link>
            <Link
              href={hubHref}
              className="inline-flex min-h-11 flex-1 items-center justify-center rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-[var(--semantic-text-primary)] transition hover:border-[var(--semantic-brand)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))]"
            >
              {hubLabel}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard || !currentPayload) {
    return (
      <div
        data-nn-flashcard-study-session=""
        className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--semantic-text-secondary)]"
      >
        No cards available.
      </div>
    );
  }

  const exam = toExamPayload(currentPayload);
  const isRevealed = currentCard.state === "REVEALED";
  const isAnswered = currentCard.state === "ANSWERED" || isRevealed;
  const attempt = currentCard.attempt;

  const incorrectRationale =
    isRevealed && !attempt?.correct && currentCard.selectedAnswerId
      ? currentPayload.rationaleIncorrect.find(
          (r) => r.letter === currentCard.selectedAnswerId,
        )?.rationale
      : null;

  const progressPct = Math.round((runtime.currentIndex / runtime.totalCards) * 100);

  return (
    /*
     * data-nn-flashcard-study-session unlocks the page from the locked-viewport
     * exam CSS that would otherwise clip content below the fold.
     * See learner-global.css and globals.css :has([data-nn-flashcard-study-session]) overrides.
     */
    <div
      data-nn-flashcard-study-session=""
      data-nn-canonical-learner-surface={CANONICAL_LEARNER_SURFACE_VERSION}
      data-nn-unified-exam-workspace=""
      data-nn-exam-workspace-mode={"flashcards" satisfies UnifiedExamWorkspaceMode}
      className="flex flex-col"
    >
      {/* ── Compact progress header ── */}
      <div className="shrink-0 border-b border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] px-4 py-2.5">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          <Link
            href={flashcardDeckHref(deckId)}
            className="shrink-0 text-sm font-medium text-[var(--semantic-brand)] hover:underline underline-offset-4"
          >
            ← Deck
          </Link>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[var(--semantic-text-muted)]">
                {runtime.currentIndex + 1} of {runtime.totalCards}
              </span>
              <span className="text-xs text-[var(--semantic-text-muted)]">
                {runtime.metrics.correct} correct
              </span>
            </div>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[var(--semantic-border-soft)]">
              <div
                className="h-full rounded-full bg-[var(--semantic-brand)] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Main content ── */}
      <div className="mx-auto w-full max-w-5xl px-4 py-5 pb-10">
        {isRevealed && attempt ? (
          /* ── Revealed: two-column grid ── */
          <div className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr] lg:gap-6 lg:items-start">
            {/* Left: question + locked answers */}
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm">
              <div
                className={`mb-4 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold ${
                  attempt.correct
                    ? "bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))] text-[var(--semantic-success)]"
                    : "bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-danger)_25%,var(--semantic-border-soft))] text-[var(--semantic-danger)]"
                }`}
              >
                {attempt.correct ? (
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                ) : (
                  <XCircle className="h-4 w-4 shrink-0" />
                )}
                {attempt.correct ? "Correct" : "Incorrect"}
              </div>

              <p className="mb-4 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
                {currentPayload.questionStem}
              </p>

              <FlashcardExamMcqAnswerList
                exam={exam}
                revealed={true}
                pickedLetter={currentCard.selectedAnswerId ?? null}
                tutorMcq={false}
                answerChoicesHeading=""
                revealHint=""
                onPickLetter={undefined}
              />
            </div>

            {/* Right: rationale + confidence + bookmark + next */}
            <div className="flex flex-col gap-3">
              {incorrectRationale && (
                <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm">
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                    Why that answer is incorrect
                  </p>
                  <p className="leading-relaxed text-[var(--semantic-text-secondary)]">
                    {incorrectRationale}
                  </p>
                </div>
              )}

              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 text-sm">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--semantic-text-muted)]">
                  Rationale
                </p>
                <p className="leading-relaxed text-[var(--semantic-text-secondary)]">
                  {currentPayload.rationaleCorrect}
                </p>
              </div>

              {/* Confidence */}
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-3">
                <p className="mb-2 text-xs font-semibold text-[var(--semantic-text-muted)]">
                  How confident are you?
                </p>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() =>
                        dispatch({
                          type: "SET_CONFIDENCE",
                          cardId: currentCard.cardId,
                          confidence: n,
                        })
                      }
                      className={`h-7 w-7 rounded-full text-xs font-semibold transition ${
                        attempt?.confidence === n
                          ? "bg-[var(--semantic-brand)] nn-text-on-solid-fill"
                          : "border border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-brand)]"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bookmark + Guessed */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "TOGGLE_BOOKMARK", cardId: currentCard.cardId })
                  }
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    attempt?.bookmarked
                      ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                      : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-brand)]"
                  }`}
                >
                  <BookmarkIcon className="h-3.5 w-3.5" />
                  {attempt?.bookmarked ? "Bookmarked" : "Bookmark"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      type: "SET_GUESSED",
                      cardId: currentCard.cardId,
                      guessed: !(attempt?.guessed ?? false),
                    })
                  }
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                    attempt?.guessed
                      ? "border-[var(--semantic-warning)] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-warning)]"
                      : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-warning)]"
                  }`}
                >
                  {attempt?.guessed ? "Guessed ✓" : "I guessed"}
                </button>
              </div>

              <button
                type="button"
                onClick={() => void handleAdvance()}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95"
                style={{ background: "var(--role-cta, var(--semantic-brand))" }}
              >
                {isLastCard ? "Finish Session" : "Next Card →"}
              </button>
            </div>
          </div>
        ) : (
          /* ── Pre-answer: single centered column ── */
          <div className="mx-auto max-w-2xl">
            <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm">
              <p className="mb-4 text-sm leading-relaxed text-[var(--semantic-text-primary)]">
                {currentPayload.questionStem}
              </p>

              <FlashcardExamMcqAnswerList
                exam={exam}
                revealed={false}
                pickedLetter={currentCard.selectedAnswerId ?? null}
                tutorMcq={!isAnswered}
                answerChoicesHeading="Select the best answer"
                revealHint={
                  isAnswered
                    ? "Click Check Answer to see rationale"
                    : "Select an answer above"
                }
                onPickLetter={!isAnswered ? handlePickLetter : undefined}
              />

              {currentCard.state === "ANSWERED" && !isRevealed && (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={handleReveal}
                    className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95"
                    style={{ background: "var(--role-cta, var(--semantic-brand))" }}
                  >
                    Check Answer ↵
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
