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

import { useMemo, useState } from "react";
import type { CheckpointQuestion } from "@/lib/lessons/lesson-recall-types";
import { useLessonRecall } from "@/components/lessons/lesson-recall-context";

export type LessonCheckpointCardProps = {
  questions: CheckpointQuestion[];
};

export function LessonCheckpointCard({ questions }: LessonCheckpointCardProps) {
  const { enabled } = useLessonRecall();
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const answeredCount = useMemo(
    () => questions.reduce((count, q) => (answers[q.id] ? count + 1 : count), 0),
    [answers, questions],
  );
  const allAnswered = answeredCount === questions.length;
  const score = submitted
    ? questions.reduce((count, q) => (answers[q.id] === q.correctId ? count + 1 : count), 0)
    : null;

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
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] leading-none text-[var(--theme-muted-text)]" aria-hidden="true">
          Section checkpoint
        </p>
        <p className="mb-4 text-sm text-[var(--theme-body-text)]">
          Answer every question, then submit once to review the rationale for each item.
        </p>

        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={idx > 0 ? "mt-6 border-t border-[color-mix(in_srgb,var(--border-subtle)_60%,transparent)] pt-6" : undefined}
          >
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
              <p className="text-sm font-semibold leading-relaxed text-[var(--theme-heading-text)] sm:text-[15px]">
                <span className="mr-2 text-[var(--theme-muted-text)]">{idx + 1}.</span>
                {q.question}
              </p>

              <fieldset className="mt-3 space-y-2" disabled={submitted}>
                <legend className="sr-only">Answer choices</legend>
                {q.options.map((option) => {
                  const selected = answers[q.id] === option.id;
                  const correct = option.id === q.correctId;
                  const showCorrect = submitted && correct;
                  const showWrong = submitted && selected && !correct;

                  return (
                    <label
                      key={option.id}
                      className={`flex cursor-pointer items-start gap-2.5 rounded-xl px-4 py-3 text-sm transition-all select-none ${
                        showCorrect
                          ? "border border-[color-mix(in_srgb,var(--semantic-success)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success-contrast)]"
                          : showWrong
                            ? "border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] text-[var(--theme-heading-text)]"
                            : selected
                              ? "border border-[var(--semantic-brand)] bg-[color-mix(in_srgb,var(--semantic-brand)_7%,var(--semantic-surface))] text-[var(--theme-heading-text)]"
                              : "border border-[var(--semantic-border-soft)] bg-transparent text-[var(--theme-body-text)]"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`checkpoint-${q.id}`}
                        value={option.id}
                        checked={selected}
                        onChange={() => !submitted && setAnswers((prev) => ({ ...prev, [q.id]: option.id }))}
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 accent-[var(--semantic-brand)]"
                        aria-label={option.text}
                      />
                      <span className="leading-snug">{option.text}</span>
                    </label>
                  );
                })}
              </fieldset>

              {submitted ? (
                <div
                  className={`mt-3 rounded-xl border px-4 py-3 ${
                    answers[q.id] === q.correctId
                      ? "border-[color-mix(in_srgb,var(--semantic-success)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))]"
                      : "border-[color-mix(in_srgb,var(--semantic-warning)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_9%,var(--semantic-surface))]"
                  }`}
                  role="alert"
                >
                  <p
                    className={`mb-1 text-xs font-bold ${
                      answers[q.id] === q.correctId
                        ? "text-[var(--semantic-success-contrast)]"
                        : "text-[var(--theme-heading-text)]"
                    }`}
                  >
                    {answers[q.id] === q.correctId
                      ? "Correct"
                      : `Not quite — correct answer: ${q.options.find((o) => o.id === q.correctId)?.text ?? "see rationale"}`}
                  </p>
                  <p className="text-xs leading-relaxed text-[var(--theme-body-text)]">{q.explanation}</p>
                </div>
              ) : null}
            </div>
          </div>
        ))}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSubmitted(true)}
            disabled={!allAnswered}
            className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-[var(--text-on-dark)] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit answers
          </button>
          {!allAnswered ? (
            <p className="text-xs text-[var(--theme-muted-text)]">
              Answer all questions before submitting ({answeredCount}/{questions.length} answered).
            </p>
          ) : null}
          {submitted && score !== null ? (
            <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
              Score: {score}/{questions.length}
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
