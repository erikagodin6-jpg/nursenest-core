"use client";

import { useMemo, useState } from "react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

function QuizSet({
  title,
  items,
  fullAccess,
}: {
  title: string;
  items: PathwayLessonQuizItem[] | undefined;
  fullAccess: boolean;
}) {
  if (!items?.length) return null;
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [submitted, setSubmitted] = useState(false);

  const total = items.length;
  const answeredCount = useMemo(
    () => items.reduce((acc, _q, i) => (typeof answers[i] === "number" ? acc + 1 : acc), 0),
    [answers, items],
  );
  const allAnswered = answeredCount === total;
  const score =
    submitted && fullAccess
      ? items.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
      : null;

  return (
    <section className="border-b border-[var(--semantic-border-soft)] pb-8 last:border-b-0 last:pb-0">
      <h2 className="nn-marketing-h3 text-[var(--theme-heading-text)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        Answer all questions, then submit once to review your rationale feedback.
      </p>
      <ol className="mt-5 space-y-7 pl-0 list-none">
        {items.map((q, i) => (
          <li key={i}>
            <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
              <p className="text-[0.9375rem] font-semibold leading-snug text-[var(--theme-heading-text)]">
                <span className="mr-2 text-[var(--semantic-text-secondary)]">{i + 1}.</span>
                {q.question}
              </p>
              <fieldset className="mt-3 space-y-2 border-0 p-0">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-[0.9rem] leading-relaxed transition-colors ${
                      submitted && fullAccess && j === q.correct
                        ? "bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--semantic-success-contrast)] font-medium"
                        : submitted && fullAccess && answers[i] === j && j !== q.correct
                          ? "bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[var(--semantic-danger-contrast)] font-medium"
                          : "text-[var(--theme-body-text)]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${title}-${i}`}
                      value={String(j)}
                      checked={answers[i] === j}
                      onChange={() => setAnswers((prev) => ({ ...prev, [i]: j }))}
                      className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--semantic-brand)]"
                    />
                    <span
                      className={`shrink-0 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider ${
                        submitted && fullAccess && j === q.correct
                          ? "bg-[var(--semantic-success)] text-[var(--text-on-dark)]"
                          : "bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--bg-card))] text-[var(--semantic-text-secondary)]"
                      }`}
                    >
                      {OPTION_LETTERS[j] ?? String(j + 1)}
                    </span>
                    <span>{opt}</span>
                  </label>
                ))}
              </fieldset>
            </div>
            {submitted && fullAccess && q.rationale ? (
              <div className="nn-lesson-rationale mt-3">
                <p className="text-[0.675rem] font-bold uppercase tracking-widest text-[var(--semantic-success-contrast)]">
                  Rationale
                </p>
                <p className="mt-1 text-[0.875rem] leading-relaxed text-[var(--semantic-text-secondary)] whitespace-pre-wrap">
                  {q.rationale}
                </p>
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setSubmitted(true)}
          disabled={!allAnswered}
          className="inline-flex min-h-[42px] items-center justify-center rounded-full bg-[var(--semantic-brand)] px-5 py-2 text-sm font-semibold text-white transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
        >
          Submit {title}
        </button>
        {!allAnswered ? (
          <p className="text-xs text-[var(--semantic-warning-contrast)]">
            Answer all questions before submitting ({answeredCount}/{total} answered).
          </p>
        ) : null}
        {submitted && fullAccess && score !== null ? (
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
            Score: {score}/{total}
          </p>
        ) : null}
      </div>
    </section>
  );
}

export function PathwayLessonQuizzes({
  preTest,
  postTest,
  fullAccess,
}: {
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  fullAccess: boolean;
}) {
  if (!preTest?.length && !postTest?.length) return null;
  return (
    <div className="nn-study-card nn-study-card--wash mt-10 space-y-8 p-5 sm:p-6">
      {!fullAccess ? (
        <aside className="nn-study-callout p-4 text-sm text-[var(--theme-body-text)]">
          <span className="font-medium text-foreground">Preview mode: </span>
          Pre/post questions are shown without highlighted answers or rationales. Full lesson access unlocks scoring-style
          review aligned with your plan.
        </aside>
      ) : null}
      <QuizSet title="Pre-test" items={preTest} fullAccess={fullAccess} />
      <QuizSet title="Post-test" items={postTest} fullAccess={fullAccess} />
    </div>
  );
}
