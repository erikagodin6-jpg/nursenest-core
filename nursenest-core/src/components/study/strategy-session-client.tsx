"use client";

/**
 * StrategySessionClient — interactive question-answer session for strategy practice.
 *
 * Each question is shown with:
 *   - Answer options (MCQ)
 *   - After submission: PracticeRationalePanel + StrategyExplanationPanel
 *   - Navigation: Next / Previous
 *   - Auto-loads next batch via Server Action when approaching end of current batch
 *
 * Design surfaces:
 *   - Question card: surface-soft-a tint
 *   - Answer options: interactive nn-practice-opt classes (existing system)
 *   - Rationale area: surface-soft-b tint
 *   - Strategy explanation: soft info / warning / emphasis (StrategyExplanationPanel)
 *
 * Performance:
 *   - Initial batch: loaded as prop (from RSC)
 *   - Next batches: loaded via Server Action on demand (not all at once)
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { PracticeRationalePanel } from "@/components/study/practice-rationale-panel";
import { StrategyExplanationPanel } from "@/components/study/strategy-explanation-panel";
import { StrategyTagChip } from "@/components/study/strategy-tag-chip";
import { StrategyFilterBar } from "@/components/study/strategy-filter-bar";
import type {
  StrategyQuestion,
  StrategySessionBatch,
} from "@/app/(student)/app/(learner)/strategy/actions";
import { loadMoreStrategyQuestions } from "@/app/(student)/app/(learner)/strategy/actions";
import type { SessionMode } from "@/lib/study/strategy-taxonomy";
import { SuccessLeaf } from "@/components/ui/success-leaf";

// ── Types ──────────────────────────────────────────────────────────────────────

type GradedState = {
  correct: boolean;
  selectedKey: string;
  correctKey: string;
};

// ── Helpers ────────────────────────────────────────────────────────────────────

const LETTERS = ["A", "B", "C", "D", "E", "F", "G", "H"] as const;

function optLetter(index: number): string {
  return LETTERS[index] ?? String(index + 1);
}

function isCorrect(selected: string, correctAnswer: string[]): boolean {
  return correctAnswer.includes(selected);
}

// ── Question card ─────────────────────────────────────────────────────────────

function QuestionAnswerArea({
  question,
  graded,
  onSubmit,
}: {
  question: StrategyQuestion;
  graded: GradedState | null;
  onSubmit: (key: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    setSelected(null);
  }, [question.id]);

  const handleSubmit = () => {
    if (!selected || graded) return;
    onSubmit(selected);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Strategy chip + topic */}
      <div className="flex flex-wrap items-center gap-2">
        {question.examStrategy ? (
          <StrategyTagChip strategyKey={question.examStrategy} size="sm" showDot />
        ) : null}
        {question.topic ? (
          <span
            className="text-xs font-medium"
            style={{ color: "var(--theme-muted-text)" }}
          >
            {question.topic}
          </span>
        ) : null}
        {question.difficulty ? (
          <span
            className="rounded-full px-2 py-0.5 text-[10px] font-medium"
            style={{
              background:
                "color-mix(in srgb, var(--theme-muted-text) 10%, transparent)",
              color: "var(--theme-muted-text)",
            }}
          >
            Difficulty {question.difficulty}/5
          </span>
        ) : null}
      </div>

      {/* Stem */}
      <p
        className="text-base font-medium leading-relaxed"
        style={{ color: "var(--theme-heading-text)" }}
      >
        {question.stem}
      </p>

      {/* Options */}
      <ul className="flex flex-col gap-2" role="list">
        {question.options.map((opt, i) => {
          const key = opt;
          const isGradedCorrect = graded && question.correctAnswer.includes(key);
          const isGradedIncorrect = graded && graded.selectedKey === key && !isGradedCorrect;
          const isDim = graded && key !== graded.selectedKey && !isGradedCorrect;
          const isSelected = !graded && selected === key;

          let stateClass = "nn-practice-opt";
          if (isGradedCorrect) stateClass += " nn-practice-opt--correct";
          else if (isGradedIncorrect) stateClass += " nn-practice-opt--incorrect";
          else if (isDim) stateClass += " nn-practice-opt--dim";
          else if (isSelected) stateClass += " nn-practice-opt--selected";

          return (
            <li key={key}>
              <button
                type="button"
                className={stateClass}
                disabled={Boolean(graded)}
                onClick={() => !graded && setSelected(key)}
                aria-pressed={isSelected || Boolean(isGradedCorrect) || Boolean(isGradedIncorrect)}
              >
                <span className="nn-practice-opt__letter" aria-hidden>
                  {optLetter(i)}
                </span>
                <span className="nn-practice-opt__text">{opt}</span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* Submit button */}
      {!graded ? (
        <button
          type="button"
          disabled={!selected}
          onClick={handleSubmit}
          className="mt-2 w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-40"
          style={{
            background: "var(--role-cta, var(--theme-primary))",
            color: "var(--role-cta-foreground, #fff)",
          }}
        >
          Submit answer
        </button>
      ) : null}
    </div>
  );
}

// ── Progress bar ──────────────────────────────────────────────────────────────

function SessionProgressBar({
  current,
  total,
  strategyLabel,
}: {
  current: number;
  total: number;
  strategyLabel: string;
}) {
  const pct = total > 0 ? Math.min(100, Math.round((current / total) * 100)) : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        className="shrink-0 text-xs font-medium"
        style={{ color: "var(--theme-muted-text)" }}
      >
        {strategyLabel}
      </span>
      <div
        className="relative h-1.5 flex-1 overflow-hidden rounded-full"
        style={{
          background:
            "color-mix(in srgb, var(--theme-primary) 12%, var(--bg-page, #f9fafb))",
        }}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
          style={{ width: `${pct}%`, background: "var(--theme-primary)" }}
        />
      </div>
      <span
        className="shrink-0 text-xs tabular-nums"
        style={{ color: "var(--theme-muted-text)" }}
      >
        {current} / {total}
      </span>
    </div>
  );
}

// ── Done screen ───────────────────────────────────────────────────────────────

function SessionDone({
  strategyKey,
  correct,
  total,
}: {
  strategyKey: string;
  correct: number;
  total: number;
}) {
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  return (
    <div
      className="flex flex-col items-center gap-6 rounded-2xl px-8 py-12 text-center"
      style={{
        background:
          "color-mix(in srgb, var(--semantic-success, #22c55e) 7%, var(--bg-card, var(--theme-card-bg)))",
        border:
          "1px solid color-mix(in srgb, var(--semantic-success, #22c55e) 20%, transparent)",
      }}
    >
      <div
        className="flex h-16 w-16 items-center justify-center rounded-full text-2xl font-bold"
        style={{
          background:
            "color-mix(in srgb, var(--semantic-success, #22c55e) 18%, transparent)",
          color: "var(--semantic-success, #22c55e)",
        }}
      >
        {pct}%
      </div>
      <div>
        <p
          className="flex items-center gap-2 text-xl font-bold"
          style={{ color: "var(--theme-heading-text)" }}
        >
          <SuccessLeaf show size={22} />
          Session complete
        </p>
        <p className="mt-2 text-sm" style={{ color: "var(--theme-muted-text)" }}>
          {correct} of {total} correct in this strategy session.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          href={`/app/strategy/${strategyKey}`}
          className="rounded-full px-5 py-2 text-sm font-semibold transition"
          style={{
            background: "var(--role-cta, var(--theme-primary))",
            color: "var(--role-cta-foreground, #fff)",
          }}
        >
          Practice again
        </Link>
        <Link
          href="/app/strategy"
          className="rounded-full border px-5 py-2 text-sm font-semibold transition"
          style={{
            borderColor: "var(--border-subtle, var(--theme-card-border))",
            color: "var(--theme-heading-text)",
          }}
        >
          ← All strategies
        </Link>
      </div>
    </div>
  );
}

// ── Main client ───────────────────────────────────────────────────────────────

const PRELOAD_THRESHOLD = 3;

export type StrategySessionClientProps = {
  initialBatch: StrategySessionBatch;
  counts?: Record<string, number>;
};

export function StrategySessionClient({
  initialBatch,
  counts = {},
}: StrategySessionClientProps) {
  const [questions, setQuestions] = useState<StrategyQuestion[]>(
    initialBatch.questions,
  );
  const [nextCursor, setNextCursor] = useState<string | null>(
    initialBatch.nextCursor,
  );
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gradedMap, setGradedMap] = useState<Record<string, GradedState>>({});
  const [loadingMore, setLoadingMore] = useState(false);
  const [done, setDone] = useState(false);
  const [activeFilter, setActiveFilter] = useState<SessionMode | "">(
    (initialBatch.strategyKey as SessionMode) || "",
  );

  const correctCount = Object.values(gradedMap).filter((g) => g.correct).length;

  // Preload next batch when approaching end
  useEffect(() => {
    if (!nextCursor || loadingMore) return;
    const remaining = questions.length - currentIndex;
    if (remaining > PRELOAD_THRESHOLD) return;
    void (async () => {
      setLoadingMore(true);
      try {
        const batch = await loadMoreStrategyQuestions(
          initialBatch.strategyKey,
          nextCursor,
        );
        if (batch.questions.length > 0) {
          setQuestions((prev) => [...prev, ...batch.questions]);
          setNextCursor(batch.nextCursor);
        } else {
          setNextCursor(null);
        }
      } finally {
        setLoadingMore(false);
      }
    })();
  }, [currentIndex, questions.length, nextCursor, loadingMore, initialBatch.strategyKey]);

  const handleSubmit = useCallback(
    (key: string) => {
      const q = questions[currentIndex];
      if (!q) return;
      setGradedMap((prev) => ({
        ...prev,
        [q.id]: {
          correct: isCorrect(key, q.correctAnswer),
          selectedKey: key,
          correctKey: q.correctAnswer[0] ?? "",
        },
      }));
    },
    [currentIndex, questions],
  );

  const handleNext = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= questions.length) {
      if (!nextCursor) {
        setDone(true);
      }
      return;
    }
    setCurrentIndex(nextIndex);
  }, [currentIndex, nextCursor, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  if (done) {
    return (
      <SessionDone
        strategyKey={initialBatch.strategyKey}
        correct={correctCount}
        total={Object.keys(gradedMap).length}
      />
    );
  }

  const currentQuestion = questions[currentIndex];
  const graded = currentQuestion ? (gradedMap[currentQuestion.id] ?? null) : null;
  const totalKnown = initialBatch.total > 0 ? initialBatch.total : questions.length;

  return (
    <div className="flex flex-col gap-6">
      {/* Filter bar for switching strategies */}
      <div
        className="rounded-2xl p-4"
        style={{
          background:
            "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 5%, var(--bg-card, var(--theme-card-bg)))",
          border: "1px solid var(--border-subtle, var(--theme-card-border))",
        }}
      >
        <StrategyFilterBar
          activeKey={activeFilter}
          onChange={(k) => {
            setActiveFilter(k);
          }}
          counts={counts as Partial<Record<import("@/lib/study/strategy-taxonomy").StrategyKey | "mixed", number>>}
        />
      </div>

      {/* Progress */}
      <SessionProgressBar
        current={currentIndex + 1}
        total={totalKnown}
        strategyLabel={
          initialBatch.strategyKey === "mixed"
            ? "Mixed session"
            : initialBatch.strategyKey.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
        }
      />

      {currentQuestion ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left: question */}
          <div
            className="rounded-2xl p-6"
            style={{
              background:
                "color-mix(in srgb, var(--surface-soft-a, var(--theme-primary)) 6%, var(--bg-card, var(--theme-card-bg)))",
              border: "1px solid var(--border-subtle, var(--theme-card-border))",
            }}
          >
            <QuestionAnswerArea
              question={currentQuestion}
              graded={graded}
              onSubmit={handleSubmit}
            />

            {/* Navigation */}
            {graded ? (
              <div className="mt-5 flex items-center justify-between border-t pt-4"
                style={{ borderColor: "var(--border-subtle, var(--theme-card-border))" }}
              >
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="text-sm font-medium disabled:opacity-40"
                  style={{ color: "var(--theme-muted-text)" }}
                >
                  ← Previous
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="rounded-full px-5 py-2 text-sm font-semibold transition"
                  style={{
                    background: "var(--role-cta, var(--theme-primary))",
                    color: "var(--role-cta-foreground, #fff)",
                  }}
                >
                  Next →
                </button>
              </div>
            ) : null}
          </div>

          {/* Right: rationale + strategy explanation */}
          <div
            className="rounded-2xl p-6"
            style={{
              background:
                "color-mix(in srgb, var(--surface-soft-b, var(--theme-primary)) 5%, var(--bg-card, var(--theme-card-bg)))",
              border: "1px solid var(--border-subtle, var(--theme-card-border))",
            }}
          >
            <PracticeRationalePanel
              status={
                graded
                  ? graded.correct
                    ? "correct"
                    : "incorrect"
                  : "waiting"
              }
              rationale={currentQuestion.rationale}
              correctKeys={currentQuestion.correctAnswer}
              optionDisplayMap={Object.fromEntries(
                currentQuestion.options.map((o) => [o, o]),
              )}
              modeLabel="Strategy Practice"
            />

            {graded ? (
              <div className="mt-4">
                <StrategyExplanationPanel
                  examStrategy={currentQuestion.examStrategy}
                  clinicalTrap={currentQuestion.clinicalTrap}
                  memoryHook={currentQuestion.memoryHook}
                  frameworkUsed={currentQuestion.frameworkUsed}
                  visible={Boolean(graded)}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : (
        <p
          className="text-center text-sm"
          style={{ color: "var(--theme-muted-text)" }}
        >
          {loadingMore ? "Loading questions…" : "No questions available for this strategy."}
        </p>
      )}

      {loadingMore ? (
        <p
          className="text-center text-xs"
          style={{ color: "var(--theme-muted-text)", opacity: 0.6 }}
        >
          Loading next batch…
        </p>
      ) : null}
    </div>
  );
}
