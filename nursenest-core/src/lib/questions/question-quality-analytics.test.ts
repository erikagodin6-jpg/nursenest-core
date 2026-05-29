import assert from "node:assert/strict";
import test from "node:test";
import { computeQuestionQualityAnalytics } from "@/lib/questions/question-quality-analytics";

test("question quality analytics flags poor discrimination and ambiguous distractors", () => {
  const report = computeQuestionQualityAnalytics({
    totalAttempts: 100,
    correctAttempts: 42,
    correctOptionKeys: ["A"],
    discriminationIndex: 0.08,
    averageResponseTimeMs: 18_000,
    reportCount: 4,
    optionSelections: [
      { optionKey: "A", selectionCount: 42 },
      { optionKey: "B", selectionCount: 40 },
      { optionKey: "C", selectionCount: 13 },
      { optionKey: "D", selectionCount: 5 },
    ],
  });

  assert.equal(report.correctResponseRate, 0.42);
  assert.equal(report.mostSelectedWrongAnswer, "B");
  assert.ok(report.flags.includes("poor_discrimination"));
  assert.ok(report.flags.includes("ambiguous"));
  assert.ok(report.flags.includes("frequently_reported"));
  assert.equal(report.reviewPriority, "retire");
});

test("question quality analytics rewards healthy medium-difficulty items", () => {
  const report = computeQuestionQualityAnalytics({
    totalAttempts: 120,
    correctAttempts: 84,
    correctOptionKeys: ["C"],
    discriminationIndex: 0.34,
    averageResponseTimeMs: 42_000,
    optionSelections: [
      { optionKey: "A", selectionCount: 14 },
      { optionKey: "B", selectionCount: 11 },
      { optionKey: "C", selectionCount: 84 },
      { optionKey: "D", selectionCount: 11 },
    ],
  });

  assert.equal(report.flags.length, 0);
  assert.equal(report.severity, "none");
  assert.equal(report.reviewPriority, "monitor");
  assert.ok(report.healthScore >= 95);
});

test("question quality analytics identifies too-easy items with weak distractors", () => {
  const report = computeQuestionQualityAnalytics({
    totalAttempts: 100,
    correctAttempts: 94,
    correctOptionKeys: ["D"],
    optionSelections: [
      { optionKey: "A", selectionCount: 2 },
      { optionKey: "B", selectionCount: 2 },
      { optionKey: "C", selectionCount: 2 },
      { optionKey: "D", selectionCount: 94 },
    ],
  });

  assert.ok(report.flags.includes("too_easy"));
  assert.ok(report.flags.includes("non_functional_distractor"));
  assert.equal(report.severity, "medium");
});

