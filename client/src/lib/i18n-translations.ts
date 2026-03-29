import type { LanguageCode } from "./i18n-types";

const AVAILABLE_LANGS = new Set([
  "fr", "tl", "hi", "es", "zh", "zh-tw", "ar", "ko",
  "pt", "pa", "vi", "ht", "ur", "ja", "fa", "de", "th", "tr", "id",
]);

const loadedTranslations: Partial<Record<LanguageCode, Record<string, string>>> = {};

export async function loadLanguage(lang: LanguageCode): Promise<Record<string, string>> {
  if (loadedTranslations[lang]) return loadedTranslations[lang]!;

  const langKey = lang === "tl" ? "tl" : lang;
  if (!AVAILABLE_LANGS.has(langKey)) return {};

  try {
    let res = await fetch(`/i18n/${langKey}.json`);
    if (!res.ok) {
      res = await fetch(`/api/assets/i18n/${langKey}.json`);
    }
    if (!res.ok) {
      console.warn(`[i18n] Failed to load i18n/${langKey}.json (${res.status}). Run: npx tsx script/compile-i18n.ts`);
      return {};
    }
    const data = await res.json();
    loadedTranslations[lang] = data;
    return data;
  } catch (err) {
    console.warn(`[i18n] Error loading /i18n/${langKey}.json:`, err);
    return {};
  }
}

export function getLoadedTranslations(lang: LanguageCode): Record<string, string> | undefined {
  return loadedTranslations[lang];
}

export function hasLoader(lang: LanguageCode): boolean {
  const langKey = lang === "tl" ? "tl" : lang;
  return AVAILABLE_LANGS.has(langKey);
}
