import assert from "node:assert/strict";
import test from "node:test";
import {
  buildVisibleLessonScopeResult,
  type PathwayLessonKeyRow,
} from "@/lib/learner/learner-visible-lesson-scope";

test("buildVisibleLessonScopeResult preserves pathway metadata and appends synthetic pathway lesson ids", () => {
  const pathwayLessonRows: PathwayLessonKeyRow[] = [
    { pathwayId: "rn", slug: "fundamentals" },
    { pathwayId: "pn", slug: "safety" },
  ];

  const scope = buildVisibleLessonScopeResult({
    learnerPath: "rn",
    contentLessonIds: ["lesson-1", "lesson-2"],
    contentTruncated: false,
    pathwayLessonRows,
  });

  assert.deepEqual(scope.lessonIds, [
    "lesson-1",
    "lesson-2",
    "pathway:rn:fundamentals",
    "pathway:pn:safety",
  ]);
  assert.equal(scope.contentTruncated, false);
  assert.equal(scope.learnerPath, "rn");
  assert.deepEqual(scope.pathwayLessonRows, pathwayLessonRows);
});
