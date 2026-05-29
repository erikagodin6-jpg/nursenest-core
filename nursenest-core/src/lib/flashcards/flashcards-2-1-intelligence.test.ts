import assert from "node:assert/strict";
import test from "node:test";

import {
  buildLearningInsights,
  buildRecommendedNextSteps,
  calculateConfidenceAccuracyGap,
  calculateLearnerReadinessIndex,
  detectWeakTopicWindows,
  summarizeStudyStreak,
  type FlashcardLearningSignal,
} from "@/lib/flashcards/learning-insight-engine";
import { buildRelatedLearningPlan } from "@/lib/flashcards/related-learning-engine";
import { buildFlashcardQualityReviewQueue, evaluateFlashcardQuality } from "@/lib/flashcards/question-quality-engine";

const signals: FlashcardLearningSignal[] = [
  { cardId: "h1", topic: "Hematology", isCorrect: false, confidence: 4, rating: "again" },
  { cardId: "h2", topic: "Hematology", isCorrect: false, confidence: 5, rating: "hard" },
  { cardId: "h3", topic: "Hematology", isCorrect: true, confidence: 2, rating: "good" },
  { cardId: "h4", topic: "Hematology", isCorrect: false, confidence: 3, rating: "again" },
  { cardId: "c1", topic: "Cardiovascular", isCorrect: true, confidence: 4, rating: "easy" },
  { cardId: "c2", topic: "Cardiovascular", isCorrect: true, confidence: 5, rating: "easy" },
  { cardId: "c3", topic: "Cardiovascular", isCorrect: true, confidence: 4, rating: "good" },
];

test("detectWeakTopicWindows flags recent low-accuracy topics", () => {
  const weak = detectWeakTopicWindows(signals);
  assert.equal(weak[0]?.topic, "Hematology");
  assert.equal(weak[0]?.attempts, 4);
  assert.ok((weak[0]?.accuracy ?? 1) < 0.6);
});

test("buildLearningInsights reports strengths and coaching without shame language", () => {
  const insights = buildLearningInsights(signals);
  assert.ok(insights.some((row) => row.topic === "Cardiovascular" && row.tone === "strength"));
  assert.ok(insights.some((row) => row.topic === "Hematology" && row.tone === "coach"));
  assert.equal(insights.some((row) => /fail|failed|bad/i.test(row.message)), false);
});

test("summarizeStudyStreak produces professional reviewed/mastery counts", () => {
  const summary = summarizeStudyStreak(signals);
  assert.equal(summary.reviewed, 7);
  assert.equal(summary.mastered, 3);
  assert.equal(summary.improving, 1);
  assert.equal(summary.needsReview, 3);
});

test("calculateConfidenceAccuracyGap detects confident-but-wrong patterns", () => {
  const gap = calculateConfidenceAccuracyGap(signals);
  assert.equal(gap.overconfidentWrong, 2);
  assert.ok(gap.message?.includes("Confidence"));
});

test("calculateLearnerReadinessIndex stays educational and bounded", () => {
  const readiness = calculateLearnerReadinessIndex(signals);
  assert.ok(readiness.score >= 0 && readiness.score <= 100);
  assert.match(readiness.level, /Needs Support|Developing|Exam Ready|Strongly Exam Ready/);
  assert.equal(readiness.drivers.some((driver) => /pass|license/i.test(driver)), false);
});

test("buildRecommendedNextSteps returns topic-specific remediation", () => {
  const steps = buildRecommendedNextSteps(signals);
  assert.ok(steps[0]?.includes("Hematology"));
});

test("buildRelatedLearningPlan exposes only concrete links", () => {
  const plan = buildRelatedLearningPlan({
    cardId: "cardio-1",
    topic: "Cardiac pharmacology",
    subtopic: "Beta blockers",
    pathwayId: "ca-rn-nclex-rn",
    lessonHref: "/app/lessons/cardiac-pharm",
    lessonTitle: "Cardiac Pharmacology",
    practiceTestsTopicHref: "/canada/rn/nclex-rn/practice-tests?topic=cardiac-pharm",
    isIncorrect: true,
  });
  assert.equal(plan.primary?.type, "lesson");
  assert.ok(plan.all.some((link) => link.type === "pharmacology"));
  assert.equal(plan.all.every((link) => link.href.length > 0), true);
});

test("evaluateFlashcardQuality flags generic rationales and missing distractor depth", () => {
  const review = evaluateFlashcardQuality({
    id: "weak-1",
    correctRationale: "This responds to the priority cue.",
    distractorRationales: [{ letter: "B", rationale: "Not the best answer." }],
    correctRate: 0.12,
  });
  assert.equal(review.severity, "critical");
  assert.ok(review.flags.includes("generic_correct_rationale"));
  assert.ok(review.flags.includes("possible_broken_key"));
});

test("buildFlashcardQualityReviewQueue sorts most urgent cards first", () => {
  const queue = buildFlashcardQualityReviewQueue([
    { id: "ok", correctRationale: "Hemoglobin of 7 g/dL is below expected adult ranges and indicates significant anemia requiring symptom assessment and provider notification.", distractorRationales: [{ letter: "B", rationale: "A hemoglobin of 14 g/dL is generally within the expected adult range and does not indicate anemia." }] },
    { id: "bad", correctRationale: "Rationale unavailable.", distractorRationales: [] },
  ]);
  assert.equal(queue[0]?.id, "bad");
});
