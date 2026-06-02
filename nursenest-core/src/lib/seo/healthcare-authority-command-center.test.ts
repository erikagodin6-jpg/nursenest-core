import assert from "node:assert/strict";
import test from "node:test";

import {
  ALLIED_COMMAND_ROWS,
  CERTIFICATION_COMMAND_ROWS,
  COMMAND_CENTER_ALERTS,
  CONTENT_PERFORMANCE_ROWS,
  TOPIC_OWNERSHIP_ROWS,
  buildAiVisibilityDashboard,
  buildConversionCommandCenter,
  buildEeatDashboard,
  buildExecutiveScorecard,
  buildHealthcareAuthorityCommandCenter,
  buildOpportunityRecommendations,
  buildTopicAuthorityRollup,
} from "@/lib/seo/healthcare-authority-command-center";

test("executive overview combines traffic, users, subscription, revenue, and growth metrics", () => {
  const center = buildHealthcareAuthorityCommandCenter();

  assert.ok(center.executiveOverview.organicTraffic > 0);
  assert.ok(center.executiveOverview.newUsers > 0);
  assert.ok(center.executiveOverview.accountsCreated > 0);
  assert.ok(center.executiveOverview.trialsStarted > 0);
  assert.ok(center.executiveOverview.subscriptions > 0);
  assert.ok(center.executiveOverview.mrrCents > 0);
  assert.ok(center.executiveOverview.arrCents > center.executiveOverview.mrrCents);
  assert.ok(center.executiveOverview.conversionRate > 0);
  assert.ok(center.executiveOverview.trafficGrowth > 0);
  assert.ok(center.executiveOverview.revenueGrowth > 0);
  assert.ok(center.executiveOverview.authorityGrowth > 0);
});

test("SEO command center tracks indexation, linking, schema, breadcrumbs, and keywords", () => {
  const center = buildHealthcareAuthorityCommandCenter();

  assert.ok(center.seo.indexedPages > 0);
  assert.ok(center.seo.nonIndexedPages >= 0);
  assert.ok(center.seo.crawledNotIndexed >= 0);
  assert.ok(center.seo.duplicateContent >= 0);
  assert.ok(center.seo.canonicalIssues >= 0);
  assert.ok(center.seo.orphanPages >= 0);
  assert.ok(center.seo.internalLinkingScore > 0);
  assert.ok(center.seo.schemaCoverage > 0);
  assert.ok(center.seo.breadcrumbCoverage > 0);
  assert.ok(center.seo.topKeywords.includes("heart failure nursing care plan"));
  assert.ok(center.seo.fastestGrowingKeywords.includes("what is peep"));
});

test("topic ownership dashboard includes requested priority topics with business metrics", () => {
  const topics = TOPIC_OWNERSHIP_ROWS.map((row) => row.topic);

  for (const topic of ["Heart Failure", "COPD", "Diabetes", "Sepsis", "Stroke", "AFib", "AKI", "CKD", "Ventilator Management", "ABG Interpretation", "Trauma Assessment"] as const) {
    assert.ok(topics.includes(topic));
  }

  for (const row of TOPIC_OWNERSHIP_ROWS) {
    assert.ok(row.ownershipPercent > 0);
    assert.ok(row.authorityScore > 0);
    assert.ok(row.traffic > 0);
    assert.ok(row.conversions >= 0);
    assert.ok(row.revenueCents >= 0);
    assert.ok(["Critical", "High", "Medium", "Low"].includes(row.buildPriority));
  }
});

test("allied health command center covers RT, Paramedic, OT, PT, MLT, and PSW", () => {
  const professions = ALLIED_COMMAND_ROWS.map((row) => row.profession);

  for (const profession of ["RT", "Paramedic", "OT", "PT", "MLT", "PSW"] as const) {
    assert.ok(professions.includes(profession));
  }

  assert.ok(ALLIED_COMMAND_ROWS.every((row) => row.traffic > 0 && row.keywords > 0 && row.contentGaps.length > 0));
});

test("certification command center covers exam and admissions targets", () => {
  const certifications = CERTIFICATION_COMMAND_ROWS.map((row) => row.certification);

  for (const certification of ["NCLEX", "REx-PN", "CNPLE", "FNP", "PMHNP", "AGPCNP", "WHNP", "PNP-PC", "TEAS", "HESI", "CASPER"] as const) {
    assert.ok(certifications.includes(certification));
  }

  assert.ok(CERTIFICATION_COMMAND_ROWS.every((row) => row.traffic > 0 && row.contentCoverage > 0 && row.authorityScore > 0 && row.readinessScore > 0));
});

test("AI visibility dashboard aggregates citation readiness, entity coverage, definitions, FAQs, graph strength, and mentions", () => {
  const dashboard = buildAiVisibilityDashboard();

  assert.ok(dashboard.aiCitationReadiness > 0);
  assert.ok(dashboard.entityCoverage > 0);
  assert.ok(dashboard.definitionCoverage > 0);
  assert.ok(dashboard.faqCoverage > 0);
  assert.ok(dashboard.knowledgeGraphStrength > 0);
  assert.ok(dashboard.aiOverviewOpportunities.length > 0);
  assert.ok(dashboard.aiMentionTracking.includes("ChatGPT"));
  assert.ok(dashboard.aiMentionTracking.includes("Google AI Overviews"));
});

test("EEAT dashboard tracks author, reviewer, clinical review, freshness, references, schema, trust, and authority", () => {
  const dashboard = buildEeatDashboard();

  assert.equal(dashboard.authorCoverage, 100);
  assert.equal(dashboard.reviewerCoverage, 100);
  assert.equal(dashboard.clinicalReviewCoverage, 100);
  assert.ok(dashboard.freshnessCoverage > 0);
  assert.ok(dashboard.referenceCoverage > 0);
  assert.equal(dashboard.schemaCoverage, 100);
  assert.ok(dashboard.trustScore > 0);
  assert.ok(dashboard.authorityScore > 0);
});

test("conversion command center tracks funnel stages and attribution", () => {
  const conversion = buildConversionCommandCenter({
    organicTraffic: 10000,
    newUsers: 4000,
    accountsCreated: 800,
    trialsStarted: 240,
    subscriptions: 72,
    mrrCents: 500000,
    arrCents: 6000000,
    conversionRate: 0.018,
    trafficGrowth: 0.2,
    revenueGrowth: 0.15,
    authorityGrowth: 0.12,
  });

  assert.equal(conversion.visitorToAccountRate, 0.2);
  assert.equal(conversion.accountToTrialRate, 0.3);
  assert.equal(conversion.trialToPaidRate, 0.3);
  assert.ok(conversion.paidToRenewalRate > 0);
  assert.ok(conversion.revenueAttributionCents > 0);
  assert.ok(conversion.contentAttribution.includes("Heart Failure cluster"));
  assert.ok(conversion.professionAttribution.includes("RN"));
});

test("content performance includes all requested page and cluster surfaces", () => {
  const surfaces = CONTENT_PERFORMANCE_ROWS.map((row) => row.surface);

  for (const surface of ["Top Pages", "Top Clusters", "Top Careers", "Top Certifications", "Top Programs", "Top School Pages", "Top Interview Pages", "Top Placement Pages", "Top Salary Pages"] as const) {
    assert.ok(surfaces.includes(surface));
  }

  assert.ok(CONTENT_PERFORMANCE_ROWS.every((row) => row.leaders.length > 0 && row.traffic > 0));
});

test("opportunity engine answers the five executive build questions", () => {
  const opportunities = buildOpportunityRecommendations();
  const questions = opportunities.map((row) => row.question);

  assert.ok(questions.includes("What should be built next?"));
  assert.ok(questions.includes("Which content has the highest ROI?"));
  assert.ok(questions.includes("Which topic has the highest traffic opportunity?"));
  assert.ok(questions.includes("Which profession has the highest growth potential?"));
  assert.ok(questions.includes("Which certification has the highest conversion potential?"));
  assert.ok(opportunities.every((row) => row.priorityScore >= 0));
});

test("alert center covers traffic, conversion, authority, ranking, indexation, schema, subscription, and Stripe failures", () => {
  const alertTypes = COMMAND_CENTER_ALERTS.map((alert) => alert.type);

  for (const type of ["traffic_drop", "conversion_drop", "authority_decline", "ranking_loss", "indexation_problem", "schema_break", "subscription_notification_failure", "stripe_webhook_failure"] as const) {
    assert.ok(alertTypes.includes(type));
  }

  assert.ok(COMMAND_CENTER_ALERTS.every((alert) => alert.trigger.length > 10 && alert.ownerAction.length > 10));
});

test("executive scorecard returns all business scores and an overall score", () => {
  const center = buildHealthcareAuthorityCommandCenter();
  const scorecard = buildExecutiveScorecard({
    executiveOverview: center.executiveOverview,
    seo: center.seo,
    aiVisibility: center.aiVisibility,
    eeat: center.eeat,
    conversion: center.conversion,
  });

  assert.ok(scorecard.trafficScore > 0);
  assert.ok(scorecard.authorityScore > 0);
  assert.ok(scorecard.eeatScore > 0);
  assert.ok(scorecard.aiReadinessScore > 0);
  assert.ok(scorecard.conversionScore > 0);
  assert.ok(scorecard.revenueScore > 0);
  assert.ok(scorecard.internationalExpansionScore > 0);
  assert.ok(scorecard.alliedHealthScore > 0);
  assert.ok(scorecard.overallBusinessScore > 0);
});

test("command center exposes complete operational answer set", () => {
  const center = buildHealthcareAuthorityCommandCenter();

  assert.ok(center.topicOwnership.length >= 11);
  assert.ok(center.alliedHealth.length >= 6);
  assert.ok(center.certifications.length >= 11);
  assert.ok(center.contentPerformance.length >= 9);
  assert.ok(center.opportunities.length >= 5);
  assert.ok(center.alerts.length >= 8);
  assert.ok(center.scorecard.overallBusinessScore > 0);
  assert.ok(buildTopicAuthorityRollup().length > 0);
});
