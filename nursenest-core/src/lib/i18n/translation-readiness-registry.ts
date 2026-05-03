export type TranslationSurfaceType =
  | "marketing-chrome"
  | "homepage"
  | "pricing"
  | "exam-pathway-hub"
  | "lesson-library"
  | "lesson-detail"
  | "flashcards"
  | "practice-questions"
  | "cat"
  | "learner-dashboard"
  | "report-card"
  | "printable-store"
  | "blog-hub"
  | "blog-detail"
  | "auth-account";

export type TranslationFallbackPolicy = "english-ok-noindex" | "block-indexing" | "no-fallback";

export type TranslationReadinessSurface = {
  surfaceType: TranslationSurfaceType;
  routePatterns: readonly string[];
  requiredMessageNamespaces: readonly string[];
  requiredShards: readonly string[];
  requiredSeoFields: readonly string[];
  requiredJsonLdFields: readonly string[];
  indexable: boolean;
  fallbackPolicy: TranslationFallbackPolicy;
  priority: "rex-pn" | "learner" | "marketing" | "global";
};

export const REQUIRED_SEO_FIELDS = ["title", "description", "canonical", "openGraph.title", "openGraph.description", "twitter.title", "twitter.description"] as const;

export const REQUIRED_JSON_LD_FIELDS = ["name", "headline", "description", "inLanguage"] as const;

export const TRANSLATION_READINESS_REGISTRY: readonly TranslationReadinessSurface[] = [
  {
    surfaceType: "marketing-chrome",
    routePatterns: ["/*", "/fr/*"],
    requiredMessageNamespaces: ["nav.", "footer.", "brand.", "common."],
    requiredShards: ["nav", "brand", "common"],
    requiredSeoFields: [],
    requiredJsonLdFields: [],
    indexable: false,
    fallbackPolicy: "no-fallback",
    priority: "marketing",
  },
  {
    surfaceType: "homepage",
    routePatterns: ["/", "/fr"],
    requiredMessageNamespaces: ["pages.home.", "nav.", "footer.", "brand."],
    requiredShards: ["pages", "nav", "brand", "marketing"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "marketing",
  },
  {
    surfaceType: "pricing",
    routePatterns: ["/pricing", "/fr/pricing", "/*/*/*/pricing"],
    requiredMessageNamespaces: ["pages.pricing.", "pricing.", "billing.", "nav.", "footer."],
    requiredShards: ["pages", "billing", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "rex-pn",
  },
  {
    surfaceType: "exam-pathway-hub",
    routePatterns: ["/canada/pn/rex-pn", "/us/rn/nclex-rn", "/canada/rn/nclex-rn", "/us/pn/nclex-pn", "/us/np/*", "/canada/np/*", "/allied-health", "/new-grad"],
    requiredMessageNamespaces: ["pages.exam", "pages.pathway", "nav.", "footer.", "marketing."],
    requiredShards: ["pages", "marketing", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "rex-pn",
  },
  {
    surfaceType: "lesson-library",
    routePatterns: ["/lessons", "/fr/lessons", "/*/*/*/lessons"],
    requiredMessageNamespaces: ["pages.lessons.", "lessons.", "lesson.", "nav.", "footer."],
    requiredShards: ["pages", "learner", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "rex-pn",
  },
  {
    surfaceType: "lesson-detail",
    routePatterns: ["/*/*/*/lessons/*", "/fr/*/*/*/lessons/*"],
    requiredMessageNamespaces: ["lesson.", "lessons.", "pages.lesson", "nav.", "footer."],
    requiredShards: ["pages", "learner", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: ["name", "headline", "description", "articleBody", "inLanguage"],
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "rex-pn",
  },
  {
    surfaceType: "flashcards",
    routePatterns: ["/app/flashcards", "/fr/flashcards", "/*/*/*/flashcards"],
    requiredMessageNamespaces: ["flashcards.", "pages.flashcards.", "nav."],
    requiredShards: ["learner", "pages", "nav", "common"],
    requiredSeoFields: ["title", "description"],
    requiredJsonLdFields: [],
    indexable: false,
    fallbackPolicy: "english-ok-noindex",
    priority: "learner",
  },
  {
    surfaceType: "practice-questions",
    routePatterns: ["/question-bank", "/fr/question-bank", "/*/*/*/questions"],
    requiredMessageNamespaces: ["questions.", "practice.", "pages.questionBank.", "nav.", "footer."],
    requiredShards: ["pages", "learner", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "rex-pn",
  },
  {
    surfaceType: "cat",
    routePatterns: ["/*/*/*/cat", "/app/practice-tests/cat-launch"],
    requiredMessageNamespaces: ["cat.", "adaptive.", "practice.", "nav."],
    requiredShards: ["learner", "pages", "nav", "common"],
    requiredSeoFields: ["title", "description"],
    requiredJsonLdFields: [],
    indexable: false,
    fallbackPolicy: "english-ok-noindex",
    priority: "learner",
  },
  {
    surfaceType: "learner-dashboard",
    routePatterns: ["/app", "/app/dashboard"],
    requiredMessageNamespaces: ["dashboard.", "learner.", "nav."],
    requiredShards: ["learner", "nav", "common"],
    requiredSeoFields: [],
    requiredJsonLdFields: [],
    indexable: false,
    fallbackPolicy: "no-fallback",
    priority: "learner",
  },
  {
    surfaceType: "report-card",
    routePatterns: ["/app/report-card", "/app/account/progress"],
    requiredMessageNamespaces: ["reportCard.", "progress.", "dashboard."],
    requiredShards: ["learner", "pages", "common"],
    requiredSeoFields: [],
    requiredJsonLdFields: [],
    indexable: false,
    fallbackPolicy: "no-fallback",
    priority: "learner",
  },
  {
    surfaceType: "printable-store",
    routePatterns: ["/store", "/fr/store", "/app/printables"],
    requiredMessageNamespaces: ["store.", "printables.", "pricing.", "nav.", "footer."],
    requiredShards: ["pages", "billing", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "global",
  },
  {
    surfaceType: "blog-hub",
    routePatterns: ["/blog", "/fr/blog", "/*/*/*/*/blog"],
    requiredMessageNamespaces: ["blog.", "pages.blog.", "nav.", "footer."],
    requiredShards: ["pages", "marketing", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: REQUIRED_JSON_LD_FIELDS,
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "global",
  },
  {
    surfaceType: "blog-detail",
    routePatterns: ["/blog/*", "/fr/blog/*", "/*/*/*/*/blog/*"],
    requiredMessageNamespaces: ["blog.", "pages.blog.", "nav.", "footer."],
    requiredShards: ["pages", "marketing", "nav", "common"],
    requiredSeoFields: REQUIRED_SEO_FIELDS,
    requiredJsonLdFields: ["headline", "description", "articleBody", "inLanguage"],
    indexable: true,
    fallbackPolicy: "block-indexing",
    priority: "global",
  },
  {
    surfaceType: "auth-account",
    routePatterns: ["/login", "/fr/login", "/signup", "/fr/signup", "/account", "/app/account/*"],
    requiredMessageNamespaces: ["auth.", "account.", "nav.", "common."],
    requiredShards: ["auth", "learner", "nav", "common"],
    requiredSeoFields: ["title", "description"],
    requiredJsonLdFields: [],
    indexable: false,
    fallbackPolicy: "no-fallback",
    priority: "learner",
  },
] as const;

function patternToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, "[^/]+");
  return new RegExp(`^${escaped}/?$`);
}

export function getTranslationSurfaceForPath(pathname: string): TranslationReadinessSurface {
  const normalized = pathname.split("?")[0]?.replace(/\/+$/, "") || "/";
  return (
    TRANSLATION_READINESS_REGISTRY.find((surface) =>
      surface.surfaceType !== "marketing-chrome" &&
      surface.routePatterns.some((pattern) => patternToRegExp(pattern).test(normalized)),
    ) ?? TRANSLATION_READINESS_REGISTRY[0]
  );
}

export function requiredShardFilesForSurface(surfaceType: TranslationSurfaceType): readonly string[] {
  return TRANSLATION_READINESS_REGISTRY.find((surface) => surface.surfaceType === surfaceType)?.requiredShards ?? [];
}
