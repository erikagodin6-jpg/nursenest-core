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

/** Must match `scripts/generate-rn-infection-control-expansion-catalog.mjs` META order and slugs. */
export const RN_NCLEX_INFECTION_CONTROL_EXPANSION_SLUGS = [
  "chain-of-infection-nclex-rn",
  "standard-precautions-deep-dive-nclex-rn",
  "hand-hygiene-aseptic-technique-nclex-rn",
  "ppe-donning-doffing-sequence-nclex-rn",
  "contact-precautions-nursing-nclex-rn",
  "droplet-precautions-nursing-nclex-rn",
  "airborne-precautions-nursing-nclex-rn",
  "neutropenic-protective-precautions-nclex-rn",
  "transmission-based-precautions-room-ppe-nclex-rn",
  "healthcare-associated-infections-nclex-rn",
  "cauti-prevention-bundle-nclex-rn",
  "clabsi-prevention-bundle-nclex-rn",
  "vap-prevention-bundle-nclex-rn",
  "surgical-site-infection-prevention-nclex-rn",
  "c-difficile-contact-precautions-nclex-rn",
  "mrsa-vre-contact-precautions-nclex-rn",
  "tuberculosis-isolation-negative-pressure-nclex-rn",
  "meningitis-droplet-precautions-nclex-rn",
  "influenza-respiratory-droplet-precautions-nclex-rn",
  "covid-19-viral-infection-control-nclex-rn",
  "needlestick-bloodborne-pathogen-exposure-nclex-rn",
  "hiv-hbv-hcv-exposure-follow-up-nclex-rn",
  "post-exposure-prophylaxis-basics-nclex-rn",
  "antibiotic-stewardship-nursing-nclex-rn",
  "culture-collection-before-antibiotics-nclex-rn",
  "fever-infection-workup-nclex-rn",
  "immunocompromised-infection-risk-nclex-rn",
  "sepsis-screening-escalation-nclex-rn",
  "septic-shock-nursing-priorities-nclex-rn",
  "wound-infection-colonization-dehiscence-nclex-rn",
  "cleaning-disinfection-sterilization-nclex-rn",
  "patient-placement-cohorting-nclex-rn",
  "infection-control-priority-first-action-nclex-rn",
  "which-infection-control-patient-unstable-ngn",
  "ngn-infection-control-case-studies-nclex-rn",
] as const;

describe("RN NCLEX infection control expansion catalog", () => {
  it("bundled-only merge includes 35 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_INFECTION_CONTROL_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with infection-control topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_INFECTION_CONTROL_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_INFECTION_CONTROL_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "infection-control");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "infection control");
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
      for (const slug of RN_NCLEX_INFECTION_CONTROL_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "infection-control");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
