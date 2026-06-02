import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

import {
  CAREER_SALARY_UPDATE_SIGNALS,
  CERTIFICATION_UPDATE_TRACKERS,
  CONTENT_FRESHNESS_BADGES,
  REVIEW_CYCLE_POLICIES,
  UPDATE_WORKFLOW_CHECKS,
  buildContentFreshnessEngineDashboard,
  buildExecutiveFreshnessReport,
  buildFreshnessDashboard,
  calculateAuthorityScoreImpact,
  detectContentDecay,
  detectStaleContent,
  findFreshnessOpportunity,
} from "../src/lib/seo/content-freshness-evergreen-authority-engine";

const outPath = join(process.cwd(), "docs", "reports", "healthcare-content-freshness-evergreen-authority-engine.md");
const asOf = new Date("2026-05-31T00:00:00.000Z");
const engineDashboard = buildContentFreshnessEngineDashboard();
const staleFindings = [
  detectStaleContent({ url: "/careers/rn-salary-ontario", updatedAt: "2025-10-01", clinicalReviewStatus: "needs_review", referencesCount: 1, contentType: "career", pageKind: "salary_page" }, asOf),
  detectStaleContent({ url: "/healthcare/heart-failure", updatedAt: "2026-05-10", clinicalReviewStatus: "clinically_reviewed", referencesCount: 5, contentType: "disease", pageKind: "disease_page" }, asOf),
];
const decaySignals = [
  detectContentDecay({
    previous: { page: "/careers/rn-salary-ontario", clicks: 100, impressions: 1000, ctr: 0.1, position: 5 },
    current: { page: "/careers/rn-salary-ontario", clicks: 70, impressions: 900, ctr: 0.07, position: 9 },
    authorityScorePrevious: 80,
    authorityScoreCurrent: 75,
  }),
];
const opportunity = findFreshnessOpportunity({ page: "/careers/rn-salary-ontario", clicks: 20, impressions: 3000, ctr: 0.006, position: 12 });
const freshnessDashboard = buildFreshnessDashboard(staleFindings, decaySignals, ["/healthcare/heart-failure"]);
const executiveReport = buildExecutiveFreshnessReport({
  staleFindings,
  decaySignals,
  opportunities: opportunity ? [opportunity] : [],
});
const impact = calculateAuthorityScoreImpact(
  { traffic: 1000, ranking: 9, ctr: 0.03, conversions: 10 },
  { traffic: 1300, ranking: 5, ctr: 0.045, conversions: 15 },
);

const markdown = `# Healthcare Content Freshness & Evergreen Authority Engine

Generated: ${new Date().toISOString()}

## Objective

Create a permanent content maintenance system that keeps NurseNest current, accurate, clinically relevant, search competitive, and EEAT compliant. This system improves authority continuously instead of relying only on new content publication.

## Registry Summary

| Metric | Count |
| --- | ---: |
| Review cycle policies | ${engineDashboard.reviewPolicies} |
| Certification trackers | ${engineDashboard.certificationTrackers} |
| Update workflow checks | ${engineDashboard.workflowChecks} |
| Career and salary update signals | ${engineDashboard.careerSalarySignals} |
| Freshness badges | ${engineDashboard.freshnessBadges} |

## Content Aging System

Every page receives:

- Publication Date
- Review Date
- Update Date
- Age Score
- Freshness Score
- Review Status

## Review Cycles

| Page Kind | Review Every |
| --- | ---: |
${REVIEW_CYCLE_POLICIES.map((policy) => `| ${policy.pageKind} | ${policy.reviewEveryMonths} months |`).join("\n")}

## Stale Content Detection

| URL | Page Kind | Days Since Review | Days Since Update | Status | Badges | Actions |
| --- | --- | ---: | ---: | --- | --- | --- |
${staleFindings.map((finding) => `| ${finding.url} | ${finding.pageKind} | ${finding.daysSinceReview} | ${finding.daysSinceUpdate} | ${finding.reviewStatus} | ${finding.badges.join(", ")} | ${finding.recommendedActions.join(", ")} |`).join("\n")}

## Content Decay Detection

| URL | Traffic Loss | Ranking Loss | CTR Loss | Impression Loss | Authority Decline | Recommendations |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
${decaySignals.map((signal) => `| ${signal.url} | ${signal.trafficLossPercent}% | ${signal.rankingLoss} | ${signal.ctrLossPercent}% | ${signal.impressionLossPercent}% | ${signal.authorityDeclinePercent}% | ${signal.recommendations.join("; ")} |`).join("\n")}

## Freshness Opportunity Engine

${opportunity ? `| URL | Impressions | CTR | Position | Opportunity | Priority |
| --- | ---: | ---: | ---: | --- | --- |
| ${opportunity.url} | ${opportunity.impressions} | ${opportunity.ctr} | ${opportunity.position} | ${opportunity.opportunity} | ${opportunity.priority} |` : "_No sample opportunity detected._"}

## Update Workflows

Review:

${UPDATE_WORKFLOW_CHECKS.map((check) => `- ${check}`).join("\n")}

## Certification Update Tracker

Track blueprint changes for:

${CERTIFICATION_UPDATE_TRACKERS.map((tracker) => `- ${tracker}`).join("\n")}

## Career & Salary Updates

Monitor:

${CAREER_SALARY_UPDATE_SIGNALS.map((signal) => `- ${signal}`).join("\n")}

## Freshness Badges

Display:

${CONTENT_FRESHNESS_BADGES.map((badge) => `- ${badge}`).join("\n")}

## EEAT Integration

Display:

- Last Updated
- Last Reviewed
- Reviewer
- Reviewer Credentials
- Evidence Sources
- Revision Notes

## Freshness Dashboard

| Metric | Value |
| --- | ---: |
| Pages Updated This Month | ${freshnessDashboard.pagesUpdatedThisMonth} |
| Pages Needing Review | ${freshnessDashboard.pagesNeedingReview} |
| Pages At Risk | ${freshnessDashboard.pagesAtRisk} |
| Pages With Traffic Decline | ${freshnessDashboard.pagesWithTrafficDecline} |
| Pages Successfully Refreshed | ${freshnessDashboard.pagesSuccessfullyRefreshed} |
| Freshness Coverage | ${freshnessDashboard.freshnessCoveragePercent}% |

## Authority Score Impact

| Metric | Change |
| --- | ---: |
| Traffic Change | ${impact.trafficChangePercent}% |
| Ranking Change | ${impact.rankingChange} positions improved |
| CTR Change | ${impact.ctrChangePercent}% |
| Conversion Change | ${impact.conversionChangePercent}% |

## Executive Reporting

What pages should be updated this month?

${executiveReport.updateThisMonth.map((url) => `- ${url}`).join("\n") || "- None"}

What pages are becoming stale?

${executiveReport.becomingStale.map((url) => `- ${url}`).join("\n") || "- None"}

What pages are losing authority?

${executiveReport.losingAuthority.map((url) => `- ${url}`).join("\n") || "- None"}

What updates will have the highest SEO impact?

${executiveReport.highestSeoImpact.map((url) => `- ${url}`).join("\n") || "- None"}

## Guardrails

- Certification, salary, school, career, and regulatory content should use shorter review cycles than evergreen clinical fundamentals.
- Performance decay should trigger refresh recommendations even when the page is still clinically current.
- Freshness badges should only display when backed by dates, review status, evidence, or reviewer metadata.
- Blueprint changes should immediately flag affected certification content.
- Salary and admissions pages require current source review before public claims are updated.
- The dashboard should prioritize pages with stale metadata, declining performance, high impressions, low CTR, or position 5-20 opportunity.
`;

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, markdown);
console.log(`Wrote ${outPath}`);
