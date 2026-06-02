import test from "node:test";
import assert from "node:assert/strict";

import { analyzeLearnerPsychometrics } from "./learner-psychometrics";

test("flags insufficient sample size", () => {
  const result = analyzeLearnerPsychometrics({
    totalAttempts: 20,
    correctAttempts: 12,
  });

  assert.equal(result.confidence, "low");
  assert.equal(result.calibrationBand, "insufficient-data");
  assert.ok(result.issues.some((issue) => issue.code === "INSUFFICIENT_SAMPLE"));
});

test("flags item that is too easy", () => {
  const result = analyzeLearnerPsychometrics({
    totalAttempts: 200,
    correctAttempts: 188,
  });

  assert.equal(result.calibrationBand, "too-easy");
  assert.ok(result.issues.some((issue) => issue.code === "TOO_EASY"));
});

test("flags negative discrimination", () => {
  const result = analyzeLearnerPsychometrics({
    totalAttempts: 300,
    correctAttempts: 150,
    highPerformerCorrectRate: 0.42,
    lowPerformerCorrectRate: 0.66,
  });

  assert.equal(result.calibrationBand, "review");
  assert.ok(result.issues.some((issue) => issue.code === "NEGATIVE_DISCRIMINATION"));
});

test("detects nonfunctional distractors", () => {
  const result = analyzeLearnerPsychometrics({
    totalAttempts: 500,
    correctAttempts: 250,
    correctOptionKeys: ["A"],
    optionSelectionCounts: {
      A: 250,
      B: 230,
      C: 12,
      D: 8,
    },
  });

  assert.deepEqual(result.nonfunctionalDistractors.sort(), ["C", "D"]);
  assert.ok(result.issues.some((issue) => issue.code === "NONFUNCTIONAL_DISTRACTOR"));
});

test("detects dominant wrong distractor", () => {
  const result = analyzeLearnerPsychometrics({
    totalAttempts: 400,
    correctAttempts: 120,
    correctOptionKeys: ["A"],
    optionSelectionCounts: {
      A: 120,
      B: 220,
      C: 40,
      D: 20,
    },
  });

  assert.deepEqual(result.dominantWrongDistractors, ["B"]);
  assert.ok(result.issues.some((issue) => issue.code === "DOMINANT_WRONG_DISTRACTOR"));
});

test("detects response-time patterns", () => {
  const fast = analyzeLearnerPsychometrics({
    totalAttempts: 250,
    correctAttempts: 60,
    averageResponseTimeMs: 9000,
  });
  const slow = analyzeLearnerPsychometrics({
    totalAttempts: 250,
    correctAttempts: 90,
    averageResponseTimeMs: 180000,
  });

  assert.ok(fast.issues.some((issue) => issue.code === "FAST_GUESSING_PATTERN"));
  assert.ok(slow.issues.some((issue) => issue.code === "SLOW_CONFUSION_PATTERN"));
});
