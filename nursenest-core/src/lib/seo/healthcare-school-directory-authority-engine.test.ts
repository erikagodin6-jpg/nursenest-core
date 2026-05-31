import assert from "node:assert/strict";
import test from "node:test";

import {
  ADMISSIONS_GUIDE_SEEDS,
  APPLICATION_TIMELINE_TEMPLATE,
  PROGRAM_COMPARISON_SEEDS,
  PROGRAM_DIRECTORY_ENTRIES,
  PROVINCE_PROGRAM_HUBS,
  SCHOOL_REVIEW_GOVERNANCE,
  buildAcceptanceChance,
  buildSchoolDirectoryDashboard,
  validateProgramPage,
} from "./healthcare-school-directory-authority-engine";

test("program directory covers requested professions and example school pages", () => {
  const titles = new Set(PROGRAM_DIRECTORY_ENTRIES.map((entry) => entry.title));
  for (const title of [
    "McMaster Nursing Program",
    "Mohawk RPN Program",
    "Fanshawe Respiratory Therapy",
    "Conestoga Paramedic Program",
    "University Of Toronto NP Programs",
    "Western OT Program",
    "McMaster PT Program",
    "Michener MLT Program",
  ]) {
    assert.ok(titles.has(title), `${title} missing`);
  }

  const professions = new Set(PROGRAM_DIRECTORY_ENTRIES.map((entry) => entry.profession));
  for (const profession of ["RN", "RPN", "NP", "RT", "Paramedic", "OT", "PT", "MLT", "PSW"]) {
    assert.ok(professions.has(profession), `${profession} missing`);
  }
});

test("every program page includes the required SEO and admissions blocks", () => {
  for (const entry of PROGRAM_DIRECTORY_ENTRIES) {
    assert.deepEqual(validateProgramPage(entry), []);
    assert.ok(entry.internalLinks.includes("career_guides"));
    assert.ok(entry.internalLinks.includes("hesi"));
    assert.ok(entry.internalLinks.includes("teas"));
    assert.ok(entry.internalLinks.includes("casper"));
    assert.ok(entry.conversionAssets.includes("free_admissions_checklist"));
    assert.ok(entry.conversionAssets.includes("program_comparison_pdf"));
  }
});

test("province hubs include nursing, RT, paramedic, and allied program clusters", () => {
  const titles = PROVINCE_PROGRAM_HUBS.map((hub) => hub.title);
  assert.ok(titles.includes("Ontario Nursing Programs"));
  assert.ok(titles.includes("Alberta Nursing Programs"));
  assert.ok(titles.includes("British Columbia Nursing Programs"));
  assert.ok(titles.includes("Ontario RT Programs"));
  assert.ok(titles.includes("Ontario Paramedic Programs"));
  assert.ok(titles.includes("Ontario MLT Programs"));
  assert.ok(PROVINCE_PROGRAM_HUBS.every((hub) => hub.canonicalPath.startsWith("/schools/")));
});

test("comparison seeds cover school, program, and profession comparison searches", () => {
  const titles = PROGRAM_COMPARISON_SEEDS.map((seed) => seed.title);
  assert.ok(titles.includes("McMaster vs Western Nursing"));
  assert.ok(titles.includes("Fanshawe vs Conestoga RT"));
  assert.ok(titles.includes("OT vs PT"));
  assert.ok(titles.includes("RN vs RT"));
  assert.ok(titles.includes("RPN vs RN"));
  assert.ok(PROGRAM_COMPARISON_SEEDS.some((seed) => seed.comparisonType === "profession_vs_profession"));
});

test("admissions guides include required authority blocks", () => {
  const titles = ADMISSIONS_GUIDE_SEEDS.map((seed) => seed.title);
  assert.deepEqual(titles, [
    "How To Get Into Nursing School",
    "How To Get Into RT School",
    "How To Get Into OT",
    "How To Get Into PT",
    "How To Get Into MLT",
  ]);
  for (const guide of ADMISSIONS_GUIDE_SEEDS) {
    assert.deepEqual(guide.requiredBlocks, ["requirements", "grades", "prerequisites", "application_timeline", "interview_prep", "casper_prep", "student_tips", "related_programs"]);
  }
});

test("acceptance chance tool produces competitiveness and recommendations", () => {
  const strong = buildAcceptanceChance({ grades: 91, prerequisitesComplete: 6, province: "Ontario", programInterest: "RN" });
  assert.equal(strong.competitiveness, "strong");
  assert.ok(strong.suggestedProgramSlugs.includes("mcmaster-nursing-program"));
  assert.ok(strong.preparationRecommendations.includes("Prepare interviews and CASPER early."));

  const reach = buildAcceptanceChance({ grades: 74, prerequisitesComplete: 2, province: "Ontario", programInterest: "RT" });
  assert.equal(reach.competitiveness, "reach");
  assert.ok(reach.preparationRecommendations.includes("Complete missing prerequisites."));
});

test("application timeline covers research through decision phases", () => {
  assert.deepEqual(APPLICATION_TIMELINE_TEMPLATE.map((item) => item.phase), ["research", "prerequisites", "application", "casper", "interview", "references", "decision"]);
});

test("school review system is moderated and quality controlled", () => {
  assert.equal(SCHOOL_REVIEW_GOVERNANCE.moderationRequired, true);
  assert.ok(SCHOOL_REVIEW_GOVERNANCE.supportedTypes.includes("placement_experience"));
  assert.ok(SCHOOL_REVIEW_GOVERNANCE.supportedTypes.includes("application_experience"));
  assert.ok(SCHOOL_REVIEW_GOVERNANCE.qualityControls.includes("no_personal_health_information"));
  assert.ok(SCHOOL_REVIEW_GOVERNANCE.qualityControls.includes("specific_experience_required"));
});

test("dashboard tracks year-one scale targets", () => {
  const dashboard = buildSchoolDirectoryDashboard();
  assert.equal(dashboard.programPages, PROGRAM_DIRECTORY_ENTRIES.length);
  assert.equal(dashboard.provinceHubs, PROVINCE_PROGRAM_HUBS.length);
  assert.equal(dashboard.comparisonPages, PROGRAM_COMPARISON_SEEDS.length);
  assert.equal(dashboard.admissionsGuides, ADMISSIONS_GUIDE_SEEDS.length);
  assert.equal(dashboard.yearOneTargets.programPages, 500);
  assert.equal(dashboard.yearOneTargets.comparisonPages, 100);
  assert.equal(dashboard.yearOneTargets.admissionsGuides, 100);
  assert.equal(dashboard.yearOneTargets.provinceHubs, 50);
  assert.equal(dashboard.remainingToProgramPageTarget, 500 - PROGRAM_DIRECTORY_ENTRIES.length);
});
