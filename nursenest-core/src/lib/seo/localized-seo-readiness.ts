import { getHreflangEligibleLocales, isLocaleSeoIndexable, isLocaleSitemapIncluded } from "@/lib/i18n/language-readiness";
import { MARKETING_LANGUAGES } from "@/lib/i18n/marketing-languages";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import {
  absoluteMarketingCanonical,
  marketingCanonicalPathForLocale,
  marketingHreflangLanguagesForEnPath,
} from "@/lib/seo/marketing-alternates";

export type LocalizedSeoSurfaceType =
  | "homepage"
  | "pricing"
  | "rn-hub"
  | "rex-pn-hub"
  | "np-hub"
  | "allied-hub"
  | "new-grad-hub"
  | "lessons-hub"
  | "practice-questions-hub"
  | "flashcards-hub";

export type LocalizedSeoSurface = {
  surfaceType: LocalizedSeoSurfaceType;
  englishPath: string;
  internalRouteId: string;
  indexable: boolean;
  supportsLocalizedSlug: boolean;
  supportsLocalizedRoute: boolean;
  requiredMetadataFields: readonly string[];
  requiredJsonLdFields: readonly string[];
};

export type LocalizedSeoAuditItem = {
  locale: string;
  surfaceType: LocalizedSeoSurfaceType;
  englishPath: string;
  localizedPath: string;
  canonical: string;
  localizedSlugSupported: boolean;
  localizedSlug?: string;
  localizedRouteSupported: boolean;
  sitemapExpected: boolean;
  hreflangExpected: boolean;
  hreflangLanguages: Record<string, string>;
  breadcrumbs: Array<{ label: string; href: string }>;
  metadataFields: readonly string[];
  jsonLdFields: readonly string[];
  issues: string[];
  recommendedFix: string;
};

export const LOCALIZED_SEO_SURFACES: readonly LocalizedSeoSurface[] = [
  {
    surfaceType: "homepage",
    englishPath: "/",
    internalRouteId: "marketing.home",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: true,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description", "twitter.title", "twitter.description"],
    requiredJsonLdFields: ["name", "description", "inLanguage"],
  },
  {
    surfaceType: "pricing",
    englishPath: "/pricing",
    internalRouteId: "marketing.pricing",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: true,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "inLanguage", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "rn-hub",
    englishPath: "/canada/rn/nclex-rn",
    internalRouteId: "pathway.ca-rn-nclex-rn",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: false,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "rex-pn-hub",
    englishPath: "/canada/pn/rex-pn",
    internalRouteId: "pathway.ca-rpn-rex-pn",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: false,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "np-hub",
    englishPath: "/canada/np/cnple",
    internalRouteId: "pathway.ca-np-cnpe",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: false,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "allied-hub",
    englishPath: "/allied-health",
    internalRouteId: "marketing.allied-health",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: false,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "new-grad-hub",
    englishPath: "/new-grad",
    internalRouteId: "marketing.new-grad",
    indexable: true,
    supportsLocalizedSlug: false,
    supportsLocalizedRoute: false,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "lessons-hub",
    englishPath: "/lessons",
    internalRouteId: "marketing.lessons",
    indexable: true,
    supportsLocalizedSlug: true,
    supportsLocalizedRoute: true,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "inLanguage", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "practice-questions-hub",
    englishPath: "/question-bank",
    internalRouteId: "marketing.question-bank",
    indexable: true,
    supportsLocalizedSlug: true,
    supportsLocalizedRoute: true,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "inLanguage", "BreadcrumbList.itemListElement.name"],
  },
  {
    surfaceType: "flashcards-hub",
    englishPath: "/flashcards",
    internalRouteId: "marketing.flashcards",
    indexable: true,
    supportsLocalizedSlug: true,
    supportsLocalizedRoute: false,
    requiredMetadataFields: ["title", "description", "openGraph.title", "openGraph.description"],
    requiredJsonLdFields: ["name", "description", "inLanguage", "BreadcrumbList.itemListElement.name"],
  },
] as const;

export const LOCALIZED_SLUG_TRANSLATIONS: Record<string, Record<string, string>> = {
  fr: {
    "practice-questions": "questions-pratiques",
    flashcards: "cartes-memoire",
    lessons: "lecons",
    pricing: "tarifs",
    "nursing-exam-prep": "preparation-examens-soins-infirmiers",
  },
  es: {
    "practice-questions": "preguntas-de-practica",
    flashcards: "tarjetas-de-memoria",
    lessons: "lecciones",
    pricing: "precios",
    "nursing-exam-prep": "preparacion-examenes-enfermeria",
  },
  hi: {
    "practice-questions": "practice-prashn",
    flashcards: "flashcards",
    lessons: "paath",
    pricing: "keematein",
    "nursing-exam-prep": "nursing-pariksha-taiyari",
  },
  tl: {
    "practice-questions": "mga-practice-questions",
    flashcards: "flashcards",
    lessons: "mga-aralin",
    pricing: "presyo",
    "nursing-exam-prep": "paghahanda-nursing-exams",
  },
  pt: {
    "practice-questions": "questoes-de-pratica",
    flashcards: "cartoes-de-estudo",
    lessons: "licoes",
    pricing: "precos",
    "nursing-exam-prep": "preparacao-exames-enfermagem",
  },
};

export const LOCALIZED_BREADCRUMB_LABELS: Record<string, Record<LocalizedSeoSurfaceType | "home", string>> = {
  en: {
    home: "Home",
    homepage: "Home",
    pricing: "Pricing",
    "rn-hub": "RN",
    "rex-pn-hub": "REx-PN",
    "np-hub": "NP",
    "allied-hub": "Allied Health",
    "new-grad-hub": "New Grad",
    "lessons-hub": "Lessons",
    "practice-questions-hub": "Practice Questions",
    "flashcards-hub": "Flashcards",
  },
  fr: {
    home: "Accueil",
    homepage: "Accueil",
    pricing: "Tarifs",
    "rn-hub": "IA",
    "rex-pn-hub": "REx-PN",
    "np-hub": "IPS",
    "allied-hub": "Santé alliée",
    "new-grad-hub": "Nouvelle diplômée",
    "lessons-hub": "Leçons",
    "practice-questions-hub": "Questions pratiques",
    "flashcards-hub": "Cartes mémoire",
  },
  es: {
    home: "Inicio",
    homepage: "Inicio",
    pricing: "Precios",
    "rn-hub": "RN",
    "rex-pn-hub": "REx-PN",
    "np-hub": "NP",
    "allied-hub": "Salud aliada",
    "new-grad-hub": "Recién graduado/a",
    "lessons-hub": "Lecciones",
    "practice-questions-hub": "Preguntas de práctica",
    "flashcards-hub": "Tarjetas de memoria",
  },
  hi: {
    home: "होम",
    homepage: "होम",
    pricing: "कीमतें",
    "rn-hub": "RN",
    "rex-pn-hub": "REx-PN",
    "np-hub": "NP",
    "allied-hub": "Allied Health",
    "new-grad-hub": "नया स्नातक",
    "lessons-hub": "पाठ",
    "practice-questions-hub": "प्रैक्टिस प्रश्न",
    "flashcards-hub": "फ्लैशकार्ड",
  },
  tl: {
    home: "Home",
    homepage: "Home",
    pricing: "Presyo",
    "rn-hub": "RN",
    "rex-pn-hub": "REx-PN",
    "np-hub": "NP",
    "allied-hub": "Allied Health",
    "new-grad-hub": "Bagong graduate",
    "lessons-hub": "Mga aralin",
    "practice-questions-hub": "Mga practice questions",
    "flashcards-hub": "Flashcards",
  },
  pt: {
    home: "Início",
    homepage: "Início",
    pricing: "Preços",
    "rn-hub": "RN",
    "rex-pn-hub": "REx-PN",
    "np-hub": "NP",
    "allied-hub": "Saúde aliada",
    "new-grad-hub": "Recém-formado(a)",
    "lessons-hub": "Lições",
    "practice-questions-hub": "Questões de prática",
    "flashcards-hub": "Cartões de estudo",
  },
};

function pathLeaf(path: string): string {
  return path.split("/").filter(Boolean).at(-1) ?? "";
}

export function localizedSlugFor(locale: string, englishSlug: string): string | null {
  const slugKey = englishSlug === "question-bank" ? "practice-questions" : englishSlug;
  return LOCALIZED_SLUG_TRANSLATIONS[locale]?.[slugKey] ?? null;
}

export function localizedBreadcrumbsFor(locale: string, surface: LocalizedSeoSurface): Array<{ label: string; href: string }> {
  const labels = LOCALIZED_BREADCRUMB_LABELS[locale] ?? LOCALIZED_BREADCRUMB_LABELS.en;
  const homeHref = marketingCanonicalPathForLocale(locale, "/");
  if (surface.surfaceType === "homepage") return [{ label: labels.home, href: homeHref }];
  return [
    { label: labels.home, href: homeHref },
    { label: labels[surface.surfaceType], href: marketingCanonicalPathForLocale(locale, surface.englishPath) },
  ];
}

export function buildLocalizedSeoAuditItem(locale: string, surface: LocalizedSeoSurface): LocalizedSeoAuditItem {
  const localizedPath = marketingCanonicalPathForLocale(locale, surface.englishPath);
  const localizedSlug = localizedSlugFor(locale, pathLeaf(surface.englishPath)) ?? undefined;
  const localeIsDefault = locale === DEFAULT_MARKETING_LOCALE;
  const localeIndexable = isLocaleSeoIndexable(locale);
  const hasLocalizedBreadcrumbLabels = localeIsDefault || LOCALIZED_BREADCRUMB_LABELS[locale] != null;
  const issues: string[] = [];

  if (!hasLocalizedBreadcrumbLabels) {
    issues.push("missing localized breadcrumb labels; falling back to English would create mixed-language SEO");
  }
  if (!localeIsDefault && surface.supportsLocalizedSlug && !localizedSlug) {
    issues.push(`missing localized slug mapping for ${pathLeaf(surface.englishPath)}`);
  }
  if (!localeIsDefault && surface.supportsLocalizedSlug && localizedSlug && !surface.supportsLocalizedRoute) {
    issues.push("localized slug translation exists but the route does not safely support translated slugs yet");
  }
  if (!localeIsDefault && !surface.supportsLocalizedRoute) {
    issues.push("localized route not supported; do not emit locale-prefixed canonical/sitemap URL for this surface");
  }
  if (!localeIsDefault && surface.indexable && !localeIndexable) {
    issues.push(`locale is not SEO-indexable yet; keep noindex and omit from sitemap`);
  }

  const sitemapExpected = surface.indexable && isLocaleSitemapIncluded(locale) && surface.supportsLocalizedRoute;
  const hreflangExpected = surface.indexable && getHreflangEligibleLocales().includes(locale) && surface.supportsLocalizedRoute;

  return {
    locale,
    surfaceType: surface.surfaceType,
    englishPath: surface.englishPath,
    localizedPath,
    canonical: absoluteMarketingCanonical(locale, surface.englishPath),
    localizedSlugSupported: surface.supportsLocalizedSlug,
    localizedSlug,
    localizedRouteSupported: surface.supportsLocalizedRoute,
    sitemapExpected,
    hreflangExpected,
    hreflangLanguages: marketingHreflangLanguagesForEnPath(surface.englishPath),
    breadcrumbs: localizedBreadcrumbsFor(locale, surface),
    metadataFields: surface.requiredMetadataFields,
    jsonLdFields: surface.requiredJsonLdFields,
    issues,
    recommendedFix:
      issues.length === 0
        ? "Localized SEO policy passed for this surface."
        : "Complete translations and add route-level localized slug support before exposing this page as indexable.",
  };
}

export function buildLocalizedSeoAudit(locales: readonly string[] = getLocalizedSeoAuditLocales()): LocalizedSeoAuditItem[] {
  return locales.flatMap((locale) => LOCALIZED_SEO_SURFACES.map((surface) => buildLocalizedSeoAuditItem(locale, surface)));
}

export function getLocalizedSeoAuditLocales(): readonly string[] {
  const supported = MARKETING_LANGUAGES.filter((language) => language.tier === "full" || language.tier === "partial").map(
    (language) => language.code,
  );
  return supported.includes(DEFAULT_MARKETING_LOCALE) ? supported : [DEFAULT_MARKETING_LOCALE, ...supported];
}

export function duplicateLocalizedSlugs(locale: string): string[] {
  const values = Object.values(LOCALIZED_SLUG_TRANSLATIONS[locale] ?? {});
  const seen = new Set<string>();
  const dupes = new Set<string>();
  for (const value of values) {
    if (seen.has(value)) dupes.add(value);
    seen.add(value);
  }
  return [...dupes].sort();
}
