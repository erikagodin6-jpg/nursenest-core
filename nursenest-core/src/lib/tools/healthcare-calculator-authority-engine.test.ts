import assert from "node:assert/strict";
import test from "node:test";

import {
  CLINICAL_TOOL_HUBS,
  HEALTHCARE_CALCULATOR_TOOLS,
  buildClinicalToolAuthorityDashboard,
  clinicalToolPriorityScore,
  getToolsForHub,
  validateClinicalToolPage,
} from "./healthcare-calculator-authority-engine";

test("calculator registry includes requested nursing calculators", () => {
  const titles = new Set(HEALTHCARE_CALCULATOR_TOOLS.map((tool) => tool.title));
  for (const title of [
    "IV Flow Rate Calculator",
    "Medication Dosage Calculator",
    "Weight-Based Medication Calculator",
    "Pediatric Dosage Calculator",
    "Drip Rate Calculator",
    "Infusion Rate Calculator",
    "Fluid Balance Calculator",
    "Burn Surface Area Calculator",
    "BMI Calculator",
    "Pain Assessment Tool",
    "Braden Scale Calculator",
    "Morse Fall Scale Calculator",
    "Glasgow Coma Scale Calculator",
    "APGAR Calculator",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("calculator registry includes RT, paramedic, lab, NP, and pre-nursing tools", () => {
  const titles = new Set(HEALTHCARE_CALCULATOR_TOOLS.map((tool) => tool.title));
  for (const title of [
    "ABG Interpretation Tool",
    "A-a Gradient Calculator",
    "PaO2/FiO2 Ratio Calculator",
    "Ventilator Settings Calculator",
    "Shock Index Calculator",
    "Trauma Score Calculator",
    "Anion Gap Calculator",
    "Corrected Sodium Calculator",
    "Creatinine Clearance Calculator",
    "ASCVD Risk Calculator",
    "CHA2DS2-VASc Calculator",
    "Wells Score",
    "PHQ-9",
    "GAD-7",
    "Unit Conversion Calculator",
    "Medication Math Practice Generator",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("every tool supports free calculator use and account-gated saved value", () => {
  for (const tool of HEALTHCARE_CALCULATOR_TOOLS) {
    assert.equal(tool.freeVisitorUse, true);
    assert.deepEqual(tool.accountRequiredActions, ["saved_calculations", "history", "study_notes", "bookmarks", "advanced_reports"]);
    assert.deepEqual(validateClinicalToolPage(tool), []);
  }
});

test("every tool has calculator mode, learning mode, and SEO page blocks", () => {
  for (const tool of HEALTHCARE_CALCULATOR_TOOLS) {
    assert.deepEqual(tool.modes, ["calculator_mode", "learning_mode"]);
    assert.deepEqual(tool.learningModeBlocks, ["formula", "explanation", "clinical_significance", "interpretation", "examples"]);
    assert.ok(tool.pageBlocks.includes("what_it_is"));
    assert.ok(tool.pageBlocks.includes("clinical_interpretation"));
    assert.ok(tool.pageBlocks.includes("common_mistakes"));
    assert.ok(tool.pageBlocks.includes("practice_examples"));
    assert.ok(tool.pageBlocks.includes("related_lessons"));
    assert.ok(tool.pageBlocks.includes("related_simulations"));
  }
});

test("tool hubs exist and include profession-specific tools", () => {
  assert.deepEqual(CLINCIAL_TOOL_HUB_TITLES(), ["Nursing Tools", "RT Tools", "Paramedic Tools", "NP Tools", "Lab Tools", "Pre-Nursing Tools"]);
  for (const hub of CLINICAL_TOOL_HUBS) {
    assert.ok(hub.canonicalPath.startsWith("/tools/"));
    assert.ok(hub.toolSlugs.length > 0, `${hub.title} should include tools`);
    assert.equal(getToolsForHub(hub.key).length, hub.toolSlugs.length);
  }
});

test("dashboard tracks scale targets, hubs, categories, professions, and learning coverage", () => {
  const dashboard = buildClinicalToolAuthorityDashboard();
  assert.equal(dashboard.totalTools, HEALTHCARE_CALCULATOR_TOOLS.length);
  assert.equal(dashboard.yearOneTarget, 100);
  assert.equal(dashboard.yearTwoTarget, 250);
  assert.equal(dashboard.yearThreeTarget, 500);
  assert.equal(dashboard.remainingToYearOneTarget, 100 - HEALTHCARE_CALCULATOR_TOOLS.length);
  assert.equal(dashboard.freeUseTools, HEALTHCARE_CALCULATOR_TOOLS.length);
  assert.equal(dashboard.learningModeCoverage, HEALTHCARE_CALCULATOR_TOOLS.length);
  assert.ok(dashboard.toolsByHub.nursing_tools > 0);
  assert.ok(dashboard.toolsByHub.rt_tools > 0);
  assert.ok(dashboard.toolsByHub.paramedic_tools > 0);
  assert.ok(dashboard.toolsByHub.lab_tools > 0);
  assert.ok(dashboard.toolsByCategory.medication_math > 0);
  assert.ok(dashboard.toolsByCategory.lab_interpretation > 0);
  assert.ok(dashboard.toolsByProfession.RN > 0);
  assert.ok(dashboard.toolsByProfession.RT > 0);
});

test("priority score favors highly linkable learning-mode tools", () => {
  const anionGap = HEALTHCARE_CALCULATOR_TOOLS.find((tool) => tool.slug === "anion-gap-calculator");
  assert.ok(anionGap);
  assert.ok(clinicalToolPriorityScore(anionGap) >= 80);
});

function CLINCIAL_TOOL_HUB_TITLES(): string[] {
  return CLINICAL_TOOL_HUBS.map((hub) => hub.title);
}
