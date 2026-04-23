import assert from "node:assert/strict";
import test from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import {
  buildPathwayLessonSystemSections,
  normalizePathwayLessonSystemLabel,
  PATHWAY_LESSON_SYSTEM_ORDER,
} from "@/lib/lessons/pathway-lesson-body-system-groups";
import { REVIEW_REQUIRED } from "@/lib/taxonomy/taxonomy";

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

test("normalizes lesson system values: taxonomy ids resolve exactly; empty uses review sentinel", () => {
  assert.equal(normalizePathwayLessonSystemLabel(""), REVIEW_REQUIRED);
  assert.equal(normalizePathwayLessonSystemLabel("Cardiovascular"), "cardiovascular");
  assert.equal(normalizePathwayLessonSystemLabel("cardiovascular"), "cardiovascular");
  assert.equal(normalizePathwayLessonSystemLabel("renal-genitourinary"), "renal_genitourinary");
  assert.equal(normalizePathwayLessonSystemLabel("patient safety quality"), "patient_safety_quality");
  assert.equal(normalizePathwayLessonSystemLabel("Pulmonary / Airway"), "respiratory");
  assert.equal(normalizePathwayLessonSystemLabel("Vital signs"), REVIEW_REQUIRED);
  assert.equal(normalizePathwayLessonSystemLabel("Neuro"), "neurological");
  assert.equal(normalizePathwayLessonSystemLabel("Rapid response / unstable"), REVIEW_REQUIRED);
  assert.equal(normalizePathwayLessonSystemLabel("Infection control"), "immune_infectious");
  assert.equal(normalizePathwayLessonSystemLabel("Medication safety"), "patient_safety_quality");
  assert.equal(normalizePathwayLessonSystemLabel("Pediatric"), "pediatrics");
  assert.equal(normalizePathwayLessonSystemLabel("Handoff communication"), "communication");
});

test("buildPathwayLessonSystemSections preserves config order and only emits non-empty buckets", () => {
  const sections = buildPathwayLessonSystemSections([
    lesson({
      slug: "maternal-1",
      title: "Postpartum hemorrhage",
      bodySystem: "reproductive_obstetrics",
      system: "reproductive_obstetrics",
    }),
    lesson({
      slug: "fund-1",
      title: "Pressure injury prevention",
      bodySystem: "gastrointestinal",
      system: "gastrointestinal",
    }),
    lesson({
      slug: "infect-1",
      title: "Hand hygiene",
      bodySystem: "immune_infectious",
      system: "immune_infectious",
    }),
    lesson({ slug: "cardio-1", title: "Heart failure", bodySystem: "cardiovascular", system: "cardiovascular" }),
    lesson({ slug: "resp-1", title: "Asthma", bodySystem: "respiratory", system: "respiratory" }),
    lesson({ slug: "neuro-1", title: "Stroke", bodySystem: "neurological", system: "neurological" }),
    lesson({
      slug: "med-1",
      title: "Insulin safety",
      bodySystem: "patient_safety_quality",
      system: "patient_safety_quality",
    }),
  ]);

  assert.deepEqual(
    sections.map((section) => section.label),
    [
      "Cardiovascular",
      "Respiratory",
      "Neurology",
      "Gastrointestinal",
      "Immune / Infectious",
      "Reproductive / OB",
      "Patient safety & quality",
    ],
  );
  assert.deepEqual(
    sections.flatMap((section) => section.lessons.map((entry) => entry.slug)),
    ["cardio-1", "resp-1", "neuro-1", "fund-1", "infect-1", "maternal-1", "med-1"],
    );
});

test("PATHWAY_LESSON_SYSTEM_ORDER matches flattened pathway learning categories", () => {
  const cfg = learningConfigForPathwayId(null);
  const expected = cfg.categories.flatMap((category) =>
    category.subcategories?.length ? category.subcategories.map((sub) => sub.id) : [category.id],
  );
  assert.deepEqual(PATHWAY_LESSON_SYSTEM_ORDER, expected);
});

test("classifies lessons into separate buckets when bodySystem is an explicit taxonomy leaf id", () => {
  const sections = buildPathwayLessonSystemSections([
    lesson({ slug: "postpartum-care", title: "Postpartum care", bodySystem: "reproductive_obstetrics" }),
    lesson({ slug: "peds-fever", title: "Pediatric fever", bodySystem: "pediatrics" }),
    lesson({ slug: "cns-pharm", title: "Antipsychotic monitoring", bodySystem: "cns_drugs" }),
  ]);

  assert.deepEqual(
    sections.map((section) => [section.id, section.lessons.map((l) => l.slug)]),
    [
      ["reproductive_obstetrics", ["postpartum-care"]],
      ["pediatrics", ["peds-fever"]],
      ["cns_drugs", ["cns-pharm"]],
    ],
  );
});

test("lessons missing optional bodySystem/system stay in the review sentinel bucket instead of disappearing", () => {
  const sections = buildPathwayLessonSystemSections(
    [
      lesson({ slug: "missing-sys-a", title: "Lesson A", bodySystem: "", system: "" }),
      lesson({ slug: "missing-sys-b", title: "Lesson B", bodySystem: undefined, system: undefined }),
    ],
    "ca-rn-nclex-rn",
  );
  const rr = sections.find((s) => s.id === REVIEW_REQUIRED);
  assert.ok(rr, "expected REVIEW_REQUIRED section");
  assert.equal(rr!.lessons.length, 2);
});
