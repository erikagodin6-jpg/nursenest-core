import assert from "node:assert/strict";
import { test } from "node:test";
import { computeScenarioOutcome } from "@/lib/clinical-scenarios/clinical-scenario-outcome-engine";

test("computeScenarioOutcome: zero errors → stabilized", () => {
  const r = computeScenarioOutcome({
    trajectoryPath: ["improving", "stable"],
    incorrectCount: 0,
    incorrectWeight: 0,
    totalStages: 4,
    mistakeLabels: [],
  });
  assert.equal(r.outcome, "stabilized");
});

test("computeScenarioOutcome: mixed errors → critical", () => {
  const r = computeScenarioOutcome({
    trajectoryPath: ["stable", "deteriorating"],
    incorrectCount: 1,
    incorrectWeight: 2,
    totalStages: 5,
    mistakeLabels: ["Delayed reassessment"],
  });
  assert.equal(r.outcome, "critical");
  assert.ok(r.keyMistakes.some((m) => m.includes("Delayed")));
});

test("computeScenarioOutcome: high incorrectCount → deteriorated", () => {
  const r = computeScenarioOutcome({
    trajectoryPath: ["deteriorating", "deteriorating"],
    incorrectCount: 3,
    incorrectWeight: 6,
    totalStages: 5,
    mistakeLabels: ["a", "b", "c"],
  });
  assert.equal(r.outcome, "deteriorated");
});
