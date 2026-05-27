import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NCLEX_TIER2_CLINICAL_JUDGMENT_METRICS,
  nclexTier2ClinicalJudgmentQuestions,
  type NclexTier2Domain,
  type NclexTier2QuestionType,
} from "./nclex-tier2-clinical-judgment-questions";

const REQUIRED_TYPES: readonly NclexTier2QuestionType[] = [
  "priority",
  "first-assess",
  "delegation",
  "trend-recognition",
  "medication-safety",
];

const REQUIRED_DOMAINS: readonly NclexTier2Domain[] = [
  "medical-surgical",
  "pharmacology",
  "respiratory",
  "cardiovascular",
  "neurologic",
  "endocrine",
  "postoperative",
  "delegation",
  "safety",
];

describe("NCLEX Tier 2 clinical judgment question catalog", () => {
  it("contains a moderate clinical judgment pack for entry-level RN licensure", () => {
    assert.equal(NCLEX_TIER2_CLINICAL_JUDGMENT_METRICS.totalQuestions, 16);
    for (const question of nclexTier2ClinicalJudgmentQuestions) {
      assert.equal(question.tier, 2);
      assert.deepEqual(question.exam, ["NCLEX-RN"]);
      assert.equal(question.adaptiveMetadata.difficulty, "tier-2-moderate-clinical-judgment");
      assert.ok(question.adaptiveMetadata.cognitiveLoad >= 2 && question.adaptiveMetadata.cognitiveLoad <= 3);
      assert.equal(question.adaptiveMetadata.prioritizationLevel, 3);
    }
  });

  it("covers Tier 2 question styles and clinical domains", () => {
    for (const type of REQUIRED_TYPES) {
      assert.ok(
        (NCLEX_TIER2_CLINICAL_JUDGMENT_METRICS.byType[type] ?? 0) >= 1,
        `missing Tier 2 question type: ${type}`,
      );
    }

    for (const domain of REQUIRED_DOMAINS) {
      assert.ok(
        (NCLEX_TIER2_CLINICAL_JUDGMENT_METRICS.byDomain[domain] ?? 0) >= 1,
        `missing Tier 2 domain: ${domain}`,
      );
    }
  });

  it("uses four answer choices with one correct answer and complete rationale maps", () => {
    for (const question of nclexTier2ClinicalJudgmentQuestions) {
      assert.equal(question.options.length, 4, `${question.id} must have four options`);
      assert.equal(question.options.filter((option) => option.correct).length, 1, `${question.id} must have one correct option`);
      assert.equal(question.options.find((option) => option.correct)?.id, question.correctAnswer);
      assert.equal(question.correctAnswer, "A");

      for (const option of question.options) {
        assert.ok(option.rationale.length >= 55, `${question.id} option ${option.id} rationale is thin`);
        assert.ok(question.rationale.wrongAnswers[option.id].length >= 55, `${question.id} option ${option.id} mapped rationale is thin`);
      }
    }
  });

  it("teaches NGN reasoning, prioritization, and patient safety", () => {
    for (const question of nclexTier2ClinicalJudgmentQuestions) {
      assert.equal(question.hints.length, 3);
      assert.ok(question.hints.every((hint) => hint.length >= 35), `${question.id} has a thin hint`);
      assert.ok(question.rationale.correct.length >= 75, `${question.id} needs correct rationale depth`);
      assert.ok(question.rationale.prioritizationLogic.length >= 75, `${question.id} needs prioritization depth`);
      assert.ok(question.rationale.safetyThinking.length >= 60, `${question.id} needs safety reasoning`);
      assert.ok(question.rationale.ngnReasoning.length >= 80, `${question.id} needs NGN reasoning`);
      assert.ok(question.teachingPoint.length >= 75, `${question.id} needs teaching depth`);
      assert.ok(question.adaptiveMetadata.misconceptionTags.length >= 2, `${question.id} needs misconception tags`);
    }
  });

  it("stays inside novice RN scope and avoids specialty-only management", () => {
    const forbidden = [
      /adjust ventilator/i,
      /ventilator parameter/i,
      /intubat/i,
      /arterial line/i,
      /swan-ganz/i,
      /pulmonary artery catheter/i,
      /hemodynamic interpretation/i,
      /independently prescribe/i,
      /prescribing decision/i,
      /physician-level/i,
      /advanced invasive/i,
      /specialty procedural/i,
    ];

    for (const question of nclexTier2ClinicalJudgmentQuestions) {
      assert.ok(question.noviceScopeGuardrail.includes("recognize danger"), `${question.id} needs scope guardrail`);
      const searchable = [
        question.scenario,
        question.stem,
        question.rationale.correct,
        question.rationale.prioritizationLogic,
        question.rationale.safetyThinking,
        question.rationale.ngnReasoning,
        question.teachingPoint,
        ...question.options.map((option) => option.text),
        ...question.options.map((option) => option.rationale),
      ].join("\n");

      for (const pattern of forbidden) {
        assert.doesNotMatch(searchable, pattern, `${question.id} contains out-of-scope wording: ${pattern}`);
      }
    }
  });
});
