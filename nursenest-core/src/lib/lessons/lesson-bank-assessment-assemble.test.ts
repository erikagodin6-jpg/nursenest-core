import test from "node:test";
import assert from "node:assert/strict";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import {
  assemblePathwayLessonBankAssessmentsFromParts,
  orderedExplicitLessonBankItemsForConfiguredIds,
} from "@/lib/lessons/lesson-bank-assessment-assembly-pure";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

function bank(id: string, stem: string): LessonBankQuizItem {
  return {
    examQuestionId: id,
    question: stem,
    options: ["x", "y"],
    correct: 0,
  };
}

test("orderedExplicitLessonBankItemsForConfiguredIds preserves authoring order", () => {
  const id1 = "aaaaaaaaaaaaaaaa";
  const id2 = "bbbbbbbbbbbbbbbb";
  const id3 = "cccccccccccccccc";
  const m = new Map<string, LessonBankQuizItem>([
    [id1, bank(id1, "First")],
    [id2, bank(id2, "Second")],
    [id3, bank(id3, "Third")],
  ]);
  assert.deepEqual(
    orderedExplicitLessonBankItemsForConfiguredIds([id3, id1, id2], m).map((x) => x.examQuestionId),
    [id3, id1, id2],
  );
});

test("assemblePathwayLessonBankAssessmentsFromParts: explicit pre replaces merged bank; post can fall back independently", () => {
  const idPre = "dddddddddddddddd";
  const explicitPre: PathwayLessonQuizItem[] = [bank(idPre, "Explicit pre only?")];
  const catalogPost: PathwayLessonQuizItem[] = [{ question: "Catalog post?", options: ["a", "b"], correct: 1 }];
  const pool: LessonBankQuizItem[] = [];
  for (let i = 0; i < 20; i++) {
    const id = `eeeeeeeeeeee${String(i).padStart(2, "0")}`;
    pool.push(bank(id, `Pool ${i}?`));
  }
  const out = assemblePathwayLessonBankAssessmentsFromParts({
    lesson: { preTest: [{ question: "Legacy pre?", options: ["p", "q"], correct: 0 }], postTest: catalogPost },
    lessonKey: "path:lesson-z",
    pool,
    explicitPre,
    explicitPost: null,
  });
  assert.equal(out.preTest.length, 1);
  assert.equal(out.preTest[0]?.question, "Explicit pre only?");
  assert.ok(out.postTest.length >= 1, "post side still merges catalog + bank when explicit post absent");
  assert.ok(out.postTest.some((q) => q.question === "Catalog post?"));
});

test("assemblePathwayLessonBankAssessmentsFromParts: explicit post replaces merged; pre can fall back", () => {
  const idPost = "ffffffffffffffff";
  const explicitPost: PathwayLessonQuizItem[] = [bank(idPost, "Explicit post?")];
  const pool: LessonBankQuizItem[] = [];
  for (let i = 0; i < 20; i++) {
    const id = `99999999999999${String(i).padStart(2, "0")}`;
    pool.push(bank(id, `P2 ${i}?`));
  }
  const out = assemblePathwayLessonBankAssessmentsFromParts({
    lesson: { preTest: [{ question: "Catalog pre?", options: ["a", "b"], correct: 0 }], postTest: undefined },
    lessonKey: "path:lesson-y",
    pool,
    explicitPre: null,
    explicitPost,
  });
  assert.equal(out.postTest.length, 1);
  assert.equal(out.postTest[0]?.question, "Explicit post?");
  assert.ok(out.preTest.length >= 1);
});

test("assemblePathwayLessonBankAssessmentsFromParts drops items that fail mini-quiz render contract", () => {
  const badCatalog: PathwayLessonQuizItem[] = [{ question: " ", options: ["a"], correct: 0 }];
  const out = assemblePathwayLessonBankAssessmentsFromParts({
    lesson: { preTest: badCatalog, postTest: undefined },
    lessonKey: "path:bad",
    pool: [],
    explicitPre: null,
    explicitPost: null,
  });
  assert.equal(out.preTest.length, 0);
});
