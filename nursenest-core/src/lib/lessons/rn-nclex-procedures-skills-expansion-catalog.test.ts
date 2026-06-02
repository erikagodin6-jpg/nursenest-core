import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCatalogLessonsRawFromBundledOnly,
  getEffectiveCatalogLessonsForPathwaySync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  countMarketingHubLessonsByDisplayCategory,
  displayCategoryForMarketingHubLesson,
  lessonCategoryFromMarketingHubPathSegment,
} from "@/lib/lessons/marketing-lessons-hub-category";
import { lessonCategoryToSlug } from "@/lib/lessons/lesson-taxonomy";
import {
  pathwayLessonMarketingDetailHref,
  pathwayLessonPublicDetailPath,
} from "@/lib/lessons/pathway-lesson-types";

/** Must match `scripts/generate-rn-nclex-procedures-skills-expansion-catalog.mjs` slug prefix. */
function expansionSlugsForPathway(pathwayId: "ca-rn-nclex-rn" | "us-rn-nclex-rn"): string[] {
  return getCatalogLessonsRawFromBundledOnly(pathwayId)
    .map((r) => r.slug.trim())
    .filter((s) => s.startsWith("proc-skill-"))
    .sort();
}

describe("RN NCLEX Procedures & Skills expansion catalog", () => {
  it("category slug matches marketing hub segment procedures-and-skills", () => {
    assert.equal(lessonCategoryToSlug("Procedures & Skills"), "procedures-and-skills");
    assert.equal(lessonCategoryFromMarketingHubPathSegment("procedures-and-skills"), "Procedures & Skills");
  });

  it("bundled-only merge includes each expansion slug once per pathway", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      const expansionSlugs = expansionSlugsForPathway(pathwayId);
      assert.equal(expansionSlugs.length, 43, pathwayId);
      for (const expected of expansionSlugs) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("Procedures & Skills hub count is > 0 for CA and US RN NCLEX-RN (data-driven)", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const lessons = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
      const counts = countMarketingHubLessonsByDisplayCategory(lessons);
      const n = counts.get("Procedures & Skills") ?? 0;
      assert.ok(n > 0, `${pathwayId}: expected Procedures & Skills lessons`);
      assert.ok(
        n >= expansionSlugsForPathway(pathwayId).length,
        `${pathwayId}: expected at least ${expansionSlugsForPathway(pathwayId).length} expansion rows`,
      );
    }
  });

  it("each expansion lesson normalizes to publicComplete with Procedures & Skills display category", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const expansionSlugs = expansionSlugsForPathway(pathwayId);
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) => expansionSlugs.includes(r.slug.trim()));
      assert.equal(rawList.length, expansionSlugs.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "procedures-and-skills");
        assert.equal(displayCategoryForMarketingHubLesson(lesson), "Procedures & Skills");
        assert.ok(lesson.structuralQuality?.publicComplete, `publicComplete false for ${lesson.slug}`);
        assert.equal(lesson.structuralQuality?.structureMode, "legacy");
        const pathway = getExamPathwayById(pathwayId);
        assert.ok(pathway);
        const canonical = pathwayLessonPublicDetailPath(pathway, lesson.slug);
        assert.ok(canonical && canonical.includes(`/lessons/${lesson.slug}`));
        const href = pathwayLessonMarketingDetailHref(`/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}/lessons`, lesson.slug);
        assert.ok(href && href.length > 10);
      }
    }
  });
});
