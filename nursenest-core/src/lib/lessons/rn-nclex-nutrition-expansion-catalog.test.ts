import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCatalogLessonsRawFromBundledOnly,
  getCatalogPathwayLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  pathwayLessonMarketingDetailHref,
  pathwayLessonPublicDetailPath,
} from "@/lib/lessons/pathway-lesson-types";

/** Must match `scripts/nutrition-expansion-defs-a.mjs` + `nutrition-expansion-defs-b.mjs` order and slugs. */
export const RN_NCLEX_NUTRITION_EXPANSION_SLUGS = [
  "nutritional-assessment-nurses-nclex",
  "bmi-labs-malnutrition-indicators-nclex",
  "macronutrients-micronutrients-basics-nclex",
  "protein-energy-malnutrition-nclex",
  "dehydration-fluid-balance-nutrition-nclex",
  "electrolytes-nutrition-sodium-potassium-nclex",
  "refeeding-syndrome-nclex",
  "diets-clear-full-liquid-soft-regular-nclex",
  "therapeutic-diets-overview-nclex",
  "diabetic-diet-carb-counting-nclex",
  "cardiac-diet-low-sodium-low-fat-nclex",
  "renal-diet-potassium-phosphorus-protein-nclex",
  "liver-diet-protein-management-nclex",
  "dysphagia-diets-texture-modifications-nclex",
  "aspiration-risk-feeding-safety-nclex",
  "oral-feeding-assistance-safety-nclex",
  "pediatric-nutrition-basics-nclex",
  "geriatric-nutrition-considerations-nclex",
  "obesity-weight-management-nclex",
  "eating-disorders-nutrition-support-nclex",
  "vitamin-deficiencies-b12-d-iron-nclex",
  "iron-deficiency-diet-nclex",
  "calcium-bone-health-nutrition-nclex",
  "nutrition-pregnancy-lactation-nclex",
  "nutrition-wound-healing-nclex",
  "tube-feeding-complications-troubleshooting-nclex",
  "tpn-complications-monitoring-nclex",
  "food-safety-infection-prevention-nclex",
  "cultural-considerations-diet-nclex",
  "which-nutrition-patient-unstable-nclex",
  "nutrition-prioritization-first-actions-nclex",
  "ngn-nutrition-case-studies-nclex",
] as const;

describe("RN NCLEX nutrition expansion catalog", () => {
  it("bundled-only merge includes 32 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_NUTRITION_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with nutrition topic and Gastrointestinal body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_NUTRITION_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_NUTRITION_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "nutrition");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "gastrointestinal");
        assert.ok(lesson.structuralQuality?.publicComplete, `publicComplete false for ${lesson.slug}`);
        assert.equal(lesson.structuralQuality?.structureMode, "legacy");
        const href = pathwayLessonMarketingDetailHref(`/us/rn/nclex-rn/lessons`, lesson.slug);
        assert.ok(href && href.length > 10);
        const pathway = getExamPathwayById(pathwayId);
        assert.ok(pathway);
        const detailPath = pathwayLessonPublicDetailPath(pathway, lesson.slug);
        assert.ok(detailPath?.includes(lesson.slug));
      }
    }
  });

  it("full catalog sync list includes expansion rows on RN pathways (lesson-library merge)", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const lessons = getCatalogPathwayLessonsSync(pathwayId);
      const bySlug = new Map(lessons.map((l) => [l.slug.trim(), l]));
      for (const slug of RN_NCLEX_NUTRITION_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "nutrition");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
