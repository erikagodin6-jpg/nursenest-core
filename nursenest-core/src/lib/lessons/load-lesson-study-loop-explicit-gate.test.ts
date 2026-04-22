import test from "node:test";
import assert from "node:assert/strict";
import {
  explicitLessonStudyLoopCombinedIdCount,
  explicitLessonStudyLoopCombinedSanitizedIds,
  LESSON_STUDY_LOOP_MIN_QUESTIONS,
  shouldUseExplicitLessonStudyLoopPack,
} from "@/lib/lessons/load-lesson-study-loop-gate";

function id(n: number): string {
  return `id-${String(n).padStart(10, "0")}`;
}

test("explicitLessonStudyLoopCombinedIdCount dedupes across pre and post", () => {
  const shared = id(1);
  assert.equal(
    explicitLessonStudyLoopCombinedIdCount([shared, id(2)], [shared, id(3)]),
    3,
  );
});

test("explicitLessonStudyLoopCombinedSanitizedIds preserves pre order then post-only", () => {
  const a = id(1);
  const b = id(2);
  const c = id(3);
  assert.deepEqual(explicitLessonStudyLoopCombinedSanitizedIds([b, a], [a, c]), [b, a, c]);
});

test("shouldUseExplicitLessonStudyLoopPack requires resolved explicit item count threshold", () => {
  const base = {
    hasUserId: true,
    hasPathway: true,
    lessonStudyLoopEnabled: true,
    enablePrePostQuizzes: true,
  };
  assert.equal(
    shouldUseExplicitLessonStudyLoopPack({
      ...base,
      resolvedCombinedExplicitItemCount: LESSON_STUDY_LOOP_MIN_QUESTIONS - 1,
    }),
    false,
  );
  assert.equal(
    shouldUseExplicitLessonStudyLoopPack({
      ...base,
      resolvedCombinedExplicitItemCount: LESSON_STUDY_LOOP_MIN_QUESTIONS,
    }),
    true,
  );
});

test("shouldUseExplicitLessonStudyLoopPack is false without user, pathway, or settings", () => {
  assert.equal(
    shouldUseExplicitLessonStudyLoopPack({
      hasUserId: false,
      hasPathway: true,
      lessonStudyLoopEnabled: true,
      enablePrePostQuizzes: true,
      resolvedCombinedExplicitItemCount: 10,
    }),
    false,
  );
});
