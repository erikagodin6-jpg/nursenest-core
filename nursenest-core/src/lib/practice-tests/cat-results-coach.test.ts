import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CatExamReport } from "@/lib/exams/cat-types";
import { buildCatResultsCoach } from "@/lib/practice-tests/cat-results-coach";

function makeReport(overrides: Partial<CatExamReport> = {}): CatExamReport {
  return {
    decision: "pass",
    theta: 0.68,
    se: 0.24,
    totalQuestions: 52,
    correctCount: 34,
    stoppedReason: "confidence_pass",
    categoryBreakdown: [
      { category: "Management of Care", blueprintKey: "management", correct: 7, total: 9, strength: "strong" },
      { category: "Pharmacology", blueprintKey: "pharm", correct: 2, total: 6, strength: "weak" },
      { category: "Safety", blueprintKey: "safety", correct: 4, total: 7, strength: "mixed" },
    ],
    weakAreas: ["Pharmacology"],
    suggestedNextSteps: ["Review pharmacology"],
    readinessScore: 63,
    confidenceLevel: "high",
    confidenceText: "High. Estimate is fairly stable for this session length.",
    trajectory: "steady",
    readinessHeadline: "On track for this session",
    ...overrides,
  };
}

describe("buildCatResultsCoach reliability gating", () => {
  it("downgrades completion reasons with weak evidence to low reliability and neutral language", () => {
    const coach = buildCatResultsCoach({
      report: makeReport({
        stoppedReason: "user_completed" as CatExamReport["stoppedReason"],
        totalQuestions: 11,
        se: 0.83,
        confidenceLevel: "high",
        confidenceText: "High. Estimate is fairly stable for this session length.",
        readinessScore: 66,
      }),
      presentationMode: "practice",
      pathwayId: null,
      difficultyHistory: [3, 3, 4, 4, 5, 5],
      thetaHistory: [0.12, 0.18, 0.21, 0.2],
      incorrectRows: [],
    });

    assert.equal(coach.reliabilityLevel, "low");
    assert.equal(coach.confidenceLevel, "low");
    assert.match(coach.confidenceSummary, /not stable|short|precision|stopped/i);
    assert.doesNotMatch(coach.readinessHeadline, /above the practice passing standard|likely pass/i);
    assert.equal(coach.passingBandRelative, "uncertain");
  });

  it("keeps strong language only when the CAT estimate is stable", () => {
    const coach = buildCatResultsCoach({
      report: makeReport(),
      presentationMode: "practice",
      pathwayId: null,
      difficultyHistory: [3, 3, 4, 4, 5, 5, 5, 6],
      thetaHistory: [0.1, 0.18, 0.24, 0.31, 0.4, 0.51, 0.62],
      incorrectRows: [
        {
          questionType: "MCQ",
          topic: "Pharmacology",
          subtopic: "Adverse effects",
          stem: "Which adverse effect needs follow-up?",
          tags: ["medication"],
          bodySystem: "General",
        },
        {
          questionType: "MCQ",
          topic: "Pharmacology",
          subtopic: "Monitoring",
          stem: "Which lab value matters most?",
          tags: ["medication"],
          bodySystem: "General",
        },
      ],
    });

    assert.equal(coach.reliabilityLevel, "high");
    assert.notEqual(coach.passingBandRelative, "uncertain");
    assert.match(coach.readinessHeadline, /practice passing standard|trending above/i);
  });

  it("suppresses named patterns when there are too few incorrect items", () => {
    const coach = buildCatResultsCoach({
      report: makeReport({
        decision: "uncertain",
        stoppedReason: "completed",
        totalQuestions: 22,
        se: 0.49,
      }),
      presentationMode: "practice",
      pathwayId: null,
      difficultyHistory: [3, 4, 4, 4, 5],
      thetaHistory: [0.02, 0.04, 0.07, 0.09, 0.08],
      incorrectRows: [
        {
          questionType: "MCQ",
          topic: "Safety",
          subtopic: "Prioritization",
          stem: "Which patient should the nurse assess first?",
          tags: [],
          bodySystem: "General",
        },
      ],
    });

    assert.deepEqual(coach.errorPatterns, []);
  });

  it("suppresses weakest-domain bullets when the breakdown is too thin", () => {
    const coach = buildCatResultsCoach({
      report: makeReport({
        decision: "uncertain",
        stoppedReason: "completed",
        totalQuestions: 14,
        se: 0.62,
        categoryBreakdown: [
          { category: "Safety", blueprintKey: "safety", correct: 0, total: 1, strength: "weak" },
          { category: "Infection", blueprintKey: "infection", correct: 1, total: 2, strength: "mixed" },
        ],
        weakAreas: ["Safety"],
      }),
      presentationMode: "practice",
      pathwayId: null,
      difficultyHistory: [3, 3, 3, 4],
      thetaHistory: [0.03, 0.02, -0.01, -0.03],
      incorrectRows: [
        {
          questionType: "MCQ",
          topic: "Safety",
          subtopic: "General",
          stem: "A short question",
          tags: [],
          bodySystem: null,
        },
      ],
    });

    assert.deepEqual(coach.weakestDomains, []);
    assert.equal(coach.weaknessInsights.some((line) => /struggled most|clustered under/i.test(line)), false);
  });
});
