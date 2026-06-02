import assert from "node:assert/strict";
import test from "node:test";

import {
  ACCOUNT_CREATION_TRIGGERS,
  CONTENT_CONVERSION_PATHS,
  INTELLIGENT_PAYWALL_RULES,
  LEAD_MAGNETS,
  PROFESSION_FUNNELS,
  SUBSCRIPTION_VALUE_COMMUNICATION,
  buildConversionAttributionSummary,
  buildExecutiveConversionDashboard,
  buildSocialProofLines,
  buildSubscriptionDecisionAnalytics,
  getConversionPathForSurface,
  getProfessionFunnel,
  selectLeadMagnetsForProfession,
  selectPaywallPrompt,
  type ConversionAttributionEvent,
  type ConversionFeature,
  type PublicContentSurface,
} from "./healthcare-learner-conversion-architecture";

test("every public content surface has a staged conversion path", () => {
  const requiredSurfaces: readonly PublicContentSurface[] = [
    "Disease Page",
    "Medication Page",
    "Care Plan Page",
    "Lab Page",
    "Clinical Skills Page",
    "Career Guide",
    "Certification Guide",
    "Interview Guide",
    "Placement Guide",
  ];

  assert.deepEqual(
    CONTENT_CONVERSION_PATHS.map((path) => path.surface).sort(),
    [...requiredSurfaces].sort(),
  );

  for (const surface of requiredSurfaces) {
    const path = getConversionPathForSurface(surface);
    assert.deepEqual(path.stageSequence, ["free_value", "account_creation", "trial", "subscription"]);
    assert.ok(path.freeValueCta);
    assert.ok(path.accountCta);
    assert.ok(path.trialCta);
    assert.ok(path.subscriptionCta);
    assert.ok(path.relatedPremiumPreviewCards.length >= 3);
  }
});

test("account creation triggers are value-based rather than subscription-first", () => {
  assert.deepEqual([...ACCOUNT_CREATION_TRIGGERS].sort(), [
    "bookmark_content",
    "create_notebook",
    "create_study_plan",
    "save_content",
    "save_notes",
    "track_progress",
    "use_calculator",
    "use_readiness_tools",
  ]);
});

test("lead magnets require an account and provide bounded samples", () => {
  assert.equal(LEAD_MAGNETS.length, 6);
  for (const leadMagnet of LEAD_MAGNETS) {
    assert.equal(leadMagnet.requiresAccount, true);
    assert.equal(leadMagnet.included.readinessSample, true);
    assert.ok(leadMagnet.included.questions <= 10);
    assert.ok(leadMagnet.included.flashcards <= 20);
    assert.ok(leadMagnet.upgradeBridge.includes("Upgrade"));
  }

  assert.deepEqual(
    selectLeadMagnetsForProfession("Admissions").map((leadMagnet) => leadMagnet.kind).sort(),
    ["Free CASPER Pack", "Free HESI Pack", "Free TEAS Pack"],
  );
});

test("intelligent paywalls trigger only after meaningful free use", () => {
  assert.equal(selectPaywallPrompt({ feature: "Questions", usageCount: 2 }), null);
  assert.equal(selectPaywallPrompt({ feature: "Questions", usageCount: 3 })?.id, "questions-3");
  assert.equal(selectPaywallPrompt({ feature: "Flashcards", usageCount: 9 }), null);
  assert.equal(selectPaywallPrompt({ feature: "Flashcards", usageCount: 10 })?.id, "flashcards-10");
  assert.equal(selectPaywallPrompt({ feature: "ECG", usageCount: 1 })?.id, "ecg-1");
  assert.equal(selectPaywallPrompt({ feature: "Simulations", usageCount: 1 })?.id, "simulation-1");
  assert.equal(INTELLIGENT_PAYWALL_RULES.every((rule) => rule.valueMessage.length > 20), true);
});

test("profession funnels are customized and include feature discovery before purchase", () => {
  const expectedFeatures: readonly ConversionFeature[] = [
    "Lessons",
    "Flashcards",
    "Questions",
    "CAT",
    "NGN",
    "ECG",
    "Labs",
    "Medication Math",
    "Clinical Skills",
    "Simulations",
    "Study Plans",
    "Notebook",
    "Readiness",
  ];

  assert.equal(PROFESSION_FUNNELS.length, 11);
  for (const feature of expectedFeatures) {
    assert.ok(getProfessionFunnel("RN").discoveryFeatures.includes(feature));
  }

  assert.ok(getProfessionFunnel("RT").professionSpecificProof.includes("ventilator management"));
  assert.ok(getProfessionFunnel("Paramedic").professionSpecificProof.includes("primary survey"));
  assert.ok(getProfessionFunnel("OT").professionSpecificProof.includes("ADL assessment"));
  assert.ok(getProfessionFunnel("PT").professionSpecificProof.includes("gait assessment"));
  assert.ok(getProfessionFunnel("MLT").professionSpecificProof.includes("critical value reporting"));
  assert.ok(getProfessionFunnel("PSW").professionSpecificProof.includes("resident safety"));
});

test("content attribution summarizes accounts, trials, subscriptions, and revenue", () => {
  const events = sampleEvents();
  const summary = buildConversionAttributionSummary(events);

  assert.equal(summary.accountsByPage["/conditions/heart-failure"], 1);
  assert.equal(summary.trialsByPage["/conditions/heart-failure"], 1);
  assert.equal(summary.subscriptionsByPage["/conditions/heart-failure"], 1);
  assert.equal(summary.revenueByCluster["Heart Failure"], 2900);
  assert.equal(summary.revenueByProfession.RN, 2900);
  assert.equal(summary.revenueByProfession.RT, 4900);
  assert.equal(summary.revenueByFeature.Questions, 2900);
  assert.equal(summary.highestConvertingPages[0]?.page, "/rt/abg-interpretation-guide");
});

test("subscription decision analytics explains what influenced purchase", () => {
  const analytics = buildSubscriptionDecisionAnalytics(sampleEvents(), "user-rn-1");

  assert.ok(analytics);
  assert.equal(analytics.sessionsBeforeSubscription, 2);
  assert.deepEqual(analytics.viewedPages, ["/conditions/heart-failure"]);
  assert.deepEqual(analytics.influentialFeatures, ["Questions", "Readiness"]);
  assert.equal(analytics.highestSignal, "readiness_value");
});

test("executive dashboard exposes conversion and revenue by key dimensions", () => {
  const events = sampleEvents();
  const attribution = buildConversionAttributionSummary(events);
  const dashboard = buildExecutiveConversionDashboard({
    visitors: 1000,
    accounts: 120,
    trials: 60,
    paid: 18,
    renewals: 14,
    attribution,
    events,
  });

  assert.equal(dashboard.visitorToAccountRate, 0.12);
  assert.equal(dashboard.accountToTrialRate, 0.5);
  assert.equal(dashboard.trialToPaidRate, 0.3);
  assert.equal(dashboard.paidToRenewalRate, 14 / 18);
  assert.equal(dashboard.revenueByContentType["Disease Page"], 2900);
  assert.equal(dashboard.revenueByContentType["Lab Page"], 4900);
});

test("value communication separates free education from premium training", () => {
  assert.ok(SUBSCRIPTION_VALUE_COMMUNICATION.freeIncludes.includes("Authority articles"));
  assert.ok(SUBSCRIPTION_VALUE_COMMUNICATION.premiumIncludes.includes("Question banks"));
  assert.ok(SUBSCRIPTION_VALUE_COMMUNICATION.premiumIncludes.includes("Readiness analytics"));
  assert.ok(SUBSCRIPTION_VALUE_COMMUNICATION.differentiators.includes("Clinical reasoning emphasis"));

  assert.deepEqual(buildSocialProofLines({
    questionsCompleted: 1287000,
    learnersServed: 42000,
    hoursStudied: 91000,
    successStories: 375,
    certificationSuccesses: 220,
    programAdmissions: 160,
    clinicalPlacementOutcomes: 90,
  })[0], "1,287,000 Questions Completed");
});

function sampleEvents(): ConversionAttributionEvent[] {
  return [
    {
      visitorId: "visitor-rn-1",
      userId: "user-rn-1",
      stage: "account_creation",
      sourcePage: "/conditions/heart-failure",
      sourceSurface: "Disease Page",
      cluster: "Heart Failure",
      profession: "RN",
      feature: "Questions",
      contentType: "Disease Page",
      occurredAt: "2026-05-01T10:00:00.000Z",
    },
    {
      visitorId: "visitor-rn-1",
      userId: "user-rn-1",
      stage: "trial",
      sourcePage: "/conditions/heart-failure",
      sourceSurface: "Disease Page",
      cluster: "Heart Failure",
      profession: "RN",
      feature: "Readiness",
      contentType: "Disease Page",
      occurredAt: "2026-05-01T10:08:00.000Z",
    },
    {
      visitorId: "visitor-rn-1",
      userId: "user-rn-1",
      stage: "subscription",
      sourcePage: "/conditions/heart-failure",
      sourceSurface: "Disease Page",
      cluster: "Heart Failure",
      profession: "RN",
      feature: "Questions",
      contentType: "Disease Page",
      occurredAt: "2026-05-02T12:00:00.000Z",
      revenueCents: 2900,
    },
    {
      visitorId: "visitor-rt-1",
      userId: "user-rt-1",
      stage: "subscription",
      sourcePage: "/rt/abg-interpretation-guide",
      sourceSurface: "Lab Page",
      cluster: "ABG Interpretation",
      profession: "RT",
      feature: "Labs",
      contentType: "Lab Page",
      occurredAt: "2026-05-03T12:00:00.000Z",
      revenueCents: 4900,
    },
  ];
}
