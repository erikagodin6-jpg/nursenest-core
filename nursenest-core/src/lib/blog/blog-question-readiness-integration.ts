/**
 * Blog ↔ question readiness integration.
 *
 * Connects the blog market strategy with question localization readiness
 * so blog content generation can make honest claims about product support
 * per market.
 *
 * The blog generator consumes these fields to decide:
 *   - Whether to claim "adapted questions" for a market
 *   - What language/locale claims are supportable
 *   - How aggressively to promote question features in blog CTAs
 *   - Whether to gate blog generation behind readiness thresholds
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { BlogMarketStrategy } from "./blog-market-strategy";
import { BLOG_MARKET_STRATEGIES } from "./blog-market-strategy";
import type {
  MarketReadinessLevel,
  MarketReadinessReport,
  QuestionSeoStrategyFields,
} from "@/lib/questions/question-market-readiness";

// ── Types ────────────────────────────────────────────────────────────────────

export type BlogQuestionReadinessFields = {
  /** Whether localized questions are available for this market. */
  supportsLocalizedQuestions: boolean;
  /** Locales with approved question overlays. */
  supportedQuestionLocales: GlobalLocaleCode[];
  /** Exams with adapted question coverage. */
  supportedQuestionExams: string[];
  /** Professions with question coverage. */
  supportedQuestionProfessions: string[];
  /** Overall question adaptation level. */
  adaptationLevel: MarketReadinessLevel;
  /** Translation coverage level. */
  translationCoverage: MarketReadinessLevel;
  /** Overall market readiness for SEO claims. */
  marketReadiness: MarketReadinessLevel;

  /** Human-readable summary for blog generator context. */
  readinessSummary: string;
  /** Suggested blog messaging tier based on readiness. */
  messagingTier: "aggressive" | "moderate" | "hedged" | "silent";
};

export type EnrichedBlogMarketStrategy = BlogMarketStrategy & {
  questionReadiness: BlogQuestionReadinessFields;
};

// ── Enrichment ───────────────────────────────────────────────────────────────

/**
 * Enrich a blog market strategy with question readiness data.
 *
 * @param region - Target region.
 * @param readinessReport - Output from `scoreMarketReadiness()` (or null if not yet computed).
 * @param seoFields - Output from `buildQuestionSeoStrategyFields()` (or null).
 */
export function enrichMarketStrategyWithQuestionReadiness(
  region: GlobalRegionSlug,
  readinessReport: MarketReadinessReport | null,
  seoFields: QuestionSeoStrategyFields | null,
): EnrichedBlogMarketStrategy | null {
  const base = BLOG_MARKET_STRATEGIES[region];
  if (!base) return null;

  const questionReadiness = buildQuestionReadinessFields(base, readinessReport, seoFields);

  return { ...base, questionReadiness };
}

/**
 * Build question readiness editorial context for the blog AI generator.
 * This string is injected into the adaptation prompt so the AI knows
 * what product claims are supportable.
 */
export function buildQuestionReadinessEditorialContext(
  fields: BlogQuestionReadinessFields,
  region: GlobalRegionSlug,
): string {
  const lines: string[] = [];

  if (!fields.supportsLocalizedQuestions) {
    lines.push(
      `Question bank: Generic question bank available. Localized/adapted questions for ${region} are not yet approved.`,
      "Content guidance: Do NOT claim country-specific question adaptation. Focus on general exam prep value.",
    );
    return lines.join("\n");
  }

  lines.push(`Question bank: Localized questions available for ${region}.`);
  lines.push(`Supported question locales: ${fields.supportedQuestionLocales.join(", ")}.`);
  lines.push(`Supported exams: ${fields.supportedQuestionExams.join(", ")}.`);
  lines.push(`Adaptation level: ${fields.adaptationLevel}.`);
  lines.push(`Translation coverage: ${fields.translationCoverage}.`);

  switch (fields.messagingTier) {
    case "aggressive":
      lines.push(
        "Content guidance: You may claim full localized question support. Use confident conversion language.",
      );
      break;
    case "moderate":
      lines.push(
        "Content guidance: You may mention localized questions but use moderate claims. Emphasize ongoing improvement.",
      );
      break;
    case "hedged":
      lines.push(
        "Content guidance: Mention question availability carefully. Use hedged language like 'growing question bank' or 'questions adapted for your market'.",
      );
      break;
    case "silent":
      lines.push(
        "Content guidance: Do NOT specifically claim localized questions. Focus on general exam prep value.",
      );
      break;
  }

  return lines.join("\n");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildQuestionReadinessFields(
  strategy: BlogMarketStrategy,
  report: MarketReadinessReport | null,
  seoFields: QuestionSeoStrategyFields | null,
): BlogQuestionReadinessFields {
  if (!report || !seoFields) {
    return {
      supportsLocalizedQuestions: false,
      supportedQuestionLocales: ["en"],
      supportedQuestionExams: strategy.examRelevance,
      supportedQuestionProfessions: [],
      adaptationLevel: "not_ready",
      translationCoverage: "not_ready",
      marketReadiness: "not_ready",
      readinessSummary: `Question readiness data not yet available for ${strategy.displayName}.`,
      messagingTier: "silent",
    };
  }

  const messagingTier = deriveMessagingTier(report.overallReadiness, report.seoMarketReady);

  return {
    supportsLocalizedQuestions: seoFields.supportsLocalizedQuestions,
    supportedQuestionLocales: seoFields.supportedQuestionLocales,
    supportedQuestionExams: seoFields.supportedQuestionExams,
    supportedQuestionProfessions: seoFields.supportedQuestionProfessions,
    adaptationLevel: seoFields.adaptationLevel,
    translationCoverage: seoFields.translationCoverage,
    marketReadiness: seoFields.marketReadiness,
    readinessSummary: buildReadinessSummary(strategy, report),
    messagingTier,
  };
}

function deriveMessagingTier(
  readiness: MarketReadinessLevel,
  seoReady: boolean,
): "aggressive" | "moderate" | "hedged" | "silent" {
  if (readiness === "high_confidence" && seoReady) return "aggressive";
  if (readiness === "market_ready" && seoReady) return "moderate";
  if (readiness === "partial") return "hedged";
  return "silent";
}

function buildReadinessSummary(
  strategy: BlogMarketStrategy,
  report: MarketReadinessReport,
): string {
  const parts: string[] = [
    `${strategy.displayName}: ${report.overallReadiness} readiness.`,
    `Questions: ${report.questionCoverage.percentage}% suitable (${report.questionCoverage.count}/${report.questionCoverage.total}).`,
  ];

  if (report.translationCoverage.total > 0) {
    parts.push(
      `Translations: ${report.translationCoverage.percentage}% coverage.`,
    );
  }

  if (report.notes.length > 0) {
    parts.push(`Notes: ${report.notes.join("; ")}.`);
  }

  return parts.join(" ");
}
