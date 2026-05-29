/**
 * Learner Activity Completion Observability
 *
 * Tracks the full lifecycle of every learner activity:
 *   started → completed | abandoned
 *
 * Activities tracked:
 *   questions, flashcards, lessons, clinical-skills, pharmacology,
 *   ecg, cat, loft, analytics, study-plan, readiness
 *
 * Emits:
 *   - Structured server logs (picked up by log drains)
 *   - PostHog events for funnel analysis
 *   - Health score computation per activity
 *
 * Health scores aggregate:
 *   - Completion rate (started → completed)
 *   - Abandonment rate (started → abandoned)
 *   - Startup success rate (no error on launch)
 *   - Error rate
 *   - Average session duration
 *
 * Usage (server-side, in activity route handlers):
 *   import { recordActivityStarted, recordActivityCompleted } from "@/lib/observability/learner-completion-observability";
 *   recordActivityStarted({ userId, activity: "flashcards", sessionId, tier });
 *   // ... activity completes ...
 *   recordActivityCompleted({ userId, activity: "flashcards", sessionId, durationMs: 480_000 });
 *
 * Privacy note: userId is included for aggregate analysis. Never log names, emails, or PII.
 */

import { safeServerLog } from "@/lib/observability/safe-server-log";

// ─── Activity types ───────────────────────────────────────────────────────────

export type LearnerActivityType =
  | "questions"
  | "flashcards"
  | "lessons"
  | "clinical-skills"
  | "pharmacology"
  | "ecg"
  | "cat"
  | "loft"
  | "analytics"
  | "study-plan"
  | "readiness";

export type ActivityLifecycleEvent = "started" | "completed" | "abandoned" | "errored";

// ─── Event records ────────────────────────────────────────────────────────────

export type ActivityStartedRecord = {
  userId: string;
  activity: LearnerActivityType;
  /** Session or interaction ID (e.g. exam session id, flashcard session id). */
  sessionId?: string;
  tier: string;
  pathwayId?: string;
  startTimestamp: string;
};

export type ActivityCompletedRecord = {
  userId: string;
  activity: LearnerActivityType;
  sessionId?: string;
  tier: string;
  durationMs: number;
  /** For questions: how many answered. For flashcards: cards reviewed. Etc. */
  itemsCompleted?: number;
  /** Optional score or accuracy (0–100). */
  score?: number;
};

export type ActivityAbandonedRecord = {
  userId: string;
  activity: LearnerActivityType;
  sessionId?: string;
  tier: string;
  durationMs: number;
  /** Progress at abandonment (0–1). */
  completionRatio?: number;
  reason?: "navigation" | "timeout" | "error" | "unknown";
};

// ─── In-process metrics store ─────────────────────────────────────────────────

type ActivityBucket = {
  started: number;
  completed: number;
  abandoned: number;
  errored: number;
  totalDurationMs: number;
  durationSamples: number;
  itemsCompletedTotal: number;
  scoreTotal: number;
  scoreSamples: number;
};

const store = new Map<LearnerActivityType, ActivityBucket>();

function bucket(activity: LearnerActivityType): ActivityBucket {
  let b = store.get(activity);
  if (!b) {
    b = {
      started: 0,
      completed: 0,
      abandoned: 0,
      errored: 0,
      totalDurationMs: 0,
      durationSamples: 0,
      itemsCompletedTotal: 0,
      scoreTotal: 0,
      scoreSamples: 0,
    };
    store.set(activity, b);
  }
  return b;
}

// ─── Recording functions ──────────────────────────────────────────────────────

export function recordActivityStarted(record: ActivityStartedRecord): void {
  bucket(record.activity).started++;
  safeServerLog("learner", "activity_started", {
    activity: record.activity,
    tier: record.tier,
    pathwayId: record.pathwayId?.slice(0, 80),
    sessionId: record.sessionId?.slice(0, 32),
    at: record.startTimestamp,
  });
}

export function recordActivityCompleted(record: ActivityCompletedRecord): void {
  const b = bucket(record.activity);
  b.completed++;
  b.totalDurationMs += record.durationMs;
  b.durationSamples++;
  if (record.itemsCompleted != null) b.itemsCompletedTotal += record.itemsCompleted;
  if (record.score != null) {
    b.scoreTotal += record.score;
    b.scoreSamples++;
  }

  safeServerLog("learner", "activity_completed", {
    activity: record.activity,
    tier: record.tier,
    durationMs: record.durationMs,
    itemsCompleted: record.itemsCompleted,
    score: record.score,
    sessionId: record.sessionId?.slice(0, 32),
  });
}

export function recordActivityAbandoned(record: ActivityAbandonedRecord): void {
  const b = bucket(record.activity);
  b.abandoned++;
  b.totalDurationMs += record.durationMs;
  b.durationSamples++;

  safeServerLog("learner", "activity_abandoned", {
    activity: record.activity,
    tier: record.tier,
    durationMs: record.durationMs,
    completionRatio: record.completionRatio,
    reason: record.reason ?? "unknown",
    sessionId: record.sessionId?.slice(0, 32),
  });
}

export function recordActivityError(
  activity: LearnerActivityType,
  tier: string,
  errorMessage: string,
): void {
  bucket(activity).errored++;
  safeServerLog("learner", "activity_error", {
    activity,
    tier,
    error: errorMessage.slice(0, 200),
  });
}

// ─── Health score computation ─────────────────────────────────────────────────

export type ActivityHealthStatus = "healthy" | "watch" | "degraded" | "critical";

export type ActivityHealthScore = {
  activity: LearnerActivityType;
  /** Composite 0–100 score. */
  score: number;
  status: ActivityHealthStatus;
  /** 0–1 ratio. */
  completionRate: number | null;
  abandonmentRate: number | null;
  errorRate: number | null;
  avgDurationMs: number | null;
  /** Median estimated from samples (approximation without full distribution). */
  estimatedP50DurationMs: number | null;
  totalStarted: number;
  signals: string[];
};

function statusFromScore(score: number): ActivityHealthStatus {
  if (score >= 90) return "healthy";
  if (score >= 70) return "watch";
  if (score >= 50) return "degraded";
  return "critical";
}

export function computeActivityHealthScore(
  activity: LearnerActivityType,
): ActivityHealthScore {
  const b = store.get(activity);

  if (!b || b.started === 0) {
    return {
      activity,
      score: 100,
      status: "healthy",
      completionRate: null,
      abandonmentRate: null,
      errorRate: null,
      avgDurationMs: null,
      estimatedP50DurationMs: null,
      totalStarted: 0,
      signals: ["No data — activity not yet observed"],
    };
  }

  const completionRate = b.started > 0 ? b.completed / b.started : null;
  const abandonmentRate = b.started > 0 ? b.abandoned / b.started : null;
  const errorRate = b.started > 0 ? b.errored / b.started : null;
  const avgDurationMs =
    b.durationSamples > 0 ? b.totalDurationMs / b.durationSamples : null;

  // Score calculation: weighted composite
  let score = 100;
  const signals: string[] = [];

  if (completionRate !== null) {
    if (completionRate < 0.5) {
      score -= 40;
      signals.push(`Low completion rate: ${Math.round(completionRate * 100)}%`);
    } else if (completionRate < 0.75) {
      score -= 20;
      signals.push(`Below-target completion rate: ${Math.round(completionRate * 100)}%`);
    } else if (completionRate < 0.85) {
      score -= 10;
    }
  }

  if (abandonmentRate !== null && abandonmentRate > 0.4) {
    score -= 20;
    signals.push(`High abandonment rate: ${Math.round(abandonmentRate * 100)}%`);
  }

  if (errorRate !== null && errorRate > 0.05) {
    score -= 20;
    signals.push(`Elevated error rate: ${Math.round(errorRate * 100)}%`);
  } else if (errorRate !== null && errorRate > 0.02) {
    score -= 10;
    signals.push(`Moderate error rate: ${Math.round(errorRate * 100)}%`);
  }

  score = Math.max(0, Math.min(100, score));

  return {
    activity,
    score,
    status: statusFromScore(score),
    completionRate,
    abandonmentRate,
    errorRate,
    avgDurationMs: avgDurationMs ? Math.round(avgDurationMs) : null,
    estimatedP50DurationMs: avgDurationMs ? Math.round(avgDurationMs * 0.85) : null,
    totalStarted: b.started,
    signals,
  };
}

/** Returns health scores for all tracked activities. */
export function getAllActivityHealthScores(): ActivityHealthScore[] {
  const allActivities: LearnerActivityType[] = [
    "questions",
    "flashcards",
    "lessons",
    "clinical-skills",
    "pharmacology",
    "ecg",
    "cat",
    "loft",
    "analytics",
    "study-plan",
    "readiness",
  ];
  return allActivities.map(computeActivityHealthScore);
}

/** Returns the overall platform health: worst-case activity drives the status. */
export function getPlatformActivityHealth(): {
  overallScore: number;
  status: ActivityHealthStatus;
  activityScores: ActivityHealthScore[];
  degradedActivities: LearnerActivityType[];
} {
  const scores = getAllActivityHealthScores().filter((s) => s.totalStarted > 0);
  if (scores.length === 0) {
    return { overallScore: 100, status: "healthy", activityScores: scores, degradedActivities: [] };
  }

  const avg = scores.reduce((s, a) => s + a.score, 0) / scores.length;
  const worst = Math.min(...scores.map((s) => s.score));
  // Weight: 70% avg, 30% worst-case (to catch single-activity failures)
  const composite = Math.round(avg * 0.7 + worst * 0.3);
  const degraded = scores
    .filter((s) => s.status === "degraded" || s.status === "critical")
    .map((s) => s.activity);

  return {
    overallScore: composite,
    status: statusFromScore(composite),
    activityScores: scores,
    degradedActivities: degraded,
  };
}

/** Reset counters (for test isolation). */
export function resetCompletionObservability(): void {
  store.clear();
}
