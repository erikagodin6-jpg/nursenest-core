import { describe, expect, it } from "vitest";
import { initialLessonPagesState, reduceLessonPageLoad } from "./lesson-pagination.js";

describe("reduceLessonPageLoad", () => {
  it("marks first page as new", () => {
    const { next, isNewPage } = reduceLessonPageLoad(initialLessonPagesState, 1);
    expect(isNewPage).toBe(true);
    expect(next.loadedPages.has(1)).toBe(true);
    expect(next.maxPageSeen).toBe(1);
  });

  it("dedupes repeated page", () => {
    const a = reduceLessonPageLoad(initialLessonPagesState, 2);
    const b = reduceLessonPageLoad(a.next, 2);
    expect(b.isNewPage).toBe(false);
    expect(b.next.loadedPages.size).toBe(1);
  });
});
