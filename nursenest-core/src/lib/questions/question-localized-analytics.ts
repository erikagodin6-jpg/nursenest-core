/**
 * Analytics event types for localized question delivery.
 *
 * These events track the question localization pipeline:
 *   - variant selection decisions
 *   - fallback behavior
 *   - market fit rejections
 *   - readiness changes
 *
 * Consumed by the analytics layer (PostHog, internal dashboards).
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { QuestionMarketFitLevel } from "./question-market-fit";
import type { MarketReadinessLevel } from "./question-market-readiness";

// ── Event names ──────────────────────────────────────────────────────────────

export type QuestionLocalizationEventName =
  | "question_variant_selected"
  | "localized_question_served"
  | "localized_question_fallback_to_english"
  | "question_market_fit_rejected"
  | "question_overlay_applied"
  | "question_overlay_missing"
  | "market_readiness_changed"
  | "localized_question_set_delivered"
  | "question_review_flag_triggered";

// ── Event payload ────────────────────────────────────────────────────────────

export type QuestionLocalizationEventPayload = {
  event: QuestionLocalizationEventName;
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
  canonicalQuestionId?: string;
  variantLocale?: GlobalLocaleCode | null;
  adaptationType?: QuestionMarketFitLevel;
  marketReadiness?: MarketReadinessLevel;
  translationStatus?: string;
  isFallback?: boolean;
  /** For set-level events: total, included, excluded counts. */
  setTotal?: number;
  setIncluded?: number;
  setExcluded?: number;
  setLocalized?: number;
  setFallbackCount?: number;
};

// ── Builders ─────────────────────────────────────────────────────────────────

export function buildVariantSelectedEvent(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
  canonicalQuestionId: string;
  variantLocale: GlobalLocaleCode | null;
  adaptationType: QuestionMarketFitLevel;
  isFallback: boolean;
}): QuestionLocalizationEventPayload {
  return {
    event: "question_variant_selected",
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    canonicalQuestionId: params.canonicalQuestionId,
    variantLocale: params.variantLocale,
    adaptationType: params.adaptationType,
    isFallback: params.isFallback,
  };
}

export function buildFallbackToEnglishEvent(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
  canonicalQuestionId: string;
}): QuestionLocalizationEventPayload {
  return {
    event: "localized_question_fallback_to_english",
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    canonicalQuestionId: params.canonicalQuestionId,
    isFallback: true,
  };
}

export function buildMarketFitRejectedEvent(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
  canonicalQuestionId: string;
  adaptationType: QuestionMarketFitLevel;
}): QuestionLocalizationEventPayload {
  return {
    event: "question_market_fit_rejected",
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    canonicalQuestionId: params.canonicalQuestionId,
    adaptationType: params.adaptationType,
  };
}

export function buildSetDeliveredEvent(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  profession: string | null;
  exam: string | null;
  total: number;
  included: number;
  excluded: number;
  localized: number;
  fallbackCount: number;
}): QuestionLocalizationEventPayload {
  return {
    event: "localized_question_set_delivered",
    locale: params.locale,
    region: params.region,
    profession: params.profession,
    exam: params.exam,
    setTotal: params.total,
    setIncluded: params.included,
    setExcluded: params.excluded,
    setLocalized: params.localized,
    setFallbackCount: params.fallbackCount,
  };
}

export function buildMarketReadinessChangedEvent(params: {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  previousLevel: MarketReadinessLevel;
  newLevel: MarketReadinessLevel;
}): QuestionLocalizationEventPayload {
  return {
    event: "market_readiness_changed",
    locale: params.locale,
    region: params.region,
    profession: null,
    exam: null,
    marketReadiness: params.newLevel,
  };
}

export function buildReviewFlagTriggeredEvent(params: {
  locale: GlobalLocaleCode;
  region: GlobalRegionSlug;
  canonicalQuestionId: string;
  flagCategory: string;
}): QuestionLocalizationEventPayload {
  return {
    event: "question_review_flag_triggered",
    locale: params.locale,
    region: params.region,
    profession: null,
    exam: null,
    canonicalQuestionId: params.canonicalQuestionId,
    translationStatus: params.flagCategory,
  };
}
