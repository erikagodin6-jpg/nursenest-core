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

import { useRef, useState } from "react";
import { Brain, Sparkles } from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LessonAssessmentScore } from "@/lib/lessons/lesson-assessment-store";
import { QuizScoreSummary } from "@/components/lessons/lesson-assessment-quiz";
import { PathwayLessonQuizSet, itemsResetKey } from "@/components/lessons/pathway-lesson-quiz-set";

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
    <div className="nn-lesson-quiz-module p-4 sm:p-5">
      {/* Header row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))",
              color: "var(--semantic-info)",
              border: "1px solid color-mix(in srgb, var(--semantic-info) 20%, var(--semantic-border-soft))",
            }}
            aria-hidden="true"
          >
            <Brain className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <p className="nn-lesson-module-eyebrow text-[var(--semantic-info)]">Before you read</p>
            <h3 className="mt-1 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
              Quick readiness check
            </h3>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {itemCount} questions · primes prior knowledge and shows baseline
              {priorScore
                ? " · prior run scored " + priorScore.accuracyPct + "% — retake to measure growth"
                : " · about " + Math.ceil(itemCount * 0.75) + " min"}
            </p>
          </div>
        </div>

        {priorScore ? (
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--semantic-info)]"
            style={{
              background: "color-mix(in srgb, var(--semantic-info) 8%, transparent)",
              borderColor: "color-mix(in srgb, var(--semantic-info) 22%, var(--semantic-border-soft))",
            }}
          >
            <Sparkles className="h-3.5 w-3.5" aria-hidden />
            Last: {priorScore.accuracyPct}%
          </div>
        ) : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-info)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--theme-page-bg)] active:scale-[0.99]"
          style={{ background: "var(--semantic-info)" }}
        >
          Start readiness check
        </button>
        <button
          type="button"
          onClick={onSkip}
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] bg-transparent px-4 py-2 text-sm font-medium text-[var(--semantic-text-secondary)] transition hover:bg-[color-mix(in_srgb,var(--semantic-panel-muted)_40%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-border-soft)] focus-visible:ring-offset-2"
        >
          Skip to lesson
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
    <div className="nn-lesson-quiz-module p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[var(--semantic-border-soft)] pb-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md text-white"
          style={{ background: "var(--semantic-info)" }}
          aria-hidden="true"
        >
          <Brain className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="nn-lesson-module-eyebrow text-[var(--semantic-info)]">Readiness check</p>
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Answer each item, review rationale, continue</p>
        </div>
      </div>
      <PathwayLessonQuizSet
        key={`learner-pre-${itemsResetKey(items)}`}
        variant="pre"
        title="Pre-lesson diagnostic"
        subtitle="Practice"
        items={items}
        fullAccess
        className="border-0 pb-0"
        onAssessmentFinished={(score, total) => onComplete(score, total)}
      />
    </div>
  );
}

// ─── Complete card ─────────────────────────────────────────────────────────────

function DiagnosticCompleteCard({
  score,
  total,
  onContinue,
  showScoreSummary = true,
}: {
  score: number;
  total: number;
  onContinue: () => void;
  /** When false, score was already shown in the quiz runner (avoid duplicate). */
  showScoreSummary?: boolean;
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
    <div className="nn-lesson-quiz-module p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-white"
          style={{ background: "var(--semantic-success)" }}
          aria-hidden="true"
        >
          ✓
        </span>
        <p className="text-sm font-semibold text-[var(--semantic-success)]">Baseline captured</p>
      </div>

      {showScoreSummary ? (
        <div className="mt-4">
          <QuizScoreSummary score={score} total={total} label="Baseline score" />
        </div>
      ) : null}

      <p className="mt-3 text-sm leading-relaxed text-[var(--semantic-text-secondary)]">{message}</p>

      <div className="mt-4">
        <button
          type="button"
          onClick={onContinue}
          className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[var(--role-cta-foreground,#fff)] shadow-sm transition hover:opacity-92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-brand)] focus-visible:ring-offset-2"
          style={{ background: "var(--role-cta, var(--semantic-brand))" }}
        >
          Continue to lesson
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
  const completionOnceRef = useRef(false);

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
          if (completionOnceRef.current) return;
          completionOnceRef.current = true;
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
        showScoreSummary={false}
        onContinue={() => setPhase("skipped")} // hides card, lesson becomes visible
      />
    );
  }

  return null;
}
