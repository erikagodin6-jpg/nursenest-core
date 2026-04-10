/**
 * Typed models for the admin system status dashboard and `/api/admin/system-status`.
 * Never include secret values — only booleans and safe summaries.
 */

export type OverallSystemStatus = "healthy" | "degraded" | "failed";

export type CheckStatus = "healthy" | "degraded" | "failed";

/** v1 — six subsystem cards only */
export type SystemCheckId =
  | "appLiveness"
  | "appReadiness"
  | "database"
  | "queueHealth"
  | "contentHealth"
  | "configSanity";

export type SystemCheckResult = {
  id: SystemCheckId;
  /** Human-readable label for UI */
  name: string;
  status: CheckStatus;
  summary: string;
  /** Safe structured detail — no secrets */
  details: Record<string, unknown>;
  checkedAt: string;
  responseTimeMs: number;
};

/** Denormalized from probe cards for a compact admin header row — no additional DB work. */
export type SystemStatusOperationalSummary = {
  /** PENDING + RUNNING `AiGenerationJob` rows; null if queue metrics skipped */
  activeAiJobs: number | null;
  /** Lesson batch queue items stuck in GENERATING past the stale threshold */
  stuckAiJobs: number | null;
  failedAiJobs: number | null;
  lessonDraftsPendingReview: number | null;
  questionDraftsPendingReview: number | null;
  /** DB `SELECT 1` latency from the database card; null if unavailable */
  databaseLatencyMs: number | null;
};

export type SystemStatusPayload = {
  ok: true;
  overall: OverallSystemStatus;
  /** When the snapshot was assembled */
  checkedAt: string;
  /** Wall-clock time to collect all checks (approximate) */
  totalResponseTimeMs: number;
  checks: SystemCheckResult[];
  /** Operational KPIs for the summary strip */
  summary: SystemStatusOperationalSummary;
};

export type SystemStatusErrorPayload = {
  ok: false;
  error: string;
};
