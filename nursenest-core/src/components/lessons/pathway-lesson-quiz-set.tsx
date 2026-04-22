"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import { finalizePathwayLessonQuizItemsForUi } from "@/lib/lessons/lesson-quiz-render-contract";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

type QuizVariant = "pre" | "post";

/** Stable key so parents can remount when the question list or mode changes (resets local UI state). */
export function itemsResetKey(items: PathwayLessonQuizItem[] | undefined): string {
  const finalized = finalizePathwayLessonQuizItemsForUi(items ?? []);
  if (!finalized.length) return "0";
  return finalized
    .map((q) =>
      "examQuestionId" in q && typeof (q as { examQuestionId?: string }).examQuestionId === "string"
        ? (q as { examQuestionId: string }).examQuestionId
        : q.question.trim().slice(0, 64),
    )
    .join("\u001f");
}

/**
 * Shared pre/post MCQ UI aligned with marketing pathway lessons: per-question feedback,
 * progress pill (n/total), post-test Practice vs Exam-style.
 */
export function PathwayLessonQuizSet({
  title,
  subtitle,
  items,
  fullAccess,
  variant,
  postMode = "practice",
  onPostModeChange,
  onAssessmentFinished,
  className = "",
}: {
  title: string;
  subtitle?: string;
  items: PathwayLessonQuizItem[] | undefined;
  fullAccess: boolean;
  variant: QuizVariant;
  postMode?: "practice" | "exam";
  onPostModeChange?: (mode: "practice" | "exam") => void;
  /** Fires once when the learner reaches a final score (practice: all answered; exam: after Show results). */
  onAssessmentFinished?: (score: number, total: number) => void;
  className?: string;
}) {
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [examRevealed, setExamRevealed] = useState(false);
  const finishedSentRef = useRef(false);

  const list = useMemo(() => finalizePathwayLessonQuizItemsForUi(items ?? []), [items]);
  const total = list.length;
  const answeredCount = useMemo(
    () => list.reduce((acc, _q, i) => (typeof answers[i] === "number" ? acc + 1 : acc), 0),
    [answers, list],
  );

  const allAnswered = total > 0 && answeredCount === total;
  const score =
    total > 0 &&
    fullAccess &&
    allAnswered &&
    (variant === "pre" || postMode === "practice" || examRevealed)
      ? list.reduce((acc, q, i) => (answers[i] === q.correct ? acc + 1 : acc), 0)
      : null;

  const onQuestion = total === 0 ? 0 : answeredCount === total ? total : answeredCount + 1;

  useEffect(() => {
    finishedSentRef.current = false;
  }, [list, variant, postMode]);

  useEffect(() => {
    if (!total || !onAssessmentFinished || finishedSentRef.current) return;
    if (score === null || !allAnswered) return;
    if (variant === "post" && postMode === "exam" && !examRevealed) return;
    finishedSentRef.current = true;
    onAssessmentFinished(score, total);
  }, [allAnswered, score, total, variant, postMode, examRevealed, onAssessmentFinished]);

  if (!total) return null;

  function shouldShowGrading(questionIndex: number): boolean {
    if (!fullAccess || typeof answers[questionIndex] !== "number") return false;
    if (variant === "pre" || postMode === "practice") return true;
    return examRevealed;
  }

  return (
    <section className={`border-b border-[var(--semantic-border-soft)] pb-8 last:border-b-0 last:pb-0 ${className}`.trim()}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--theme-heading-text)] sm:text-lg">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">
              {subtitle}
            </p>
          ) : null}
        </div>
        <div
          className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums"
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
            onClick={() => onPostModeChange?.("practice")}
            className="min-h-9 rounded-full px-4 py-2 text-xs font-medium transition"
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
            onClick={() => onPostModeChange?.("exam")}
            className="min-h-9 rounded-full px-4 py-2 text-xs font-medium transition"
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
        {list.map((q, i) => {
          const picked = answers[i];
          const showGrading = shouldShowGrading(i);
          const isCorrect = showGrading && picked === q.correct;
          return (
            <li key={i}>
              <div className="rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-4 sm:p-5">
                <p className="text-[0.9375rem] font-normal leading-relaxed text-[var(--theme-heading-text)]">
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
                          className={`shrink-0 rounded-md px-1.5 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider ${
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
                  <p className="nn-lesson-rationale__label">Rationale</p>
                  <p className="nn-lesson-rationale__body">{q.rationale}</p>
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
            className="rounded-xl border px-5 py-2.5 text-sm font-medium text-[var(--theme-heading-text)]"
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
          <p className="text-sm font-medium text-[var(--theme-heading-text)]">
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
