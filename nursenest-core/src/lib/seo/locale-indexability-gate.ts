import { getLanguageStatus, isLocaleSeoIndexable, localeRobotsOverride, type LocaleRobotsOverride } from "@/lib/i18n/language-readiness";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { getTranslationSurfaceForPath, type TranslationSurfaceType } from "@/lib/i18n/translation-readiness-registry";

export type TranslationReadinessDecisionInput = {
  locale: string;
  pathname: string;
  surfaceType?: TranslationSurfaceType;
  completionScore?: number;
  missingKeys?: readonly string[];
  englishLeakSuspicions?: readonly string[];
  untranslatedFields?: readonly string[];
  seoIssues?: readonly string[];
  jsonLdIssues?: readonly string[];
};

export type LocaleIndexabilityDecision = {
  locale: string;
  pathname: string;
  surfaceType: TranslationSurfaceType;
  indexable: boolean;
  shouldNoindex: boolean;
  sitemapEligible: boolean;
  hreflangEligible: boolean;
  robots: LocaleRobotsOverride | null;
  reason: string;
};

function hasBlockingIssues(input: TranslationReadinessDecisionInput): boolean {
  return Boolean(
    (input.missingKeys?.length ?? 0) > 0 ||
      (input.englishLeakSuspicions?.length ?? 0) > 0 ||
      (input.untranslatedFields?.length ?? 0) > 0 ||
      (input.seoIssues?.length ?? 0) > 0 ||
      (input.jsonLdIssues?.length ?? 0) > 0 ||
      (input.completionScore != null && input.completionScore < 100),
  );
}

export function decideLocaleIndexability(input: TranslationReadinessDecisionInput): LocaleIndexabilityDecision {
  const surface = input.surfaceType
    ? { ...getTranslationSurfaceForPath(input.pathname), surfaceType: input.surfaceType }
    : getTranslationSurfaceForPath(input.pathname);

  if (input.locale === DEFAULT_MARKETING_LOCALE) {
    return {
      locale: input.locale,
      pathname: input.pathname,
      surfaceType: surface.surfaceType,
      indexable: surface.indexable,
      shouldNoindex: !surface.indexable,
      sitemapEligible: surface.indexable,
      hreflangEligible: surface.indexable,
      robots: surface.indexable ? null : localeRobotsOverride(input.locale) ?? { index: false, follow: true },
      reason: surface.indexable ? "english-canonical-complete-by-policy" : "non-indexable-surface",
    };
  }

  const localeTierIndexable = isLocaleSeoIndexable(input.locale);
  const blockedByLocaleTier = !localeTierIndexable;
  const blockedBySurface = !surface.indexable;
  const blockedByReadiness = hasBlockingIssues(input);
  const indexable = surface.indexable && !blockedByLocaleTier && !blockedByReadiness;

  let reason = "translation-ready";
  if (blockedBySurface) reason = "non-indexable-surface";
  else if (blockedByLocaleTier) reason = `locale-tier-${getLanguageStatus(input.locale)}`;
  else if (blockedByReadiness) reason = "translation-incomplete";

  return {
    locale: input.locale,
    pathname: input.pathname,
    surfaceType: surface.surfaceType,
    indexable,
    shouldNoindex: !indexable,
    sitemapEligible: indexable,
    hreflangEligible: indexable,
    robots: indexable ? null : localeRobotsOverride(input.locale) ?? { index: false, follow: true },
    reason,
  };
}

export function isLocalePathIndexable(input: TranslationReadinessDecisionInput): boolean {
  return decideLocaleIndexability(input).indexable;
}

export function localeIndexabilityRobots(input: TranslationReadinessDecisionInput): LocaleRobotsOverride | null {
  return decideLocaleIndexability(input).robots;
}
