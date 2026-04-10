import assert from "node:assert";
import { describe, it } from "node:test";
import type { LearnerStudySnapshot } from "@/lib/learner/build-learner-study-snapshot";
import { recommendNextActions } from "@/lib/learner/recommend-next-actions";

function baseSnapshot(over: Partial<LearnerStudySnapshot>): LearnerStudySnapshot {
  return {
    weakTopics: [],
    topicPerformanceSource: "ledger",
    topicTrends: [],
    strongTopicsHighlight: [],
    recommendedFocusTopic: null,
    topWeak: null,
    pathwayNext: null,
    weakTopicPathwayLesson: null,
    hasWeakTopicFlashcards: false,
    weakTopicCodes: [],
    ...over,
  };
}

describe("recommendNextActions", () => {
  it("prefers continue pathway when engaged", () => {
    const snap = baseSnapshot({
      pathwayNext: {
        title: "Sepsis",
        href: "/app/lessons/l1",
        pathwayId: "p1",
        slug: "sepsis",
        engagedInPathway: true,
        stalled: false,
      },
      topWeak: {
        topic: "Cardiac",
        missed: 3,
        attempted: 10,
        missRate: 30,
        normalizedTopic: "cardiac",
        recommendationConfidence: "high",
      },
      weakTopicPathwayLesson: { title: "CVS", href: "/app/lessons/l2", pathwayId: "p1" },
    });
    const r = recommendNextActions(snap, { maxTotal: 3 });
    assert.equal(r[0]?.type, "continue_pathway_lesson");
    assert.equal(r[0]?.href, "/app/lessons/l1");
  });

  it("uses weak lesson when not mid-pathway but pathway lesson matches weak topic", () => {
    const snap = baseSnapshot({
      pathwayNext: {
        title: "First",
        href: "/app/lessons/a",
        pathwayId: "p1",
        slug: "first",
        engagedInPathway: false,
        stalled: false,
      },
      topWeak: {
        topic: "Cardiac",
        missed: 2,
        attempted: 5,
        missRate: 40,
        normalizedTopic: "cardiac",
      },
      weakTopicPathwayLesson: { title: "CVS lesson", href: "/app/lessons/b", pathwayId: "p1" },
    });
    const r = recommendNextActions(snap);
    assert.equal(r[0]?.type, "weak_topic_lesson");
    assert.equal(r[0]?.href, "/app/lessons/b");
  });

  it("falls back to practice weak pool then question bank weak mode when no weak topic", () => {
    const snap = baseSnapshot({});
    const r = recommendNextActions(snap, { maxTotal: 2 });
    assert.equal(r[0]?.type, "retest_topic");
    assert.equal(r[0]?.href.includes("cat=1"), true);
    assert.equal(r[0]?.href.includes("focus=weak"), true);
    assert.equal(r[1]?.type, "weak_topic_qbank");
    assert.equal(r[1]?.href.includes("studyMode=weak"), true);
  });

  it("is deterministic for identical snapshot", () => {
    const snap = baseSnapshot({
      topWeak: {
        topic: "Neuro",
        missed: 1,
        attempted: 4,
        missRate: 25,
        normalizedTopic: "neuro",
      },
      hasWeakTopicFlashcards: true,
    });
    const a = recommendNextActions(snap).map((x) => x.href).join("|");
    const b = recommendNextActions(snap).map((x) => x.href).join("|");
    assert.equal(a, b);
  });
});
