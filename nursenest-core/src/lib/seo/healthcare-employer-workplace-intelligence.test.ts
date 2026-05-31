import assert from "node:assert/strict";
import test from "node:test";

import {
  CLINICAL_PLACEMENT_CONNECTIONS,
  EMPLOYER_DIRECTORY_SEEDS,
  EMPLOYER_INTERVIEW_GUIDE_SEEDS,
  NEW_GRAD_PROGRAM_SEEDS,
  PROFESSION_EMPLOYER_PAGE_SEEDS,
  SPECIALTY_CAREER_GUIDE_SEEDS,
  WORKPLACE_COMPARISON_SEEDS,
  WORKPLACE_CULTURE_BLOCKS,
  buildEmployerWorkplaceDashboard,
  getEmployerProfile,
  validateEmployerProfile,
} from "./healthcare-employer-workplace-intelligence";

test("employer directory seeds cover requested Canadian employers", () => {
  const names = new Set(EMPLOYER_DIRECTORY_SEEDS.map((seed) => seed.name));
  for (const name of [
    "Hamilton Health Sciences",
    "University Health Network",
    "SickKids",
    "Sunnybrook",
    "London Health Sciences Centre",
    "Alberta Health Services",
    "Fraser Health",
    "Interior Health",
    "Nova Scotia Health",
  ]) {
    assert.ok(names.has(name), `${name} missing`);
  }
});

test("employer profiles include required profile blocks and source requirements", () => {
  for (const seed of EMPLOYER_DIRECTORY_SEEDS) {
    assert.deepEqual(validateEmployerProfile(seed), []);
    assert.ok(seed.requiredBlocks.includes("new_graduate_programs"));
    assert.ok(seed.requiredBlocks.includes("residencies"));
    assert.ok(seed.requiredBlocks.includes("clinical_placements"));
    assert.ok(seed.requiredBlocks.includes("professional_development"));
    assert.ok(seed.evidenceRequirements.includes("official_employer_source"));
    assert.ok(seed.evidenceRequirements.includes("last_reviewed_date"));
  }
});

test("profession-specific employer pages cover requested examples", () => {
  const titles = new Set(PROFESSION_EMPLOYER_PAGE_SEEDS.map((seed) => seed.title));
  for (const title of [
    "Nursing At Hamilton Health Sciences",
    "Respiratory Therapy At SickKids",
    "Paramedic Careers In Toronto",
    "Occupational Therapy At UHN",
    "Physiotherapy At Sunnybrook",
    "MLT Careers In Ontario",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("new graduate program database covers nursing, RT, paramedic, OT, and PT", () => {
  const titles = new Set(NEW_GRAD_PROGRAM_SEEDS.map((seed) => seed.title));
  for (const title of [
    "New Graduate Nursing Programs",
    "Nurse Residency Programs",
    "RT New Graduate Programs",
    "Paramedic Orientation Programs",
    "OT New Graduate Opportunities",
    "PT New Graduate Opportunities",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("workplace comparisons cover employer, setting, and specialty comparisons", () => {
  const titles = new Set(WORKPLACE_COMPARISON_SEEDS.map((seed) => seed.title));
  for (const title of ["Hamilton Health Sciences vs UHN", "Sunnybrook vs SickKids", "Community vs Hospital Nursing", "ICU vs Emergency Nursing", "RT Acute Care vs Community RT"]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
  assert.ok(WORKPLACE_COMPARISON_SEEDS.some((seed) => seed.comparisonKind === "employer_vs_employer"));
  assert.ok(WORKPLACE_COMPARISON_SEEDS.some((seed) => seed.comparisonKind === "setting_vs_setting"));
  assert.ok(WORKPLACE_COMPARISON_SEEDS.some((seed) => seed.comparisonKind === "specialty_vs_specialty"));
});

test("specialty career guides cover requested career paths", () => {
  const titles = new Set(SPECIALTY_CAREER_GUIDE_SEEDS.map((seed) => seed.title));
  for (const title of [
    "How To Become An ICU Nurse",
    "How To Become A NICU Nurse",
    "How To Become A Flight Paramedic",
    "How To Become A Critical Care RT",
    "How To Become A Pediatric OT",
    "How To Become A Sports Physiotherapist",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("employer interview guides cover employer and regional interview searches", () => {
  const titles = new Set(EMPLOYER_INTERVIEW_GUIDE_SEEDS.map((seed) => seed.title));
  for (const title of [
    "Hamilton Health Sciences Nursing Interview",
    "SickKids Nursing Interview",
    "UHN New Graduate Interview",
    "RT Interview Questions Ontario",
    "Paramedic Service Interview Questions",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }
});

test("workplace culture content includes benefits, challenges, scheduling, orientation, and growth", () => {
  for (const block of ["what_it_is_like_to_work_at", "benefits", "challenges", "scheduling", "orientation", "professional_development", "career_growth"]) {
    assert.ok(WORKPLACE_CULTURE_BLOCKS.includes(block), `${block} missing`);
  }
});

test("clinical placement connections link schools, programs, placements, employers, and careers", () => {
  assert.deepEqual(CLINICAL_PLACEMENT_CONNECTIONS, {
    schoolPages: true,
    programPages: true,
    placementPages: true,
    employerPages: true,
    careerPathways: true,
  });
});

test("employer lookup resolves by name and slug", () => {
  assert.equal(getEmployerProfile("SickKids")?.slug, "sickkids");
  assert.equal(getEmployerProfile("hamilton-health-sciences")?.name, "Hamilton Health Sciences");
});

test("dashboard tracks requested year-one scale targets", () => {
  const dashboard = buildEmployerWorkplaceDashboard();
  assert.equal(dashboard.employerPages, EMPLOYER_DIRECTORY_SEEDS.length);
  assert.equal(dashboard.yearOneTargets.employerPages, 500);
  assert.equal(dashboard.yearOneTargets.specialtyCareerPages, 250);
  assert.equal(dashboard.yearOneTargets.residencyPages, 250);
  assert.equal(dashboard.yearOneTargets.interviewPages, 250);
  assert.ok(dashboard.remainingEmployerPagesTarget > 0);
  assert.ok(dashboard.professionsCovered.includes("RT"));
  assert.ok(dashboard.provincesCovered.includes("Ontario"));
});
