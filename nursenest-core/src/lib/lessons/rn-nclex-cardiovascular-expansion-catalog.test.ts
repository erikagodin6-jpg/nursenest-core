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

/** Must match `scripts/generate-rn-cardio-expansion-catalog.mjs` DEFS order and slugs. */
export const RN_NCLEX_CARDIOVASCULAR_EXPANSION_SLUGS = [
  "hemodynamic-monitoring-cvp-map-pawp",
  "arterial-line-blood-pressure-monitoring",
  "cardiac-output-stroke-volume-nclex-rn",
  "mixed-venous-oxygen-saturation-svo2",
  "heart-blocks-degrees-mobitz-nclex-rn",
  "ventricular-dysrhythmias-vt-vf-torsades",
  "pacemakers-icds-nursing-care",
  "ecg-systematic-interpretation-nclex-rn",
  "aortic-stenosis-vs-aortic-regurgitation",
  "mitral-stenosis-vs-mitral-regurgitation",
  "murmur-recognition-nurses-nclex",
  "valve-replacement-postop-nursing-care",
  "cardiac-catheterization-pre-post-care-nclex",
  "pci-stents-complications-nursing-priorities",
  "temporary-pacemaker-bedside-nursing",
  "post-cardiac-surgery-priorities-nclex",
  "chronic-venous-insufficiency-nursing",
  "arterial-ulcers-vs-venous-ulcers",
  "raynaud-phenomenon-nursing-care",
  "varicose-veins-nursing-teaching",
  "antihypertensives-ace-arb-beta-ccb-nclex",
  "antiarrhythmics-nursing-simplified",
  "anticoagulants-antiplatelets-nursing-nclex",
  "digoxin-toxicity-nursing-safety",
  "cardiogenic-shock-assessment-interventions",
  "shock-stages-progression-nclex-rn",
  "hemodynamics-by-shock-type-nclex",
  "hyperlipidemia-atherosclerosis-nursing",
  "statins-teaching-lab-safety",
  "cardiovascular-risk-reduction-nursing",
  "aortic-dissection-priorities-nclex-rn",
  "pericarditis-vs-tamponade-prioritization",
  "chest-pain-first-nursing-action-nclex",
  "post-pci-complications-who-first-nclex",
  "unstable-cardiac-patient-recognition-ngn",
] as const;

describe("RN NCLEX cardiovascular expansion catalog", () => {
  it("bundled-only merge includes 35 unique slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_CARDIOVASCULAR_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with cardiovascular topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_CARDIOVASCULAR_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_CARDIOVASCULAR_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "cardiovascular");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "cardiovascular");
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
      for (const slug of RN_NCLEX_CARDIOVASCULAR_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "cardiovascular");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
