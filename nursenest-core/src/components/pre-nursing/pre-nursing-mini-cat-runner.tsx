"use client";

/**
 * Pre-Nursing Mini CAT Runner.
 *
 * Lightweight adaptive exam for the pre-nursing course.
 * Uses pre-nursing-exam-engine.ts for question selection and ability tracking.
 *
 * Adaptive behavior:
 * - Starts at medium difficulty (ability 2.0)
 * - Correct → +0.5 ability (harder next question)
 * - Incorrect → −0.5 ability (easier next question)
 * - Early stops at 8+ questions if performance is clearly strong or beginner
 * - Hard stops at 15 questions
 *
 * State machine:
 *   intro → in_progress → complete
 */

import { useState, useCallback } from "react";
import type { PreNursingQuestion } from "@/lib/pre-nursing/pre-nursing-question-bank";
import {
  createMiniCatState,
  selectNextQuestion,
  recordAnswer,
  shouldStopMiniCat,
  computeMiniCatResult,
} from "@/lib/pre-nursing/pre-nursing-exam-engine";
import type { MiniCatState, PreNursingExamResult } from "@/lib/pre-nursing/pre-nursing-exam-engine";
import { PreNursingExamResults } from "@/components/pre-nursing/pre-nursing-exam-results";
import type { PreNursingQuestionOverlay } from "@/lib/i18n/pre-nursing-overlay-types";
import { applyPreNursingQuestionsOverlay } from "@/lib/i18n/pre-nursing-overlay-types";

// ── Constants ─────────────────────────────────────────────────────────────────

const DIFFICULTY_LABELS: Record<1 | 2 | 3, string> = {
  1: "Foundational",
  2: "Intermediate",
  3: "Advanced",
};

const DIFFICULTY_COLORS: Record<1 | 2 | 3, string> = {
  1: "var(--semantic-success)",
  2: "var(--semantic-info)",
  3: "var(--semantic-warning)",
};

const OPTION_LABELS = ["A", "B", "C", "D", "E"] as const;

// ── Types ─────────────────────────────────────────────────────────────────────

type AnswerState =
  | { phase: "unanswered" }
  | { phase: "answered"; selectedIndex: number; correct: boolean };

type RunnerPhase =
  | { phase: "intro" }
  | {
      phase: "in_progress";
      catState: MiniCatState;
      currentQuestion: PreNursingQuestion;
      answerState: AnswerState;
    }
  | { phase: "complete"; result: PreNursingExamResult };

// ── Subcomponents ─────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex flex-col gap-6 text-center">
      <div
        className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl text-2xl"
        style={{
          background: "color-mix(in srgb, var(--semantic-brand) 12%, var(--semantic-surface))",
        }}
      >
        🎯
      </div>
      <div>
        <h2 className="mb-2 text-xl font-bold" style={{ color: "var(--theme-heading-text)" }}>
          Pre-Nursing Mini Adaptive Exam
        </h2>
        <p className="mx-auto max-w-sm text-sm leading-6" style={{ color: "var(--semantic-text-secondary)" }}>
          This exam adapts to your level in real time. Answer confidently — difficulty adjusts based on your responses.
        </p>
      </div>

      <div className="mx-auto grid max-w-sm grid-cols-3 gap-3 text-center text-xs">
        {[
          { icon: "⏱", label: "10–15 min", desc: "Short and focused" },
          { icon: "🧠", label: "Adaptive", desc: "Adjusts to your level" },
          { icon: "✅", label: "Instant feedback", desc: "After each question" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center gap-1 rounded-xl p-3"
            style={{
              background: "var(--semantic-panel-cool)",
              border: "1px solid var(--semantic-border-soft)",
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-semibold" style={{ color: "var(--theme-heading-text)" }}>
              {item.label}
            </span>
            <span style={{ color: "var(--semantic-text-secondary)" }}>{item.desc}</span>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mx-auto rounded-full px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
        style={{
          background: "var(--role-cta, var(--semantic-brand))",
          color: "var(--role-cta-foreground, #fff)",
        }}
      >
        Start adaptive exam →
      </button>
      <p className="text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
        No account required · Results shown at the end
      </p>
    </div>
  );
}

function AdaptiveProgressBar({
  answered,
  maxQuestions,
  abilityEstimate,
}: {
  answered: number;
  maxQuestions: number;
  abilityEstimate: number;
}) {
  const pct = Math.round((answered / maxQuestions) * 100);
  // Map ability 1.0–3.0 → fill class
  const fillClass =
    abilityEstimate >= 2.5
      ? "nn-progress-fill-semantic-warning"
      : abilityEstimate >= 1.5
        ? "nn-progress-fill-semantic-info"
        : "nn-progress-fill-semantic-success";

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
        <span>Question {answered + 1}</span>
        <span>up to {maxQuestions} questions</span>
      </div>
      <div
        className="nn-progress-track-semantic h-1.5 overflow-hidden rounded-full"
        role="progressbar"
        aria-valuenow={answered}
        aria-valuemin={0}
        aria-valuemax={maxQuestions}
        aria-label="Exam progress"
      >
        <div
          className={`${fillClass} h-full rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CatQuestionCard({
  question,
  answered,
  answerState,
  onSelect,
  onNext,
}: {
  question: PreNursingQuestion;
  answered: number;
  answerState: AnswerState;
  onSelect: (i: number) => void;
  onNext: () => void;
}) {
  const isRevealed = answerState.phase === "answered";
  const diffColor = DIFFICULTY_COLORS[question.difficulty];

  return (
    <div className="flex flex-col gap-5">
      {/* Meta */}
      <div className="flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
          style={{
            background: `color-mix(in srgb, ${diffColor} 14%, var(--semantic-surface))`,
            color: diffColor,
          }}
        >
          {DIFFICULTY_LABELS[question.difficulty]}
        </span>
        <span className="text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
          Q{answered + 1}
        </span>
      </div>

      {/* Stem */}
      <p className="text-base font-medium leading-7" style={{ color: "var(--theme-heading-text)" }}>
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
              badgeContent = isSelected ? "Correct ✓" : "Correct answer";
            } else if (isSelected) {
              bg = "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))";
              border = "color-mix(in srgb, var(--semantic-danger) 40%, transparent)";
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
          <span className="font-semibold" style={{ color: "var(--semantic-info)" }}>Why: </span>
          {question.rationale}
        </div>
      )}

      {/* Next */}
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
            Next question →
          </button>
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

type MiniCatRunnerProps = {
  /** Optional per-question overlay for non-English locales. */
  questionsOverlay?: Record<string, PreNursingQuestionOverlay>;
};

export function PreNursingMiniCatRunner({ questionsOverlay = {} }: MiniCatRunnerProps) {
  const [phase, setPhase] = useState<RunnerPhase>({ phase: "intro" });

  const startExam = useCallback(() => {
    const state = createMiniCatState();
    const firstQuestion = selectNextQuestion(state);
    if (!firstQuestion) {
      // Fallback: no questions available
      return;
    }
    setPhase({
      phase: "in_progress",
      catState: state,
      currentQuestion: firstQuestion,
      answerState: { phase: "unanswered" },
    });
  }, []);

  if (phase.phase === "intro") {
    return <IntroScreen onStart={startExam} />;
  }

  if (phase.phase === "complete") {
    return (
      <PreNursingExamResults
        result={phase.result}
        examLabel="Mini Adaptive Exam"
        onRetry={() => setPhase({ phase: "intro" })}
      />
    );
  }

  // In progress
  const { catState, currentQuestion, answerState } = phase;
  const answered = catState.answers.length;
  // Apply locale overlay for display only; grading uses canonical `correct` from original
  const displayQuestion = Object.keys(questionsOverlay).length > 0
    ? (applyPreNursingQuestionsOverlay([currentQuestion], questionsOverlay)[0] ?? currentQuestion)
    : currentQuestion;

  function handleSelect(selectedIndex: number) {
    if (phase.phase !== "in_progress") return;
    if (phase.answerState.phase === "answered") return;
    const correct = selectedIndex === phase.currentQuestion.correct;
    setPhase((prev) => {
      if (prev.phase !== "in_progress") return prev;
      return { ...prev, answerState: { phase: "answered", selectedIndex, correct } };
    });
  }

  function handleNext() {
    if (phase.phase !== "in_progress") return;
    if (phase.answerState.phase !== "answered") return;

    const correct = phase.answerState.correct;
    const newCatState = recordAnswer(phase.catState, phase.currentQuestion, correct);

    if (shouldStopMiniCat(newCatState)) {
      const result = computeMiniCatResult(newCatState);
      setPhase({ phase: "complete", result });
      return;
    }

    const nextQuestion = selectNextQuestion(newCatState);
    if (!nextQuestion) {
      const result = computeMiniCatResult(newCatState);
      setPhase({ phase: "complete", result });
      return;
    }

    setPhase({
      phase: "in_progress",
      catState: newCatState,
      currentQuestion: nextQuestion,
      answerState: { phase: "unanswered" },
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <AdaptiveProgressBar
        answered={answered}
        maxQuestions={15}
        abilityEstimate={catState.abilityEstimate}
      />
      <CatQuestionCard
        question={displayQuestion}
        answered={answered}
        answerState={answerState}
        onSelect={handleSelect}
        onNext={handleNext}
      />
    </div>
  );
}
