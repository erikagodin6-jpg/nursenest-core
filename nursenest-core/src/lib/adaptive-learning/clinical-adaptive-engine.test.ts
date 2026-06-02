import assert from "node:assert/strict";
import test from "node:test";

import {
  buildAdaptiveNextStep,
  buildRemediationPlan,
  classifyConfidenceCalibration,
  computeAdaptiveReviewIntervalDays,
  computeReadinessScore,
  rankAdaptiveQuestionCandidates,
  readinessBand,
  recommendDifficultyLevel,
  safetyRiskForAttempt,
  shouldTriggerSafetyOverride,
  type AdaptiveAttemptSignal,
  type AdaptiveLearnerProfile,
  type AdaptiveQuestionCandidate,
  type AdaptiveQuestionMetadata,
} from "@/lib/adaptive-learning/clinical-adaptive-engine";

const nowMs = Date.UTC(2026, 4, 27, 12, 0, 0);

const respiratorySafetyMeta: AdaptiveQuestionMetadata = {
  profession: "RN",
  specialty: "Medical-Surgical",
  topic: "respiratory-prioritization",
  subtopic: "deterioration",
  difficulty: 4,
  cognitiveLoad: 4,
  safetyCritical: true,
  prioritizationLevel: 5,
  delegationComplexity: 2,
  diagnosticComplexity: 2,
  pharmacologyComplexity: 1,
  caseBased: true,
  misconceptionTags: ["delayed-escalation", "oxygenation-cue-miss"],
  examBlueprintCategory: "Safe and Effective Care Environment",
};

const stableTeachingMeta: AdaptiveQuestionMetadata = {
  profession: "RN",
  specialty: "Fundamentals",
  topic: "patient-education",
  subtopic: "routine-teaching",
  difficulty: 2,
  cognitiveLoad: 2,
  safetyCritical: false,
  prioritizationLevel: 1,
  delegationComplexity: 1,
  diagnosticComplexity: 1,
  pharmacologyComplexity: 1,
  caseBased: false,
  misconceptionTags: ["recall-gap"],
  examBlueprintCategory: "Health Promotion and Maintenance",
};

function attempt(overrides: Partial<AdaptiveAttemptSignal> = {}): AdaptiveAttemptSignal {
  return {
    questionId: "q-resp-1",
    topicId: "respiratory-prioritization",
    metadata: respiratorySafetyMeta,
    correct: false,
    confidence: "very_confident",
    timeToAnswerMs: 45000,
    hintsUsed: 0,
    rationaleOpened: true,
    answerChanges: 0,
    unsafeDecision: true,
    misconceptionTags: ["delayed-escalation"],
    ...overrides,
  };
}

const profile: AdaptiveLearnerProfile = {
  userId: "learner-1",
  profession: "RN",
  tier: "RN",
  overallLevel: 4,
  readinessScore: 0,
  confidenceScore: 72,
  safetyScore: 66,
  remediationQueue: ["respiratory-prioritization"],
  topicMastery: [
    {
      topicId: "respiratory-prioritization",
      masteryLevel: 0.36,
      confidenceLevel: 0.42,
      lastReviewedMs: nowMs - 4 * 86400000,
      repetitionIntervalDays: 3,
      incorrectPatterns: ["delayed-escalation"],
      safetyRisk: 82,
    },
    {
      topicId: "patient-education",
      masteryLevel: 0.86,
      confidenceLevel: 0.8,
      lastReviewedMs: nowMs - 86400000,
      repetitionIntervalDays: 7,
      incorrectPatterns: [],
      safetyRisk: 12,
    },
  ],
};

test("classifies confidence calibration into adaptive teaching signals", () => {
  assert.equal(
    classifyConfidenceCalibration({ correct: false, confidence: "very_confident" }),
    "dangerous_misconception",
  );
  assert.equal(classifyConfidenceCalibration({ correct: true, confidence: "guessing" }), "weak_retention");
  assert.equal(classifyConfidenceCalibration({ correct: true, confidence: "somewhat_confident" }), "mastery");
  assert.equal(classifyConfidenceCalibration({ correct: false, confidence: "unsure" }), "learning_gap");
});

test("flags unsafe high-confidence misses as safety overrides", () => {
  const unsafeMiss = attempt();
  assert.ok(safetyRiskForAttempt(unsafeMiss) >= 70);
  assert.equal(shouldTriggerSafetyOverride([unsafeMiss]), true);
});

test("spaced repetition prioritizes critical safety misses in the same session", () => {
  assert.equal(
    computeAdaptiveReviewIntervalDays({
      correct: false,
      confidence: "very_confident",
      difficulty: 5,
      safetyCritical: true,
      safetyRisk: 92,
    }),
    0,
  );
  assert.equal(
    computeAdaptiveReviewIntervalDays({
      correct: true,
      confidence: "very_confident",
      difficulty: 3,
      safetyCritical: false,
      safetyRisk: 0,
    }),
    21,
  );
});

test("difficulty increases gradually for accurate confident learners", () => {
  const recent = Array.from({ length: 5 }, (_, index) =>
    attempt({
      questionId: `q-good-${index}`,
      correct: true,
      confidence: "very_confident",
      hintsUsed: 0,
      unsafeDecision: false,
      metadata: { ...respiratorySafetyMeta, safetyCritical: false },
    }),
  );
  assert.equal(recommendDifficultyLevel({ currentLevel: 4, recentAttempts: recent }), 5);
});

test("difficulty decreases when safety or repeated struggle appears", () => {
  const recent = [
    attempt({ questionId: "q1", unsafeDecision: true }),
    attempt({ questionId: "q2", unsafeDecision: false, hintsUsed: 3 }),
    attempt({ questionId: "q3", unsafeDecision: false, hintsUsed: 2, confidence: "guessing" }),
  ];
  assert.equal(recommendDifficultyLevel({ currentLevel: 4, recentAttempts: recent }), 3);
});

test("readiness score blends mastery, confidence, and safety into the expected band", () => {
  const score = computeReadinessScore(profile);
  assert.equal(score, 65);
  assert.equal(readinessBand(score), "developing_competency");
});

test("remediation plan is mandatory for safety-critical misconception patterns", () => {
  const plan = buildRemediationPlan({ profile, recentAttempts: [attempt()] });
  assert.equal(plan.mandatory, true);
  assert.equal(plan.reason, "safety_critical");
  assert.ok(plan.components.includes("micro_case_study"));
  assert.ok(plan.components.includes("misconception_correction"));
});

test("adaptive candidate ranking prioritizes safety weaknesses and due retention", () => {
  const candidates: AdaptiveQuestionCandidate[] = [
    { id: "stable-teaching", metadata: stableTeachingMeta },
    { id: "respiratory-safety", metadata: respiratorySafetyMeta },
    { id: "recent-repeat", metadata: respiratorySafetyMeta, recentlySeen: true },
  ];

  const ranked = rankAdaptiveQuestionCandidates({ profile, candidates, nowMs });
  assert.equal(ranked[0]?.id, "respiratory-safety");
  assert.ok(ranked[0]?.priorityReasons.includes("safety_weakness"));
  assert.ok(ranked[0]?.priorityReasons.includes("low_retention_due"));
  assert.ok(
    ranked.findIndex((candidate) => candidate.id === "recent-repeat") >
      ranked.findIndex((candidate) => candidate.id === "respiratory-safety"),
  );
});

test("buildAdaptiveNextStep combines safety override, remediation, readiness, and review interval", () => {
  const next = buildAdaptiveNextStep({ profile, recentAttempts: [attempt()] });
  assert.equal(next.safetyOverride, true);
  assert.equal(next.difficulty, 3);
  assert.equal(next.flashcardReviewIntervalDays, 0);
  assert.equal(next.remediation.mandatory, true);
  assert.equal(next.readinessBand, "developing_competency");
});
