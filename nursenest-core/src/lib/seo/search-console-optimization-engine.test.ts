import test from "node:test";
import assert from "node:assert/strict";
import {
  auditEeatRefresh,
  buildSeoCommandCenter,
  detectAuthorityExpansion,
  detectContentDecay,
  detectPageOpportunities,
  expectedCtrForPosition,
  normalizeSearchConsoleRows,
} from "@/lib/seo/search-console-optimization-engine";

test("normalizes Search Console API rows by requested dimensions", () => {
  const rows = normalizeSearchConsoleRows(
    [{ keys: ["https://nursenest.ca/conditions/heart-failure", "heart failure nursing"], clicks: 10, impressions: 1000, ctr: 0.01, position: 6 }],
    ["page", "query"],
  );

  assert.equal(rows[0].page, "https://nursenest.ca/conditions/heart-failure");
  assert.equal(rows[0].query, "heart failure nursing");
  assert.equal(rows[0].clicks, 10);
});

test("detects high-impression low-CTR pages near page one", () => {
  const [opportunity] = detectPageOpportunities([
    { page: "/conditions/copd", query: "copd nursing", clicks: 12, impressions: 2000, ctr: 0.006, position: 5.4 },
  ]);

  assert.equal(opportunity.page, "/conditions/copd");
  assert.equal(opportunity.priority, "tier_1");
  assert.ok(opportunity.expectedCtr >= expectedCtrForPosition(6));
});

test("detects content decay from historical comparison", () => {
  const [decay] = detectContentDecay(
    [{ page: "/labs/potassium", clicks: 60, impressions: 1000, ctr: 0.06, position: 7 }],
    [{ page: "/labs/potassium", clicks: 100, impressions: 2000, ctr: 0.05, position: 4 }],
  );

  assert.equal(decay.page, "/labs/potassium");
  assert.equal(decay.needsRefresh, true);
  assert.ok(decay.refreshReasons.length >= 2);
});

test("detects authority expansion from untargeted query impressions", () => {
  const [opportunity] = detectAuthorityExpansion(
    [{ page: "/conditions/heart-failure", query: "bnp interpretation", clicks: 4, impressions: 600, ctr: 0.006, position: 9 }],
    [{ url: "/conditions/heart-failure", targetedKeywords: ["heart failure nursing"], cluster: "Heart Failure" }],
  );

  assert.equal(opportunity.opportunityType, "supporting_page");
  assert.match(opportunity.recommendation, /supporting page/i);
});

test("audits EEAT refresh gaps", () => {
  const [finding] = auditEeatRefresh(
    [{ url: "/conditions/sepsis", title: "Sepsis", referencesCount: 1, clinicalReviewStatus: "under_review" }],
    new Date("2026-05-31"),
  );

  assert.equal(finding.needsClinicalReview, true);
  assert.ok(finding.issues.includes("Author missing."));
});

test("builds command center with refresh queue and snippets", () => {
  const dashboard = buildSeoCommandCenter({
    currentRows: [
      { page: "/conditions/stroke", query: "what is stroke", clicks: 8, impressions: 1200, ctr: 0.006, position: 6 },
    ],
    profiles: [
      {
        url: "/conditions/stroke",
        cluster: "Stroke",
        targetedKeywords: ["stroke nursing"],
        referencesCount: 2,
        clinicalReviewStatus: "under_review",
        conversionMetrics: { subscriptions: 2 },
      },
    ],
  });

  assert.equal(dashboard.totalImpressions, 1200);
  assert.equal(dashboard.refreshQueue[0].tier, "tier_1");
  assert.ok(dashboard.snippets.length > 0);
});

