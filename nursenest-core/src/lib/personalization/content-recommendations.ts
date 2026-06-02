/**
 * Personalized content recommender.
 *
 * Connects user study state + market context to content recommendations:
 *
 *   1. Blog/article recommendations based on region, exam, weak areas
 *   2. Lesson suggestions based on study stage
 *   3. Practice set recommendations based on performance
 *   4. CTA variants tuned to market + study stage + entitlement
 *
 * All functions are pure — they produce recommendation descriptors,
 * not DB queries. Callers fetch actual content via the relevant loaders.
 */

import type { PersonalizationContext, StudyStage } from "./personalization-context";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { BlogMarketStrategy } from "@/lib/blog/blog-market-strategy";
import { BLOG_MARKET_STRATEGIES } from "@/lib/blog/blog-market-strategy";

// ── Types ────────────────────────────────────────────────────────────────────

export type ContentRecommendation = {
  kind: "blog" | "lesson" | "quiz" | "flashcard_deck" | "cat_session" | "review";
  title: string;
  /** WHY this is recommended — one line, factual. */
  reason: string;
  /** Relative URL or null if unknown (caller resolves from context). */
  href: string | null;
  /** Priority 1 = highest. */
  priority: number;
  /** Optional topic if recommendation is topic-specific. */
  topic: string | null;
};

export type BlogRecommendationSeed = {
  /** SEO keywords to match against published blog inventory. */
  queryKeywords: string[];
  /** Region filter for blog article lookup. */
  region: GlobalRegionSlug;
  /** Locale filter. */
  locale: string;
  /** Profession filter. */
  profession: string | null;
  /** Exam filter. */
  exam: string | null;
  /** Max results. */
  limit: number;
  /** Optional weak-area topics to bias relevance ranking. */
  weakTopics: string[];
};

export type CtaVariant = {
  label: string;
  href: string;
  tone: "urgent" | "motivational" | "value" | "neutral";
  surface: "dashboard" | "sidebar" | "end_of_content" | "inline";
};

// ── Blog recommendation seeds ────────────────────────────────────────────────

/**
 * Build search/filter seeds for personalized blog recommendations.
 *
 * Callers use these seeds to query the localized blog inventory
 * (Prisma or search index) and return matching articles.
 */
export function buildBlogRecommendationSeeds(
  ctx: PersonalizationContext,
): BlogRecommendationSeed[] {
  const strategy: BlogMarketStrategy | undefined = BLOG_MARKET_STRATEGIES[ctx.region];
  const seoKeywords = strategy?.seoEmphasis ?? [];
  const painPoints = strategy?.audiencePainPoints ?? [];
  const seeds: BlogRecommendationSeed[] = [];

  const base = {
    region: ctx.region,
    locale: ctx.locale,
    profession: ctx.profession,
    exam: ctx.exam,
    weakTopics: ctx.topWeakTopic ? [ctx.topWeakTopic] : [],
  };

  if (ctx.studyStage === "new" || ctx.studyStage === "onboarding") {
    seeds.push({
      ...base,
      queryKeywords: [
        ...seoKeywords.slice(0, 3),
        "how to start",
        "study plan",
        "beginner",
      ],
      limit: 3,
    });
  }

  if (ctx.weakAreaCount > 0 && ctx.topWeakTopic) {
    seeds.push({
      ...base,
      queryKeywords: [ctx.topWeakTopic, "review", "practice"],
      limit: 2,
    });
  }

  if (ctx.studyStage === "exam_ready" || ctx.studyStage === "strengthening") {
    seeds.push({
      ...base,
      queryKeywords: [
        "exam day",
        "final review",
        "last minute",
        ...painPoints.slice(0, 2),
      ],
      limit: 2,
    });
  }

  // Always include a general market-relevant seed
  seeds.push({
    ...base,
    queryKeywords: seoKeywords.slice(0, 4),
    limit: 3,
  });

  return seeds;
}

// ── Study content recommendations ────────────────────────────────────────────

/**
 * Generate personalized study content recommendations.
 *
 * These are lightweight descriptors — callers resolve actual links and
 * content availability via their data loaders.
 */
export function buildStudyRecommendations(
  ctx: PersonalizationContext,
): ContentRecommendation[] {
  const recs: ContentRecommendation[] = [];

  const recsByStage = STAGE_RECOMMENDATIONS[ctx.studyStage] ?? [];
  for (const rec of recsByStage) {
    recs.push({
      ...rec,
      topic: null,
    });
  }

  if (ctx.topWeakTopic) {
    recs.push({
      kind: "quiz",
      title: `${ctx.topWeakTopic} focused drill`,
      reason: `${ctx.topWeakTopic} is your weakest area — targeted practice will improve retention.`,
      href: `/app/questions?preset=topic_drill&topic=${encodeURIComponent(ctx.topWeakTopic)}`,
      priority: 1,
      topic: ctx.topWeakTopic,
    });
  }

  if (ctx.studyStreakDays === 0 && ctx.studyStage !== "new") {
    recs.push({
      kind: "review",
      title: "Quick review session",
      reason: "Maintain your knowledge with a short review.",
      href: "/app/review",
      priority: 2,
      topic: null,
    });
  }

  return recs.sort((a, b) => a.priority - b.priority);
}

const STAGE_RECOMMENDATIONS: Record<StudyStage, Omit<ContentRecommendation, "topic">[]> = {
  new: [
    { kind: "lesson", title: "Start your first lesson", reason: "Build a foundation before practicing questions.", href: "/app/lessons", priority: 1 },
    { kind: "flashcard_deck", title: "Core terminology flashcards", reason: "Memorize key terms early to accelerate learning.", href: "/app/flashcards", priority: 3 },
  ],
  onboarding: [
    { kind: "lesson", title: "Continue your learning path", reason: "You've started strong — keep building knowledge.", href: "/app/lessons", priority: 1 },
    { kind: "quiz", title: "Try a short practice quiz", reason: "Test what you've learned so far.", href: "/app/questions", priority: 2 },
  ],
  building: [
    { kind: "quiz", title: "Practice question bank", reason: "Apply knowledge through structured practice.", href: "/app/questions", priority: 1 },
    { kind: "lesson", title: "Continue lessons", reason: "Keep progressing through your study pathway.", href: "/app/lessons", priority: 2 },
    { kind: "cat_session", title: "Adaptive practice test", reason: "Measure readiness with an adaptive session.", href: "/app/practice-tests", priority: 3 },
  ],
  strengthening: [
    { kind: "quiz", title: "Weak area practice", reason: "Focus on areas where you need the most improvement.", href: "/app/questions", priority: 1 },
    { kind: "cat_session", title: "Full-length practice exam", reason: "Simulate exam conditions to build confidence.", href: "/app/practice-tests", priority: 2 },
    { kind: "review", title: "Spaced review queue", reason: "Reinforce topics at risk of being forgotten.", href: "/app/review", priority: 3 },
  ],
  exam_ready: [
    { kind: "cat_session", title: "Final practice exam", reason: "Confirm your readiness with a full-length test.", href: "/app/practice-tests", priority: 1 },
    { kind: "review", title: "Quick confidence review", reason: "Light review to stay sharp without overloading.", href: "/app/review", priority: 2 },
  ],
  reviewing: [
    { kind: "review", title: "Continue your review", reason: "Maintain knowledge through ongoing review.", href: "/app/review", priority: 1 },
    { kind: "flashcard_deck", title: "Flashcard maintenance", reason: "Keep retention high with spaced repetition.", href: "/app/flashcards", priority: 2 },
  ],
};

// ── CTA variants ─────────────────────────────────────────────────────────────

/**
 * Generate market- and stage-appropriate CTA variants for various surfaces.
 */
export function buildCtaVariants(
  ctx: PersonalizationContext,
): CtaVariant[] {
  const strategy: BlogMarketStrategy | undefined = BLOG_MARKET_STRATEGIES[ctx.region];
  const variants: CtaVariant[] = [];

  if (!ctx.hasActiveSubscription) {
    const priceTone = strategy?.priceSensitivity === "very_high" || strategy?.priceSensitivity === "high"
      ? "value"
      : "motivational";

    variants.push({
      label: priceTone === "value"
        ? "Start affordable exam prep"
        : "Begin your exam prep journey",
      href: "/pricing",
      tone: priceTone,
      surface: "dashboard",
    });

    variants.push({
      label: "See pricing for your region",
      href: "/pricing",
      tone: "neutral",
      surface: "end_of_content",
    });
  }

  if (ctx.hasActiveSubscription && !ctx.isHomeRegion) {
    variants.push({
      label: "Return to your study home",
      href: "/app",
      tone: "neutral",
      surface: "sidebar",
    });
  }

  if (ctx.hasActiveSubscription && ctx.studyStage === "building") {
    variants.push({
      label: "Set your exam date for a personalized plan",
      href: "/app/study-plan",
      tone: "motivational",
      surface: "dashboard",
    });
  }

  if (ctx.hasActiveSubscription && ctx.examDaysRemaining != null && ctx.examDaysRemaining <= 14) {
    variants.push({
      label: "Final review mode",
      href: "/app/practice-tests",
      tone: "urgent",
      surface: "dashboard",
    });
  }

  return variants;
}

// ── Analytics event builders ─────────────────────────────────────────────────

export type PersonalizationAnalyticsPayload = {
  event: string;
  properties: Record<string, string | number | boolean | undefined>;
};

export const PERSONALIZATION_EVENTS = {
  recommendationSeen: "recommendation_seen",
  recommendationClicked: "recommendation_clicked",
  personalizedDashboardLoaded: "personalized_dashboard_loaded",
  personalizedBlogRecommended: "personalized_blog_recommended",
  personalizedQuestionVariantServed: "personalized_question_variant_served",
} as const;

export function buildRecommendationSeenEvent(
  rec: ContentRecommendation,
  ctx: PersonalizationContext,
  surface: string,
): PersonalizationAnalyticsPayload {
  return {
    event: PERSONALIZATION_EVENTS.recommendationSeen,
    properties: {
      kind: rec.kind,
      title: rec.title,
      topic: rec.topic ?? undefined,
      priority: rec.priority,
      surface,
      region: ctx.region,
      locale: ctx.locale,
      profession: ctx.profession ?? undefined,
      exam: ctx.exam ?? undefined,
      study_stage: ctx.studyStage,
      has_subscription: ctx.hasActiveSubscription,
    },
  };
}

export function buildRecommendationClickedEvent(
  rec: ContentRecommendation,
  ctx: PersonalizationContext,
  surface: string,
): PersonalizationAnalyticsPayload {
  return {
    event: PERSONALIZATION_EVENTS.recommendationClicked,
    properties: {
      kind: rec.kind,
      title: rec.title,
      topic: rec.topic ?? undefined,
      priority: rec.priority,
      href: rec.href ?? undefined,
      surface,
      region: ctx.region,
      locale: ctx.locale,
      profession: ctx.profession ?? undefined,
      exam: ctx.exam ?? undefined,
      study_stage: ctx.studyStage,
      has_subscription: ctx.hasActiveSubscription,
    },
  };
}

export function buildDashboardLoadedEvent(
  ctx: PersonalizationContext,
): PersonalizationAnalyticsPayload {
  return {
    event: PERSONALIZATION_EVENTS.personalizedDashboardLoaded,
    properties: {
      region: ctx.region,
      locale: ctx.locale,
      profession: ctx.profession ?? undefined,
      exam: ctx.exam ?? undefined,
      study_stage: ctx.studyStage,
      readiness_band: ctx.readinessBand ?? undefined,
      weak_area_count: ctx.weakAreaCount,
      streak_days: ctx.studyStreakDays,
      has_subscription: ctx.hasActiveSubscription,
      is_home_region: ctx.isHomeRegion,
      is_new_user: ctx.isNewUser,
    },
  };
}
