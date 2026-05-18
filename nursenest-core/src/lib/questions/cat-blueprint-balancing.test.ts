import test from "node:test";
import assert from "node:assert/strict";

import { balanceCatBlueprintDiversity } from "./cat-blueprint-balancing";

test("new body system and topic receive diversity boost", () => {
  const result = balanceCatBlueprintDiversity({
    baseWeight: 0.9,
    topic: "cardiology",
    bodySystem: "cardiovascular",
    cognitiveLevel: "application",
    sessionSeenTopics: ["respiratory", "endocrine"],
    sessionSeenBodySystems: ["respiratory"],
    sessionSeenCognitiveLevels: ["analysis"],
  });

  assert.ok(result.diversityBoost > 0);
  assert.ok(result.adjustedWeight >= 0.9);
});

test("repeated topic/body system receive penalties", () => {
  const result = balanceCatBlueprintDiversity({
    baseWeight: 1,
    topic: "cardiology",
    bodySystem: "cardiovascular",
    cognitiveLevel: "application",
    sessionSeenTopics: ["cardiology", "cardiology", "cardiology"],
    sessionSeenBodySystems: [
      "cardiovascular",
      "cardiovascular",
      "cardiovascular",
      "cardiovascular",
    ],
    sessionSeenCognitiveLevels: ["application", "application", "application", "application"],
  });

  assert.ok(result.repetitionPenalty > 0);
  assert.ok(result.adjustedWeight < 1);
});

test("blueprint imbalance correction boosts needed domain", () => {
  const result = balanceCatBlueprintDiversity({
    baseWeight: 0.8,
    bodySystem: "neurology",
    cognitiveLevel: "analysis",
    targetBodySystemDistribution: {
      neurology: 0.2,
    },
    currentBodySystemDistribution: {
      neurology: 0.05,
    },
    targetCognitiveDistribution: {
      analysis: 0.35,
    },
    currentCognitiveDistribution: {
      analysis: 0.12,
    },
  });

  assert.ok(result.diversityBoost > 0);
  assert.ok(result.adjustedWeight > 0.8);
});

test("already seen question receives major penalty", () => {
  const result = balanceCatBlueprintDiversity({
    questionId: "q123",
    baseWeight: 1,
    sessionSeenQuestionIds: ["q123"],
  });

  assert.ok(result.repetitionPenalty >= 0.7);
  assert.equal(result.recommended, false);
});
