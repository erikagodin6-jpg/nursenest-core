import {
  DEFAULT_ISOLATED_LANGUAGE_CODE,
  getIsolatedLanguageConfig,
  getIsolatedLanguageConfigByInternalLocale,
  getIsolatedLanguageConfigBySubdomain,
  ISOLATED_LANGUAGE_REGISTRY,
  type IsolatedLanguageCode,
} from "@/lib/i18n/language-isolation-registry";

export type LanguageSubdomainLocale = IsolatedLanguageCode;

export type LanguageSubdomainConfig = {
  locale: LanguageSubdomainLocale;
  hreflang: string;
  host: string;
  origin: string;
  internalLocalePrefix: string;
  publicationStatus: "published" | "preview" | "disabled";
};

export const LANGUAGE_SUBDOMAIN_CONFIG = Object.fromEntries(
  ISOLATED_LANGUAGE_REGISTRY.map((language) => [
    language.internalLocale,
    {
      locale: language.internalLocale,
      hreflang: language.hreflang,
      host: language.subdomain,
      origin: language.origin,
      internalLocalePrefix: language.internalLocale === DEFAULT_ISOLATED_LANGUAGE_CODE ? "" : `/${language.internalLocale}`,
      publicationStatus: language.publicationStatus,
    },
  ]),
) as Record<LanguageSubdomainLocale, LanguageSubdomainConfig>;

export const LANGUAGE_SUBDOMAIN_LOCALES = Object.keys(LANGUAGE_SUBDOMAIN_CONFIG) as LanguageSubdomainLocale[];
export const PREVIEW_LANGUAGE_SUBDOMAIN_LOCALES = LANGUAGE_SUBDOMAIN_LOCALES.filter(
  (locale) => LANGUAGE_SUBDOMAIN_CONFIG[locale].publicationStatus !== "published",
);

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed || trimmed === "/") return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

export function normalizeRequestHost(host: string | null | undefined): string {
  return (host ?? "").split(":")[0]?.trim().toLowerCase() ?? "";
}

export function localeFromLanguageSubdomainHost(host: string | null | undefined): LanguageSubdomainLocale | null {
  const language = getIsolatedLanguageConfigBySubdomain(normalizeRequestHost(host));
  return language?.internalLocale ?? null;
}

export function isPreviewLanguageSubdomainLocale(locale: string): boolean {
  const language = getIsolatedLanguageConfigByInternalLocale(locale) ?? getIsolatedLanguageConfig(locale);
  return Boolean(language && language.internalLocale !== DEFAULT_ISOLATED_LANGUAGE_CODE);
}

export function publicPathForLanguageSubdomain(locale: string, enPath: string): string {
  const path = normalizePath(enPath);
  if (locale === DEFAULT_ISOLATED_LANGUAGE_CODE) return path;
  if (!isPreviewLanguageSubdomainLocale(locale)) return path;
  const prefix = `/${locale}`;
  if (path === prefix) return "/";
  if (path.startsWith(`${prefix}/`)) return path.slice(prefix.length) || "/";
  return path;
}

export function internalPathForLanguageSubdomain(locale: string, publicPath: string): string {
  const path = normalizePath(publicPath);
  if (!isPreviewLanguageSubdomainLocale(locale)) return path;
  const prefix = `/${locale}`;
  if (path === prefix || path.startsWith(`${prefix}/`)) return path;
  return path === "/" ? prefix : `${prefix}${path}`;
}

export function languageOriginForLocale(locale: string): string {
  const language = getIsolatedLanguageConfigByInternalLocale(locale) ?? getIsolatedLanguageConfig(locale);
  return language?.origin ?? LANGUAGE_SUBDOMAIN_CONFIG.en.origin;
}

export function absoluteLanguageUrl(locale: string, enPath: string): string {
  const origin = languageOriginForLocale(locale).replace(/\/$/, "");
  return `${origin}${publicPathForLanguageSubdomain(locale, enPath)}`;
}
