/**
 * Thin orchestration: compose linked-learning context with deterministic recommendations
 * after CAT miss, practice miss, or flashcard struggle. Server-only helper — no routes
 * in this phase unless a product surface explicitly imports it behind entitlements.
 */
import { buildAdaptiveRecommendationBundleWithLessons } from "@/lib/adaptive-learning/adaptive-recommendation-engine";
import type {
  AdaptiveStudySurface,
  PostMissOrchestrationInput,
  PostMissOrchestrationResult,
} from "@/lib/adaptive-learning/adaptive-learning-types";

function surfaceOrderForTrigger(trigger: PostMissOrchestrationInput["trigger"]): AdaptiveStudySurface[] {
  switch (trigger) {
    case "cat_miss":
      return ["lesson", "flashcards", "question_bank", "cat_practice"];
    case "practice_miss":
      return ["lesson", "flashcards", "question_bank", "cat_practice"];
    case "flashcard_struggle":
      return ["lesson", "question_bank", "flashcards", "cat_practice"];
    default:
      return ["lesson", "flashcards", "question_bank", "cat_practice"];
  }
}

/**
 * Pure composition — does **not** verify JWT or entitlements. Callers must gate UI.
 */
export function composePostMissStudyPlan(input: PostMissOrchestrationInput): PostMissOrchestrationResult {
  const { trigger, pathwayId, roleTrack, linkedLearning, weakTopicSignals, lessonCandidates, nowMs } = input;

  const recommendations = buildAdaptiveRecommendationBundleWithLessons(
    {
      pathwayId,
      roleTrack,
      linkedLearning,
      weakTopicSignals,
      nowMs,
    },
    lessonCandidates,
  );

  return {
    trigger,
    recommendations,
    suggestedSurfaceOrder: surfaceOrderForTrigger(trigger),
  };
}
