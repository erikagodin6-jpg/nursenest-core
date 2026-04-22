"use client";

/**
 * Post-lesson retention card.
 *
 * States:
 *   locked     — lesson not yet complete; shows a "waiting" nudge
 *   idle       — lesson complete; invites the learner to check retention
 *   running    — interactive quiz
 *   complete   — score summary with improvement delta vs pre-assessment
 *
 * Improvement delta formula:
 *   delta = postPct - prePct
 *   Displayed as "+N pp" (percentage-point gain) with motivating copy.
 *
 * On completion, calls onScoreRecorded so the parent persists via the API.
 */

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, ClipboardCheck, Lock, TrendingDown, TrendingUp } from "lucide-react";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LessonAssessmentScore } from "@/lib/lessons/lesson-assessment-store";
import { QuizScoreSummary } from "@/components/lessons/lesson-assessment-quiz";
import { PathwayLessonQuizSet, itemsResetKey } from "@/components/lessons/pathway-lesson-quiz-set";

// ─── Delta badge ───────────────────────────────────────────────────────────────

function ImprovementDelta({
  preScore,
  postScore,
  postTotal,
}: {
  preScore: LessonAssessmentScore;
  postScore: number;
  postTotal: number;
}) {
  const prePct = preScore.total > 0 ? Math.round((preScore.score / preScore.total) * 100) : 0;
  const postPct = postTotal > 0 ? Math.round((postScore / postTotal) * 100) : 0;
  const delta = postPct - prePct;
  const isGain = delta > 0;
  const isSame = delta === 0;

  const color = isGain
    ? "var(--semantic-success)"
    : isSame
    ? "var(--semantic-info)"
    : "var(--semantic-warning)";

  const bg = isGain
    ? "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))"
    : isSame
    ? "color-mix(in srgb, var(--semantic-info) 12%, var(--semantic-surface))"
    : "color-mix(in srgb, var(--semantic-warning) 12%, var(--semantic-surface))";

  const message = isGain
    ? `+${delta} percentage points since your diagnostic — real, measurable learning.`
    : isSame
    ? "You held your ground — the lesson reinforced what you already knew."
    : `The lesson covered challenging material. Reviewing the weak topics will close the ${Math.abs(delta)} pp gap.`;

  const Icon = isGain ? TrendingUp : isSame ? CheckCircle2 : TrendingDown;

  return (
    <div
      className="flex flex-col gap-3 rounded-lg border p-3.5"
      style={{ background: bg, borderColor: `color-mix(in srgb, ${color} 22%, var(--semantic-border-soft))` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md"
          style={{ background: color, color: "#fff" }}
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={2} />
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color }}>
            {isGain
              ? "Learning gain detected"
              : isSame
              ? "Consistent score"
              : "Room to grow"}
          </p>
          <div className="mt-0.5 flex items-baseline gap-2">
            <span
              className="text-xs"
              style={{ color: "var(--semantic-text-secondary)" }}
            >
              Before: {prePct}%
            </span>
            <span
              className="text-xs"
              style={{ color: "var(--semantic-text-secondary)" }}
              aria-hidden="true"
            >
              →
            </span>
            <span
              className="text-xs font-semibold"
              style={{ color: "var(--theme-heading-text)" }}
            >
              After: {postPct}%
            </span>
          </div>
        </div>
        <span
          className="ml-auto text-xl font-bold tabular-nums"
          style={{ color }}
          aria-label={`${isGain ? "Gained" : "Changed"} ${Math.abs(delta)} percentage points`}
        >
          {isGain ? "+" : ""}{delta}pp
        </span>
      </div>
      <p className="text-sm leading-6" style={{ color: "var(--theme-body-text)" }}>
        {message}
      </p>
    </div>
  );
}

// ─── Locked state ──────────────────────────────────────────────────────────────

function PostAssessmentLocked() {
  return (
    <div className="nn-lesson-quiz-module px-4 py-3.5 sm:px-5 sm:py-4">
      <div className="flex items-start gap-3">
        <span
          className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-muted)_35%,var(--bg-card))] text-[var(--semantic-text-muted)]"
          aria-hidden="true"
        >
          <Lock className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="nn-lesson-module-eyebrow">After the lesson</p>
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Retention check locked</p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
            Mark the lesson studied or finish reading; the reinforcement block unlocks so you can prove retention.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Idle state ────────────────────────────────────────────────────────────────

function PostAssessmentIdleCard({
  itemCount,
  priorPostScore,
  preScore,
  onStart,
}: {
  itemCount: number;
  priorPostScore: LessonAssessmentScore | null;
  preScore: LessonAssessmentScore | null;
  onStart: () => void;
}) {
  const retakeNote = priorPostScore
    ? `You scored ${priorPostScore.accuracyPct}% last time — retake to track improvement.`
    : null;

  return (
    <div className="nn-lesson-quiz-module p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[color-mix(in_srgb,var(--semantic-success)_28%,var(--semantic-border-soft))] bg-[color-mix(in_srgb,var(--semantic-success)_10%,var(--semantic-surface))] text-[var(--semantic-success)]"
            aria-hidden="true"
          >
            <ClipboardCheck className="h-5 w-5" strokeWidth={1.75} />
          </span>
          <div>
            <p className="nn-lesson-module-eyebrow text-[var(--semantic-success)]">Reinforcement</p>
            <h3 className="mt-0.5 text-base font-semibold leading-snug text-[var(--theme-heading-text)]">
              Prove retention
            </h3>
            <p className="mt-1.5 max-w-prose text-sm leading-relaxed text-[var(--semantic-text-secondary)]">
              {retakeNote ?? (
                <>
                  {itemCount} questions · active recall after reading
                  {preScore ? " · delta vs readiness check shown when done" : " · ~" + Math.ceil(itemCount * 0.75) + " min"}
                </>
              )}
            </p>
          </div>
        </div>
        {priorPostScore ? (
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-md border px-2.5 py-1 text-xs font-semibold tabular-nums text-[var(--semantic-success)]"
            style={{
              background: "color-mix(in srgb, var(--semantic-success) 8%, transparent)",
              borderColor: "color-mix(in srgb, var(--semantic-success) 22%, var(--semantic-border-soft))",
            }}
          >
            Best {priorPostScore.accuracyPct}%
          </div>
        ) : null}
      </div>

      <div className="mt-4">
        <button
          type="button"
          onClick={onStart}
          className="inline-flex min-h-10 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-92 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--semantic-success)] focus-visible:ring-offset-2"
          style={{ background: "var(--semantic-success)" }}
        >
          Start retention check
        </button>
      </div>
    </div>
  );
}

// ─── Running state ─────────────────────────────────────────────────────────────

function PostAssessmentRunningCard({
  items,
  postMode,
  onPostModeChange,
  onComplete,
}: {
  items: PathwayLessonQuizItem[];
  postMode: "practice" | "exam";
  onPostModeChange: (mode: "practice" | "exam") => void;
  onComplete: (score: number, total: number) => void;
}) {
  return (
    <div className="nn-lesson-quiz-module p-4 sm:p-5">
      <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[var(--semantic-border-soft)] pb-3">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md text-white"
          style={{ background: "var(--semantic-success)" }}
          aria-hidden="true"
        >
          <ClipboardCheck className="h-4 w-4" strokeWidth={2} />
        </span>
        <div>
          <p className="nn-lesson-module-eyebrow text-[var(--semantic-success)]">Retention</p>
          <p className="text-sm font-semibold text-[var(--theme-heading-text)]">Work items; reveal rationale per mode</p>
        </div>
      </div>
      <PathwayLessonQuizSet
        key={`learner-post-${itemsResetKey(items)}-${postMode}`}
        variant="post"
        title="Post-lesson retention"
        subtitle={postMode === "practice" ? "Practice" : "Exam-style"}
        items={items}
        fullAccess
        postMode={postMode}
        onPostModeChange={onPostModeChange}
        className="border-0 pb-0"
        onAssessmentFinished={(score, total) => onComplete(score, total)}
      />
    </div>
  );
}

// ─── Complete state ────────────────────────────────────────────────────────────

function PostAssessmentCompleteCard({
  score,
  total,
  preScore,
  topic,
  showScoreSummary = true,
}: {
  score: number;
  total: number;
  preScore: LessonAssessmentScore | null;
  topic: string;
  showScoreSummary?: boolean;
}) {
  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const reinforceMessage =
    pct >= 80
      ? "Excellent retention — this material is solidifying. Practice questions will lock it in."
      : pct >= 60
      ? "Good retention. Revisiting the weaker sections will push this higher."
      : "The lesson introduced challenging material. A second read and topic drills will help cement it.";

  return (
    <div className="nn-lesson-quiz-module p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-white"
          style={{ background: "var(--semantic-success)" }}
          aria-hidden="true"
        >
          <CheckCircle2 className="h-4 w-4" strokeWidth={2} />
        </span>
        <p className="text-sm font-semibold text-[var(--semantic-success)]">Retention captured</p>
      </div>

      {showScoreSummary ? (
        <div className="mt-4">
          <QuizScoreSummary score={score} total={total} label="Retention score" />
        </div>
      ) : null}

      {/* Improvement delta — only show if there was a pre-score */}
      {preScore ? (
        <div className="mt-4">
          <ImprovementDelta preScore={preScore} postScore={score} postTotal={total} />
        </div>
      ) : (
        <p className="mt-3 text-sm leading-6" style={{ color: "var(--theme-muted-text)" }}>
          {reinforceMessage}
        </p>
      )}

      <aside className="mt-4 rounded-md border border-[var(--semantic-border-soft)] bg-[color-mix(in_srgb,var(--semantic-panel-cool)_22%,var(--bg-card))] px-3 py-2.5 text-xs leading-relaxed text-[var(--semantic-text-secondary)]">
        <span className="font-semibold text-[var(--theme-heading-text)]">Study signals updated · </span>
        Topic stats for <span className="font-medium text-[var(--theme-heading-text)]">{topic || "this topic"}</span> reflect
        this run (same adaptive engine as the bank).
      </aside>
    </div>
  );
}

// ─── Orchestrator ──────────────────────────────────────────────────────────────

type PostPhase = "locked" | "idle" | "running" | "complete";

export function LessonPostAssessmentCard({
  items,
  lessonComplete,
  preScore,
  priorPostScore,
  topic,
  onScoreRecorded,
}: {
  items: PathwayLessonQuizItem[];
  lessonComplete: boolean;
  preScore: LessonAssessmentScore | null;
  priorPostScore: LessonAssessmentScore | null;
  topic: string;
  onScoreRecorded: (score: number, total: number) => void;
}) {
  const [phase, setPhase] = useState<PostPhase>(lessonComplete ? "idle" : "locked");
  const [finalScore, setFinalScore] = useState<{ score: number; total: number } | null>(null);
  const [postTestMode, setPostTestMode] = useState<"practice" | "exam">("practice");
  const completionOnceRef = useRef(false);

  /** Maps stored phase + lesson completion to the gate the learner should see (no effect-driven sync). */
  const resolvedPhase = useMemo((): PostPhase => {
    if (!lessonComplete) {
      if (phase === "running" || phase === "complete") return phase;
      return "locked";
    }
    if (phase === "locked") return "idle";
    return phase;
  }, [lessonComplete, phase]);

  if (!items.length) return null;

  if (resolvedPhase === "locked") {
    return <PostAssessmentLocked />;
  }

  if (resolvedPhase === "idle") {
    return (
      <PostAssessmentIdleCard
        itemCount={items.length}
        priorPostScore={priorPostScore}
        preScore={preScore}
        onStart={() => setPhase("running")}
      />
    );
  }

  if (resolvedPhase === "running") {
    return (
      <PostAssessmentRunningCard
        items={items}
        postMode={postTestMode}
        onPostModeChange={setPostTestMode}
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

  if (resolvedPhase === "complete" && finalScore) {
    return (
      <PostAssessmentCompleteCard
        score={finalScore.score}
        total={finalScore.total}
        preScore={preScore}
        topic={topic}
        showScoreSummary={false}
      />
    );
  }

  return null;
}
