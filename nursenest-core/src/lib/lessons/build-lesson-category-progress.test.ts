import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildLessonCategoryProgress } from "./build-lesson-category-progress";

function slugs(n: number) {
  return Array.from({ length: n }, (_, i) => ({ slug: `l-${i + 1}` }));
}

describe("buildLessonCategoryProgress", () => {
  it("0 of 10 complete yields 0%", () => {
    const lessons = slugs(10);
    const progressMap = Object.fromEntries(lessons.map((l) => [l.slug, "not_started" as const]));
    const r = buildLessonCategoryProgress({ lessons, progressMap });
    assert.equal(r.completedCount, 0);
    assert.equal(r.inProgressCount, 0);
    assert.equal(r.totalCount, 10);
    assert.equal(r.percentComplete, 0);
  });

  it("5 of 10 complete yields 50%", () => {
    const lessons = slugs(10);
    const progressMap: Record<string, "completed" | "not_started"> = {};
    for (let i = 0; i < 10; i++) {
      progressMap[`l-${i + 1}`] = i < 5 ? "completed" : "not_started";
    }
    const r = buildLessonCategoryProgress({ lessons, progressMap });
    assert.equal(r.completedCount, 5);
    assert.equal(r.percentComplete, 50);
  });

  it("10 of 10 complete yields 100%", () => {
    const lessons = slugs(10);
    const progressMap = Object.fromEntries(lessons.map((l) => [l.slug, "completed" as const]));
    const r = buildLessonCategoryProgress({ lessons, progressMap });
    assert.equal(r.completedCount, 10);
    assert.equal(r.percentComplete, 100);
  });

  it("in-progress lessons do not increase percentComplete", () => {
    const lessons = slugs(10);
    const progressMap: Record<string, "in_progress" | "not_started"> = {
      "l-1": "in_progress",
    };
    for (let i = 2; i <= 10; i++) {
      progressMap[`l-${i}`] = "not_started";
    }
    const r = buildLessonCategoryProgress({ lessons, progressMap });
    assert.equal(r.completedCount, 0);
    assert.equal(r.inProgressCount, 1);
    assert.equal(r.percentComplete, 0);
  });
});
