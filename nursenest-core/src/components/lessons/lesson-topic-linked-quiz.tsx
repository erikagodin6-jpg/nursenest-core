"use client";

/**
 * Stepped MCQ runner for lesson-linked bank questions (one item at a time).
 * Rationale and exam tip render only after the learner checks their answer.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { finalizePathwayLessonQuizItemsForUi } from "@/lib/lessons/lesson-quiz-render-contract";
import {
  buildAppQuestionBankTopicDrillHref,
  pathwayAppQuestionBankTopicHref,
  pathwayMarketingQuestionBankTopicHref,
} from "@/components/lessons/pathway-lesson-link-practice";
import type { ExamPathwayDefinition } from "@/lib/exam-pathways/types";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"] as const;

function normalizeCorrectIndex(item: PathwayLessonQuizItem): number | null {
  const raw = item.correct;
  if (typeof raw !== "number" || !Number.isInteger(raw) || raw < 0) return null;
  if (raw >= item.options.length) return null;
  return raw;
}

export type LessonTopicLinkedQuizProps = {
  pathway: ExamPathwayDefinition;
  lessonTopic: string;
  topicSlug?: string | null;
  items: PathwayLessonQuizItem[];
  /** Subscriber / staff full lesson access — controls rationale + exam tip. */
  fullAccess: boolean;
  appLinksMode?: "login" | "direct";
  compact?: boolean;
  userId: string;
  lessonId: string;
  pathwayId: string;
};

async function postTopicQuizAttempt(payload: {
  lessonId: string;
  pathwayId: string;
  topic: string;
  score: number;
  total: number;
  questionIds: string[];
  outcomes: { correct: boolean }[];
}): Promise<boolean> {
  try {
    const res = await fetch("/api/learner/lesson-topic-quiz", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch {
    return false;
  }
}

type PerQuestionState = { selected: number | null; revealed: boolean };

export function LessonTopicLinkedQuiz({
  pathway,
  lessonTopic,
  topicSlug,
  items: rawItems,
  fullAccess,
  appLinksMode = "login",
  compact = false,
  userId,
  lessonId,
  pathwayId,
}: LessonTopicLinkedQuizProps) {
  const items = useMemo(() => finalizePathwayLessonQuizItemsForUi(rawItems), [rawItems]);
  const itemsKey = useMemo(
    () =>
      items
        .map((it) => ("examQuestionId" in it && (it as { examQuestionId?: string }).examQuestionId) || it.question)
        .join("\u001f"),
    [items],
  );

  const [index, setIndex] = useState(0);
  const [perQ, setPerQ] = useState<PerQuestionState[]>(() => items.map(() => ({ selected: null, revealed: false })));
  const [completedSent, setCompletedSent] = useState(false);
  const persistOnceRef = useRef(false);
  const perQRef = useRef(perQ);
  perQRef.current = perQ;

  useEffect(() => {
    setIndex(0);
    setPerQ(items.map(() => ({ selected: null, revealed: false })));
    setCompletedSent(false);
    persistOnceRef.current = false;
  }, [itemsKey, items]);

  const topicCode = topicSlug?.trim() || undefined;
  const appTopicHref =
    appLinksMode === "direct"
      ? buildAppQuestionBankTopicDrillHref(pathway, lessonTopic, topicCode)
      : pathwayAppQuestionBankTopicHref(pathway, lessonTopic, topicCode);

  const total = items.length;
  const item = items[index];
  const correctIdx = item ? normalizeCorrectIndex(item) : null;
  const row = perQ[index] ?? { selected: null, revealed: false };
  const isCorrect = row.revealed && correctIdx !== null && row.selected === correctIdx;

  const handleSelect = (i: number) => {
    if (row.revealed) return;
    setPerQ((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], selected: i };
      return next;
    });
  };

  const handleCheckAnswer = () => {
    if (row.selected === null || row.revealed || correctIdx === null) return;
    setPerQ((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], revealed: true };
      return next;
    });
  };

  const allRevealed = total > 0 && perQ.length === total && perQ.every((q) => q.revealed);

  useEffect(() => {
    if (!allRevealed || !userId.trim() || !fullAccess || completedSent || persistOnceRef.current) return;
    persistOnceRef.current = true;
    const pq = perQRef.current;
    const outcomes = items.map((it, i) => {
      const c = normalizeCorrectIndex(it);
      const sel = pq[i]?.selected;
      const rev = pq[i]?.revealed;
      return { correct: Boolean(rev && c !== null && sel !== null && sel === c) };
    });
    const score = outcomes.filter((o) => o.correct).length;
    const questionIds = items.map((it) =>
      "examQuestionId" in it && typeof (it as { examQuestionId?: string }).examQuestionId === "string"
        ? (it as { examQuestionId: string }).examQuestionId
        : "",
    );
    let cancelled = false;
    void (async () => {
      const ok = await postTopicQuizAttempt({
        lessonId,
        pathwayId,
        topic: lessonTopic,
        score,
        total,
        questionIds,
        outcomes,
      });
      if (!cancelled && ok) setCompletedSent(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [allRevealed, completedSent, fullAccess, items, lessonId, lessonTopic, pathwayId, total, userId]);

  const resetQuiz = useCallback(() => {
    setIndex(0);
    setPerQ(items.map(() => ({ selected: null, revealed: false })));
    setCompletedSent(false);
    persistOnceRef.current = false;
  }, [items]);

  if (total === 0 || !item || correctIdx === null) return null;

  const shell = compact
    ? "rounded-xl border border-[color-mix(in_srgb,var(--semantic-brand)_22%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_40%,transparent)] p-3.5"
    : "nn-study-card nn-study-card--wash nn-study-card--accent-leading mx-auto mt-8 max-w-5xl p-4 sm:p-5";

  return (
    <section
      className={shell}
      aria-labelledby="lesson-topic-quiz-heading"
      data-testid="lesson-topic-linked-quiz"
    >
      <div className="flex flex-wrap items-center gap-2">
        <p
          className={
            compact
              ? "text-xs font-semibold text-[var(--theme-heading-text)]"
              : "nn-marketing-label nn-marketing-label--accent"
          }
        >
          {compact ? "Lesson quiz" : "Check your understanding"}
        </p>
      </div>
      <h2
        id="lesson-topic-quiz-heading"
        className={
          compact
            ? "mt-1.5 text-sm font-semibold tracking-tight text-[var(--theme-heading-text)]"
            : "mt-1.5 text-lg font-medium tracking-tight text-[var(--theme-heading-text)]"
        }
      >
        {compact ? "Practice this lesson" : "Lesson quiz · tied to this topic"}
      </h2>
      <p
        className={
          compact ? "mt-1 text-xs leading-relaxed text-[var(--theme-muted-text)]" : "nn-marketing-body-sm mt-2 max-w-prose text-[var(--theme-muted-text)]"
        }
      >
        Work through exam-style questions from your {pathway.shortName} pool that match this lesson. Check each answer before
        moving on — rationales stay hidden until you submit.
      </p>

      <div
        className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-medium tabular-nums"
        style={{ color: "var(--semantic-text-secondary)" }}
        aria-live="polite"
      >
        <span>
          Question {index + 1} of {total}
        </span>
        <div className="nn-progress-track-semantic h-1.5 w-32 max-w-[40%] overflow-hidden rounded-full sm:w-48">
          <div
            className="nn-progress-fill-semantic-info h-full rounded-full transition-all duration-300"
            style={{
              width: `${Math.round(((index + (row.revealed ? 1 : 0.35)) / total) * 100)}%`,
            }}
          />
        </div>
      </div>

      <div
        className="mt-4 rounded-2xl border p-4 sm:p-5"
        style={{
          background: "var(--semantic-surface)",
          borderColor: "var(--semantic-border-soft)",
        }}
      >
        <p className="text-base font-medium leading-7 text-[var(--theme-heading-text)]">{item.question}</p>
        <ul className="mt-4 flex flex-col gap-2.5" role="radiogroup" aria-label="Answer choices">
          {item.options.map((opt, i) => {
            const isSelected = row.selected === i;
            let border = "var(--semantic-border-soft)";
            let bg = "var(--semantic-surface)";
            if (row.revealed && fullAccess) {
              if (i === correctIdx) {
                border = "color-mix(in srgb, var(--semantic-success) 45%, transparent)";
                bg = "color-mix(in srgb, var(--semantic-success) 10%, var(--semantic-surface))";
              } else if (isSelected && i !== correctIdx) {
                border = "color-mix(in srgb, var(--semantic-danger) 40%, transparent)";
                bg = "color-mix(in srgb, var(--semantic-danger) 10%, var(--semantic-surface))";
              }
            } else if (isSelected && !row.revealed) {
              border = "color-mix(in srgb, var(--semantic-brand) 55%, transparent)";
              bg = "color-mix(in srgb, var(--semantic-brand) 10%, var(--semantic-surface))";
            }
            return (
              <li key={i}>
                <button
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={row.revealed}
                  onClick={() => handleSelect(i)}
                  className="w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-all duration-150 disabled:cursor-default"
                  style={{
                    background: bg,
                    border: `1.5px solid ${border}`,
                    color: "var(--theme-body-text)",
                  }}
                >
                  <span className="flex items-start gap-3">
                    <span
                      className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold"
                      style={{
                        background: "color-mix(in srgb, var(--semantic-text-secondary) 16%, var(--semantic-surface))",
                        color: "var(--semantic-text-secondary)",
                      }}
                      aria-hidden
                    >
                      {OPTION_LABELS[i] ?? i + 1}
                    </span>
                    <span className="flex-1 leading-6">{opt}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <button
            type="button"
            onClick={handleCheckAnswer}
            disabled={row.selected === null || row.revealed}
            className="inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              background: "var(--role-cta, var(--semantic-brand))",
              color: "var(--role-cta-foreground, #fff)",
            }}
          >
            Check answer
          </button>
          {row.revealed ? (
            <p
              className="text-sm font-semibold"
              style={{ color: isCorrect ? "var(--semantic-success)" : "var(--semantic-danger)" }}
            >
              {isCorrect ? "Correct" : "Incorrect"}
            </p>
          ) : (
            <p className="text-xs" style={{ color: "var(--semantic-text-secondary)" }}>
              Pick an option, then check your answer.
            </p>
          )}
        </div>

        {row.revealed && fullAccess ? (
          <div className="mt-4 space-y-3">
            {item.rationale ? (
              <div
                className="rounded-xl border-l-4 px-4 py-3"
                style={{
                  borderLeftColor: "var(--semantic-info)",
                  background: "color-mix(in srgb, var(--semantic-info) 8%, var(--semantic-surface))",
                }}
              >
                <p className="text-[0.65rem] font-semibold uppercase tracking-[0.06em]" style={{ color: "var(--semantic-info)" }}>
                  Rationale
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[var(--theme-body-text)]">{item.rationale}</p>
              </div>
            ) : null}
            <div
              className="rounded-xl border px-3 py-2.5 text-sm leading-relaxed"
              style={{
                borderColor: "var(--semantic-border-soft)",
                background: "color-mix(in srgb, var(--semantic-panel-warm) 22%, var(--semantic-surface))",
                color: "var(--theme-body-text)",
              }}
            >
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.06em] text-[var(--semantic-warning)]">
                Exam strategy
              </p>
              <p className="mt-1.5 text-sm">
                On the real exam, eliminate clearly wrong options first, then compare the remaining choices against priority
                and safety rules for this topic ({lessonTopic}).
              </p>
            </div>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: "var(--semantic-border-soft)", color: "var(--theme-heading-text)" }}
        >
          Previous
        </button>
        <button
          type="button"
          disabled={!row.revealed || index >= total - 1}
          onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
          className="inline-flex min-h-10 items-center rounded-full border px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40"
          style={{ borderColor: "var(--semantic-border-soft)", color: "var(--theme-heading-text)" }}
        >
          Next
        </button>
        <button
          type="button"
          onClick={resetQuiz}
          className="inline-flex min-h-10 items-center rounded-full px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)] underline-offset-2 hover:underline"
        >
          Reset quiz
        </button>
        {allRevealed && completedSent ? (
          <span className="text-xs font-medium text-[var(--semantic-success)]">Progress saved to your study profile.</span>
        ) : null}
      </div>

      <div className={compact ? "mt-3 flex flex-col gap-2" : "mt-5 flex flex-wrap gap-2"}>
        <Link
          href={appTopicHref}
          className={
            compact
              ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-primary px-4 py-2 text-xs font-semibold shadow-none"
              : "inline-flex min-h-11 items-center rounded-full nn-btn-primary px-5 py-2.5 text-sm font-semibold shadow-none"
          }
        >
          More questions in app bank
        </Link>
        <Link
          href={pathwayMarketingQuestionBankTopicHref(pathway, lessonTopic, topicCode)}
          className={
            compact
              ? "inline-flex min-h-10 items-center justify-center rounded-full nn-btn-secondary px-4 py-2 text-xs font-semibold"
              : "inline-flex min-h-11 items-center rounded-full nn-btn-secondary px-5 py-2.5 text-sm font-semibold"
          }
        >
          {compact ? "Question hub" : "Question hub · filtered"}
        </Link>
      </div>
    </section>
  );
}
