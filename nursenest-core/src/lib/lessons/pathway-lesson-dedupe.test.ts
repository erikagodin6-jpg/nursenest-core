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

  it("dedupes by pathway + canonical slug only (same slug drops; same title different slugs kept)", () => {
    const input = [
      lesson({ id: "a1", slug: "first", title: "First Title" }),
      lesson({ id: "a2", slug: "first-copy", title: "First Title Copy" }),
      lesson({ slug: "same-slug", title: "Any Title" }),
      lesson({ slug: "same-slug", title: "Any Title 2" }),
      lesson({ slug: "", title: "Sepsis: Recognition & Nursing Response" }),
      lesson({ slug: "", title: "sepsis recognition nursing response" }),
    ];
    const deduped = dedupePathwayLessonsForLibrary(input, { pathwayIdHint: "us-rn-nclex-rn" });
    assert.equal(deduped.duplicateCount, 1);
    assert.equal(deduped.items.length, 5);
    assert.ok(deduped.items.some((x) => x.slug === "first"));
    assert.ok(deduped.items.some((x) => x.slug === "first-copy"));
    assert.ok(deduped.items.some((x) => x.slug === "same-slug"));
  });

  it("keeps 50 lessons with identical titles when slugs differ (hub cannot collapse by title)", () => {
    const sharedTitle = "Sepsis recognition and escalation — RN";
    const input = Array.from({ length: 50 }, (_, i) =>
      lesson({
        slug: `sepsis-dup-title-${i + 1}`,
        title: sharedTitle,
      }),
    );
    const deduped = dedupePathwayLessonsForLibrary(input, { pathwayIdHint: "ca-rn-nclex-rn" });
    assert.equal(deduped.duplicateCount, 0);
    assert.equal(deduped.items.length, 50);
  });
});
