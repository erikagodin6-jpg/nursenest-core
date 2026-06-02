import test from "node:test";
import assert from "node:assert/strict";

import { detectClinicalContradictions } from "./clinical-contradiction-detection";

test("detects ABC priority contradiction", () => {
  const result = detectClinicalContradictions({
    stem:
      "A client with respiratory distress and oxygen saturation of 82% becomes cyanotic. Which action should the nurse take first?",
    correctAnswer: "Wait for the provider before intervening",
    rationale: "Immediate intervention is urgent to prevent deterioration.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "ABC_PRIORITY_CONTRADICTION"));
  assert.equal(result.safeForPublish, false);
});

test("detects sepsis stabilization contradiction", () => {
  const result = detectClinicalContradictions({
    stem: "A septic client develops hypotension and altered mental status.",
    correctAnswer: "Delay reassessment for several hours",
    rationale: "The condition is urgent and requires rapid stabilization.",
  });

  assert.ok(
    result.issues.some((issue) => issue.code === "SEPSIS_RESUSCITATION_CONTRADICTION"),
  );
});

test("detects oxygenation contradiction", () => {
  const result = detectClinicalContradictions({
    stem: "The client develops severe hypoxia and cyanosis.",
    correctAnswer: "Withhold oxygen and continue observation",
    rationale: "Hypoxia requires immediate intervention.",
  });

  assert.ok(result.issues.some((issue) => issue.code === "OXYGENATION_CONTRADICTION"));
});

test("detects distractor rationale supporting wrong option", () => {
  const result = detectClinicalContradictions({
    correctAnswer: "Assess airway patency",
    distractorRationales: {
      "Document findings": "This is the correct priority action.",
    },
  });

  assert.ok(
    result.issues.some((issue) => issue.code === "DISTRACTOR_SUPPORTS_WRONG_OPTION"),
  );
});

test("safe coherent item remains publish safe", () => {
  const result = detectClinicalContradictions({
    stem:
      "A client with pulmonary edema develops worsening dyspnea and oxygen saturation of 84%.",
    correctAnswer: "Position the client upright and administer oxygen as prescribed",
    rationale:
      "Positioning and oxygenation improve gas exchange and reduce respiratory distress.",
    clinicalReasoning:
      "Airway and breathing stabilization are the priority.",
  });

  assert.equal(result.safeForPublish, true);
  assert.ok(result.contradictionScore >= 80);
});
