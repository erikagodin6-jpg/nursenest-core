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

/** Must match `scripts/generate-rn-gi-expansion-catalog.mjs` META order and slugs. */
export const RN_NCLEX_GASTROINTESTINAL_EXPANSION_SLUGS = [
  "abdominal-assessment-nurses-nclex-rn",
  "bowel-sounds-meaning-nclex-rn",
  "ascites-fluid-volume-liver-disease-nclex",
  "jaundice-causes-nursing-implications-nclex",
  "cirrhosis-portal-hypertension-nclex-rn",
  "esophageal-varices-bleeding-risk-nclex",
  "paracentesis-nursing-care-nclex-rn",
  "hepatic-encephalopathy-deep-dive-nclex-rn",
  "hepatitis-abc-overview-nclex-rn",
  "lower-gi-bleed-nclex-rn",
  "melena-hematochezia-hematemesis-nclex",
  "gi-bleed-first-actions-priorities-nclex",
  "crohns-vs-ulcerative-colitis-nclex",
  "diverticulitis-nursing-nclex-rn",
  "irritable-bowel-syndrome-nclex-rn",
  "appendicitis-nursing-priorities-nclex",
  "enteral-feeding-tubes-ng-peg-nclex",
  "tube-feeding-complications-aspiration-nclex",
  "total-parenteral-nutrition-nclex-rn",
  "malnutrition-nutritional-assessment-nclex",
  "postoperative-ileus-nursing-nclex",
  "abdominal-surgery-complications-nclex-rn",
  "ostomy-complications-troubleshooting-nclex",
  "cholecystitis-gallstones-nclex-rn",
  "ercp-nursing-care-nclex-rn",
  "pancreatitis-complications-nclex-rn",
  "gastroenteritis-dehydration-nclex-rn",
  "hepatitis-transmission-prevention-nclex",
  "gi-infection-control-precautions-nclex-rn",
  "acute-abdomen-first-action-nclex",
  "which-gi-patient-unstable-ngn",
  "postoperative-gi-complications-priority-nclex",
] as const;

describe("RN NCLEX gastrointestinal expansion catalog", () => {
  it("bundled-only merge includes 32 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_GASTROINTESTINAL_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with gastrointestinal topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_GASTROINTESTINAL_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_GASTROINTESTINAL_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "gastrointestinal");
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
      for (const slug of RN_NCLEX_GASTROINTESTINAL_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "gastrointestinal");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
