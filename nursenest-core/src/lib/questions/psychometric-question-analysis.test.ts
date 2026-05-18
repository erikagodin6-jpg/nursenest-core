import test from "node:test";
import assert from "node:assert/strict";

import { analyzePsychometricQuestion } from "./psychometric-question-analysis";

test("flags fewer than four options", () => {
  const result = analyzePsychometricQuestion({
    stem: "Which intervention should the nurse perform first?",
    options: ["Assess airway", "Call provider"],
    correctAnswer: "Assess airway",
  });

  assert.ok(result.issues.some((issue) => issue.code === "TOO_FEW_OPTIONS"));
  assert.ok(result.guessingRiskScore < 100);
});

test("flags all of the above pattern", () => {
  const result = analyzePsychometricQuestion({
    stem: "Which findings support heart failure?",
    options: [
      "Pulmonary crackles",
      "Peripheral edema",
      "Weight gain",
      "All of the above",
    ],
    correctAnswer: "All of the above",
  });

  assert.ok(result.issues.some((issue) => issue.code === "ALL_OF_THE_ABOVE_PATTERN"));
});

test("flags implausible distractors", () => {
  const result = analyzePsychometricQuestion({
    stem: "Which finding requires follow-up?",
    options: [
      "Oxygen saturation 82%",
      "Yes",
      "No",
      "The client likes apples",
    ],
    correctAnswer: "Oxygen saturation 82%",
  });

  assert.ok(result.issues.some((issue) => issue.code === "DISTRACTOR_TOO_IMPLAUSIBLE"));
});

test("flags disproportionate correct-answer length", () => {
  const result = analyzePsychometricQuestion({
    stem: "Which statement is most accurate?",
    options: [
      "A",
      "B",
      "C",
      "A comprehensive multidisciplinary intervention involving continuous telemetry, serial reassessment, escalation pathways, and hemodynamic monitoring",
    ],
    correctAnswer:
      "A comprehensive multidisciplinary intervention involving continuous telemetry, serial reassessment, escalation pathways, and hemodynamic monitoring",
  });

  assert.ok(result.issues.some((issue) => issue.code === "CORRECT_ANSWER_LENGTH_OUTLIER"));
});

test("high-quality balanced question retains strong scores", () => {
  const result = analyzePsychometricQuestion({
    stem: "Which assessment finding is most concerning in a client with digoxin therapy?",
    options: [
      "Nausea and visual halos",
      "Mild thirst after exercise",
      "Pulse 88/min after ambulation",
      "Single premature atrial contraction",
    ],
    correctAnswer: "Nausea and visual halos",
  });

  assert.ok(result.overallScore >= 75);
});
