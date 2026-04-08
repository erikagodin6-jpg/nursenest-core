import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { sortPathwayLessonsForPublicPreview } from "@/lib/lessons/pathway-lesson-public-preview-priority";

function row(partial: Pick<PathwayLessonRecord, "slug" | "title">): PathwayLessonRecord {
  return {
    topic: "",
    topicSlug: "",
    bodySystem: "",
    previewSectionCount: 1,
    seoTitle: partial.title,
    seoDescription: "",
    sections: [],
    ...partial,
  };
}

describe("sortPathwayLessonsForPublicPreview", () => {
  it("pulls curated US RN slugs ahead of arbitrary catalog tail", () => {
    const lessons: PathwayLessonRecord[] = [
      row({ slug: "zzz-unrelated", title: "Zzz" }),
      row({ slug: "acute-coronary-syndrome-gold", title: "ACS" }),
      row({ slug: "us-rn-heart-failure", title: "HF" }),
    ];
    const sorted = sortPathwayLessonsForPublicPreview("us-rn-nclex-rn", lessons);
    assert.equal(sorted[0]!.slug, "acute-coronary-syndrome-gold");
    assert.equal(sorted[1]!.slug, "us-rn-heart-failure");
    assert.equal(sorted[2]!.slug, "zzz-unrelated");
  });

  it("leaves unknown pathways in original order", () => {
    const lessons: PathwayLessonRecord[] = [
      row({ slug: "a", title: "A" }),
      row({ slug: "b", title: "B" }),
    ];
    const sorted = sortPathwayLessonsForPublicPreview("unknown-pathway-id", lessons);
    assert.deepEqual(
      sorted.map((l) => l.slug),
      ["a", "b"],
    );
  });
});
