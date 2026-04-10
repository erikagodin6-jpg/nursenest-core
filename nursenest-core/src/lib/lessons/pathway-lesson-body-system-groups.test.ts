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
    bodySystem: overrides.bodySystem ?? "General",
    previewSectionCount: overrides.previewSectionCount ?? 3,
    seoTitle: overrides.seoTitle ?? "Foundations of care",
    seoDescription: overrides.seoDescription ?? "Short descriptor",
    sections: overrides.sections ?? [],
    ...overrides,
  };
}

test("normalizes catalog body-system variants into curriculum labels", () => {
  assert.equal(normalizePathwayLessonSystemLabel("General", "Nursing fundamentals"), "Fundamentals");
  assert.equal(normalizePathwayLessonSystemLabel("Neurologic", "Stroke priorities"), "Neurological");
  assert.equal(normalizePathwayLessonSystemLabel("Immune", "Autoimmune review"), "Hematologic / Immune");
  assert.equal(normalizePathwayLessonSystemLabel("Infection control", "Isolation precautions"), "Fundamentals");
  assert.equal(normalizePathwayLessonSystemLabel("General", "Postpartum hemorrhage"), "Maternity / Newborn");
  assert.equal(normalizePathwayLessonSystemLabel("General", "Pediatric dehydration"), "Pediatrics");
  assert.equal(normalizePathwayLessonSystemLabel("General", "Delegation and prioritization"), "Leadership / Community");
});

test("buildPathwayLessonSystemSections orders grouped lessons by curriculum sequence", () => {
  const sections = buildPathwayLessonSystemSections([
    lesson({ slug: "renal-1", title: "AKI", topic: "Renal", bodySystem: "Renal" }),
    lesson({ slug: "general-1", title: "Foundations", topic: "Fundamentals", bodySystem: "General" }),
    lesson({ slug: "psych-1", title: "Depression care", topic: "Mental Health", bodySystem: "Mental Health" }),
    lesson({ slug: "cardio-1", title: "Heart failure", topic: "Cardiovascular", bodySystem: "Cardiovascular" }),
  ]);

  assert.deepEqual(
    sections.map((section) => section.label),
    ["Fundamentals", "Cardiovascular", "Renal", "Mental Health"],
  );
  assert.deepEqual(
    sections.flatMap((section) => section.lessons.map((entry) => entry.slug)),
    ["general-1", "cardio-1", "renal-1", "psych-1"],
  );
});

test("curriculum order exposes the required system sequence", () => {
  assert.deepEqual(PATHWAY_LESSON_SYSTEM_ORDER, [
    "Fundamentals",
    "Pharmacology",
    "Cardiovascular",
    "Respiratory",
    "Neurological",
    "Gastrointestinal",
    "Renal",
    "Endocrine",
    "Musculoskeletal",
    "Hematologic / Immune",
    "Integumentary",
    "Reproductive",
    "Maternity / Newborn",
    "Pediatrics",
    "Mental Health",
    "Leadership / Community",
  ]);
});
