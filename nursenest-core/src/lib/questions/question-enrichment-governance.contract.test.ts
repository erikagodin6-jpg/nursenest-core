import assert from "node:assert/strict";
import test from "node:test";

import {
  auditQuestionEnrichment,
  summarizeQuestionEnrichment,
  QUESTION_ENRICHMENT_TARGET_EXAMS,
} from "./question-enrichment-governance";

const completeQuestion = {
  id: "q-complete",
  exam: "NCLEX-RN",
  tier: "RN",
  status: "published",
  questionType: "multiple_choice",
  stem:
    "A client with heart failure has increasing dyspnea, crackles, oxygen saturation of 88%, and new confusion. Which nursing action is the priority?",
  options: ["Apply oxygen and reassess respiratory status.", "Offer oral fluids.", "Document the finding.", "Teach sodium restriction."],
  correctAnswer: "Apply oxygen and reassess respiratory status.",
  rationale:
    "The priority is to support oxygenation because worsening dyspnea, crackles, low SpO2, and confusion suggest impaired gas exchange and possible clinical deterioration. Heart failure can cause pulmonary congestion, reducing oxygen diffusion and increasing work of breathing. The nurse should act on airway and breathing first, apply oxygen as ordered or per protocol, reassess vital signs and lung sounds, and escalate promptly if the client remains unstable. This reasoning protects patient safety and connects the cues to ABC prioritization.",
  correctAnswerExplanation:
    "Oxygen and focused reassessment directly address the immediate breathing problem and help determine whether rapid escalation is required.",
  distractorRationales: {
    B: "Oral fluids may seem supportive, but in heart failure they can worsen fluid overload and do not address the immediate oxygenation risk. Learners choose it when they focus on comfort rather than the unstable cue. Avoid the error by matching the intervention to the respiratory finding.",
    C: "Documentation is required after assessment and intervention, but documenting first delays treatment of hypoxemia and confusion. Learners choose it when they focus on legal completion before stabilization. Avoid this mistake by asking what could harm the client now.",
    D: "Sodium teaching matters for long-term heart failure management, but education can wait during acute respiratory compromise. The priority is stabilization before teaching. Learners choose it when they confuse chronic discharge priorities with immediate deterioration priorities.",
  },
  clinicalReasoning:
    "The cue cluster indicates acute breathing compromise, so the nurse prioritizes oxygenation, reassessment, and escalation over routine teaching or documentation.",
  clinicalPearl:
    "In heart failure, new confusion with low oxygen saturation is a deterioration cue, not a teaching moment.",
  examStrategy:
    "For NCLEX priority questions, unstable ABC findings outrank chronic education needs and routine documentation.",
  clinicalTrap:
    "Students often choose teaching because heart failure education is familiar, but acute hypoxemia requires immediate action first.",
  memoryHook: "Crackles plus confusion equals oxygenation first.",
  keyTakeaway: "Treat the unstable cue before routine care.",
  difficulty: 3,
  cognitiveLevel: "analyze",
  bodySystem: "Cardiovascular",
  topic: "Heart Failure",
  subtopic: "Clinical Deterioration",
  nclexClientNeedsCategory: "physiological-integrity",
  nclexClientNeedsSubcategory: "reduction-of-risk-potential",
  tags: ["hint:Focus on the cue that could become life-threatening before deciding what can wait."],
  isMockExamEligible: true,
  isAdaptiveEligible: true,
  isFlashcardSource: true,
  blueprintWeight: 1,
};

test("question enrichment audit marks fully enriched questions as publication and monetization ready", () => {
  const result = auditQuestionEnrichment(completeQuestion);
  assert.equal(result.pathwayGroup, "RN");
  assert.deepEqual(result.missingFields, []);
  assert.equal(result.publicationReady, true);
  assert.equal(result.flashcardReady, true);
  assert.equal(result.practiceExamReady, true);
  assert.equal(result.catReady, true);
  assert.equal(result.adaptiveLearningReady, true);
  assert.equal(result.monetizationReady, true);
  assert.ok(result.scores.overallQuality >= 90, `Expected 90+ score, received ${result.scores.overallQuality}`);
});

test("question enrichment audit quarantines thin questions and reports missing enrichment fields", () => {
  const result = auditQuestionEnrichment({
    id: "q-thin",
    exam: "REx-PN",
    tier: "RPN",
    questionType: "multiple_choice",
    stem: "What is the priority?",
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    rationale: "A is correct.",
  });

  assert.equal(result.pathwayGroup, "RPN_PN");
  assert.equal(result.publicationReady, false);
  assert.equal(result.qualityBand, "major_revision");
  assert.ok(result.missingFields.includes("correct_rationale"));
  assert.ok(result.missingFields.includes("distractor_rationales"));
  assert.ok(result.missingFields.includes("hint"));
  assert.ok(result.missingFields.includes("clinical_pearl"));
  assert.equal(result.remediationDraft.publishable, false);
});

test("question enrichment summary reports gap counts across RN, RPN, and NP pathways", () => {
  const results = [
    auditQuestionEnrichment(completeQuestion),
    auditQuestionEnrichment({ ...completeQuestion, id: "q-np", exam: "FNP", tier: "NP" }),
    auditQuestionEnrichment({ id: "q-pn", exam: "NCLEX-PN", tier: "PN", stem: "Short", correctAnswer: null }),
  ];

  const summary = summarizeQuestionEnrichment(results);
  assert.equal(summary.totalQuestionsAudited, 3);
  assert.equal(summary.byPathwayGroup.RN.total, 1);
  assert.equal(summary.byPathwayGroup.NP.total, 1);
  assert.equal(summary.byPathwayGroup.RPN_PN.total, 1);
  assert.equal(summary.questionsRequiringMajorRevision, 1);
});

test("question enrichment target exams cover RN, RPN/PN, and NP requested pathways", () => {
  for (const exam of ["NCLEX-RN", "REx-PN", "NCLEX-PN", "CNPLE", "FNP", "AGPCNP", "PMHNP", "PNP-PC", "WHNP", "ENP"]) {
    assert.ok(QUESTION_ENRICHMENT_TARGET_EXAMS.includes(exam as never), `Missing target exam ${exam}`);
  }
});
