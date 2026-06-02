import assert from "node:assert/strict";
import test from "node:test";
import {
  buildFeatureImpactSummary,
  buildFeatureUsageSnapshot,
  buildFeatureValueProfile,
  mergeFeatureUsageSnapshot,
  normalizeFeatureDiscoveryPathway,
  usageMetric,
  type FeatureImpactAnalyticsRow,
} from "@/lib/discovery/feature-value-communication";

test("normalizes learner tiers and profession hints into feature discovery pathways", () => {
  assert.equal(normalizeFeatureDiscoveryPathway({ tier: "RN", learnerPath: "us-rn-nclex-rn" }), "rn");
  assert.equal(normalizeFeatureDiscoveryPathway({ tier: "RPN", learnerPath: "ca-rpn-rex-pn" }), "rpn");
  assert.equal(normalizeFeatureDiscoveryPathway({ tier: "NP", learnerPath: "ca-np-cnple" }), "np");
  assert.equal(normalizeFeatureDiscoveryPathway({ tier: "ALLIED", alliedCareer: "respiratory_therapy" }), "rt");
  assert.equal(normalizeFeatureDiscoveryPathway({ tier: "NEW_GRAD", learnerPath: "new-grad-rn" }), "new_grad");
  assert.equal(normalizeFeatureDiscoveryPathway({ tier: "RN", learnerPath: "advanced-ecg-mastery" }), "advanced_ecg");
});

test("buildFeatureValueProfile scores only included features and separates upgrades", () => {
  const usage = buildFeatureUsageSnapshot({
    questionsAnswered: 120,
    practiceSessions: 4,
    flashcardsReviewed: 20,
    lessonsCompleted: 2,
    catSessions: 1,
    readinessScoreAvailable: true,
    studyPlanConfigured: false,
    analyticsAvailable: true,
    progressReportAvailable: true,
  });

  const profile = buildFeatureValueProfile({
    pathway: "rn",
    usage,
    hasAdvancedEcgEntitlement: false,
  });

  assert.equal(profile.used.some((item) => item.key === "questions"), true);
  assert.equal(profile.used.some((item) => item.key === "flashcards"), true);
  assert.equal(profile.notYetUsed.some((item) => item.key === "study_plans"), true);
  assert.equal(profile.upgrades.some((item) => item.key === "advanced_ecg"), true);
  assert.equal(profile.included.some((item) => item.key === "advanced_ecg"), false);
  assert.ok(profile.utilizationScore > 0);
  assert.ok(profile.utilizationScore < 100);
});

test("advanced ECG entitlement moves the add-on from upgrade discovery into included value", () => {
  const profile = buildFeatureValueProfile({
    pathway: "rn",
    usage: { advanced_ecg: usageMetric(true) },
    hasAdvancedEcgEntitlement: true,
  });

  assert.equal(profile.included.some((item) => item.key === "advanced_ecg"), true);
  assert.equal(profile.upgrades.some((item) => item.key === "advanced_ecg"), false);
  assert.equal(profile.used.some((item) => item.key === "advanced_ecg"), true);
});

test("RPN profile does not expose ECG fundamentals or Advanced ECG as included features", () => {
  const profile = buildFeatureValueProfile({
    pathway: "rpn",
    usage: buildFeatureUsageSnapshot({ questionsAnswered: 20, practiceSessions: 1 }),
  });

  assert.equal(profile.included.some((item) => item.key === "ecg_core"), false);
  assert.equal(profile.included.some((item) => item.key === "advanced_ecg"), false);
  assert.equal(profile.upgrades.some((item) => item.key === "advanced_ecg"), false);
});

test("discovery prompts highlight unused weak-area features and advanced ECG upgrades", () => {
  const profile = buildFeatureValueProfile({
    pathway: "rn",
    usage: buildFeatureUsageSnapshot({
      questionsAnswered: 100,
      practiceSessions: 3,
      flashcardsReviewed: 0,
      lessonsCompleted: 1,
      catSessions: 0,
      readinessScoreAvailable: true,
      analyticsAvailable: true,
    }),
    weakTopics: ["cardiac pharmacology", "anticoagulants"],
    hasAdvancedEcgEntitlement: false,
  });

  assert.ok(profile.prompts.some((prompt) => prompt.featureKey === "pharmacology"));
  assert.ok(profile.prompts.some((prompt) => prompt.featureKey === "flashcards"));
  assert.ok(profile.prompts.some((prompt) => prompt.featureKey === "advanced_ecg" && prompt.tone === "upgrade"));
});

test("mergeFeatureUsageSnapshot preserves totals and latest usage timestamp", () => {
  const merged = mergeFeatureUsageSnapshot(
    { flashcards: usageMetric({ launches: 1, completions: 1, itemsCompleted: 10, lastUsedAt: "2026-01-01T00:00:00.000Z" }) },
    { flashcards: usageMetric({ launches: 2, completions: 1, itemsCompleted: 5, lastUsedAt: "2026-02-01T00:00:00.000Z" }) },
  );

  assert.equal(merged.flashcards?.launches, 3);
  assert.equal(merged.flashcards?.completions, 2);
  assert.equal(merged.flashcards?.itemsCompleted, 15);
  assert.equal(merged.flashcards?.lastUsedAt, "2026-02-01T00:00:00.000Z");
});

test("buildFeatureImpactSummary identifies adoption, retention, upgrade, and unused rates", () => {
  const rows: FeatureImpactAnalyticsRow[] = [
    {
      featureKey: "questions",
      eligibleLearners: 100,
      adoptedLearners: 80,
      retainedLearners: 70,
      upgradedLearners: 10,
      readinessGainPct: 8,
    },
    {
      featureKey: "advanced_ecg",
      eligibleLearners: 50,
      adoptedLearners: 10,
      retainedLearners: 9,
      upgradedLearners: 8,
      readinessGainPct: 12,
    },
  ];

  const summary = buildFeatureImpactSummary(rows);

  assert.equal(summary.adoptionRows.find((row) => row.featureKey === "questions")?.adoptionRate, 80);
  assert.equal(summary.adoptionRows.find((row) => row.featureKey === "advanced_ecg")?.upgradeContribution, 80);
  assert.equal(summary.unusedFeatureRate, 40);
  assert.deepEqual(summary.topAdoptionDrivers.slice(0, 1), ["questions"]);
  assert.deepEqual(summary.topUpgradeDrivers.slice(0, 1), ["advanced_ecg"]);
});
