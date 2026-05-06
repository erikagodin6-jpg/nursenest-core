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
import { marketingPathwayLessonsCategoryPath } from "@/lib/lessons/lesson-routes";
import { cleanLessonTitleForDisplay } from "@/lib/lessons/lesson-title-presentation";
import {
  pathwayLessonMarketingDetailHref,
  pathwayLessonMarketingHubVerifiedCardHref,
  pathwayLessonPublicDetailPath,
} from "@/lib/lessons/pathway-lesson-types";

function expansionSlugsForPathway(pathwayId: "ca-rn-nclex-rn" | "us-rn-nclex-rn"): string[] {
  return getCatalogLessonsRawFromBundledOnly(pathwayId)
    .map((r) => r.slug.trim())
    .filter((s) => s.startsWith("exam-strat-"))
    .sort();
}

describe("RN NCLEX Exam Strategy expansion catalog", () => {
  it("category slug matches marketing hub segment exam-strategy", () => {
    assert.equal(lessonCategoryToSlug("Exam Strategy"), "exam-strategy");
    assert.equal(lessonCategoryFromMarketingHubPathSegment("exam-strategy"), "Exam Strategy");
  });

  it("Exam Strategy category hub path is non-empty for CA and US RN", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const pathway = getExamPathwayById(pathwayId);
      assert.ok(pathway);
      const href = marketingPathwayLessonsCategoryPath(pathway, lessonCategoryToSlug("Exam Strategy"));
      assert.ok(href.length > 0);
      assert.ok(href.endsWith("/lessons/exam-strategy"), `${pathwayId}: ${href}`);
    }
  });

  it("bundled-only merge includes each expansion slug once per pathway", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      const expansionSlugs = expansionSlugsForPathway(pathwayId);
      assert.equal(expansionSlugs.length, 40, pathwayId);
      for (const expected of expansionSlugs) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("Exam Strategy hub count is > 0 for CA and US RN NCLEX-RN (data-driven)", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const lessons = getEffectiveCatalogLessonsForPathwaySync(pathwayId);
      const counts = countMarketingHubLessonsByDisplayCategory(lessons);
      const n = counts.get("Exam Strategy") ?? 0;
      assert.ok(n > 0, `${pathwayId}: expected Exam Strategy lessons`);
      assert.ok(
        n >= expansionSlugsForPathway(pathwayId).length,
        `${pathwayId}: expected at least ${expansionSlugsForPathway(pathwayId).length} expansion rows`,
      );
    }
  });

  it("each expansion lesson normalizes to publicComplete, correct display category, and non-degraded card href", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const expansionSlugs = expansionSlugsForPathway(pathwayId);
      const pathway = getExamPathwayById(pathwayId);
      assert.ok(pathway);
      const lessonsBase = `/${pathway.countrySlug}/${pathway.roleTrack}/${pathway.examCode}/lessons`;
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) => expansionSlugs.includes(r.slug.trim()));
      assert.equal(rawList.length, expansionSlugs.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "exam-strategy");
        assert.equal(displayCategoryForMarketingHubLesson(lesson), "Exam Strategy");
        assert.ok(lesson.structuralQuality?.publicComplete, `publicComplete false for ${lesson.slug}`);
        assert.equal(lesson.structuralQuality?.structureMode, "legacy");
        const canonical = pathwayLessonPublicDetailPath(pathway, lesson.slug);
        assert.ok(canonical && canonical.includes(`/lessons/${lesson.slug}`));
        const href = pathwayLessonMarketingDetailHref(lessonsBase, lesson.slug);
        assert.ok(href && href.length > 10);
        const cardHref = pathwayLessonMarketingHubVerifiedCardHref(lessonsBase, lesson);
        assert.ok(cardHref && cardHref.length > 0, `${pathwayId}/${lesson.slug}: empty card href`);
        const display = cleanLessonTitleForDisplay(lesson.title);
        assert.ok(display.length > 0);
      }
    }
  });
});
