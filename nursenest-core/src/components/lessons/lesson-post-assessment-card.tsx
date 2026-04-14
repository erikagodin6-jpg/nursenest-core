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

  const icon = isGain ? "↑" : isSame ? "→" : "↓";

  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4"
      style={{ background: bg, border: `1px solid color-mix(in srgb, ${color} 22%, transparent)` }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold"
          style={{ background: color, color: "#fff" }}
          aria-hidden="true"
        >
          {icon}
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
    <div
      className="rounded-2xl border px-5 py-4"
      style={{
        background: "color-mix(in srgb, var(--semantic-brand) 5%, var(--semantic-surface))",
        borderColor: "var(--semantic-border-soft)",
      }}
    >
      <div className="flex items-center gap-3">
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm"
          style={{
            background: "color-mix(in srgb, var(--semantic-brand) 15%, var(--semantic-surface))",
            color: "var(--semantic-brand)",
          }}
          aria-hidden="true"
        >
          🔒
        </span>
        <div>
          <p className="text-sm font-semibold" style={{ color: "var(--theme-heading-text)" }}>
            Post-lesson retention check
          </p>
          <p className="mt-0.5 text-xs leading-5" style={{ color: "var(--theme-muted-text)" }}>
            Finish reading the lesson to unlock your retention quiz and see your improvement.
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
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-success) 6%, var(--semantic-surface))",
        borderColor: "color-mix(in srgb, var(--semantic-success) 25%, var(--semantic-border-soft))",
      }}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-base"
            style={{
              background: "color-mix(in srgb, var(--semantic-success) 15%, var(--semantic-surface))",
              color: "var(--semantic-success)",
            }}
            aria-hidden="true"
          >
            ✅
          </span>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-[0.15em]"
              style={{ color: "var(--semantic-success)" }}
            >
              Lesson complete
            </p>
            <h3
              className="mt-1 text-base font-semibold leading-snug"
              style={{ color: "var(--theme-heading-text)" }}
            >
              Check what you retained
            </h3>
            <p className="mt-1.5 max-w-md text-sm leading-6" style={{ color: "var(--theme-muted-text)" }}>
              {retakeNote ?? (
                <>
                  {itemCount} questions · same concepts, fresh phrasing ·{" "}
                  {preScore
                    ? "your improvement vs the diagnostic will be shown"
                    : "takes ~" + Math.ceil(itemCount * 0.75) + " minutes"}
                </>
              )}
            </p>
          </div>
        </div>
        {priorPostScore ? (
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
            style={{
              background: "color-mix(in srgb, var(--semantic-success) 12%, var(--semantic-surface))",
              color: "var(--semantic-success)",
              border: "1px solid color-mix(in srgb, var(--semantic-success) 25%, transparent)",
            }}
          >
            <span aria-hidden="true">📈</span>
            Best: {priorPostScore.accuracyPct}%
          </div>
        ) : null}
      </div>

      <div className="mt-5">
        <button
          type="button"
          onClick={onStart}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 active:scale-[0.98]"
          style={{
            background: "var(--semantic-success)",
            color: "#fff",
          }}
        >
          Start retention check →
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
    <div
      className="rounded-2xl border p-5 sm:p-6"
      style={{
        background: "color-mix(in srgb, var(--semantic-success) 5%, var(--semantic-surface))",
        borderColor: "color-mix(in srgb, var(--semantic-success) 25%, var(--semantic-border-soft))",
      }}
    >
      <div className="mb-5 flex items-center gap-2">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-full text-sm"
          style={{ background: "var(--semantic-success)", color: "#fff" }}
          aria-hidden="true"
        >
          ✅
        </span>
        <p className="text-sm font-semibold" style={{ color: "var(--semantic-success)" }}>
          Retention check
        </p>
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
          Retention check complete
        </p>
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

      {/* Adaptive engine note */}
      <p
        className="mt-4 rounded-lg px-4 py-2.5 text-xs leading-5"
        style={{
          background: "color-mix(in srgb, var(--semantic-brand) 6%, var(--semantic-surface))",
          color: "var(--semantic-text-secondary)",
          border: "1px solid var(--semantic-border-soft)",
        }}
      >
        <span className="font-semibold" style={{ color: "var(--theme-heading-text)" }}>
          Adaptive engine updated.{" "}
        </span>
        Your study plan and topic stats for{" "}
        <span className="font-medium" style={{ color: "var(--theme-heading-text)" }}>
          {topic || "this topic"}
        </span>{" "}
        have been refreshed based on your results.
      </p>
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
