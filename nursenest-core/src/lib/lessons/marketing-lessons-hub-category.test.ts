import assert from "node:assert/strict";
import test from "node:test";
import { lessonCategoryToSlug } from "@/lib/lessons/lesson-taxonomy";
import {
  countMarketingHubLessonsByDisplayCategory,
  displayCategoryForMarketingHubLesson,
  lessonCategoryFromMarketingHubPathSegment,
  marketingHubCategorySlugForCategory,
} from "@/lib/lessons/marketing-lessons-hub-category";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function row(partial: Partial<PathwayLessonRecord> & Pick<PathwayLessonRecord, "slug" | "title" | "topic">): PathwayLessonRecord {
  return {
    slug: partial.slug,
    title: partial.title,
    topic: partial.topic,
    seoTitle: partial.seoTitle ?? "",
    seoDescription: partial.seoDescription ?? "",
    bodySystem: partial.bodySystem ?? "",
    system: partial.system ?? "",
    topicSlug: partial.topicSlug ?? "test",
    previewSectionCount: partial.previewSectionCount ?? 1,
    pathwayId: partial.pathwayId ?? "us-rn-nclex",
    publicComplete: partial.publicComplete ?? true,
    sections: partial.sections ?? [],
    locale: partial.locale ?? "en",
    examRelevance: partial.examRelevance ?? "core",
    activeExamMeta: partial.activeExamMeta,
  } as PathwayLessonRecord;
}

test("maps known category slugs round-trip", () => {
  assert.equal(lessonCategoryFromMarketingHubPathSegment("cardiovascular"), "Cardiovascular");
  assert.equal(lessonCategoryFromMarketingHubPathSegment("infection-control"), "Infection Control");
  assert.equal(
    lessonCategoryFromMarketingHubPathSegment("fluids-electrolytes-and-acid-base"),
    "Fluids, Electrolytes & Acid-Base",
  );
  assert.equal(marketingHubCategorySlugForCategory("Pharmacology"), "pharmacology");
  assert.equal(lessonCategoryToSlug("Pharmacology"), "pharmacology");
});

test("returns null for non-category segments", () => {
  assert.equal(lessonCategoryFromMarketingHubPathSegment("some-lesson-slug-xyz"), null);
  assert.equal(lessonCategoryFromMarketingHubPathSegment(""), null);
});

test("counts display categories from topic/title normalization", () => {
  const lessons = [
    row({ slug: "a", title: "HF care", topic: "Cardiovascular" }),
    row({ slug: "b", title: "Asthma plan", topic: "Respiratory" }),
    row({ slug: "c", title: "HF readmission", topic: "Cardiovascular" }),
  ];
  const m = countMarketingHubLessonsByDisplayCategory(lessons);
  assert.equal(m.get("Cardiovascular"), 2);
  assert.equal(m.get("Respiratory"), 1);
});

test("displayCategoryForMarketingHubLesson uses normalizeLessonCategory", () => {
  assert.equal(
    displayCategoryForMarketingHubLesson(row({ slug: "x", title: "Sepsis bundle", topic: "Sepsis" })),
    "Infection Control",
  );
});
