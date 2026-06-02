import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  analyzeQuestionQuality,
  buildAdaptiveStudyPlan,
  buildPeerBenchmark,
  buildPremiumReportCard,
  buildUsageEvidenceReport,
  computePremiumReadinessSnapshot,
  PREMIUM_ECOSYSTEM_CAPABILITY_MAP,
} from "./premium-success-ecosystem";

describe("premium success ecosystem", () => {
  it("computes readiness from multiple longitudinal learning signals", () => {
    const snapshot = computePremiumReadinessSnapshot(
      {
        program: "NCLEX-RN",
        catPerformancePct: 92,
        practiceAccuracyPct: 74,
        flashcardMasteryPct: 48,
        lessonCompletionPct: 61,
        clinicalSkillsPct: 66,
        pharmacologyPct: 50,
        prioritizationPct: 77,
        delegationPct: 69,
        clinicalJudgmentPct: 73,
        trendDeltaPct: 4,
        consistencyPct: 70,
        studyDaysLast14: 9,
        sampleSize: 210,
      },
      new Date("2026-05-28T00:00:00Z"),
    );

    assert.equal(snapshot.program, "NCLEX-RN");
    assert.equal(snapshot.confidence, "high");
    assert.ok(
      snapshot.readinessScore < 92,
      "CAT alone must not dominate readiness",
    );
    assert.ok(
      snapshot.dimensions.pharmacology.score <
        snapshot.dimensions.prioritization.score,
    );
    assert.match(snapshot.generatedAt, /^2026-05-28/);
  });

  it("generates adaptive plans from weakest readiness dimensions", () => {
    const snapshot = computePremiumReadinessSnapshot({
      program: "REx-PN",
      catPerformancePct: 71,
      practiceAccuracyPct: 67,
      flashcardMasteryPct: 44,
      lessonCompletionPct: 58,
      clinicalSkillsPct: 63,
      pharmacologyPct: 39,
      sampleSize: 88,
    });
    const plan = buildAdaptiveStudyPlan(snapshot, "daily");

    assert.equal(plan.program, "REx-PN");
    assert.ok(plan.items.length > 0);
    assert.ok(
      plan.items.some(
        (item) => item.kind === "pharmacology" || item.kind === "flashcard",
      ),
    );
    assert.ok(plan.totalMinutes > 0);
  });

  it("hides peer benchmarking below privacy threshold", () => {
    const benchmark = buildPeerBenchmark({
      cohortSize: 42,
      learnerScore: 80,
      cohortScoresSortedAsc: Array.from({ length: 42 }, (_, i) => i + 40),
      cohortLabel: "RN learners",
    });

    assert.equal(benchmark.active, false);
    assert.equal(benchmark.percentile, null);
  });

  it("activates anonymized benchmarking when threshold is met", () => {
    const scores = Array.from({ length: 100 }, (_, i) => i);
    const benchmark = buildPeerBenchmark({
      cohortSize: scores.length,
      learnerScore: 78,
      cohortScoresSortedAsc: scores,
      cohortLabel: "RN learners",
    });

    assert.equal(benchmark.active, true);
    assert.equal(benchmark.percentile, 79);
    assert.match(benchmark.message, /RN learners/);
  });

  it("flags poor question quality and prioritizes review", () => {
    const review = analyzeQuestionQuality({
      questionId: "q1",
      totalAttempts: 120,
      correctAttempts: 12,
      highPerformerCorrectPct: 0.22,
      lowPerformerCorrectPct: 0.28,
      optionSelections: { A: 0, B: 76, C: 22, D: 22 },
      correctOption: "A",
      averageTimeSeconds: 180,
    });

    assert.ok(review.flags.some((flag) => flag.code === "answer_key_error"));
    assert.ok(
      review.flags.some((flag) => flag.code === "negative_discrimination"),
    );
    assert.ok(review.reviewPriority >= 80);
  });

  it("builds professional report cards and chargeback evidence summaries", () => {
    const snapshot = computePremiumReadinessSnapshot({
      program: "New Grad Programs",
      practiceAccuracyPct: 75,
      clinicalSkillsPct: 80,
      clinicalJudgmentPct: 72,
      delegationPct: 65,
      trendDeltaPct: 3,
      consistencyPct: 78,
      sampleSize: 75,
    });
    const report = buildPremiumReportCard(snapshot, "weekly", null);
    assert.equal(report.program, "New Grad Programs");
    assert.ok(
      report.sections.some((section) => section.key === "examProjection"),
    );

    const evidence = buildUsageEvidenceReport("user_1", [
      { type: "login", at: "2026-05-27T10:00:00Z" },
      { type: "study_session", at: "2026-05-27T10:05:00Z", minutes: 25 },
      {
        type: "question_answered",
        at: "2026-05-27T10:10:00Z",
        detail: "Practice question",
      },
      { type: "ecg", at: "2026-05-27T10:20:00Z", minutes: 8 },
    ]);

    assert.equal(evidence.totals.logins, 1);
    assert.equal(evidence.totals.estimatedMinutes, 33);
    assert.match(evidence.exportSummary, /1 logins/);
  });

  it("keeps expansion capabilities in one ecosystem registry", () => {
    assert.ok(PREMIUM_ECOSYSTEM_CAPABILITY_MAP.clinicalSkills.includes("SBAR"));
    assert.ok(
      PREMIUM_ECOSYSTEM_CAPABILITY_MAP.pharmacology.includes(
        "Natural supplements",
      ),
    );
    assert.ok(PREMIUM_ECOSYSTEM_CAPABILITY_MAP.ecg.includes("Hemodynamics"));
    assert.ok(PREMIUM_ECOSYSTEM_CAPABILITY_MAP.daily.includes("Daily Skill"));
  });
});
