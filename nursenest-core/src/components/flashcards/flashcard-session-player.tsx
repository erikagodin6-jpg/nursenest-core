"use client";

import { useReducer, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookmarkIcon, CheckCircle2, XCircle } from "lucide-react";
import {
  sessionRuntimeReducer,
} from "@/lib/flashcards/session-runtime-reducer";
import {
  recordAttemptAction,
  completeSessionAction,
} from "@/app/actions/flashcards/session-actions";
import { FlashcardExamMcqAnswerList } from "@/components/flashcards/flashcard-exam-mcq-answer-list";
import { flashcardDeckHref, STUDY_TOOL_ROUTES } from "@/lib/study-tools/study-tool-routes";
import type { HydratedSession, SessionCardPayload } from "@/lib/flashcards/session-runtime-types";
import type { ExamMicroQuestionPayload } from "@/lib/flashcards/flashcard-exam-style";
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

// ── Component ────────────────────────────────────────────────────────────────

export function FlashcardSessionPlayer({ session, deckId }: Props) {
  const router = useRouter();
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

    // Record attempt with final confidence/bookmark/guessed state
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
    const { correct, incorrect, guessed, bookmarked } = runtime.metrics;
    const pct = runtime.totalCards > 0 ? Math.round((correct / runtime.totalCards) * 100) : 0;

    return (
      <div className="mx-auto max-w-lg px-4 py-12 text-center">
        <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-8 shadow-sm">
          <div className="text-4xl mb-3">{pct >= 80 ? "🎯" : pct >= 60 ? "📚" : "💪"}</div>
          <h2 className="text-xl font-bold text-[var(--semantic-text-primary)]">
            Session complete
          </h2>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            {session.deck.title}
          </p>

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

          {(bookmarked > 0 || guessed > 0) && (
            <p className="mt-3 text-xs text-[var(--semantic-text-muted)]">
              {bookmarked > 0 && <span>{bookmarked} bookmarked</span>}
              {bookmarked > 0 && guessed > 0 && " · "}
              {guessed > 0 && <span>{guessed} guessed</span>}
            </p>
          )}

          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95"
              style={{ background: "var(--role-cta, var(--semantic-brand))" }}
              onClick={() => router.push(flashcardDeckHref(deckId))}
            >
              Back to deck
            </button>
            <Link
              href={STUDY_TOOL_ROUTES.flashcardsDecks}
              className="w-full rounded-xl border border-[var(--semantic-border-soft)] px-4 py-2.5 text-sm font-semibold text-center text-[var(--semantic-text-primary)] hover:border-[var(--semantic-brand)]"
            >
              All decks
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard || !currentPayload) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-sm text-[var(--semantic-text-secondary)]">
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

  const progressPct = Math.round(((runtime.currentIndex) / runtime.totalCards) * 100);

  return (
    <div className="mx-auto max-w-2xl px-4 py-6 space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between gap-4">
        <Link
          href={flashcardDeckHref(deckId)}
          className="text-sm text-[var(--semantic-brand)] hover:underline underline-offset-4"
        >
          ← Back
        </Link>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-[var(--semantic-text-muted)]">
              {runtime.currentIndex + 1} / {runtime.totalCards}
            </span>
            <span className="text-xs text-[var(--semantic-text-muted)]">
              {runtime.metrics.correct} correct
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-[var(--semantic-border-soft)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--semantic-brand)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── Card ── */}
      <div className="rounded-2xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-6 shadow-sm">
        {/* Question stem */}
        <p className="text-[var(--semantic-text-primary)] leading-relaxed text-base">
          {currentPayload.questionStem}
        </p>

        {/* Answer options */}
        <FlashcardExamMcqAnswerList
          exam={exam}
          revealed={isRevealed}
          pickedLetter={currentCard.selectedAnswerId ?? null}
          tutorMcq={!isRevealed}
          answerChoicesHeading="Select the best answer"
          revealHint={isAnswered ? "Click Check Answer to see rationale" : "Select an answer above"}
          onPickLetter={!isAnswered ? handlePickLetter : undefined}
        />

        {/* Check answer button */}
        {currentCard.state === "ANSWERED" && !isRevealed && (
          <div className="mt-5">
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

        {/* Rationale panel */}
        {isRevealed && attempt && (
          <div className="mt-5 space-y-4">
            {/* Correct / incorrect badge */}
            <div
              className={`flex items-center gap-2 rounded-xl px-4 py-3 ${
                attempt.correct
                  ? "bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))]"
                  : "bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))] border border-[color-mix(in_srgb,var(--semantic-danger)_25%,var(--semantic-border-soft))]"
              }`}
            >
              {attempt.correct ? (
                <CheckCircle2 className="h-4 w-4 text-[var(--semantic-success)] shrink-0" />
              ) : (
                <XCircle className="h-4 w-4 text-[var(--semantic-danger)] shrink-0" />
              )}
              <span
                className={`text-sm font-semibold ${
                  attempt.correct
                    ? "text-[var(--semantic-success)]"
                    : "text-[var(--semantic-danger)]"
                }`}
              >
                {attempt.correct ? "Correct!" : "Incorrect"}
              </span>
            </div>

            {/* Distractor rationale */}
            {incorrectRationale && (
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-raised)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
                <span className="font-semibold text-[var(--semantic-text-primary)]">
                  Why {currentCard.selectedAnswerId} is incorrect:
                </span>{" "}
                {incorrectRationale}
              </div>
            )}

            {/* Correct rationale */}
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface-raised)] px-4 py-3 text-sm text-[var(--semantic-text-secondary)]">
              <span className="font-semibold text-[var(--semantic-text-primary)]">
                Rationale:
              </span>{" "}
              {currentPayload.rationaleCorrect}
            </div>

            {/* Controls row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Confidence */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[var(--semantic-text-muted)]">Confidence:</span>
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
                      attempt.confidence === n
                        ? "bg-[var(--semantic-brand)] nn-text-on-solid-fill"
                        : "border border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-brand)]"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>

              {/* Bookmark */}
              <button
                type="button"
                onClick={() =>
                  dispatch({ type: "TOGGLE_BOOKMARK", cardId: currentCard.cardId })
                }
                className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  attempt.bookmarked
                    ? "border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_10%,var(--semantic-surface))] text-[var(--semantic-brand)]"
                    : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-brand)]"
                }`}
              >
                <BookmarkIcon className="h-3.5 w-3.5" />
                {attempt.bookmarked ? "Bookmarked" : "Bookmark"}
              </button>

              {/* Guessed */}
              <button
                type="button"
                onClick={() =>
                  dispatch({
                    type: "SET_GUESSED",
                    cardId: currentCard.cardId,
                    guessed: !(attempt.guessed ?? false),
                  })
                }
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                  attempt.guessed
                    ? "border-[var(--semantic-warning)] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--semantic-warning)]"
                    : "border-[var(--semantic-border-soft)] text-[var(--semantic-text-secondary)] hover:border-[var(--semantic-warning)]"
                }`}
              >
                {attempt.guessed ? "Guessed ✓" : "I guessed"}
              </button>
            </div>

            {/* Advance button */}
            <button
              type="button"
              onClick={() => void handleAdvance()}
              className="w-full rounded-xl px-4 py-2.5 text-sm font-semibold nn-text-on-solid-fill transition hover:opacity-95 mt-1"
              style={{ background: "var(--role-cta, var(--semantic-brand))" }}
            >
              {isLastCard ? "Finish Session" : "Next Card →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
