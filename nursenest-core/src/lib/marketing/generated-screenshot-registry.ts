/**
 * Generated marketing screenshot registry.
 *
 * These assets are produced by `scripts/generate-marketing-screenshots.ts`
 * under `public/marketing/generated-screenshots/`.
 *
 * One canonical path per key — no dual primary/fallback asset wiring.
 */

export type GeneratedScreenshotKey =
  | "coreDashboard"
  | "coreReadiness"
  | "coreCoaching"
  | "coreCat"
  | "coreFlashcards"
  | "coreCatReadiness"
  | "coreAnalytics"
  | "marketingHome"
  | "marketingPricing"
  | "marketingFaq"
  | "rnMarketingHub"
  | "rnQuestionsMarketing"
  | "rnLessonsMarketing"
  | "pnMarketingHub"
  | "npMarketingHub"
  | "alliedMarketingHub"
  | "newGradMarketingHub"
  | "rnHub"
  | "pnHub"
  | "npHub"
  | "alliedHub"
  | "newGradHub"
  | "rnFlashcards"
  | "pnFlashcards"
  | "npFlashcards"
  | "rnCat"
  | "pnCat"
  | "npLoft"
  | "npCnple"
  | "npAnalytics"
  | "newGradReadiness";

export type GeneratedScreenshotRecord = {
  key: GeneratedScreenshotKey;
  /** Canonical production path — sole wired asset for this key. */
  path: string;
  component: string;
  pages: readonly string[];
  status: "current" | "needs-authenticated-capture" | "needs-recapture";
  recommendation: string;
};

function generated(
  key: GeneratedScreenshotKey,
  path: string,
  args: {
    component: string;
    pages: readonly string[];
    status?: GeneratedScreenshotRecord["status"];
    recommendation?: string;
  },
): GeneratedScreenshotRecord {
  const status = args.status ?? "current";
  return {
    key,
    path,
    component: args.component,
    pages: args.pages,
    status,
    recommendation:
      args.recommendation ??
      (status === "current"
        ? "Use this generated asset as the canonical local screenshot."
        : "Run npm run generate:marketing-screenshots with seeded QA credentials, then review and keep this path as primary."),
  };
}

export const GENERATED_SCREENSHOT_REGISTRY = {
  coreDashboard: generated(
    "coreDashboard",
    "/marketing/generated-screenshots/core/learner-dashboard.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  coreReadiness: generated(
    "coreReadiness",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  coreCoaching: generated(
    "coreCoaching",
    "/marketing/generated-screenshots/core/smart-review.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  coreCat: generated(
    "coreCat",
    "/marketing/generated-screenshots/core/cat-exam-session.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  coreFlashcards: generated(
    "coreFlashcards",
    "/marketing/generated-screenshots/core/flashcards.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  coreCatReadiness: generated(
    "coreCatReadiness",
    "/marketing/generated-screenshots/core/cat-results.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  coreAnalytics: generated(
    "coreAnalytics",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  marketingHome: generated(
    "marketingHome",
    "/marketing/generated-screenshots/marketing/marketing-home-desktop.webp",
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/", "/pricing"],
      recommendation:
        "Fresh production capture from QA RN subscriber — homepage hero with platform preview carousel.",
    },
  ),
  marketingPricing: generated(
    "marketingPricing",
    "/marketing/generated-screenshots/marketing/pricing.webp",
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/pricing"],
      recommendation:
        "Fresh production capture — pricing tiers with live product screenshots.",
    },
  ),
  marketingFaq: generated(
    "marketingFaq",
    "/marketing/generated-screenshots/marketing/faq.webp",
    { component: "GeneratedMarketingScreenshotRegistry", pages: ["/faq"] },
  ),
  rnMarketingHub: generated(
    "rnMarketingHub",
    "/marketing/generated-screenshots/marketing/rn-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/us/rn/nclex-rn"] },
  ),
  rnQuestionsMarketing: generated(
    "rnQuestionsMarketing",
    "/marketing/generated-screenshots/marketing/rn-questions-marketing.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/us/rn/nclex-rn/questions"] },
  ),
  rnLessonsMarketing: generated(
    "rnLessonsMarketing",
    "/marketing/generated-screenshots/marketing/rn-lessons-marketing.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/us/rn/nclex-rn/lessons"] },
  ),
  pnMarketingHub: generated(
    "pnMarketingHub",
    "/marketing/generated-screenshots/marketing/pn-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/canada/pn/rex-pn"] },
  ),
  npMarketingHub: generated(
    "npMarketingHub",
    "/marketing/generated-screenshots/marketing/np-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/canada/np/cnple"] },
  ),
  alliedMarketingHub: generated(
    "alliedMarketingHub",
    "/marketing/generated-screenshots/marketing/allied-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/allied/allied-health"] },
  ),
  newGradMarketingHub: generated(
    "newGradMarketingHub",
    "/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing", "/canada/new-grad"] },
  ),
  rnHub: generated(
    "rnHub",
    "/marketing/generated-screenshots/marketing/rn-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  pnHub: generated(
    "pnHub",
    "/marketing/generated-screenshots/marketing/pn-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  npHub: generated(
    "npHub",
    "/marketing/generated-screenshots/marketing/np-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  alliedHub: generated(
    "alliedHub",
    "/marketing/generated-screenshots/marketing/allied-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  newGradHub: generated(
    "newGradHub",
    "/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  rnFlashcards: generated(
    "rnFlashcards",
    "/marketing/generated-screenshots/core/flashcards.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  pnFlashcards: generated(
    "pnFlashcards",
    "/marketing/generated-screenshots/core/flashcards.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  npFlashcards: generated(
    "npFlashcards",
    "/marketing/generated-screenshots/core/flashcards.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  rnCat: generated(
    "rnCat",
    "/marketing/generated-screenshots/core/cat-exam-session.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  pnCat: generated(
    "pnCat",
    "/marketing/generated-screenshots/pn/pn-cat.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  npLoft: generated(
    "npLoft",
    "/marketing/generated-screenshots/marketing/np-marketing-hub.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  npCnple: generated(
    "npCnple",
    "/marketing/generated-screenshots/np/np-cnple.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  npAnalytics: generated(
    "npAnalytics",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
  newGradReadiness: generated(
    "newGradReadiness",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    { component: "TierValueExperience", pages: ["/pricing"] },
  ),
} as const satisfies Record<GeneratedScreenshotKey, GeneratedScreenshotRecord>;

export const GENERATED_SCREENSHOT_PATHS = Object.fromEntries(
  Object.entries(GENERATED_SCREENSHOT_REGISTRY).map(([key, value]) => [key, value.path]),
) as Record<GeneratedScreenshotKey, string>;

/** @deprecated Use GENERATED_SCREENSHOT_PATHS — legacy dual-fallback wiring removed. */
export const GENERATED_SCREENSHOT_FALLBACKS = GENERATED_SCREENSHOT_PATHS;

export function generatedScreenshotInventory(): GeneratedScreenshotRecord[] {
  return Object.values(GENERATED_SCREENSHOT_REGISTRY);
}
