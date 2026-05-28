import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { detectAdaptiveAntiAnxietySupport } from "@/lib/adaptive-learning/anti-anxiety-study-support";
import {
  buildAdaptiveNextStep,
  recommendDifficultyLevel,
  type AdaptiveAttemptSignal,
  type AdaptiveLearnerProfile,
  type AdaptiveQuestionMetadata,
} from "@/lib/adaptive-learning/clinical-adaptive-engine";

const metadata: AdaptiveQuestionMetadata = {
  profession: "RN",
  specialty: "Fundamentals",
  topic: "safety",
  difficulty: 3,
  cognitiveLoad: 2,
  safetyCritical: false,
  prioritizationLevel: 2,
  delegationComplexity: 1,
  diagnosticComplexity: 1,
  pharmacologyComplexity: 1,
  caseBased: false,
  misconceptionTags: [],
  examBlueprintCategory: "Safe and Effective Care Environment",
};

function attempt(overrides: Partial<AdaptiveAttemptSignal> = {}): AdaptiveAttemptSignal {
  return {
    questionId: "q1",
    topicId: "safety",
    metadata,
    correct: true,
    confidence: "somewhat_confident",
    timeToAnswerMs: 45000,
    hintsUsed: 0,
    rationaleOpened: true,
    answerChanges: 0,
    unsafeDecision: false,
    ...overrides,
  };
}

const profile: AdaptiveLearnerProfile = {
  userId: "u1",
  profession: "RN",
  tier: "RN",
  overallLevel: 4,
  readinessScore: 0,
  confidenceScore: 55,
  safetyScore: 75,
  topicMastery: [],
  remediationQueue: [],
};

describe("adaptive anti-anxiety study support", () => {
  it("detects rapid guessing and confidence collapse", () => {
    const attempts = [
      attempt({ questionId: "q1", confidence: "somewhat_confident", correct: true }),
      attempt({ questionId: "q2", confidence: "somewhat_confident", correct: true }),
      attempt({ questionId: "q3", confidence: "guessing", correct: false, timeToAnswerMs: 9000 }),
      attempt({ questionId: "q4", confidence: "guessing", correct: false, timeToAnswerMs: 11000 }),
      attempt({ questionId: "q5", confidence: "guessing", correct: false, timeToAnswerMs: 12000 }),
    ];

    const support = detectAdaptiveAntiAnxietySupport(attempts);
    assert.equal(support.active, true);
    assert.ok(support.patterns.includes("rapid_guessing"));
    assert.ok(support.patterns.includes("confidence_collapse"));
    assert.equal(support.overloadReduction, "moderate");
  });

  it("detects fatigue decline and repeated second-guessing", () => {
    const attempts = [
      attempt({ questionId: "q1", correct: true }),
      attempt({ questionId: "q2", correct: true }),
      attempt({ questionId: "q3", correct: true }),
      attempt({ questionId: "q4", correct: false, hintsUsed: 2, answerChanges: 2 }),
      attempt({ questionId: "q5", correct: false, hintsUsed: 3, answerChanges: 2 }),
      attempt({ questionId: "q6", correct: false, hintsUsed: 2, answerChanges: 3 }),
    ];

    const support = detectAdaptiveAntiAnxietySupport(attempts);
    assert.ok(support.patterns.includes("fatigue_decline"));
    assert.ok(support.patterns.includes("repeated_second_guessing"));
    assert.equal(support.challengeBalance, "stabilize_with_wins");
  });

  it("temporarily reduces difficulty when panic patterns appear", () => {
    const attempts = Array.from({ length: 5 }, (_, index) =>
      attempt({
        questionId: `q${index}`,
        correct: false,
        confidence: "guessing",
        timeToAnswerMs: 10000,
        answerChanges: 2,
      }),
    );

    assert.equal(recommendDifficultyLevel({ currentLevel: 4, recentAttempts: attempts }), 3);
  });

  it("carries support recommendations into the adaptive next step", () => {
    const next = buildAdaptiveNextStep({
      profile,
      recentAttempts: [
        attempt({ questionId: "q1", correct: true }),
        attempt({ questionId: "q2", correct: true }),
        attempt({ questionId: "q3", correct: false, confidence: "guessing", timeToAnswerMs: 8000 }),
        attempt({ questionId: "q4", correct: false, confidence: "guessing", timeToAnswerMs: 9000 }),
      ],
    });

    assert.equal(next.antiAnxietySupport.active, true);
    assert.ok(next.antiAnxietySupport.recommendedSessionLength <= 10);
    assert.match(next.antiAnxietySupport.confidenceReinforcement, /confidence|winnable|reasoning/i);
  });
});
