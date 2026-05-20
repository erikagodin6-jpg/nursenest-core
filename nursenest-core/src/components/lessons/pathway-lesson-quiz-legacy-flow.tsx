"use client";

/**
 * Port of legacy `client/src/pages/lesson-detail.tsx` QuizSection + QuizReport + ScoreRing:
 * start screen → one question at a time with feedback → summary ring + stats + optional review.
 * Uses semantic CSS variables only (no hardcoded grays/hex for product chrome).
 */

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CheckCircle2,
  FileText,
  Lightbulb,
  TrendingUp,
  XCircle,
} from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function cn(...parts: (string | false | undefined | null)[]) {
  return parts.filter(Boolean).join(" ");
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"];

type AnswerRecord = { questionIndex: number; selected: number; correct: number; isCorrect: boolean };

type TestKind = "pretest" | "posttest";

function preScoreStorageKey(pathwayId: string, lessonSlug: string) {
  return `nn.pathwayLesson.preScore.${pathwayId}.${lessonSlug}`;
}

function readPreScore(pathwayId: string, lessonSlug: string): { percentage: number; score: number; total: number } | null {
  try {
    const raw = sessionStorage.getItem(preScoreStorageKey(pathwayId, lessonSlug));
    if (!raw) return null;
    const v = JSON.parse(raw) as { percentage?: number; score?: number; total?: number };
    if (
      typeof v.percentage === "number" &&
      typeof v.score === "number" &&
      typeof v.total === "number" &&
      v.total > 0
    ) {
      return { percentage: v.percentage, score: v.score, total: v.total };
    }
    return null;
  } catch {
    return null;
  }
}

function ScoreRing({ percentage, size = 120 }: { percentage: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;
  const stroke =
    percentage >= 75
      ? "var(--semantic-success)"
      : percentage >= 50
        ? "var(--semantic-warning)"
        : "var(--semantic-danger)";
  const textColor = stroke;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="var(--semantic-border-soft)"
          strokeWidth={8}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={8}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color: textColor }}>
          {percentage}%
        </span>
        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--semantic-text-secondary)]">
          Score
        </span>
      </div>
    </div>
  );
}

function QuizReport({
  questions,
  answers,
  testType,
  preTestScore,
  onRetake,
}: {
  questions: PathwayLessonQuizItem[];
  answers: AnswerRecord[];
  testType: TestKind;
  preTestScore: { percentage: number; score: number; total: number } | null;
  onRetake: () => void;
}) {
  const [showReview, setShowReview] = useState(false);
  const derivedScore = answers.filter((a) => a.isCorrect).length;
  const percentage = questions.length > 0 ? Math.round((derivedScore / questions.length) * 100) : 0;
  const passed = percentage >= 75;
  const missed = answers.filter((a) => !a.isCorrect);

  const statCard =
    "rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-surface)_92%,var(--semantic-panel-positive)_8%)] p-4 text-center shadow-[var(--shadow-card)]";

  return (
    <div className="space-y-8" data-testid={`section-${testType}-report`}>
      <div className="space-y-4 text-center">
        <ScoreRing percentage={percentage} size={140} />
        <h2 className="text-2xl font-bold text-[var(--theme-heading-text)] sm:text-3xl" data-testid={`text-${testType}-result`}>
          {testType === "pretest" ? "Pre-test complete" : "Post-test complete"}
        </h2>
        <p className="text-lg text-[var(--theme-muted-text)]" data-testid={`text-${testType}-score`}>
          {derivedScore} of {questions.length} correct
        </p>
        {passed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] px-4 py-1.5 text-sm font-bold text-[var(--semantic-success-contrast)]">
            <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
            Passed (75% threshold)
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_14%,var(--semantic-surface))] px-4 py-1.5 text-sm font-bold text-[var(--semantic-warning-contrast)]">
            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden />
            Below 75% — review recommended
          </span>
        )}
      </div>

      {testType === "posttest" && preTestScore ? (
        <section
          className="rounded-xl border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-panel-positive)_12%)] p-6 shadow-[var(--shadow-card)]"
          data-testid="section-score-comparison"
        >
          <h3 className="flex items-center justify-center gap-2 text-lg font-bold text-[var(--theme-heading-text)]">
            <TrendingUp className="h-5 w-5 text-[var(--semantic-success)]" aria-hidden />
            Learning progress
          </h3>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="mb-1 text-sm text-[var(--theme-muted-text)]">Pre-test</p>
              <p className="text-3xl font-bold tabular-nums text-[var(--semantic-info)]">{preTestScore.percentage}%</p>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-2xl text-[var(--semantic-border-soft)]">→</span>
            </div>
            <div className="text-center">
              <p className="mb-1 text-sm text-[var(--theme-muted-text)]">Post-test</p>
              <p className="text-3xl font-bold tabular-nums text-[var(--semantic-success)]">{percentage}%</p>
            </div>
          </div>
          {percentage - preTestScore.percentage > 0 ? (
            <p className="mt-3 text-center text-lg font-bold text-[var(--semantic-success)]" data-testid="text-improvement">
              +{percentage - preTestScore.percentage}% improvement
            </p>
          ) : percentage === preTestScore.percentage ? (
            <p className="mt-3 text-center font-medium text-[var(--theme-muted-text)]">Same score — consider reviewing weak areas.</p>
          ) : (
            <p className="mt-3 text-center font-medium text-[var(--semantic-warning-contrast)]">
              Keep studying — revisit the areas you missed.
            </p>
          )}
        </section>
      ) : null}

      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className={cn(statCard, "bg-[color-mix(in_srgb,var(--semantic-panel-positive)_22%,var(--semantic-surface))]")}>
          <p className="text-2xl font-bold tabular-nums text-[var(--semantic-success)]">{answers.filter((a) => a.isCorrect).length}</p>
          <p className="mt-1 text-xs font-medium text-[var(--semantic-success-contrast)]">Correct</p>
        </div>
        <div className={cn(statCard, "bg-[color-mix(in_srgb,var(--semantic-panel-warm)_20%,var(--semantic-surface))]")}>
          <p className="text-2xl font-bold tabular-nums text-[var(--semantic-danger)]">{missed.length}</p>
          <p className="mt-1 text-xs font-medium text-[var(--semantic-danger-contrast)]">Missed</p>
        </div>
        <div className={cn(statCard, "bg-[color-mix(in_srgb,var(--semantic-panel-cool)_18%,var(--semantic-surface))]")}>
          <p className="text-2xl font-bold tabular-nums text-[var(--semantic-info)]">{questions.length}</p>
          <p className="mt-1 text-xs font-medium text-[var(--semantic-info)]">Total</p>
        </div>
      </div>

      {missed.length > 0 ? (
        <section className="rounded-xl border border-[color-mix(in_srgb,var(--semantic-warning)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))] p-6 shadow-[var(--shadow-card)]">
          <h3 className="flex items-center gap-2 font-bold text-[var(--theme-heading-text)]">
            <Lightbulb className="h-5 w-5 text-[var(--semantic-warning)]" aria-hidden />
            Areas to review
          </h3>
          <p className="mt-2 text-sm text-[var(--theme-muted-text)]">
            You missed {missed.length} question{missed.length === 1 ? "" : "s"}. Focus on the rationales below when you expand the review.
          </p>
          {testType === "pretest" ? (
            <p className="mt-2 text-sm font-medium text-[var(--semantic-brand)]">Continue to clinical content when you are ready.</p>
          ) : null}
        </section>
      ) : null}

      <div className="space-y-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowReview(!showReview)}
          className="h-12 w-full gap-2"
          data-testid={`button-toggle-${testType}-review`}
        >
          <FileText className="h-4 w-4" aria-hidden />
          {showReview ? "Hide question review" : `Review all ${questions.length} questions`}
        </Button>

        {showReview ? (
          <div className="mt-4 space-y-4" data-testid={`section-${testType}-question-review`}>
            {questions.map((q, idx) => {
              const answer = answers.find((a) => a.questionIndex === idx);
              const wasCorrect = answer?.isCorrect ?? false;
              return (
                <div
                  key={idx}
                  className={cn(
                    "rounded-xl border border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] p-5 shadow-sm",
                    wasCorrect ? "border-l-4 border-l-[var(--semantic-success)]" : "border-l-4 border-l-[var(--semantic-danger)]",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                        wasCorrect
                          ? "bg-[color-mix(in_srgb,var(--semantic-success)_18%,var(--semantic-surface))] text-[var(--semantic-success-contrast)]"
                          : "bg-[color-mix(in_srgb,var(--semantic-danger)_16%,var(--semantic-surface))] text-[var(--semantic-danger-contrast)]",
                      )}
                    >
                      {idx + 1}
                    </div>
                    <p className="text-sm font-medium leading-relaxed text-[var(--theme-heading-text)]">{q.question}</p>
                  </div>
                  <div className="ml-10 mt-3 space-y-1.5">
                    {q.options.map((opt, oi) => {
                      const isCorrectOpt = oi === q.correct;
                      const wasSelected = answer?.selected === oi;
                      return (
                        <div
                          key={oi}
                          className={cn(
                            "flex items-center gap-2 text-sm",
                            isCorrectOpt
                              ? "font-medium text-[var(--semantic-success-contrast)]"
                              : wasSelected && !isCorrectOpt
                                ? "text-[var(--semantic-danger)] line-through"
                                : "text-[var(--theme-muted-text)]",
                          )}
                        >
                          {isCorrectOpt ? (
                            <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-success)]" aria-hidden />
                          ) : wasSelected ? (
                            <XCircle className="h-3.5 w-3.5 shrink-0 text-[var(--semantic-danger)]" aria-hidden />
                          ) : (
                            <div className="h-3.5 w-3.5 shrink-0 rounded-full border border-[var(--semantic-border-soft)]" />
                          )}
                          <span>{opt}</span>
                        </div>
                      );
                    })}
                  </div>
                  {!wasCorrect && q.rationale ? (
                    <div className="ml-10 mt-3 rounded-lg border border-[color-mix(in_srgb,var(--semantic-warning)_25%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_8%,var(--semantic-surface))] p-3">
                      <p className="text-xs font-bold text-[var(--semantic-warning-contrast)]">Why this matters</p>
                      <p className="mt-1 text-xs leading-relaxed text-[var(--theme-body-text)]">{q.rationale}</p>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onRetake} className="gap-2" data-testid={`button-retake-${testType}`}>
          <Activity className="h-4 w-4" aria-hidden />
          {testType === "pretest" ? "Retake pre-test" : "Retake post-test"}
        </Button>
        {testType === "pretest" ? (
          <p className="text-sm text-[var(--theme-muted-text)]">Scroll up to continue the lesson whenever you are ready.</p>
        ) : null}
      </div>
    </div>
  );
}

export function PathwayLessonQuizLegacyFlow({
  variant,
  title,
  subtitle,
  items,
  fullAccess,
  pathwayId,
  lessonSlug,
  onAssessmentFinished,
  className = "",
}: {
  variant: "pre" | "post";
  title: string;
  subtitle?: string;
  items: PathwayLessonQuizItem[] | undefined;
  fullAccess: boolean;
  pathwayId: string;
  lessonSlug: string;
  onAssessmentFinished?: (score: number, total: number) => void;
  className?: string;
}) {
  const testType: TestKind = variant === "pre" ? "pretest" : "posttest";
  const questions = useMemo(() => items ?? [], [items]);
  const total = questions.length;

  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [complete, setComplete] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answerLog, setAnswerLog] = useState<AnswerRecord[]>([]);

  const preTestScore = useMemo(() => {
    if (variant !== "post") return null;
    return readPreScore(pathwayId, lessonSlug);
  }, [variant, pathwayId, lessonSlug]);

  const resetQuiz = useCallback(() => {
    setStarted(false);
    setCurrentQ(0);
    setComplete(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setAnswerLog([]);
  }, []);

  useEffect(() => {
    resetQuiz();
  }, [total, variant, resetQuiz]);

  const handleAnswer = useCallback(
    (index: number) => {
      if (selectedAnswer !== null || total === 0) return;
      const q = questions[currentQ];
      if (!q) return;

      const questionIndex = currentQ;
      setSelectedAnswer(index);
      setShowFeedback(true);
      const isCorrect = index === q.correct;
      const record: AnswerRecord = {
        questionIndex,
        selected: index,
        correct: q.correct,
        isCorrect,
      };
      setAnswerLog((prev) => [...prev, record]);

      window.setTimeout(() => {
        setShowFeedback(false);
        setSelectedAnswer(null);

        if (questionIndex + 1 < total) {
          setCurrentQ((x) => x + 1);
          return;
        }

        setAnswerLog((prev) => {
          const finalScore = prev.filter((a) => a.isCorrect).length;
          const pct = total > 0 ? Math.round((finalScore / total) * 100) : 0;
          queueMicrotask(() => {
            setComplete(true);
            try {
              if (variant === "pre") {
                sessionStorage.setItem(
                  preScoreStorageKey(pathwayId, lessonSlug),
                  JSON.stringify({ score: finalScore, total, percentage: pct }),
                );
              }
            } catch {
              /* ignore */
            }
            onAssessmentFinished?.(finalScore, total);
          });
          return prev;
        });
      }, 2000);
    },
    [selectedAnswer, total, questions, currentQ, variant, pathwayId, lessonSlug, onAssessmentFinished],
  );

  if (!total) return null;

  if (!started) {
    return (
      <section className={cn("border-b border-[var(--semantic-border-soft)] pb-6 last:border-b-0 last:pb-0", className)}>
        <div className="flex flex-col gap-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-5">
          <div className="flex min-w-0 flex-1 items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-border-soft)_80%,var(--semantic-brand)_20%)] bg-[color-mix(in_srgb,var(--semantic-brand)_8%,var(--semantic-surface))] sm:h-14 sm:w-14">
              {variant === "pre" ? (
                <BarChart3 className="h-6 w-6 text-[var(--semantic-brand)] sm:h-7 sm:w-7" aria-hidden />
              ) : (
                <TrendingUp className="h-6 w-6 text-[var(--semantic-brand)] sm:h-7 sm:w-7" aria-hidden />
              )}
            </div>
            <div className="min-w-0">
              <h3 className="text-lg font-semibold tracking-tight text-[var(--theme-heading-text)] sm:text-xl" data-testid={`text-${testType}-title`}>
                {variant === "pre" ? "Baseline check" : "Retention check"}
              </h3>
              <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[var(--theme-muted-text)]">
                {variant === "pre"
                  ? "Prime prior knowledge before you read—quick, low stakes. Your result pairs with the reinforcement pass when you finish."
                  : "Close the loop on what you just studied—short, focused, and built for active recall."}
              </p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--semantic-text-secondary)]">
                {total} question{total === 1 ? "" : "s"}
              </p>
            </div>
          </div>
          <Button
            type="button"
            className="h-11 shrink-0 rounded-md px-6 text-sm font-semibold sm:h-12 sm:self-center sm:px-8 sm:text-[0.9375rem]"
            onClick={() => setStarted(true)}
            data-testid={`button-start-${testType}`}
          >
            {variant === "pre" ? "Begin readiness" : "Begin reinforcement"}
          </Button>
        </div>
      </section>
    );
  }

  if (complete) {
    return (
      <section className={cn("border-b border-[var(--semantic-border-soft)] pb-8", className)}>
        <div className="mb-4">
          <h2 className="text-base font-medium text-[var(--theme-heading-text)] sm:text-lg">{title}</h2>
        </div>
        <QuizReport
          questions={questions}
          answers={answerLog}
          testType={testType}
          preTestScore={preTestScore}
          onRetake={resetQuiz}
        />
      </section>
    );
  }

  const q = questions[currentQ];
  const progressPercent = total > 0 ? ((currentQ + 1) / total) * 100 : 0;

  return (
    <section className={cn("border-b border-[var(--semantic-border-soft)] pb-8", className)}>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-medium text-[var(--theme-heading-text)] sm:text-lg">{title}</h2>
          {subtitle ? (
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.14em] text-[var(--semantic-text-secondary)]">{subtitle}</p>
          ) : null}
        </div>
        <div
          className="inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium tabular-nums"
          style={{
            borderColor: "var(--semantic-border-soft)",
            background: "color-mix(in srgb, var(--semantic-chart-2) 10%, var(--semantic-surface))",
            color: "var(--semantic-chart-2)",
          }}
        >
          {currentQ + 1}/{total}
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-8 py-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <p
              className="text-sm font-bold uppercase tracking-wider text-[var(--semantic-brand)]"
              data-testid={`text-${testType}-progress`}
            >
              Question {currentQ + 1} of {total}
            </p>
            <span className="text-sm tabular-nums text-[var(--semantic-text-secondary)]">{Math.round(progressPercent)}%</span>
          </div>
          <Progress value={progressPercent} variant="accent" className="h-2" />
        </div>

        <h3
          className="text-lg font-semibold leading-snug tracking-tight text-[var(--theme-heading-text)] sm:text-xl"
          data-testid={`text-${testType}-question`}
        >
          {q.question}
        </h3>

        <div className="grid gap-3 sm:gap-3.5">
          {q.options.map((option, i) => {
            const isCorrect = i === q.correct;
            const isSelected = selectedAnswer === i;
            let cardStyle =
              "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] hover:bg-[color-mix(in_srgb,var(--semantic-brand)_6%,var(--semantic-surface))] hover:border-[color-mix(in_srgb,var(--semantic-brand)_35%,var(--semantic-border-soft))] cursor-pointer hover:shadow-md";
            if (selectedAnswer !== null) {
              if (isCorrect)
                cardStyle =
                  "border-[color-mix(in_srgb,var(--semantic-success)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[var(--theme-heading-text)]";
              else if (isSelected)
                cardStyle =
                  "border-[color-mix(in_srgb,var(--semantic-danger)_45%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_12%,var(--semantic-surface))] text-[var(--theme-heading-text)]";
              else cardStyle = "border-[var(--semantic-border-soft)] opacity-60";
            }
            return (
              <button
                key={i}
                type="button"
                className={cn("rounded-xl border text-left shadow-sm transition-all", cardStyle)}
                onClick={() => selectedAnswer === null && handleAnswer(i)}
                data-testid={`card-${testType}-option-${i}`}
              >
                <div className="flex items-start gap-3 p-4">
                  <div
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                      selectedAnswer !== null && isCorrect
                        ? "bg-[var(--semantic-success)] text-[var(--text-on-dark)]"
                        : isSelected && !isCorrect
                          ? "bg-[var(--semantic-danger)] text-[var(--text-on-dark)]"
                          : "bg-[color-mix(in_srgb,var(--theme-page-bg)_88%,var(--semantic-panel-cool)_12%)] text-[var(--theme-heading-text)]",
                    )}
                  >
                    {selectedAnswer !== null && isCorrect ? (
                      <CheckCircle2 className="h-5 w-5" aria-hidden />
                    ) : isSelected && !isCorrect ? (
                      <XCircle className="h-5 w-5" aria-hidden />
                    ) : (
                      OPTION_LETTERS[i] ?? String(i + 1)
                    )}
                  </div>
                  <span className="pt-0.5 leading-relaxed text-[var(--theme-body-text)]">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        {showFeedback && q.rationale ? (
          <div
            className={cn(
              "rounded-xl border p-4",
              selectedAnswer === q.correct
                ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-positive)_22%,var(--semantic-surface))] text-[var(--theme-body-text)]"
                : "border-[color-mix(in_srgb,var(--semantic-danger)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-warm)_18%,var(--semantic-surface))] text-[var(--theme-body-text)]",
            )}
            data-testid={`text-${testType}-rationale`}
          >
            <p className="mb-1 font-bold text-[var(--theme-heading-text)]">
              {selectedAnswer === q.correct ? "Correct" : "Incorrect"}
            </p>
            <p className={cn("text-sm leading-relaxed", !fullAccess && "select-none blur-sm")}>{q.rationale}</p>
            {!fullAccess ? (
              <p className="mt-2 text-xs font-medium text-[var(--semantic-warning-contrast)]">
                Full lesson access unlocks clear rationales and highlights.
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
