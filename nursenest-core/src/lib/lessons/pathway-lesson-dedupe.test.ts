import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { dedupePathwayLessonsForLibrary, normalizeLessonTitleForDedupe } from "./pathway-lesson-dedupe";
import type { PathwayLessonRecord } from "./pathway-lesson-types";

function lesson(overrides: Partial<PathwayLessonRecord> & { id?: string }): PathwayLessonRecord & { id?: string } {
  return {
    slug: "sample-lesson",
    title: "Sample Lesson",
    topic: "Topic",
    topicSlug: "topic",
    system: "fundamentals",
    bodySystem: "fundamentals",
    previewSectionCount: 1,
    seoTitle: "Sample Lesson",
    seoDescription: "desc",
    sections: [],
    ...overrides,
  };
}

describe("pathway-lesson-dedupe", () => {
  it("normalizes titles with punctuation, ampersands, and whitespace", () => {
    const out = normalizeLessonTitleForDedupe("  ACS & Chest Pain!!!  ");
    assert.equal(out, "acs chest pain");
  });

  it("collapses RN suffix variants and common atrial fibrillation spellings for dedupe keys", () => {
    assert.equal(
      normalizeLessonTitleForDedupe("Atrial Fibrillation — RN"),
      normalizeLessonTitleForDedupe("Atrial Fibrillation (RN)"),
    );
    assert.equal(
      normalizeLessonTitleForDedupe("AFib management"),
      normalizeLessonTitleForDedupe("atrial fibrillation management"),
    );
  });

  it("dedupes by id first, then slug, then normalized title", () => {
    const input = [
      lesson({ id: "a1", slug: "first", title: "First Title" }),
      lesson({ id: "a1", slug: "first-copy", title: "First Title Copy" }),
      lesson({ slug: "same-slug", title: "Any Title" }),
      lesson({ slug: "same-slug", title: "Any Title 2" }),
      lesson({ slug: "", title: "Sepsis: Recognition & Nursing Response" }),
      lesson({ slug: "", title: "sepsis recognition nursing response" }),
    ];
    const deduped = dedupePathwayLessonsForLibrary(input, { pathwayIdHint: "us-rn-nclex-rn" });
    assert.equal(deduped.duplicateCount, 3);
    assert.equal(deduped.items.length, 3);
    assert.equal(deduped.items[0]?.id, "a1");
    assert.equal(deduped.items[1]?.slug, "same-slug");
    assert.equal(deduped.items[2]?.title, "Sepsis: Recognition & Nursing Response");
  });
});
