"use client";

import { useEffect, useMemo, useState } from "react";
import {
  applyStrictModeAttempt,
  deriveMedCalcFeedback,
  type MedCalcLessonDefinition,
  type MedCalcQuestion,
} from "@/lib/med-calculations/med-calculations-engine";
import {
  mergeMedCalcProgress,
  useMedCalcProgress,
} from "@/lib/med-calculations/med-calculations-progress";
import type { MedCalcTrack } from "@/lib/med-calculations/med-calculations-engine";

type Props = {
  userId: string;
  lesson: MedCalcLessonDefinition;
  questions: MedCalcQuestion[];
  hasAccess: boolean;
  medTrack: MedCalcTrack;
  onSessionComplete?: () => void;
  onPracticeEngage?: () => void;
};

function sessionQuestionSet(questions: MedCalcQuestion[], hasAccess: boolean) {
  return hasAccess ? questions : questions.slice(0, 2);
}

export function MedCalculationsPracticeClient({
  userId,
  lesson,
  questions,
  hasAccess,
  onSessionComplete,
  onPracticeEngage,
}: Props) {
  const pool = useMemo(() => sessionQuestionSet(questions, hasAccess), [questions, hasAccess]);
  const [strictMode, setStrictMode] = useState(hasAccess);
  const [timedMode, setTimedMode] = useState(false);
  const [remainingSec, setRemainingSec] = useState(15 * 60);
  const [index, setIndex] = useState(0);
  const [attemptValue, setAttemptValue] = useState("");
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<ReturnType<typeof deriveMedCalcFeedback> | null>(null);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [sessionPassed, setSessionPassed] = useState(false);
  const [sessionResets, setSessionResets] = useState(0);
  const { progress, setProgress, totals } = useMedCalcProgress(userId);

  const current = pool[index] ?? null;
  const lessonProgress = progress[lesson.slug] ?? {
    strictAttempts: 0,
    strictPasses: 0,
    bestStreak: 0,
    totalAnswered: 0,
    correctAnswered: 0,
  };

  useEffect(() => {
    if (!hasAccess && timedMode) setTimedMode(false);
  }, [hasAccess, timedMode]);

  useEffect(() => {
    if (!hasAccess || !timedMode || sessionPassed) return;
    if (remainingSec <= 0) {
      if (strictMode) {
        setIndex(0);
        setCurrentStreak(0);
        setSessionResets((count) => count + 1);
      }
      setFeedback({
        verdict: "incorrect",
        headline: "Time expired — reset and run the full sequence again.",
        evaluated: { accepted: false, normalizedInput: null, expected: null, mistakes: ["Timed mode expired before completion."] },
      });
      setRemainingSec(15 * 60);
      return;
    }
    const timer = window.setTimeout(() => setRemainingSec((sec) => sec - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [timedMode, remainingSec, strictMode, sessionPassed, hasAccess]);

  useEffect(() => {
    setIndex(0);
    setAttemptValue("");
    setSelectedIndex(null);
    setFeedback(null);
    setCurrentStreak(0);
    setSessionPassed(false);
    setSessionResets(0);
    setRemainingSec(15 * 60);
  }, [lesson.slug, strictMode, timedMode]);

  function updateProgress(isCorrect: boolean, finalPass = false) {
    const nextTotal = lessonProgress.totalAnswered + 1;
    const nextCorrect = lessonProgress.correctAnswered + (isCorrect ? 1 : 0);
    setProgress((currentProgress) =>
      mergeMedCalcProgress(currentProgress, lesson.slug, {
        totalAnswered: nextTotal,
        correctAnswered: nextCorrect,
        bestStreak: Math.max(lessonProgress.bestStreak, isCorrect ? currentStreak + 1 : 0),
        strictAttempts: lessonProgress.strictAttempts + (strictMode && index === 0 ? 1 : 0),
        strictPasses: lessonProgress.strictPasses + (finalPass && strictMode ? 1 : 0),
      }),
    );
  }

  function resetStrictRun() {
    setIndex(0);
    setCurrentStreak(0);
    setAttemptValue("");
    setSelectedIndex(null);
    setSessionResets((count) => count + 1);
    if (timedMode) setRemainingSec(15 * 60);
  }

  function submitAnswer() {
    if (!current) return;
    const rawInput = current.numericAnswer == null ? String(selectedIndex ?? "") : attemptValue;
    const nextFeedback = deriveMedCalcFeedback(current, rawInput);
    setFeedback(nextFeedback);

    if (nextFeedback.verdict === "correct") {
      const strictNext = applyStrictModeAttempt(
        { index, streak: currentStreak, resets: sessionResets, passed: false, poolLength: pool.length },
        true,
      );
      const nextStreak = strictNext.streak;
      setCurrentStreak(nextStreak);
      const finalPass = strictNext.passed;
      updateProgress(true, finalPass);
      if (finalPass) {
        setSessionPassed(true);
        onSessionComplete?.();
        return;
      }
      setIndex(strictNext.index);
      setAttemptValue("");
      setSelectedIndex(null);
      return;
    }

    updateProgress(false, false);
    onPracticeEngage?.();
    if (strictMode) {
      const strictNext = applyStrictModeAttempt(
        { index, streak: currentStreak, resets: sessionResets, passed: false, poolLength: pool.length },
        false,
      );
      setSessionResets(strictNext.resets);
      setIndex(strictNext.index);
      setCurrentStreak(strictNext.streak);
      setAttemptValue("");
      setSelectedIndex(null);
      if (timedMode) setRemainingSec(15 * 60);
    }
  }

  if (!current) return null;

  const telemetryWrap = [
    "border-[color-mix(in_srgb,var(--semantic-chart-3)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_07%,var(--semantic-surface))]",
    "border-[color-mix(in_srgb,var(--semantic-chart-4)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-4)_07%,var(--semantic-surface))]",
    "border-[color-mix(in_srgb,var(--semantic-chart-5)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_06%,var(--semantic-surface))]",
    "border-[color-mix(in_srgb,var(--semantic-info)_24%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_06%,var(--semantic-surface))]",
  ] as const;

  return (
    <section
      className="space-y-5 rounded-2xl border border-[color-mix(in_srgb,var(--semantic-chart-5)_20%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_12%,var(--semantic-surface))] p-4 shadow-[var(--semantic-shadow-soft)] sm:p-6"
      data-nn-med-calc-active-workflow=""
    >
      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-lg font-semibold text-[var(--semantic-text-primary)]">Strict practice mode</h2>
          <p className="text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
            Numeric input first, full solution review after each answer, and 100% completion required when strict mode is on.
          </p>
        </div>
        <div className="grid w-full min-w-0 grid-cols-2 gap-2 text-sm sm:w-auto sm:max-w-md">
          <button
            type="button"
            onClick={() => setStrictMode((value) => !value)}
            disabled={!hasAccess}
            className={`min-h-11 touch-manipulation rounded-full border px-3 py-2 font-semibold transition-colors ${
              strictMode
                ? "border-[color-mix(in_srgb,var(--semantic-success)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-success)_92%,var(--semantic-text-primary))]"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_80%,var(--semantic-surface))]"
            } ${!hasAccess ? "opacity-60" : ""}`}
          >
            Strict mode {strictMode ? "on" : "off"}
          </button>
          <button
            type="button"
            onClick={() => setTimedMode((value) => !value)}
            disabled={!hasAccess}
            className={`min-h-11 touch-manipulation rounded-full border px-3 py-2 font-semibold transition-colors ${
              timedMode
                ? "border-[color-mix(in_srgb,var(--semantic-info)_35%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-info)_12%,var(--semantic-surface))] text-[color-mix(in_srgb,var(--semantic-info)_88%,var(--semantic-text-primary))]"
                : "border-[var(--semantic-border-soft)] bg-[var(--semantic-surface)] text-[var(--semantic-text-primary)] hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_80%,var(--semantic-surface))]"
            } ${!hasAccess ? "opacity-60" : ""}`}
          >
            Timed mode {timedMode ? "on" : "off"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[0]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Question</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">
            {index + 1} / {pool.length}
          </div>
        </div>
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[1]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Current streak</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{currentStreak}</div>
        </div>
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[2]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Best streak</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{Math.max(lessonProgress.bestStreak, currentStreak)}</div>
        </div>
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[3]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Timer</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">
            {timedMode ? `${Math.floor(remainingSec / 60)}:${String(remainingSec % 60).padStart(2, "0")}` : "Off"}
          </div>
        </div>
      </div>

      <div className="space-y-4 rounded-xl border border-[color-mix(in_srgb,var(--semantic-chart-4)_18%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] p-4 shadow-inner sm:p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-3)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-3)_08%,var(--semantic-surface))] px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-[color-mix(in_srgb,var(--semantic-chart-3)_88%,var(--semantic-text-primary))]">
            {current.type.replaceAll("_", " ")}
          </span>
          <span className="rounded-full border border-[color-mix(in_srgb,var(--semantic-chart-5)_26%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-chart-5)_06%,var(--semantic-surface))] px-2.5 py-0.5 text-[11px] font-semibold text-[color-mix(in_srgb,var(--semantic-chart-5)_88%,var(--semantic-text-primary))]">
            Difficulty: {current.difficulty}
          </span>
        </div>
        <h3 className="break-words text-balance text-base font-semibold text-[var(--semantic-text-primary)]">{current.stem}</h3>
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          {current.answerFormat.roundingText} Final unit: {current.answerFormat.unit}.
        </p>

        {current.numericAnswer != null ? (
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--semantic-text-primary)]">Your answer</span>
            <input
              value={attemptValue}
              onChange={(event) => setAttemptValue(event.target.value)}
              inputMode="decimal"
              className="w-full min-h-12 rounded-xl border border-[color-mix(in_srgb,var(--semantic-info)_28%,var(--semantic-border-soft))] bg-[var(--semantic-surface)] px-4 py-3 text-base tabular-nums text-[var(--semantic-text-primary)] shadow-[var(--semantic-shadow-soft)] outline-none ring-offset-2 transition-[box-shadow,border-color] focus-visible:border-[color-mix(in_srgb,var(--semantic-brand)_45%,var(--semantic-border-soft))] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--semantic-brand)_35%,transparent)]"
              placeholder={`Enter ${current.answerFormat.unit}`}
            />
          </label>
        ) : (
          <div className="space-y-2">
            {current.options.map((option, optionIndex) => (
              <label
                key={option}
                className="flex cursor-pointer items-start gap-3 rounded-xl border border-[color-mix(in_srgb,var(--semantic-border-soft)_95%,transparent)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,var(--semantic-surface))] px-3 py-2.5 text-sm transition-colors hover:border-[color-mix(in_srgb,var(--semantic-chart-4)_28%,var(--semantic-border-soft))]"
              >
                <input
                  type="radio"
                  name={current.id}
                  checked={selectedIndex === optionIndex}
                  onChange={() => setSelectedIndex(optionIndex)}
                  className="mt-1"
                />
                <span className="text-[var(--semantic-text-primary)]">{option}</span>
              </label>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <button
            type="button"
            onClick={submitAnswer}
            className="min-h-11 touch-manipulation rounded-full bg-[var(--role-cta)] px-5 py-2 text-sm font-semibold text-[var(--role-cta-foreground)] shadow-[0_2px_12px_var(--role-cta-shadow)] transition-[filter,transform] hover:brightness-105"
          >
            Check answer
          </button>
          <button
            type="button"
            onClick={resetStrictRun}
            className="min-h-11 touch-manipulation rounded-full border border-[color-mix(in_srgb,var(--semantic-warning)_30%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-warning)_06%,var(--semantic-surface))] px-5 py-2 text-sm font-semibold text-[var(--semantic-text-primary)] transition-colors hover:bg-[color-mix(in_srgb,var(--semantic-warning)_10%,var(--semantic-surface))]"
          >
            Reset run
          </button>
        </div>
      </div>

      {feedback ? (
        <div
          className={`space-y-3 rounded-lg border p-4 ${
            feedback.verdict === "correct"
              ? "border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))]"
              : "border-[color-mix(in_srgb,var(--semantic-danger)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-danger)_10%,var(--semantic-surface))]"
          }`}
        >
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">{feedback.headline}</p>
          {feedback.evaluated.mistakes.length > 0 ? (
            <ul className="list-disc space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
              {feedback.evaluated.mistakes.map((mistake) => (
                <li key={mistake}>{mistake}</li>
              ))}
            </ul>
          ) : null}
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">Solution steps</p>
            <ol className="list-decimal space-y-1 pl-5 text-sm text-[var(--semantic-text-secondary)]">
              {current.solutionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
            <p className="text-sm text-[var(--semantic-text-secondary)]">{current.rationale}</p>
            <p className="text-sm text-[var(--semantic-text-secondary)]">{current.safetyNote}</p>
          </div>
        </div>
      ) : null}

      {sessionPassed ? (
        <div className="rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_40%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] p-4">
          <p className="text-sm font-semibold text-[var(--semantic-text-primary)]">
            {strictMode ? "Session complete — 100% of the run answered correctly." : "Session complete — you finished the practice set."}
          </p>
          <p className="mt-1 text-sm text-[var(--semantic-text-secondary)]">
            {strictMode
              ? `Strict passes recorded for this topic: ${lessonProgress.strictPasses + 1}.`
              : "Turn on strict mode (paid) to train for zero-error completion across the full pool."}
          </p>
        </div>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[0]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Strict attempts</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{lessonProgress.strictAttempts}</div>
        </div>
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[1]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Strict passes</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{lessonProgress.strictPasses}</div>
        </div>
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[2]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Session resets</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">{sessionResets}</div>
        </div>
        <div className={`min-w-0 rounded-xl border p-3 text-sm shadow-[var(--semantic-shadow-soft)] ${telemetryWrap[3]}`}>
          <div className="text-[0.65rem] font-semibold tracking-wide text-[var(--semantic-text-muted)]">Overall accuracy</div>
          <div className="mt-1 font-semibold tabular-nums text-[var(--semantic-text-primary)]">
            {totals.totalAnswered > 0 ? Math.round((totals.correctAnswered / totals.totalAnswered) * 100) : 0}%
          </div>
        </div>
      </div>

      {!hasAccess ? (
        <p className="text-sm text-[var(--semantic-text-secondary)]">
          Preview users can try a limited practice subset. Paid access unlocks full question sets, strict mode, and timed
          sessions.
        </p>
      ) : null}
    </section>
  );
}
