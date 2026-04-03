import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildAdaptiveRecommendations } from "@/lib/learner/adaptive-recommendations";
import type { ReadinessResult } from "@/lib/learner/readiness-score";
import { normalizeTopicKey } from "@/lib/learner/topic-normalize";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

const readiness: ReadinessResult = {
  score: 45,
  band: "not_ready",
  confidence: "low",
  summary: "Test readiness summary",
  factors: [],
  whatToImprove: [],
  nextActions: [],
  holdingBack: [],
};

function row(partial: Partial<WeakTopicRow> & Pick<WeakTopicRow, "topic">): WeakTopicRow {
  return {
    missed: 2,
    attempted: 6,
    missRate: 33,
    normalizedTopic: partial.normalizedTopic ?? normalizeTopicKey(partial.topic),
    weakPriorityScore: 0.5,
    ...partial,
  };
}

function baseArgs(over: Partial<Parameters<typeof buildAdaptiveRecommendations>[0]> = {}) {
  return {
    examDatePlanType: null,
    examDate: null,
    readiness,
    weakTopics: [] as WeakTopicRow[],
    topicTrends: [],
    streakDays: 5,
    lessonPct: 50,
    lessonsCompleted: 2,
    lessonsTotal: 10,
    studyCadencePreference: null,
    continueLesson: null,
    recommendedQuizTopic: null,
    mockCount: 1,
    practiceSessionCount: 5,
    ...over,
  };
}

describe("buildAdaptiveRecommendations (Study Next)", () => {
  it("merges duplicate canonical topics and orders weakTop3 deterministically", () => {
    const weakTopics: WeakTopicRow[] = [
      row({ topic: "Pharm B", normalizedTopic: "pharmacology", weakPriorityScore: 0.4 }),
      row({ topic: "Pharm A", normalizedTopic: "pharmacology", weakPriorityScore: 0.85 }),
      row({ topic: "Cardiac", normalizedTopic: "cardiac", weakPriorityScore: 0.5 }),
    ];
    const a = buildAdaptiveRecommendations(baseArgs({ weakTopics }));
    assert.equal(a.weakTop3.length, 2);
    assert.ok(a.weakTop3.includes("Cardiac"));
    const p = buildAdaptiveRecommendations(baseArgs({ weakTopics }));
    assert.deepEqual(a.weakTop3, p.weakTop3);
  });

  it("uses a different weak topic for secondary drill when primary is a targeted quiz", () => {
    const weakTopics: WeakTopicRow[] = [
      row({ topic: "Alpha Topic", weakPriorityScore: 0.95 }),
      row({ topic: "Beta Topic", weakPriorityScore: 0.6 }),
    ];
    const r = buildAdaptiveRecommendations(
      baseArgs({
        weakTopics,
        recommendedQuizTopic: "Beta Topic",
        streakDays: 5,
        lessonPct: 50,
        continueLesson: null,
      }),
    );
    assert.match(r.primaryNext.href, /topic=/);
    assert.ok(r.primaryNext.href.includes(encodeURIComponent("Beta Topic")));
    const drill = r.secondary.find((s) => s.title.startsWith("Drill "));
    assert.ok(drill);
    assert.ok(drill!.href.includes(encodeURIComponent("Alpha Topic")));
  });

  it("does not repeat the primary topic in a second topic drill when another weak topic exists", () => {
    const weakTopics: WeakTopicRow[] = [row({ topic: "Only", weakPriorityScore: 0.8 })];
    const r = buildAdaptiveRecommendations(
      baseArgs({
        weakTopics,
        recommendedQuizTopic: "Only",
        streakDays: 5,
        lessonPct: 50,
      }),
    );
    const drills = r.secondary.filter((s) => s.title.startsWith("Drill "));
    assert.equal(drills.length, 0);
  });

  it("caps at three total recommendations and avoids duplicate hrefs", () => {
    const r = buildAdaptiveRecommendations(
      baseArgs({
        weakTopics: [row({ topic: "T1", normalizedTopic: "t1", weakPriorityScore: 0.9 })],
        recommendedQuizTopic: "T1",
        streakDays: 5,
        lessonPct: 50,
        mockCount: 0,
      }),
    );
    assert.ok(r.secondary.length <= 2);
    const hrefs = [r.primaryNext.href, ...r.secondary.map((s) => s.href)];
    assert.equal(new Set(hrefs).size, hrefs.length);
    assert.ok(hrefs.length <= 3);
  });

  it("cold start with no weak signal and no pathway progress prefers first pathway lesson", () => {
    const r = buildAdaptiveRecommendations(
      baseArgs({
        weakTopics: [],
        streakDays: 0,
        lessonPct: 0,
        lessonsCompleted: 0,
        lessonsTotal: 20,
        continueLesson: null,
        mockCount: 0,
        practiceSessionCount: 0,
      }),
    );
    assert.equal(r.primaryNext.href, "/app/lessons");
    assert.equal(r.primaryNext.kind, "lesson");
  });

  it("is deterministic for identical inputs", () => {
    const args = baseArgs({
      weakTopics: [
        row({ topic: "Zebra", normalizedTopic: "zebra", weakPriorityScore: 0.7 }),
        row({ topic: "Apple", normalizedTopic: "apple", weakPriorityScore: 0.71 }),
      ],
      recommendedQuizTopic: "Apple",
    });
    const x = buildAdaptiveRecommendations(args);
    const y = buildAdaptiveRecommendations(args);
    assert.equal(JSON.stringify(x.primaryNext), JSON.stringify(y.primaryNext));
    assert.equal(JSON.stringify(x.secondary), JSON.stringify(y.secondary));
  });
});
