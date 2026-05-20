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

/** Must match `scripts/fluids-electrolytes-expansion-defs-a.mjs` + `fluids-electrolytes-expansion-defs-b.mjs` order and slugs. */
export const RN_NCLEX_FLUIDS_ELECTROLYTES_EXPANSION_SLUGS = [
  "fluid-compartments-fluid-shifts-nclex",
  "third-spacing-edema-nursing-nclex",
  "intake-output-calculation-nclex",
  "daily-weights-fluid-balance-monitoring-nclex",
  "isotonic-hypotonic-hypertonic-iv-fluids-nclex",
  "iv-fluid-selection-common-conditions-nclex",
  "blood-osmolality-tonicity-nclex",
  "dehydration-vs-hypovolemia-nclex",
  "overhydration-pulmonary-edema-nclex",
  "siadh-deep-dive-fluids-nclex",
  "diabetes-insipidus-deep-dive-fluids-nclex",
  "hyperkalemia-emergency-management-nclex",
  "hypokalemia-nursing-priorities-nclex",
  "hyponatremia-emergency-recognition-nclex",
  "hypernatremia-nursing-priorities-nclex",
  "hypocalcemia-tetany-nursing-nclex",
  "hypercalcemia-nursing-care-nclex",
  "hypomagnesemia-hypermagnesemia-nclex",
  "hypophosphatemia-hyperphosphatemia-nclex",
  "electrolyte-replacement-safety-nclex",
  "potassium-iv-administration-safety-nclex",
  "calcium-gluconate-emergency-use-nclex",
  "sodium-correction-safety-nclex",
  "metabolic-acidosis-nursing-nclex",
  "metabolic-alkalosis-nursing-nclex",
  "respiratory-acidosis-nursing-nclex",
  "respiratory-alkalosis-nursing-nclex",
  "abg-compensation-step-by-step-nclex",
  "anion-gap-metabolic-acidosis-nclex",
  "acid-base-dka-hhs-nclex",
  "acid-base-copd-respiratory-failure-nclex",
  "which-electrolyte-patient-unstable-nclex",
  "fluids-electrolytes-prioritization-first-nclex",
  "ngn-fluids-electrolytes-acid-base-case-studies-nclex",
] as const;

describe("RN NCLEX fluids electrolytes expansion catalog", () => {
  it("bundled-only merge includes 34 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_FLUIDS_ELECTROLYTES_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with fluids-electrolytes topic and Renal body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_FLUIDS_ELECTROLYTES_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_FLUIDS_ELECTROLYTES_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "fluids-electrolytes");
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
      for (const slug of RN_NCLEX_FLUIDS_ELECTROLYTES_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "fluids-electrolytes");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
