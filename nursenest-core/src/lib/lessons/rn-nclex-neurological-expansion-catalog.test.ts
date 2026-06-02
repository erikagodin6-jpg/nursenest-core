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

/** Must match `scripts/generate-rn-neuro-expansion-catalog.mjs` META order and slugs. */
export const RN_NCLEX_NEUROLOGICAL_EXPANSION_SLUGS = [
  "glasgow-coma-scale-loc-nclex-rn",
  "neuro-assessment-pupils-motor-speech-sensation",
  "cranial-nerves-nurses-nclex-rn",
  "stroke-ischemic-vs-hemorrhagic-nclex",
  "tia-nursing-priorities-nclex-rn",
  "thrombolytic-stroke-tpa-tnk-safety-nclex",
  "post-stroke-complications-aspiration-prevention",
  "aphasia-dysarthria-neglect-nclex-rn",
  "seizure-types-nursing-priorities-nclex",
  "status-epilepticus-nclex-rn",
  "antiseizure-medications-nclex-rn",
  "traumatic-brain-injury-nursing-nclex",
  "concussion-nursing-care-nclex-rn",
  "skull-fractures-csf-leak-nursing",
  "increased-icp-early-vs-late-signs-nclex",
  "cushings-triad-nclex-rn",
  "brain-herniation-red-flags-nclex",
  "spinal-cord-injury-levels-motor-sensory-nclex",
  "neurogenic-shock-nclex-rn",
  "autonomic-dysreflexia-nursing-deep-dive-nclex",
  "multiple-sclerosis-nursing-nclex",
  "guillain-barre-syndrome-nclex-rn",
  "myasthenia-gravis-nursing-nclex",
  "parkinson-disease-nursing-overview-nclex",
  "alzheimer-dementia-safety-nclex-rn",
  "delirium-vs-dementia-vs-depression-nclex",
  "meningitis-isolation-droplet-contact-nclex",
  "encephalitis-nursing-nclex-rn",
  "migraine-versus-stroke-red-flags-nclex",
  "increased-fall-risk-neuro-patients-nclex",
  "dysphagia-aspiration-precautions-nclex",
  "lumbar-puncture-nursing-care-nclex",
  "eeg-nursing-care-nclex-rn",
  "ct-mri-neuro-diagnostics-nclex",
  "vp-shunt-complications-nclex-rn",
  "brain-tumor-icp-seizure-risk-nclex-rn",
  "bells-palsy-nursing-nclex-rn",
  "trigeminal-neuralgia-nursing-nclex",
  "which-neuro-patient-unstable-ngn",
  "neuro-priority-first-action-nclex-rn",
] as const;

describe("RN NCLEX neurological expansion catalog", () => {
  it("bundled-only merge includes 40 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_NEUROLOGICAL_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with neurological topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_NEUROLOGICAL_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_NEUROLOGICAL_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "neurological");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "neurologic");
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
      for (const slug of RN_NCLEX_NEUROLOGICAL_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "neurological");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
