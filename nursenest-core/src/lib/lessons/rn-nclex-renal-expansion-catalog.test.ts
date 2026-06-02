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

/** Must match `scripts/renal-expansion-defs-a.mjs` + `renal-expansion-defs-b.mjs` order and slugs. */
export const RN_NCLEX_RENAL_EXPANSION_SLUGS = [
  "renal-assessment-nurses-nclex",
  "intake-output-monitoring-nclex",
  "urine-characteristics-abnormal-findings-nclex",
  "bun-creatinine-gfr-urinalysis-nclex",
  "fluid-overload-renal-disease-nclex",
  "renal-hypoperfusion-dehydration-nclex",
  "electrolyte-imbalances-kidney-disease-nclex",
  "hyperkalemia-nursing-priorities-nclex",
  "chronic-kidney-disease-nclex",
  "end-stage-kidney-disease-nclex",
  "nephrotic-syndrome-nclex",
  "nephritic-syndrome-nclex",
  "glomerulonephritis-nclex",
  "polycystic-kidney-disease-nclex",
  "renal-artery-stenosis-nclex",
  "urinary-retention-nclex",
  "urinary-incontinence-nclex",
  "bladder-training-kegel-exercises-nclex",
  "urinary-catheter-insertion-sterile-nclex",
  "cauti-prevention-bundles-nclex",
  "bladder-irrigation-clot-retention-nclex",
  "turp-nursing-care-nclex",
  "bph-urinary-obstruction-nclex",
  "kidney-transplant-nursing-care-nclex",
  "dialysis-disequilibrium-syndrome-nclex",
  "av-fistula-graft-complications-nclex",
  "peritoneal-dialysis-exchange-safety-nclex",
  "pd-peritonitis-nclex",
  "renal-diet-fluid-restrictions-nclex",
  "renal-medication-safety-nclex",
  "which-renal-patient-unstable-nclex",
  "renal-prioritization-first-action-nclex",
  "ngn-renal-urinary-case-studies-nclex",
] as const;

describe("RN NCLEX renal expansion catalog", () => {
  it("bundled-only merge includes 33 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_RENAL_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with renal-gu topic and Renal body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_RENAL_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_RENAL_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "renal-gu");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "renal");
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
      for (const slug of RN_NCLEX_RENAL_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "renal-gu");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
