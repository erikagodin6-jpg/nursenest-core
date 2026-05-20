import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildReviewSequence, toPublicWeakSummaries } from "@/lib/learner/personalized-weak-area-study-plan-surface";
import type { StudyNextRecommendation } from "@/lib/learner/study-next-types";
import type { WeakTopicRow } from "@/lib/learner/weak-topics-from-sessions";

function rec(partial: Pick<StudyNextRecommendation, "type" | "href" | "title">): StudyNextRecommendation {
  return {
    type: partial.type,
    href: partial.href,
    title: partial.title,
    reasonCode: "weak_topic_high_confidence",
    reasonShort: "Because performance signals point here.",
    confidence: "high",
  };
}

describe("toPublicWeakSummaries", () => {
  it("does not expose numeric weak scores", () => {
    const rows: WeakTopicRow[] = [
      {
        topic: "Fluid balance",
        missed: 6,
        attempted: 10,
        missRate: 60,
        wrongStreak: 2,
        weakPriorityScore: 0.91,
        strength: "weak",
      },
    ];
    const pub = toPublicWeakSummaries(rows, 4);
    assert.equal(pub.length, 1);
    assert.deepEqual(
      { label: pub[0]?.label, band: pub[0]?.band, coachLine: typeof pub[0]?.coachLine },
      { label: "Fluid balance", band: "priority_review", coachLine: "string" },
    );
    assert.equal("weakPriorityScore" in (pub[0] ?? {}), false);
  });

  it("uses miss rate and streak for needs_attention when not explicitly weak", () => {
    const rows: WeakTopicRow[] = [
      {
        topic: "Pharmacology",
        missed: 4,
        attempted: 10,
        missRate: 45,
        wrongStreak: 2,
        strength: "moderate",
      },
    ];
    const pub = toPublicWeakSummaries(rows);
    assert.equal(pub[0]?.band, "needs_attention");
  });
});

describe("buildReviewSequence", () => {
  it("orders fixed kinds and stops at five steps", () => {
    const recs: StudyNextRecommendation[] = [
      rec({ type: "retest_topic", href: "/z", title: "Adaptive" }),
      rec({ type: "missed_review_session", href: "/m", title: "Missed" }),
      rec({ type: "weak_topic_qbank", href: "/q", title: "Questions" }),
      rec({ type: "weak_topic_flashcards", href: "/f", title: "Flashcards" }),
      rec({ type: "weak_topic_lesson", href: "/l", title: "Lesson" }),
      rec({ type: "continue_pathway_lesson", href: "/c", title: "Continue" }),
    ];
    const steps = buildReviewSequence(recs);
    assert.deepEqual(steps.map((s) => s.kind), [
      "continue_lesson",
      "weak_lesson",
      "flashcards",
      "questions",
      "missed_practice",
    ]);
    assert.equal(steps.length, 5);
  });

  it("picks first match per kind regardless of input order", () => {
    const steps = buildReviewSequence([
      rec({ type: "weak_topic_qbank", href: "/q", title: "Q" }),
      rec({ type: "continue_pathway_lesson", href: "/c", title: "C" }),
    ]);
    assert.deepEqual(steps.map((s) => s.kind), ["continue_lesson", "questions"]);
  });
});
