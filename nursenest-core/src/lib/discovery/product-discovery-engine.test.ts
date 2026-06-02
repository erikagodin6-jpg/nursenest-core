import assert from "node:assert/strict";
import test from "node:test";

import {
  buildFeatureDiscoveryUsageSnapshot,
  buildProductDiscoveryDashboard,
  buildProductDiscoveryInsights,
} from "@/lib/discovery/product-discovery-engine";
import type { FeatureImpactAnalyticsRow } from "@/lib/discovery/feature-value-communication";

test("product discovery dashboard separates completed, started, and unexplored ecosystem modules", () => {
  const dashboard = buildProductDiscoveryDashboard({
    tier: "RN",
    learnerPath: "ca-rn-nclex-rn",
    usage: buildFeatureDiscoveryUsageSnapshot({
      questionsAnswered: 120,
      practiceSessions: 4,
      flashcardsReviewed: 2,
      lessonsCompleted: 0,
      readinessScoreAvailable: true,
      labsCompleted: 0,
    }),
    weakTopics: ["heart failure", "electrolytes", "pharmacology"],
  });

  assert.ok(dashboard.completed.some((module) => module.key === "questions"));
  assert.ok(dashboard.started.some((module) => module.key === "flashcards"));
  assert.ok(dashboard.notYetExplored.some((module) => module.key === "labs"));
  assert.ok(dashboard.recommendations.some((recommendation) => recommendation.targetFeature === "labs"));
  assert.equal(dashboard.sevenDayDiscoveryGoal.target, 5);
  assert.equal(dashboard.thirtyDayDiscoveryGoal.target, 8);
});

test("first-time learners receive first visit and first module moments", () => {
  const dashboard = buildProductDiscoveryDashboard({
    tier: "RN",
    learnerPath: "ca-rn-nclex-rn",
    usage: {},
  });

  assert.ok(dashboard.firstTimeMoments.includes("first_visit"));
  assert.ok(dashboard.firstTimeMoments.includes("first_module_use"));
  assert.ok(dashboard.notYetExplored.length >= 8);
});

test("power users receive advanced recommendations", () => {
  const dashboard = buildProductDiscoveryDashboard({
    tier: "RN",
    learnerPath: "ca-rn-nclex-rn",
    usage: buildFeatureDiscoveryUsageSnapshot({
      questionsAnswered: 200,
      practiceSessions: 5,
      flashcardsReviewed: 50,
      lessonsCompleted: 6,
      labsCompleted: 3,
      medicationMathCompleted: 2,
      readinessScoreAvailable: true,
    }),
  });

  assert.ok(dashboard.recommendations.some((recommendation) => recommendation.reason === "power_user"));
});

test("marketing insights identify adoption, conversion, retention, and weak discovery features", () => {
  const rows: FeatureImpactAnalyticsRow[] = [
    { featureKey: "questions", eligibleLearners: 100, adoptedLearners: 90, retainedLearners: 70, upgradedLearners: 8, readinessGainPct: 6 },
    { featureKey: "labs", eligibleLearners: 100, adoptedLearners: 20, retainedLearners: 18, upgradedLearners: 7, readinessGainPct: 10 },
    { featureKey: "simulations", eligibleLearners: 100, adoptedLearners: 15, retainedLearners: 14, upgradedLearners: 10, readinessGainPct: 12 },
  ];

  const insights = buildProductDiscoveryInsights(rows);

  assert.deepEqual(insights.mostDiscoveredFeatures.slice(0, 1), ["questions"]);
  assert.equal(insights.leastDiscoveredFeatures[0], "simulations");
  assert.equal(insights.highestConvertingFeatures[0], "simulations");
  assert.ok(insights.highestRetentionFeatures.includes("labs"));
});
