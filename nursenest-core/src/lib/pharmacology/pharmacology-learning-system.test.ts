import assert from "node:assert/strict";
import test from "node:test";
import {
  buildPharmacologyMasteryProfile,
  PHARMACOLOGY_CALCULATION_MODULES,
  PHARMACOLOGY_CATEGORIES,
  PHARMACOLOGY_QUESTION_TYPES,
  PHARMACOLOGY_SAFETY_MODULES,
  pharmacologyCategoriesForTier,
} from "./pharmacology-learning-system";

const REQUIRED_CATEGORY_IDS = [
  "cardiovascular",
  "respiratory",
  "endocrine",
  "gi",
  "neurology",
  "psychiatry",
  "anti-infectives",
  "pain-sedation",
  "critical-care",
  "emergency",
  "maternal-peds",
  "natural-supplements",
  "vitamins-minerals",
  "iv-medications",
  "high-alert",
  "controlled-substances",
  "antimicrobials",
  "oncology",
  "immunology-transplant",
] as const;

const REQUIRED_SECTION_LABELS = [
  "Overview",
  "Mechanism of action",
  "Common medications",
  "Indications",
  "Contraindications",
  "Adverse effects",
  "Nursing implications",
  "Patient teaching",
  "Monitoring",
  "Lab considerations",
  "Exam tips",
  "Clinical pearls",
  "Memory aids",
  "Safety alerts",
  "High-risk situations",
] as const;

test("pharmacology hub includes required medication specialties with class-level learning data", () => {
  const byId = new Map(PHARMACOLOGY_CATEGORIES.map((category) => [category.id, category]));

  for (const id of REQUIRED_CATEGORY_IDS) {
    const category = byId.get(id);
    assert.ok(category, `missing pharmacology specialty ${id}`);
    assert.ok(category.commonMedications.length >= 5, `${id} should expose common medications`);
    assert.ok(category.highRiskSituations.length >= 4, `${id} should expose high-risk situations`);
    assert.ok(category.tierDepth.length >= 1, `${id} should declare tier-appropriate depth`);
    assert.ok(category.topicSlug, `${id} should route to scoped flashcards/questions`);
    assert.ok(category.lessonTopic, `${id} should route to scoped lessons`);
  }
});

test("pharmacology mastery profile exposes medication learning ecosystem requirements", () => {
  for (const category of PHARMACOLOGY_CATEGORIES) {
    const profile = buildPharmacologyMasteryProfile("us-rn-nclex-rn", category);
    const sectionLabels = new Set(profile.sections.map((section) => section.label));

    for (const label of REQUIRED_SECTION_LABELS) {
      assert.ok(sectionLabels.has(label), `${category.id} missing section ${label}`);
    }

    assert.deepEqual(
      profile.modes.map((mode) => mode.key),
      ["learn", "flashcards", "practice", "case_studies", "medication_safety", "administration", "exam", "review"],
    );
    assert.equal(profile.questionBlueprintCount, 100);
    assert.deepEqual(profile.questionTypes, [...PHARMACOLOGY_QUESTION_TYPES]);
    assert.ok(profile.relationshipMap.length >= 5, `${category.id} should map medication relationships`);
    assert.ok(profile.analytics.includes("Drug class mastery"));
    assert.ok(profile.analytics.includes("Medication safety score"));
    assert.ok(profile.analytics.includes("High-risk medication readiness"));
  }
});

test("safety and calculation modules cover high-risk medication training", () => {
  const safetyIds = new Set(PHARMACOLOGY_SAFETY_MODULES.map((module) => module.id));
  const calculationSlugs = new Set(PHARMACOLOGY_CALCULATION_MODULES.map((module) => module.slug));

  for (const id of [
    "lasa",
    "insulin-errors",
    "anticoagulant-errors",
    "opioid-safety",
    "pediatric-dosing",
    "iv-push",
    "chemo-precautions",
    "blood-products",
    "controlled-substances",
    "med-rec",
  ]) {
    assert.ok(safetyIds.has(id), `missing safety module ${id}`);
  }

  for (const slug of [
    "tablets",
    "liquid-medications",
    "weight-based-dosing",
    "pediatric-dosing",
    "iv-flow-rates",
    "drip-factor-gtt-min",
    "iv-pump-ml-hr",
    "insulin-dosing",
    "heparin-protocols",
  ]) {
    assert.ok(calculationSlugs.has(slug), `missing calculation module ${slug}`);
  }
});

test("tier filtering supports learner pathways without creating disconnected pharmacology products", () => {
  for (const tier of ["rn", "pn", "np", "allied", "new_grad", "pre_nursing"] as const) {
    const categories = pharmacologyCategoriesForTier(tier);
    assert.ok(categories.length > 0, `${tier} should have pharmacology coverage`);
    assert.ok(categories.every((category) => category.tierDepth.includes(tier)));
  }
});

test("natural supplement profile emphasizes interactions, contraindications, and patient education", () => {
  const category = PHARMACOLOGY_CATEGORIES.find((item) => item.id === "natural-supplements");
  assert.ok(category);

  const profile = buildPharmacologyMasteryProfile("us-rn-nclex-rn", category);
  const combined = profile.sections.map((section) => `${section.label} ${section.body}`).join(" ").toLowerCase();

  assert.match(combined, /interaction/);
  assert.match(combined, /contraindication/);
  assert.match(combined, /patient teaching/);
});
