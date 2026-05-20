import test from "node:test";
import assert from "node:assert/strict";
import { buildLessonBankQuizItemsFromOrderedExamRows } from "@/lib/lessons/exam-question-to-lesson-quiz-item";

const baseRow = (id: string, stem: string, letter: "A" | "B") => ({
  id,
  stem,
  options: ["Alpha", "Beta"],
  correctAnswer: letter,
  questionType: "MCQ",
  rationale: null,
});

test("buildLessonBankQuizItemsFromOrderedExamRows preserves id list order", () => {
  const z = baseRow("z-id-xxxxxxxxxx", "Z?", "A");
  const a = baseRow("a-id-xxxxxxxxxx", "A?", "B");
  const map = new Map([
    ["z-id-xxxxxxxxxx", z],
    ["a-id-xxxxxxxxxx", a],
  ]);
  const ordered = ["a-id-xxxxxxxxxx", "z-id-xxxxxxxxxx", "missing-id-xxxxxx"];
  const items = buildLessonBankQuizItemsFromOrderedExamRows(ordered, map);
  assert.equal(items.length, 2);
  assert.equal(items[0]!.examQuestionId, "a-id-xxxxxxxxxx");
  assert.equal(items[0]!.question, "A?");
  assert.equal(items[1]!.examQuestionId, "z-id-xxxxxxxxxx");
});

test("buildLessonBankQuizItemsFromOrderedExamRows skips SATA rows", () => {
  const sata = {
    id: "s-id-xxxxxxxxxx",
    stem: "Select all",
    options: ["a", "b"],
    correctAnswer: ["A", "B"],
    questionType: "SATA",
    rationale: null,
  };
  const mcq = baseRow("m-id-xxxxxxxxxx", "One?", "A");
  const items = buildLessonBankQuizItemsFromOrderedExamRows(["s-id-xxxxxxxxxx", "m-id-xxxxxxxxxx"], new Map([[sata.id, sata], [mcq.id, mcq]]));
  assert.equal(items.length, 1);
  assert.equal(items[0]!.examQuestionId, "m-id-xxxxxxxxxx");
});

test("mixed ladder-depth ids both map when rows are MCQ (caller enforces access)", () => {
  const pn = { ...baseRow("pn-id-xxxxxxxxxx", "PN?", "A"), tier: "lvn" };
  const rn = { ...baseRow("rn-id-xxxxxxxxxx", "RN?", "B"), tier: "rn" };
  const map = new Map([
    ["pn-id-xxxxxxxxxx", pn],
    ["rn-id-xxxxxxxxxx", rn],
  ]);
  const items = buildLessonBankQuizItemsFromOrderedExamRows(["pn-id-xxxxxxxxxx", "rn-id-xxxxxxxxxx"], map);
  assert.equal(items.length, 2);
});
