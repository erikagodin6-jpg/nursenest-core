import assert from "node:assert/strict";
import { test } from "node:test";
import {
  fillMarketingHubLessonsToMinimumVisible,
  MARKETING_HUB_MIN_VISIBLE_LESSONS,
} from "@/lib/lessons/marketing-hub-lesson-inventory-fill";
import { pathwayLessonMarketingDetailHref, type PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function row(slug: string): PathwayLessonRecord {
  return {
    slug,
    title: slug,
    topic: "T",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    previewSectionCount: 0,
    seoTitle: slug,
    seoDescription: "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for this topic.",
    sections: [],
    structuralQuality: { publicComplete: true },
  } as PathwayLessonRecord;
}

test("fillMarketingHubLessonsToMinimumVisible pads from loader pool with degraded flag", () => {
  const base = "/canada/rn/nclex-rn/lessons";
  const verified = [row("a"), row("b")];
  const prepared = verified;
  const loader = Array.from({ length: 20 }, (_, i) => row(`extra-${i}`));
  const { lessons, filledFromInventory } = fillMarketingHubLessonsToMinimumVisible({
    minVisible: MARKETING_HUB_MIN_VISIBLE_LESSONS,
    lessonsBasePath: base,
    verifiedKept: verified,
    hubCurriculumPrepared: prepared,
    loaderRenderable: loader,
  });
  assert.equal(lessons.length, MARKETING_HUB_MIN_VISIBLE_LESSONS);
  assert.equal(filledFromInventory, 10);
  assert.ok(lessons.every((l) => pathwayLessonMarketingDetailHref(base, l.slug) != null));
  const filled = lessons.filter((l) => l.hubMarketingDegradedReason === "unverified_inventory_fill");
  assert.equal(filled.length, 10);
});
