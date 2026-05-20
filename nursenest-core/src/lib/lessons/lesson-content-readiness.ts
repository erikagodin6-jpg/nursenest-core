/**
 * Lesson content readiness gateway.
 *
 * Determines whether lesson content is rich enough to be recommended as
 * a primary study resource after a CAT exam. Designed to be scalable:
 * as lessons are expanded, the signal automatically shifts recommendations
 * toward them.
 *
 * Thresholds intentionally higher than `LESSON_STRONG_MIN_WORDS` (700) because
 * the audit shows that even "acceptable" lessons (~300 words) lack the depth
 * expected by users paying for a premium product.
 */

import { pathwayLessonWordCount } from "@/lib/content-quality/classify-lesson";
import type { PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

/** Minimum word count for a lesson to be recommended as a complete resource. */
export const RECOMMENDATION_COMPLETE_MIN_WORDS = 900;

/** Minimum word count for a lesson to be surfaced as a partial/preview resource. */
export const RECOMMENDATION_PARTIAL_MIN_WORDS = 200;

export type LessonReadinessStatus = "complete" | "partial" | "empty";

/**
 * Classify a single lesson's readiness for recommendation based on body word
 * count and structural signals.
 */
export function classifyLessonReadiness(opts: {
  wordCount: number;
  sectionCount: number;
  hasQuestions: boolean;
}): LessonReadinessStatus {
  const { wordCount, sectionCount } = opts;
  if (wordCount < RECOMMENDATION_PARTIAL_MIN_WORDS || sectionCount === 0) return "empty";
  if (wordCount >= RECOMMENDATION_COMPLETE_MIN_WORDS && sectionCount >= 4) return "complete";
  return "partial";
}

export type LessonContentSignal = {
  /** True when enough lessons have substantial content to be a primary resource. */
  lessonPrimaryReady: boolean;
  /** True when at least some lessons have partial content (browseable but shallow). */
  lessonPartialAvailable: boolean;
  /** Recommended primary study resource ordering for this pathway. */
  primaryStudyResource: "questions" | "lessons" | "mixed";
  completeCount: number;
  partialCount: number;
  emptyCount: number;
  totalChecked: number;
};

/**
 * Determine the overall content readiness signal from a collection of lesson rows.
 * Intended for server-side use only (after DB query).
 */
export function computeLessonContentSignal(
  rows: Array<{ sections: unknown }>,
): LessonContentSignal {
  let completeCount = 0;
  let partialCount = 0;
  let emptyCount = 0;

  for (const row of rows) {
    const sections = Array.isArray(row.sections)
      ? (row.sections as PathwayLessonSection[])
      : [];
    const wordCount = pathwayLessonWordCount({ sections });
    const status = classifyLessonReadiness({
      wordCount,
      sectionCount: sections.length,
      hasQuestions: false, // not checking questions here for performance
    });
    if (status === "complete") completeCount++;
    else if (status === "partial") partialCount++;
    else emptyCount++;
  }

  const totalChecked = completeCount + partialCount + emptyCount;
  const completeFraction = totalChecked > 0 ? completeCount / totalChecked : 0;

  // Primary ready when ≥10% of lessons are complete (reasonable completeness density)
  const lessonPrimaryReady = completeFraction >= 0.1 && completeCount >= 5;
  const lessonPartialAvailable = partialCount + completeCount > 0;

  let primaryStudyResource: LessonContentSignal["primaryStudyResource"];
  if (lessonPrimaryReady) {
    primaryStudyResource = completeFraction >= 0.4 ? "lessons" : "mixed";
  } else {
    primaryStudyResource = "questions";
  }

  return {
    lessonPrimaryReady,
    lessonPartialAvailable,
    primaryStudyResource,
    completeCount,
    partialCount,
    emptyCount,
    totalChecked,
  };
}

/** Derive a readiness tier label from the CAT score and decision. */
export function deriveReadinessTier(
  readinessScore: number,
  decision: string,
): "at_risk" | "borderline" | "likely_pass" | "unknown" {
  if (decision === "pass" || readinessScore >= 65) return "likely_pass";
  if (decision === "fail" || readinessScore < 45) return "at_risk";
  if (decision === "uncertain" || (readinessScore >= 45 && readinessScore < 65)) return "borderline";
  return "unknown";
}

/** Human-readable label for a readiness tier. */
export function readinessTierLabel(tier: "at_risk" | "borderline" | "likely_pass" | "unknown"): string {
  switch (tier) {
    case "at_risk": return "At Risk";
    case "borderline": return "Borderline";
    case "likely_pass": return "Likely Pass";
    default: return "Assessing";
  }
}
