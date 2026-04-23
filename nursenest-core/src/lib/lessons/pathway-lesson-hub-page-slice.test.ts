import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { sliceNormalizedHubLessons } from "./pathway-lesson-hub-page-slice";
import type { PathwayLessonRecord } from "./pathway-lesson-types";

function stubLesson(slug: string, title: string): PathwayLessonRecord {
  return {
    slug,
    title,
    topic: "t",
    topicSlug: "t",
    bodySystem: "Cardiovascular",
    previewSectionCount: 1,
    seoTitle: title,
    seoDescription: "x ".repeat(20),
    sections: [],
    structuralQuality: { publicComplete: true, structureMode: "legacy" },
  };
}

describe("sliceNormalizedHubLessons", () => {
  it("keeps total aligned with the full renderable list length", () => {
    const all = Array.from({ length: 100 }, (_, i) => stubLesson(`s-${i}`, `Lesson ${i}`));
    const slice = sliceNormalizedHubLessons(all, 1, 72);
    assert.equal(slice.total, 100);
    assert.equal(slice.items.length, 72);
    assert.equal(slice.page, 1);
    assert.equal(slice.pageCount, 2);
  });

  it("returns the remainder on the last page without empty first-page contradiction", () => {
    const all = Array.from({ length: 50 }, (_, i) => stubLesson(`s-${i}`, `Lesson ${i}`));
    const slice = sliceNormalizedHubLessons(all, 1, 72);
    assert.equal(slice.total, 50);
    assert.equal(slice.items.length, 50);
    assert.equal(slice.pageCount, 1);
  });

  it("returns empty items for an empty normalized list with total zero", () => {
    const slice = sliceNormalizedHubLessons([], 1, 72);
    assert.equal(slice.total, 0);
    assert.equal(slice.items.length, 0);
    assert.equal(slice.pageCount, 1);
  });
});
