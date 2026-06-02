import assert from "node:assert/strict";
import test from "node:test";
import { telemetryReadinessPct, type EcgTelemetryCompetency } from "./ecg-telemetry-competency.client";

test("telemetryReadinessPct weights lessons and measurement", () => {
  const base: EcgTelemetryCompetency = {
    lessonsReviewed: ["a", "b", "c", "d", "e"],
    measurementAttempts: 10,
    measurementCorrect: 8,
    drillsCompleted: 2,
    confidenceSum: 12,
    confidenceCount: 3,
  };
  const pct = telemetryReadinessPct(base);
  assert.ok(pct >= 50 && pct <= 100);
});

test("telemetryReadinessPct is zero for empty state", () => {
  assert.equal(
    telemetryReadinessPct({
      lessonsReviewed: [],
      measurementAttempts: 0,
      measurementCorrect: 0,
      drillsCompleted: 0,
      confidenceSum: 0,
      confidenceCount: 0,
    }),
    0,
  );
});
