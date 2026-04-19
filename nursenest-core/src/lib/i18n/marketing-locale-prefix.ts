const DEFAULT_MARKETING_LOCALE = "en" as const;

const MARKETING_LOCALE_CODES = [
  "en",
  "fr",
  "es",
  "tl",
  "hi",
  "ta",
  "te",
  "bn",
  "mr",
  "gu",
  "zh",
  "zh-tw",
  "ar",
  "ko",
  "pt",
  "pa",
  "vi",
  "ht",
  "ur",
  "ja",
  "fa",
  "de",
  "th",
  "tr",
  "id",
  "it",
  "hu",
  "ru",
] as const;

function isMarketingLocaleCode(segment: string): boolean {
  return (MARKETING_LOCALE_CODES as readonly string[]).includes(segment);
}

export function stripMarketingLocalePrefix(pathname: string): { locale: string; pathname: string } {
  const p = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const parts = p.split("/").filter(Boolean);
  const first = parts[0];
  if (first && isMarketingLocaleCode(first) && first !== DEFAULT_MARKETING_LOCALE) {
    const rest = parts.length > 1 ? `/${parts.slice(1).join("/")}` : "/";
    return { locale: first, pathname: rest };
  }
  return { locale: DEFAULT_MARKETING_LOCALE, pathname: p === "" ? "/" : p };
}
