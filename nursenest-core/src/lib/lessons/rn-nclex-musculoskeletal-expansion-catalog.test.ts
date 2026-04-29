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

/** Must match `scripts/musculoskeletal-expansion-defs-a.mjs` + `musculoskeletal-expansion-defs-b.mjs` order and slugs. */
export const RN_NCLEX_MUSCULOSKELETAL_EXPANSION_SLUGS = [
  "musculoskeletal-assessment-nurses-nclex",
  "fracture-types-nursing-care-nclex",
  "fracture-complications-fat-embolism-infection-nclex",
  "compartment-syndrome-nclex",
  "cast-care-neurovascular-monitoring-nclex",
  "traction-nursing-care-nclex",
  "amputation-nursing-care-nclex",
  "osteoarthritis-msk-nclex",
  "osteoporosis-msk-nclex",
  "gout-nursing-care-nclex",
  "septic-arthritis-nursing-nclex",
  "osteomyelitis-nursing-nclex",
  "spinal-cord-injury-basics-nclex",
  "mobility-aids-safe-patient-handling-nclex",
  "range-of-motion-exercises-nclex",
  "contractures-prevention-nclex",
  "pain-management-musculoskeletal-nclex",
  "orthopedic-surgery-postoperative-care-nclex",
  "joint-replacement-nursing-care-nclex",
  "neurovascular-assessment-five-ps-nclex",
  "which-musculoskeletal-patient-unstable-nclex",
  "musculoskeletal-prioritization-first-action-nclex",
  "ngn-musculoskeletal-case-studies-nclex",
] as const;

describe("RN NCLEX musculoskeletal expansion catalog", () => {
  it("bundled-only merge includes 23 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_MUSCULOSKELETAL_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with musculoskeletal topic and Musculoskeletal body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_MUSCULOSKELETAL_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_MUSCULOSKELETAL_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "musculoskeletal");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "musculoskeletal");
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
      for (const slug of RN_NCLEX_MUSCULOSKELETAL_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "musculoskeletal");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
