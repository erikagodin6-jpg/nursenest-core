import assert from "node:assert/strict";
import test from "node:test";

import {
  auditQuestionEditorialStandardization,
  summarizeEditorialStandardization,
} from "./question-editorial-standardization";

const standardizedQuestion = {
  id: "standardized-rn",
  exam: "NCLEX-RN",
  tier: "RN",
  questionType: "multiple_choice",
  stem:
    "A client with pneumonia has a respiratory rate of 32/min, oxygen saturation of 88%, and increasing restlessness. Which nursing action is the priority?",
  options: ["Apply oxygen and reassess respiratory status.", "Encourage oral fluids.", "Teach incentive spirometry.", "Document the findings."],
  correctAnswer: "Apply oxygen and reassess respiratory status.",
  rationale:
    "The correct action is to support oxygenation because tachypnea, low oxygen saturation, and restlessness suggest worsening gas exchange. Pneumonia causes alveolar inflammation and impaired oxygen diffusion, so the nurse prioritizes airway and breathing before routine teaching or documentation. This protects patient safety by addressing the cue most likely to deteriorate first and creates a clear reassessment point after the intervention.",
  correctAnswerExplanation:
    "Oxygen addresses the immediate breathing problem and allows the nurse to evaluate whether escalation is needed.",
  distractorRationales: {
    B: "Fluids may seem helpful because hydration can thin secretions, but this does not address the immediate hypoxemia. Learners choose it when they focus on general pneumonia care instead of the unstable respiratory cue. The better thinking process is to treat oxygenation first, then support hydration when safe.",
    C: "Incentive spirometry is useful for lung expansion, but teaching or coaching can wait when the client is hypoxemic and restless. Learners choose it because it is pneumonia-related. Future questions should be approached by separating long-term pulmonary care from immediate ABC priorities.",
    D: "Documentation is necessary after assessment and intervention, but documenting first delays treatment of a low oxygen saturation. Learners choose it when they focus on legal completion rather than patient safety. The better process is intervene, reassess, escalate if needed, then document.",
  },
  clinicalReasoning:
    "The assessment cue cluster points to unstable breathing, so the nurse prioritizes oxygenation and reassessment.",
  clinicalPearl:
    "Restlessness with low oxygen saturation is a respiratory deterioration cue until proven otherwise.",
  examStrategy:
    "NCLEX priority items often test whether the learner treats unstable ABC findings before routine education or documentation.",
  clinicalTrap:
    "Students miss this when they choose a pneumonia-specific teaching action instead of the action that stabilizes breathing.",
  memoryHook: "Low SpO2 plus restlessness means breathing first.",
  keyTakeaway: "Stabilize the unstable cue before routine care.",
  difficulty: 3,
  cognitiveLevel: "prioritization",
  bodySystem: "Respiratory",
  topic: "Pneumonia",
  subtopic: "Respiratory Deterioration",
  nclexClientNeedsCategory: "physiological-integrity",
  nclexClientNeedsSubcategory: "reduction-of-risk-potential",
  tags: ["hint:Focus on the assessment cue that could become life-threatening before choosing routine care."],
  isMockExamEligible: true,
  isAdaptiveEligible: true,
  isFlashcardSource: true,
  blueprintWeight: 1,
};

test("editorial standardization accepts a unified RN-style question", () => {
  const result = auditQuestionEditorialStandardization(standardizedQuestion);
  assert.equal(result.pathwayGroup, "RN");
  assert.equal(result.standardized, true);
  assert.ok(result.score >= 90, `Expected 90+ score, got ${result.score}`);
  assert.equal(result.cognitiveLevel, "prioritization");
  assert.equal(result.difficultyBand, "moderate");
});

test("editorial standardization rejects answer-revealing hints and generic pearls", () => {
  const result = auditQuestionEditorialStandardization({
    ...standardizedQuestion,
    id: "weak-style",
    tags: ["hint:The correct answer is option A."],
    clinicalPearl: "Think critically and provide safe care when answering this question.",
    memoryHook: "",
  });

  assert.equal(result.standardized, false);
  assert.ok(result.issues.some((issue) => issue.code === "answer_revealing_hint"));
  assert.ok(result.issues.some((issue) => issue.code === "generic_pearl"));
  assert.ok(result.issues.some((issue) => issue.code === "missing_memory_anchor"));
});

test("editorial standardization flags translation-risk wording", () => {
  const result = auditQuestionEditorialStandardization({
    ...standardizedQuestion,
    id: "translation-risk",
    stem: `${standardizedQuestion.stem} This is a rule of thumb for the ER.`,
  });

  assert.equal(result.standardized, false);
  assert.ok(result.issues.some((issue) => issue.code === "idiom_translation_risk"));
});

test("editorial standardization summary reports ecosystem quality by pathway and dimension", () => {
  const results = [
    auditQuestionEditorialStandardization(standardizedQuestion),
    auditQuestionEditorialStandardization({ ...standardizedQuestion, id: "np", exam: "FNP", tier: "NP", cognitiveLevel: "diagnostic reasoning", difficulty: 5 }),
    auditQuestionEditorialStandardization({ ...standardizedQuestion, id: "pn", exam: "REx-PN", tier: "RPN" }),
  ];

  const summary = summarizeEditorialStandardization(results);
  assert.equal(summary.totalQuestionsAudited, 3);
  assert.equal(summary.byPathwayGroup.RN.total, 1);
  assert.equal(summary.byPathwayGroup.NP.total, 1);
  assert.equal(summary.byPathwayGroup.RPN_PN.total, 1);
  assert.ok(summary.ecosystemQualityScore >= 80);
  assert.ok(summary.byDimension.rationaleConsistency >= 90);
});
