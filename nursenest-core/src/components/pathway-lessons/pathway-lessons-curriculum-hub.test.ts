import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { prepareLessonsForHubCurriculum } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function row(partial: Partial<PathwayLessonRecord> & Pick<PathwayLessonRecord, "slug" | "title">): PathwayLessonRecord {
  return {
    topic: "t",
    topicSlug: "t",
    system: "cardiovascular",
    bodySystem: "cardiovascular",
    previewSectionCount: 1,
    seoTitle: partial.title,
    seoDescription: "d",
    sections: [],
    ...partial,
  } as PathwayLessonRecord;
}

describe("prepareLessonsForHubCurriculum", () => {
  it("removes blank slugs so list length matches linkable lessons only", () => {
    const lessons = [
      row({ slug: "valid-lesson", title: "Valid" }),
      row({ slug: "   ", title: "No slug" }),
      row({ slug: "valid-lesson", title: "Dup slug same pathway" }),
    ];
    const prepared = prepareLessonsForHubCurriculum(lessons, {
      pathwayId: "us-rn-nclex-rn",
      lessonsBasePath: "/us/rn/nclex-rn/lessons",
    });
    assert.equal(prepared.length, 1);
    assert.equal(prepared[0]?.slug, "valid-lesson");
  });

  it("keeps distinct slugs even when topic + normalized titles match (full hub inventory)", () => {
    const lessons = [
      row({
        slug: "lesson-a",
        title: "Sepsis recognition — NCLEX-RN",
        topicSlug: "infection",
        examRelevance: "core",
      }),
      row({
        slug: "lesson-b",
        title: "Sepsis recognition (NCLEX-RN)",
        topicSlug: "infection",
        examRelevance: "high_yield",
      }),
    ];
    const prepared = prepareLessonsForHubCurriculum(lessons, {
      pathwayId: "us-rn-nclex-rn",
      lessonsBasePath: "/us/rn/nclex-rn/lessons",
    });
    assert.equal(prepared.length, 2);
  });
});
