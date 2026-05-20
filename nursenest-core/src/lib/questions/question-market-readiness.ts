/**
 * Market readiness scoring for question localization.
 *
 * Evaluates how well-prepared the question bank is for a target market,
 * producing readiness levels that gate SEO content and marketing claims.
 *
 * A market is only "market_ready" when enough questions are:
 *   - classified as suitable (direct_reuse, translated, or adapted)
 *   - translated into the market's locales where needed
 *   - reviewed and approved
 *
 * This module is used by the blog generator and SEO strategy to decide
 * whether to aggressively promote a market or show hedged messaging.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { QuestionMarketFitLevel } from "./question-market-fit";
import { QUESTION_LOCALIZATION_PROFILES } from "./question-localization-config";

// ── Types ────────────────────────────────────────────────────────────────────

export type MarketReadinessLevel = "not_ready" | "partial" | "market_ready" | "high_confidence";

export type QuestionCoverageDimension = {
  label: string;
  level: MarketReadinessLevel;
  count: number;
  total: number;
  percentage: number;
};

export type MarketReadinessReport = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;

  overallReadiness: MarketReadinessLevel;

  questionCoverage: QuestionCoverageDimension;
  translationCoverage: QuestionCoverageDimension;
  rationaleCoverage: QuestionCoverageDimension;
  examAppropriateness: QuestionCoverageDimension;

  /** Whether SEO content can aggressively claim support for this market. */
  seoMarketReady: boolean;
  /** Whether the blog generator should produce content for this market. */
  blogGenerationAllowed: boolean;
  /** Conversion readiness for paid CTA messaging. */
  conversionReadinessLevel: MarketReadinessLevel;

  notes: string[];
};

// ── Thresholds ───────────────────────────────────────────────────────────────

const THRESHOLDS = {
  highConfidence: { questionPct: 85, translationPct: 80, rationalePct: 75 },
  marketReady: { questionPct: 60, translationPct: 50, rationalePct: 40 },
  partial: { questionPct: 25, translationPct: 15, rationalePct: 10 },
} as const;

// ── Input types ──────────────────────────────────────────────────────────────

export type QuestionReadinessInput = {
  questionId: string;
  fitLevel: QuestionMarketFitLevel;
  hasApprovedTranslation: boolean;
  hasTranslatedRationale: boolean;
  isReviewed: boolean;
};

// ── Scoring ──────────────────────────────────────────────────────────────────

export function scoreMarketReadiness(
  region: GlobalRegionSlug,
  locale: GlobalLocaleCode,
  profession: string | null,
  exam: string | null,
  questions: QuestionReadinessInput[],
): MarketReadinessReport {
  const profile = QUESTION_LOCALIZATION_PROFILES[region];
  const notes: string[] = [];
  const total = questions.length;

  if (total === 0) {
    return buildEmptyReport(region, locale, profession, exam, ["No questions available for this market"]);
  }

  // Question coverage: how many are suitable (not excluded)
  const suitable = questions.filter((q) => q.fitLevel !== "excluded");
  const questionCoverage = buildDimension("Question suitability", suitable.length, total);

  // Translation coverage (only relevant for non-English locales)
  const needsTranslation = locale !== "en";
  const translated = needsTranslation ? questions.filter((q) => q.hasApprovedTranslation) : suitable;
  const translationCoverage = buildDimension(
    "Translation coverage",
    translated.length,
    needsTranslation ? suitable.length : total,
  );

  // Rationale coverage
  const withRationale = questions.filter((q) => q.hasTranslatedRationale || (!needsTranslation && q.fitLevel !== "excluded"));
  const rationaleCoverage = buildDimension("Rationale coverage", withRationale.length, suitable.length);

  // Exam appropriateness (direct reuse + translated = high; adapted = medium)
  const directlyAppropriate = questions.filter(
    (q) => q.fitLevel === "direct_reuse" || q.fitLevel === "translated_only",
  );
  const examAppropriateness = buildDimension("Exam appropriateness", directlyAppropriate.length, total);

  // Overall readiness
  const overallReadiness = computeOverallReadiness(
    questionCoverage.percentage,
    translationCoverage.percentage,
    rationaleCoverage.percentage,
  );

  // SEO and blog gating
  const seoMarketReady = overallReadiness === "market_ready" || overallReadiness === "high_confidence";
  const blogGenerationAllowed = overallReadiness !== "not_ready";
  const conversionReadinessLevel = seoMarketReady ? overallReadiness : "partial";

  // Generate notes
  if (!seoMarketReady) {
    notes.push(`Market ${region} not ready for aggressive SEO — readiness: ${overallReadiness}`);
  }
  if (needsTranslation && translationCoverage.percentage < THRESHOLDS.partial.translationPct) {
    notes.push(`Translation coverage for ${locale} is very low (${translationCoverage.percentage}%)`);
  }
  if (profile && !profile.allowedLocales.includes(locale)) {
    notes.push(`Locale ${locale} not in allowed locales for ${region}`);
  }

  return {
    region,
    locale,
    profession,
    exam,
    overallReadiness,
    questionCoverage,
    translationCoverage,
    rationaleCoverage,
    examAppropriateness,
    seoMarketReady,
    blogGenerationAllowed,
    conversionReadinessLevel,
    notes,
  };
}

// ── SEO strategy fields (consumed by blog generator) ─────────────────────────

export type QuestionSeoStrategyFields = {
  supportsLocalizedQuestions: boolean;
  supportedQuestionLocales: GlobalLocaleCode[];
  supportedQuestionRegions: GlobalRegionSlug[];
  supportedQuestionExams: string[];
  supportedQuestionProfessions: string[];
  adaptationLevel: MarketReadinessLevel;
  translationCoverage: MarketReadinessLevel;
  marketReadiness: MarketReadinessLevel;
};

/**
 * Build SEO strategy fields from a readiness report.
 * These fields are consumed by the localized blog generator to produce
 * honest content claims about question support per market.
 */
export function buildQuestionSeoStrategyFields(
  report: MarketReadinessReport,
): QuestionSeoStrategyFields {
  const profile = QUESTION_LOCALIZATION_PROFILES[report.region];

  return {
    supportsLocalizedQuestions: report.seoMarketReady,
    supportedQuestionLocales: profile ? [...profile.allowedLocales] : ["en"],
    supportedQuestionRegions: [report.region],
    supportedQuestionExams: profile?.examRelevance ?? [],
    supportedQuestionProfessions: profile?.professionRelevance ?? [],
    adaptationLevel: report.examAppropriateness.level,
    translationCoverage: report.translationCoverage.level,
    marketReadiness: report.overallReadiness,
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildDimension(label: string, count: number, total: number): QuestionCoverageDimension {
  if (total === 0) return { label, level: "not_ready", count: 0, total: 0, percentage: 0 };
  const percentage = Math.round((count / total) * 100);
  return {
    label,
    level: dimensionLevel(percentage),
    count,
    total,
    percentage,
  };
}

function dimensionLevel(pct: number): MarketReadinessLevel {
  if (pct >= THRESHOLDS.highConfidence.questionPct) return "high_confidence";
  if (pct >= THRESHOLDS.marketReady.questionPct) return "market_ready";
  if (pct >= THRESHOLDS.partial.questionPct) return "partial";
  return "not_ready";
}

function computeOverallReadiness(
  questionPct: number,
  translationPct: number,
  rationalePct: number,
): MarketReadinessLevel {
  const t = THRESHOLDS;

  if (
    questionPct >= t.highConfidence.questionPct &&
    translationPct >= t.highConfidence.translationPct &&
    rationalePct >= t.highConfidence.rationalePct
  ) {
    return "high_confidence";
  }

  if (
    questionPct >= t.marketReady.questionPct &&
    translationPct >= t.marketReady.translationPct &&
    rationalePct >= t.marketReady.rationalePct
  ) {
    return "market_ready";
  }

  if (
    questionPct >= t.partial.questionPct &&
    translationPct >= t.partial.translationPct
  ) {
    return "partial";
  }

  return "not_ready";
}

function buildEmptyReport(
  region: GlobalRegionSlug,
  locale: GlobalLocaleCode,
  profession: string | null,
  exam: string | null,
  notes: string[],
): MarketReadinessReport {
  const empty: QuestionCoverageDimension = { label: "", level: "not_ready", count: 0, total: 0, percentage: 0 };
  return {
    region,
    locale,
    profession,
    exam,
    overallReadiness: "not_ready",
    questionCoverage: { ...empty, label: "Question suitability" },
    translationCoverage: { ...empty, label: "Translation coverage" },
    rationaleCoverage: { ...empty, label: "Rationale coverage" },
    examAppropriateness: { ...empty, label: "Exam appropriateness" },
    seoMarketReady: false,
    blogGenerationAllowed: false,
    conversionReadinessLevel: "not_ready",
    notes,
  };
}
