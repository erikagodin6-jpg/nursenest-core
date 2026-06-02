/**
 * Normalizes external / persisted enum-like strings to known-safe values (presentation & routing only).
 */
import type { CatExamFeedbackMode } from "@/lib/practice-tests/types";
import type { CatPresentationMode } from "@/lib/exams/cat-types";
import type { MarketingRegionToggle } from "@/lib/marketing/marketing-entry-routes";

export const DEFAULT_CAT_EXAM_FEEDBACK_MODE: CatExamFeedbackMode = "test";
export const DEFAULT_CAT_PRESENTATION_MODE: CatPresentationMode = "practice";

export function normalizeCatExamFeedbackMode(raw: unknown): CatExamFeedbackMode {
  return raw === "study" || raw === "test" ? raw : DEFAULT_CAT_EXAM_FEEDBACK_MODE;
}

export function normalizeCatPresentationMode(raw: unknown): CatPresentationMode {
  return raw === "exam_simulation" || raw === "practice" ? raw : DEFAULT_CAT_PRESENTATION_MODE;
}

export function normalizeMarketingRegionToggle(raw: unknown): MarketingRegionToggle {
  return raw === "CA" ? "CA" : "US";
}
