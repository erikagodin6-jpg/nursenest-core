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

/** Must match `scripts/splice-hematology-oncology-lessons.mjs` DEFS order and slugs. */
export const RN_NCLEX_HEMATOLOGY_ONCOLOGY_EXPANSION_SLUGS = [
  "cbc-interpretation-nurses",
  "cbc-hgb-hct-platelets-wbc-priorities",
  "iron-deficiency-anemia-nclex",
  "pernicious-anemia-b12-deficiency",
  "folate-deficiency-anemia",
  "aplastic-anemia-nursing",
  "hemolytic-anemia-nursing",
  "thrombocytopenia-bleeding-precautions",
  "hemophilia-nursing-care",
  "disseminated-intravascular-coagulation-dic",
  "dvt-pe-prevention-nursing",
  "anticoagulant-safety-heparin-warfarin-doacs",
  "heparin-induced-thrombocytopenia-hit",
  "blood-product-administration-nursing",
  "blood-components-prbc-platelets-plasma-cryo",
  "transfusion-reactions-first-actions",
  "leukemia-nursing-care",
  "lymphoma-nursing-care",
  "multiple-myeloma-nursing-care",
  "oncologic-emergencies-nclex",
  "tumour-lysis-syndrome-tls",
  "superior-vena-cava-syndrome-svcs",
  "spinal-cord-compression-oncology",
  "hypercalcemia-malignancy",
  "chemotherapy-safety-side-effects",
  "radiation-therapy-nursing-care",
  "immunotherapy-targeted-therapy-basics",
  "cancer-pain-management-nursing",
  "nausea-vomiting-mucositis-cancer-care",
  "cancer-fatigue-nutrition",
  "central-lines-port-care-oncology",
  "bone-marrow-biopsy-nursing-care",
  "stem-cell-bone-marrow-transplant-basics",
  "oncology-infection-risk",
  "palliative-end-of-life-oncology-care",
  "which-hematology-patient-unstable",
  "which-oncology-patient-unstable",
  "hematology-oncology-priority-first-actions",
] as const;

describe("RN NCLEX hematology & oncology expansion catalog", () => {
  it("bundled-only merge includes 38 unique slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_HEMATOLOGY_ONCOLOGY_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with hematology topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_HEMATOLOGY_ONCOLOGY_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_HEMATOLOGY_ONCOLOGY_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "hematology");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "hematologic");
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
      for (const slug of RN_NCLEX_HEMATOLOGY_ONCOLOGY_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "hematology");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
