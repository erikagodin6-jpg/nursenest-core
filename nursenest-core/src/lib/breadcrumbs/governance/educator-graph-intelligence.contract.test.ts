import assert from "node:assert/strict";
import { test } from "node:test";
import { aggregateEducatorGraphMetrics } from "@/lib/breadcrumbs/governance/educator-graph-analytics";
import { buildEducatorGraphInsights } from "@/lib/breadcrumbs/governance/educator-graph-insights";
import {
  getEducatorGraphSummary,
  recordGraphOsEvent,
  resetGraphOsAggregationForTests,
} from "@/lib/breadcrumbs/governance/graph-os-aggregation";

test("educator metrics aggregate only — no raw cognition fields", () => {
  const summary = aggregateEducatorGraphMetrics({
    glossaryTraversals: 10,
    remediationStarts: 5,
    remediationAbandons: 2,
    hydrationFallbacks: 1,
    tutoringContinuations: 4,
    tutoringCompletions: 3,
    glossaryDepths: [2, 3, 4],
    semanticRouteViews: 20,
  });
  assert.equal(summary.remediationAbandonmentRate, 0.4);
  assert.equal(summary.hydrationFallbackRate, 0.05);
  assert.equal(summary.tutoringContinuityAdherence, 0.75);
  assert.equal(summary.glossaryTraversalDepthAvg, 3);
  const json = JSON.stringify(summary);
  assert.doesNotMatch(json, /learnerState/);
  assert.doesNotMatch(json, /psychometric/);
  assert.doesNotMatch(json, /cognitionEnvelope/);
});

test("getEducatorGraphSummary reflects recorded events", () => {
  resetGraphOsAggregationForTests();
  recordGraphOsEvent("glossary_traversal", { depth: 3 });
  recordGraphOsEvent("hydration_fallback");
  recordGraphOsEvent("tutoring_continue");
  recordGraphOsEvent("tutoring_complete");
  const summary = getEducatorGraphSummary();
  assert.equal(summary.glossaryTraversalCount, 1);
  assert.ok(summary.hydrationFallbackRate >= 0);
  assert.ok(summary.tutoringContinuityAdherence > 0);
});

test("educator insights use hydration fallback rate not continuity rate", () => {
  const metrics = aggregateEducatorGraphMetrics({
    hydrationFallbacks: 3,
    semanticRouteViews: 10,
    continuityInterruptions: 1,
  });
  const report = buildEducatorGraphInsights(metrics);
  const hydration = report.insights.find((i) => i.id === "hydration_fallback");
  assert.equal(hydration?.value, 0.3);
});
