import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  NCLEX_TIER1_FOUNDATIONAL_METRICS,
  nclexTier1FoundationalQuestions,
  type NclexTier1Domain,
} from "./nclex-tier1-foundational-questions";

const REQUIRED_DOMAINS: readonly NclexTier1Domain[] = [
  "safety",
  "fundamentals",
  "medical-surgical",
  "pharmacology",
  "infection-control",
  "mental-health",
  "maternity-pediatrics",
  "delegation",
];

describe("NCLEX Tier 1 foundational question catalog", () => {
  it("contains a focused foundational entry-level NCLEX pack", () => {
    assert.equal(NCLEX_TIER1_FOUNDATIONAL_METRICS.totalQuestions, 27);
    assert.ok(NCLEX_TIER1_FOUNDATIONAL_METRICS.safetyCritical >= 12);
  });

  it("covers foundational domains appropriate for novice RN and PN candidates", () => {
    for (const domain of REQUIRED_DOMAINS) {
      assert.ok(
        (NCLEX_TIER1_FOUNDATIONAL_METRICS.byDomain[domain] ?? 0) >= 1,
        `missing foundational domain: ${domain}`,
      );
    }
  });

  it("uses exactly four options with exactly one correct answer per item", () => {
    for (const question of nclexTier1FoundationalQuestions) {
      assert.equal(question.tier, 1, `${question.id} must be Tier 1`);
      assert.equal(question.options.length, 4, `${question.id} must have exactly four options`);
      assert.equal(
        question.options.filter((option) => option.correct).length,
        1,
        `${question.id} must have exactly one correct option`,
      );
      assert.equal(
        question.options.find((option) => option.correct)?.id,
        question.correctAnswer,
        `${question.id} correctAnswer must match the correct option`,
      );
    }
  });

  it("includes concise educational rationales, teaching points, and progressive hints", () => {
    for (const question of nclexTier1FoundationalQuestions) {
      assert.equal(question.hints.length, 3, `${question.id} must have exactly three hints`);
      assert.ok(question.hints.every((hint) => hint.length >= 25), `${question.id} has a thin hint`);
      assert.ok(question.rationale.correct.length >= 55, `${question.id} needs a correct-answer rationale`);
      assert.ok(question.rationale.safetyPrinciple.length >= 45, `${question.id} needs a safety principle`);
      assert.ok(question.rationale.prioritization.length >= 45, `${question.id} needs prioritization teaching`);
      assert.ok(question.teachingPoint.length >= 45, `${question.id} needs a teaching point`);

      for (const option of question.options) {
        assert.ok(option.rationale.length >= 35, `${question.id} option ${option.id} rationale is too thin`);
        assert.ok(question.rationale.wrongAnswers[option.id].length >= 35, `${question.id} missing rationale map`);
      }
    }
  });

  it("stays within foundational novice nursing scope and avoids advanced specialty content", () => {
    const forbidden = [
      /ventilator/i,
      /intubat/i,
      /hemodynamic/i,
      /titrate/i,
      /independently prescribe/i,
      /prescribing decision/i,
      /diagnose independently/i,
      /physician-level/i,
      /arterial line/i,
      /swan-ganz/i,
      /waveform/i,
      /advanced acid-base/i,
      /rare disease/i,
    ];

    for (const question of nclexTier1FoundationalQuestions) {
      assert.equal(question.adaptiveMetadata.difficulty, "tier-1-foundational");
      assert.ok(question.adaptiveMetadata.cognitiveLoad <= 2, `${question.id} cognitive load is too high`);
      assert.ok(question.adaptiveMetadata.prioritizationLevel <= 2, `${question.id} prioritization is too high`);
      assert.ok(question.entryLevelFocus.length >= 25, `${question.id} needs entry-level focus`);

      const searchable = [
        question.stem,
        question.rationale.correct,
        question.rationale.safetyPrinciple,
        question.rationale.prioritization,
        question.teachingPoint,
        question.entryLevelFocus,
        ...question.options.map((option) => option.text),
        ...question.options.map((option) => option.rationale),
      ].join("\n");

      for (const pattern of forbidden) {
        assert.doesNotMatch(searchable, pattern, `${question.id} contains advanced/out-of-scope wording: ${pattern}`);
      }
    }
  });
});
