import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {
  MISSED_QUESTION_JOURNAL_REASONS,
  MISTAKE_REASON_LABELS,
  type MistakeEntry,
} from "../../src/lib/mistakes/mistake-types";
import { analyzeMistakePatterns } from "../../src/lib/mistakes/mistake-patterns";
import { buildMissedQuestionRecommendations } from "../../src/lib/mistakes/missed-question-recommendations";

const root = process.cwd();
const read = (file: string) => fs.readFileSync(path.join(root, file), "utf8");

test("missed question journal exposes the requested reflection reasons", () => {
  assert.deepEqual(MISSED_QUESTION_JOURNAL_REASONS, [
    "knowledge_gap",
    "misread_question",
    "second_guessed",
    "calculation_error",
    "rushed",
    "fatigue_distraction",
  ]);
  assert.equal(MISTAKE_REASON_LABELS.knowledge_gap, "Didn't Know Content");
  assert.equal(MISTAKE_REASON_LABELS.calculation_error, "Calculation Error");
  assert.equal(MISTAKE_REASON_LABELS.fatigue_distraction, "Fatigue / Distraction");
});

test("missed question journal analytics report most common error type topic trends and improvement over time", () => {
  const entries: MistakeEntry[] = [
    entry("q1", "Cardiovascular", "knowledge_gap", "2026-05-01T00:00:00.000Z"),
    entry("q2", "Cardiovascular", "knowledge_gap", "2026-05-02T00:00:00.000Z"),
    entry("q3", "Endocrine", "calculation_error", "2026-05-08T00:00:00.000Z"),
  ];
  const data = analyzeMistakePatterns(entries);
  assert.equal(data.mostCommonErrorType?.reason, "knowledge_gap");
  assert.equal(data.topTopics[0]?.topic, "Cardiovascular");
  assert.ok(data.improvementOverTime.length >= 2);
});

test("missed question recommendations connect lessons flashcards and practice sets", () => {
  const recs = buildMissedQuestionRecommendations({ topic: "Cardiovascular", pathwayId: "rn" });
  assert.equal(recs.length, 3);
  assert.ok(recs.some((rec) => rec.kind === "lesson" && rec.href.includes("/app/lessons")));
  assert.ok(recs.some((rec) => rec.kind === "flashcards" && rec.href.includes("/app/flashcards")));
  assert.ok(recs.some((rec) => rec.kind === "practice" && rec.href.includes("/app/practice-tests")));
});

test("incorrect answer surfaces render the missed question reflection prompt", () => {
  const reflection = read("src/components/mistakes/missed-question-reflection.tsx");
  const flashcards = read("src/components/flashcards/flashcard-study-question-stack.tsx");
  const qbank = read("src/components/student/question-bank-practice-client.tsx");
  const runner = read("src/components/student/practice-test-runner-client.tsx");
  const api = read("src/app/api/learner/mistakes/route.ts");
  const dashboard = read("src/app/(app)/app/(learner)/account/missed-question-journal/page.tsx");

  assert.match(reflection, /Why did you miss this\?/);
  assert.match(reflection, /Suggested|buildMissedQuestionRecommendations|Study/);
  assert.match(flashcards, /<MissedQuestionReflection/);
  assert.match(qbank, /<MissedQuestionReflection/);
  assert.match(runner, /<MissedQuestionReflection/);
  assert.match(api, /stemPreview/);
  assert.match(api, /sourceType/);
  assert.match(dashboard, /mistakes\/page/);
});

function entry(
  questionId: string,
  topic: string,
  reason: MistakeEntry["reason"],
  lastMissedAt: string,
): MistakeEntry {
  return {
    questionId,
    stemPreview: "Which action is safest?",
    topic,
    bodySystem: null,
    questionType: "mcq",
    rationale: null,
    options: null,
    correctAnswer: null,
    missCount: 1,
    lastMissedAt,
    reason,
    note: "",
    tagged: true,
    sourceIds: [],
  };
}
