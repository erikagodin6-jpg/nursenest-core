import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildOperationalSummaryFromChecks } from "@/lib/admin/system-status-operational-summary";
import type { SystemCheckResult } from "@/lib/admin/system-status-types";

const base = (overrides: Partial<SystemCheckResult>): SystemCheckResult => ({
  id: "appLiveness",
  name: "App liveness",
  status: "healthy",
  summary: "",
  details: {},
  checkedAt: new Date().toISOString(),
  responseTimeMs: 0,
  ...overrides,
});

describe("buildOperationalSummaryFromChecks", () => {
  it("pulls queue, content, and database metrics from check details", () => {
    const checks: SystemCheckResult[] = [
      base({
        id: "queueHealth",
        details: {
          activeJobs: 3,
          lessonBatchStuckGenerating: 1,
          failedJobs: 2,
        },
      }),
      base({
        id: "contentHealth",
        details: {
          lessonDraftsPendingReview: 10,
          questionDraftsPendingReview: 4,
        },
      }),
      base({
        id: "database",
        details: { configured: true, selectLatencyMs: 12, migrationCount: 5 },
      }),
    ];
    const s = buildOperationalSummaryFromChecks(checks);
    assert.equal(s.activeAiJobs, 3);
    assert.equal(s.stuckAiJobs, 1);
    assert.equal(s.failedAiJobs, 2);
    assert.equal(s.lessonDraftsPendingReview, 10);
    assert.equal(s.questionDraftsPendingReview, 4);
    assert.equal(s.databaseLatencyMs, 12);
  });

  it("returns nulls when queue or content skipped", () => {
    const checks: SystemCheckResult[] = [
      base({ id: "queueHealth", details: { skipped: true } }),
      base({ id: "contentHealth", details: { skipped: true } }),
      base({ id: "database", details: { configured: false } }),
    ];
    const s = buildOperationalSummaryFromChecks(checks);
    assert.equal(s.activeAiJobs, null);
    assert.equal(s.stuckAiJobs, null);
    assert.equal(s.lessonDraftsPendingReview, null);
    assert.equal(s.databaseLatencyMs, null);
  });

  it("nulls DB latency when probe failed", () => {
    const checks: SystemCheckResult[] = [
      base({
        id: "database",
        details: { configured: true, probeFailed: true },
      }),
    ];
    const s = buildOperationalSummaryFromChecks(checks);
    assert.equal(s.databaseLatencyMs, null);
  });
});
