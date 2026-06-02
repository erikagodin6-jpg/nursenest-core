import assert from "node:assert/strict";
import test from "node:test";

import {
  ACQUISITION_PROJECTS,
  BACKLINK_MAGNETS,
  CAREER_AUTHORITY_SEEDS,
  CERTIFICATION_GUIDE_SEEDS,
  COMPARISON_PAGE_SEEDS,
  CONTENT_TO_ACCOUNT_ACTIONS,
  CTA_REQUIREMENTS,
  EMAIL_LEAD_MAGNETS,
  FREE_RESOURCE_SEEDS,
  SCHOLARSHIP_PROGRAMS,
  SCHOOL_DIRECTORY_SEEDS,
  acquisitionPriorityScore,
  buildExecutiveGrowthDashboard,
  buildRevenueAttributionSummary,
  buildVisitorGrowthAcquisitionPlan,
  type RevenueAttributionRow,
} from "./visitor-growth-acquisition-engine";

test("master sprint includes all 12 acquisition projects", () => {
  assert.deepEqual(ACQUISITION_PROJECTS, [
    "career_authority",
    "certification_guides",
    "school_directory",
    "comparison_pages",
    "free_resource_library",
    "email_lead_magnets",
    "cta_optimization",
    "backlink_magnets",
    "scholarship_pr",
    "content_to_account",
    "revenue_attribution",
    "growth_dashboard",
  ]);
});

test("career authority seeds cover nursing and allied career acquisition pages", () => {
  const titles = CAREER_AUTHORITY_SEEDS.map((seed) => seed.title);
  assert.ok(titles.includes("How To Become A Nurse In Canada"));
  assert.ok(titles.includes("How To Become A Respiratory Therapist In Ontario"));
  assert.ok(titles.includes("Paramedic Salary Guide"));
  assert.ok(titles.includes("OT Career Guide"));
  assert.ok(titles.includes("PT Career Guide"));
  assert.ok(titles.includes("Medical Laboratory Technologist Salary Guide"));
  assert.ok(titles.includes("PSW Career Guide"));
  assert.equal(CAREER_AUTHORITY_SEEDS.some((seed) => seed.provinceSpecific), true);
  assert.equal(CAREER_AUTHORITY_SEEDS.every((seed) => seed.schoolSpecificExpansion), true);
});

test("certification guides include required guide blocks", () => {
  assert.equal(CERTIFICATION_GUIDE_SEEDS.length, 11);
  for (const guide of CERTIFICATION_GUIDE_SEEDS) {
    assert.deepEqual(guide.includes, ["exam overview", "blueprint", "study plan", "passing strategy", "common mistakes", "study timeline", "recommended resources", "FAQs"]);
  }
});

test("school directory and comparison engines cover prospect and commercial searches", () => {
  assert.ok(SCHOOL_DIRECTORY_SEEDS.some((seed) => seed.title === "Best Nursing Schools In Ontario"));
  assert.ok(SCHOOL_DIRECTORY_SEEDS.every((seed) => seed.requiredBlocks.includes("clinical placements")));
  assert.ok(COMPARISON_PAGE_SEEDS.some((seed) => seed.title === "NurseNest vs UWorld" && seed.conversionIntent === "high"));
  assert.ok(COMPARISON_PAGE_SEEDS.some((seed) => seed.title === "RT vs Nursing"));
});

test("free resources and email lead magnets require capture before use", () => {
  assert.equal(FREE_RESOURCE_SEEDS.every((resource) => resource.requiresEmailCapture), true);
  assert.ok(FREE_RESOURCE_SEEDS.some((resource) => resource.title === "ECG Quick Reference" && resource.backlinkPotential === "high"));
  assert.equal(EMAIL_LEAD_MAGNETS.every((lead) => lead.requiresAccount), true);
  assert.ok(EMAIL_LEAD_MAGNETS.some((lead) => lead.title === "Free CASPER Pack"));
});

test("CTA requirements cover public page surfaces and all required CTA slots", () => {
  const surfaces = CTA_REQUIREMENTS.map((item) => item.surface);
  assert.ok(surfaces.includes("Disease Page"));
  assert.ok(surfaces.includes("Medication Page"));
  assert.ok(surfaces.includes("School Page"));
  assert.ok(surfaces.includes("Allied Health Page"));
  for (const requirement of CTA_REQUIREMENTS) {
    assert.deepEqual(requirement.requiredCtas, ["primary", "secondary", "related_resource", "trial", "account_creation"]);
  }
});

test("backlink magnets and scholarship programs produce authority assets", () => {
  assert.ok(BACKLINK_MAGNETS.some((magnet) => magnet.title === "Annual Nursing Student Report"));
  assert.equal(BACKLINK_MAGNETS.every((magnet) => magnet.outputs.includes("press kit")), true);
  assert.equal(SCHOLARSHIP_PROGRAMS.length, 3);
  assert.equal(SCHOLARSHIP_PROGRAMS.every((program) => program.authorityBenefits.includes("scholarship directory backlinks")), true);
});

test("content-to-account actions require account-worthy saved state or practice", () => {
  assert.deepEqual(CONTENT_TO_ACCOUNT_ACTIONS, [
    "save_article",
    "bookmark",
    "create_study_plan",
    "download_resource",
    "save_to_notebook",
    "get_related_questions",
    "get_related_flashcards",
    "take_practice_quiz",
  ]);
});

test("revenue attribution answers which pages, professions, sources, and clusters create revenue", () => {
  const summary = buildRevenueAttributionSummary(sampleRows());

  assert.equal(summary.topSubscriberPages[0]?.page, "/careers/how-to-become-a-nurse-in-ontario");
  assert.equal(summary.professionsByRevenue[0]?.profession, "RN");
  assert.equal(summary.trafficSourcesByRevenue[0]?.trafficSource, "organic");
  assert.equal(summary.clustersByRevenue[0]?.cluster, "Nursing Careers");
});

test("executive growth dashboard displays traffic, leads, conversion, and top acquisition pages", () => {
  const dashboard = buildExecutiveGrowthDashboard({
    organicTraffic: 10000,
    emailSubscribers: 900,
    accountsCreated: 500,
    trialsStarted: 200,
    subscriptions: 60,
    revenueCents: 174000,
    attributionRows: sampleRows(),
  });

  assert.equal(dashboard.visitorToAccountRate, 0.05);
  assert.equal(dashboard.accountToTrialRate, 0.4);
  assert.equal(dashboard.trialToPaidRate, 0.3);
  assert.ok(dashboard.topLandingPages.includes("/careers/how-to-become-a-nurse-in-ontario"));
  assert.ok(dashboard.topKeywords.includes("how to become a nurse in ontario"));
  assert.ok(dashboard.topAlliedHealthPages.includes("/rt/respiratory-therapist-salary-canada"));
  assert.ok(dashboard.topCareerPages.includes("/careers/how-to-become-a-nurse-in-ontario"));
  assert.ok(dashboard.topCertificationPages.includes("/certification/nclex-rn-ultimate-guide"));
});

test("growth plan ties success targets to acquisition instead of feature shipping", () => {
  const plan = buildVisitorGrowthAcquisitionPlan();
  assert.equal(plan.successTargets.indexedPages, "thousands");
  assert.equal(plan.successTargets.organicTrafficGrowth, true);
  assert.equal(plan.successTargets.emailSubscriberBase, true);
  assert.equal(plan.successTargets.alliedHealthTraffic, true);
});

test("priority score rewards traffic, conversion, backlinks, and authority while penalizing effort", () => {
  assert.equal(acquisitionPriorityScore({
    trafficOpportunity: 90,
    conversionOpportunity: 90,
    backlinkOpportunity: 80,
    authorityOpportunity: 80,
    productionEffort: 20,
  }), 81);
});

function sampleRows(): RevenueAttributionRow[] {
  return [
    {
      keyword: "how to become a nurse in ontario",
      landingPage: "/careers/how-to-become-a-nurse-in-ontario",
      trafficSource: "organic",
      profession: "RN",
      cluster: "Nursing Careers",
      accountsCreated: 120,
      trialStarts: 50,
      subscriptions: 20,
      renewals: 12,
      revenueCents: 58000,
    },
    {
      keyword: "respiratory therapist salary canada",
      landingPage: "/rt/respiratory-therapist-salary-canada",
      trafficSource: "organic",
      profession: "RT",
      cluster: "RT Careers",
      accountsCreated: 60,
      trialStarts: 20,
      subscriptions: 8,
      renewals: 4,
      revenueCents: 39200,
    },
    {
      keyword: "nclex rn guide",
      landingPage: "/certification/nclex-rn-ultimate-guide",
      trafficSource: "referral",
      profession: "RN",
      cluster: "NCLEX",
      accountsCreated: 80,
      trialStarts: 40,
      subscriptions: 16,
      renewals: 10,
      revenueCents: 46400,
    },
  ];
}
