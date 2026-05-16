import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assemblePathwayLessonBankAssessmentsFromParts,
  LESSON_ASSESSMENT_POST_MIN,
  LESSON_ASSESSMENT_PRE_MIN,
} from "@/lib/lessons/lesson-bank-assessment-assembly-pure";
import type { LessonBankQuizItem } from "@/lib/lessons/exam-question-to-lesson-quiz-item";
import type { PathwayLessonQuizItem } from "@/lib/lessons/pathway-lesson-types";

function quizItem(id: string): PathwayLessonQuizItem {
  return {
    id,
    question: `Question ${id}?`,
    options: ["A", "B", "C", "D"],
    correctAnswer: "A",
    rationale: `Rationale ${id}`,
  };
}

function bankItem(id: string): LessonBankQuizItem {
  return {
    ...quizItem(id),
    examQuestionId: id,
    difficulty: 2,
  };
}

describe("assemblePathwayLessonBankAssessmentsFromParts", () => {
  it("does not create pre/post quizzes from broad bank-only fallback items", () => {
    const pool = Array.from({ length: 20 }, (_, i) => bankItem(`bank-${i + 1}`));

    const assembled = assemblePathwayLessonBankAssessmentsFromParts({
      lesson: { preTest: [], postTest: [] },
      lessonKey: "ca-rn-nclex-rn:heart-failure",
      pool,
      explicitPre: null,
      explicitPost: null,
    });

    assert.deepEqual(assembled.preTest, []);
    assert.deepEqual(assembled.postTest, []);
  });

  it("renders authored lesson pre/post quizzes when they meet minimums", () => {
    const preTest = Array.from({ length: LESSON_ASSESSMENT_PRE_MIN }, (_, i) => quizItem(`pre-${i + 1}`));
    const postTest = Array.from({ length: LESSON_ASSESSMENT_POST_MIN }, (_, i) => quizItem(`post-${i + 1}`));

    const assembled = assemblePathwayLessonBankAssessmentsFromParts({
      lesson: { preTest, postTest },
      lessonKey: "ca-rn-nclex-rn:copd",
      pool: [],
      explicitPre: null,
      explicitPost: null,
    });

    assert.equal(assembled.preTest.length, LESSON_ASSESSMENT_PRE_MIN);
    assert.equal(assembled.postTest.length, LESSON_ASSESSMENT_POST_MIN);
    assert.deepEqual(assembled.preTest.map((q) => q.question), preTest.map((q) => q.question));
    assert.deepEqual(assembled.postTest.map((q) => q.question), postTest.map((q) => q.question));
  });

  it("preserves explicit lesson-linked question order over authored fallback", () => {
    const authoredPre = Array.from({ length: LESSON_ASSESSMENT_PRE_MIN }, (_, i) => quizItem(`authored-pre-${i + 1}`));
    const authoredPost = Array.from({ length: LESSON_ASSESSMENT_POST_MIN }, (_, i) => quizItem(`authored-post-${i + 1}`));
    const explicitPre = [quizItem("explicit-pre-2"), quizItem("explicit-pre-1")];
    const explicitPost = [quizItem("explicit-post-3"), quizItem("explicit-post-1")];

    const assembled = assemblePathwayLessonBankAssessmentsFromParts({
      lesson: { preTest: authoredPre, postTest: authoredPost },
      lessonKey: "ca-rn-nclex-rn:pneumonia",
      pool: [],
      explicitPre,
      explicitPost,
    });

    assert.deepEqual(assembled.preTest.map((q) => q.question), explicitPre.map((q) => q.question));
    assert.deepEqual(assembled.postTest.map((q) => q.question), explicitPost.map((q) => q.question));
  });
});
