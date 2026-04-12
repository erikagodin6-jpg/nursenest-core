/**
 * Region-specific CTA generation for localized blog articles.
 *
 * Each localized article gets CTAs that reflect the market's price sensitivity,
 * audience type, exam relevance, and conversion angle — not one generic CTA.
 */

import type { GlobalLocaleCode, GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { REGION_CONFIG } from "@/lib/i18n/global-regions";
import { BLOG_MARKET_STRATEGIES } from "./blog-market-strategy";

export type LocalizedCtaVariant =
  | "pricing_affordable"
  | "pricing_value"
  | "pricing_premium"
  | "free_trial"
  | "question_bank"
  | "lessons_hub"
  | "practice_exam"
  | "study_plan"
  | "signup";

export type LocalizedBlogCta = {
  variant: LocalizedCtaVariant;
  text: string;
  href: string;
  position: "inline" | "end_of_article" | "sidebar";
  regionContext: string;
};

/**
 * Build primary CTA for a localized blog article based on market strategy.
 */
export function buildLocalizedPrimaryCta(params: {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
  funnelStage: "awareness" | "consideration" | "conversion" | "retention";
}): LocalizedBlogCta {
  const strategy = BLOG_MARKET_STRATEGIES[params.region];
  const regionConfig = REGION_CONFIG[params.region];
  const regionName = regionConfig?.displayName ?? params.region;

  const basePath = buildRegionBasePath(params.locale, params.region, params.profession, params.exam);

  if (params.funnelStage === "conversion") {
    return pricingCta(strategy, regionName, basePath);
  }

  if (params.funnelStage === "awareness") {
    return {
      variant: "free_trial",
      text: strategy
        ? `Start your free ${regionName} exam prep trial`
        : `Start your free exam prep trial`,
      href: `${basePath}/pricing`,
      position: "end_of_article",
      regionContext: strategy?.ctaAngle ?? "",
    };
  }

  if (strategy?.priceSensitivity === "very_high" || strategy?.priceSensitivity === "high") {
    return pricingCta(strategy, regionName, basePath);
  }

  return {
    variant: "question_bank",
    text: params.exam
      ? `Practice ${params.exam.toUpperCase()} questions`
      : "Practice exam-style questions",
    href: `${basePath}/questions`,
    position: "end_of_article",
    regionContext: strategy?.ctaAngle ?? "",
  };
}

/**
 * Build inline CTA for placement within article body.
 */
export function buildLocalizedInlineCta(params: {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
  context: "after_intro" | "mid_article" | "before_conclusion";
}): LocalizedBlogCta {
  const strategy = BLOG_MARKET_STRATEGIES[params.region];
  const basePath = buildRegionBasePath(params.locale, params.region, params.profession, params.exam);

  if (params.context === "after_intro") {
    return {
      variant: "study_plan",
      text: params.exam
        ? `Get a structured ${params.exam.toUpperCase()} study plan`
        : "Get a structured study plan",
      href: `${basePath}/lessons`,
      position: "inline",
      regionContext: strategy?.ctaAngle ?? "",
    };
  }

  if (params.context === "mid_article") {
    return {
      variant: "practice_exam",
      text: "Try a practice exam now",
      href: `${basePath}/practice`,
      position: "inline",
      regionContext: strategy?.ctaAngle ?? "",
    };
  }

  return {
    variant: "question_bank",
    text: "Test your knowledge",
    href: `${basePath}/questions`,
    position: "inline",
    regionContext: strategy?.ctaAngle ?? "",
  };
}

/**
 * Generate all CTA suggestions for a localized article (primary + inline positions).
 */
export function generateCtaSuggestions(params: {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
  funnelStage: "awareness" | "consideration" | "conversion" | "retention";
}): LocalizedBlogCta[] {
  return [
    buildLocalizedPrimaryCta(params),
    buildLocalizedInlineCta({ ...params, context: "after_intro" }),
    buildLocalizedInlineCta({ ...params, context: "mid_article" }),
    buildLocalizedInlineCta({ ...params, context: "before_conclusion" }),
  ];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildRegionBasePath(
  locale: GlobalLocaleCode,
  region: GlobalRegionSlug,
  profession: string | null,
  exam: string | null,
): string {
  const parts = [`/${locale}`, region];
  if (profession) parts.push(profession.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  if (exam) parts.push(exam.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  return parts.join("/");
}

function pricingCta(
  strategy: (typeof BLOG_MARKET_STRATEGIES)[GlobalRegionSlug] | undefined,
  regionName: string,
  basePath: string,
): LocalizedBlogCta {
  const isAffordableMarket =
    strategy?.priceSensitivity === "very_high" || strategy?.priceSensitivity === "high";

  return {
    variant: isAffordableMarket ? "pricing_affordable" : "pricing_value",
    text: isAffordableMarket
      ? `See affordable plans for ${regionName}`
      : `View plans and pricing`,
    href: `${basePath}/pricing`,
    position: "end_of_article",
    regionContext: strategy?.ctaAngle ?? "",
  };
}
