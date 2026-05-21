import { HIGH_TRAFFIC_SLUG_HINTS } from "@/lib/content/lesson-image-audit/constants";
import type { LessonImagePriorityLevel } from "@/lib/content/lesson-image-audit/types";
import {
  scoreClinicalComplexity,
  scoreSeoTrafficImportance,
  scoreVisualNecessity,
  shouldLessonHaveImage,
  type VisualNecessityInput,
} from "@/lib/content/lesson-image-audit/visual-necessity";
import type { LessonImageAuditStatus } from "@/lib/content/lesson-image-audit/types";

function matchesHighTrafficCurriculum(input: VisualNecessityInput): boolean {
  const h = [input.slug, input.topicSlug, input.title, input.topic].join(" ").toLowerCase();
  return HIGH_TRAFFIC_SLUG_HINTS.some((hint) => h.includes(hint));
}

export type PriorityScoreBreakdown = {
  priorityScore: number;
  priorityLevel: LessonImagePriorityLevel;
  seoImportance: number;
  educationalValue: number;
  visualNecessity: number;
  trafficPotential: number;
  conversionPotential: number;
  clinicalComplexity: number;
  shouldHaveImage: boolean;
};

export function computePriorityScore(
  input: VisualNecessityInput,
  status: LessonImageAuditStatus,
): PriorityScoreBreakdown {
  const visualNecessity = scoreVisualNecessity(input);
  const seoImportance = scoreSeoTrafficImportance(input);
  const clinicalComplexity = scoreClinicalComplexity(input);
  const shouldHave = shouldLessonHaveImage(input);

  const educationalValue = Math.round(visualNecessity * 0.65 + clinicalComplexity * 0.35);
  const trafficPotential = Math.round(seoImportance * 0.85);
  const conversionPotential = shouldHave
    ? Math.min(100, Math.round(seoImportance * 0.4 + visualNecessity * 0.25))
    : 15;

  let priorityScore = Math.round(
    seoImportance * 0.22 +
      educationalValue * 0.22 +
      visualNecessity * 0.22 +
      trafficPotential * 0.16 +
      conversionPotential * 0.08 +
      clinicalComplexity * 0.1,
  );

  if (!shouldHave) {
    priorityScore = Math.min(priorityScore, 38);
  }

  if (status === "no_image" && shouldHave) {
    priorityScore = Math.min(100, priorityScore + 14);
  } else if (status === "low_quality_image") {
    priorityScore = Math.min(100, priorityScore + 10);
  } else if (status === "fuzzy_match") {
    priorityScore = Math.min(100, priorityScore + 6);
  } else if (status === "exact_match") {
    priorityScore = Math.max(0, priorityScore - 25);
  }

  if (shouldHave && matchesHighTrafficCurriculum(input)) {
    priorityScore = Math.min(100, priorityScore + 18);
  }
  if (
    shouldHave &&
    matchesHighTrafficCurriculum(input) &&
    (status === "no_image" || status === "low_quality_image" || status === "fuzzy_match")
  ) {
    priorityScore = Math.min(100, priorityScore + 12);
  }
  if (shouldHave && visualNecessity >= 72) {
    priorityScore = Math.min(100, priorityScore + 10);
  }

  const priorityLevel = priorityLevelFromScore(priorityScore, shouldHave);

  return {
    priorityScore,
    priorityLevel,
    seoImportance,
    educationalValue,
    visualNecessity,
    trafficPotential,
    conversionPotential,
    clinicalComplexity,
    shouldHaveImage: shouldHave,
  };
}

export function priorityLevelFromScore(
  score: number,
  shouldHaveImage: boolean,
): LessonImagePriorityLevel {
  if (!shouldHaveImage) {
    if (score >= 55) return "MEDIUM";
    return "LOW";
  }
  if (score >= 84) return "CRITICAL";
  if (score >= 70) return "HIGH";
  if (score >= 50) return "MEDIUM";
  return "LOW";
}
