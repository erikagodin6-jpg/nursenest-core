import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { CatExamReport } from "@/lib/exams/cat-types";
import { buildCatResultsCoach } from "@/lib/practice-tests/cat-results-coach";
import {
  buildMinimalCatStudyFeedbackPayload,
  DEFAULT_CAT_FEEDBACK_MODE,
  EMPTY_CAT_DIFFICULTY_SERIES,
  isSafeInternalStudyLinkHref,
  normalizeCatResultsCoachSnapshot,
  SAFE_EMPTY_LESSON_LINKS,
} from "@/lib/practice-tests/cat-practice-fallbacks";

describe("cat-practice-fallbacks", () => {
  it("exposes stable default constants", () => {
    assert.equal(DEFAULT_CAT_FEEDBACK_MODE, "test");
    assert.deepEqual(EMPTY_CAT_DIFFICULTY_SERIES, []);
    assert.deepEqual(SAFE_EMPTY_LESSON_LINKS, []);
  });

  it("normalizeCatResultsCoachSnapshot marks legacy payloads as omitted outlook/confidence", () => {
    const n = normalizeCatResultsCoachSnapshot(null);
    assert.equal(n.confidenceOmitted, true);
    assert.equal(n.passOutlookOmitted, true);
    assert.ok(Array.isArray(n.studyNext));
  });

  it("normalizeCatResultsCoachSnapshot accepts finite pass outlook and confidence level", () => {
    const n = normalizeCatResultsCoachSnapshot({
      passOutlookPercent: 72,
      confidenceLevel: "high",
      readinessNarrative: "Custom narrative",
    });
    assert.equal(n.passOutlookOmitted, false);
    assert.equal(n.confidenceOmitted, false);
    assert.equal(n.passOutlookPercent, 72);
    assert.equal(n.readinessNarrative, "Custom narrative");
  });

  it("normalizeCatResultsCoachSnapshot drops blank titles and unsafe studyNext hrefs", () => {
    const n = normalizeCatResultsCoachSnapshot({
      studyNext: [
        { title: "Topic A", reason: "weak", links: [{ label: "L", href: "/app/lessons/x", kind: "lesson" }] },
        { title: "", reason: "x", links: [] },
        {
          title: "Bad link",
          reason: "x",
          links: [{ label: "x", href: "https://evil.test", kind: "lesson" }],
        },
      ],
    });
    assert.equal(n.studyNext.length, 2);
    const topicA = n.studyNext.find((s) => s.title === "Topic A");
    assert.ok(topicA);
    assert.equal(topicA?.links.length, 1);
    assert.equal(topicA?.links[0]?.href, "/app/lessons/x");
    const bad = n.studyNext.find((s) => s.title === "Bad link");
    assert.ok(bad);
    assert.equal(bad?.links.length, 0);
  });

  it("buildMinimalCatStudyFeedbackPayload always returns layers and question id", () => {
    const p = buildMinimalCatStudyFeedbackPayload({ questionId: "q_test_123", isCorrect: false });
    assert.equal(p.questionId, "q_test_123");
    assert.equal(p.isCorrect, false);
    assert.ok(p.layers?.level1Short && p.layers.level1Short.length > 10);
    assert.deepEqual(p.layers?.relatedLessons, []);
    assert.deepEqual(p.correctKeys, []);
  });

  it("isSafeInternalStudyLinkHref rejects external and unsafe values", () => {
    assert.equal(isSafeInternalStudyLinkHref("/app/lessons/foo"), true);
    assert.equal(isSafeInternalStudyLinkHref("//evil.com"), false);
    assert.equal(isSafeInternalStudyLinkHref("https://x.com"), false);
    assert.equal(isSafeInternalStudyLinkHref("javascript:alert(1)"), false);
  });
});

describe("buildCatResultsCoach resilience", () => {
  const minimalReport: CatExamReport = {
    decision: "uncertain",
    theta: 0,
    se: 0.5,
    totalQuestions: 6,
    correctCount: 4,
    stoppedReason: "completed",
    categoryBreakdown: [],
    weakAreas: [],
    suggestedNextSteps: [],
    readinessScore: 55,
    confidenceLevel: "medium",
    confidenceText: "Moderate confidence.",
    trajectory: "steady",
    readinessHeadline: "Session complete",
  };

  it("builds a coach snapshot with empty histories and no incorrect rows", () => {
    const coach = buildCatResultsCoach({
      report: minimalReport,
      presentationMode: "practice",
      pathwayId: null,
      difficultyHistory: [],
      thetaHistory: [],
      incorrectRows: [],
    });
    assert.ok(coach.readinessNarrative.length > 0);
    assert.equal(coach.difficultyTrendLabel, "flat");
    assert.ok(Array.isArray(coach.specificStudyActions));
    assert.ok(Array.isArray(coach.weaknessInsights));
  });

  it("returns fallback snapshot when report is not a valid CAT exam shape", () => {
    const coach = buildCatResultsCoach({
      report: {} as CatExamReport,
      presentationMode: "practice",
      pathwayId: null,
      difficultyHistory: [],
      thetaHistory: [],
      incorrectRows: [],
    });
    assert.equal(coach.readinessHeadline, "CAT summary unavailable");
  });
});
