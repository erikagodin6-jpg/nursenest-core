import test from "node:test";
import assert from "node:assert/strict";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import {
  finalizeLessonBankQuizItemsForUi,
  isRenderablePathwayLessonQuizItem,
  normalizePathwayLessonQuizItemForRender,
} from "@/lib/lessons/lesson-quiz-render-contract";

test("isRenderablePathwayLessonQuizItem accepts bank-shaped MCQ items", () => {
  const item = { question: "Stem?", options: ["A", "B"], correct: 0, rationale: "Because.", examQuestionId: "q1" };
  assert.equal(isRenderablePathwayLessonQuizItem(item), true);
});

test("isRenderablePathwayLessonQuizItem rejects out-of-range correct index", () => {
  assert.equal(isRenderablePathwayLessonQuizItem({ question: "x", options: ["a", "b"], correct: 2 }), false);
});

test("normalizePathwayLessonQuizItemForRender trims and preserves rationale", () => {
  const n = normalizePathwayLessonQuizItemForRender({
    question: "  Hi? ",
    options: ["  one ", "two"],
    correct: 1,
    rationale: "  r ",
  });
  assert.ok(n);
  assert.equal(n!.question, "Hi?");
  assert.deepEqual(n!.options, ["one", "two"]);
  assert.equal(n!.correct, 1);
  assert.equal(n!.rationale, "r");
});

test("finalizeLessonBankQuizItemsForUi drops malformed rows and keeps examQuestionId", () => {
  const items: LessonBankQuizItem[] = [
    { examQuestionId: "good", question: "Q?", options: ["a", "b"], correct: 0 },
    { examQuestionId: "bad", question: "", options: ["a", "b"], correct: 0 },
  ];
  const out = finalizeLessonBankQuizItemsForUi(items);
  assert.equal(out.length, 1);
  assert.equal(out[0]!.examQuestionId, "good");
});
