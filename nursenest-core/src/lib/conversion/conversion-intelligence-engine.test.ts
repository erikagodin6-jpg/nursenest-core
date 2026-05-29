import assert from "node:assert/strict";
import test from "node:test";
import {
  buildConversionFunnel,
  buildConversionIntelligenceReport,
  type ConversionStageMetric,
} from "@/lib/conversion/conversion-intelligence-engine";

const rnStages: ConversionStageMetric[] = [
  { stage: "anonymous_visitor", label: "Visitors", count: 10000 },
  { stage: "marketing_page", label: "Marketing page", count: 7600 },
  { stage: "pricing", label: "Pricing", count: 4200 },
  { stage: "signup", label: "Signup", count: 2100 },
  { stage: "checkout", label: "Checkout", count: 900 },
  { stage: "subscription", label: "Subscription", count: 640 },
];

test("conversion intelligence calculates cohort funnel drop-offs", () => {
  const funnel = buildConversionFunnel("RN", rnStages);

  assert.equal(funnel.overallConversionPct, 6.4);
  assert.equal(funnel.largestDropOff?.from, "signup");
  assert.equal(funnel.largestDropOff?.to, "checkout");
  assert.equal(funnel.steps.find((step) => step.stage === "pricing")?.dropOffFromPriorPct, 44.7);
});

test("conversion intelligence ranks revenue, feature, pricing, alerts, and recommendations", () => {
  const report = buildConversionIntelligenceReport({
    generatedAt: "2026-05-29T00:00:00.000Z",
    funnels: [buildConversionFunnel("RN", rnStages)],
    contentAttribution: [
      { page: "/cnple/simulation", pageType: "exam", revenueCents: 320000, subscriptions: 16 },
      { page: "/blog/ecg-interpretation", pageType: "blog", revenueCents: 120000, subscriptions: 6 },
    ],
    featureDiscovery: [
      { feature: "ecg", explorers: 100, subscribersAfterExploration: 28 },
      { feature: "lessons", explorers: 100, subscribersAfterExploration: 12 },
    ],
    pricing: [{ planCode: "rn-premium-monthly", planType: "monthly", starts: 100, completions: 64, revenueCents: 313600, retainedSubscriptions: 52 }],
  });

  assert.equal(report.executiveSummary.revenueDollars, 4400);
  assert.equal(report.executiveSummary.checkoutSuccessPct, 64);
  assert.equal(report.topRevenueDrivers[0].page, "/cnple/simulation");
  assert.equal(report.topConvertingFeatures[0].feature, "ecg");
  assert.equal(report.pricingInsights[0].retentionPct, 81.3);
  assert.ok(report.recommendations.length >= 3);
  assert.equal(report.alerts.some((alert) => alert.title.includes("checkout")), true);
});

