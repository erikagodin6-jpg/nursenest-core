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

/** Must match `scripts/generate-rn-leadership-delegation-expansion-catalog.mjs` META order and slugs. */
export const RN_NCLEX_LEADERSHIP_DELEGATION_EXPANSION_SLUGS = [
  "five-rights-delegation-nclex-rn",
  "scope-rn-rpn-uap-nclex-rn",
  "stable-unstable-delegation-nclex-rn",
  "tasks-appropriate-delegation-nclex-rn",
  "tasks-never-delegated-nclex-rn",
  "prioritization-vs-delegation-nclex-rn",
  "assigning-patients-acuity-nclex-rn",
  "time-management-nurses-nclex-rn",
  "shift-planning-workflow-nclex-rn",
  "charge-nurse-responsibilities-nclex-rn",
  "team-communication-leadership-nclex-rn",
  "conflict-resolution-healthcare-nclex-rn",
  "chain-of-command-nclex-rn",
  "sbar-communication-tools-nclex-rn",
  "documentation-legal-accountability-nclex-rn",
  "informed-consent-nurse-responsibility-nclex-rn",
  "incident-reporting-vs-charting-nclex-rn",
  "patient-advocacy-practice-nclex-rn",
  "ethical-principles-nursing-nclex-rn",
  "moral-distress-burnout-nclex-rn",
  "workplace-safety-nurse-protection-nclex-rn",
  "handling-unsafe-orders-nclex-rn",
  "refusal-of-assignment-nclex-rn",
  "interprofessional-collaboration-nclex-rn",
  "cultural-competence-leadership-nclex-rn",
  "delegation-emergency-situations-nclex-rn",
  "disaster-leadership-triage-nclex-rn",
  "quality-improvement-patient-safety-nclex-rn",
  "root-cause-analysis-basics-nclex-rn",
  "which-task-delegated-nclex-rn",
  "which-patient-see-first-leadership-nclex-rn",
  "leadership-prioritization-first-action-nclex-rn",
  "ngn-leadership-delegation-case-studies-nclex-rn",
] as const;

describe("RN NCLEX leadership & delegation expansion catalog", () => {
  it("bundled-only merge includes 33 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_LEADERSHIP_DELEGATION_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with leadership topic", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_LEADERSHIP_DELEGATION_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_LEADERSHIP_DELEGATION_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "leadership");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "general");
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
      for (const slug of RN_NCLEX_LEADERSHIP_DELEGATION_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "leadership");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
