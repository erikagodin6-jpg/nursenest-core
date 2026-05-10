import assert from "node:assert/strict";
import test from "node:test";

import { catReadinessUnavailableMessage } from "@/lib/practice-tests/cat-practice-readiness";
import {
  buildQuestionInventorySummary,
  classifyQuestionInventoryRow,
  type QuestionInventoryAuditRow,
} from "@/lib/practice-tests/question-inventory-audit";

function row(overrides: Partial<QuestionInventoryAuditRow> = {}): QuestionInventoryAuditRow {
  return {
    id: "q1",
    exam: "NCLEX_RN",
    tier: "rn",
    countryCode: "US",
    regionScope: "BOTH",
    tags: [],
    questionFormat: null,
    questionType: "multiple_choice",
    stem: "A complete stem",
    options: ["A", "B"],
    correctAnswer: "A",
    rationale: "Because A is right.",
    difficulty: 3,
    bodySystem: "Cardiac",
    topic: "Perfusion",
    nclexClientNeedsCategory: "safe-effective",
    nclexClientNeedsSubcategory: null,
    isAdaptiveEligible: true,
    ...overrides,
  };
}

test("classifyQuestionInventoryRow tracks CAT completeness and exclusion reasons without relaxing gates", () => {
  const incomplete = classifyQuestionInventoryRow(row({ rationale: " ", options: [] }), {
    published: true,
    linearPracticeReady: true,
  });

  assert.equal(incomplete.catReady, false);
  assert.deepEqual(incomplete.completenessReasons, ["missing rationale", "missing options"]);
  assert.deepEqual(incomplete.exclusionReasons, ["missing rationale", "missing options"]);
});

test("classifyQuestionInventoryRow keeps ECG and module-only exclusions explicit", () => {
  const result = classifyQuestionInventoryRow(
    row({
      questionFormat: "ecg_video",
      tags: ["lab-drills-only"],
    }),
    {
      published: true,
      linearPracticeReady: false,
    },
  );

  assert.equal(result.linearPracticeReady, false);
  assert.equal(result.catReady, false);
  assert.ok(result.exclusionReasons.includes("ECG exclusion"));
  assert.ok(result.exclusionReasons.includes("module-only exclusion"));
});

test("buildQuestionInventorySummary separates published, linear, and CAT-ready inventory", () => {
  const summary = buildQuestionInventorySummary({
    pathwayId: "us-rn-nclex-rn",
    generatedAt: "2026-05-10T12:00:00.000Z",
    rows: [
      { row: row({ id: "ready-1", difficulty: 1, bodySystem: "Cardiac" }), published: true, linearPracticeReady: true },
      { row: row({ id: "ready-2", difficulty: 3, bodySystem: "Respiratory" }), published: true, linearPracticeReady: true },
      { row: row({ id: "ecg", questionFormat: "ecg_video" }), published: true, linearPracticeReady: false },
      { row: row({ id: "incomplete", rationale: "" }), published: true, linearPracticeReady: true },
    ],
  });

  assert.equal(summary.published.totalRows, 4);
  assert.equal(summary.published.ecgRows, 1);
  assert.equal(summary.published.incompleteRows, 1);
  assert.equal(summary.linearPractice.eligibleRows, 3);
  assert.equal(summary.linearPractice.excludedRows, 1);
  assert.equal(summary.catReady.completeRows, 2);
  assert.equal(summary.catReady.ecgExclusions, 1);
  assert.equal(summary.catReady.failedCompletenessReasons["missing rationale"], 1);
  assert.equal(summary.catReady.categorySpread.Cardiac, 1);
  assert.equal(summary.catReady.difficultySpread["1"], 1);
  assert.equal(summary.catReady.validatePracticeCatPoolResult.ok, false);
});

test("catReadinessUnavailableMessage can surface published versus CAT-ready mismatch", () => {
  const message = catReadinessUnavailableMessage(
    {
      publishedQuestions: 127,
      eligibleCatQuestions: 6,
      completePracticeQuestions: 92,
    },
    30,
  );

  assert.match(message, /127 published questions found/);
  assert.match(message, /only 6 currently meet CAT readiness requirements/);
});
import assert from "node:assert/strict";
import test from "node:test";

import {
  classifyQuestionInventoryRow,
  summarizeQuestionInventoryRows,
  type QuestionInventoryAuditRow,
} from "./question-inventory-audit";

const completeRow: QuestionInventoryAuditRow = {
  id: "complete",
  stem: "A complete stem",
  questionType: "multiple_choice",
  questionFormat: null,
  options: ["A", "B"],
  correctAnswer: "A",
  rationale: "Because A is correct.",
  difficulty: 3,
  bodySystem: "Cardiac",
  topic: "Perfusion",
  nclexClientNeedsCategory: "safe-effective",
  nclexClientNeedsSubcategory: "Safety",
  tags: [],
  exam: "NCLEX-RN",
  tier: "RN",
  countryCode: "US",
  isAdaptiveEligible: true,
};

test("classifyQuestionInventoryRow keeps module-only rows out of linear practice and CAT", () => {
  const result = classifyQuestionInventoryRow({
    ...completeRow,
    id: "module-only",
    tags: ["lab-drills-only"],
  });

  assert.equal(result.linearPracticeReady, false);
  assert.equal(result.catReady, false);
  assert.ok(result.exclusionReasons.includes("module-only exclusion"));
});

test("classifyQuestionInventoryRow excludes ECG and incomplete rows without weakening CAT completeness", () => {
  const ecg = classifyQuestionInventoryRow({
    ...completeRow,
    id: "ecg",
    questionFormat: "ecg_video",
  });
  const incomplete = classifyQuestionInventoryRow({
    ...completeRow,
    id: "incomplete",
    rationale: "",
  });

  assert.equal(ecg.linearPracticeReady, false);
  assert.equal(ecg.catReady, false);
  assert.ok(ecg.exclusionReasons.includes("ECG exclusion"));
  assert.equal(incomplete.linearPracticeReady, true);
  assert.equal(incomplete.catReady, false);
  assert.ok(incomplete.exclusionReasons.includes("missing rationale"));
});

test("summarizeQuestionInventoryRows separates published, linear-practice-ready, and CAT-ready buckets", () => {
  const summary = summarizeQuestionInventoryRows([
    completeRow,
    { ...completeRow, id: "missing-rationale", rationale: "" },
    { ...completeRow, id: "ecg", questionFormat: "ecg_video" },
    { ...completeRow, id: "module", tags: ["med-calculations-only"] },
  ]);

  assert.equal(summary.buckets.publishedInventory, 4);
  assert.equal(summary.buckets.linearPracticeReadyInventory, 2);
  assert.equal(summary.buckets.catReadyInventory, 1);
  assert.equal(summary.published.ecgRows, 1);
  assert.equal(summary.published.moduleOnlyRows, 1);
  assert.equal(summary.catReady.failedCompletenessReasons["missing rationale"], 1);
});
