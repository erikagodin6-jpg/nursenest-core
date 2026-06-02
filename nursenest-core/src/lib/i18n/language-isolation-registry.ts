export type LanguagePublicationStatus = "published" | "preview" | "disabled";
export type LanguageTranslationStatus = "complete" | "partial" | "not-started";
export type LanguageSeoStatus = "indexable" | "noindex";
export type LanguageIndexingStatus = "index-follow" | "noindex-nofollow";

export type IsolatedLanguageConfig = {
  languageCode: string;
  internalLocale: string;
  englishName: string;
  nativeName: string;
  subdomain: string;
  origin: string;
  hreflang: string;
  featureFlag: string;
  status: "production" | "planned";
  publicationStatus: LanguagePublicationStatus;
  translationStatus: LanguageTranslationStatus;
  seoStatus: LanguageSeoStatus;
  indexingStatus: LanguageIndexingStatus;
  completionPercent: number;
};

const ROOT_DOMAIN = "nursenest.ca";

function languageOrigin(subdomain: string): string {
  return `https://${subdomain}`;
}

export const ISOLATED_LANGUAGE_REGISTRY = [
  {
    languageCode: "en",
    internalLocale: "en",
    englishName: "English",
    nativeName: "English",
    subdomain: ROOT_DOMAIN,
    origin: "https://nursenest.ca",
    hreflang: "en-CA",
    featureFlag: "ENABLE_ENGLISH",
    status: "production",
    publicationStatus: "published",
    translationStatus: "complete",
    seoStatus: "indexable",
    indexingStatus: "index-follow",
    completionPercent: 100,
  },
  {
    languageCode: "fr",
    internalLocale: "fr",
    englishName: "French",
    nativeName: "Francais",
    subdomain: "fr.nursenest.ca",
    origin: languageOrigin("fr.nursenest.ca"),
    hreflang: "fr-CA",
    featureFlag: "ENABLE_FRENCH",
    status: "planned",
    publicationStatus: "preview",
    translationStatus: "partial",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "es",
    internalLocale: "es",
    englishName: "Spanish",
    nativeName: "Espanol",
    subdomain: "es.nursenest.ca",
    origin: languageOrigin("es.nursenest.ca"),
    hreflang: "es",
    featureFlag: "ENABLE_SPANISH",
    status: "planned",
    publicationStatus: "preview",
    translationStatus: "partial",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "hi",
    internalLocale: "hi",
    englishName: "Hindi",
    nativeName: "Hindi",
    subdomain: "hi.nursenest.ca",
    origin: languageOrigin("hi.nursenest.ca"),
    hreflang: "hi",
    featureFlag: "ENABLE_HINDI",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "partial",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "pt",
    internalLocale: "pt",
    englishName: "Portuguese",
    nativeName: "Portugues",
    subdomain: "pt.nursenest.ca",
    origin: languageOrigin("pt.nursenest.ca"),
    hreflang: "pt",
    featureFlag: "ENABLE_PORTUGUESE",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "partial",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "ar",
    internalLocale: "ar",
    englishName: "Arabic",
    nativeName: "Arabic",
    subdomain: "ar.nursenest.ca",
    origin: languageOrigin("ar.nursenest.ca"),
    hreflang: "ar",
    featureFlag: "ENABLE_ARABIC",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "de",
    internalLocale: "de",
    englishName: "German",
    nativeName: "Deutsch",
    subdomain: "de.nursenest.ca",
    origin: languageOrigin("de.nursenest.ca"),
    hreflang: "de",
    featureFlag: "ENABLE_GERMAN",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "ja",
    internalLocale: "ja",
    englishName: "Japanese",
    nativeName: "Japanese",
    subdomain: "jp.nursenest.ca",
    origin: languageOrigin("jp.nursenest.ca"),
    hreflang: "ja",
    featureFlag: "ENABLE_JAPANESE",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "ko",
    internalLocale: "ko",
    englishName: "Korean",
    nativeName: "Korean",
    subdomain: "ko.nursenest.ca",
    origin: languageOrigin("ko.nursenest.ca"),
    hreflang: "ko",
    featureFlag: "ENABLE_KOREAN",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "zh",
    internalLocale: "zh",
    englishName: "Chinese Simplified",
    nativeName: "Simplified Chinese",
    subdomain: "zh.nursenest.ca",
    origin: languageOrigin("zh.nursenest.ca"),
    hreflang: "zh-Hans",
    featureFlag: "ENABLE_CHINESE_SIMPLIFIED",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "zh-tw",
    internalLocale: "zh-tw",
    englishName: "Chinese Traditional",
    nativeName: "Traditional Chinese",
    subdomain: "zh-tw.nursenest.ca",
    origin: languageOrigin("zh-tw.nursenest.ca"),
    hreflang: "zh-Hant",
    featureFlag: "ENABLE_CHINESE_TRADITIONAL",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "it",
    internalLocale: "it",
    englishName: "Italian",
    nativeName: "Italiano",
    subdomain: "it.nursenest.ca",
    origin: languageOrigin("it.nursenest.ca"),
    hreflang: "it",
    featureFlag: "ENABLE_ITALIAN",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "not-started",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
  {
    languageCode: "tl",
    internalLocale: "tl",
    englishName: "Tagalog",
    nativeName: "Tagalog",
    subdomain: "tl.nursenest.ca",
    origin: languageOrigin("tl.nursenest.ca"),
    hreflang: "tl",
    featureFlag: "ENABLE_TAGALOG",
    status: "planned",
    publicationStatus: "disabled",
    translationStatus: "partial",
    seoStatus: "noindex",
    indexingStatus: "noindex-nofollow",
    completionPercent: 0,
  },
] as const satisfies readonly IsolatedLanguageConfig[];

export type IsolatedLanguageCode = (typeof ISOLATED_LANGUAGE_REGISTRY)[number]["languageCode"];

export const DEFAULT_ISOLATED_LANGUAGE_CODE = "en" as const;

export function getIsolatedLanguageConfig(languageCode: string): IsolatedLanguageConfig | null {
  return ISOLATED_LANGUAGE_REGISTRY.find((language) => language.languageCode === languageCode) ?? null;
}

export function getIsolatedLanguageConfigByInternalLocale(internalLocale: string): IsolatedLanguageConfig | null {
  return ISOLATED_LANGUAGE_REGISTRY.find((language) => language.internalLocale === internalLocale) ?? null;
}

export function getIsolatedLanguageConfigBySubdomain(host: string): IsolatedLanguageConfig | null {
  const normalized = host.split(":")[0]?.trim().toLowerCase() ?? "";
  return ISOLATED_LANGUAGE_REGISTRY.find((language) => language.subdomain === normalized) ?? null;
}

export function isIsolatedLanguageEnabled(languageCode: string): boolean {
  const language = getIsolatedLanguageConfig(languageCode);
  if (!language) return false;
  if (language.languageCode === DEFAULT_ISOLATED_LANGUAGE_CODE) return true;
  return process.env[language.featureFlag] === "true";
}

export function isIsolatedLanguageIndexable(languageCode: string): boolean {
  const language = getIsolatedLanguageConfig(languageCode);
  return Boolean(language && language.seoStatus === "indexable" && language.publicationStatus === "published");
}

export function getIndexableIsolatedLanguageCodes(): readonly string[] {
  return ISOLATED_LANGUAGE_REGISTRY.filter((language) => isIsolatedLanguageIndexable(language.languageCode)).map(
    (language) => language.languageCode,
  );
}

export function getPubliclyEnabledIsolatedLanguageCodes(): readonly string[] {
  return ISOLATED_LANGUAGE_REGISTRY.filter((language) => isIsolatedLanguageEnabled(language.languageCode)).map(
    (language) => language.languageCode,
  );
}

export function isIsolatedLanguageSubdomainHost(host: string | null | undefined): boolean {
  return Boolean(host && getIsolatedLanguageConfigBySubdomain(host));
}

