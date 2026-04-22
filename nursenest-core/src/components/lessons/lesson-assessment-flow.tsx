"use client";

/**
 * Lesson Assessment Flow — premium pre/post diagnostic orchestrator.
 *
 * This client component wraps lesson content with:
 *  1. A compact assessment toggle (on/off, persisted to localStorage)
 *  2. A pre-lesson diagnostic card (idle → running → complete)
 *  3. The lesson content (children), passed through
 *  4. A post-lesson retention card (locked → idle → running → complete)
 *
 * Score persistence:
 *  - Fetches prior scores on mount via GET /api/learner/lesson-assessment
 *  - Posts new scores via POST /api/learner/lesson-assessment
 *
 * Lesson completion is detected by listening to the PATHWAY_LESSON_PROGRESS_EVENT
 * (same event used by the marketing assessment experience).
 *
 * When lessonAssessments.enabled is false in localStorage, both assessment
 * cards are hidden and only the lesson content is shown.
 */

import { type ReactNode, useEffect, useState, useCallback } from "react";
import {
  readLearnerStudyDefaults,
  writeLearnerStudyDefaults,
} from "@/lib/student/learner-study-defaults";
import {
  PATHWAY_LESSON_PROGRESS_EVENT,
  type PathwayLessonProgressEventDetail,
} from "@/lib/lessons/pathway-lesson-progress-events";
import type { PathwayLessonProgressStatus } from "@/lib/lessons/pathway-lesson-progress";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";
import type { LessonAssessmentRecord } from "@/lib/lessons/lesson-assessment-store";
import { LessonPreAssessmentCard } from "@/components/lessons/lesson-pre-assessment-card";
import { LessonPostAssessmentCard } from "@/components/lessons/lesson-post-assessment-card";

// ─── Toggle component ──────────────────────────────────────────────────────────

function AssessmentToggle({
  enabled,
  hasPre,
  hasPost,
  onChange,
}: {
  enabled: boolean;
  hasPre: boolean;
  hasPost: boolean;
  onChange: (next: boolean) => void;
}) {
  const label = hasPre && hasPost
    ? "Pre + post quizzes"
    : hasPre
    ? "Pre-lesson diagnostic"
    : "Post-lesson retention";

  return (
    <div
      className="nn-lesson-assessment-toggle flex flex-col gap-2.5 rounded-lg border px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between"
      style={{
        background: "color-mix(in srgb, var(--semantic-panel-cool) 22%, var(--bg-card))",
        borderColor: "color-mix(in srgb, var(--semantic-border-soft) 92%, var(--semantic-info) 8%)",
      }}
    >
      <div className="flex items-center gap-2">
        <span
          className="flex h-6 w-6 items-center justify-center rounded-md text-[0.65rem] font-bold"
          style={{
            background: enabled
              ? "color-mix(in srgb, var(--semantic-info) 18%, var(--semantic-surface))"
              : "var(--semantic-surface)",
            color: enabled ? "var(--semantic-info)" : "var(--semantic-text-secondary)",
            border: "1px solid var(--semantic-border-soft)",
          }}
          aria-hidden="true"
        >
          {enabled ? "✓" : "○"}
        </span>
        <div>
          <span className="text-[0.7rem] font-semibold uppercase tracking-wide" style={{ color: "var(--theme-heading-text)" }}>
            {label}
          </span>
          <span className="ml-2 text-[0.7rem]" style={{ color: "var(--semantic-text-secondary)" }}>
            {enabled ? "On — guided flow" : "Off — open lesson directly"}
          </span>
        </div>
      </div>

      {/* Toggle pill */}
      <div
        className="inline-flex shrink-0 rounded-md border p-0.5"
        style={{ borderColor: "var(--semantic-border-soft)" }}
        role="tablist"
        aria-label="Lesson assessment setting"
      >
        <button
          type="button"
          role="tab"
          aria-selected={enabled}
          onClick={() => onChange(true)}
          className="min-h-8 rounded-md px-3 py-1 text-xs font-semibold transition"
          style={{
            background: enabled
              ? "var(--semantic-surface)"
              : "transparent",
            color: enabled
              ? "var(--theme-heading-text)"
              : "var(--semantic-text-secondary)",
            boxShadow: enabled ? "var(--semantic-shadow-soft)" : "none",
          }}
        >
          On
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={!enabled}
          onClick={() => onChange(false)}
          className="min-h-8 rounded-md px-3 py-1 text-xs font-semibold transition"
          style={{
            background: !enabled
              ? "var(--semantic-surface)"
              : "transparent",
            color: !enabled
              ? "var(--theme-heading-text)"
              : "var(--semantic-text-secondary)",
            boxShadow: !enabled ? "var(--semantic-shadow-soft)" : "none",
          }}
        >
          Off
        </button>
      </div>
    </div>
  );
}

// ─── Skeleton loader ───────────────────────────────────────────────────────────

function ScoreLoadingPulse() {
  return (
    <div
      className="h-24 animate-pulse rounded-2xl"
      style={{ background: "color-mix(in srgb, var(--semantic-border-soft) 60%, transparent)" }}
      aria-hidden="true"
    />
  );
}

// ─── API helpers (client-side only) ───────────────────────────────────────────

async function fetchPriorScores(lessonId: string): Promise<LessonAssessmentRecord> {
  const res = await fetch(`/api/learner/lesson-assessment?lessonId=${encodeURIComponent(lessonId)}`);
  if (!res.ok) return { pre: null, post: null };
  const body = (await res.json()) as { ok?: boolean; record?: LessonAssessmentRecord };
  return body.record ?? { pre: null, post: null };
}

async function recordScore(payload: {
  lessonId: string;
  pathwayId: string;
  topic: string;
  type: "pre" | "post";
  score: number;
  total: number;
}): Promise<LessonAssessmentRecord | null> {
  try {
    const res = await fetch("/api/learner/lesson-assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const body = (await res.json()) as { ok?: boolean; record?: LessonAssessmentRecord };
    return body.record ?? null;
  } catch {
    return null;
  }
}

// ─── Main orchestrator ─────────────────────────────────────────────────────────

export function LessonAssessmentFlow({
  userId,
  lessonId,
  pathwayId,
  lessonSlug,
  topic,
  initialProgress,
  preTest,
  postTest,
  assessmentsEnabled = true,
  /** When true, embedded catalog pre/post items are hidden (e.g. bank-backed study loop owns quizzes). */
  disableCatalogAssessments = false,
  children,
}: {
  userId: string;
  lessonId: string;
  pathwayId: string;
  lessonSlug: string;
  topic: string;
  initialProgress: PathwayLessonProgressStatus;
  preTest?: PathwayLessonQuizItem[];
  postTest?: PathwayLessonQuizItem[];
  assessmentsEnabled?: boolean;
  disableCatalogAssessments?: boolean;
  children: ReactNode;
}) {
  const effectiveUserId = userId.trim() || "public";
  const hasPre = !disableCatalogAssessments && Boolean(preTest?.length);
  const hasPost = !disableCatalogAssessments && Boolean(postTest?.length);
  const hasAnyAssessments = hasPre || hasPost;

  // ── Local state ────────────────────────────────────────────────────────────
  const [enabled, setEnabled] = useState(true);
  const [progress, setProgress] = useState<PathwayLessonProgressStatus>(initialProgress);
  const [priorScores, setPriorScores] = useState<LessonAssessmentRecord | null>(null);
  const [scoresLoading, setScoresLoading] = useState(hasAnyAssessments);
  // Track whether the learner completed the pre during this session
  // so the pre score is available for the delta even before a round-trip.
  const [sessionPreScore, setSessionPreScore] = useState<{ score: number; total: number } | null>(null);

  // ── Sync enabled flag when study settings change (avoid sync setState in effect body). ──
  useEffect(() => {
    if (!hasAnyAssessments) return;
    let cancelled = false;
    queueMicrotask(() => {
      if (!cancelled) setEnabled(assessmentsEnabled);
    });
    return () => {
      cancelled = true;
    };
  }, [assessmentsEnabled, effectiveUserId, hasAnyAssessments]);

  // ── Fetch prior scores ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!hasAnyAssessments || !userId) return;
    fetchPriorScores(lessonId)
      .then(setPriorScores)
      .finally(() => setScoresLoading(false));
  }, [hasAnyAssessments, lessonId, userId]);

  // ── Progress event listener ────────────────────────────────────────────────
  useEffect(() => {
    if (!hasPost) return;
    const onEvt = (event: Event) => {
      const detail = (event as CustomEvent<PathwayLessonProgressEventDetail>).detail;
      if (detail?.pathwayId === pathwayId && detail.lessonSlug === lessonSlug) {
        setProgress(detail.status);
      }
    };
    window.addEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
    return () => window.removeEventListener(PATHWAY_LESSON_PROGRESS_EVENT, onEvt);
  }, [hasPost, lessonSlug, pathwayId]);

  // ── Toggle handler ─────────────────────────────────────────────────────────
  const handleToggle = useCallback((next: boolean) => {
    const current = readLearnerStudyDefaults(effectiveUserId);
    writeLearnerStudyDefaults(effectiveUserId, { ...current, lessonAssessments: { enabled: next } });
    setEnabled(next);
  }, [effectiveUserId]);

  // ── Score record handlers ──────────────────────────────────────────────────
  const handlePreComplete = useCallback(async (score: number, total: number) => {
    setSessionPreScore({ score, total });
    const updated = await recordScore({ lessonId, pathwayId, topic, type: "pre", score, total });
    if (updated) setPriorScores(updated);
  }, [lessonId, pathwayId, topic]);

  const handlePostComplete = useCallback(async (score: number, total: number) => {
    const updated = await recordScore({ lessonId, pathwayId, topic, type: "post", score, total });
    if (updated) setPriorScores(updated);
  }, [lessonId, pathwayId, topic]);

  // ── No assessments for this lesson — pass through ─────────────────────────
  if (!hasAnyAssessments) {
    return <>{children}</>;
  }

  const lessonComplete = progress === "completed";

  // Build the pre-score to pass to the post card:
  // Prefer session score (immediate) over stored score.
  const effectivePreScore = sessionPreScore
    ? {
        score: sessionPreScore.score,
        total: sessionPreScore.total,
        accuracyPct: Math.round((sessionPreScore.score / sessionPreScore.total) * 100),
        completedAt: new Date().toISOString(),
        practiceTestId: "",
      }
    : priorScores?.pre ?? null;

  return (
    <div className="space-y-5">
      {/* ── Assessment toggle ────────────────────────────────────────────── */}
      {assessmentsEnabled ? (
        <AssessmentToggle
          enabled={enabled}
          hasPre={hasPre}
          hasPost={hasPost}
          onChange={handleToggle}
        />
      ) : (
        <section
          className="rounded-xl border px-4 py-3 text-sm"
          style={{
            background: "color-mix(in srgb, var(--semantic-panel-muted) 75%, var(--theme-page-bg))",
            borderColor: "var(--semantic-border-soft)",
            color: "var(--semantic-text-secondary)",
          }}
        >
          Pre/post lesson quizzes are turned off in your study settings, so this lesson opens directly into the content.
        </section>
      )}

      {/* ── Pre-lesson diagnostic ────────────────────────────────────────── */}
      {enabled && hasPre ? (
        scoresLoading ? (
          <ScoreLoadingPulse />
        ) : (
          <LessonPreAssessmentCard
            items={preTest!}
            priorScore={priorScores?.pre ?? null}
            onScoreRecorded={handlePreComplete}
            onSkip={() => undefined}
          />
        )
      ) : null}

      {/* ── Lesson content ───────────────────────────────────────────────── */}
      {children}

      {/* ── Post-lesson retention check ──────────────────────────────────── */}
      {enabled && hasPost ? (
        scoresLoading ? (
          <ScoreLoadingPulse />
        ) : (
          <LessonPostAssessmentCard
            items={postTest!}
            lessonComplete={lessonComplete}
            preScore={effectivePreScore}
            priorPostScore={priorScores?.post ?? null}
            topic={topic}
            onScoreRecorded={handlePostComplete}
          />
        )
      ) : null}
    </div>
  );
}
