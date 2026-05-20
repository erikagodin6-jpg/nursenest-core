import assert from "node:assert/strict";
import test from "node:test";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { learningConfigForPathwayId } from "@/lib/pathways/pathway-learning-structure";
import {
  buildPathwayLessonSystemSections,
  classifyLessonForHub,
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

test("lessons with empty bodySystem map to REVIEW_REQUIRED and render in that visible section", () => {
  const lessons = [
    lesson({ slug: "orphan-a", title: "Orphan lesson A", bodySystem: "", system: "" }),
    lesson({ slug: "orphan-b", title: "Orphan lesson B", bodySystem: "  ", system: "" }),
  ];
  const sections = buildPathwayLessonSystemSections(lessons, "ca-rn-nclex-rn");
  const rr = sections.find((s) => s.systemLabel === REVIEW_REQUIRED);
  assert.ok(rr, "expected REVIEW_REQUIRED section in pathway config");
  assert.equal(rr!.lessons.length, 2);
});

test("normalizes lesson system values: taxonomy ids resolve exactly; empty uses review sentinel", () => {
  assert.equal(normalizePathwayLessonSystemLabel(""), REVIEW_REQUIRED);
  assert.equal(normalizePathwayLessonSystemLabel("Cardiovascular"), "cardiovascular");
  assert.equal(normalizePathwayLessonSystemLabel("cardiovascular"), "cardiovascular");
  assert.equal(normalizePathwayLessonSystemLabel("renal-genitourinary"), "renal_genitourinary");
  assert.equal(normalizePathwayLessonSystemLabel("patient safety quality"), "patient_safety_quality");
  assert.equal(normalizePathwayLessonSystemLabel("Pulmonary / Airway"), "respiratory");
  assert.equal(normalizePathwayLessonSystemLabel("Vital signs"), REVIEW_REQUIRED);
  assert.equal(normalizePathwayLessonSystemLabel("Neuro"), "neurological");
  assert.equal(normalizePathwayLessonSystemLabel("Rapid response / unstable"), "patient_safety_quality");
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
      "Neurological",
      "Gastrointestinal",
      "Maternal & Newborn",
      "Infection Control",
      "Safety & Prioritization",
    ],
  );
  assert.deepEqual(
    sections.flatMap((section) => section.lessons.map((entry) => entry.slug)),
    ["cardio-1", "resp-1", "neuro-1", "fund-1", "maternal-1", "infect-1", "med-1"],
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
      ["reproductive_maternal_newborn", ["postpartum-care"]],
      ["pediatrics", ["peds-fever"]],
      ["pharmacology", ["cns-pharm"]],
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

test("RN hub classification uses approved professional and fundamentals/safety categories", () => {
  assert.equal(
    classifyLessonForHub(
      lesson({
        title: "Assignment vs Delegation (NCLEX-RN, Canada)",
        bodySystem: "General",
        system: "General",
      }),
      "ca-rn-nclex-rn",
    ),
    "professional_practice",
  );
  assert.equal(
    classifyLessonForHub(
      lesson({
        title: "Transfusion Reaction Recognition (NCLEX-RN, Canada)",
        bodySystem: "Hematologic",
        system: "Hematologic",
      }),
      "ca-rn-nclex-rn",
    ),
    "fundamentals_safety",
  );
});

test("PN/RPN hub classification groups clinically specific lessons into approved buckets", () => {
  const sections = buildPathwayLessonSystemSections(
    [
      lesson({ slug: "pn-copd", title: "COPD oxygen titration", bodySystem: "General", system: "General" }),
      lesson({
        slug: "rpn-infection",
        title: "Standard precautions and isolation",
        bodySystem: "General",
        system: "General",
      }),
    ],
    "ca-rpn-rex-pn",
  );
  assert.deepEqual(
    sections.map((section) => section.systemLabel),
    ["respiratory", "infection_control"],
  );
});

test("New Grad hub classification uses transition-to-practice categories instead of NCLEX body-system buckets", () => {
  const sections = buildPathwayLessonSystemSections(
    [
      lesson({
        slug: "first-call",
        title: "Your first phone call to a physician as a new nurse",
        topic: "Communication",
        topicSlug: "communication",
        bodySystem: "Professional Practice",
      }),
      lesson({
        slug: "charting",
        title: "Documentation: Keeping up without staying late",
        topic: "Time Management",
        topicSlug: "time-management",
        bodySystem: "Professional Practice",
      }),
      lesson({
        slug: "delegation",
        title: "What can and can't be delegated to CNAs and PCTs",
        topic: "Delegation",
        topicSlug: "delegation",
        bodySystem: "Professional Practice",
      }),
      lesson({
        slug: "post-op",
        title: "Post-op return patients: What to watch first",
        topic: "Prioritization",
        topicSlug: "prioritization",
        bodySystem: "Professional Practice",
      }),
    ],
    "us-rn-new-grad-transition",
  );

  assert.deepEqual(
    sections.map((section) => [section.id, section.label, section.lessons.map((l) => l.slug)]),
    [
      ["pacu", "PACU", ["post-op"]],
      ["assessments-documentation", "Assessments and Documentation", ["charting"]],
      ["prioritization-delegation", "Prioritization and Delegation", ["delegation"]],
      ["communication-escalation", "Communication and Escalation", ["first-call"]],
    ],
  );
});

test("NP hub classification keeps unique clinical signals and sends unsafe multi-system overlays to review", () => {
  assert.equal(
    classifyLessonForHub(
      lesson({
        title: "ABG & acid-base - NP interpretation (FNP)",
        bodySystem: "General",
        system: "General",
      }),
      "us-np-fnp",
    ),
    "diagnostics_clinical_reasoning",
  );
  assert.equal(
    classifyLessonForHub(
      lesson({
        title: "Differential, prescribing & chronic care - NP core (FNP)",
        bodySystem: "General",
        system: "General",
      }),
      "us-np-fnp",
    ),
    REVIEW_REQUIRED,
  );
});

test("Allied Health hub classification groups lessons by occupation instead of nursing body systems", () => {
  const sections = buildPathwayLessonSystemSections(
    [
      lesson({
        slug: "allied-imaging",
        title: "Imaging Basics for new technologists",
        topic: "Fundamentals",
        topicSlug: "fundamentals",
        bodySystem: "Professional Practice",
      }),
      lesson({
        slug: "allied-labs",
        title: "Lab Values and specimen quality control",
        topic: "Fundamentals",
        topicSlug: "fundamentals",
        bodySystem: "Professional Practice",
      }),
      lesson({
        slug: "allied-meds",
        title: "Medication Safety for allied staff",
        topic: "Pharmacology",
        topicSlug: "pharmacology",
        bodySystem: "Professional Practice",
      }),
      lesson({
        slug: "allied-assessment",
        title: "Patient Assessment and Vital Signs in urgent response",
        topic: "Fundamentals",
        topicSlug: "fundamentals",
        bodySystem: "Professional Practice",
      }),
    ],
    "us-allied-core",
  );

  assert.deepEqual(
    sections.map((section) => [section.id, section.label, section.lessons.map((l) => l.slug)]),
    [
      ["radiologic-technology", "Radiologic Technologist / X-ray", ["allied-imaging"]],
      ["mlt", "Medical Laboratory Technologist", ["allied-labs"]],
      ["pharmacy-tech", "Pharmacy Technician", ["allied-meds"]],
      ["paramedic", "Paramedic", ["allied-assessment"]],
    ],
  );
});

test("public hub sections never display an unknown category label", () => {
  const sections = buildPathwayLessonSystemSections(
    [
      lesson({ slug: "rn-qI", title: "QI & Incident Reporting", bodySystem: "General", system: "General" }),
      lesson({ slug: "ambiguous", title: "MI and COPD combined management", bodySystem: "General", system: "General" }),
    ],
    "us-rn-nclex-rn",
  );
  assert.ok(sections.length > 0);
  assert.ok(sections.every((section) => !section.id.toLowerCase().includes("unknown")));
  assert.ok(sections.every((section) => !section.label.toLowerCase().includes("unknown")));
  assert.ok(sections.some((section) => section.systemLabel === "fundamentals_safety"));
  assert.ok(sections.some((section) => section.systemLabel === REVIEW_REQUIRED));
});
