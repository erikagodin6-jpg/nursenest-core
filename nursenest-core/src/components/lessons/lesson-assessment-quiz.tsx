"use client";

/**
 * Interactive lesson assessment quiz runner.
 *
 * Renders questions one at a time with MCQ buttons. After the learner
 * selects an answer the correct option and rationale are revealed.
 * Navigation is forward-only (Next / Finish). On completion, `onComplete`
 * is called with the final score.
 *
 * Designed to be embedded inside both the pre- and post-assessment cards.
 * Does NOT make API calls — the parent card is responsible for persistence.
 */

import { useState, useId } from "react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

// ─── Option letters ────────────────────────────────────────────────────────────

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;

// ─── Types ─────────────────────────────────────────────────────────────────────

type QuestionState =
  | { phase: "unanswered" }
  | { phase: "answered"; selectedIndex: number; correct: boolean };

type QuizState =
  | { phase: "in_progress"; questionIndex: number; questionState: QuestionState; correctCount: number }
  | { phase: "complete"; score: number; total: number };

// ─── Single question card ──────────────────────────────────────────────────────

function QuestionCard({
  item,
  index,
  total,
  state,
  onSelect,
  onNext,
  isLast,
}: {
  item: PathwayLessonQuizItem;
  index: number;
  total: number;
  state: QuestionState;
  onSelect: (i: number) => void;
  onNext: () => void;
  isLast: boolean;
}) {
  const headingId = useId();

  return (
    <div
      className="flex flex-col gap-5"
      role="group"
      aria-labelledby={headingId}
    >
      {/* Question number */}
      <p
        className="text-xs font-semibold uppercase tracking-[0.15em]"
        style={{ color: "var(--semantic-text-secondary)" }}
        aria-hidden="true"
      >
        Question {index + 1} of {total}
      </p>

      {/* Stem */}
      <p
        id={headingId}
        className="text-base font-medium leading-7"
        style={{ color: "var(--theme-heading-text)" }}
      >
        {item.question}
      </p>

      {/* Options */}
      <ul className="flex flex-col gap-2.5" role="radiogroup" aria-label="Answer options">
        {item.options.map((opt, i) => {
          const isSelected = state.phase === "answered" && state.selectedIndex === i;
          const isCorrect = i === item.correct;
          const isRevealed = state.phase === "answered";

          let surface = "var(--semantic-surface)";
          let border = "var(--semantic-border-soft)";
          let labelColor = "var(--theme-body-text)";
          let badgeContent: string | null = null;

          if (isRevealed) {
            if (isCorrect) {
              surface = "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))";
              border = "color-mix(in srgb, var(--semantic-success) 45%, transparent)";
              labelColor = "var(--theme-heading-text)";
              badgeContent = "Correct";
            } else if (isSelected && !isCorrect) {
              surface = "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))";
              border = "color-mix(in srgb, var(--semantic-danger) 40%, transparent)";
              labelColor = "var(--theme-heading-text)";
              badgeContent = "Incorrect";
            }
          }

          return (
            <li key={i} role="none">
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                disabled={isRevealed}
                onClick={() => !isRevealed && onSelect(i)}
                className="w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
                style={{
                  background: isRevealed
                    ? surface
                    : isSelected
                    ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))"
                    : surface,
                  border: `1.5px solid ${
                    !isRevealed && isSelected
                      ? "color-mix(in srgb, var(--semantic-brand) 60%, transparent)"
                      : border
                  }`,
                  color: labelColor,
                  boxShadow: isSelected && !isRevealed ? "0 0 0 3px color-mix(in srgb, var(--semantic-brand) 15%, transparent)" : "none",
                }}
                aria-label={`Option ${OPTION_LABELS[i] ?? i + 1}: ${opt}`}
              >
                <span className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: isRevealed && isCorrect
                        ? "var(--semantic-success)"
                        : isRevealed && isSelected && !isCorrect
                        ? "var(--semantic-danger)"
                        : "color-mix(in srgb, var(--semantic-text-secondary) 18%, var(--semantic-surface))",
                      color: isRevealed && (isCorrect || isSelected)
                        ? "#fff"
                        : "var(--semantic-text-secondary)",
                    }}
                    aria-hidden="true"
                  >
                    {OPTION_LABELS[i] ?? i + 1}
                  </span>
                  <span className="flex-1 leading-6">{opt}</span>
                  {badgeContent ? (
                    <span
                      className="ml-auto shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold"
                      style={{
                        background: isCorrect
                          ? "color-mix(in srgb, var(--semantic-success) 15%, transparent)"
                          : "color-mix(in srgb, var(--semantic-danger) 15%, transparent)",
                        color: isCorrect ? "var(--semantic-success)" : "var(--semantic-danger)",
                      }}
                    >
                      {badgeContent}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Rationale reveal */}
      {state.phase === "answered" && item.rationale ? (
        <div
          className="rounded-xl border-l-4 px-4 py-3 text-sm leading-6"
          style={{
            borderLeftColor: "var(--semantic-info)",
            background: "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
            color: "var(--theme-body-text)",
          }}
        >
          <span className="font-semibold" style={{ color: "var(--semantic-info)" }}>
            Why:{" "}
          </span>
          {item.rationale}
        </div>
      ) : null}

      {/* Navigation */}
      {state.phase === "answered" ? (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={onNext}
            className="rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, #fff)",
            }}
          >
            {isLast ? "Finish quiz" : "Next question →"}
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ─── Progress bar ──────────────────────────────────────────────────────────────

function QuizProgressBar({ current, total }: { current: number; total: number }) {
  const pct = total > 0 ? Math.round((current / total) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div
        className="nn-progress-track-semantic h-1.5 flex-1 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-label="Quiz progress"
      >
        <div
          className="nn-progress-fill-semantic-info h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span
        className="shrink-0 text-xs tabular-nums"
        style={{ color: "var(--semantic-text-secondary)" }}
      >
        {current}/{total}
      </span>
    </div>
  );
}

// ─── Score summary ─────────────────────────────────────────────────────────────

export function QuizScoreSummary({
  score,
  total,
  label = "Your score",
}: {
  score: number;
  total: number;
  label?: string;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const fillClass =
    pct >= 80
      ? "nn-progress-fill-semantic-success"
      : pct >= 60
      ? "nn-progress-fill-semantic-info"
      : pct >= 40
      ? "nn-progress-fill-semantic-warning"
      : "nn-progress-fill-semantic-danger";

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium" style={{ color: "var(--semantic-text-secondary)" }}>
          {label}
        </span>
        <span
          className="text-2xl font-bold tabular-nums"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {score}/{total}
          <span
            className="ml-2 text-base font-semibold"
            style={{ color: "var(--semantic-text-secondary)" }}
          >
            ({pct}%)
          </span>
        </span>
      </div>
      <div
        className="nn-progress-track-semantic h-3 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={`${fillClass} h-full rounded-full transition-all duration-700`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main runner ───────────────────────────────────────────────────────────────

export type QuizCompleteResult = { score: number; total: number };

export function LessonAssessmentQuiz({
  items,
  onComplete,
  onItemGraded,
}: {
  items: PathwayLessonQuizItem[];
  onComplete: (result: QuizCompleteResult) => void;
  /** Fires after each answered question (before advancing). Optional weak-area / analytics hook. */
  onItemGraded?: (args: { index: number; correct: boolean; selectedIndex: number }) => void;
}) {
  const [state, setState] = useState<QuizState>({
    phase: "in_progress",
    questionIndex: 0,
    questionState: { phase: "unanswered" },
    correctCount: 0,
  });

  if (state.phase === "complete") {
    // Parent shows the score UI — this shouldn't stay mounted
    return null;
  }

  const { questionIndex, questionState, correctCount } = state;
  const item = items[questionIndex];
  if (!item) return null;

  const isLast = questionIndex === items.length - 1;

  function handleSelect(selectedIndex: number) {
    if (state.phase !== "in_progress") return;
    if (state.questionState.phase === "answered") return;
    const correct = selectedIndex === item!.correct;
    setState((prev) => {
      if (prev.phase !== "in_progress") return prev;
      return {
        ...prev,
        questionState: { phase: "answered", selectedIndex, correct },
      };
    });
  }

  function handleNext() {
    if (state.phase !== "in_progress") return;
    if (state.questionState.phase !== "answered") return;
    const gained = state.questionState.correct ? 1 : 0;
    const newCorrect = correctCount + gained;
    const nextIndex = questionIndex + 1;
    if (state.questionState.phase === "answered") {
      onItemGraded?.({
        index: questionIndex,
        correct: state.questionState.correct,
        selectedIndex: state.questionState.selectedIndex,
      });
    }

    if (nextIndex >= items.length) {
      setState({ phase: "complete", score: newCorrect, total: items.length });
      onComplete({ score: newCorrect, total: items.length });
    } else {
      setState({
        phase: "in_progress",
        questionIndex: nextIndex,
        questionState: { phase: "unanswered" },
        correctCount: newCorrect,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <QuizProgressBar current={questionIndex} total={items.length} />
      <QuestionCard
        item={item}
        index={questionIndex}
        total={items.length}
        state={questionState}
        onSelect={handleSelect}
        onNext={handleNext}
        isLast={isLast}
      />
    </div>
  );
}
