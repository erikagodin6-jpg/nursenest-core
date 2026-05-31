import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  formatClinicalAssignmentForCopy,
  generateClinicalAssignment,
  type ClinicalAssignmentInput,
} from "./clinical-assignment-hub";

const HEART_FAILURE_INPUT: ClinicalAssignmentInput = {
  role: "rn",
  setting: "medical-surgical",
  patientProfile: {
    age: "72",
    sex: "Female",
    weight: "82 kg",
    diagnosis: "Heart failure exacerbation",
    secondaryDiagnoses: "Type 2 diabetes, chronic kidney disease",
    surgicalHistory: "No recent surgery",
    medicalHistory: "Heart failure with reduced ejection fraction, atrial fibrillation",
    currentMedications: "Furosemide, metoprolol, insulin glargine",
    allergies: "No known drug allergies",
  },
  assessmentData: {
    vitalSigns: "BP 96/58, HR 118 irregular, RR 26, SpO2 89% room air",
    laboratoryValues: "BNP 980, potassium 3.1, creatinine 144, glucose 14.2",
    symptoms: "Shortness of breath, fatigue, orthopnea",
    physicalAssessmentFindings: "Bilateral crackles, 3+ ankle edema, cool extremities",
    diagnosticTests: "ECG shows atrial fibrillation",
    imagingFindings: "Chest x-ray shows pulmonary congestion",
  },
};

describe("clinical assignment hub generator", () => {
  it("builds a heart failure concept map with clinically rationalized relationships", () => {
    const output = generateClinicalAssignment(HEART_FAILURE_INPUT, "concept-map");

    assert.equal(output.title, "Concept Map Builder");
    assert.match(output.patientSummary, /Heart failure/i);
    assert.ok(output.nodes.some((node) => node.id === "patient" && node.priority === "critical"));
    assert.ok(output.nodes.some((node) => /Reduced forward cardiac output/i.test(node.title)));
    assert.ok(output.nodes.some((node) => /Potassium/i.test(node.title) && node.priority === "critical"));
    assert.ok(output.relationships.length >= 10);
    assert.ok(output.relationships.every((relationship) => relationship.rationale.length >= 25));
  });

  it("includes all six NCJMM domains", () => {
    const output = generateClinicalAssignment(HEART_FAILURE_INPUT, "concept-map");
    const ncjmmLabels = output.sections.find((section) => section.id === "ncjmm")?.items.map((item) => item.label) ?? [];

    assert.deepEqual(ncjmmLabels, [
      "Recognize Cues",
      "Analyze Cues",
      "Prioritize Hypotheses",
      "Generate Solutions",
      "Take Action",
      "Evaluate Outcomes",
    ]);
  });

  it("adapts scope language for RPN/LPN and NP learners", () => {
    const pnOutput = generateClinicalAssignment({ ...HEART_FAILURE_INPUT, role: "rpn-lpn" }, "clinical-prep");
    const npOutput = generateClinicalAssignment({ ...HEART_FAILURE_INPUT, role: "np" }, "clinical-prep");

    assert.match(pnOutput.reasoningSummary, /recognition, monitoring, safe medication administration, reporting, and escalation/i);
    assert.doesNotMatch(pnOutput.reasoningSummary, /prescribing considerations/i);
    assert.match(npOutput.reasoningSummary, /advanced diagnostics, differential diagnosis, prescribing considerations/i);
  });

  it("generates medication cards with expected effect, adverse effects, and monitoring", () => {
    const output = generateClinicalAssignment(HEART_FAILURE_INPUT, "medication-card");
    const medicationSection = output.sections.find((section) => section.id === "medications");

    assert.ok(medicationSection);
    assert.ok(medicationSection.items.some((item) => /Furosemide/i.test(item.label)));
    assert.ok(medicationSection.items.some((item) => /Monitor/i.test(item.rationale ?? "")));
    assert.ok(medicationSection.items.some((item) => /side effects/i.test(item.rationale ?? "")));
  });

  it("creates printable copy with section rationales and concept relationships", () => {
    const output = generateClinicalAssignment(HEART_FAILURE_INPUT, "sbar");
    const copy = formatClinicalAssignmentForCopy(output);

    assert.match(copy, /SBAR Builder/);
    assert.match(copy, /Clinical Reasoning/);
    assert.match(copy, /Concept Relationships/);
    assert.match(copy, /Rationale:/);
  });

  it("includes learner challenge prompts and answer key", () => {
    const output = generateClinicalAssignment(HEART_FAILURE_INPUT, "concept-map");

    assert.ok(output.learnerChallenge.prompts.length >= 4);
    assert.ok(output.learnerChallenge.answerKey.length >= 4);
    assert.ok(output.learnerChallenge.scoringGuide.some((item) => /2 points/i.test(item)));
  });
});
