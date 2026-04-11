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
  assert.equal(normalizePathwayLessonSystemLabel("Pediatric"), "pediatrics");
  assert.equal(normalizePathwayLessonSystemLabel("Handoff communication"), "communication");
  assert.equal(normalizePathwayLessonSystemLabel(""), "fundamentals");
});

test("buildPathwayLessonSystemSections preserves fixed system sequence", () => {
  const sections = buildPathwayLessonSystemSections([
    lesson({ slug: "maternal-1", title: "Postpartum hemorrhage", system: "maternal" }),
    lesson({ slug: "fund-1", title: "Pressure injury prevention", system: "fundamentals" }),
    lesson({ slug: "infect-1", title: "Hand hygiene", system: "fundamentals" }),
    lesson({ slug: "cardio-1", title: "Heart failure", system: "cardiovascular" }),
    lesson({ slug: "resp-1", title: "Asthma", system: "respiratory" }),
    lesson({ slug: "neuro-1", title: "Stroke", system: "neurological" }),
    lesson({ slug: "med-1", title: "Insulin safety", system: "medication safety" }),
  ]);

  assert.deepEqual(
    sections.map((section) => section.label),
    ["Cardiac", "Respiratory", "Neurological", "Medications & Pharmacology", "Infection Control", "Maternal & Newborn", "Fundamentals"],
  );
  assert.deepEqual(
    sections.flatMap((section) => section.lessons.map((entry) => entry.slug)),
    ["cardio-1", "resp-1", "neuro-1", "med-1", "infect-1", "maternal-1", "fund-1"],
  );
});

test("universal order exposes the required system sequence", () => {
  assert.deepEqual(PATHWAY_LESSON_SYSTEM_ORDER, [
    "cardiovascular",
    "respiratory",
    "neurological",
    "vital-signs",
    "clinical-deterioration",
    "pharmacology",
    "infection-immunity",
    "maternal-newborn",
    "pediatrics",
    "mental-health",
    "special-populations",
    "communication",
    "safety",
    "fundamentals",
  ]);
});

test("classifies maternal, pediatric, and mental health lessons into separate learner-facing sections", () => {
  const sections = buildPathwayLessonSystemSections([
    lesson({ slug: "postpartum-care", title: "Postpartum care", bodySystem: "Maternal and newborn" }),
    lesson({ slug: "peds-fever", title: "Pediatric fever", bodySystem: "Pediatrics" }),
    lesson({ slug: "therapeutic-communication-anxiety", title: "Therapeutic communication for anxiety", bodySystem: "Mental health" }),
  ]);

  assert.deepEqual(
    sections.map((section) => [section.id, section.label]),
    [
      ["maternal-newborn", "Maternal & Newborn"],
      ["pediatrics", "Pediatrics"],
      ["mental-health", "Mental Health"],
    ],
  );
});
