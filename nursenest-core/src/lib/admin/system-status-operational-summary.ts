import type { SystemCheckResult, SystemStatusOperationalSummary } from "@/lib/admin/system-status-types";

function readFiniteNumber(d: Record<string, unknown>, key: string): number | null {
  const v = d[key];
  if (typeof v === "number" && Number.isFinite(v)) return v;
  return null;
}

/**
 * Compact snapshot for the admin system status header row — derived from probe cards (no extra queries).
 */
export function buildOperationalSummaryFromChecks(checks: SystemCheckResult[]): SystemStatusOperationalSummary {
  const queue = checks.find((c) => c.id === "queueHealth")?.details ?? {};
  const content = checks.find((c) => c.id === "contentHealth")?.details ?? {};
  const database = checks.find((c) => c.id === "database")?.details ?? {};

  const qd = queue as Record<string, unknown>;
  const cd = content as Record<string, unknown>;
  const dd = database as Record<string, unknown>;

  const skippedQueue = qd.skipped === true;
  const skippedContent = cd.skipped === true;
  const dbConfigured = dd.configured !== false;

  return {
    activeAiJobs: skippedQueue ? null : readFiniteNumber(qd, "activeJobs"),
    stuckAiJobs: skippedQueue ? null : readFiniteNumber(qd, "lessonBatchStuckGenerating"),
    failedAiJobs: skippedQueue ? null : readFiniteNumber(qd, "failedJobs"),
    lessonDraftsPendingReview: skippedContent ? null : readFiniteNumber(cd, "lessonDraftsPendingReview"),
    questionDraftsPendingReview: skippedContent ? null : readFiniteNumber(cd, "questionDraftsPendingReview"),
    databaseLatencyMs:
      !dbConfigured || dd.probeFailed === true ? null : readFiniteNumber(dd, "selectLatencyMs"),
  };
}
