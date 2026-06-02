import test from "node:test";
import assert from "node:assert/strict";

import {
  evaluateEngagementRetentionSystem,
  resolveEngagementRetentionStandard,
  type EngagementRetentionMechanic,
} from "./engagement-retention-standards";

const COMPLETE_MECHANICS: readonly EngagementRetentionMechanic[] = [
  "streaks",
  "mastery-tracking",
  "weak-topic-targeting",
  "spaced-repetition",
  "adaptive-flashcards",
  "remediation-loops",
  "confidence-scoring",
  "exam-readiness-indicators",
  "performance-analytics",
];

test("resolves professional engagement standards for every tier", () => {
  assert.ok(resolveEngagementRetentionStandard("RN").purpose.includes("NCLEX-RN"));
  assert.ok(resolveEngagementRetentionStandard("RPN").safetyGuardrails.some((rule) => rule.includes("reportable")));
  assert.ok(resolveEngagementRetentionStandard("NP").purpose.includes("diagnostic"));
  assert.ok(resolveEngagementRetentionStandard("ALLIED").purpose.includes("workflow"));
});

test("passes a complete clinically meaningful retention system", () => {
  const result = evaluateEngagementRetentionSystem({
    tier: "RN",
    enabledMechanics: COMPLETE_MECHANICS,
    copy:
      "Keep your streak by completing one focused weak-topic review. Today's plan improves retention, confidence calibration, and readiness without rushing clinical judgment.",
    rewardsConsistency: true,
    targetsWeakAreas: true,
    includesRemediationLoop: true,
    includesConfidenceCalibration: true,
    includesReadinessContext: true,
  });

  assert.equal(result.pass, true);
  assert.equal(result.issues.length, 0);
});

test("rejects engagement that omits weak-topic remediation", () => {
  const result = evaluateEngagementRetentionSystem({
    tier: "RN",
    enabledMechanics: ["streaks", "mastery-tracking", "performance-analytics"],
    copy: "Complete anything today to keep momentum.",
    rewardsConsistency: true,
    targetsWeakAreas: false,
    includesRemediationLoop: false,
    includesConfidenceCalibration: false,
    includesReadinessContext: false,
  });

  assert.ok(result.issues.some((issue) => issue.code === "NO_WEAK_TOPIC_TARGETING"));
  assert.ok(result.issues.some((issue) => issue.code === "NO_REMEDIATION_LOOP"));
  assert.ok(result.issues.some((issue) => issue.code === "MISSING_CORE_MECHANIC"));
  assert.equal(result.pass, false);
});

test("flags game language that trivializes clinical safety", () => {
  const result = evaluateEngagementRetentionSystem({
    tier: "RPN",
    enabledMechanics: COMPLETE_MECHANICS,
    copy: "Crush the med error boss battle and unlock loot after this safety miss.",
    rewardsConsistency: true,
    targetsWeakAreas: true,
    includesRemediationLoop: true,
    includesConfidenceCalibration: true,
    includesReadinessContext: true,
    trivializesSafety: true,
  });

  assert.ok(result.issues.some((issue) => issue.code === "TRIVIALIZES_PATIENT_SAFETY"));
  assert.ok(result.issues.some((issue) => issue.code === "UNPROFESSIONAL_GAME_LANGUAGE"));
  assert.equal(result.pass, false);
});

test("flags reward systems that interrupt remediation flow", () => {
  const result = evaluateEngagementRetentionSystem({
    tier: "ALLIED",
    enabledMechanics: COMPLETE_MECHANICS,
    copy: "You earned a consistency milestone for completing the workflow-safety review.",
    rewardsConsistency: true,
    targetsWeakAreas: true,
    includesRemediationLoop: true,
    includesConfidenceCalibration: true,
    includesReadinessContext: true,
    blocksStudyProgressForRewards: true,
  });

  assert.ok(result.issues.some((issue) => issue.code === "REWARD_BLOCKS_LEARNING_FLOW"));
  assert.equal(result.pass, false);
});

test("confidence and readiness gaps are warnings when remediation still exists", () => {
  const result = evaluateEngagementRetentionSystem({
    tier: "NP",
    enabledMechanics: [
      "streaks",
      "mastery-tracking",
      "weak-topic-targeting",
      "spaced-repetition",
      "adaptive-flashcards",
      "remediation-loops",
      "confidence-scoring",
      "exam-readiness-indicators",
      "performance-analytics",
    ],
    copy: "Review your weakest differential diagnosis topic and repeat missed medication-safety cards.",
    rewardsConsistency: true,
    targetsWeakAreas: true,
    includesRemediationLoop: true,
    includesConfidenceCalibration: false,
    includesReadinessContext: false,
  });

  assert.ok(result.issues.some((issue) => issue.code === "NO_CONFIDENCE_CALIBRATION"));
  assert.ok(result.issues.some((issue) => issue.code === "NO_READINESS_CONTEXT"));
  assert.equal(result.issues.every((issue) => issue.severity === "warning"), true);
});
