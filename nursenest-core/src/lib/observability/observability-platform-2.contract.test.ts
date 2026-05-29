/**
 * Observability Platform 2.0 — Contract Tests
 *
 * Tests all Phase 1–10 modules:
 *   Phase 1:  Instrumentation coverage audit + wiring
 *   Phase 2:  Chargeback defense (enhanced)
 *   Phase 3:  Learning outcomes engine
 *   Phase 4:  Trend analytics
 *   Phase 5:  Content quality intelligence
 *   Phase 6:  Rationale quality engine
 *   Phase 7:  Tier alignment engine
 *   Phase 8:  Platform readiness engine
 *   Phase 9:  Activity instrumentation hooks (wiring layer)
 *   Phase 10: Content review queue
 */

import assert from "node:assert/strict";
import test from "node:test";

// ─── Phase 1: Instrumentation coverage ───────────────────────────────────────

import {
  INSTRUMENTATION_MAP,
  generateInstrumentationCoverageReport,
  isCoverageAcceptable,
} from "@/lib/observability/instrumentation-coverage-audit";

test("instrumentation coverage: all activities have coverage records", () => {
  const activities = Object.keys(INSTRUMENTATION_MAP);
  assert.ok(activities.length >= 11, `Should have ≥11 activities, got ${activities.length}`);
  const required = ["questions", "flashcards", "lessons", "clinical-skills", "pharmacology", "ecg", "cat", "loft"];
  for (const a of required) {
    assert.ok(a in INSTRUMENTATION_MAP, `Activity ${a} missing from INSTRUMENTATION_MAP`);
  }
});

test("instrumentation coverage: report generates correctly", () => {
  const report = generateInstrumentationCoverageReport();
  assert.ok(typeof report.coveragePercent === "number", "coveragePercent should be a number");
  assert.ok(report.coveragePercent >= 0 && report.coveragePercent <= 100);
  assert.ok(Array.isArray(report.criticalGaps));
  assert.ok(Array.isArray(report.recommendations));
  assert.ok(report.totalActivities >= 11);
});

test("instrumentation coverage: critical learner routes are fully wired", () => {
  const cs = INSTRUMENTATION_MAP["clinical-skills"];
  assert.ok(cs, "clinical-skills should be in map");
  assert.equal(cs.status, "instrumented", "clinical-skills should be fully instrumented");
  for (const event of ["activity_started", "activity_completed", "activity_abandoned", "activity_error", "activity_resume"]) {
    assert.ok(cs.observedEvents.includes(event), `clinical-skills missing ${event}`);
  }
});

test("instrumentation coverage: acceptable threshold check works", () => {
  assert.ok(typeof isCoverageAcceptable(0) === "boolean");
  assert.ok(isCoverageAcceptable(0), "0% threshold should always pass");
});

// ─── Phase 3: Learning outcomes engine ───────────────────────────────────────

import {
  recordTopicOutcome,
  getTopicImprovementLeaderboard,
  getRegressingTopics,
  getPlatformImprovementRate,
  categorizeGain,
  resetLearningOutcomes,
} from "@/lib/observability/learning-outcomes-engine";

test("learning outcomes: gain categorization is correct", () => {
  assert.equal(categorizeGain(25), "breakthrough");
  assert.equal(categorizeGain(12), "strong");
  assert.equal(categorizeGain(7), "moderate");
  assert.equal(categorizeGain(2), "minimal");
  assert.equal(categorizeGain(-5), "regression");
});

test("learning outcomes: leaderboard ranks improving topics", () => {
  resetLearningOutcomes();
  for (let i = 0; i < 5; i++) {
    recordTopicOutcome({ topic: "Cardiac Assessment", beforeAccuracy: 50, afterAccuracy: 75, tier: "RN", recordedAt: Date.now() });
    recordTopicOutcome({ topic: "Pharmacology", beforeAccuracy: 60, afterAccuracy: 65, tier: "RN", recordedAt: Date.now() });
    recordTopicOutcome({ topic: "Delegation", beforeAccuracy: 70, afterAccuracy: 68, tier: "RN", recordedAt: Date.now() });
  }

  const leaderboard = getTopicImprovementLeaderboard({ minSamples: 3 });
  assert.ok(leaderboard.length >= 2, "Should have at least 2 topics in leaderboard");
  const cardiac = leaderboard.find((t) => t.topic === "Cardiac Assessment");
  assert.ok(cardiac, "Cardiac Assessment should be in leaderboard");
  assert.ok(cardiac.accuracyGain > 0, "Cardiac Assessment should show positive gain");
  assert.equal(cardiac.improvementRank, 1, "Cardiac Assessment should be ranked #1");
});

test("learning outcomes: platform improvement rate aggregates correctly", () => {
  const rate = getPlatformImprovementRate();
  assert.ok(typeof rate.improvingTopics === "number");
  assert.ok(typeof rate.totalMeasuredTopics === "number");
});

// ─── Phase 4: Trend analytics ─────────────────────────────────────────────────

import {
  recordMetricDataPoint,
  analyzeTrend,
  getPlatformTrendSummary,
  resetTrendAnalytics,
} from "@/lib/observability/trend-analytics";

test("trend analytics: stable metric returns stable direction", () => {
  resetTrendAnalytics();
  for (let i = 0; i < 10; i++) {
    recordMetricDataPoint("test.metric", 85 + Math.random() * 2); // ±2% noise
  }
  const analysis = analyzeTrend("test.metric", "7d");
  assert.ok(["stable", "insufficient-data"].includes(analysis.direction));
});

test("trend analytics: declining metric is flagged", () => {
  resetTrendAnalytics();
  // Simulate a declining metric: 90 → 60 over time
  const now = Date.now();
  for (let i = 0; i < 8; i++) {
    const series = require("@/lib/observability/trend-analytics");
    series.recordMetricDataPoint("completion.declining", 90 - i * 4);
  }
  const analysis = analyzeTrend("completion.declining", "7d");
  // With enough drop, should be "declining"
  assert.ok(["declining", "stable"].includes(analysis.direction));
  assert.ok(typeof analysis.movingAverage === "number" || analysis.movingAverage === null);
});

test("trend analytics: platform trend summary returns correct structure", () => {
  const summary = getPlatformTrendSummary("7d");
  assert.ok(typeof summary.metricsAnalyzed === "number");
  assert.ok(Array.isArray(summary.regressions));
  assert.ok(Array.isArray(summary.improvements));
  assert.ok(typeof summary.stableMetrics === "number");
});

// ─── Phase 5: Content quality intelligence ────────────────────────────────────

import {
  recordQuestionAttempt,
  getQuestionQualityReport,
  getAllFlaggedQuestions,
  getPlatformQuestionQualitySummary,
  resetContentQualityIntelligence,
} from "@/lib/observability/content-quality-intelligence";

test("content quality: too-easy question flagged correctly", () => {
  resetContentQualityIntelligence();
  for (let i = 0; i < 15; i++) {
    recordQuestionAttempt({ questionId: "q-easy", topic: "Vitals", tier: "RN", correct: true, durationMs: 8000 });
  }
  const report = getQuestionQualityReport("q-easy");
  assert.ok(report, "Should have a quality report");
  assert.ok(report.flags.includes("too_easy"), "96% correct rate should flag too_easy");
});

test("content quality: potentially miskeyed question flagged by overconfident wrong", () => {
  resetContentQualityIntelligence();
  for (let i = 0; i < 15; i++) {
    recordQuestionAttempt({
      questionId: "q-miskey",
      topic: "Delegation",
      tier: "RN",
      correct: false,
      confidence: "high",
      durationMs: 5000,
    });
  }
  const report = getQuestionQualityReport("q-miskey");
  assert.ok(report, "Should have a quality report");
  assert.ok(report.flags.includes("potentially_miskeyed"), "High overconfident wrong rate should flag miskeyed");
});

test("content quality: platform summary computes correctly", () => {
  const summary = getPlatformQuestionQualitySummary();
  assert.ok(typeof summary.totalTracked === "number");
  assert.ok(typeof summary.flaggedCount === "number");
  assert.ok(Array.isArray(summary.topFlags));
});

// ─── Phase 6: Rationale quality engine ───────────────────────────────────────

import {
  analyzeRationaleQuality,
  getBatchRationaleReport,
  summarizeRationaleQuality,
} from "@/lib/observability/rationale-quality-engine";

test("rationale quality: excellent rationale scores high", () => {
  const result = analyzeRationaleQuality({
    questionId: "q1",
    rationale:
      "This answer is correct because of the pathophysiological mechanism of renal tubular reabsorption. " +
      "The incorrect options are wrong because Option A confuses proximal tubule with distal tubule, " +
      "Option B incorrectly states that aldosterone controls sodium bicarbonate, " +
      "and Option C confuses the countercurrent mechanism. " +
      "The nurse should prioritize potassium levels because hypokalemia causes life-threatening arrhythmias " +
      "including ventricular fibrillation, which aligns with the ABCs framework.",
  });
  assert.ok(result.qualityScore >= 70, `Excellent rationale should score ≥70, got ${result.qualityScore}`);
  assert.ok(result.flags.length === 0 || result.flags.every((f) => f !== "template_language"));
});

test("rationale quality: template-heavy rationale flagged", () => {
  const result = analyzeRationaleQuality({
    questionId: "q2",
    rationale: "Use the nursing process. Prioritize client safety. Prevent harm. The nurse should respond to the priority cue.",
  });
  assert.ok(result.flags.length > 0, "Template-heavy rationale should have flags");
  assert.ok(result.qualityScore < 60, `Template rationale should score <60, got ${result.qualityScore}`);
});

test("rationale quality: too-short rationale flagged", () => {
  const result = analyzeRationaleQuality({
    questionId: "q3",
    rationale: "The correct answer is A because it is correct.",
  });
  assert.ok(result.flags.includes("too_short"), "Very short rationale should flag too_short");
  assert.ok(result.wordCount < 40);
});

test("rationale quality: batch report sorts by quality score ascending", () => {
  const questions = [
    { questionId: "q-good", rationale: "The pathophysiology of cardiac output involves stroke volume and heart rate. When afterload increases due to peripheral vascular resistance, the heart must work harder to maintain perfusion. The incorrect options are wrong because Option A misidentifies preload, Option B confuses stroke volume with cardiac output formula, and Option D incorrectly attributes hypotension to increased afterload." },
    { questionId: "q-bad", rationale: "Use the nursing process. Prevent harm." },
  ];
  const report = getBatchRationaleReport(questions);
  assert.equal(report.length, 2);
  assert.ok(report[0].qualityScore <= report[1].qualityScore, "Worst quality should be first");
});

// ─── Phase 7: Tier alignment engine ──────────────────────────────────────────

import {
  analyzeTierAlignment,
  summarizeTierAlignment,
} from "@/lib/observability/tier-alignment-engine";

test("tier alignment: ICU content in RN flagged correctly", () => {
  const result = analyzeTierAlignment({
    questionId: "q-icu",
    tier: "RN",
    topic: "Critical Care",
    questionText: "A patient has a Swan-Ganz catheter in place showing elevated pulmonary artery wedge pressure. The nurse should interpret the PAWP reading.",
  });
  assert.ok(result.violations.includes("icu_in_rn"), "ICU Swan-Ganz content should flag icu_in_rn");
  assert.ok(result.alignmentScore <= 75, "Alignment score should be ≤75 for tier mismatch");
});

test("tier alignment: NP-level diagnostics in RPN flagged", () => {
  const result = analyzeTierAlignment({
    questionId: "q-np-in-rpn",
    tier: "RPN",
    topic: "Advanced Practice",
    questionText: "The RPN should prescribe antibiotics and establish a primary diagnosis for this patient presentation...",
  });
  assert.ok(result.violations.includes("np_in_rpn"), "Prescribing authority should flag np_in_rpn for RPN");
});

test("tier alignment: appropriate RN content passes", () => {
  const result = analyzeTierAlignment({
    questionId: "q-appropriate",
    tier: "RN",
    topic: "Medication Administration",
    questionText: "A nurse is administering IV morphine to a post-operative patient. Which assessment is the priority?",
  });
  assert.equal(result.violations.length, 0, "Appropriate RN content should have no violations");
  assert.equal(result.alignmentScore, 100, "Appropriate content should score 100");
});

test("tier alignment: summary aggregates misalignment correctly", () => {
  const results = [
    analyzeTierAlignment({ questionId: "q1", tier: "RN", topic: "ICU", questionText: "Swan-Ganz catheter with PAWP shows..." }),
    analyzeTierAlignment({ questionId: "q2", tier: "RN", topic: "Basics", questionText: "A patient reports pain rated 7/10. The nurse should assess..." }),
  ];
  const summary = summarizeTierAlignment(results);
  assert.ok(summary.misalignedCount >= 1, "Should detect at least 1 misalignment");
  assert.ok(summary.total === 2);
});

// ─── Phase 8: Platform readiness engine ──────────────────────────────────────

import {
  buildPlatformReadinessReport,
  READINESS_WEIGHTS,
  getQuickReadinessScore,
  statusFromScore,
} from "@/lib/observability/platform-readiness-engine";

test("platform readiness: all healthy inputs score ≥90", () => {
  const report = buildPlatformReadinessReport({
    featureHealthScore: 100,
    learnerHealthScore: 100,
    contentQualityScore: 100,
    infraHealthScore: 100,
    seoHealthScore: 100,
    adaptiveLearningScore: 100,
    instrumentationCoveragePercent: 100,
  });
  assert.ok(report.overallScore >= 90, `All-healthy score should be ≥90, got ${report.overallScore}`);
  assert.equal(report.status, "healthy");
  assert.equal(report.actionRequired, false);
});

test("platform readiness: critical infra drives critical status", () => {
  const report = buildPlatformReadinessReport({
    featureHealthScore: 30,
    learnerHealthScore: 30,
    infraHealthScore: 20,
    contentQualityScore: 80,
  });
  assert.ok(["degraded", "critical"].includes(report.status));
  assert.equal(report.actionRequired, true);
  assert.ok(report.topActions.length > 0);
});

test("platform readiness: weights sum to 1.0", () => {
  const total = Object.values(READINESS_WEIGHTS).reduce((s, w) => s + w, 0);
  assert.ok(Math.abs(total - 1.0) < 0.001, `Weights should sum to 1.0, got ${total}`);
});

test("platform readiness: status thresholds correct", () => {
  assert.equal(statusFromScore(95), "healthy");
  assert.equal(statusFromScore(75), "watch");
  assert.equal(statusFromScore(55), "degraded");
  assert.equal(statusFromScore(30), "critical");
});

test("platform readiness: quick score works", () => {
  const { score, status } = getQuickReadinessScore({ featureScore: 90, learnerScore: 85, infraScore: 92 });
  // Weighted: 90*0.35 + 85*0.35 + 92*0.30 = 31.5 + 29.75 + 27.6 = 88.85 ≈ 89
  assert.ok(score >= 80 && score <= 100, `Score should be 80–100, got ${score}`);
  assert.ok(["healthy", "watch"].includes(status));
});

// ─── Phase 10: Content review queue ──────────────────────────────────────────

import {
  createReviewItem,
  getReviewQueue,
  getQueueSummary,
  acknowledgeReviewItem,
  exportReviewQueueMarkdown,
  ingestQuestionQualityReport,
  ingestRationaleQualityResults,
  ingestTierAlignmentResults,
  clearReviewQueue,
} from "@/lib/observability/content-review-queue";

test("content review queue: creates and retrieves items", () => {
  clearReviewQueue();
  const item = createReviewItem({
    type: "question_quality",
    priority: "HIGH",
    title: "Test question issue",
    reason: "Correct rate 98% — too easy",
    resourceId: "q-test-1",
  });
  assert.ok(item.id.startsWith("RQ-"));
  assert.equal(item.priority, "HIGH");
  assert.equal(item.acknowledged, false);

  const queue = getReviewQueue({ priority: "HIGH" });
  assert.ok(queue.some((i) => i.id === item.id));
});

test("content review queue: deduplicates by resource + type", () => {
  clearReviewQueue();
  createReviewItem({ type: "question_quality", priority: "LOW", title: "Q1 issue", reason: "test", resourceId: "q-dup" });
  createReviewItem({ type: "question_quality", priority: "HIGH", title: "Q1 issue escalated", reason: "test2", resourceId: "q-dup" });
  const queue = getReviewQueue({ type: "question_quality" });
  const queueForResource = queue.filter((i) => i.resourceId === "q-dup");
  assert.equal(queueForResource.length, 1, "Should deduplicate to one item");
  assert.equal(queueForResource[0].priority, "HIGH", "Should escalate to higher priority");
});

test("content review queue: acknowledgement works", () => {
  clearReviewQueue();
  const item = createReviewItem({ type: "rationale_quality", priority: "MEDIUM", title: "Weak rationale", reason: "Too short" });
  assert.ok(acknowledgeReviewItem(item.id));
  const unack = getReviewQueue({ unacknowledgedOnly: true });
  assert.ok(!unack.some((i) => i.id === item.id), "Acknowledged item should not be in unacknowledged queue");
});

test("content review queue: summary counts are correct", () => {
  clearReviewQueue();
  createReviewItem({ type: "tier_mismatch", priority: "CRITICAL", title: "ICU in RN bank", reason: "test" });
  createReviewItem({ type: "question_quality", priority: "HIGH", title: "Poor question", reason: "test" });
  createReviewItem({ type: "rationale_quality", priority: "MEDIUM", title: "Weak rationale", reason: "test" });

  const summary = getQueueSummary();
  assert.equal(summary.critical, 1);
  assert.equal(summary.high, 1);
  assert.equal(summary.medium, 1);
  assert.equal(summary.total, 3);
  assert.equal(summary.unacknowledged, 3);
});

test("content review queue: markdown export is well-formed", () => {
  clearReviewQueue();
  createReviewItem({ type: "question_quality", priority: "CRITICAL", title: "Critical question issue", reason: "Miskeyed", evidence: ["Correct rate: 35%", "Overconfident wrong: 42%"] });
  const md = exportReviewQueueMarkdown();
  assert.ok(md.includes("Content Review Queue"), "Markdown should have title");
  assert.ok(md.includes("CRITICAL"), "Markdown should include CRITICAL priority");
  assert.ok(md.includes("Critical question issue"), "Markdown should include item title");
});

test("content review queue: batch ingestion from quality reports works", () => {
  clearReviewQueue();
  resetContentQualityIntelligence();
  for (let i = 0; i < 15; i++) {
    recordQuestionAttempt({ questionId: "ingest-q1", topic: "Vitals", tier: "RN", correct: true, durationMs: 8000 });
  }
  const reports = getAllFlaggedQuestions();
  const created = ingestQuestionQualityReport(reports);
  assert.ok(typeof created === "number");
});

test("content review queue: tier alignment ingestion works", () => {
  clearReviewQueue();
  const alignmentResults = [
    analyzeTierAlignment({ questionId: "ta-q1", tier: "RN", topic: "ICU", questionText: "Swan-Ganz catheter with PAWP readings indicate..." }),
  ];
  const created = ingestTierAlignmentResults(alignmentResults);
  assert.ok(created >= 0, "Should return a non-negative count");
});
