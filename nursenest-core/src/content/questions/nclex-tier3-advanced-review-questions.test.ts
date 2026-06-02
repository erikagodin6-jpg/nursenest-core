import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NCLEX_TIER3_ADVANCED_REVIEW_METRICS,
  nclexTier3AdvancedReviewQuestions,
  type NclexTier3Domain,
  type NclexTier3QuestionType,
} from "./nclex-tier3-advanced-review-questions";

const REQUIRED_TYPES: readonly NclexTier3QuestionType[] = [
  "advanced-priority",
  "rapid-deterioration",
  "icu-safety",
  "telemetry-basic",
  "titrated-medication-safety",
  "shock-recognition",
  "ventilated-patient-assessment",
  "complex-delegation",
  "ngn-case",
];

const REQUIRED_DOMAINS: readonly NclexTier3Domain[] = [
  "advanced-respiratory",
  "critical-care",
  "advanced-cardiac",
  "shock",
  "sepsis",
  "neurologic",
  "pharmacology",
  "emergency",
  "postoperative",
  "multisystem",
  "delegation",
];

describe("NCLEX Tier 3 advanced review question catalog", () => {
  it("contains an advanced high-acuity review pack", () => {
    assert.equal(NCLEX_TIER3_ADVANCED_REVIEW_METRICS.totalQuestions, 19);

    for (const question of nclexTier3AdvancedReviewQuestions) {
      assert.equal(question.tier, 3);
      assert.deepEqual(question.exam, ["NCLEX-RN"]);
      assert.equal(question.adaptiveMetadata.difficulty, "tier-3-advanced-review");
      assert.ok(question.adaptiveMetadata.cognitiveLoad >= 4 && question.adaptiveMetadata.cognitiveLoad <= 5);
      assert.ok(question.adaptiveMetadata.prioritizationLevel >= 4 && question.adaptiveMetadata.prioritizationLevel <= 5);
      assert.equal(question.adaptiveMetadata.safetyCritical, true);
      assert.equal(question.adaptiveMetadata.specialtyExposure, true);
    }
  });

  it("covers advanced question styles and domains", () => {
    for (const type of REQUIRED_TYPES) {
      assert.ok(
        (NCLEX_TIER3_ADVANCED_REVIEW_METRICS.byType[type] ?? 0) >= 1,
        `missing Tier 3 question type: ${type}`,
      );
    }

    for (const domain of REQUIRED_DOMAINS) {
      assert.ok(
        (NCLEX_TIER3_ADVANCED_REVIEW_METRICS.byDomain[domain] ?? 0) >= 1,
        `missing Tier 3 domain: ${domain}`,
      );
    }
  });

  it("uses four answer choices with varied correct answers and complete rationale maps", () => {
    const correctAnswers = new Set<string>();

    for (const question of nclexTier3AdvancedReviewQuestions) {
      assert.equal(question.options.length, 4, `${question.id} must have four options`);
      assert.equal(question.options.filter((option) => option.correct).length, 1, `${question.id} must have one correct option`);
      assert.equal(question.options.find((option) => option.correct)?.id, question.correctAnswer);
      correctAnswers.add(question.correctAnswer);

      for (const option of question.options) {
        assert.ok(option.rationale.length >= 50, `${question.id} option ${option.id} rationale is thin`);
        assert.equal(question.rationale.wrongAnswers[option.id], option.rationale);
      }
    }

    assert.ok(correctAnswers.size >= 3, "Tier 3 pack should not use the same answer position for every item");
  });

  it("teaches advanced nursing reasoning, escalation, and safety", () => {
    for (const question of nclexTier3AdvancedReviewQuestions) {
      assert.equal(question.hints.length, 3);
      assert.ok(question.hints.every((hint) => hint.length >= 40), `${question.id} has a thin hint`);
      assert.ok(question.rationale.correct.length >= 120, `${question.id} needs correct rationale depth`);
      assert.ok(question.rationale.advancedNursingReasoning.length >= 100, `${question.id} needs advanced reasoning`);
      assert.ok(question.rationale.escalationLogic.length >= 90, `${question.id} needs escalation logic`);
      assert.ok(question.rationale.safetyPrinciple.length >= 80, `${question.id} needs safety principle`);
      assert.ok(question.teachingPoint.length >= 95, `${question.id} needs teaching depth`);
      assert.ok(question.adaptiveMetadata.misconceptionTags.length >= 3, `${question.id} needs misconception tags`);
    }
  });

  it("allows advanced exposure but blocks provider-only or technical specialty management", () => {
    const requiredAdvancedSignals = [
      /ventilat/i,
      /shock/i,
      /titrated|infusion/i,
      /telemetry|wide-complex|peaked T/i,
      /rapid response|stroke team|provider/i,
    ];

    const allContent = nclexTier3AdvancedReviewQuestions
      .flatMap((question) => [
        question.scenario,
        question.stem,
        question.rationale.correct,
        question.rationale.advancedNursingReasoning,
        question.rationale.escalationLogic,
        question.rationale.safetyPrinciple,
        question.teachingPoint,
        ...question.options.map((option) => option.text),
        ...question.options.map((option) => option.rationale),
      ])
      .join("\n");

    for (const pattern of requiredAdvancedSignals) {
      assert.match(allContent, pattern, `Tier 3 pack should include advanced nursing exposure matching ${pattern}`);
    }

    const forbidden = [
      /calculate tidal volume/i,
      /adjust (the )?ventilator/i,
      /change (the )?ventilator settings/i,
      /set PEEP/i,
      /perform intubation/i,
      /insert (an? )?(arterial line|central line|chest tube)/i,
      /choose antibiotics/i,
      /independently prescribe/i,
      /prescribing decision/i,
      /physician-only/i,
      /intensivist-level management/i,
      /obscure critical care protocol/i,
    ];

    for (const question of nclexTier3AdvancedReviewQuestions) {
      assert.ok(question.advancedScopeGuardrail.includes("avoiding independent provider-level"), `${question.id} needs scope guardrail`);
      const searchable = [
        question.scenario,
        question.stem,
        question.rationale.correct,
        question.rationale.advancedNursingReasoning,
        question.rationale.escalationLogic,
        question.rationale.safetyPrinciple,
        question.teachingPoint,
        question.advancedScopeGuardrail,
        ...question.options.map((option) => option.text),
        ...question.options.map((option) => option.rationale),
      ].join("\n");

      for (const pattern of forbidden) {
        assert.doesNotMatch(searchable, pattern, `${question.id} contains out-of-scope wording: ${pattern}`);
      }
    }
  });
});
