import assert from "node:assert/strict";
import test from "node:test";

import {
  CAREER_COMPARISON_SEEDS,
  CAREER_OUTLOOK_SEEDS,
  EDUCATION_COST_MODEL,
  JOB_MARKET_SIGNAL_SEEDS,
  SALARY_PAGE_SEEDS,
  buildSalaryWorkforceDashboard,
  calculateEducationRoi,
  validateSalaryPageSeed,
} from "./healthcare-salary-workforce-authority-engine";

test("salary database seeds cover requested professions", () => {
  const professions = new Set(SALARY_PAGE_SEEDS.map((seed) => seed.profession));
  for (const profession of ["RN", "RPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW", "Social Work"]) {
    assert.ok(professions.has(profession), `${profession} missing`);
  }
});

test("salary pages include required compensation, demand, and career blocks", () => {
  for (const seed of SALARY_PAGE_SEEDS) {
    assert.deepEqual(validateSalaryPageSeed(seed), []);
    assert.ok(seed.requiredBlocks.includes("average_salary"));
    assert.ok(seed.requiredBlocks.includes("entry_level_salary"));
    assert.ok(seed.requiredBlocks.includes("top_paying_provinces"));
    assert.ok(seed.requiredBlocks.includes("overtime_potential"));
    assert.ok(seed.requiredBlocks.includes("shift_premiums"));
    assert.ok(seed.requiredBlocks.includes("career_outlook"));
  }
});

test("salary pages require source-backed evidence before publication", () => {
  for (const seed of SALARY_PAGE_SEEDS) {
    assert.deepEqual(seed.evidenceRequirements, [
      "government_labor_data",
      "professional_association_data",
      "union_or_collective_agreement",
      "job_posting_sample",
      "last_reviewed_date",
      "methodology_note",
    ]);
  }
});

test("province and specialty salary seeds cover requested examples", () => {
  const titles = new Set(SALARY_PAGE_SEEDS.map((seed) => seed.title));
  for (const title of [
    "RN Salary Ontario",
    "RN Salary Alberta",
    "RN Salary BC",
    "RT Salary Ontario",
    "RT Salary Alberta",
    "Paramedic Salary Ontario",
    "OT Salary Ontario",
    "PT Salary Ontario",
    "MLT Salary Ontario",
    "ICU Nurse Salary",
    "ER Nurse Salary",
    "NICU Nurse Salary",
    "Cardiac Nurse Salary",
    "Psych NP Salary",
    "Family NP Salary",
    "Flight Paramedic Salary",
    "Critical Care RT Salary",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("career outlook pages include demand and workforce shortage blocks", () => {
  assert.deepEqual(CAREER_OUTLOOK_SEEDS.map((seed) => seed.title), [
    "Nursing Job Outlook Canada",
    "RT Job Outlook Canada",
    "Paramedic Job Outlook Canada",
    "OT Job Outlook Canada",
    "PT Job Outlook Canada",
    "MLT Job Outlook Canada",
  ]);
  for (const seed of CAREER_OUTLOOK_SEEDS) {
    assert.deepEqual(seed.requiredBlocks, ["demand", "growth", "workforce_shortages", "future_opportunities", "specialization_opportunities"]);
  }
});

test("career comparison seeds cover requested salary comparisons", () => {
  const titles = CAREER_COMPARISON_SEEDS.map((seed) => seed.title);
  assert.deepEqual(titles, [
    "RN vs RT Salary",
    "RN vs NP Salary",
    "OT vs PT Salary",
    "RT vs Paramedic Salary",
    "RPN vs RN Salary",
    "NP vs Physician Assistant",
  ]);
  for (const seed of CAREER_COMPARISON_SEEDS) {
    assert.deepEqual(seed.comparisonFactors, ["salary", "education_cost", "licensing", "job_demand", "work_life_balance", "career_progression"]);
  }
});

test("education cost model includes full ROI inputs", () => {
  assert.deepEqual(EDUCATION_COST_MODEL, {
    tuition: true,
    books: true,
    licensingFees: true,
    certificationFees: true,
    placementCosts: true,
    livingCosts: true,
    estimatedReturnOnInvestment: true,
  });
});

test("ROI calculator estimates payback and lifetime earnings lift", () => {
  const result = calculateEducationRoi({
    educationCostCents: 2400000,
    expectedAnnualSalaryCents: 8200000,
    currentAnnualIncomeCents: 4200000,
    yearsToComplete: 2,
  });
  assert.equal(result.annualIncomeLiftCents, 4000000);
  assert.equal(result.paybackYears, 2.7);
  assert.equal(result.fiveYearNetCents, 9200000);
  assert.equal(result.tenYearNetCents, 29200000);
});

test("job market database tracks regional demand, hiring trends, shortage areas, and remote opportunities", () => {
  const rnOntario = JOB_MARKET_SIGNAL_SEEDS.find((signal) => signal.profession === "RN" && signal.province === "Ontario");
  assert.ok(rnOntario);
  assert.equal(rnOntario.regionalDemand, "high");
  assert.equal(rnOntario.hiringTrend, "growing");
  assert.equal(rnOntario.shortageArea, true);
  assert.ok(["rare", "some", "common"].includes(rnOntario.remoteOpportunities));
});

test("salary workforce dashboard tracks scale targets", () => {
  const dashboard = buildSalaryWorkforceDashboard();
  assert.equal(dashboard.salaryPages, SALARY_PAGE_SEEDS.length);
  assert.equal(dashboard.outlookPages, CAREER_OUTLOOK_SEEDS.length);
  assert.equal(dashboard.comparisonPages, CAREER_COMPARISON_SEEDS.length);
  assert.equal(dashboard.yearOneTargets.salaryPages, 500);
  assert.equal(dashboard.yearOneTargets.outlookPages, 500);
  assert.equal(dashboard.yearOneTargets.comparisonPages, 250);
  assert.equal(dashboard.yearOneTargets.provincePages, 250);
  assert.equal(dashboard.remainingSalaryPagesTarget, 500 - SALARY_PAGE_SEEDS.length);
});
