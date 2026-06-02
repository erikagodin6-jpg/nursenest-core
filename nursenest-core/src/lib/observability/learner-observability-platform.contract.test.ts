/**
 * Learner Observability Platform — Contract Tests
 *
 * Verifies the structural contract of all observability modules:
 *   - Required exports present
 *   - Event taxonomy completeness
 *   - Health score computation correctness
 *   - Friction scoring correctness
 *   - Time-to-learning budget definitions
 *   - Chargeback report schema
 *   - SEO baseline completeness
 *   - Feature health computation
 *
 * These tests run without a database or running server.
 * All modules use in-memory state or pure computation.
 */

import assert from "node:assert/strict";
import test from "node:test";

// ─── Event taxonomy ───────────────────────────────────────────────────────────

import {
  LEARNER_EVENTS,
  BILLING_EVENTS,
  PERFORMANCE_EVENTS,
  AUTH_EVENTS,
  CONTENT_EVENTS,
  SEO_EVENTS,
  AUDIT_EVENTS,
  ALL_EVENTS,
  isKnownEvent,
} from "@/lib/observability/event-taxonomy";

test("event taxonomy: all categories present", () => {
  assert.ok(Object.keys(LEARNER_EVENTS).length >= 10, "LEARNER_EVENTS must have ≥10 events");
  assert.ok(Object.keys(BILLING_EVENTS).length >= 8, "BILLING_EVENTS must have ≥8 events");
  assert.ok(Object.keys(PERFORMANCE_EVENTS).length >= 5, "PERFORMANCE_EVENTS must have ≥5 events");
  assert.ok(Object.keys(AUTH_EVENTS).length >= 5, "AUTH_EVENTS must have ≥5 events");
  assert.ok(Object.keys(CONTENT_EVENTS).length >= 8, "CONTENT_EVENTS must have ≥8 events");
  assert.ok(Object.keys(SEO_EVENTS).length >= 3, "SEO_EVENTS must have ≥3 events");
  assert.ok(Object.keys(AUDIT_EVENTS).length >= 5, "AUDIT_EVENTS must have ≥5 events");
});

test("event taxonomy: ALL_EVENTS contains all categories", () => {
  const total = Object.keys(ALL_EVENTS).length;
  assert.ok(total >= 50, `ALL_EVENTS must have ≥50 events, got ${total}`);
});

test("event taxonomy: isKnownEvent recognizes valid events", () => {
  assert.ok(isKnownEvent(LEARNER_EVENTS.ACTIVITY_STARTED));
  assert.ok(isKnownEvent(BILLING_EVENTS.SUBSCRIPTION_CANCELLED));
  assert.ok(!isKnownEvent("made_up_event_xyz"));
});

test("event taxonomy: no duplicate event names", () => {
  const names = Object.values(ALL_EVENTS);
  const unique = new Set(names);
  assert.equal(unique.size, names.length, "Duplicate event names found in taxonomy");
});

// ─── Learner completion observability ─────────────────────────────────────────

import {
  recordActivityStarted,
  recordActivityCompleted,
  recordActivityAbandoned,
  computeActivityHealthScore,
  getAllActivityHealthScores,
  getPlatformActivityHealth,
  resetCompletionObservability,
} from "@/lib/observability/learner-completion-observability";

test("completion observability: health score with no data is 100/healthy", () => {
  resetCompletionObservability();
  const score = computeActivityHealthScore("questions");
  assert.equal(score.score, 100);
  assert.equal(score.status, "healthy");
  assert.equal(score.totalStarted, 0);
});

test("completion observability: low completion rate degrades health score", () => {
  resetCompletionObservability();
  const now = new Date().toISOString();
  for (let i = 0; i < 10; i++) {
    recordActivityStarted({ userId: "u1", activity: "flashcards", tier: "RN", startTimestamp: now });
  }
  for (let i = 0; i < 3; i++) {
    recordActivityCompleted({ userId: "u1", activity: "flashcards", tier: "RN", durationMs: 120_000 });
  }
  const score = computeActivityHealthScore("flashcards");
  assert.ok(score.score < 80, `Score should be <80 with 30% completion, got ${score.score}`);
  assert.ok(score.status !== "healthy", "Should not be healthy with 30% completion");
});

test("completion observability: all activity types have health scores", () => {
  resetCompletionObservability();
  const scores = getAllActivityHealthScores();
  assert.equal(scores.length, 13, "Should have 13 activity types");
  for (const s of scores) {
    assert.ok(typeof s.score === "number", `Score must be a number for ${s.activity}`);
    assert.ok(["healthy", "watch", "degraded", "critical"].includes(s.status));
  }
});

test("completion observability: platform health aggregates correctly", () => {
  resetCompletionObservability();
  const health = getPlatformActivityHealth();
  assert.ok(typeof health.overallScore === "number");
  assert.ok(["healthy", "watch", "degraded", "critical"].includes(health.status));
  assert.ok(Array.isArray(health.degradedActivities));
});

// ─── User friction detector ───────────────────────────────────────────────────

import {
  recordFrictionEvent,
  computeFrustrationScore,
  computeUserFrustrationScore,
  getPlatformFrictionSummary,
  resetFrictionStore,
} from "@/lib/observability/user-friction-detector";

test("friction detector: no events = score 0 / level low", () => {
  resetFrictionStore();
  const score = computeFrustrationScore("user1:session1");
  assert.equal(score.score, 0);
  assert.equal(score.level, "low");
});

test("friction detector: repeated high-weight events escalate to high/critical", () => {
  resetFrictionStore();
  for (let i = 0; i < 5; i++) {
    recordFrictionEvent({
      userId: "u2",
      sessionId: "s2",
      signal: "activity_launch_failed",
      activity: "cat",
    });
  }
  const score = computeFrustrationScore("u2:s2");
  assert.ok(score.score > 20, `Score should be >20 with repeated failures, got ${score.score}`);
  assert.ok(["moderate", "high", "critical"].includes(score.level));
});

test("friction detector: platform summary returns active sessions", () => {
  resetFrictionStore();
  recordFrictionEvent({ userId: "u3", sessionId: "s3", signal: "rapid_refresh" });
  const summary = getPlatformFrictionSummary();
  assert.ok(summary.activeSessions > 0);
  assert.ok(Array.isArray(summary.topSignals));
});

// ─── Time to learning ─────────────────────────────────────────────────────────

import {
  TIME_TO_LEARNING_BUDGETS,
  recordSessionStart,
  recordFirstActivity,
  getTimeToLearningStats,
  resetTimeToLearningMetrics,
} from "@/lib/observability/time-to-learning-metrics";

test("time-to-learning: all required journeys have budgets", () => {
  const journeys = TIME_TO_LEARNING_BUDGETS.map((b) => b.journey);
  const required = ["questions", "flashcards", "lessons", "cat", "loft", "ecg", "pharmacology"];
  for (const j of required) {
    assert.ok(journeys.includes(j as Parameters<typeof journeys.includes>[0]), `Missing budget for journey: ${j}`);
  }
});

test("time-to-learning: questions and flashcards target < 3s", () => {
  const q = TIME_TO_LEARNING_BUDGETS.find((b) => b.journey === "questions");
  const f = TIME_TO_LEARNING_BUDGETS.find((b) => b.journey === "flashcards");
  assert.ok(q && q.p50TargetMs <= 3000, "Questions p50 target must be ≤3000ms");
  assert.ok(f && f.p50TargetMs <= 3000, "Flashcards p50 target must be ≤3000ms");
});

test("time-to-learning: cat and loft have 5s targets", () => {
  const cat = TIME_TO_LEARNING_BUDGETS.find((b) => b.journey === "cat");
  const loft = TIME_TO_LEARNING_BUDGETS.find((b) => b.journey === "loft");
  assert.ok(cat && cat.p50TargetMs <= 5000, "CAT p50 target must be ≤5000ms");
  assert.ok(loft && loft.p50TargetMs <= 5000, "LOFT p50 target must be ≤5000ms");
});

test("time-to-learning: stats return entries for all journeys", () => {
  resetTimeToLearningMetrics();
  const stats = getTimeToLearningStats();
  assert.ok(stats.length >= 7, "Should have stats for ≥7 journeys");
});

// ─── Adaptive learning observability ──────────────────────────────────────────

import {
  recordWeaknessDetected,
  recordRemediationCompleted,
  recordLearningOutcome,
  getTopicImprovementReports,
  getRemediationTypeStats,
  getPlatformRemediationSuccessRate,
  resetAdaptiveLearningObservability,
} from "@/lib/observability/adaptive-learning-observability";

test("adaptive learning: topic improvement tracking works end-to-end", () => {
  resetAdaptiveLearningObservability();
  const topic = "Cardiac Assessment";
  recordWeaknessDetected({ userId: "u1", topic, score: 42, tier: "RN", detectedAt: new Date().toISOString() });
  recordRemediationCompleted({ userId: "u1", topic, type: "flashcards", tier: "RN", durationMs: 180_000 });
  recordLearningOutcome({ userId: "u1", topic, remediationType: "flashcards", beforeScore: 42, afterScore: 61 });

  const reports = getTopicImprovementReports();
  const topicReport = reports.find((r) => r.topic === topic);
  assert.ok(topicReport, "Topic report should exist");
  assert.ok(topicReport.avgScoreGain !== null && topicReport.avgScoreGain > 0, "Should show positive score gain");
});

test("adaptive learning: remediation type stats tracked correctly", () => {
  resetAdaptiveLearningObservability();
  recordRemediationCompleted({ userId: "u1", topic: "Pain Management", type: "lesson", tier: "RN", durationMs: 300_000 });
  recordLearningOutcome({ userId: "u1", topic: "Pain Management", remediationType: "lesson", beforeScore: 55, afterScore: 72 });

  const stats = getRemediationTypeStats();
  const lessonStat = stats.find((s) => s.type === "lesson");
  assert.ok(lessonStat, "Lesson stats should exist");
  assert.equal(lessonStat.completed, 1);
});

test("adaptive learning: remediation success rate computable", () => {
  resetAdaptiveLearningObservability();
  recordLearningOutcome({ userId: "u1", topic: "Topic A", beforeScore: 40, afterScore: 65 });
  recordLearningOutcome({ userId: "u2", topic: "Topic B", beforeScore: 60, afterScore: 55 });
  const rate = getPlatformRemediationSuccessRate();
  assert.ok(rate !== null && rate >= 0 && rate <= 1, "Success rate should be 0–1");
});

// ─── Chargeback / audit trail ─────────────────────────────────────────────────

import {
  recordAuditEvent,
  generateChargebackEvidenceReport,
  resetAuditTrail,
} from "@/lib/observability/user-activity-audit-trail";

test("chargeback report: correct schema version", () => {
  resetAuditTrail();
  const report = generateChargebackEvidenceReport("userId123");
  assert.equal(report.schema, "nursenest.chargeback_evidence.v1");
});

test("chargeback report: records audit events and generates evidence", () => {
  resetAuditTrail();
  const userId = "user-abc";
  recordAuditEvent({ userId, eventType: "login", timestamp: new Date().toISOString(), tier: "RN" });
  recordAuditEvent({ userId, eventType: "questions_session_completed", timestamp: new Date().toISOString(), tier: "RN", quantity: 25 });
  recordAuditEvent({ userId, eventType: "lesson_completed", timestamp: new Date().toISOString(), tier: "RN", quantity: 3 });

  const report = generateChargebackEvidenceReport(userId);
  assert.ok(report.activitySummary.loginCount >= 1);
  assert.ok(report.activitySummary.questionsAnswered >= 25);
  assert.ok(report.activitySummary.lessonsCompleted >= 3);
  assert.ok(report.platformEvidence.length > 0, "Should have platform evidence");
});

// ─── SEO observability ────────────────────────────────────────────────────────

import {
  SEO_BASELINE,
  buildSeoHealthSnapshot,
} from "@/lib/observability/seo-observability";

test("seo observability: healthy snapshot with all requirements met", () => {
  const snapshot = buildSeoHealthSnapshot({
    publishedBlogCount: 80,
    totalBlogCount: 100,
    authorityClusterCount: 30,
    marketingHubCount: SEO_BASELINE.requiredMarketingHubs.length,
    sitemapPresent: true,
    robotsTxtPresent: true,
    foundHubRoutes: [...SEO_BASELINE.requiredMarketingHubs],
  });
  assert.equal(snapshot.overallStatus, "healthy");
  assert.equal(snapshot.alerts.length, 0);
});

test("seo observability: missing sitemap generates critical alert", () => {
  const snapshot = buildSeoHealthSnapshot({
    publishedBlogCount: 80,
    totalBlogCount: 80,
    authorityClusterCount: 30,
    marketingHubCount: 5,
    sitemapPresent: false,
    robotsTxtPresent: true,
  });
  const critical = snapshot.alerts.filter((a) => a.type === "sitemap_missing");
  assert.ok(critical.length > 0, "Should have sitemap_missing alert");
});

test("seo observability: blog count drop generates alert", () => {
  const snapshot = buildSeoHealthSnapshot({
    publishedBlogCount: 20,
    totalBlogCount: 20,
    authorityClusterCount: 30,
    marketingHubCount: 5,
    sitemapPresent: true,
    robotsTxtPresent: true,
  });
  const blogAlert = snapshot.alerts.find((a) => a.type === "blog_count_drop");
  assert.ok(blogAlert, "Should alert on blog count drop");
});

// ─── Feature health engine ────────────────────────────────────────────────────

import {
  computeFeatureHealth,
  computeAllFeatureHealth,
  summarizeFeatureHealth,
} from "@/lib/observability/feature-health-engine";

test("feature health: healthy feature with no adverse signals scores 100", () => {
  const report = computeFeatureHealth("flashcards", {});
  assert.equal(report.score, 100);
  assert.equal(report.status, "healthy");
});

test("feature health: high error rate degrades score", () => {
  const report = computeFeatureHealth("questions", { errorRate: 0.1 });
  assert.ok(report.score <= 80, `Score should be ≤80 with 10% error rate, got ${report.score}`);
  assert.ok(report.status !== "healthy");
});

test("feature health: all features computed correctly", () => {
  const reports = computeAllFeatureHealth({});
  assert.ok(reports.length >= 12, "Should compute health for ≥12 features");
  for (const r of reports) {
    assert.ok(typeof r.score === "number" && r.score >= 0 && r.score <= 100);
    assert.ok(["healthy", "watch", "degraded", "critical"].includes(r.status));
  }
});

test("feature health: summary aggregates correctly", () => {
  const reports = computeAllFeatureHealth({});
  const summary = summarizeFeatureHealth(reports);
  const total = summary.healthyCount + summary.watchCount + summary.degradedCount + summary.criticalCount;
  assert.equal(total, reports.length, "Summary counts must add up to total reports");
  assert.ok(["healthy", "watch", "degraded", "critical"].includes(summary.overallStatus));
});
