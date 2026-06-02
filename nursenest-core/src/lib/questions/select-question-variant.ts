/**
 * Question variant selection.
 *
 * Given a canonical ExamQuestion, a user's locale/region, and available
 * overlay data, picks the best content variant to serve.
 *
 * Selection priority:
 *   1. Approved localized overlay in user's preferred language + region
 *   2. Approved English overlay adapted for the user's region
 *   3. Canonical English question (if market fit allows direct reuse)
 *   4. Exclude — question not suitable for this market
 *
 * This module is a pure decision engine — no DB access, no side effects.
 * The delivery layer calls this after loading overlay availability.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { QuestionMarketFitLevel } from "./question-market-fit";

// ── Types ────────────────────────────────────────────────────────────────────

export type OverlayAvailability = {
  locale: GlobalLocaleCode;
  /** Overlay approval status from EducationalTranslationOverlay or file-based bundle. */
  status: "draft" | "reviewed" | "published";
  /** Whether the overlay covers stem, options, and rationale. */
  hasFullCoverage: boolean;
};

export type VariantSelectionInput = {
  questionId: string;
  /** Market fit level from the fit engine. */
  marketFitLevel: QuestionMarketFitLevel;
  /** User's preferred locale. */
  userLocale: GlobalLocaleCode;
  /** User's region. */
  userRegion: GlobalRegionSlug;
  /** Available overlays for this question (from DB or file bundles). */
  availableOverlays: OverlayAvailability[];
  /** Whether the question's source language is the user's locale. */
  sourceMatchesUserLocale: boolean;
};

export type VariantSelectionResult = {
  action: "serve_localized" | "serve_canonical" | "serve_english_fallback" | "exclude";
  /** Locale to use for overlay lookup. Null means use canonical (no overlay). */
  selectedLocale: GlobalLocaleCode | null;
  /** Why this decision was made. */
  reason: string;
  /** Whether analytics should flag this as a fallback. */
  isFallback: boolean;
};

// ── Selection logic ──────────────────────────────────────────────────────────

export function selectQuestionVariant(input: VariantSelectionInput): VariantSelectionResult {
  const { questionId: _qid, marketFitLevel, userLocale, availableOverlays, sourceMatchesUserLocale } = input;

  // Hard exclusion from market fit
  if (marketFitLevel === "excluded") {
    return {
      action: "exclude",
      selectedLocale: null,
      reason: "Question excluded by market fit engine",
      isFallback: false,
    };
  }

  // If user's locale is English and the source is English, minimal overlay work needed
  if (userLocale === "en" && sourceMatchesUserLocale) {
    if (marketFitLevel === "direct_reuse" || marketFitLevel === "translated_only") {
      return {
        action: "serve_canonical",
        selectedLocale: null,
        reason: "English source matches English user — direct reuse",
        isFallback: false,
      };
    }
    // Terminology/context adapted but still English
    if (marketFitLevel === "terminology_adapted" || marketFitLevel === "context_adapted") {
      const enOverlay = findBestOverlay(availableOverlays, "en");
      if (enOverlay) {
        return {
          action: "serve_localized",
          selectedLocale: "en",
          reason: `English terminology overlay applied (${enOverlay.status})`,
          isFallback: false,
        };
      }
      // No approved EN overlay but still servable with notes
      return {
        action: "serve_canonical",
        selectedLocale: null,
        reason: "Terminology adaptation needed but no approved overlay — serving canonical with caveat",
        isFallback: true,
      };
    }
  }

  // Non-English locale: try exact locale match first
  if (userLocale !== "en") {
    const localizedOverlay = findBestOverlay(availableOverlays, userLocale);
    if (localizedOverlay) {
      return {
        action: "serve_localized",
        selectedLocale: userLocale,
        reason: `Approved ${userLocale} overlay available (${localizedOverlay.status})`,
        isFallback: false,
      };
    }
  }

  // Fallback to English if market fit allows
  if (marketFitLevel === "direct_reuse" || marketFitLevel === "translated_only") {
    const enOverlay = findBestOverlay(availableOverlays, "en");
    return {
      action: enOverlay ? "serve_localized" : "serve_english_fallback",
      selectedLocale: enOverlay ? "en" : null,
      reason: userLocale !== "en"
        ? `No approved ${userLocale} overlay — falling back to English`
        : "English canonical reuse",
      isFallback: userLocale !== "en",
    };
  }

  // For adapted questions without overlays, serve canonical English if safe
  if (marketFitLevel === "terminology_adapted" || marketFitLevel === "context_adapted") {
    return {
      action: "serve_english_fallback",
      selectedLocale: null,
      reason: `Adaptation needed but no overlays available — serving English fallback`,
      isFallback: true,
    };
  }

  // Region-specific variant needs a full variant; without one, exclude
  if (marketFitLevel === "region_specific_variant") {
    const regionOverlay = findBestOverlay(availableOverlays, userLocale) ?? findBestOverlay(availableOverlays, "en");
    if (regionOverlay) {
      return {
        action: "serve_localized",
        selectedLocale: regionOverlay.locale,
        reason: "Region-specific variant with overlay",
        isFallback: regionOverlay.locale !== userLocale,
      };
    }
    return {
      action: "exclude",
      selectedLocale: null,
      reason: "Region-specific variant required but no approved overlay exists",
      isFallback: false,
    };
  }

  return {
    action: "serve_canonical",
    selectedLocale: null,
    reason: "Default fallback — serving canonical",
    isFallback: true,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function findBestOverlay(
  overlays: OverlayAvailability[],
  locale: GlobalLocaleCode,
): OverlayAvailability | null {
  const forLocale = overlays.filter((o) => o.locale === locale);
  if (forLocale.length === 0) return null;

  // Prefer published > reviewed > draft
  const published = forLocale.find((o) => o.status === "published" && o.hasFullCoverage);
  if (published) return published;

  const reviewed = forLocale.find((o) => o.status === "reviewed" && o.hasFullCoverage);
  if (reviewed) return reviewed;

  // Partial coverage is acceptable if published
  const partialPublished = forLocale.find((o) => o.status === "published");
  if (partialPublished) return partialPublished;

  return null;
}

/**
 * Batch variant selection for a set of questions.
 * Returns a map of questionId → selection result.
 */
export function selectVariantsForQuestionSet(
  inputs: VariantSelectionInput[],
): Map<string, VariantSelectionResult> {
  const results = new Map<string, VariantSelectionResult>();
  for (const input of inputs) {
    results.set(input.questionId, selectQuestionVariant(input));
  }
  return results;
}
