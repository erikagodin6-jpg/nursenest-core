/**
 * Generated marketing screenshot registry.
 *
 * These assets are produced by `scripts/generate-marketing-screenshots.ts`
 * under `public/marketing/generated-screenshots/`.
 *
 * Keep generated product screenshots centralized here so marketing surfaces do
 * not copy local paths or drift back to legacy preview images.
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
  path: string;
  fallbackPath: string;
  component: string;
  pages: readonly string[];
  status: "current" | "needs-authenticated-capture" | "needs-recapture";
  recommendation: string;
};

/** Generated WebP fallbacks — never serve deprecated preview PNG directories. */
const PRODUCT_FALLBACKS = {
  dashboard: "/marketing/generated-screenshots/core/learner-dashboard.webp",
  readiness: "/marketing/generated-screenshots/core/confidence-analytics.webp",
  coaching: "/marketing/generated-screenshots/core/smart-review.webp",
  cat: "/marketing/generated-screenshots/core/cat-exam-session.webp",
  flashcards: "/marketing/generated-screenshots/core/flashcards.webp",
  catReadiness: "/marketing/generated-screenshots/core/cat-results.webp",
  analytics: "/marketing/generated-screenshots/core/confidence-analytics.webp",
} as const;

function generated(
  key: GeneratedScreenshotKey,
  path: string,
  fallbackPath: string,
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
    fallbackPath,
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
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  coreReadiness: generated(
    "coreReadiness",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    PRODUCT_FALLBACKS.readiness,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  coreCoaching: generated(
    "coreCoaching",
    "/marketing/generated-screenshots/core/smart-review.webp",
    PRODUCT_FALLBACKS.coaching,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  coreCat: generated(
    "coreCat",
    "/marketing/generated-screenshots/core/cat-exam-session.webp",
    PRODUCT_FALLBACKS.cat,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  coreFlashcards: generated(
    "coreFlashcards",
    "/marketing/generated-screenshots/core/flashcards.webp",
    PRODUCT_FALLBACKS.flashcards,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  coreCatReadiness: generated(
    "coreCatReadiness",
    "/marketing/generated-screenshots/core/cat-results.webp",
    PRODUCT_FALLBACKS.catReadiness,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  coreAnalytics: generated(
    "coreAnalytics",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    PRODUCT_FALLBACKS.analytics,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "current",
    },
  ),
  marketingHome: generated(
    "marketingHome",
    "/marketing/generated-screenshots/marketing/marketing-home-desktop.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/", "/pricing"],
      status: "current",
      recommendation:
        "Fresh production capture from QA RN subscriber — homepage hero with platform preview carousel.",
    },
  ),
  marketingPricing: generated(
    "marketingPricing",
    "/marketing/generated-screenshots/marketing/pricing.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/pricing"],
      status: "current",
      recommendation:
        "Fresh production capture — pricing tiers with live product screenshots.",
    },
  ),
  marketingFaq: generated(
    "marketingFaq",
    "/marketing/generated-screenshots/marketing/faq.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/faq"],
    },
  ),
  rnMarketingHub: generated(
    "rnMarketingHub",
    "/marketing/generated-screenshots/marketing/rn-marketing-hub.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/us/rn/nclex-rn"],
    },
  ),
  rnQuestionsMarketing: generated(
    "rnQuestionsMarketing",
    "/marketing/generated-screenshots/marketing/rn-questions-marketing.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/us/rn/nclex-rn/questions"],
    },
  ),
  rnLessonsMarketing: generated(
    "rnLessonsMarketing",
    "/marketing/generated-screenshots/marketing/rn-lessons-marketing.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/us/rn/nclex-rn/lessons"],
    },
  ),
  pnMarketingHub: generated(
    "pnMarketingHub",
    "/marketing/generated-screenshots/marketing/pn-marketing-hub.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/canada/pn/rex-pn"],
    },
  ),
  npMarketingHub: generated(
    "npMarketingHub",
    "/marketing/generated-screenshots/marketing/np-marketing-hub.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/canada/np/cnple"],
    },
  ),
  alliedMarketingHub: generated(
    "alliedMarketingHub",
    "/marketing/generated-screenshots/marketing/allied-marketing-hub.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/allied/allied-health"],
    },
  ),
  newGradMarketingHub: generated(
    "newGradMarketingHub",
    "/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp",
    PRODUCT_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/canada/new-grad"],
    },
  ),
  rnHub: generated("rnHub", "/marketing/generated-screenshots/rn/rn-hub.webp", "/marketing/generated-screenshots/marketing/rn-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  pnHub: generated("pnHub", "/marketing/generated-screenshots/pn/pn-hub.webp", "/marketing/generated-screenshots/marketing/pn-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  npHub: generated("npHub", "/marketing/generated-screenshots/np/np-hub.webp", "/marketing/generated-screenshots/marketing/np-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  alliedHub: generated("alliedHub", "/marketing/generated-screenshots/allied/allied-hub.webp", "/marketing/generated-screenshots/marketing/allied-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  newGradHub: generated("newGradHub", "/marketing/generated-screenshots/newgrad/newgrad-hub.webp", "/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  rnFlashcards: generated("rnFlashcards", "/marketing/generated-screenshots/rn/rn-flashcards.webp", "/marketing/generated-screenshots/marketing/rn-questions-marketing.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  pnFlashcards: generated("pnFlashcards", "/marketing/generated-screenshots/pn/pn-flashcards.webp", "/marketing/generated-screenshots/marketing/pn-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  npFlashcards: generated("npFlashcards", "/marketing/generated-screenshots/np/np-flashcards.webp", "/marketing/generated-screenshots/marketing/np-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  rnCat: generated("rnCat", "/marketing/generated-screenshots/rn/rn-cat-exam.webp", PRODUCT_FALLBACKS.cat, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  pnCat: generated("pnCat", "/marketing/generated-screenshots/pn/pn-cat.webp", PRODUCT_FALLBACKS.cat, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  npLoft: generated("npLoft", "/marketing/generated-screenshots/np/np-loft-simulation.webp", "/marketing/generated-screenshots/marketing/np-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  npCnple: generated("npCnple", "/marketing/generated-screenshots/np/np-cnple.webp", "/marketing/generated-screenshots/marketing/np-marketing-hub.webp", {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  npAnalytics: generated("npAnalytics", "/marketing/generated-screenshots/np/np-advanced-analytics.webp", PRODUCT_FALLBACKS.analytics, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  newGradReadiness: generated("newGradReadiness", "/marketing/generated-screenshots/newgrad/newgrad-readiness.webp", PRODUCT_FALLBACKS.readiness, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
} as const satisfies Record<GeneratedScreenshotKey, GeneratedScreenshotRecord>;

export const GENERATED_SCREENSHOT_PATHS = Object.fromEntries(
  Object.entries(GENERATED_SCREENSHOT_REGISTRY).map(([key, value]) => [
    key,
    value.status === "current" ? value.path : value.fallbackPath,
  ]),
) as Record<GeneratedScreenshotKey, string>;

export const GENERATED_SCREENSHOT_FALLBACKS = Object.fromEntries(
  Object.entries(GENERATED_SCREENSHOT_REGISTRY).map(([key, value]) => [key, value.fallbackPath]),
) as Record<GeneratedScreenshotKey, string>;

export function generatedScreenshotInventory(): GeneratedScreenshotRecord[] {
  return Object.values(GENERATED_SCREENSHOT_REGISTRY);
}
