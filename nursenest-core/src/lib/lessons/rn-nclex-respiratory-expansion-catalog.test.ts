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

/** Must match `scripts/respiratory-expansion-defs-a.mjs` + `respiratory-expansion-defs-b.mjs` order and slugs. */
export const RN_NCLEX_RESPIRATORY_EXPANSION_SLUGS = [
  "respiratory-assessment-ipap-nclex",
  "oxygen-delivery-devices-nclex",
  "oxygen-therapy-safety-titration-nclex",
  "hypoxia-vs-hypoxemia-nclex",
  "early-late-respiratory-distress-signs-nclex",
  "airway-obstruction-stridor-nclex",
  "suctioning-techniques-oral-np-tracheal-nclex",
  "incentive-spirometry-pulmonary-hygiene-nclex",
  "atelectasis-nursing-care-nclex",
  "acute-vs-chronic-bronchitis-nclex",
  "upper-respiratory-infections-nclex",
  "laryngitis-epiglottitis-nclex",
  "cystic-fibrosis-nursing-care-nclex",
  "lung-cancer-nursing-care-nclex",
  "thoracentesis-nursing-care-nclex",
  "pneumothorax-simple-tension-nclex",
  "hemothorax-nursing-care-nclex",
  "chest-tube-troubleshooting-nclex",
  "mechanical-ventilation-basics-nclex",
  "ventilator-alarms-troubleshooting-nclex",
  "weaning-mechanical-ventilation-nclex",
  "tracheostomy-care-emergency-nclex",
  "abg-compensation-patterns-advanced-nclex",
  "respiratory-acidosis-alkalosis-clinical-nclex",
  "sleep-apnea-nursing-care-nclex",
  "pulmonary-hypertension-nursing-nclex",
  "occupational-lung-disease-nclex",
  "covid19-viral-pneumonia-nursing-nclex",
  "airborne-droplet-contact-respiratory-precautions-nclex",
  "which-respiratory-patient-unstable-nclex",
  "respiratory-prioritization-first-action-nclex",
  "ngn-respiratory-case-studies-nclex",
] as const;

describe("RN NCLEX respiratory expansion catalog", () => {
  it("bundled-only merge includes 32 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_RESPIRATORY_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with respiratory topic and Respiratory body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_RESPIRATORY_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_RESPIRATORY_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "respiratory");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "respiratory");
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
      for (const slug of RN_NCLEX_RESPIRATORY_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "respiratory");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
