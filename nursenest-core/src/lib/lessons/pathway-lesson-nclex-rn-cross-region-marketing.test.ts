/**
 * Canada vs US RN hubs share one NCLEX-RN corpus; rows are often stamped with only one country.
 *
 * Run: `npx tsx --test src/lib/lessons/pathway-lesson-nclex-rn-cross-region-marketing.test.ts`
 */
import assert from "node:assert/strict";
import test from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { sortAndFilterLessonsForPathwayContext } from "@/lib/lessons/pathway-lesson-catalog-sync";

function rnLesson(slug: string, countries: PathwayLessonRecord["countries"]): PathwayLessonRecord {
  return {
    slug,
    title: "Sepsis recognition and escalation",
    topic: "Infection",
    topicSlug: "infection",
    bodySystem: "immune_infectious",
    system: "immune_infectious",
    previewSectionCount: 4,
    seoTitle: "Sepsis recognition and escalation",
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for early sepsis recognition, escalation, and monitoring expectations in acute care.",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: ["NCLEX_RN"],
    countries,
    examMeta: [{ exam: "NCLEX_RN", yieldLevel: "core" }],
  };
}

test("Canada RN hub keeps multiple lessons stamped US-only (NCLEX-RN peer market)", () => {
  const rows = [rnLesson("ca-hub-us-a", ["US"]), rnLesson("ca-hub-us-b", ["US"])];
  const out = sortAndFilterLessonsForPathwayContext("ca-rn-nclex-rn", rows);
  assert.equal(out.length, 2);
});

test("US RN hub keeps CA-only stamps symmetrically", () => {
  const out = sortAndFilterLessonsForPathwayContext("us-rn-nclex-rn", [rnLesson("us-hub-ca", ["CA"])]);
  assert.equal(out.length, 1);
});

test("Non-NCLEX-RN pathways do not apply the US/CA peer stamp (RPN / Rex stays region-scoped)", () => {
  const rex: PathwayLessonRecord = {
    slug: "rex-only-us",
    title: "Venous access maintenance for PN practice",
    topic: "Fundamentals",
    topicSlug: "fundamentals",
    bodySystem: "immune_infectious",
    system: "immune_infectious",
    previewSectionCount: 4,
    seoTitle: "Venous access maintenance for PN practice",
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for maintaining venous access and infection prevention in practical nursing contexts.",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: ["REX_PN"],
    countries: ["US"],
    examMeta: [{ exam: "REX_PN", yieldLevel: "core" }],
  };
  const out = sortAndFilterLessonsForPathwayContext("ca-rpn-rex-pn", [rex]);
  assert.equal(out.length, 0);
});
