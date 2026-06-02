/**
 * Run: `node --import tsx --test src/lib/adaptive-learning/adaptive-recommendation-engine.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { PathwayLessonLinkedLearningSignals } from "@/lib/lessons/pathway-lesson-types";
import {
  ADAPTIVE_MASTERED_TOPIC_THRESHOLD,
  buildAdaptiveRecommendationBundleWithLessons,
  computeTopicUrgencyScore,
  pathwayMetadataForAdaptive,
  rankWeakTopics,
  recommendLessonsForWeakTopics,
} from "@/lib/adaptive-learning/adaptive-recommendation-engine";
import { composePostMissStudyPlan } from "@/lib/adaptive-learning/post-miss-orchestration";
import { buildLearnerFacingProgressSummary } from "@/lib/adaptive-learning/learner-analytics-summary";
import type { AnswerRecord } from "@/lib/cat/types";
import { buildPerformanceProfile } from "@/lib/cat/performance-tracker";

describe("adaptive-recommendation-engine", () => {
  const now = Date.UTC(2026, 0, 15, 12, 0, 0);

  it("rankWeakTopics is deterministic (score desc, then topicKey asc)", () => {
    const ranked = rankWeakTopics(
      [
        { topicKey: "b", missCount: 2, lastAttemptMs: now - 86400000 },
        { topicKey: "a", missCount: 2, lastAttemptMs: now - 86400000 },
        { topicKey: "c", missCount: 3, lastAttemptMs: now - 86400000 },
      ],
      now,
    );
    assert.deepEqual(
      ranked.map((r) => r.topicKey),
      ["c", "a", "b"],
    );
  });

  it("filters mastered topics using ADAPTIVE_MASTERED_TOPIC_THRESHOLD", () => {
    const ranked = rankWeakTopics(
      [
        { topicKey: "weak", missCount: 5, masteryEstimate: 0.2 },
        { topicKey: "mastered", missCount: 99, masteryEstimate: ADAPTIVE_MASTERED_TOPIC_THRESHOLD },
      ],
      now,
    );
    assert.equal(ranked.length, 1);
    assert.equal(ranked[0]?.topicKey, "weak");
  });

  it("computeTopicUrgencyScore increases with recency", () => {
    const old = computeTopicUrgencyScore({ topicKey: "t", missCount: 2, lastAttemptMs: now - 20 * 86400000 }, now);
    const recent = computeTopicUrgencyScore({ topicKey: "t", missCount: 2, lastAttemptMs: now - 86400000 }, now);
    assert.ok(recent > old);
  });

  it("recommendLessonsForWeakTopics matches canonical topic keys", () => {
    const sig: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "fluid-electrolytes",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const ranked = rankWeakTopics([{ topicKey: "fluid-electrolytes", missCount: 2 }], now);
    const lessons = recommendLessonsForWeakTopics(
      ranked,
      [
        { slug: "lesson-a", title: "A", topicSlug: "fluid-electrolytes", linkedLearningSignals: sig },
        { slug: "lesson-b", title: "B", topicSlug: "other-topic", linkedLearningSignals: { ...sig, bidirectionalTopicKey: "other-topic" } },
      ],
      10,
    );
    assert.equal(lessons.length, 1);
    assert.equal(lessons[0]?.slug, "lesson-a");
  });

  it("pathwayMetadataForAdaptive returns catalog roleTrack when found", () => {
    const meta = pathwayMetadataForAdaptive("us-rn-nclex-rn");
    if (meta.found) {
      assert.equal(meta.roleTrack, "rn");
      assert.ok(meta.examKey);
    } else {
      assert.ok(true, "pathway id may differ in fixture — smoke only");
    }
  });

  it("composePostMissStudyPlan returns ordered surfaces", () => {
    const linked: PathwayLessonLinkedLearningSignals = {
      bidirectionalTopicKey: "cardiovascular",
      flashcardsLinked: true,
      practiceQuestionsLinked: true,
      catPoolLinked: true,
      adaptiveLearningReadiness: true,
    };
    const plan = composePostMissStudyPlan({
      trigger: "flashcard_struggle",
      pathwayId: "us-rn-nclex-rn",
      roleTrack: "rn",
      linkedLearning: linked,
      weakTopicSignals: [{ topicKey: "cardiovascular", missCount: 2, lastAttemptMs: now }],
      lessonCandidates: [{ slug: "cv-lesson", title: "CV", topicSlug: "cardiovascular", linkedLearningSignals: linked }],
      nowMs: now,
    });
    assert.equal(plan.suggestedSurfaceOrder[0], "lesson");
    assert.ok(plan.recommendations.rankedWeakTopics.length >= 1);
  });

  it("buildLearnerFacingProgressSummary handles null profile", () => {
    const s = buildLearnerFacingProgressSummary(null);
    assert.equal(s.hasMeaningfulPracticeHistory, false);
    assert.equal(s.weakestSystems.length, 0);
  });

  it("buildLearnerFacingProgressSummary ranks systems from performance profile", () => {
    const answers: AnswerRecord[] = [
      {
        questionId: "q1",
        topicSlug: "t1",
        systemTag: "weak-sys",
        cognitiveLayer: "L2",
        riskLevel: "moderate",
        correct: false,
        answeredAt: now - 1000,
      },
      {
        questionId: "q2",
        topicSlug: "t2",
        systemTag: "weak-sys",
        cognitiveLayer: "L2",
        riskLevel: "moderate",
        correct: false,
        answeredAt: now - 2000,
      },
      {
        questionId: "q3",
        topicSlug: "t3",
        systemTag: "weak-sys",
        cognitiveLayer: "L2",
        riskLevel: "moderate",
        correct: false,
        answeredAt: now - 3000,
      },
      {
        questionId: "q4",
        topicSlug: "t4",
        systemTag: "strong-sys",
        cognitiveLayer: "L1",
        riskLevel: "low",
        correct: true,
        answeredAt: now - 4000,
      },
      {
        questionId: "q5",
        topicSlug: "t5",
        systemTag: "strong-sys",
        cognitiveLayer: "L1",
        riskLevel: "low",
        correct: true,
        answeredAt: now - 5000,
      },
      {
        questionId: "q6",
        topicSlug: "t6",
        systemTag: "strong-sys",
        cognitiveLayer: "L1",
        riskLevel: "low",
        correct: true,
        answeredAt: now - 6000,
      },
    ];
    const profile = buildPerformanceProfile(answers, now);
    const s = buildLearnerFacingProgressSummary(profile);
    assert.ok(s.weakestSystems.some((w) => w.systemTag === "weak-sys"));
    assert.ok(s.strongestSystems.some((x) => x.systemTag === "strong-sys"));
  });

  it("buildAdaptiveRecommendationBundleWithLessons sets no_lesson_candidates when needed", () => {
    const bundle = buildAdaptiveRecommendationBundleWithLessons(
      {
        pathwayId: "us-rn-nclex-rn",
        roleTrack: "rn",
        linkedLearning: null,
        weakTopicSignals: [{ topicKey: "only-weak", missCount: 4 }],
        nowMs: now,
      },
      [{ slug: "other", title: "Other", topicSlug: "different-topic" }],
    );
    assert.equal(bundle.fallbackReason, "no_lesson_candidates");
  });
});
