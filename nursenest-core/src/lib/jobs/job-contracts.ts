/**
 * Queue / background job **contracts only** — no worker, broker, or schema.
 * Future: wire to Vercel Cron, DO App worker, or external queue; keep payloads versioned.
 */

/** Observability names (PostHog / logs) — string literals for grep stability. */
export const JOB_OBSERVABILITY_EVENTS = {
  enqueue: "job_enqueue",
  start: "job_start",
  success: "job_success",
  retry: "job_retry_scheduled",
  deadLetter: "job_dead_letter",
  skipped: "job_skipped",
} as const;

export type JobObservabilityEvent = (typeof JOB_OBSERVABILITY_EVENTS)[keyof typeof JOB_OBSERVABILITY_EVENTS];

export type JobRetryPolicy = {
  maxAttempts: number;
  /** Base backoff in ms (implementations may apply jitter). */
  backoffMs: number;
};

export const DEFAULT_JOB_RETRY_POLICY: JobRetryPolicy = {
  maxAttempts: 3,
  backoffMs: 5000,
};

export type JobErrorBoundary = "throw" | "catch_log" | "dead_letter";

export type JobEnvelopeBase = {
  jobId: string;
  /** Monotonic attempt counter, 1-based. */
  attempt: number;
  enqueuedAtIso: string;
};

export type LessonIndexRebuildJobPayload = {
  kind: "lesson_index_rebuild";
  pathwayIds?: string[];
  reason: "manual" | "content_publish" | "scheduled";
};

/** Queue workers must redact `userId` in log drains — use prefix/hash in observability only. */
/** Workers: never log raw userId to shared drains; use prefix or opaque subject id in events. */
export type EntitlementReconcileJobPayload = {
  kind: "entitlement_reconcile";
  userId: string;
  trigger: "stripe_webhook" | "admin" | "scheduled";
};

export type AnalyticsRollupJobPayload = {
  kind: "analytics_rollup";
  window: "hourly" | "daily";
  /** Non-secret shard key for parallelism. */
  shard: string;
};

export type EmailDigestJobPayload = {
  kind: "email_digest";
  cohortKey: string;
  templateVersion: string;
};

export type NurseNestBackgroundJobPayload =
  | LessonIndexRebuildJobPayload
  | EntitlementReconcileJobPayload
  | AnalyticsRollupJobPayload
  | EmailDigestJobPayload;

export type NurseNestJobEnvelope = JobEnvelopeBase & {
  payload: NurseNestBackgroundJobPayload;
  retry: JobRetryPolicy;
  onFinalFailure: JobErrorBoundary;
};
