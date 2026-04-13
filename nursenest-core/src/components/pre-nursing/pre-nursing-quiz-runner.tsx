"use client";

/**
 * Pre-Nursing Practice Quiz Runner.
 *
 * Fixed-set, non-adaptive quiz runner for module and mixed practice exams.
 * Renders questions one at a time using the same interaction pattern as
 * LessonAssessmentQuiz but accepts PreNursingQuestion (which includes difficulty
 * and moduleSlug in addition to the base quiz item fields).
 *
 * State machine:
 *   intro → in_progress → complete
 *
 * No API calls — all state lives in React state.
 */

import { useState } from "react";
import type { PreNursingQuestion } from "@/lib/pre-nursing/pre-nursing-question-bank";
import type { PreNursingExamResult } from "@/lib/pre-nursing/pre-nursing-exam-engine";
import { computePracticeExamResult } from "@/lib/pre-nursing/pre-nursing-exam-engine";
import { PreNursingExamResults } from "@/components/pre-nursing/pre-nursing-exam-results";
import type { PreNursingQuestionOverlay } from "@/lib/i18n/pre-nursing-content-overlay";
import { applyPreNursingQuestionsOverlay } from "@/lib/i18n/pre-nursing-content-overlay";

// ── Option labels ─────────────────────────────────────────────────────────────

const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;

// ── Difficulty badge ──────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Foundational",
  2: "Intermediate",
  3: "Advanced",
};

// ── Types ─────────────────────────────────────────────────────────────────────

type QuestionAnswer =
  | { phase: "unanswered" }
  | { phase: "answered"; selectedIndex: number; correct: boolean };

type RunnerState =
  | { phase: "intro" }
  | {
      phase: "in_progress";
      questionIndex: number;
      answerState: QuestionAnswer;
      correctAnswers: boolean[];
    }
  | { phase: "complete"; result: PreNursingExamResult };

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionCard({
  question,
  index,
  total,
  answerState,
  onSelect,
  onNext,
}: {
  question: PreNursingQuestion;
  index: number;
  total: number;
  answerState: QuestionAnswer;
  onSelect: (i: number) => void;
  onNext: () => void;
}) {
  const isLast = index === total - 1;
  const isRevealed = answerState.phase === "answered";

  return (
    <div className="flex flex-col gap-5">
      {/* Meta row */}
      <div className="flex items-center justify-between">
        <p
          className="text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--semantic-text-secondary)" }}
        >
          Question {index + 1} of {total}
        </p>
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-medium"
          style={{
            background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
            color: "var(--semantic-info)",
          }}
        >
          {DIFFICULTY_LABELS[question.difficulty]}
        </span>
      </div>

      {/* Stem */}
      <p
        className="text-base font-medium leading-7"
        style={{ color: "var(--theme-heading-text)" }}
      >
        {question.question}
      </p>

      {/* Options */}
      <ul className="flex flex-col gap-2.5" role="radiogroup" aria-label="Answer options">
        {question.options.map((opt, i) => {
          const isSelected = isRevealed && answerState.phase === "answered" && answerState.selectedIndex === i;
          const isCorrect = i === question.correct;

          let bg = "var(--semantic-surface)";
          let border = "var(--semantic-border-soft)";
          let badgeContent: string | null = null;

          if (isRevealed) {
            if (isCorrect) {
              bg = "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))";
              border = "color-mix(in srgb, var(--semantic-success) 45%, transparent)";
              if (isSelected) badgeContent = "Correct ✓";
              else badgeContent = "Correct answer";
            } else if (isSelected && !isCorrect) {
              bg = "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))";
              border = "color-mix(in srgb, var(--semantic-danger) 40%, transparent)";
              badgeContent = "Incorrect";
            }
          } else if (!isRevealed && answerState.phase === "unanswered") {
            // Hover/selected state when unanswered — not tracked per-option here
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
                style={{ background: bg, border: `1.5px solid ${border}`, color: "var(--theme-body-text)" }}
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
                      color: isRevealed && (isCorrect || isSelected) ? "#fff" : "var(--semantic-text-secondary)",
                    }}
                    aria-hidden="true"
                  >
                    {OPTION_LABELS[i] ?? String.fromCharCode(65 + i)}
                  </span>
                  <span className="flex-1 leading-6">{opt}</span>
                  {badgeContent && (
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
                  )}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Rationale */}
      {isRevealed && question.rationale && (
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
          {question.rationale}
        </div>
      )}

      {/* Navigation */}
      {isRevealed && (
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
            {isLast ? "See results →" : "Next question →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function ProgressBar({ current, total }: { current: number; total: number }) {
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
          className="nn-progress-fill-semantic-brand h-full rounded-full transition-all duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs tabular-nums" style={{ color: "var(--semantic-text-secondary)" }}>
        {current}/{total}
      </span>
    </div>
  );
}

// ── Intro screen ──────────────────────────────────────────────────────────────

function IntroScreen({
  title,
  description,
  questionCount,
  onStart,
}: {
  title: string;
  description: string;
  questionCount: number;
  onStart: () => void;
}) {
  return (
    <div className="flex flex-col gap-5 text-center">
      <div>
        <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--theme-heading-text)" }}>
          {title}
        </h2>
        <p className="text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
          {description}
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-4 text-sm">
        <span
          className="rounded-full px-3 py-1 font-medium"
          style={{
            background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
            color: "var(--semantic-info)",
          }}
        >
          {questionCount} questions
        </span>
        <span
          className="rounded-full px-3 py-1 font-medium"
          style={{
            background: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
            color: "var(--semantic-success)",
          }}
        >
          Instant feedback
        </span>
        <span
          className="rounded-full px-3 py-1 font-medium"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
            color: "var(--semantic-brand)",
          }}
        >
          No time limit
        </span>
      </div>
      <button
        type="button"
        onClick={onStart}
        className="mx-auto rounded-full px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
        style={{
          background: "var(--role-cta, var(--semantic-brand))",
          color: "var(--role-cta-foreground, #fff)",
        }}
      >
        Start practice exam
      </button>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type Props = {
  questions: PreNursingQuestion[];
  examTitle: string;
  examDescription?: string;
  examLabel?: string;
  /** Optional per-question overlay for non-English locales. */
  questionsOverlay?: Record<string, PreNursingQuestionOverlay>;
};

export function PreNursingQuizRunner({ questions, examTitle, examDescription, examLabel, questionsOverlay = {} }: Props) {
  // Apply locale overlay to all questions upfront for display; grading uses canonical `correct`
  const displayQuestions = Object.keys(questionsOverlay).length > 0
    ? applyPreNursingQuestionsOverlay(questions, questionsOverlay)
    : questions;
  const [state, setState] = useState<RunnerState>({ phase: "intro" });
  // Track which option was selected per question (for result computation)
  const correctAnswersRef = { value: [] as boolean[] };

  if (displayQuestions.length === 0) {
    return (
      <p className="text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
        No practice questions available for this module yet.
      </p>
    );
  }

  // ── Intro ──
  if (state.phase === "intro") {
    return (
      <IntroScreen
        title={examTitle}
        description={examDescription ?? `Test your knowledge with ${displayQuestions.length} practice questions. You'll get instant feedback and rationale after each answer.`}
        questionCount={displayQuestions.length}
        onStart={() =>
          setState({
            phase: "in_progress",
            questionIndex: 0,
            answerState: { phase: "unanswered" },
            correctAnswers: [],
          })
        }
      />
    );
  }

  // ── Complete ──
  if (state.phase === "complete") {
    return (
      <PreNursingExamResults
        result={state.result}
        examLabel={examLabel ?? examTitle}
        onRetry={() => setState({ phase: "intro" })}
      />
    );
  }

  // ── In progress ──
  const { questionIndex, answerState, correctAnswers } = state;
  const question = displayQuestions[questionIndex];
  // Canonical question for grading (correct index is immutable)
  const canonicalQuestion = questions[questionIndex];
  if (!question || !canonicalQuestion) return null;

  function handleSelect(selectedIndex: number) {
    if (state.phase !== "in_progress") return;
    if (state.answerState.phase === "answered") return;
    const correct = selectedIndex === canonicalQuestion!.correct;
    setState((prev) => {
      if (prev.phase !== "in_progress") return prev;
      return { ...prev, answerState: { phase: "answered", selectedIndex, correct } };
    });
    void correctAnswersRef;
  }

  function handleNext() {
    if (state.phase !== "in_progress") return;
    if (state.answerState.phase !== "answered") return;

    const newCorrectAnswers = [...correctAnswers, state.answerState.correct];
    const nextIndex = questionIndex + 1;

    if (nextIndex >= displayQuestions.length) {
      // Done — compute result (always use canonical questions for scoring)
      const result = computePracticeExamResult(questions, newCorrectAnswers);
      setState({ phase: "complete", result });
    } else {
      setState({
        phase: "in_progress",
        questionIndex: nextIndex,
        answerState: { phase: "unanswered" },
        correctAnswers: newCorrectAnswers,
      });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ProgressBar current={questionIndex} total={displayQuestions.length} />
      <QuestionCard
        question={question}
        index={questionIndex}
        total={questions.length}
        answerState={answerState}
        onSelect={handleSelect}
        onNext={handleNext}
      />
    </div>
  );
}
