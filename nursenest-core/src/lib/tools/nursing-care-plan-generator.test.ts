import assert from "node:assert/strict";
import test from "node:test";
import { generateNursingCarePlan, type NursingCarePlanInput } from "@/lib/tools/nursing-care-plan-generator";

const respiratoryInput: NursingCarePlanInput = {
  role: "rn",
  demographics: {
    age: "68",
    sex: "Female",
    weight: "74 kg",
    medicalDiagnosis: "Community-acquired pneumonia",
    surgicalDiagnosis: "",
    comorbidities: "COPD, type 2 diabetes",
  },
  clinicalData: {
    vitalSigns: "T 38.4 C, HR 112, RR 26, BP 104/62, SpO2 89% on room air",
    laboratoryValues: "WBC 16.2, lactate 2.4, glucose 14.8 mmol/L",
    assessmentFindings: "Coarse crackles, productive cough, increased work of breathing, dry mucous membranes",
    symptoms: "Shortness of breath, fever, fatigue, pleuritic chest discomfort",
    currentMedications: "Metformin, tiotropium, salbutamol inhaler PRN",
    allergies: "No known drug allergies",
  },
  careSetting: "medical-surgical",
  priorityLevel: "high-acuity",
  examPrepMode: true,
  learningMode: true,
};

test("care plan generator creates supported diagnoses with required intervention depth", () => {
  const plan = generateNursingCarePlan(respiratoryInput);

  assert.ok(plan.diagnoses.length >= 3);
  assert.ok(plan.diagnoses.length <= 5);
  assert.equal(plan.diagnoses[0].problem, "Impaired Gas Exchange");

  for (const diagnosis of plan.diagnoses) {
    assert.ok(diagnosis.relatedTo.length > 20);
    assert.ok(diagnosis.asEvidencedBy.includes("SpO2") || diagnosis.asEvidencedBy.length > 30);
    assert.ok(diagnosis.shortTermGoals.every((goal) => /\bwithin\b|during|before/i.test(goal)));
    assert.ok(diagnosis.independentInterventions.length >= 5);
    assert.ok(diagnosis.collaborativeInterventions.length >= 3);

    for (const intervention of [...diagnosis.independentInterventions, ...diagnosis.collaborativeInterventions]) {
      assert.ok(intervention.action.length > 20);
      assert.ok(intervention.rationale.length > 40);
    }
  }
});

test("care plan generator includes clinical reasoning, complication watch, and SBAR", () => {
  const plan = generateNursingCarePlan(respiratoryInput);

  assert.match(plan.clinicalReasoning.priorityFramework, /ABCs/i);
  assert.match(plan.clinicalReasoning.abcReasoning, /breathing|oxygenation|circulation/i);
  assert.ok(plan.complicationWatch.some((item) => /work of breathing|oxygen/i.test(item.warningSign)));
  assert.match(plan.sbar.situation, /pneumonia/i);
  assert.match(plan.sbar.assessment, /Impaired Gas Exchange/i);
});

test("care plan generator adds optional exam prep and learning sections", () => {
  const plan = generateNursingCarePlan(respiratoryInput);

  assert.ok(plan.examPrep);
  assert.ok(plan.examPrep.clinicalPearls.length >= 3);
  assert.ok(plan.examPrep.delegationConsiderations.some((item) => /RNs|RPN\/LPN/i.test(item)));
  assert.ok(plan.learning);
  assert.ok(plan.learning.redFlags.length >= 3);
  assert.match(plan.learning.pathophysiologySummary, /pneumonia/i);
});

test("care plan generator reflects RPN/LPN scope language for collaborative interventions", () => {
  const plan = generateNursingCarePlan({
    ...respiratoryInput,
    role: "rpn-lpn",
    priorityLevel: "moderate-acuity",
  });

  assert.ok(
    plan.diagnoses.some((diagnosis) =>
      diagnosis.collaborativeInterventions.some((intervention) => /RPN\/LPN scope/i.test(intervention.action)),
    ),
  );
});
