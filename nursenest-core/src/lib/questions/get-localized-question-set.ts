/**
 * Server-side localized question set delivery.
 *
 * Filters and localizes a set of canonical ExamQuestion rows for a user's
 * region, locale, profession, and exam pathway. Integrates:
 *
 *   1. Market fit classification (exclude unsuitable questions)
 *   2. Overlay availability lookup (DB + file bundles)
 *   3. Variant selection (pick best content for user)
 *   4. Overlay application (merge localized display content)
 *
 * This module is the main entry point for country-aware question delivery.
 * It does NOT replace the existing entitlement/paywall system — it layers
 * on top. Call this AFTER the entitlement filter has narrowed the pool.
 */

import "server-only";

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  loadQuestionEducationalOverlayBundle,
  applyQuestionEducationalOverlayForDisplay,
  type QuestionEducationalOverlay,
} from "@/lib/i18n/educational-content-overlay";
import { evaluateQuestionMarketFit, type QuestionFitInput } from "./question-market-fit";
import { selectQuestionVariant, type OverlayAvailability, type VariantSelectionResult } from "./select-question-variant";
import { QUESTION_LOCALIZATION_PROFILES } from "./question-localization-config";

// ── Types ────────────────────────────────────────────────────────────────────

export type LocalizedQuestionSetParams = {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
};

export type QuestionRowForLocalization = {
  id: string;
  exam: string;
  tier: string;
  questionType: string;
  regionScope: string | null;
  countryCode: string | null;
  languageCode: string | null;
  labUnitVariant: string | null;
  medicationNamingVariant: string | null;
  tags: string[];
  topic: string | null;
  bodySystem: string | null;
  stem: string;
  rationale: string | null;
  careerType: string | null;
  difficulty: number | null;
  options?: unknown;
  correctAnswerExplanation?: string | null;
  clinicalReasoning?: string | null;
  keyTakeaway?: string | null;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  memoryHook?: string | null;
  clinicalTrap?: string | null;
  distractorRationales?: unknown;
  incorrectAnswerRationale?: unknown;
};

export type LocalizedQuestionResult = {
  /** Original question ID. */
  questionId: string;
  /** The localized display content (overlay-merged if applicable). */
  display: ReturnType<typeof applyQuestionEducationalOverlayForDisplay>;
  /** Variant selection metadata for analytics. */
  selection: VariantSelectionResult;
  /** Whether this question was included or excluded. */
  included: boolean;
};

export type LocalizedQuestionSetResult = {
  items: LocalizedQuestionResult[];
  stats: {
    total: number;
    included: number;
    excluded: number;
    localized: number;
    fallbackToEnglish: number;
    canonical: number;
  };
};

// ── Main entry point ─────────────────────────────────────────────────────────

/**
 * Filter and localize a set of questions for a specific market.
 *
 * @param questions - Pre-filtered by entitlement; this function adds market fit + localization.
 * @param params - User's locale, region, profession, and exam.
 * @param overlayBundleOverride - Optional pre-loaded overlay bundle (for batch efficiency).
 */
export function getLocalizedQuestionSet(
  questions: QuestionRowForLocalization[],
  params: LocalizedQuestionSetParams,
  overlayBundleOverride?: Record<string, QuestionEducationalOverlay>,
): LocalizedQuestionSetResult {
  const { locale, region, profession, exam } = params;
  const profile = QUESTION_LOCALIZATION_PROFILES[region];

  // Load overlay bundles for all relevant locales
  const overlayBundles = new Map<string, Record<string, QuestionEducationalOverlay>>();
  if (overlayBundleOverride) {
    overlayBundles.set(locale, overlayBundleOverride);
  } else {
    overlayBundles.set(locale, loadQuestionEducationalOverlayBundle(locale));
    if (locale !== "en") {
      overlayBundles.set("en", loadQuestionEducationalOverlayBundle("en"));
    }
  }

  const stats = {
    total: questions.length,
    included: 0,
    excluded: 0,
    localized: 0,
    fallbackToEnglish: 0,
    canonical: 0,
  };

  const items: LocalizedQuestionResult[] = [];

  for (const q of questions) {
    const fitInput: QuestionFitInput = {
      id: q.id,
      exam: q.exam,
      tier: q.tier,
      questionType: q.questionType,
      regionScope: q.regionScope,
      countryCode: q.countryCode,
      languageCode: q.languageCode,
      labUnitVariant: q.labUnitVariant,
      medicationNamingVariant: q.medicationNamingVariant,
      tags: q.tags,
      topic: q.topic,
      bodySystem: q.bodySystem,
      stem: q.stem,
      rationale: q.rationale,
      careerType: q.careerType,
      difficulty: q.difficulty,
    };

    // Step 1: Market fit classification
    const fit = evaluateQuestionMarketFit(fitInput, region, profession, exam);

    // Step 2: Build overlay availability from loaded bundles
    const overlayAvailability = buildOverlayAvailability(q.id, overlayBundles);

    // Step 3: Variant selection
    const sourceLang = q.languageCode ?? DEFAULT_MARKETING_LOCALE;
    const selection = selectQuestionVariant({
      questionId: q.id,
      marketFitLevel: fit.level,
      userLocale: locale,
      userRegion: region,
      availableOverlays: overlayAvailability,
      sourceMatchesUserLocale: sourceLang === locale,
    });

    // Step 4: Apply overlay or serve canonical
    if (selection.action === "exclude") {
      stats.excluded++;
      items.push({
        questionId: q.id,
        display: buildCanonicalDisplay(q),
        selection,
        included: false,
      });
      continue;
    }

    stats.included++;

    const displayLocale = selection.selectedLocale ?? DEFAULT_MARKETING_LOCALE;
    const bundle = overlayBundles.get(displayLocale) ?? {};
    const display = applyQuestionEducationalOverlayForDisplay(
      {
        id: q.id,
        stem: q.stem,
        options: q.options,
        rationale: q.rationale,
        correctAnswerExplanation: q.correctAnswerExplanation,
        clinicalReasoning: q.clinicalReasoning,
        keyTakeaway: q.keyTakeaway,
        clinicalPearl: q.clinicalPearl,
        examStrategy: q.examStrategy,
        memoryHook: q.memoryHook,
        clinicalTrap: q.clinicalTrap,
        distractorRationales: q.distractorRationales,
        incorrectAnswerRationale: q.incorrectAnswerRationale,
      },
      displayLocale,
      bundle,
    );

    if (selection.action === "serve_localized") stats.localized++;
    else if (selection.action === "serve_english_fallback") stats.fallbackToEnglish++;
    else stats.canonical++;

    items.push({ questionId: q.id, display, selection, included: true });
  }

  return { items, stats };
}

/**
 * Lightweight filter that only returns question IDs suitable for a market,
 * without applying overlays. Useful for pool selection before full localization.
 */
export function filterQuestionIdsForMarket(
  questions: QuestionFitInput[],
  region: GlobalRegionSlug,
  profession: string | null,
  exam: string | null,
): string[] {
  return questions
    .filter((q) => {
      const fit = evaluateQuestionMarketFit(q, region, profession, exam);
      return fit.level !== "excluded";
    })
    .map((q) => q.id);
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildOverlayAvailability(
  questionId: string,
  bundles: Map<string, Record<string, QuestionEducationalOverlay>>,
): OverlayAvailability[] {
  const result: OverlayAvailability[] = [];
  for (const [locale, bundle] of bundles) {
    const overlay = bundle[questionId];
    if (overlay) {
      const hasFullCoverage = Boolean(overlay.stem && overlay.options && overlay.rationale);
      result.push({
        locale: locale as GlobalLocaleCode,
        status: "published",
        hasFullCoverage,
      });
    }
  }
  return result;
}

function buildCanonicalDisplay(q: QuestionRowForLocalization) {
  return {
    stem: q.stem,
    options: q.options,
    rationale: q.rationale ?? null,
    correctAnswerExplanation: q.correctAnswerExplanation ?? null,
    clinicalReasoning: q.clinicalReasoning ?? null,
    keyTakeaway: q.keyTakeaway ?? null,
    clinicalPearl: q.clinicalPearl ?? null,
    examStrategy: q.examStrategy ?? null,
    memoryHook: q.memoryHook ?? null,
    clinicalTrap: q.clinicalTrap ?? null,
    distractorRationales: q.distractorRationales,
    incorrectAnswerRationale: q.incorrectAnswerRationale,
    overlayApplied: false,
  };
}
