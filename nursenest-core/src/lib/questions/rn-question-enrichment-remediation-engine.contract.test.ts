import assert from "node:assert/strict";
import test from "node:test";

import {
  auditRnQuestionEnrichment,
  auditRnQuestionEnrichmentBatch,
  classifyRnQuestionScopes,
  summarizeRnQuestionEnrichment,
} from "./rn-question-enrichment-remediation-engine";

const completeRnQuestion = {
  id: "rn-complete-heart-failure",
  exam: "US_NCLEX_RN",
  tier: "RN",
  countryCode: "US",
  status: "published",
  questionType: "multiple_choice",
  stem:
    "A registered nurse assesses a client with heart failure who has crackles, oxygen saturation of 88%, and new confusion. Which action is the priority?",
  options: ["Apply oxygen and reassess respiratory status.", "Teach sodium restriction.", "Document the finding.", "Offer oral fluids."],
  correctAnswer: "Apply oxygen and reassess respiratory status.",
  rationale:
    "The priority is to support oxygenation because crackles, low oxygen saturation, dyspnea, and new confusion suggest impaired gas exchange and possible deterioration. Heart failure can cause pulmonary congestion, which limits oxygen diffusion and increases work of breathing. The RN should address airway and breathing first, apply oxygen as ordered or per protocol, reassess lung sounds and vital signs, and escalate promptly if instability persists. This answer protects patient safety because it treats the immediate physiologic risk before routine education or documentation.",
  correctAnswerExplanation:
    "Oxygen and focused reassessment directly address the immediate breathing problem and determine whether rapid escalation is needed.",
  distractorRationales: {
    B: "Sodium teaching is important for long-term heart failure management, but it does not address acute hypoxemia or confusion. Learners choose this when they recognize a true heart failure intervention but miss the unstable ABC cue. Teaching should occur after stabilization.",
    C: "Documentation is required, but documenting first delays treatment of a potentially unstable respiratory problem. Learners choose it when they prioritize legal completion before physiologic stabilization. The better process is to intervene, reassess, escalate if needed, and then document.",
    D: "Oral fluids may seem supportive, but additional fluid can worsen congestion in heart failure and does not correct the immediate oxygenation problem. Learners should avoid comfort-focused actions when the stem shows respiratory compromise.",
  },
  clinicalReasoning:
    "The cue cluster shows acute respiratory compromise, so the RN prioritizes oxygenation, reassessment, and escalation over routine teaching.",
  clinicalPearl:
    "In heart failure, new confusion with low oxygen saturation is a deterioration cue, not a teaching moment.",
  examStrategy:
    "For NCLEX-RN priority questions, unstable airway and breathing findings outrank chronic education and routine documentation.",
  clinicalTrap:
    "Students often choose teaching because heart failure education is familiar, but acute hypoxemia requires immediate stabilization.",
  memoryHook: "Crackles plus confusion means oxygenation first.",
  keyTakeaway: "Treat the unstable cue before routine care.",
  difficulty: 3,
  cognitiveLevel: "analysis",
  bodySystem: "Cardiovascular",
  topic: "Heart Failure",
  subtopic: "Clinical Deterioration",
  nclexClientNeedsCategory: "Physiological Integrity",
  nclexClientNeedsSubcategory: "Reduction of Risk Potential",
  tags: ["hint:Find the cue that can become life-threatening before selecting routine care."],
  isMockExamEligible: true,
  isAdaptiveEligible: true,
  isFlashcardSource: true,
  blueprintWeight: 1,
};

test("RN enrichment engine classifies requested RN scopes", () => {
  assert.deepEqual(classifyRnQuestionScopes(completeRnQuestion), ["NCLEX_RN_US"]);
  assert.deepEqual(
    classifyRnQuestionScopes({
      ...completeRnQuestion,
      id: "rn-ca-labs",
      exam: "CA_NCLEX_RN",
      countryCode: "CA",
      topic: "BNP laboratory interpretation",
      tags: ["canadian nclex-rn", "lab interpretation"],
    }),
    ["NCLEX_RN_CANADA", "LAB_INTERPRETATION_RN_CONTENT"],
  );
  assert.deepEqual(
    classifyRnQuestionScopes({
      ...completeRnQuestion,
      id: "rn-ecg-skills",
      exam: "NCLEX-RN",
      topic: "ECG rhythm and medication administration clinical skills",
      tags: ["new grad", "ecg", "clinical skill"],
    }),
    ["NCLEX_RN_US", "NEW_GRAD_RN", "ECG_RN_CONTENT", "CLINICAL_SKILLS_RN_CONTENT"],
  );
});

test("RN enrichment engine marks fully enriched RN questions ready across publication, flashcard, practice, CAT, adaptive, and monetization gates", () => {
  const result = auditRnQuestionEnrichment(completeRnQuestion);
  assert.ok(result);
  assert.equal(result.pathwayGroup, "RN");
  assert.equal(result.rnPublicationBlocked, false);
  assert.equal(result.publicationReady, true);
  assert.equal(result.flashcardReady, true);
  assert.equal(result.practiceExamReady, true);
  assert.equal(result.catReady, true);
  assert.equal(result.adaptiveLearningReady, true);
  assert.equal(result.monetizationReady, true);
});

test("RN enrichment engine blocks thin RN questions and generates non-publishable component drafts", () => {
  const result = auditRnQuestionEnrichment({
    id: "rn-thin",
    exam: "NCLEX-RN",
    tier: "RN",
    questionType: "multiple_choice",
    stem: "What should the RN do first for a client with ECG changes and potassium 6.4 mEq/L?",
    options: ["Call for help.", "Document.", "Teach diet.", "Offer water."],
    correctAnswer: "Call for help.",
    rationale: "This is correct.",
    topic: "Hyperkalemia ECG",
    bodySystem: "Cardiovascular",
  });

  assert.ok(result);
  assert.equal(result.rnPublicationBlocked, true);
  assert.ok(result.missingFields.includes("correct_rationale"));
  assert.ok(result.missingFields.includes("distractor_rationales"));
  assert.ok(result.missingFields.includes("hint"));
  assert.ok(result.missingFields.includes("clinical_pearl"));
  assert.ok(result.missingFields.includes("memory_anchor"));
  assert.ok(result.missingFields.includes("blueprint_mapping"));
  assert.ok(result.missingFields.includes("flashcard_output"));
  assert.equal(result.rnRemediationDrafts.publishable, false);
  assert.ok(result.rnRemediationDrafts.correctRationaleDraft);
  assert.ok(result.rnRemediationDrafts.distractorRationaleDraft);
  assert.ok(result.rnRemediationDrafts.hintDraft);
  assert.ok(result.rnRemediationDrafts.flashcardOutputDraft);
});

test("RN enrichment summary reports required readiness and gap metrics", () => {
  const results = auditRnQuestionEnrichmentBatch([
    completeRnQuestion,
    {
      id: "rn-thin",
      exam: "NCLEX-RN",
      tier: "RN",
      stem: "Short RN question",
      correctAnswer: "A",
      rationale: "A is correct.",
      topic: "NCLEX-RN clinical judgment",
    },
    {
      id: "pn-not-in-scope",
      exam: "REx-PN",
      tier: "PN",
      stem: "PN question",
      correctAnswer: "A",
    },
  ]);

  const summary = summarizeRnQuestionEnrichment(results);
  assert.equal(summary.totalRnQuestions, 2);
  assert.equal(summary.missingRationales, 1);
  assert.equal(summary.missingHints, 1);
  assert.equal(summary.missingPearls, 1);
  assert.equal(summary.missingMetadata, 1);
  assert.equal(summary.missingBlueprintMapping, 1);
  assert.equal(summary.missingFlashcardGeneration, 1);
  assert.equal(summary.catEligible, 1);
  assert.equal(summary.adaptiveEligible, 1);
  assert.equal(summary.publicationReadinessPercent, 50);
  assert.equal(summary.monetizationReadinessPercent, 50);
  assert.ok(summary.remediationPlan.length >= 4);
});
