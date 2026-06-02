import assert from "node:assert/strict";
import test from "node:test";

import {
  auditNpQuestionClinicalDepth,
  auditNpQuestionClinicalDepthBatch,
  buildNpReadinessDashboard,
  classifyNpQuestionPathways,
} from "./np-question-enrichment-clinical-depth-engine";

const completeNpQuestion = {
  id: "np-complete-diabetes-ckd",
  exam: "FNP",
  tier: "NP",
  status: "published",
  questionType: "single_best_answer",
  stem:
    "A family nurse practitioner sees a 61-year-old client with type 2 diabetes, CKD G3a, UACR 4.2 mg/mmol, HbA1c 8.3%, and eGFR 58. Which management plan is most appropriate?",
  options: [
    "Continue metformin, discuss adding an SGLT2 inhibitor for cardiorenal benefit, monitor renal function and UACR, and arrange follow-up in 3 months.",
    "Stop metformin immediately because the eGFR is below 60.",
    "Refer urgently to nephrology before making any medication decision.",
    "Increase sulfonylurea dose and repeat labs in one year.",
  ],
  correctAnswer:
    "Continue metformin, discuss adding an SGLT2 inhibitor for cardiorenal benefit, monitor renal function and UACR, and arrange follow-up in 3 months.",
  rationale:
    "This plan integrates diagnostic reasoning, guideline-based management, prescribing safety, and follow-up. The client has type 2 diabetes with CKD G3a and albuminuria, so the differential for renal decline includes diabetic kidney disease, medication effects, and other renal pathology, but the current data support cardiorenal risk reduction rather than urgent referral alone. Metformin is generally continued at this eGFR with monitoring, while an SGLT2 inhibitor is guideline-supported for renal and cardiovascular protection when not contraindicated. Follow-up in 3 months allows reassessment of eGFR, UACR, glycemic control, adverse effects, and adherence.",
  correctAnswerExplanation:
    "The correct answer addresses diagnosis, differential risk, medication safety, evidence-based management, and a defined monitoring interval.",
  distractorRationales: {
    B: "Stopping metformin solely because eGFR is below 60 is tempting because renal function matters, but it is too conservative and removes useful glycemic therapy. The better reasoning process is to apply renal thresholds, monitor kidney function, and individualize risk.",
    C: "Nephrology referral may be appropriate for rapid decline, severe albuminuria, or diagnostic uncertainty, but the available data do not require urgent referral before primary care management. This distractor over-escalates and delays evidence-based therapy.",
    D: "A sulfonylurea can increase hypoglycemia risk, does not provide the same cardiorenal benefit, and one-year follow-up is too delayed for active CKD and diabetes optimization. Learners choose it when they focus only on HbA1c.",
  },
  clinicalReasoning:
    "The NP weighs diabetic kidney disease against alternative renal causes, selects guideline-supported therapy, screens for contraindications, and defines monitoring.",
  clinicalPearl:
    "NP certification items often test whether you can pair a medication choice with the monitoring plan that makes it safe.",
  examStrategy:
    "Compare answer choices for contraindications, renal thresholds, and follow-up before choosing the most familiar drug.",
  clinicalTrap:
    "A common NP exam trap is stopping useful therapy based on one lab threshold without applying guideline nuance or monitoring strategy.",
  memoryHook: "NP diabetes-CKD decisions: kidney stage, albuminuria, cardiorenal benefit, monitoring interval.",
  keyTakeaway:
    "Diagnose the risk pattern, rule out urgent alternatives, choose evidence-aligned therapy, and schedule follow-up.",
  difficulty: 4,
  cognitiveLevel: "diagnostic_reasoning",
  bodySystem: "Endocrine",
  topic: "Diabetes CKD guideline management prescribing follow-up differential diagnosis",
  subtopic: "SGLT2 inhibitor prescribing safety",
  nclexClientNeedsCategory: "FNP blueprint",
  nclexClientNeedsSubcategory: "Assessment Diagnosis Plan Evaluation",
  tags: ["hint:Look for the option that connects diagnosis, prescribing safety, renal monitoring, and follow-up.", "blueprint:fnp-primary-care"],
  isMockExamEligible: true,
  isAdaptiveEligible: true,
  isFlashcardSource: true,
  blueprintWeight: 1,
};

test("NP depth engine classifies NP pathways", () => {
  assert.deepEqual(classifyNpQuestionPathways(completeNpQuestion), ["FNP"]);
  assert.deepEqual(classifyNpQuestionPathways({ ...completeNpQuestion, exam: "CNPLE", topic: "Canadian NP CNPLE diagnostic reasoning" }), ["CNPLE"]);
  assert.deepEqual(classifyNpQuestionPathways({ ...completeNpQuestion, exam: "PMHNP", topic: "Psychiatric mental health prescribing" }), ["PMHNP"]);
  assert.deepEqual(classifyNpQuestionPathways({ ...completeNpQuestion, exam: "PNP-PC", topic: "Pediatric primary care NP" }), ["PNP-PC"]);
});

test("NP depth engine marks advanced NP questions publication and monetization ready", () => {
  const result = auditNpQuestionClinicalDepth(completeNpQuestion);
  assert.ok(result);
  assert.equal(result.pathwayGroup, "NP");
  assert.deepEqual(result.clinicalDepthGaps, []);
  assert.equal(result.npPublicationBlocked, false);
  assert.equal(result.publicationReady, true);
  assert.equal(result.monetizationReady, true);
  assert.ok(result.clinicalDepthScores.npDepthScore >= 90);
});

test("NP depth engine blocks RN-level recognition-only questions", () => {
  const result = auditNpQuestionClinicalDepth({
    id: "np-thin-rn-level",
    exam: "FNP",
    tier: "NP",
    questionType: "multiple_choice",
    stem: "A patient has shortness of breath. What should the nurse practitioner do first?",
    options: ["Assess breathing.", "Document.", "Teach diet.", "Offer water."],
    correctAnswer: "Assess breathing.",
    rationale: "Assessing breathing is correct.",
    topic: "Respiratory assessment",
    bodySystem: "Respiratory",
  });

  assert.ok(result);
  assert.equal(result.npPublicationBlocked, true);
  assert.ok(result.clinicalDepthGaps.includes("diagnostic_reasoning"));
  assert.ok(result.clinicalDepthGaps.includes("differential_diagnosis"));
  assert.ok(result.clinicalDepthGaps.includes("guideline_based_management"));
  assert.ok(result.clinicalDepthGaps.includes("prescribing_relevance"));
  assert.ok(result.clinicalDepthGaps.includes("follow_up_planning"));
  assert.ok(result.clinicalDepthGaps.includes("advanced_rationale"));
  assert.equal(result.npRemediationDraft.publishable, false);
  assert.ok(result.npRemediationDraft.diagnosticExplanationDraft);
  assert.ok(result.npRemediationDraft.differentialDiagnosisDraft);
  assert.ok(result.npRemediationDraft.followUpPlanDraft);
});

test("NP readiness dashboard reports clinical depth coverage and monetization readiness", () => {
  const results = auditNpQuestionClinicalDepthBatch([
    completeNpQuestion,
    { ...completeNpQuestion, id: "np-cnple", exam: "CNPLE", topic: "Canadian NP CNPLE guideline prescribing differential diagnosis follow-up" },
    {
      id: "np-thin",
      exam: "AGPCNP",
      tier: "NP",
      stem: "Short question about diagnosis.",
      correctAnswer: "A",
      rationale: "A is correct.",
      topic: "Adult gerontology NP",
    },
  ]);

  const dashboard = buildNpReadinessDashboard(results);
  assert.equal(dashboard.totalNpQuestions, 3);
  assert.equal(dashboard.byPathway.FNP.total, 1);
  assert.equal(dashboard.byPathway.CNPLE.total, 1);
  assert.equal(dashboard.byPathway.AGPCNP.total, 1);
  assert.equal(dashboard.publicationReadinessPercent, 66.7);
  assert.equal(dashboard.monetizationReadinessPercent, 66.7);
  assert.ok(dashboard.diagnosticReasoningCoverage >= 66.7);
  assert.ok(dashboard.prescribingCoverage >= 66.7);
  assert.ok(dashboard.remediationPlan.length >= 4);
});
