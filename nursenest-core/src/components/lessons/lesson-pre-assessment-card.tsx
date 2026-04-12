"use client";

/**
 * Pre-lesson diagnostic card.
 *
 * States:
 *   idle      — "Start a quick diagnostic" prompt with skip option
 *   running   — interactive quiz (LessonAssessmentQuiz)
 *   complete  — score summary + "Begin lesson" CTA
 *   skipped   — learner bypassed the diagnostic; renders nothing
 *
 * On completion, calls onScoreRecorded({ score, total }) so the parent
 * can persist the score via the API.
 */

import { useState } from "react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LessonAssessmentScore } from "@/lib/lessons/lesson-assessment-store";
import { LessonAssessmentQuiz, QuizScoreSummary } from "@/components/lessons/lesson-assessment-quiz";

// ─── Idle card ─────────────────────────────────────────────────────────────────

function DiagnosticIdleCard({
  itemCount,
  priorScore,
  onStart,
  onSkip,
}: {
  itemCount: number;
  priorScore: LessonAssessmentScore | null;
  onStart: () => void;
  onSkip: () => void;
}) {
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-info) 6%, var(--semantic-surface))",
        borderColor: "color-mix(in srgb, var(--semantic-info) 25%, var(--semantic-border-soft))",
      }}
    >
      {/* Header row */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 15%, var(--semantic-surface))",
              color: "var(--semantic-info)",
            }}
            aria-hidden="true"
          >
            🧠
          </span>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--semantic-info)" }}
            >
              Pre-lesson diagnostic
            </p>
            <h3
              className="mt-1 text-base font-semibold leading-snug"
              style={{ color: "var(--theme-heading-text)" }}
            >
              Start with a quick diagnostic
            </h3>
            <p className="mt-1.5 max-w-md text-sm leading-6" style={{ color: "var(--theme-muted-text)" }}>
              {itemCount} questions · establishes your baseline before you read
              {priorScore
                ? " · you have a previous score — take it again to see if you've improved"
                : " · takes ~" + Math.ceil(itemCount * 0.75) + " minutes"}
            </p>
          </div>
        </div>

        {/* Prior score chip */}
        {priorScore ? (
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
              color: "var(--semantic-info)",
              border: "1px solid color-mix(in srgb, var(--semantic-info) 25%, transparent)",
            }}
          >
            <span aria-hidden="true">📊</span>
            Previous: {priorScore.accuracyPct}%
          </div>
        ) : null}
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={onStart}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "var(--semantic-info)",
            color: "#fff",
          }}
        >
          Start diagnostic →
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="rounded-full px-5 py-2.5 text-sm font-medium transition-colors"
          style={{
            color: "var(--semantic-text-secondary)",
            border: "1px solid var(--semantic-border-soft)",
          }}
        >
          Skip — go straight to lesson
        </button>
      </div>
    </div>
  );
}

// ─── Running card ──────────────────────────────────────────────────────────────

function DiagnosticRunningCard({
  items,
  onComplete,
}: {
  items: PathwayLessonQuizItem[];
  onComplete: (score: number, total: number) => void;
}) {
  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-info) 5%, var(--semantic-surface))",
        borderColor: "color-mix(in srgb, var(--semantic-info) 25%, var(--semantic-border-soft))",
      }}
    >
      <div className="mb-5 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
          style={{
            background: "var(--semantic-info)",
            color: "#fff",
          }}
          aria-hidden="true"
        >
          🧠
        </span>
        <p
          className="text-sm font-semibold"
          style={{ color: "var(--semantic-info)" }}
        >
          Pre-lesson diagnostic
        </p>
      </div>
      <LessonAssessmentQuiz
        items={items}
        onComplete={({ score, total }) => onComplete(score, total)}
      />
    </div>
  );
}

// ─── Complete card ─────────────────────────────────────────────────────────────

function DiagnosticCompleteCard({
  score,
  total,
  onContinue,
}: {
  score: number;
  total: number;
  onContinue: () => void;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;
  const message =
    pct >= 80
      ? "Strong baseline — you know this topic well. The lesson will deepen your understanding."
      : pct >= 60
      ? "Solid foundation. The lesson will fill in the remaining gaps."
      : pct >= 40
      ? "Some familiarity here. The lesson content will be especially valuable."
      : "Fresh ground to cover — the lesson will build your understanding from the foundation up.";

  return (
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-success) 6%, var(--semantic-surface))",
        borderColor: "color-mix(in srgb, var(--semantic-success) 25%, var(--semantic-border-soft))",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
          style={{ background: "var(--semantic-success)", color: "#fff" }}
          aria-hidden="true"
        >
          ✓
        </span>
        <p className="text-sm font-semibold" style={{ color: "var(--semantic-success)" }}>
          Diagnostic complete
        </p>
      </div>

      <div className="mt-4">
        <QuizScoreSummary score={score} total={total} label="Baseline score" />
      </div>

      <p className="mt-3 text-sm leading-6" style={{ color: "var(--theme-muted-text)" }}>
        {message}
      </p>

      <div className="mt-5">
        <button
          type="button"
          onClick={onContinue}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "var(--role-cta, var(--semantic-brand))",
            color: "var(--role-cta-foreground, #fff)",
          }}
        >
          Begin lesson →
        </button>
      </div>
    </div>
  );
}

// ─── Orchestrator ──────────────────────────────────────────────────────────────

type PreAssessmentPhase = "idle" | "running" | "complete" | "skipped";

export function LessonPreAssessmentCard({
  items,
  priorScore,
  onScoreRecorded,
  onSkip,
}: {
  items: PathwayLessonQuizItem[];
  priorScore: LessonAssessmentScore | null;
  /**
   * Called once the quiz is complete. The parent is responsible for
   * calling POST /api/learner/lesson-assessment.
   */
  onScoreRecorded: (score: number, total: number) => void;
  onSkip: () => void;
}) {
  const [phase, setPhase] = useState<PreAssessmentPhase>("idle");
  const [finalScore, setFinalScore] = useState<{ score: number; total: number } | null>(null);

  if (phase === "skipped" || !items.length) return null;

  if (phase === "idle") {
    return (
      <DiagnosticIdleCard
        itemCount={items.length}
        priorScore={priorScore}
        onStart={() => setPhase("running")}
        onSkip={() => {
          setPhase("skipped");
          onSkip();
        }}
      />
    );
  }

  if (phase === "running") {
    return (
      <DiagnosticRunningCard
        items={items}
        onComplete={(score, total) => {
          setFinalScore({ score, total });
          setPhase("complete");
          onScoreRecorded(score, total);
        }}
      />
    );
  }

  if (phase === "complete" && finalScore) {
    return (
      <DiagnosticCompleteCard
        score={finalScore.score}
        total={finalScore.total}
        onContinue={() => setPhase("skipped")} // hides card, lesson becomes visible
      />
    );
  }

  return null;
}
