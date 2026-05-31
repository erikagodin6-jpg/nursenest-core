import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { HIGH_RISK_REASONING_TOPICS, auditClinicalConsequenceModel } from "./clinical-consequence-model";
import {
  CLINICAL_JUDGMENT_SCORING_DOMAINS,
  auditClinicalJudgmentScoring,
  computeClinicalJudgmentScore,
} from "./clinical-judgment-scoring";
import {
  CLINICAL_REASONING_ACTIVITY_STANDARDS,
  CLINICAL_REASONING_AUDIENCE_ADAPTATIONS,
  CLINICAL_REASONING_STEPS,
  auditClinicalReasoningFramework,
} from "./clinical-reasoning-framework";
import { auditExpertThinkingLibrary, expertThinkingProfile } from "./expert-thinking-library";
import { LEARNING_SCIENCE_PRINCIPLES, auditLearningScienceIntegration } from "./learning-science-integration";
import { PRIORITIZATION_STRATEGIES, auditPrioritizationFramework } from "./prioritization-framework";

describe("master clinical reasoning framework", () => {
  it("defines the full recognize-to-reflect reasoning loop for every learning surface", () => {
    assert.deepEqual(auditClinicalReasoningFramework(), []);
    assert.deepEqual(
      CLINICAL_REASONING_STEPS.map((step) => step.key),
      ["recognize", "interpret", "prioritize", "act", "evaluate", "reflect"],
    );
    assert.deepEqual(
      CLINICAL_REASONING_AUDIENCE_ADAPTATIONS.map((item) => item.audience),
      ["RN", "RPN", "NP", "Allied Health", "Pre-Nursing", "Admissions"],
    );

    for (const standard of CLINICAL_REASONING_ACTIVITY_STANDARDS) {
      assert.equal(standard.mustTeachConsequence, true);
      if (standard.kind !== "flashcard") assert.equal(standard.mustTeachEscalation, true);
    }
  });

  it("covers prioritization strategies that nurses use for first-action and next-action decisions", () => {
    assert.deepEqual(auditPrioritizationFramework(), []);
    assert.deepEqual(
      PRIORITIZATION_STRATEGIES.map((strategy) => strategy.key),
      ["abcs", "urgency", "risk", "safety", "expected_vs_unexpected", "acute_vs_chronic", "stable_vs_unstable"],
    );
  });

  it("requires high-risk topics to teach consequence chains and expert pattern recognition", () => {
    assert.deepEqual(auditClinicalConsequenceModel(), []);
    assert.deepEqual(auditExpertThinkingLibrary(), []);
    assert.equal(HIGH_RISK_REASONING_TOPICS.length, 12);

    for (const topic of HIGH_RISK_REASONING_TOPICS) {
      const profile = expertThinkingProfile(topic);
      assert.ok(profile.patternRecognition.length > 40);
      assert.ok(profile.redFlags.length >= 3);
      assert.ok(profile.commonLearnerMistakes.length >= 2);
    }
  });

  it("tracks clinical judgment as report-card-ready domains", () => {
    assert.deepEqual(auditClinicalJudgmentScoring(), []);
    assert.deepEqual(
      CLINICAL_JUDGMENT_SCORING_DOMAINS.map((domain) => domain.key),
      ["recognition", "interpretation", "prioritization", "decision_making", "escalation", "safety", "evaluation"],
    );
    const result = computeClinicalJudgmentScore({
      recognition: 90,
      interpretation: 88,
      prioritization: 86,
      decision_making: 87,
      escalation: 86,
      safety: 92,
      evaluation: 85,
    });
    assert.equal(result.readyForExamLevelPractice, true);
    assert.deepEqual(result.weakDomains, []);
  });

  it("anchors reasoning loops in durable learning science rather than passive exposure", () => {
    assert.deepEqual(auditLearningScienceIntegration(), []);
    assert.deepEqual(
      LEARNING_SCIENCE_PRINCIPLES.map((principle) => principle.key),
      [
        "spaced_repetition",
        "retrieval_practice",
        "interleaving",
        "adaptive_review",
        "error_correction",
        "metacognition",
        "long_term_retention",
      ],
    );
  });
});
