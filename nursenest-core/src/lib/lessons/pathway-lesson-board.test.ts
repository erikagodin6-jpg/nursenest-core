import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { buildPathwayLessonBoard } from "@/lib/lessons/pathway-lesson-board";

function lesson(overrides: Partial<PathwayLessonRecord>): PathwayLessonRecord {
  return {
    slug: overrides.slug ?? "lesson-1",
    title: overrides.title ?? "Foundations of care",
    topic: overrides.topic ?? "Fundamentals",
    topicSlug: overrides.topicSlug ?? "fundamentals",
    system: overrides.system ?? "fundamentals",
    bodySystem: overrides.bodySystem ?? "General",
    previewSectionCount: overrides.previewSectionCount ?? 3,
    seoTitle: overrides.seoTitle ?? "Foundations of care",
    seoDescription: overrides.seoDescription ?? "Short descriptor",
    sections: overrides.sections ?? [],
    ...overrides,
  };
}

test("buildPathwayLessonBoard returns pathway-specific category sets", () => {
  const rnPathway = getExamPathwayById("us-rn-nclex-rn");
  const npPathway = getExamPathwayById("us-np-fnp");
  const alliedPathway = getExamPathwayById("us-allied-core");
  assert.ok(rnPathway);
  assert.ok(npPathway);
  assert.ok(alliedPathway);

  const rnBoard = buildPathwayLessonBoard({
    pathway: rnPathway,
    lessons: [
      lesson({
        slug: "hf",
        title: "Heart failure",
        topic: "Cardiac",
        topicSlug: "cardiac",
        bodySystem: "Cardiovascular",
      }),
      lesson({
        slug: "postpartum",
        title: "Postpartum hemorrhage",
        topic: "Maternal",
        topicSlug: "maternal",
        bodySystem: "Maternal and newborn",
      }),
      lesson({
        slug: "handoff",
        title: "Safe handoff communication",
        topic: "Safety",
        topicSlug: "safety",
        bodySystem: "Communication",
      }),
    ],
    progressMap: {},
  });

  const npBoard = buildPathwayLessonBoard({
    pathway: npPathway,
    lessons: [
      lesson({
        slug: "dm",
        title: "Type 2 diabetes outpatient follow-up",
        topic: "Primary care",
        topicSlug: "primary-care",
        bodySystem: "Endocrine primary care",
      }),
      lesson({
        slug: "well-child",
        title: "Pediatric well-child prevention",
        topic: "Pediatrics",
        topicSlug: "pediatrics",
        bodySystem: "Pediatric primary care",
      }),
      lesson({
        slug: "insomnia",
        title: "Insomnia and OSA in primary care",
        topic: "Behavioral health",
        topicSlug: "behavioral-health",
        bodySystem: "Behavioral health",
      }),
    ],
    progressMap: {},
  });

  const alliedBoard = buildPathwayLessonBoard({
    pathway: alliedPathway,
    lessons: [
      lesson({
        slug: "abg",
        title: "ABG interpretation basics",
        topic: "Diagnostics",
        topicSlug: "diagnostics",
        bodySystem: "Respiratory diagnostics",
      }),
      lesson({
        slug: "sterile-technique",
        title: "Sterile field setup",
        topic: "Patient safety",
        topicSlug: "safety",
        bodySystem: "Clinical safety",
      }),
      lesson({
        slug: "scope-boundaries",
        title: "Scope boundaries and delegation",
        topic: "Professional practice",
        topicSlug: "professional-practice",
        bodySystem: "Professional practice",
      }),
    ],
    progressMap: {},
  });

  assert.deepEqual(
    rnBoard.sections.map((section) => section.label),
    ["Cardiac and respiratory", "Maternal and pediatrics", "Fundamentals and safety"],
  );
  assert.deepEqual(
    npBoard.sections.map((section) => section.label),
    ["Core primary care", "Behavioral health", "Women, children, and family care"],
  );
  assert.deepEqual(
    alliedBoard.sections.map((section) => section.label),
    ["Diagnostics and procedures", "Patient care and safety", "Professional practice"],
  );
});

test("buildPathwayLessonBoard calculates completion counts and overflow rows", () => {
  const pathway = getExamPathwayById("ca-rpn-rex-pn");
  assert.ok(pathway);

  const board = buildPathwayLessonBoard({
    pathway,
    lessons: [
      lesson({ slug: "found-1", title: "Vitals review", topic: "Fundamentals", topicSlug: "fundamentals", bodySystem: "Vital signs" }),
      lesson({ slug: "found-2", title: "Medication safety", topic: "Safety", topicSlug: "safety", bodySystem: "Medication safety" }),
      lesson({ slug: "found-3", title: "Isolation precautions", topic: "Safety", topicSlug: "safety", bodySystem: "Infection control" }),
      lesson({ slug: "found-4", title: "Therapeutic communication", topic: "Communication", topicSlug: "communication", bodySystem: "Communication" }),
      lesson({ slug: "found-5", title: "Pain assessment", topic: "Fundamentals", topicSlug: "fundamentals", bodySystem: "General" }),
      lesson({ slug: "found-6", title: "Fall prevention", topic: "Safety", topicSlug: "safety", bodySystem: "Safety" }),
    ],
    progressMap: {
      "found-1": "completed",
      "found-2": "completed",
      "found-3": "in_progress",
    },
  });

  assert.equal(board.sections.length, 1);
  assert.equal(board.sections[0]?.label, "Foundations and safety");
  assert.equal(board.sections[0]?.completedCount, 2);
  assert.equal(board.sections[0]?.totalCount, 6);
  assert.equal(board.sections[0]?.progressPercent, 33);
  assert.equal(board.sections[0]?.visibleRows.length, 5);
  assert.equal(board.sections[0]?.overflowCount, 1);
  assert.deepEqual(
    board.sections[0]?.visibleRows.map((row) => row.status),
    ["completed", "completed", "in_progress", "not_started", "not_started"],
  );
});
