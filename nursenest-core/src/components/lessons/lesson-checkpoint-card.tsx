"use client";

/**
 * LessonCheckpointCard
 *
 * Renders 1–3 multiple-choice checkpoint questions after a lesson section.
 * Provides immediate feedback (correct / incorrect) with a short explanation.
 *
 * Design surfaces:
 *   card container   → --surface-soft-c  (gentle info/cool tint)
 *   correct state    → --surface-soft-b  (gentle success tint)
 *   incorrect state  → subtle warning tint via color-mix
 *
 * Visibility: controlled by LessonRecallContext.
 * Performance: this component is dynamically imported in lesson pages (ssr: false)
 * so it does not inflate the initial server render or SSR payload.
 */

import { useState } from "react";
import type { CheckpointQuestion } from "@/lib/lessons/lesson-recall-types";
import { useLessonRecall } from "@/components/lessons/lesson-recall-context";

type AnswerState = "unanswered" | "correct" | "incorrect";

function CheckpointItem({ question }: { question: CheckpointQuestion }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const state: AnswerState = !submitted
    ? "unanswered"
    : selected === question.correctId
    ? "correct"
    : "incorrect";

  const feedbackBg =
    state === "correct"
      ? "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))"
      : "color-mix(in srgb, var(--semantic-warning, #f59e0b) 8%, var(--bg-card))";

  const feedbackBorder =
    state === "correct"
      ? "color-mix(in srgb, var(--semantic-success, #22c55e) 25%, var(--border-subtle, var(--theme-border)))"
      : "color-mix(in srgb, var(--semantic-warning, #f59e0b) 25%, var(--border-subtle, var(--theme-border)))";

  return (
    <div className="space-y-3">
      {/* Question */}
      <p
        className="text-sm font-medium leading-relaxed sm:text-[15px]"
        style={{ color: "var(--theme-text, var(--foreground))" }}
      >
        {question.question}
      </p>

      {/* Options */}
      <fieldset className="space-y-2" disabled={submitted}>
        <legend className="sr-only">Answer choices</legend>
        {question.options.map((option) => {
          const isSelected = selected === option.id;
          const isCorrect = option.id === question.correctId;
          const showCorrect = submitted && isCorrect;
          const showWrong = submitted && isSelected && !isCorrect;

          return (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-2.5 rounded-xl px-4 py-3 text-sm transition-all duration-150 select-none"
              style={{
                background: showCorrect
                  ? "var(--surface-soft-b, color-mix(in srgb, var(--semantic-success) 5%, var(--bg-card)))"
                  : showWrong
                  ? "color-mix(in srgb, var(--semantic-warning, #f59e0b) 8%, var(--bg-card))"
                  : isSelected
                  ? "var(--surface-soft-a, color-mix(in srgb, var(--theme-primary) 3.5%, var(--bg-page)))"
                  : "transparent",
                border: `1px solid ${
                  showCorrect
                    ? "color-mix(in srgb, var(--semantic-success, #22c55e) 30%, var(--border-subtle, var(--theme-border)))"
                    : showWrong
                    ? "color-mix(in srgb, var(--semantic-warning, #f59e0b) 30%, var(--border-subtle, var(--theme-border)))"
                    : isSelected
                    ? "var(--theme-primary)"
                    : "var(--border-subtle, var(--theme-border))"
                }`,
                color: "var(--theme-text, var(--foreground))",
                opacity: submitted && !isSelected && !isCorrect ? 0.55 : 1,
              }}
            >
              <input
                type="radio"
                name={`checkpoint-${question.id}`}
                value={option.id}
                checked={isSelected}
                onChange={() => !submitted && setSelected(option.id)}
                className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-current"
                aria-label={option.text}
              />
              <span className="leading-snug">{option.text}</span>
              {showCorrect ? (
                <span
                  className="ml-auto text-xs font-semibold"
                  style={{ color: "var(--semantic-success, #16a34a)" }}
                  aria-hidden="true"
                >
                  ✓
                </span>
              ) : null}
            </label>
          );
        })}
      </fieldset>

      {/* Submit / Feedback */}
      {!submitted ? (
        <button
          type="button"
          disabled={selected === null}
          onClick={() => selected !== null && setSubmitted(true)}
          className="mt-1 inline-flex items-center gap-1.5 rounded-lg px-4 py-1.5 text-xs font-semibold transition-all duration-150 hover:opacity-85 active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1"
          style={{
            background: "var(--theme-primary)",
            color: "var(--theme-primary-foreground, #fff)",
          }}
        >
          Check answer
        </button>
      ) : (
        <div
          className="rounded-xl px-4 py-3"
          style={{ background: feedbackBg, border: `1px solid ${feedbackBorder}` }}
          role="alert"
        >
          <p
            className="mb-1 text-xs font-bold"
            style={{
              color:
                state === "correct"
                  ? "var(--semantic-success, #16a34a)"
                  : "var(--semantic-warning, #b45309)",
            }}
          >
            {state === "correct" ? "✓ Correct!" : `✗ Not quite — the answer is: ${question.options.find((o) => o.id === question.correctId)?.text ?? "see below"}`}
          </p>
          <p
            className="text-xs leading-relaxed"
            style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          >
            {question.explanation}
          </p>
        </div>
      )}
    </div>
  );
}

export type LessonCheckpointCardProps = {
  questions: CheckpointQuestion[];
};

export function LessonCheckpointCard({ questions }: LessonCheckpointCardProps) {
  const { enabled } = useLessonRecall();

  if (!enabled || questions.length === 0) return null;

  return (
    <div
      className="mt-6 overflow-hidden rounded-2xl"
      style={{
        background:
          "var(--surface-soft-c, color-mix(in srgb, var(--semantic-info) 5%, var(--bg-card)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-info, #38bdf8) 18%, var(--border-subtle, var(--theme-border)))",
      }}
      role="region"
      aria-label="Section checkpoint"
    >
      <div className="px-5 py-5 sm:px-6">
        {/* Label */}
        <p
          className="mb-4 text-[10px] font-bold uppercase tracking-[0.12em] leading-none"
          style={{ color: "var(--theme-muted-text, var(--muted-foreground))" }}
          aria-hidden="true"
        >
          Section checkpoint
        </p>

        {/* Questions — separated by a subtle divider if multiple */}
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={idx > 0 ? "mt-6 border-t pt-6" : undefined}
            style={
              idx > 0
                ? { borderColor: "color-mix(in srgb, var(--border-subtle, var(--theme-border)) 60%, transparent)" }
                : undefined
            }
          >
            <CheckpointItem question={q} />
          </div>
        ))}
      </div>
    </div>
  );
}
