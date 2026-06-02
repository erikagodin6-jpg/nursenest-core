import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CLINICAL_INTUITION_GENERATION_GUIDANCE,
  clinicalIntuitionRiskForAttempt,
  clinicalIntuitionSignalForCandidate,
  resolveClinicalIntuitionProfile,
} from "@/lib/adaptive-learning/clinical-intuition-training";
import { rankAdaptiveQuestionCandidates, type AdaptiveQuestionMetadata } from "@/lib/adaptive-learning/clinical-adaptive-engine";

const baseMetadata: AdaptiveQuestionMetadata = {
  profession: "RN",
  specialty: "med-surg",
  topic: "fundamentals",
  difficulty: 2,
  cognitiveLoad: 2,
  safetyCritical: false,
  prioritizationLevel: 2,
  delegationComplexity: 1,
  diagnosticComplexity: 1,
  pharmacologyComplexity: 1,
  caseBased: false,
  misconceptionTags: [],
  examBlueprintCategory: "safe-effective-care",
};

describe("clinical intuition training", () => {
  it("recognizes subtle deterioration cue clusters", () => {
    const profile = resolveClinicalIntuitionProfile({
      text: "Early sepsis: new confusion, tachycardia, warm skin, low urine output, and worsening blood pressure trend.",
      safetyCritical: true,
      prioritizationLevel: 4,
    });

    assert.ok(profile.domains.includes("early_sepsis"));
    assert.ok(profile.domains.includes("unstable_vital_trend"));
    assert.ok(profile.skills.includes("trend_detection"));
    assert.equal(profile.escalationUrgency, "escalate_now");
  });

  it("adds ranking weight to questions that train nurse intuition", () => {
    const candidates = rankAdaptiveQuestionCandidates({
      nowMs: Date.now(),
      profile: {
        userId: "u1",
        profession: "RN",
        tier: "RN",
        overallLevel: 2,
        readinessScore: 60,
        confidenceScore: 50,
        safetyScore: 70,
        topicMastery: [],
        remediationQueue: [],
      },
      candidates: [
        {
          id: "routine",
          metadata: { ...baseMetadata, topic: "routine mobility", misconceptionTags: ["ambulation"] },
        },
        {
          id: "intuition",
          metadata: {
            ...baseMetadata,
            topic: "silent hypoxia and subtle respiratory decline",
            safetyCritical: true,
            prioritizationLevel: 4,
            misconceptionTags: ["new confusion", "restless", "SpO2 dropping from 94% to 88%", "escalation timing"],
          },
        },
      ],
    });

    assert.equal(candidates[0]?.id, "intuition");
    assert.ok(candidates[0]?.priorityReasons.includes("deterioration_domain_match"));
  });

  it("raises safety risk when a learner misses an escalation cue with high confidence", () => {
    const risk = clinicalIntuitionRiskForAttempt({
      questionId: "q1",
      topicId: "respiratory",
      metadata: {
        ...baseMetadata,
        topic: "subtle respiratory decline",
        safetyCritical: true,
        prioritizationLevel: 5,
        misconceptionTags: ["silent hypoxia", "restless", "oxygen saturation dropping", "escalate"],
      },
      correct: false,
      confidence: "very_confident",
      timeToAnswerMs: 100000,
      hintsUsed: 0,
      rationaleOpened: false,
      answerChanges: 2,
      unsafeDecision: true,
    });

    assert.ok(risk >= 30);
  });

  it("produces learner-facing training reasons without creating a new UI system", () => {
    const signal = clinicalIntuitionSignalForCandidate({
      id: "q2",
      metadata: {
        ...baseMetadata,
        topic: "worsening neuro status",
        misconceptionTags: ["new slurred speech", "facial droop", "notify provider", "priority"],
      },
    });

    assert.ok(signal.trainingScore > 0);
    assert.ok(signal.reasons.length > 0);
  });

  it("honors explicit clinical intuition metadata when text is sparse", () => {
    const signal = clinicalIntuitionSignalForCandidate({
      id: "q3",
      metadata: {
        ...baseMetadata,
        topic: "assessment",
        clinicalIntuitionDomains: ["hidden_safety_risk"],
        clinicalIntuitionSkills: ["risk_anticipation", "escalation_timing"],
      },
    });

    assert.ok(signal.profile.domains.includes("hidden_safety_risk"));
    assert.ok(signal.profile.skills.includes("risk_anticipation"));
    assert.ok(signal.trainingScore > 0);
  });

  it("keeps generation guidance focused on subtle cues and novice-safe escalation", () => {
    assert.match(CLINICAL_INTUITION_GENERATION_GUIDANCE, /subtle cue clusters/i);
    assert.match(CLINICAL_INTUITION_GENERATION_GUIDANCE, /silent hypoxia/i);
    assert.match(CLINICAL_INTUITION_GENERATION_GUIDANCE, /timely escalation/i);
    assert.match(CLINICAL_INTUITION_GENERATION_GUIDANCE, /Avoid ICU-only management/i);
  });
});
