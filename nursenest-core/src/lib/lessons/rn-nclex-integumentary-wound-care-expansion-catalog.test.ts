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

/** Must match `scripts/generate-rn-integumentary-wound-care-expansion-catalog.mjs` DEFS order and slugs. */
export const RN_NCLEX_INTEGUMENTARY_WOUND_CARE_EXPANSION_SLUGS = [
  "skin-assessment-for-nurses-nclex",
  "wound-assessment-size-depth-drainage-odour-tissue",
  "wound-healing-phases-nursing",
  "acute-vs-chronic-wounds-nclex",
  "surgical-wound-care-nclex",
  "wound-dehiscence-evisceration-nclex",
  "pressure-injury-prevention-nclex-rn",
  "pressure-injury-treatment-dressing-selection",
  "moisture-associated-skin-damage-masd",
  "incontinence-associated-dermatitis-iad-nclex",
  "diabetic-foot-ulcers-nursing",
  "venous-stasis-ulcers-nursing",
  "arterial-ulcers-nursing-nclex",
  "wound-sepsis-red-flags-nclex",
  "negative-pressure-wound-therapy-npwt",
  "dressing-types-gauze-foam-hydrocolloid-alginate-film",
  "surgical-drain-care-jp-hemovac-penrose",
  "sutures-staples-steri-strips-care",
  "burn-depth-classification-nclex",
  "burn-fluid-resuscitation-parkland-nclex",
  "burn-airway-smoke-inhalation-nclex",
  "burn-wound-care-infection-prevention-nclex",
  "burn-pain-management-nursing-nclex",
  "electrical-chemical-burns-nclex",
  "skin-grafts-donor-site-care-nclex",
  "cellulitis-nursing-care-nclex",
  "mrsa-skin-infection-precautions-nclex",
  "herpes-zoster-nursing-care-nclex",
  "scabies-lice-infection-control-nclex",
  "contact-dermatitis-allergic-skin-reactions-nclex",
  "psoriasis-eczema-nursing-care-nclex",
  "stevens-johnson-syndrome-tens-nclex",
  "melanoma-skin-cancer-warning-signs-nclex",
  "which-wound-care-patient-unstable-nclex",
  "burn-priority-first-actions-nclex",
  "integumentary-priority-first-actions-nclex",
] as const;

describe("RN NCLEX integumentary & wound care expansion catalog", () => {
  it("bundled-only merge includes 36 unique slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_INTEGUMENTARY_WOUND_CARE_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with integumentary topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_INTEGUMENTARY_WOUND_CARE_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_INTEGUMENTARY_WOUND_CARE_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "integumentary");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "integumentary");
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
      for (const slug of RN_NCLEX_INTEGUMENTARY_WOUND_CARE_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "integumentary");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
