import "server-only";

/**
 * Server-only DTOs for **future** cohort analytics services.
 * Do not import from client components — keep aggregation on the server and expose narrow APIs when routes exist.
 */

/** Per-learner readiness summary suitable for cohort rollups (no question-level data). */
export interface CohortLearnerReadinessRowDto {
  userId: string;
  pathwayId: string | null;
  /** Normalized 0–100 or null when insufficient data. */
  readinessScore: number | null;
  computedAtIso: string;
}

/** Clustered weak topics across learners (counts only — topics are normalized keys). */
export interface WeakTopicClusterSummaryDto {
  topicKey: string;
  /** Members with this topic in “weak” band (definition shared with `topic-performance`). */
  affectedMemberCount: number;
  /** Optional average miss rate 0–100 for ordering. */
  avgMissRatePct: number | null;
}

export interface CohortCompletionSummaryDto {
  cohortId: string;
  /** Assigned items completed / assigned (instructor assignments — future table). */
  assignedCompletionPct: number | null;
  /** Lessons completed in window / expected (from pathway norms — future). */
  lessonCompletionPct: number | null;
  /** Practice exams finished / assigned. */
  practiceExamCompletionPct: number | null;
  windowStartIso: string;
  windowEndIso: string;
}

export interface CohortRemediationSummaryDto {
  cohortId: string;
  openRemediationItems: number;
  resolvedInWindow: number;
  windowStartIso: string;
  windowEndIso: string;
}

/** Sessions / DAU-style — aggregate only. */
export interface CohortEngagementSummaryDto {
  cohortId: string;
  activeLearners7d: number;
  medianSessionsPerLearner7d: number | null;
  computedAtIso: string;
}
