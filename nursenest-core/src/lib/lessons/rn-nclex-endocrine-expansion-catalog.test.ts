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

/** Must match `scripts/endocrine-expansion-defs-a.mjs` + `endocrine-expansion-defs-b.mjs` order and slugs. */
export const RN_NCLEX_ENDOCRINE_EXPANSION_SLUGS = [
  "endocrine-system-overview-nurses-nclex",
  "hormone-negative-feedback-nclex",
  "pituitary-disorders-nclex",
  "diabetes-type-1-vs-type-2-nclex",
  "hyperglycemia-vs-hypoglycemia-recognition-nclex",
  "insulin-administration-timing-nclex",
  "oral-antidiabetic-agents-nclex",
  "cgm-insulin-pump-nursing-nclex",
  "sick-day-diabetes-management-nclex",
  "diabetes-chronic-complications-nclex",
  "hyperthyroidism-graves-nclex",
  "hypothyroidism-hashimoto-myxedema-nclex",
  "thyroid-medications-levothyroxine-antithyroid-nclex",
  "parathyroid-disorders-nclex",
  "calcium-imbalance-hyper-hypo-nclex",
  "adrenal-insufficiency-addisons-nclex",
  "cushing-syndrome-vs-disease-nclex",
  "corticosteroid-therapy-tapering-nclex",
  "siadh-nursing-deep-dive-nclex",
  "diabetes-insipidus-nursing-deep-dive-nclex",
  "electrolyte-imbalances-endocrine-nclex",
  "growth-hormone-disorders-nclex",
  "pheochromocytoma-nclex",
  "endocrine-hormone-secreting-tumors-nclex",
  "fluid-management-endocrine-nclex",
  "which-endocrine-patient-unstable-nclex",
  "endocrine-prioritization-first-action-nclex",
  "ngn-endocrine-case-studies-nclex",
] as const;

describe("RN NCLEX endocrine expansion catalog", () => {
  it("bundled-only merge includes 28 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_ENDOCRINE_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with endocrine topic and Endocrine body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_ENDOCRINE_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_ENDOCRINE_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "endocrine");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "endocrine");
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
      for (const slug of RN_NCLEX_ENDOCRINE_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "endocrine");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
