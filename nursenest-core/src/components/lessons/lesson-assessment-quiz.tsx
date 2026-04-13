"use client";

/**
 * Interactive lesson assessment quiz runner.
 *
 * Renders all questions at once in a compact "mini exam" layout.
 * Learners answer every question, submit once, then review rationale-rich
 * feedback per question (correct answer, selected answer, correctness).
 * Completion is finalized via a dedicated "continue" action.
 *
 * Designed to be embedded inside both the pre- and post-assessment cards.
 * Does NOT make API calls — the parent card is responsible for persistence.
 */

import { useId, useMemo, useRef, useState } from "react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

// ─── Option letters ────────────────────────────────────────────────────────────

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;
const MAX_VISIBLE_QUIZ_ITEMS = 15;

function seededShuffle<T>(items: T[], seed: string): T[] {
  const arr = [...items];
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h = Math.imul(h ^ (h >>> 15), Math.imul(h | 1, 2246822519)) >>> 0;
    h ^= h + Math.imul(h ^ (h >>> 7), 3266489917) >>> 0;
    const j = (h >>> 0) % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeCorrectIndices(item: PathwayLessonQuizItem): number[] {
  const raw = (item as PathwayLessonQuizItem & { correct?: number | number[] }).correct;
  if (Array.isArray(raw)) {
    return Array.from(new Set(raw.filter((n) => Number.isInteger(n) && n >= 0))).sort((a, b) => a - b);
  }
  return Number.isInteger(raw) && typeof raw === "number" && raw >= 0 ? [raw] : [];
}

function sameSelection(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const as = [...a].sort((x, y) => x - y);
  const bs = [...b].sort((x, y) => x - y);
  return as.every((value, idx) => value === bs[idx]);
}

// ─── Single question card ──────────────────────────────────────────────────────

function QuestionCard({
  item,
  index,
  total,
  selectedIndices,
  submitted,
  onSelect,
}: {
  item: PathwayLessonQuizItem;
  index: number;
  total: number;
  selectedIndices: number[];
  submitted: boolean;
  onSelect: (optionIndex: number) => void;
}) {
  const headingId = useId();
  const correctIndices = normalizeCorrectIndices(item);
  const isSata = correctIndices.length > 1;
  const answered = selectedIndices.length > 0;
  const isQuestionCorrect = answered && sameSelection(selectedIndices, correctIndices);
  const selectedSet = useMemo(() => new Set(selectedIndices), [selectedIndices]);
  const correctSet = useMemo(() => new Set(correctIndices), [correctIndices]);

  return (
    <div
      className="rounded-2xl border p-4 sm:p-5"
      style={{
        background: "var(--semantic-surface)",
        borderColor: "var(--semantic-border-soft)",
      }}
      role="group"
      aria-labelledby={headingId}
    >
      <div className="flex flex-col gap-2.5">
        <p
          className="text-xs font-semibold uppercase tracking-[0.15em]"
          style={{ color: "var(--semantic-text-secondary)" }}
          aria-hidden="true"
        >
          Question {index + 1} of {total}
        </p>
        <p
          id={headingId}
          className="text-base font-medium leading-7"
          style={{ color: "var(--theme-heading-text)" }}
        >
          {item.question}
        </p>
        {isSata ? (
          <p className="text-xs font-semibold uppercase tracking-[0.12em]" style={{ color: "var(--semantic-info)" }}>
            Select all that apply
          </p>
        ) : null}
      </div>

      <ul
        className="mt-4 flex flex-col gap-2.5"
        role={isSata ? "group" : "radiogroup"}
        aria-label={isSata ? "Answer options (multiple select)" : "Answer options"}
      >
        {item.options.map((opt, i) => {
          const isSelected = selectedSet.has(i);
          const isCorrect = correctSet.has(i);

          let surface = "var(--semantic-surface)";
          let border = "var(--semantic-border-soft)";
          let labelColor = "var(--theme-body-text)";
          let badgeContent: string | null = null;

          if (submitted) {
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
                role={isSata ? "checkbox" : "radio"}
                aria-checked={isSelected}
                disabled={submitted}
                onClick={() => !submitted && onSelect(i)}
                className="w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
                style={{
                  background: submitted
                    ? surface
                    : isSelected
                    ? "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))"
                    : surface,
                  border: `1.5px solid ${
                    !submitted && isSelected
                      ? "color-mix(in srgb, var(--semantic-brand) 60%, transparent)"
                      : border
                  }`,
                  color: labelColor,
                  boxShadow: isSelected && !submitted ? "0 0 0 3px color-mix(in srgb, var(--semantic-brand) 15%, transparent)" : "none",
                }}
                aria-label={`Option ${OPTION_LABELS[i] ?? i + 1}: ${opt}`}
              >
                <span className="flex items-start gap-3">
                  <span
                    className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                    style={{
                      background: submitted && isCorrect
                        ? "var(--semantic-success)"
                        : submitted && isSelected && !isCorrect
                        ? "var(--semantic-danger)"
                        : "color-mix(in srgb, var(--semantic-text-secondary) 18%, var(--semantic-surface))",
                      color: submitted && (isCorrect || isSelected)
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

      {submitted ? (
        <div className="mt-4 space-y-3">
          <div
            className="rounded-xl border px-3.5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em]"
            style={{
              borderColor: isQuestionCorrect
                ? "color-mix(in srgb, var(--semantic-success) 30%, transparent)"
                : answered
                ? "color-mix(in srgb, var(--semantic-danger) 30%, transparent)"
                : "color-mix(in srgb, var(--semantic-warning) 30%, transparent)",
              background: isQuestionCorrect
                ? "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))"
                : answered
                ? "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))"
                : "color-mix(in srgb, var(--semantic-warning) 10%, var(--semantic-surface))",
              color: isQuestionCorrect
                ? "var(--semantic-success)"
                : answered
                ? "var(--semantic-danger)"
                : "var(--semantic-warning)",
            }}
          >
            {isQuestionCorrect ? "Correct" : answered ? "Incorrect" : "Unanswered"}
          </div>
          {item.rationale ? (
            <div
              className="rounded-xl border-l-4 px-4 py-3 text-sm leading-6"
              style={{
                borderLeftColor: "var(--semantic-info)",
                background: "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
                color: "var(--theme-body-text)",
              }}
            >
              <span className="font-semibold" style={{ color: "var(--semantic-info)" }}>
                Rationale:{" "}
              </span>
              {item.rationale}
            </div>
          ) : null}
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
  submitLabel = "Submit Quiz",
  continueLabel = "Continue",
  shuffleSeed,
  autoCompleteOnSubmit = false,
}: {
  items: PathwayLessonQuizItem[];
  onComplete: (result: QuizCompleteResult) => void;
  /**
   * Fires for each graded question after submission.
   * `selectedIndex` is preserved for legacy consumers (first selected index or -1).
   */
  onItemGraded?: (args: {
    index: number;
    item: PathwayLessonQuizItem;
    correct: boolean;
    selectedIndex: number;
    selectedIndices: number[];
  }) => void;
  submitLabel?: string;
  continueLabel?: string;
  shuffleSeed?: string;
  autoCompleteOnSubmit?: boolean;
}) {
  const visibleItems = useMemo(() => {
    if (!items.length) return [];
    if (items.length <= MAX_VISIBLE_QUIZ_ITEMS) {
      return shuffleSeed ? seededShuffle(items, `quiz:${shuffleSeed}:${items.length}`) : items;
    }
    const shuffled = shuffleSeed
      ? seededShuffle(items, `quiz:${shuffleSeed}:${items.length}`)
      : seededShuffle(items, `quiz:fallback:${items.length}:${items[0]?.question ?? ""}`);
    return shuffled.slice(0, MAX_VISIBLE_QUIZ_ITEMS);
  }, [items, shuffleSeed]);

  const [answers, setAnswers] = useState<number[][]>(() => visibleItems.map(() => []));
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizCompleteResult | null>(null);
  const completeSentRef = useRef(false);

  if (!visibleItems.length) return null;

  const unansweredCount = answers.filter((selection) => selection.length === 0).length;
  const allAnswered = unansweredCount === 0;

  function commitCompletionOnce(next: QuizCompleteResult) {
    if (completeSentRef.current) return;
    completeSentRef.current = true;
    onComplete(next);
  }

  function toggleSelection(questionIndex: number, optionIndex: number) {
    if (submitted) return;
    setAnswers((prev) => {
      const item = visibleItems[questionIndex];
      if (!item) return prev;
      const correctIndices = normalizeCorrectIndices(item);
      const isSata = correctIndices.length > 1;
      const next = [...prev];
      const current = next[questionIndex] ?? [];
      if (isSata) {
        next[questionIndex] = current.includes(optionIndex)
          ? current.filter((idx) => idx !== optionIndex)
          : [...current, optionIndex];
      } else {
        next[questionIndex] = [optionIndex];
      }
      return next;
    });
  }

  function handleSubmit() {
    if (submitted || !allAnswered) return;
    let score = 0;
    visibleItems.forEach((item, index) => {
      const selectedIndices = [...(answers[index] ?? [])].sort((a, b) => a - b);
      const correctIndices = normalizeCorrectIndices(item);
      const correct = sameSelection(selectedIndices, correctIndices);
      if (correct) score += 1;
      onItemGraded?.({
        index,
        item,
        correct,
        selectedIndex: selectedIndices[0] ?? -1,
        selectedIndices,
      });
    });
    const nextResult = { score, total: visibleItems.length };
    setResult(nextResult);
    setSubmitted(true);
    if (autoCompleteOnSubmit) {
      commitCompletionOnce(nextResult);
    }
  }

  function handleContinue() {
    if (!result) return;
    commitCompletionOnce(result);
  }

  return (
    <div className="flex flex-col gap-6">
      {!submitted ? <QuizProgressBar current={visibleItems.length - unansweredCount} total={visibleItems.length} /> : null}

      <div className="space-y-4">
        {visibleItems.map((item, index) => (
          <QuestionCard
            key={`${item.examQuestionId ?? item.question.slice(0, 40)}-${index}`}
            item={item}
            index={index}
            total={visibleItems.length}
            selectedIndices={answers[index] ?? []}
            submitted={submitted}
            onSelect={(optionIndex) => toggleSelection(index, optionIndex)}
          />
        ))}
      </div>

      {submitted && result ? (
        <div className="rounded-2xl border p-4 sm:p-5" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <QuizScoreSummary score={result.score} total={result.total} label="Quiz score" />
          {!autoCompleteOnSubmit ? (
            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleContinue}
                className="rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "var(--role-cta, var(--semantic-brand))",
                  color: "var(--role-cta-foreground, #fff)",
                }}
              >
                {continueLabel}
              </button>
            </div>
          ) : null}
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5" style={{ borderColor: "var(--semantic-border-soft)" }}>
          <p className="text-sm" style={{ color: "var(--semantic-text-secondary)" }}>
            {allAnswered ? "All questions answered. Submit when ready." : `${unansweredCount} question${unansweredCount === 1 ? "" : "s"} remaining`}
          </p>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!allAnswered}
            className="rounded-full px-6 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, #fff)",
            }}
          >
            {submitLabel}
          </button>
        </div>
      )}
    </div>
  );
}
