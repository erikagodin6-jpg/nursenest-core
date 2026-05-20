import test from "node:test";
import assert from "node:assert/strict";

import {
  CLINICAL_QUESTION_QUALITY_THRESHOLDS,
  evaluateClinicalQuestionQuality,
} from "./clinical-question-quality";

test("passes a clinically rich NCLEX-style item", () => {
  const result = evaluateClinicalQuestionQuality({
    questionType: "MCQ",
    stem:
      "A nurse is caring for a 72-year-old client with worsening shortness of breath, bilateral crackles, elevated jugular venous distention, and new confusion after receiving multiple fluid boluses in the emergency department. Which action should the nurse take first?",
    options: [
      "Administer the prescribed IV furosemide",
      "Increase maintenance IV fluids",
      "Place the client flat in bed",
      "Encourage oral fluid intake",
    ],
    correctAnswer: "Administer the prescribed IV furosemide",
    rationale:
      "The client demonstrates acute fluid volume overload with pulmonary edema and declining perfusion. IV furosemide directly addresses the pathophysiology by reducing preload and pulmonary congestion. The nurse should recognize that worsening respiratory findings and confusion indicate deterioration requiring rapid intervention. Increasing fluids or encouraging intake would worsen pulmonary edema, and placing the client flat can further impair oxygenation and work of breathing.",
    distractorRationales: {
      B: "Additional IV fluids worsen pulmonary congestion and cardiac workload.",
      C: "Lying flat increases venous return and can worsen dyspnea in pulmonary edema.",
      D: "Oral fluid intake does not address the acute hemodynamic problem and may worsen overload.",
    },
    clinicalReasoning:
      "The nurse must connect pulmonary edema findings, altered mentation, and fluid exposure to acute decompensated heart failure and prioritize airway/breathing stabilization.",
    examStrategy:
      "Use ABC prioritization and identify which intervention directly reverses the life-threatening physiologic problem.",
    clinicalTrap:
      "Learners often focus on hypotension risk and delay diuresis despite clear pulmonary edema.",
    topic: "Heart Failure",
    bodySystem: "cardiovascular",
    cognitiveLevel: "analysis",
    difficulty: 4,
    qualityScore: 92,
  });

  assert.equal(result.pass, true);
  assert.ok(result.score >= CLINICAL_QUESTION_QUALITY_THRESHOLDS.passingScore);
  assert.equal(result.issues.length, 0);
});

test("fails shallow imported-style content", () => {
  const result = evaluateClinicalQuestionQuality({
    questionType: "MCQ",
    stem: "What should the nurse do first?",
    options: ["A", "B"],
    correctAnswer: "A",
    rationale: "Because it is correct.",
    topic: "Cardiac",
  });

  assert.equal(result.pass, false);
  assert.ok(result.issues.some((issue) => issue.code === "RATIONALE_TOO_SHORT"));
  assert.ok(result.issues.some((issue) => issue.code === "DISTRACTOR_RATIONALES_MISSING"));
  assert.ok(result.issues.some((issue) => issue.code === "CLINICAL_REASONING_MISSING"));
});

test("flags unsafe absolute wording", () => {
  const result = evaluateClinicalQuestionQuality({
    questionType: "MCQ",
    stem: "The nurse should always administer oxygen to every client with chest pain.",
    options: ["True", "False", "Only if hypoxic", "Only after ECG"],
    correctAnswer: "Only if hypoxic",
    rationale:
      "Routine oxygen is no longer recommended for every client with chest pain because unnecessary oxygen can contribute to hyperoxia-related harm in some populations.",
    clinicalReasoning:
      "The nurse should evaluate oxygen saturation and respiratory distress rather than applying blanket interventions.",
    examStrategy:
      "Avoid absolutes unless the item is testing a universally true safety rule.",
    keyTakeaway:
      "Modern ACS care uses targeted oxygen therapy rather than reflexive administration.",
    topic: "Acute Coronary Syndrome",
    bodySystem: "cardiovascular",
    cognitiveLevel: "application",
    difficulty: 3,
  });

  assert.ok(result.issues.some((issue) => issue.code === "UNSAFE_ABSOLUTE_LANGUAGE"));
});
