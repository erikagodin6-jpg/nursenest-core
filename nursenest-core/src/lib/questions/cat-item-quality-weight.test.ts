import test from "node:test";
import assert from "node:assert/strict";

import { calculateCatItemQualityWeight } from "./cat-item-quality-weight";

test("high-quality clinically sound item becomes flagship/preferred", () => {
  const result = calculateCatItemQualityWeight({
    status: "published",
    isAdaptiveEligible: true,
    isMockExamEligible: true,
    stem:
      "A client with digoxin therapy reports nausea, yellow vision changes, and bradycardia. Which action should the nurse take first?",
    options: [
      "Hold digoxin and assess serum potassium and digoxin level",
      "Administer the next dose with food",
      "Encourage additional oral fluids",
      "Document the expected medication effects",
    ],
    correctAnswer: "Hold digoxin and assess serum potassium and digoxin level",
    rationale:
      "Nausea, visual halos, and bradycardia suggest digoxin toxicity. The nurse should hold the medication and evaluate potassium and serum digoxin levels because hypokalemia increases toxicity risk.",
    clinicalReasoning:
      "The priority is recognizing toxicity and preventing progression to life-threatening dysrhythmias.",
    examStrategy:
      "Prioritize assessment and prevention of medication-related instability.",
    clinicalTrap:
      "Do not assume GI symptoms alone are benign in a client receiving digoxin.",
    distractorRationales: {
      "Administer the next dose with food": "Giving another dose may worsen toxicity.",
    },
    topic: "Cardiac medications",
    bodySystem: "Cardiovascular",
    cognitiveLevel: "Application",
    difficulty: 0.72,
    qualityScore: 94,
  });

  assert.ok(result.qualityWeight >= 0.9);
  assert.ok(result.qualityBand === "preferred" || result.qualityBand === "flagship");
});

test("missing correct answer excludes item", () => {
  const result = calculateCatItemQualityWeight({
    status: "published",
    isAdaptiveEligible: true,
    stem: "Which intervention should the nurse perform first?",
    options: ["Assess airway", "Call provider", "Reassure client", "Document findings"],
    correctAnswer: null,
    rationale: "Airway is priority.",
  });

  assert.equal(result.qualityBand, "exclude");
  assert.ok(result.exclusionReasons.includes("missing-correct-answer"));
});

test("multiple high-risk clinical signals exclude item", () => {
  const result = calculateCatItemQualityWeight({
    status: "published",
    isAdaptiveEligible: true,
    stem:
      "A pregnant client receiving warfarin should always receive routine oxygen for chest pain and 30 mL/kg fluids for sepsis.",
    options: ["Yes", "No", "Sometimes", "Depends"],
    correctAnswer: "Yes",
    rationale: "Always use oxygen in chest pain.",
  });

  assert.equal(result.qualityBand, "exclude");
  assert.ok(result.exclusionReasons.includes("multiple-high-risk-clinical-flags"));
});

test("poor psychometric structure lowers CAT weighting", () => {
  const result = calculateCatItemQualityWeight({
    status: "published",
    isAdaptiveEligible: true,
    stem: "Which finding is most concerning?",
    options: ["Yes", "No"],
    correctAnswer: "Yes",
    rationale: "Because it is concerning.",
  });

  assert.ok(result.qualityWeight < 0.55);
  assert.ok(result.recommendations.some((entry) => entry.includes("Psychometric remediation")));
});
