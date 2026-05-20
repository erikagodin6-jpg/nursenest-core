import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CatExamReport } from "@/lib/exams/cat-types";
import {
  buildPostExamPerformanceReport,
  resolvePostExamSessionKind,
} from "@/lib/learner/post-exam-performance-report";
import type { PracticeTestConfigJson, PracticeTestResultsJson } from "@/lib/practice-tests/types";

function baseResults(overrides: Partial<PracticeTestResultsJson> = {}): PracticeTestResultsJson {
  return {
    scoreCorrect: 18,
    scoreTotal: 25,
    accuracyPct: 72,
    byTopic: {
      Pharmacology: { correct: 4, total: 8 },
      "Management of Care": { correct: 10, total: 10 },
    },
    weakAreas: ["Pharmacology"],
    ...overrides,
  };
}

function catReport(): CatExamReport {
  return {
    decision: "uncertain",
    result: "BORDERLINE",
    readinessLevel: "Borderline",
    abilityScore: 55,
    confidenceLevelLabel: "Moderate",
    theta: 0.2,
    se: 0.4,
    totalQuestions: 25,
    correctCount: 18,
    stoppedReason: "confidence_pass",
    categoryBreakdown: [
      { category: "Pharmacology", blueprintKey: "pharm", correct: 4, total: 8, strength: "weak" },
      { category: "Management of Care", blueprintKey: "mgmt", correct: 10, total: 10, strength: "strong" },
    ],
    weakAreas: ["Pharmacology"],
    suggestedNextSteps: ["Review pharmacology"],
    readinessScore: 72,
    confidenceLevel: "medium",
    confidenceText: "Moderate estimate for this session.",
    trajectory: "steady",
    readinessHeadline: "Borderline passing readiness",
  };
}

describe("resolvePostExamSessionKind", () => {
  it("detects CAT exam simulation", () => {
    const kind = resolvePostExamSessionKind({
      selectionMode: "cat",
      catPresentationMode: "exam_simulation",
      questionCount: 75,
      topicNames: [],
      difficultyMin: null,
      difficultyMax: null,
      pathwayId: "us-rn-nclex",
      timedMode: true,
      timeLimitSec: 3600,
    });
    assert.equal(kind, "cat");
  });

  it("detects CNPLE LOFT via pathway", () => {
    const kind = resolvePostExamSessionKind(
      {
        selectionMode: "random",
        questionCount: 120,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "canada-np-cnple",
        timedMode: true,
        timeLimitSec: 7200,
        linearDeliveryMode: "exam",
      },
      "canada-np-cnple",
    );
    assert.equal(kind, "loft_simulation");
  });
});

describe("buildPostExamPerformanceReport", () => {
  it("builds prioritized recommendations and competency groups from CAT data", () => {
    const report = buildPostExamPerformanceReport({
      results: baseResults({
        catReport: catReport(),
        catCoach: {
          generatedAt: new Date().toISOString(),
          passOutlookPercent: 58,
          passOutlookDisclaimer: "Estimate only.",
          confidenceLevel: "medium",
          reliabilityLevel: "medium",
          confidenceSummary: "Moderate reliability.",
          readinessHeadline: "Borderline passing readiness",
          readinessNarrative: "Pharmacology needs focused review before your next CAT.",
          strongestDomains: ["Management of Care"],
          weakestDomains: ["Pharmacology"],
          keyRiskFactor: "Pharmacology",
          studyNext: [
            {
              title: "Pharmacology",
              reason: "Lowest accuracy domain.",
              links: [
                {
                  label: "Drill",
                  href: "/app/questions?topic=Pharmacology",
                  kind: "drill",
                },
              ],
            },
          ],
          specificStudyActions: [],
          difficultySeries: [3, 4, 4],
          difficultyTrendLabel: "rising",
          stabilityTrendLabel: "steady",
          stabilityInterpretation: "Steady",
          passingBandRelative: "below",
          passingBandCopy: "Below practice band",
          weaknessInsights: [],
          errorPatterns: [
            {
              code: "prioritization",
              title: "Prioritization",
              detail: "Several misses involved unstable-patient ordering.",
            },
          ],
          multiSessionGuidance: "Compare runs over time.",
        },
      }),
      config: {
        selectionMode: "cat",
        catPresentationMode: "exam_simulation",
        questionCount: 75,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: "us-rn-nclex",
        timedMode: true,
        timeLimitSec: 3600,
      },
      elapsedMs: 45 * 60 * 1000,
      timedMode: true,
      timeLimitSec: 3600,
      questionOutcomes: [
        { questionId: "q1", isCorrect: false, questionType: "SATA", topic: "Pharmacology" },
        { questionId: "q2", isCorrect: true, questionType: "MCQ", topic: "Management of Care" },
      ],
    });

    assert.equal(report.sessionKind, "cat");
    assert.ok(report.recommendations.length >= 1 && report.recommendations.length <= 5);
    assert.ok(report.competencyGroups.some((g) => g.title === "Clinical domains"));
    assert.ok(report.clinicalJudgment.some((c) => c.pattern === "Prioritization"));
    assert.equal(report.overall.scorePct, 72);
    assert.ok(report.timing.avgSecPerQuestion != null);
  });

  it("caps recommendations at five unique hrefs", () => {
    const report = buildPostExamPerformanceReport({
      results: baseResults({ catReport: catReport() }),
      config: {
        selectionMode: "cat",
        questionCount: 30,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        pathwayId: null,
        timedMode: false,
        timeLimitSec: null,
      },
    });
    assert.ok(report.recommendations.length <= 5);
    const hrefs = report.recommendations.map((r) => r.href);
    assert.equal(hrefs.length, new Set(hrefs).size);
  });
});
