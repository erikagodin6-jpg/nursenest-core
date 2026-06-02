import assert from "node:assert/strict";
import test from "node:test";

import {
  buildGlobalFlashcardStandardizationReport,
  detectRegeneratedFlashcardDuplicates,
  regenerateFlashcardFromEnrichedQuestion,
} from "./global-flashcard-regeneration-standardization-engine";
import type { QuestionEnrichmentAuditRow } from "@/lib/questions/question-enrichment-governance";

const completeQuestion: QuestionEnrichmentAuditRow = {
  id: "q-complete",
  exam: "NCLEX-RN",
  tier: "RN",
  countryCode: "US",
  languageCode: "en",
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

test("regenerates standardized flashcards only from validated enriched questions", () => {
  const result = regenerateFlashcardFromEnrichedQuestion(completeQuestion);

  assert.equal(result.status, "GENERATED_FROM_VALIDATED_CONTENT");
  assert.equal(result.sourceValidation.publicationReady, true);
  assert.equal(result.sourceValidation.flashcardReady, true);
  assert.equal(result.flashcard?.sourceQuestionId, "q-complete");
  assert.equal(result.flashcard?.roleScope, "RN");
  assert.equal(result.flashcard?.countryMapping, "US");
  assert.match(result.flashcard?.examMapping ?? "", /NCLEX-RN/);
  assert.match(result.flashcard?.clinicalPearl ?? "", /deterioration cue/);
  assert.match(result.flashcard?.memoryAnchor ?? "", /oxygenation first/);
  assert.match(result.flashcard?.commonMistake ?? "", /teaching/);
  assert.equal(result.flashcard?.translationReadiness.ready, true);
});

test("blocks flashcard generation when source question is not enriched", () => {
  const result = regenerateFlashcardFromEnrichedQuestion({
    id: "q-thin",
    exam: "REx-PN",
    tier: "PN",
    questionType: "multiple_choice",
    stem: "What is heart failure?",
    options: ["A disease", "A medication"],
    correctAnswer: "A disease",
    rationale: "A disease is correct.",
  });

  assert.equal(result.status, "BLOCKED_SOURCE_NOT_VALIDATED");
  assert.equal(result.pathwayGroup, "RPN_PN");
  assert.equal(result.flashcard, undefined);
  assert.ok(result.issues.some((issue) => issue.includes("source question is not publication-ready")));
});

test("builds RN, PN, and NP readiness dashboards from regenerated question flashcards", () => {
  const report = buildGlobalFlashcardStandardizationReport([
    completeQuestion,
    { ...completeQuestion, id: "q-pn", exam: "NCLEX-PN", tier: "PN", countryCode: "CA" },
    { ...completeQuestion, id: "q-np", exam: "FNP", tier: "NP", countryCode: "US" },
    { ...completeQuestion, id: "q-blocked", clinicalPearl: "" },
  ]);

  assert.equal(report.rnFlashcardReadiness.totalQuestions, 2);
  assert.equal(report.rnFlashcardReadiness.generatedFlashcards, 1);
  assert.equal(report.rnFlashcardReadiness.blockedSources, 1);
  assert.equal(report.pnFlashcardReadiness.generatedFlashcards, 1);
  assert.equal(report.npFlashcardReadiness.generatedFlashcards, 1);
  assert.equal(report.rnFlashcardReadiness.readinessPercent, 50);
  assert.equal(report.pnFlashcardReadiness.readinessPercent, 100);
  assert.equal(report.npFlashcardReadiness.monetizationReadinessPercent, 100);
});

test("detects duplicate regenerated flashcards for reduction reporting", () => {
  const results = [
    regenerateFlashcardFromEnrichedQuestion(completeQuestion),
    regenerateFlashcardFromEnrichedQuestion({ ...completeQuestion, id: "q-duplicate" }),
  ];

  const duplicates = detectRegeneratedFlashcardDuplicates(results);
  assert.equal(duplicates.length, 1);
  assert.equal(duplicates[0]?.primaryQuestionId, "q-complete");
  assert.equal(duplicates[0]?.duplicateQuestionId, "q-duplicate");
  assert.equal(duplicates[0]?.reason, "exact_normalized_match");
});
