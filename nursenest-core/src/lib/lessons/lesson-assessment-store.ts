/**
 * Lesson pre/post assessment persistence.
 *
 * Scores are stored as PracticeTest rows with a discriminant config field
 * (`mode: "lesson_pre" | "lesson_post"`) so no schema migration is required.
 * Results are read back to compute the improvement delta and support retakes.
 *
 * Adaptive engine: after a post-assessment, topic outcomes are written to
 * UserTopicStat via `recordTopicOutcomesSequential` (same path as question
 * bank grading). Each quiz item maps to one correct/incorrect signal.
 */

import { PracticeTestStatus } from "@prisma/client";
import { invalidateLearnerPrivateReadCache } from "@/lib/cache/learner-private-read-cache";
import { prisma } from "@/lib/db";
import { recordTopicOutcomesSequential } from "@/lib/learner/topic-performance";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";

// ─── Public types ──────────────────────────────────────────────────────────────

export type LessonAssessmentType = "pre" | "post";

export type LessonAssessmentScore = {
  score: number;
  total: number;
  accuracyPct: number;
  completedAt: string;
  practiceTestId: string;
};

export type LessonAssessmentRecord = {
  pre: LessonAssessmentScore | null;
  post: LessonAssessmentScore | null;
};

// ─── PracticeTest config shape (discriminated by mode) ────────────────────────

type LessonAssessmentConfig = {
  mode: "lesson_pre" | "lesson_post";
  lessonId: string;
  pathwayId: string;
  topic: string;
};

type LessonAssessmentResults = {
  score: number;
  total: number;
  accuracyPct: number;
  completedAt: string;
};

function modeForType(type: LessonAssessmentType): "lesson_pre" | "lesson_post" {
  return type === "pre" ? "lesson_pre" : "lesson_post";
}

// ─── Write ─────────────────────────────────────────────────────────────────────

/**
 * Persist a completed lesson assessment attempt.
 * Returns the created PracticeTest.id for reference.
 *
 * For post-assessments, topic outcomes are forwarded to the adaptive engine
 * so the learner's UserTopicStat reflects what they demonstrated.
 */
export async function recordLessonAssessment(args: {
  userId: string;
  lessonId: string;
  pathwayId: string;
  topic: string;
  type: LessonAssessmentType;
  score: number;
  total: number;
}): Promise<string> {
  const { userId, lessonId, pathwayId, topic, type, score, total } = args;

  if (total < 1) throw new Error("total must be at least 1");
  const clampedScore = Math.min(score, total);
  const accuracyPct = Math.round((clampedScore / total) * 100);
  const completedAt = new Date().toISOString();

  const config: LessonAssessmentConfig = {
    mode: modeForType(type),
    lessonId,
    pathwayId,
    topic,
  };

  const results: LessonAssessmentResults = {
    score: clampedScore,
    total,
    accuracyPct,
    completedAt,
  };

  const row = await prisma.practiceTest.create({
    data: {
      userId,
      config: config as object,
      questionIds: [],
      answers: {},
      status: PracticeTestStatus.COMPLETED,
      results: results as object,
      completedAt: new Date(),
    },
    select: { id: true },
  });
  await invalidateLearnerPrivateReadCache(userId);

  // Forward post-assessment outcomes to the adaptive engine (UserTopicStat)
  if (type === "post" && topic) {
    const normalizedTopic = normalizeTopicKey(topic);
    const outcomes: { topic: string; correct: boolean }[] = [];
    for (let i = 0; i < total; i++) {
      outcomes.push({ topic: normalizedTopic, correct: i < clampedScore });
    }
    // Fire-and-forget — don't block the API response on stats update
    recordTopicOutcomesSequential(userId, outcomes).catch(() => undefined);
  }

  return row.id;
}

// ─── Read ──────────────────────────────────────────────────────────────────────

/**
 * Load the most-recent pre and post scores for a lesson for a given user.
 * Returns null for either slot if no attempt has been recorded yet.
 */
export async function loadLessonAssessmentRecord(
  userId: string,
  lessonId: string,
): Promise<LessonAssessmentRecord> {
  const rows = await prisma.practiceTest.findMany({
    where: {
      userId,
      status: PracticeTestStatus.COMPLETED,
      // Filter by the lessonId embedded in the JSON config.
      // PostgreSQL: config->>'lessonId' = lessonId
      config: { path: ["lessonId"], equals: lessonId },
    },
    select: { id: true, config: true, results: true, completedAt: true },
    orderBy: { completedAt: "desc" },
    take: 10, // safety cap; we only need the latest pre + post
  });

  let pre: LessonAssessmentScore | null = null;
  let post: LessonAssessmentScore | null = null;

  for (const row of rows) {
    const cfg = row.config as Partial<LessonAssessmentConfig>;
    const res = row.results as Partial<LessonAssessmentResults> | null;
    if (!cfg?.mode || !res) continue;

    const score: LessonAssessmentScore = {
      score: res.score ?? 0,
      total: res.total ?? 0,
      accuracyPct: res.accuracyPct ?? 0,
      completedAt: res.completedAt ?? row.completedAt?.toISOString() ?? new Date().toISOString(),
      practiceTestId: row.id,
    };

    if (cfg.mode === "lesson_pre" && !pre) {
      pre = score;
    } else if (cfg.mode === "lesson_post" && !post) {
      post = score;
    }

    if (pre && post) break;
  }

  return { pre, post };
}
