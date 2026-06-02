import type { AdaptiveAttemptSignal } from "@/lib/adaptive-learning/clinical-adaptive-engine";

export type StudyAnxietyPattern =
  | "rapid_guessing"
  | "confidence_collapse"
  | "fatigue_decline"
  | "repeated_second_guessing"
  | "pressure_performance_drop";

export type AdaptiveAntiAnxietySupportPlan = {
  active: boolean;
  intensity: "none" | "gentle" | "moderate" | "strong";
  patterns: readonly StudyAnxietyPattern[];
  overloadReduction: "none" | "slight" | "moderate" | "high";
  recommendedSessionLength: number;
  difficultyAdjustment: -2 | -1 | 0;
  pacingStrategy: string;
  confidenceReinforcement: string;
  challengeBalance: "stabilize_with_wins" | "balanced" | "resume_challenge";
};

function confidenceScore(confidence: AdaptiveAttemptSignal["confidence"]): number {
  switch (confidence) {
    case "very_confident":
      return 1;
    case "somewhat_confident":
      return 0.7;
    case "unsure":
      return 0.35;
    case "guessing":
      return 0.05;
  }
}

function average(values: readonly number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function splitRecent(attempts: readonly AdaptiveAttemptSignal[]): {
  firstHalf: readonly AdaptiveAttemptSignal[];
  secondHalf: readonly AdaptiveAttemptSignal[];
} {
  const midpoint = Math.max(1, Math.floor(attempts.length / 2));
  return { firstHalf: attempts.slice(0, midpoint), secondHalf: attempts.slice(midpoint) };
}

function accuracy(attempts: readonly AdaptiveAttemptSignal[]): number {
  if (attempts.length === 0) return 0;
  return attempts.filter((attempt) => attempt.correct).length / attempts.length;
}

export function detectAdaptiveAntiAnxietySupport(
  attempts: readonly AdaptiveAttemptSignal[],
): AdaptiveAntiAnxietySupportPlan {
  const recent = attempts.slice(-12);
  const patterns = new Set<StudyAnxietyPattern>();
  if (recent.length < 3) {
    return {
      active: false,
      intensity: "none",
      patterns: [],
      overloadReduction: "none",
      recommendedSessionLength: 12,
      difficultyAdjustment: 0,
      pacingStrategy: "Keep the current pace and gather a few more attempts before changing load.",
      confidenceReinforcement: "Confidence calibration will become more accurate after a few more answered items.",
      challengeBalance: "balanced",
    };
  }

  const rapidGuessing = recent.filter(
    (attempt) => attempt.confidence === "guessing" && attempt.timeToAnswerMs > 0 && attempt.timeToAnswerMs <= 18000,
  ).length;
  if (rapidGuessing >= Math.max(2, Math.ceil(recent.length * 0.25))) patterns.add("rapid_guessing");

  const { firstHalf, secondHalf } = splitRecent(recent);
  const firstConfidence = average(firstHalf.map((attempt) => confidenceScore(attempt.confidence)));
  const secondConfidence = average(secondHalf.map((attempt) => confidenceScore(attempt.confidence)));
  if (firstConfidence - secondConfidence >= 0.28 && secondConfidence < 0.45) patterns.add("confidence_collapse");

  const firstAccuracy = accuracy(firstHalf);
  const secondAccuracy = accuracy(secondHalf);
  const lateHints = secondHalf.filter((attempt) => attempt.hintsUsed >= 2).length;
  if (firstAccuracy - secondAccuracy >= 0.25 && (secondAccuracy < 0.55 || lateHints >= 2)) {
    patterns.add("fatigue_decline");
  }

  const secondGuessing = recent.filter((attempt) => attempt.answerChanges >= 2).length;
  if (secondGuessing >= Math.max(2, Math.ceil(recent.length * 0.25))) patterns.add("repeated_second_guessing");

  const pressureDrops = recent.filter(
    (attempt) =>
      !attempt.correct &&
      (attempt.timeToAnswerMs >= 90000 || attempt.answerChanges >= 2 || attempt.confidence === "very_confident"),
  ).length;
  if (pressureDrops >= Math.max(2, Math.ceil(recent.length * 0.25))) patterns.add("pressure_performance_drop");

  const count = patterns.size;
  const intensity: AdaptiveAntiAnxietySupportPlan["intensity"] =
    count >= 4 ? "strong" : count >= 2 ? "moderate" : count === 1 ? "gentle" : "none";
  const overloadReduction: AdaptiveAntiAnxietySupportPlan["overloadReduction"] =
    intensity === "strong" ? "high" : intensity === "moderate" ? "moderate" : intensity === "gentle" ? "slight" : "none";
  const difficultyAdjustment: AdaptiveAntiAnxietySupportPlan["difficultyAdjustment"] =
    intensity === "strong" ? -2 : intensity === "moderate" ? -1 : 0;
  const recommendedSessionLength =
    intensity === "strong" ? 5 : intensity === "moderate" ? 8 : intensity === "gentle" ? 10 : 15;
  const challengeBalance: AdaptiveAntiAnxietySupportPlan["challengeBalance"] =
    intensity === "strong" || intensity === "moderate" ? "stabilize_with_wins" : "balanced";

  return {
    active: count > 0,
    intensity,
    patterns: [...patterns],
    overloadReduction,
    recommendedSessionLength,
    difficultyAdjustment,
    pacingStrategy:
      intensity === "strong"
        ? "Switch to a short reset set: fewer questions, one concept family, and no time pressure until accuracy stabilizes."
        : intensity === "moderate"
          ? "Use a shorter mixed set with deliberate pauses after each rationale to prevent rushing and second-guessing."
          : intensity === "gentle"
            ? "Keep going, but slow the first read and commit to one reason before changing an answer."
            : "Maintain the current pacing.",
    confidenceReinforcement:
      intensity === "strong"
        ? "Start with winnable safety questions so the learner can feel capable before returning to harder items."
        : intensity === "moderate"
          ? "Balance one challenge item with two confidence-building review items from nearby topics."
          : intensity === "gentle"
            ? "Reinforce correct low-confidence answers as evidence that reasoning is improving."
            : "Continue normal confidence calibration.",
    challengeBalance,
  };
}
