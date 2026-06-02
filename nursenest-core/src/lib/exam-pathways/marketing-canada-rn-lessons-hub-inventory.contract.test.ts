/**
 * Contract: Canada RN NCLEX-RN marketing hub inventory must not collapse many distinct public slugs
 * (same pipeline as `/canada/rn/nclex-rn/lessons` prepare + section model, without DB).
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import test from "node:test";
import { prepareLessonsForHubCurriculum } from "@/components/pathway-lessons/pathway-lessons-curriculum-hub";
import { buildPathwayLessonSystemSections } from "@/lib/lessons/pathway-lesson-body-system-groups";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";

function hubRow(i: number): PathwayLessonRecord {
  return {
    slug: `ca-rn-lesson-${i}`,
    title: `Clinical topic ${i}`,
    topic: "Topic",
    topicSlug: "infection",
    bodySystem: "cardiovascular",
    system: "cardiovascular",
    previewSectionCount: 2,
    seoTitle: `Clinical topic ${i}`,
    seoDescription:
      "Clinical framing, safety cues, prioritization patterns, and exam-style rationale for this topic in nursing practice.",
    sections: [],
    structuralQuality: { publicComplete: true },
    exams: ["NCLEX_RN" as const],
    countries: ["CA" as const, "US" as const],
  } as PathwayLessonRecord;
}

test("Canada RN hub prepare + sections retain many lessons with shared body system", () => {
  const base = "/canada/rn/nclex-rn/lessons";
  const pathwayId = "ca-rn-nclex-rn";
  const rows = Array.from({ length: 12 }, (_, i) => hubRow(i));
  const prepared = prepareLessonsForHubCurriculum(rows, { pathwayId, lessonsBasePath: base });
  assert.equal(
    prepared.length,
    12,
    "prepareLessonsForHubCurriculum must not collapse distinct slugs (organize slug-only)",
  );
  const sections = buildPathwayLessonSystemSections(prepared, pathwayId);
  const totalInSections = sections.reduce((n, s) => n + s.lessons.length, 0);
  assert.equal(totalInSections, 12);
});
