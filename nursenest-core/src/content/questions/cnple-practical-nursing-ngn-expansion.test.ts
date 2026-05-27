import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS,
  cnplePracticalNursingNgnExpansionQuestions,
  type CnpleContentDomain,
  type CnplePracticalQuestionType,
} from "./cnple-practical-nursing-ngn-expansion";

const REQUIRED_TYPES: readonly CnplePracticalQuestionType[] = [
  "matrix",
  "bowtie",
  "sata",
  "case-study",
  "prioritization",
  "ordered-response",
  "chart-review",
  "hotspot",
  "cloze",
  "extended-matching",
  "communication",
  "delegation-assignment",
  "medication-safety",
  "safety-deterioration",
];

const REQUIRED_DOMAINS: readonly CnpleContentDomain[] = [
  "medical-surgical",
  "pharmacology",
  "pediatrics",
  "maternity",
  "mental-health",
  "emergency-care",
  "community-health",
  "leadership-delegation",
  "ethics",
  "infection-control",
  "chronic-disease",
  "geriatrics",
];

describe("CNPLE practical nursing NGN expansion catalog", () => {
  it("adds a substantial non-MCQ bank with broad item-type coverage", () => {
    assert.equal(CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS.totalQuestions, 75);

    for (const type of REQUIRED_TYPES) {
      assert.ok(
        (CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS.byType[type] ?? 0) >= 1,
        `missing required question type: ${type}`,
      );
    }

    const mcqOnlyCount = cnplePracticalNursingNgnExpansionQuestions.filter(
      (question) => question.questionType === "prioritization",
    ).length;
    assert.ok(
      mcqOnlyCount < cnplePracticalNursingNgnExpansionQuestions.length / 3,
      "bank should not over-rely on traditional single-best-answer items",
    );
  });

  it("covers practical nursing domains requested for Canadian licensing-style prep", () => {
    for (const domain of REQUIRED_DOMAINS) {
      assert.ok(
        (CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS.byDomain[domain] ?? 0) >= 1,
        `missing requested content domain: ${domain}`,
      );
    }
  });

  it("requires progressive hints and complete rationales for every item", () => {
    for (const question of cnplePracticalNursingNgnExpansionQuestions) {
      assert.equal(question.hints.length, 3, `${question.id} must have exactly 3 hints`);
      assert.ok(question.hints.every((hint) => hint.length >= 35), `${question.id} has a thin hint`);

      assert.ok(question.rationale.correct.length >= 60, `${question.id} missing correct rationale depth`);
      assert.ok(
        question.rationale.prioritizationLogic.length >= 60,
        `${question.id} missing prioritization rationale depth`,
      );
      assert.ok(
        question.rationale.safetyImplication.length >= 40,
        `${question.id} missing safety implication depth`,
      );

      for (const option of question.options) {
        assert.ok(option.rationale.length >= 35, `${question.id} option ${option.id} has weak rationale`);
      }
    }
  });

  it("keeps the bank inside entry-level Canadian practical nursing scope", () => {
    const forbidden = [
      /independently diagnose/i,
      /start antibiotics independently/i,
      /independently prescribe/i,
      /prescribing decision/i,
      /intubate/i,
      /manage ventilator/i,
      /physician-level/i,
    ];

    for (const question of cnplePracticalNursingNgnExpansionQuestions) {
      assert.equal(question.adaptiveMetadata.profession, "RPN");
      assert.equal(question.adaptiveMetadata.country, "CA");
      assert.equal(question.adaptiveMetadata.scopeLevel, "entry-level practical nursing");
      assert.ok(
        question.canadianPracticeNote.toLowerCase().includes("policy") ||
          question.canadianPracticeNote.toLowerCase().includes("canadian") ||
          question.canadianPracticeNote.toLowerCase().includes("provincial") ||
          question.canadianPracticeNote.toLowerCase().includes("rpn") ||
          question.canadianPracticeNote.toLowerCase().includes("practical-nursing") ||
          question.canadianPracticeNote.toLowerCase().includes("practical nursing") ||
          question.canadianPracticeNote.toLowerCase().includes("protocol"),
        `${question.id} should include Canadian practice/scope framing`,
      );

      const searchable = [
        question.scenario,
        question.stem,
        question.rationale.correct,
        question.rationale.prioritizationLogic,
        question.rationale.safetyImplication,
        ...question.options.map((option) => option.text),
      ].join("\n");

      for (const pattern of forbidden) {
        assert.doesNotMatch(searchable, pattern, `${question.id} contains out-of-scope wording: ${pattern}`);
      }
    }
  });

  it("tracks adaptive metadata for safety, misconceptions, difficulty, and prioritization", () => {
    assert.ok(
      CNPLE_PRACTICAL_NURSING_EXPANSION_METRICS.safetyCritical >= 70,
      "most CNPLE practical nursing items should be safety-critical",
    );

    for (const question of cnplePracticalNursingNgnExpansionQuestions) {
      assert.ok(question.adaptiveMetadata.cognitiveLoad >= 1 && question.adaptiveMetadata.cognitiveLoad <= 5);
      assert.ok(question.adaptiveMetadata.prioritizationLevel >= 1 && question.adaptiveMetadata.prioritizationLevel <= 5);
      assert.ok(question.adaptiveMetadata.misconceptionTags.length >= 2, `${question.id} needs misconception tags`);
      assert.ok(question.clinicalJudgmentFocus.length >= 30, `${question.id} needs clinical judgment focus`);
    }
  });
});
