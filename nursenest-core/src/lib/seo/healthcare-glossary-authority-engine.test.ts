import assert from "node:assert/strict";
import test from "node:test";

import {
  GLOSSARY_HUBS,
  HEALTHCARE_GLOSSARY_TERMS,
  buildGlossaryAuthorityDashboard,
  buildGlossaryPageContract,
  getTermsForHub,
  glossaryPriorityScore,
  validateGlossaryTerm,
} from "./healthcare-glossary-authority-engine";

test("master terminology database stores required term metadata", () => {
  const preload = HEALTHCARE_GLOSSARY_TERMS.find((term) => term.slug === "preload");
  assert.ok(preload);
  assert.equal(preload.term, "Preload");
  assert.equal(preload.profession, "RN");
  assert.equal(preload.category, "nursing");
  assert.equal(preload.system, "cardiovascular");
  assert.ok(preload.relatedTerms.includes("afterload"));
  assert.ok(preload.relatedDiseases.includes("heart-failure"));
  assert.ok(preload.relatedLessons.includes("heart-failure"));
});

test("seed terminology covers requested nursing, respiratory, paramedic, lab, and medication terms", () => {
  const slugs = new Set(HEALTHCARE_GLOSSARY_TERMS.map((term) => term.slug));
  for (const slug of [
    "preload",
    "afterload",
    "perfusion",
    "cardiac-output",
    "auscultation",
    "delegation",
    "prioritization",
    "hypoxia",
    "dyspnea",
    "orthopnea",
    "edema",
    "ascites",
    "peep",
    "cpap",
    "bipap",
    "tidal-volume",
    "minute-ventilation",
    "fio2",
    "abg",
    "hypercapnia",
    "hypoxemia",
    "primary-survey",
    "secondary-survey",
    "scene-size-up",
    "rapid-trauma-assessment",
    "gcs",
    "shock-index",
    "hemolysis",
    "anisocytosis",
    "leukocytosis",
    "thrombocytopenia",
    "creatinine-clearance",
    "troponin",
    "bnp",
    "lactate",
    "half-life",
    "bioavailability",
    "peak",
    "trough",
    "therapeutic-range",
    "loading-dose",
    "maintenance-dose",
  ]) {
    assert.ok(slugs.has(slug), `${slug} missing`);
  }
});

test("terminology pages require teaching, search, linking, and conversion blocks", () => {
  const abg = HEALTHCARE_GLOSSARY_TERMS.find((term) => term.slug === "abg");
  assert.ok(abg);
  const contract = buildGlossaryPageContract(abg);

  assert.deepEqual(contract.requiredBlocks, [
    "definition",
    "pronunciation",
    "meaning",
    "clinical_relevance",
    "why_it_matters",
    "examples",
    "common_mistakes",
    "exam_relevance",
    "related_terms",
    "related_lessons",
    "related_questions",
  ]);
  assert.deepEqual(contract.requiredInternalLinks, ["diseases", "labs", "skills", "questions", "lessons", "simulations", "care_plans", "medication_pages"]);
  assert.ok(contract.conversionFeatures.includes("Labs"));
  assert.ok(contract.createAccountCta.includes("free account"));
  assert.ok(contract.premiumPreviewCta.includes("lessons"));
});

test("search intent patterns support what-is, meaning, importance, use, and timing queries", () => {
  for (const term of HEALTHCARE_GLOSSARY_TERMS) {
    assert.deepEqual(term.searchIntentPatterns, ["what_is", "what_does_mean", "why_is_important", "how_is_used", "when_is_used"]);
    assert.deepEqual(validateGlossaryTerm(term), []);
  }
});

test("glossary hubs exist for each learner audience", () => {
  const hubTitles = GLOSSARY_HUBS.map((hub) => hub.title);
  assert.deepEqual(hubTitles, [
    "Nursing Glossary",
    "RT Glossary",
    "Paramedic Glossary",
    "OT Glossary",
    "PT Glossary",
    "MLT Glossary",
    "NP Glossary",
    "Pre-Nursing Glossary",
    "PSW Glossary",
  ]);

  for (const hub of GLOSSARY_HUBS) {
    assert.ok(hub.canonicalPath.startsWith("/glossary/"));
    assert.ok(getTermsForHub(hub).length > 0, `${hub.title} should include terms`);
  }
});

test("dashboard tracks scale target, professions, categories, systems, and visual terms", () => {
  const dashboard = buildGlossaryAuthorityDashboard();
  assert.equal(dashboard.totalTerms, HEALTHCARE_GLOSSARY_TERMS.length);
  assert.equal(dashboard.yearOneTargetMin, 5000);
  assert.equal(dashboard.yearOneTargetMax, 10000);
  assert.equal(dashboard.remainingToMinimumTarget, 5000 - HEALTHCARE_GLOSSARY_TERMS.length);
  assert.ok(dashboard.termsByProfession.RN > 0);
  assert.ok(dashboard.termsByProfession.RT > 0);
  assert.ok(dashboard.termsByProfession.Paramedic > 0);
  assert.ok(dashboard.termsByProfession.MLT > 0);
  assert.ok(dashboard.termsByProfession["Pre-Nursing"] > 0);
  assert.ok(dashboard.termsByCategory.nursing > 0);
  assert.ok(dashboard.termsByCategory.respiratory > 0);
  assert.ok(dashboard.termsByCategory.medication > 0);
  assert.ok(dashboard.termsBySystem.cardiovascular > 0);
  assert.ok(dashboard.visualTerminologyTerms > 0);
});

test("priority scoring favors high-link, visual, multi-profession glossary terms", () => {
  const abg = HEALTHCARE_GLOSSARY_TERMS.find((term) => term.slug === "abg");
  const maintenanceDose = HEALTHCARE_GLOSSARY_TERMS.find((term) => term.slug === "maintenance-dose");
  assert.ok(abg && maintenanceDose);
  assert.ok(glossaryPriorityScore(abg) > glossaryPriorityScore(maintenanceDose));
});
