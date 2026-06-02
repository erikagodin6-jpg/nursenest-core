import test from "node:test";
import assert from "node:assert/strict";

import { calculateRuntimeAdaptiveSteering } from "./runtime-adaptive-steering";

test("fatigued struggling learner receives reduced difficulty", () => {
  const result = calculateRuntimeAdaptiveSteering({
    currentTheta: 0.2,
    recentIncorrectStreak: 4,
    fatigueRisk: 0.82,
  });

  assert.equal(result.shouldReduceDifficulty, true);
  assert.equal(result.steeringConfidence, "low");
});

test("high-performing learner receives increased challenge", () => {
  const result = calculateRuntimeAdaptiveSteering({
    currentTheta: 1.1,
    recentCorrectStreak: 5,
    fatigueRisk: 0.12,
  });

  assert.equal(result.shouldIncreaseDifficulty, true);
  assert.ok(result.adjustedDifficultyTarget > 0.5);
});

test("exposure pressure triggers throttling", () => {
  const result = calculateRuntimeAdaptiveSteering({
    exposurePressure: 0.82,
  });

  assert.equal(result.shouldThrottleExposure, true);
});

test("blueprint deficits propagate into recommendations", () => {
  const result = calculateRuntimeAdaptiveSteering({
    blueprintDeficitDomains: ["neurology", "endocrine"],
  });

  assert.deepEqual(result.recommendedBlueprintDomains, ["neurology", "endocrine"]);
});
