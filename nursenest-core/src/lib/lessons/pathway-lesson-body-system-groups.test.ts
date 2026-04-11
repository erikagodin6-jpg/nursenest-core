import assert from "node:assert/strict";
import test from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import {
  buildPathwayLessonSystemSections,
  normalizePathwayLessonSystemLabel,
  PATHWAY_LESSON_SYSTEM_ORDER,
} from "@/lib/lessons/pathway-lesson-body-system-groups";

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

test("normalizes lesson system values into fixed universal system keys", () => {
  assert.equal(normalizePathwayLessonSystemLabel("Cardiovascular"), "cardiovascular");
  assert.equal(normalizePathwayLessonSystemLabel("Pulmonary / Airway"), "respiratory");
  assert.equal(normalizePathwayLessonSystemLabel("Vital signs"), "vital-signs");
  assert.equal(normalizePathwayLessonSystemLabel("Neuro"), "neurological");
  assert.equal(normalizePathwayLessonSystemLabel("Rapid response / unstable"), "clinical-deterioration");
  assert.equal(normalizePathwayLessonSystemLabel("Infection control"), "infection-immunity");
  assert.equal(normalizePathwayLessonSystemLabel("Medication safety"), "pharmacology");
  assert.equal(normalizePathwayLessonSystemLabel("Pediatric"), "special-populations");
  assert.equal(normalizePathwayLessonSystemLabel("Handoff communication"), "communication-safety");
  assert.equal(normalizePathwayLessonSystemLabel(""), "fundamentals");
});

test("buildPathwayLessonSystemSections preserves fixed system sequence", () => {
  const sections = buildPathwayLessonSystemSections([
    lesson({ slug: "neuro-1", title: "Stroke", system: "neurological" }),
    lesson({ slug: "fund-1", title: "Hand hygiene", system: "fundamentals" }),
    lesson({ slug: "resp-1", title: "Asthma", system: "respiratory" }),
    lesson({ slug: "cardio-1", title: "Heart failure", system: "cardiovascular" }),
  ]);

  assert.deepEqual(
    sections.map((section) => section.label),
    ["Cardiovascular", "Respiratory", "Neurological", "Fundamentals"],
  );
  assert.deepEqual(
    sections.flatMap((section) => section.lessons.map((entry) => entry.slug)),
    ["cardio-1", "resp-1", "neuro-1", "fund-1"],
  );
});

test("universal order exposes the required system sequence", () => {
  assert.deepEqual(PATHWAY_LESSON_SYSTEM_ORDER, [
    "cardiovascular",
    "respiratory",
    "vital-signs",
    "neurological",
    "clinical-deterioration",
    "infection-immunity",
    "pharmacology",
    "special-populations",
    "communication-safety",
    "fundamentals",
  ]);
});
