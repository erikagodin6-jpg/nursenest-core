/**
 * Run: `node --import tsx --test src/lib/admin/adaptive-learner-summary-admin.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptyPerformanceProfile } from "@/lib/cat/performance-tracker";
import {
  extractPerformanceProfileFromAdaptiveJson,
  loadAdaptiveLearnerAdminSummary,
} from "@/lib/admin/adaptive-learner-summary.server";
import { isAdaptiveLearningAdminFeatureEnabled } from "@/lib/admin/adaptive-learning-env.server";

describe("adaptive learner admin summary (pure)", () => {
  it("extractPerformanceProfileFromAdaptiveJson returns null for invalid input", () => {
    assert.equal(extractPerformanceProfileFromAdaptiveJson(null), null);
    assert.equal(extractPerformanceProfileFromAdaptiveJson({}), null);
    assert.equal(extractPerformanceProfileFromAdaptiveJson({ _v: 2, performance: {} }), null);
  });

  it("extractPerformanceProfileFromAdaptiveJson returns performance when _v is 1", () => {
    const perf = emptyPerformanceProfile();
    const raw = { _v: 1, performance: perf };
    const out = extractPerformanceProfileFromAdaptiveJson(raw);
    assert.ok(out);
    assert.equal(out?.overall.attempted, perf.overall.attempted);
  });
});

describe("adaptive learner admin summary (env gate)", () => {
  it("isAdaptiveLearningAdminFeatureEnabled reads ADAPTIVE_LEARNING_ENABLED", () => {
    const prev = process.env.ADAPTIVE_LEARNING_ENABLED;
    process.env.ADAPTIVE_LEARNING_ENABLED = "true";
    assert.equal(isAdaptiveLearningAdminFeatureEnabled(), true);
    process.env.ADAPTIVE_LEARNING_ENABLED = "0";
    assert.equal(isAdaptiveLearningAdminFeatureEnabled(), false);
    process.env.ADAPTIVE_LEARNING_ENABLED = prev;
  });
});

describe("loadAdaptiveLearnerAdminSummary (guards)", () => {
  it("returns null for blank user id without touching Prisma", async () => {
    assert.equal(await loadAdaptiveLearnerAdminSummary(""), null);
    assert.equal(await loadAdaptiveLearnerAdminSummary("   "), null);
  });
});
