"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

/**
 * Marketing pathway pre/post quizzes — immediate per-question feedback when `fullAccess`
 * (legacy monolith embed pattern), preview-safe when locked.
 */
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

  const total = items.length;
  const answeredCount = useMemo(
    () => items.reduce((acc, _q, i) => (typeof answers[i] === "number" ? acc + 1 : acc), 0),
    [answers, items],
  );
  const allAnswered = answeredCount === total;
  const score =
    fullAccess && allAnswered
      ? items.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
      : null;

  return (
    <section className="border-b border-[var(--semantic-border-soft)] pb-8 last:border-b-0 last:pb-0">
      <h2 className="nn-marketing-h3 text-[var(--theme-heading-text)]">{title}</h2>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        {fullAccess
          ? "Choose an answer for each question — feedback and rationales appear as you go."
          : "Work through each question. Highlights and rationales unlock with full lesson access."}
      </p>
      <ol className="mt-5 list-none space-y-7 pl-0">
        {items.map((q, i) => {
          const picked = answers[i];
          const showGrading = fullAccess && typeof picked === "number";
          const isCorrect = showGrading && picked === q.correct;
          return (
            <li key={i}>
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
                <p className="text-[0.9375rem] font-semibold leading-snug text-[var(--theme-heading-text)]">
                  <span className="mr-2 text-[var(--semantic-text-secondary)]">{i + 1}.</span>
                  {q.question}
                </p>
                <fieldset className="mt-3 space-y-2 border-0 p-0">
                  {q.options.map((opt, j) => {
                    const selected = answers[i] === j;
                    let rowClass =
                      "flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-[0.9rem] leading-relaxed transition-colors text-[var(--theme-body-text)]";
                    if (showGrading) {
                      if (j === q.correct) {
                        rowClass =
                          "flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-[0.9rem] leading-relaxed font-medium";
                        rowClass += " bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success-contrast)]";
                      } else if (selected && j !== q.correct) {
                        rowClass =
                          "flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-[0.9rem] leading-relaxed font-medium";
                        rowClass += " bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[var(--semantic-danger-contrast)]";
                      }
                    }
                    return (
                      <label key={j} className={rowClass}>
                        <input
                          type="radio"
                          name={`${title}-${i}`}
                          value={String(j)}
                          checked={selected}
                          onChange={() => setAnswers((prev) => ({ ...prev, [i]: j }))}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-[var(--semantic-brand)]"
                        />
                        <span
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[0.7rem] font-bold uppercase tracking-wider ${
                            showGrading && j === q.correct
                              ? "bg-[var(--semantic-success)] text-[var(--text-on-dark)]"
                              : "bg-[color-mix(in_srgb,var(--theme-primary)_12%,var(--bg-card))] text-[var(--semantic-text-secondary)]"
                          }`}
                        >
                          {OPTION_LETTERS[j] ?? String(j + 1)}
                        </span>
                        <span className="flex min-w-0 flex-1 items-start gap-2">
                          {showGrading && j === q.correct ? (
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                          ) : null}
                          {showGrading && selected && j !== q.correct ? (
                            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
                          ) : null}
                          <span>{opt}</span>
                        </span>
                      </label>
                    );
                  })}
                </fieldset>
              </div>
              {showGrading && q.rationale ? (
                <div
                  className="nn-lesson-rationale mt-3 rounded-xl border border-[var(--semantic-border-soft)] p-4"
                  style={{
                    background: isCorrect
                      ? "color-mix(in srgb, var(--semantic-panel-positive) 35%, var(--semantic-surface))"
                      : "color-mix(in srgb, var(--semantic-panel-warm) 28%, var(--semantic-surface))",
                  }}
                >
                  <p className="text-[0.675rem] font-bold uppercase tracking-widest text-[var(--semantic-text-secondary)]">
                    Rationale
                  </p>
                  <p className="mt-1 text-[0.875rem] leading-relaxed text-[var(--theme-body-text)] whitespace-pre-wrap">
                    {q.rationale}
                  </p>
                </div>
              ) : null}
            </li>
          );
        })}
      </ol>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!fullAccess ? (
          <p className="text-xs text-[var(--semantic-warning-contrast)]">
            {answeredCount}/{total} answered · full access unlocks answer highlights and rationales.
          </p>
        ) : allAnswered && score !== null ? (
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">
            Score: {score}/{total}
          </p>
        ) : (
          <p className="text-xs text-[var(--theme-muted-text)]">
            Progress: {answeredCount}/{total} answered
          </p>
        )}
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
