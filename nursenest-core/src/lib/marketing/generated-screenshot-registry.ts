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
  status: "current" | "needs-authenticated-capture";
  recommendation: string;
};

const LEGACY_FALLBACKS = {
  dashboard: "/dashboard-redesign-preview/01-dash-desktop-ocean.png",
  readiness: "/dashboard-redesign-preview/03-readiness-desktop.png",
  coaching: "/dashboard-redesign-preview/07-coaching-panel.png",
  cat: "/dashboard-redesign-preview/10-cat-trajectory.png",
  flashcards: "/landing-polish-preview/png/08-flashcards-session-blossom.png",
  catReadiness: "/landing-polish-preview/png/09-cat-readiness-ocean.png",
  analytics: "/dashboard-redesign-preview/05-kpi-components.png",
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
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  coreReadiness: generated(
    "coreReadiness",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    LEGACY_FALLBACKS.readiness,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  coreCoaching: generated(
    "coreCoaching",
    "/marketing/generated-screenshots/core/smart-review.webp",
    LEGACY_FALLBACKS.coaching,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  coreCat: generated(
    "coreCat",
    "/marketing/generated-screenshots/core/cat-exam-session.webp",
    LEGACY_FALLBACKS.cat,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  coreFlashcards: generated(
    "coreFlashcards",
    "/marketing/generated-screenshots/core/flashcards.webp",
    LEGACY_FALLBACKS.flashcards,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  coreCatReadiness: generated(
    "coreCatReadiness",
    "/marketing/generated-screenshots/core/cat-results.webp",
    LEGACY_FALLBACKS.catReadiness,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  coreAnalytics: generated(
    "coreAnalytics",
    "/marketing/generated-screenshots/core/confidence-analytics.webp",
    LEGACY_FALLBACKS.analytics,
    {
      component: "TierValueExperience",
      pages: ["/pricing"],
      status: "needs-authenticated-capture",
    },
  ),
  marketingHome: generated(
    "marketingHome",
    "/marketing/generated-screenshots/marketing/marketing-home-desktop.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/", "/pricing"],
    },
  ),
  marketingPricing: generated(
    "marketingPricing",
    "/marketing/generated-screenshots/marketing/pricing.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/pricing"],
    },
  ),
  marketingFaq: generated(
    "marketingFaq",
    "/marketing/generated-screenshots/marketing/faq.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "GeneratedMarketingScreenshotRegistry",
      pages: ["/faq"],
    },
  ),
  rnMarketingHub: generated(
    "rnMarketingHub",
    "/marketing/generated-screenshots/marketing/rn-marketing-hub.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/us/rn/nclex-rn"],
    },
  ),
  rnQuestionsMarketing: generated(
    "rnQuestionsMarketing",
    "/marketing/generated-screenshots/marketing/rn-questions-marketing.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/us/rn/nclex-rn/questions"],
    },
  ),
  rnLessonsMarketing: generated(
    "rnLessonsMarketing",
    "/marketing/generated-screenshots/marketing/rn-lessons-marketing.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/us/rn/nclex-rn/lessons"],
    },
  ),
  pnMarketingHub: generated(
    "pnMarketingHub",
    "/marketing/generated-screenshots/marketing/pn-marketing-hub.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/canada/pn/rex-pn"],
    },
  ),
  npMarketingHub: generated(
    "npMarketingHub",
    "/marketing/generated-screenshots/marketing/np-marketing-hub.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/canada/np/cnple"],
    },
  ),
  alliedMarketingHub: generated(
    "alliedMarketingHub",
    "/marketing/generated-screenshots/marketing/allied-marketing-hub.webp",
    LEGACY_FALLBACKS.dashboard,
    {
      component: "TierValueExperience",
      pages: ["/pricing", "/allied/allied-health"],
    },
  ),
  newGradMarketingHub: generated(
    "newGradMarketingHub",
    "/marketing/generated-screenshots/marketing/new-grad-marketing-hub.webp",
    LEGACY_FALLBACKS.dashboard,
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
  rnCat: generated("rnCat", "/marketing/generated-screenshots/rn/rn-cat-exam.webp", LEGACY_FALLBACKS.cat, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  pnCat: generated("pnCat", "/marketing/generated-screenshots/pn/pn-cat.webp", LEGACY_FALLBACKS.cat, {
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
  npAnalytics: generated("npAnalytics", "/marketing/generated-screenshots/np/np-advanced-analytics.webp", LEGACY_FALLBACKS.analytics, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
  newGradReadiness: generated("newGradReadiness", "/marketing/generated-screenshots/newgrad/newgrad-readiness.webp", LEGACY_FALLBACKS.readiness, {
    component: "TierValueExperience",
    pages: ["/pricing"],
    status: "needs-authenticated-capture",
  }),
} as const satisfies Record<GeneratedScreenshotKey, GeneratedScreenshotRecord>;

export const GENERATED_SCREENSHOT_PATHS = Object.fromEntries(
  Object.entries(GENERATED_SCREENSHOT_REGISTRY).map(([key, value]) => [key, value.path]),
) as Record<GeneratedScreenshotKey, string>;

export const GENERATED_SCREENSHOT_FALLBACKS = Object.fromEntries(
  Object.entries(GENERATED_SCREENSHOT_REGISTRY).map(([key, value]) => [key, value.fallbackPath]),
) as Record<GeneratedScreenshotKey, string>;

export function generatedScreenshotInventory(): GeneratedScreenshotRecord[] {
  return Object.values(GENERATED_SCREENSHOT_REGISTRY);
}
