import test from "node:test";
import assert from "node:assert/strict";

import {
  calculateCatCandidateSelectionScore,
  rankCatCandidates,
} from "./cat-candidate-selection-score";

test("high-quality balanced item remains eligible with strong selection score", () => {
  const result = calculateCatCandidateSelectionScore({
    id: "q1",
    status: "published",
    isAdaptiveEligible: true,
    stem:
      "A client with heart failure develops worsening crackles and oxygen saturation of 84%. Which intervention should the nurse perform first?",
    options: [
      "Position the client upright and administer oxygen as prescribed",
      "Encourage increased oral fluids",
      "Place the client flat in bed",
      "Delay assessment until the provider arrives",
    ],
    correctAnswer: "Position the client upright and administer oxygen as prescribed",
    rationale:
      "The client demonstrates acute respiratory compromise from pulmonary edema, requiring immediate positioning and oxygen support.",
    clinicalReasoning:
      "Airway and breathing stabilization are the immediate priority.",
    examStrategy: "Prioritize ABCs and acute instability.",
    topic: "heart failure",
    bodySystem: "cardiovascular",
    cognitiveLevel: "application",
    difficulty: 0.64,
    qualityScore: 94,
    exposure: {
      totalExposures: 120,
      recentExposures7d: 8,
      recentExposures30d: 32,
      discriminationIndex: 0.42,
      incorrectRate: 0.51,
    },
    blueprint: {
      sessionSeenTopics: ["respiratory"],
      sessionSeenBodySystems: ["respiratory"],
      targetBodySystemDistribution: {
        cardiovascular: 0.25,
      },
      currentBodySystemDistribution: {
        cardiovascular: 0.12,
      },
    },
  });

  assert.equal(result.eligible, true);
  assert.ok(result.selectionScore >= 0.75);
});

test("excluded quality item becomes ineligible", () => {
  const result = calculateCatCandidateSelectionScore({
    id: "bad1",
    status: "draft",
    isAdaptiveEligible: false,
    stem: "Which finding is most concerning?",
    options: ["Yes", "No"],
    correctAnswer: null,
    rationale: "Because it is concerning.",
  });

  assert.equal(result.eligible, false);
  assert.equal(result.selectionScore, 0);
  assert.ok(result.suppressionReasons.length > 0);
});

test("ranking places strongest candidate first", () => {
  const ranked = rankCatCandidates([
    {
      id: "weak",
      status: "published",
      isAdaptiveEligible: true,
      stem: "Which intervention should the nurse perform first?",
      options: ["Yes", "No"],
      correctAnswer: "Yes",
      rationale: "Because yes.",
    },
    {
      id: "strong",
      status: "published",
      isAdaptiveEligible: true,
      stem:
        "A client with sepsis develops hypotension and altered mental status. Which intervention is the priority?",
      options: [
        "Initiate rapid assessment and prescribed resuscitation measures",
        "Delay reassessment for 4 hours",
        "Restrict monitoring",
        "Encourage sleep before intervention",
      ],
      correctAnswer: "Initiate rapid assessment and prescribed resuscitation measures",
      rationale:
        "Sepsis with hypotension and altered mentation suggests shock requiring urgent reassessment and intervention.",
      clinicalReasoning:
        "Shock recognition and early stabilization reduce mortality.",
      topic: "sepsis",
      bodySystem: "multisystem",
      cognitiveLevel: "analysis",
      difficulty: 0.71,
      qualityScore: 96,
      exposure: {
        totalExposures: 60,
        discriminationIndex: 0.48,
        incorrectRate: 0.57,
      },
    },
  ]);

  assert.equal(ranked[0].id, "strong");
  assert.ok(ranked[0].selection.selectionScore > ranked[1].selection.selectionScore);
});
