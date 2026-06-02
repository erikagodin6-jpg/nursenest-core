import assert from "node:assert/strict";
import test from "node:test";

import {
  CAREER_SALARY_UPDATE_SIGNALS,
  CERTIFICATION_UPDATE_TRACKERS,
  CONTENT_FRESHNESS_BADGES,
  REVIEW_CYCLE_POLICIES,
  UPDATE_WORKFLOW_CHECKS,
  assessCertificationUpdateImpact,
  buildContentFreshnessEngineDashboard,
  buildExecutiveFreshnessReport,
  buildFreshnessDashboard,
  calculateAuthorityScoreImpact,
  detectContentDecay,
  detectStaleContent,
  evaluateContentDateState,
  findFreshnessOpportunity,
  getReviewCycleMonths,
} from "./content-freshness-evergreen-authority-engine";

const asOf = new Date("2026-05-31T00:00:00.000Z");

test("review cycle policies match requested maintenance cadence", () => {
  assert.equal(getReviewCycleMonths("certification_guide"), 6);
  assert.equal(getReviewCycleMonths("career_page"), 6);
  assert.equal(getReviewCycleMonths("salary_page"), 6);
  assert.equal(getReviewCycleMonths("school_page"), 6);
  assert.equal(getReviewCycleMonths("medication_page"), 12);
  assert.equal(getReviewCycleMonths("disease_page"), 12);
  assert.equal(getReviewCycleMonths("lab_page"), 12);
  assert.equal(getReviewCycleMonths("interview_guide"), 12);
  assert.equal(REVIEW_CYCLE_POLICIES.length, 8);
});

test("content aging system returns publication, review, update, age, freshness, and status", () => {
  const current = evaluateContentDateState({
    pageKind: "certification_guide",
    publishedAt: "2026-03-01",
    reviewedAt: "2026-05-01",
    updatedAt: "2026-05-10",
    asOf,
  });
  assert.equal(current.reviewStatus, "current");
  assert.ok(current.ageScore > 90);
  assert.ok(current.freshnessScore > 70);

  const stale = evaluateContentDateState({
    pageKind: "certification_guide",
    publishedAt: "2024-01-01",
    reviewedAt: "2025-04-15",
    updatedAt: "2025-04-15",
    asOf,
  });
  assert.equal(stale.reviewStatus, "needs_expansion");
  assert.ok(stale.freshnessScore < 20);
});

test("stale content detection maps page profiles to statuses, badges, and workflows", () => {
  const finding = detectStaleContent(
    {
      url: "/careers/rn-salary-ontario",
      updatedAt: "2025-10-01",
      clinicalReviewStatus: "clinically_reviewed",
      referencesCount: 4,
      contentType: "career",
      pageKind: "salary_page",
    },
    asOf,
  );
  assert.equal(finding.pageKind, "salary_page");
  assert.equal(finding.reviewStatus, "needs_refresh");
  assert.ok(finding.badges.includes("Clinically Reviewed"));
  assert.ok(finding.badges.includes("Evidence Reviewed"));
  assert.deepEqual(finding.recommendedActions, ["statistics", "salaries", "career_outlook", "references"]);
});

test("content decay detection monitors traffic, ranking, CTR, impressions, and authority loss", () => {
  const signal = detectContentDecay({
    previous: { page: "/healthcare/heart-failure", clicks: 1000, impressions: 10000, ctr: 0.1, position: 4 },
    current: { page: "/healthcare/heart-failure", clicks: 700, impressions: 7000, ctr: 0.07, position: 8 },
    authorityScorePrevious: 90,
    authorityScoreCurrent: 75,
  });
  assert.equal(signal.trafficLossPercent, 30);
  assert.equal(signal.impressionLossPercent, 30);
  assert.equal(signal.ctrLossPercent, 30);
  assert.equal(signal.rankingLoss, 4);
  assert.equal(signal.authorityDeclinePercent, 17);
  assert.ok(signal.recommendations.length >= 5);
});

test("freshness opportunity engine flags high-impression low-CTR position 5 to 20 pages", () => {
  const opportunity = findFreshnessOpportunity({
    page: "/clinical-placement/first-day-of-nursing-clinical",
    query: "how do I prepare for nursing clinical",
    clicks: 40,
    impressions: 3000,
    ctr: 0.013,
    position: 9,
  });
  assert.ok(opportunity);
  assert.equal(opportunity.opportunity, "low_ctr");
  assert.equal(opportunity.priority, "high");
});

test("update workflow checks include clinical, certification, career, salary, admissions, and regulatory updates", () => {
  for (const check of ["clinical_accuracy", "guidelines", "references", "statistics", "salaries", "admissions_requirements", "certification_changes", "career_outlook", "regulatory_changes"]) {
    assert.ok(UPDATE_WORKFLOW_CHECKS.includes(check), `${check} missing`);
  }
});

test("certification update tracker covers requested exams and flags blueprint changes", () => {
  for (const exam of ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"]) {
    assert.ok(CERTIFICATION_UPDATE_TRACKERS.includes(exam), `${exam} missing`);
  }
  const impact = assessCertificationUpdateImpact("NCLEX", true);
  assert.equal(impact.action, "refresh_immediately");
  assert.ok(impact.affectedContentTypes.includes("certification_guide"));
});

test("career and salary update signals include provincial, licensing, admissions, program, and workforce changes", () => {
  assert.deepEqual(CAREER_SALARY_UPDATE_SIGNALS, ["provincial_salaries", "licensing_changes", "admission_changes", "program_changes", "healthcare_workforce_trends"]);
});

test("freshness badges include visible trust and currency signals", () => {
  assert.deepEqual(CONTENT_FRESHNESS_BADGES, ["Recently Updated", "Clinically Reviewed", "2026 Edition", "Current Guide", "Evidence Reviewed"]);
});

test("freshness dashboard tracks updated, review, risk, decline, refreshed, and coverage metrics", () => {
  const fresh = detectStaleContent({ url: "/fresh", updatedAt: "2026-05-10", clinicalReviewStatus: "clinically_reviewed", referencesCount: 2, contentType: "disease" }, asOf);
  const stale = detectStaleContent({ url: "/stale", updatedAt: "2024-01-01", clinicalReviewStatus: "needs_review", referencesCount: 0, contentType: "certification" }, asOf);
  const decay = detectContentDecay({
    previous: { page: "/stale", clicks: 100, impressions: 1000, ctr: 0.1, position: 5 },
    current: { page: "/stale", clicks: 50, impressions: 700, ctr: 0.07, position: 9 },
    authorityScorePrevious: 80,
    authorityScoreCurrent: 60,
  });
  const dashboard = buildFreshnessDashboard([fresh, stale], [decay], ["/fresh"]);
  assert.equal(dashboard.pagesUpdatedThisMonth, 1);
  assert.equal(dashboard.pagesNeedingReview, 1);
  assert.equal(dashboard.pagesWithTrafficDecline, 1);
  assert.equal(dashboard.pagesSuccessfullyRefreshed, 1);
  assert.equal(dashboard.freshnessCoveragePercent, 50);
});

test("authority score impact measures traffic, ranking, CTR, and conversion changes after updates", () => {
  const impact = calculateAuthorityScoreImpact(
    { traffic: 1000, ranking: 9, ctr: 0.03, conversions: 10 },
    { traffic: 1300, ranking: 5, ctr: 0.045, conversions: 15 },
  );
  assert.equal(impact.trafficChangePercent, 30);
  assert.equal(impact.rankingChange, 4);
  assert.equal(impact.ctrChangePercent, 50);
  assert.equal(impact.conversionChangePercent, 50);
});

test("executive reporting answers monthly update and SEO impact questions", () => {
  const stale = detectStaleContent({ url: "/careers/rn-salary-ontario", updatedAt: "2025-10-01", clinicalReviewStatus: "needs_review", referencesCount: 1, contentType: "career", pageKind: "salary_page" }, asOf);
  const decay = detectContentDecay({
    previous: { page: "/careers/rn-salary-ontario", clicks: 100, impressions: 1000, ctr: 0.1, position: 5 },
    current: { page: "/careers/rn-salary-ontario", clicks: 70, impressions: 900, ctr: 0.07, position: 9 },
    authorityScorePrevious: 80,
    authorityScoreCurrent: 75,
  });
  const opportunity = findFreshnessOpportunity({ page: "/careers/rn-salary-ontario", clicks: 20, impressions: 3000, ctr: 0.006, position: 12 });
  assert.ok(opportunity);
  const report = buildExecutiveFreshnessReport({ staleFindings: [stale], decaySignals: [decay], opportunities: [opportunity] });
  assert.deepEqual(report.updateThisMonth, ["/careers/rn-salary-ontario"]);
  assert.deepEqual(report.becomingStale, ["/careers/rn-salary-ontario"]);
  assert.deepEqual(report.losingAuthority, ["/careers/rn-salary-ontario"]);
  assert.deepEqual(report.highestSeoImpact, ["/careers/rn-salary-ontario"]);
});

test("freshness engine dashboard summarizes permanent maintenance system coverage", () => {
  const dashboard = buildContentFreshnessEngineDashboard();
  assert.equal(dashboard.reviewPolicies, REVIEW_CYCLE_POLICIES.length);
  assert.equal(dashboard.certificationTrackers, CERTIFICATION_UPDATE_TRACKERS.length);
  assert.equal(dashboard.workflowChecks, UPDATE_WORKFLOW_CHECKS.length);
  assert.equal(dashboard.careerSalarySignals, CAREER_SALARY_UPDATE_SIGNALS.length);
  assert.equal(dashboard.freshnessBadges, CONTENT_FRESHNESS_BADGES.length);
});
