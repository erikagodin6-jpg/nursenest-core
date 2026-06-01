import assert from "node:assert/strict";
import test from "node:test";

import {
  enforceQuestionPublicationGovernance,
  QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS,
  QUESTION_ENFORCEMENT_SCORE_THRESHOLDS,
} from "./question-publication-enforcement-contracts";

const readyQuestion = {
  id: "ready-question",
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
    B: "Fluids may seem helpful because hydration can thin secretions, but this is incorrect because it does not address the immediate hypoxemia. Learners choose it when they focus on general pneumonia care instead of the unstable respiratory cue. The safety risk is delayed oxygenation support, worsening respiratory deterioration, and failure to rescue. Remediate with ABC prioritization and respiratory escalation practice.",
    C: "Incentive spirometry may seem reasonable because it is pneumonia-related and supports lung expansion, but this is incorrect because teaching or coaching can wait when the client is hypoxemic and restless. The safety risk is delayed response to an unstable breathing cue. Remediate by separating long-term pulmonary care from immediate ABC priorities.",
    D: "Documentation may seem necessary because abnormal findings must be charted, but this is incorrect because documenting first delays treatment of a low oxygen saturation. The safety risk is delayed correction of hypoxemia and delayed escalation. Remediate with the sequence: assess, intervene, reassess, escalate if needed, then document.",
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

test("publication enforcement allows only fully standardized questions", () => {
  const result = enforceQuestionPublicationGovernance(readyQuestion);
  assert.equal(result.publicationEligible, true);
  assert.equal(result.flashcardReady, true);
  assert.equal(result.practiceExamEligible, true);
  assert.equal(result.catEligible, true);
  assert.equal(result.adaptiveReady, true);
  assert.equal(result.translationReady, true);
  assert.ok(result.statuses.includes("PUBLICATION_ELIGIBLE"));
});

test("publication enforcement blocks missing required educational components", () => {
  const result = enforceQuestionPublicationGovernance({
    id: "blocked",
    exam: "REx-PN",
    tier: "RPN",
    questionType: "multiple_choice",
    stem: "What should the nurse do?",
    correctAnswer: "Assess the client.",
    rationale: "Assessing is correct.",
  });

  assert.equal(result.publicationEligible, false);
  assert.ok(result.statuses.includes("BLOCKED_FROM_PUBLICATION"));
  assert.ok(result.statuses.includes("RATIONALE_REWRITE_REQUIRED"));
  assert.ok(result.statuses.includes("HINT_REWRITE_REQUIRED"));
  assert.ok(result.statuses.includes("PEARL_REWRITE_REQUIRED"));
  assert.ok(result.statuses.includes("FLASHCARD_REWRITE_REQUIRED"));
  assert.ok(result.statuses.includes("NOT_CAT_ELIGIBLE"));
  assert.ok(result.statuses.includes("NOT_PRACTICE_EXAM_ELIGIBLE"));
  assert.ok(result.statuses.includes("NOT_ADAPTIVE_READY"));
});

test("publication enforcement rejects answer-revealing hints and duplicate signals", () => {
  const result = enforceQuestionPublicationGovernance(
    {
      ...readyQuestion,
      tags: ["hint:The correct answer is option A."],
    },
    {
      questionSimilarity: 0.86,
      rationaleSimilarity: 0.91,
    },
  );

  assert.equal(result.publicationEligible, false);
  assert.ok(result.statuses.includes("HINT_REWRITE_REQUIRED"));
  assert.ok(result.statuses.includes("DUPLICATE_REVIEW_REQUIRED"));
});

test("publication enforcement rejects translation-risk language", () => {
  const result = enforceQuestionPublicationGovernance({
    ...readyQuestion,
    stem: `${readyQuestion.stem} This rule of thumb helps in the ER.`,
  });

  assert.equal(result.translationReady, false);
  assert.ok(result.statuses.includes("TRANSLATION_REWRITE_REQUIRED"));
});

test("publication enforcement thresholds are strict enough for production gates", () => {
  assert.deepEqual(QUESTION_ENFORCEMENT_SCORE_THRESHOLDS, {
    clinicalAccuracy: 95,
    educationalValue: 90,
    examRealism: 90,
    publicationReadiness: 90,
    overallEcosystemScore: 90,
  });
  assert.deepEqual(QUESTION_ENFORCEMENT_DUPLICATE_THRESHOLDS, {
    questionSimilarity: 0.85,
    rationaleSimilarity: 0.9,
    clinicalPearlSimilarity: 0.9,
    flashcardSimilarity: 0.9,
  });
});
