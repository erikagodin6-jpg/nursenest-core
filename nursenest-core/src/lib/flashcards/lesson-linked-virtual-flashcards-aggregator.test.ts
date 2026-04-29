import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  collectMergedLessonVirtualFlashcardsForPathway,
  minLessonLinkedCardsForPathwayLesson,
} from "@/lib/flashcards/lesson-linked-virtual-flashcards-aggregator";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";

describe("collectMergedLessonVirtualFlashcardsForPathway", () => {
  it("merges section + recall virtuals with per-lesson minimums for CA RN pathway", () => {
    const pid = "ca-rn-nclex-rn";
    const { virtuals, diagnostics } = collectMergedLessonVirtualFlashcardsForPathway(pid);
    assert.ok(virtuals.length > 50, "expected merged catalog virtuals");
    assert.equal(diagnostics.pathwayId, pid);
    assert.ok(diagnostics.catalogLessonCount > 0);
    assert.ok(diagnostics.lessonsWithVirtualCards > 0);
    assert.ok(diagnostics.totalVirtualCards >= virtuals.length);

    const lessons = getCatalogPathwayLessonsSync(pid);
    const bySlug = new Map<string, number>();
    for (const v of virtuals) {
      bySlug.set(v.lessonSlug, (bySlug.get(v.lessonSlug) ?? 0) + 1);
    }
    for (const l of lessons) {
      const n = bySlug.get(l.slug) ?? 0;
      const min = minLessonLinkedCardsForPathwayLesson(pid, l);
      assert.ok(n >= min, `expected min ${min} cards for ${l.slug}, got ${n}`);
    }

    for (const v of virtuals.slice(0, 80)) {
      assert.ok((v.row.rationaleCorrect ?? "").trim().length >= 8, `rationale for ${v.id}`);
      assert.ok(v.lessonHref.startsWith("/"), "lesson href");
    }
  });
});
