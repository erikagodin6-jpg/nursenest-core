import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  analyticsOk,
  analyticsError,
  analyticsDegraded,
  settleAnalyticsAction,
  formatAccuracyRow,
} from "@/lib/study/analytics-load-result";

describe("analytics-load-result", () => {
  it("settleAnalyticsAction preserves server-returned error (loader failure ≠ empty)", () => {
    const settled = {
      status: "fulfilled" as const,
      value: analyticsError("db_timeout"),
    };
    const got = settleAnalyticsAction("topics", settled);
    assert.equal(got.kind, "error");
    if (got.kind === "error") assert.equal(got.reason, "db_timeout");
  });

  it("settleAnalyticsAction maps Promise rejection to explicit error", () => {
    const settled = { status: "rejected" as const, reason: new Error("network down") };
    const got = settleAnalyticsAction("time_metrics", settled);
    assert.equal(got.kind, "error");
    if (got.kind === "error") assert.ok(got.reason.includes("time_metrics_transport"));
    if (got.kind === "error") assert.ok(got.reason.includes("network down"));
  });

  it("settleAnalyticsAction passes through ok with empty array (real empty)", () => {
    const settled = { status: "fulfilled" as const, value: analyticsOk<string[]>([]) };
    const got = settleAnalyticsAction("topics", settled);
    assert.equal(got.kind, "ok");
    if (got.kind === "ok") assert.deepEqual(got.data, []);
  });

  it("settleAnalyticsAction passes through degraded partial", () => {
    const settled = {
      status: "fulfilled" as const,
      value: analyticsDegraded([1, 2], "streak_unavailable"),
    };
    const got = settleAnalyticsAction("patterns", settled);
    assert.equal(got.kind, "degraded");
    if (got.kind === "degraded") {
      assert.deepEqual(got.partial, [1, 2]);
      assert.equal(got.reason, "streak_unavailable");
    }
  });

  it("formatAccuracyRow centralizes try wording", () => {
    assert.equal(formatAccuracyRow(3, 10), "10 tries · 30%");
    assert.equal(formatAccuracyRow(1, 1), "1 try · 100%");
    assert.equal(formatAccuracyRow(0, 0), "0 tries");
  });
});
