"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

type QuizVariant = "pre" | "post";

/**
 * Marketing pathway pre/post quizzes — immediate per-question feedback when `fullAccess`
 * (legacy monolith embed pattern), preview-safe when locked.
 * Post-test supports practice (immediate feedback) vs exam-style (reveal all at once).
 */
function QuizSet({
  title,
  subtitle,
  items,
  fullAccess,
  variant,
}: {
  title: string;
  subtitle?: string;
  items: PathwayLessonQuizItem[] | undefined;
  fullAccess: boolean;
  variant: QuizVariant;
}) {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  /** Post-test only: practice = rationale after each; exam = reveal scoring after "Show results". */
  const [postMode, setPostMode] = useState<"practice" | "exam">("practice");
  const [examRevealed, setExamRevealed] = useState(false);

  useEffect(() => {
    setAnswers({});
    setExamRevealed(false);
  }, [items, postMode]);

  if (!items?.length) return null;

  const total = items.length;
  const answeredCount = useMemo(
    () => items.reduce((acc, _q, i) => (typeof answers[i] === "number" ? acc + 1 : acc), 0),
    [answers, items],
  );
  const allAnswered = answeredCount === total;
  const score =
    fullAccess && allAnswered && (variant === "pre" || postMode === "practice" || examRevealed)
      ? items.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
      : null;

  const onQuestion = answeredCount === total ? total : answeredCount + 1;

  function shouldShowGrading(questionIndex: number): boolean {
    if (!fullAccess || typeof answers[questionIndex] !== "number") return false;
    if (variant === "pre" || postMode === "practice") return true;
    return examRevealed;
  }

  return (
    <section className="border-b border-[var(--semantic-border-soft)] pb-8 last:border-b-0 last:pb-0">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="nn-marketing-h3 text-[var(--theme-heading-text)]">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div
          className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold tabular-nums"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "color-mix(in srgb, var(--semantic-chart-2) 10%, var(--semantic-surface))",
            color: "var(--semantic-chart-2)",
          }}
          aria-live="polite"
        >
          {onQuestion}/{total}
        </div>
      </div>
      <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
        {!fullAccess
          ? "Work through each question. Highlights and rationales unlock with full lesson access."
          : variant === "pre"
            ? "Practice mode: pick an answer, then review the rationale before moving on."
            : postMode === "practice"
              ? "Practice mode: immediate feedback and rationales after each question."
              : "Exam-style: answer every question, then reveal scoring and rationales together."}
      </p>

      {variant === "post" && fullAccess ? (
        <div
          className="mt-4 inline-flex rounded-full border p-0.5"
          style={{ borderColor: "var(--semantic-border-soft)" }}
          role="tablist"
          aria-label="Post-test mode"
        >
          <button
            type="button"
            role="tab"
            aria-selected={postMode === "practice"}
            onClick={() => setPostMode("practice")}
            className="min-h-9 rounded-full px-4 py-2 text-xs font-semibold transition"
            style={{
              background: postMode === "practice" ? "var(--semantic-surface)" : "transparent",
              color: postMode === "practice" ? "var(--theme-heading-text)" : "var(--semantic-text-secondary)",
              boxShadow: postMode === "practice" ? "var(--semantic-shadow-soft)" : "none",
            }}
          >
            Practice
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={postMode === "exam"}
            onClick={() => setPostMode("exam")}
            className="min-h-9 rounded-full px-4 py-2 text-xs font-semibold transition"
            style={{
              background: postMode === "exam" ? "var(--semantic-surface)" : "transparent",
              color: postMode === "exam" ? "var(--theme-heading-text)" : "var(--semantic-text-secondary)",
              boxShadow: postMode === "exam" ? "var(--semantic-shadow-soft)" : "none",
            }}
          >
            Exam-style
          </button>
        </div>
      ) : null}

      <ol className="mt-5 list-none space-y-7 pl-0">
        {items.map((q, i) => {
          const picked = answers[i];
          const showGrading = shouldShowGrading(i);
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
                        rowClass +=
                          " bg-[color-mix(in_srgb,var(--semantic-success)_14%,var(--semantic-surface))] text-[var(--semantic-success-contrast)]";
                      } else if (selected && j !== q.correct) {
                        rowClass =
                          "flex items-baseline gap-2.5 rounded-lg px-3 py-2 text-[0.9rem] leading-relaxed font-medium";
                        rowClass +=
                          " bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[var(--semantic-danger-contrast)]";
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

      {variant === "post" && fullAccess && postMode === "exam" && allAnswered && !examRevealed ? (
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setExamRevealed(true)}
            className="rounded-xl border px-5 py-2.5 text-sm font-semibold text-[var(--theme-heading-text)]"
            style={{
              borderColor: "var(--semantic-border-soft)",
              background: "color-mix(in srgb, var(--semantic-brand) 14%, var(--semantic-surface))",
            }}
          >
            Show results
          </button>
        </div>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!fullAccess ? (
          <p className="text-xs text-[var(--semantic-warning-contrast)]">
            {answeredCount}/{total} answered · full access unlocks answer highlights and rationales.
          </p>
        ) : allAnswered && score !== null && (variant === "pre" || postMode === "practice" || examRevealed) ? (
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
      <QuizSet
        variant="pre"
        title="Pre-test"
        subtitle="Practice"
        items={preTest}
        fullAccess={fullAccess}
      />
      <QuizSet variant="post" title="Post-test" items={postTest} fullAccess={fullAccess} />
    </div>
  );
}
