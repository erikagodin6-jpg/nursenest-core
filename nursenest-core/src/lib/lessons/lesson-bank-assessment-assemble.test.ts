import test from "node:test";
import assert from "node:assert/strict";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import {
  LESSON_ASSESSMENT_POST_MIN,
  LESSON_ASSESSMENT_PRE_MIN,
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

function authored(prefix: string, count: number): PathwayLessonQuizItem[] {
  return Array.from({ length: count }, (_, i) => ({
    question: `${prefix} ${i + 1}?`,
    options: ["a", "b"],
    correct: 0,
  }));
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

test("explicit pre/post assessments are authoritative and preserve order", () => {
  const explicitPre: PathwayLessonQuizItem[] = [
    bank("pre-2", "Second readiness question?"),
    bank("pre-1", "First readiness question?"),
  ];

  const explicitPost: PathwayLessonQuizItem[] = [
    bank("post-3", "Third retention question?"),
    bank("post-1", "First retention question?"),
  ];

  const out = assemblePathwayLessonBankAssessmentsFromParts({
    lesson: {
      preTest: authored("Legacy authored pre", LESSON_ASSESSMENT_PRE_MIN),
      postTest: authored("Legacy authored post", LESSON_ASSESSMENT_POST_MIN),
    },
    lessonKey: "cardiac:afib",
    pool: authored("Generic pathway filler", 20) as LessonBankQuizItem[],
    explicitPre,
    explicitPost,
  });

  assert.deepEqual(
    out.preTest.map((q) => q.question),
    ["Second readiness question?", "First readiness question?"],
  );

  assert.deepEqual(
    out.postTest.map((q) => q.question),
    ["Third retention question?", "First retention question?"],
  );
});

test("sparse authored quizzes do not backfill from broad pathway pools", () => {
  const out = assemblePathwayLessonBankAssessmentsFromParts({
    lesson: {
      preTest: authored("Weak pre", LESSON_ASSESSMENT_PRE_MIN - 1),
      postTest: authored("Weak post", LESSON_ASSESSMENT_POST_MIN - 1),
    },
    lessonKey: "neuro:stroke",
    pool: Array.from({ length: 30 }, (_, i) =>
      bank(`pool-${i}`, `Generic med surg pathway question ${i}?`),
    ),
    explicitPre: null,
    explicitPost: null,
  });

  assert.equal(out.preTest.length, 0);
  assert.equal(out.postTest.length, 0);
});

test("sufficient authored lesson assessments render without unrelated padding", () => {
  const out = assemblePathwayLessonBankAssessmentsFromParts({
    lesson: {
      preTest: authored("COPD readiness", LESSON_ASSESSMENT_PRE_MIN),
      postTest: authored("COPD retention", LESSON_ASSESSMENT_POST_MIN),
    },
    lessonKey: "respiratory:copd",
    pool: Array.from({ length: 50 }, (_, i) =>
      bank(`bank-${i}`, `Unrelated pathway question ${i}?`),
    ),
    explicitPre: null,
    explicitPost: null,
  });

  assert.equal(out.preTest.length, LESSON_ASSESSMENT_PRE_MIN);
  assert.equal(out.postTest.length, LESSON_ASSESSMENT_POST_MIN);

  assert.ok(out.preTest.every((q) => q.question.startsWith("COPD readiness")));
  assert.ok(out.postTest.every((q) => q.question.startsWith("COPD retention")));
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