export const SUPPORTED_LOCALES = [
  "en", "fr", "es", "fil", "hi", "zh", "zh-tw", "ar", "ko", "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id"
] as const;

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: SupportedLocale = "en";

export const SUPPORTED_LOCALES_SET = new Set<string>(SUPPORTED_LOCALES);

export function isValidLocale(str: string): str is SupportedLocale {
  return SUPPORTED_LOCALES_SET.has(str);
}

export const HREFLANG_MAP: Record<string, string> = {
  en: "en-ca", fr: "fr-ca", es: "es", fil: "fil", hi: "hi",
  zh: "zh", "zh-tw": "zh-TW", ar: "ar", ko: "ko", pt: "pt", pa: "pa",
  vi: "vi", ht: "ht", ur: "ur", ja: "ja", fa: "fa",
  de: "de", th: "th", tr: "tr", id: "id",
};

export const LOCALE_LANGUAGE_MAP: Record<string, string> = {
  en: "en-CA", fr: "fr-CA", es: "es", fil: "fil", hi: "hi",
  zh: "zh", "zh-tw": "zh-TW", ar: "ar", ko: "ko", pt: "pt", pa: "pa",
  vi: "vi", ht: "ht", ur: "ur", ja: "ja", fa: "fa",
  de: "de", th: "th", tr: "tr", id: "id",
};

export const RTL_LOCALES = new Set(["ar", "ur", "fa"]);

export function getLocaleDirection(locale: string): "ltr" | "rtl" {
  return RTL_LOCALES.has(locale) ? "rtl" : "ltr";
}

export function getHreflangCode(locale: string): string {
  return HREFLANG_MAP[locale] || locale;
}

export function getMainSiteDomain(): string {
  if (typeof process !== "undefined" && process.env?.SITE_DOMAIN) {
    return process.env.SITE_DOMAIN;
  }
  return "https://www.nursenest.ca";
}
