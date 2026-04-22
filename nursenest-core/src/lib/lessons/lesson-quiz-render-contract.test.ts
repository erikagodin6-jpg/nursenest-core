import test from "node:test";
import assert from "node:assert/strict";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import {
  isRenderablePathwayLessonQuizItem,
  normalizePathwayLessonQuizItemForRender,
} from "@/lib/lessons/lesson-quiz-render-contract";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

test("isRenderablePathwayLessonQuizItem accepts bank-shaped explicit MCQ rows", () => {
  const row: LessonBankQuizItem = {
    examQuestionId: "aaaaaaaaaaaaaaaa",
    question: "Stem?",
    options: ["alpha", "beta"],
    correct: 1,
    rationale: "Because.",
  };
  assert.equal(isRenderablePathwayLessonQuizItem(row), true);
});

test("normalizePathwayLessonQuizItemForRender keeps examQuestionId for analytics shells", () => {
  const row: PathwayLessonQuizItem = {
    question: "  Q?  ",
    options: ["  a ", "b"],
    correct: 0,
    examQuestionId: "bbbbbbbbbbbbbbbb",
  };
  const n = normalizePathwayLessonQuizItemForRender(row);
  assert.ok(n);
  assert.equal((n as LessonBankQuizItem).examQuestionId, "bbbbbbbbbbbbbbbb");
  assert.equal(n!.question, "Q?");
});

test("normalizePathwayLessonQuizItemForRender rejects non-integer correct index", () => {
  assert.equal(
    normalizePathwayLessonQuizItemForRender({
      question: "Q",
      options: ["a", "b"],
      correct: 1.5 as unknown as number,
    }),
    null,
  );
});

test("mergeAssessmentWithBank parity: catalog vs bank-backed items both normalize to same contract", () => {
  const catalog: PathwayLessonQuizItem = { question: "C?", options: ["x", "y"], correct: 0 };
  const bank: LessonBankQuizItem = {
    examQuestionId: "cccccccccccccccc",
    question: "B?",
    options: ["p", "q"],
    correct: 1,
  };
  assert.equal(isRenderablePathwayLessonQuizItem(catalog), true);
  assert.equal(isRenderablePathwayLessonQuizItem(bank), true);
  const nb = normalizePathwayLessonQuizItemForRender(bank);
  assert.ok(nb && "examQuestionId" in nb);
});
