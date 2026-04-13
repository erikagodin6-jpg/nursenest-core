import assert from "node:assert/strict";
import test from "node:test";
import { computeReadinessScore } from "@/lib/coach/study-coach-readiness";
import { rankStudyPriorities } from "@/lib/coach/study-coach-priorities";
import { detectReviewSessionInterventions, rankInterventions } from "@/lib/coach/study-coach-interventions";
import { followUpsForIntent, INTENT_TITLES } from "@/lib/coach/study-coach-followups";
import type { CoachContextInput } from "@/lib/coach/study-coach-types";
import type { CoachIntent } from "@/lib/coach/study-coach-types";

test("readiness band aligns with score thresholds", () => {
  const low = computeReadinessScore({
    latestReadinessScore: 30,
    practiceAccuracyPct: 40,
    weakTopicCount: 8,
    improvingTopicCount: 0,
    decliningTopicCount: 3,
    mockExamAvgPct: null,
    lessonsCompletedRatio: null,
    reviewCompletionRate: null,
    daysSinceLastActivity: 10,
    difficultyGapScore: 70,
    appReadinessScore: 30,
    practiceTrend: "declining",
  });
  assert.equal(low.band, "at_risk");
  assert.ok(low.score < 45);

  const high = computeReadinessScore({
    latestReadinessScore: 88,
    practiceAccuracyPct: 82,
    weakTopicCount: 1,
    improvingTopicCount: 2,
    decliningTopicCount: 0,
    mockExamAvgPct: 78,
    lessonsCompletedRatio: 0.5,
    reviewCompletionRate: 0.6,
    daysSinceLastActivity: 1,
    difficultyGapScore: 30,
    appReadinessScore: 88,
    practiceTrend: "improving",
  });
  assert.equal(high.band, "strong");
  assert.ok(high.score >= 80);
});

test("rankStudyPriorities is deterministic for the same input", () => {
  const input: CoachContextInput = {
    recentAccuracyPct: 62,
    weakTopicCount: 2,
    weakTopics: [
      { topic: "Fluid Balance", topicSlug: "fluid-balance", missRate: 72, attempted: 12, wrongStreak: 2 },
      { topic: "Infection Control", topicSlug: "infection-control", missRate: 55, attempted: 20 },
    ],
    topicsImproving: [],
    topicsDeclining: ["Fluid Balance"],
    recentSessionsSample: 4,
    mockExamAvgPct: null,
    catOrPracticeAvgPct: 62,
    reviewCompletionRate: 0.4,
    daysSinceLastActivity: 2,
    difficultyGapScore: 50,
    appReadinessScore: 60,
    practiceTrend: "stable",
    lessonsCompletedRatio: 0.2,
  };
  const a = rankStudyPriorities(input, 6);
  const b = rankStudyPriorities(input, 6);
  assert.deepEqual(a, b);
  assert.ok(a.length >= 1);
});

test("smart review session flags multiple high-confidence misses", () => {
  const items = [
    { topic: "A", isCorrect: false, confidence: "high" as const },
    { topic: "B", isCorrect: false, confidence: "high" as const },
  ];
  const raw = detectReviewSessionInterventions(items);
  const top = rankInterventions(raw)[0];
  assert.ok(top);
  assert.equal(top.type, "confidence_mismatch");
});

test("every coach intent has follow-up graph entries and a title", () => {
  const intents = Object.keys(INTENT_TITLES) as CoachIntent[];
  for (const intent of intents) {
    assert.ok(INTENT_TITLES[intent]?.length, `missing title for ${intent}`);
    const ups = followUpsForIntent(intent);
    assert.ok(Array.isArray(ups), `followUpsForIntent(${intent})`);
  }
});
