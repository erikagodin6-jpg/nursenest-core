import type { CountryLanguagePriorityEntry, PilotCountrySlug } from "./country-localization-types";

function dedupe(chain: string[]): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const c of chain) {
    const x = c.toLowerCase();
    if (seen.has(x)) continue;
    seen.add(x);
    out.push(c);
  }
  return out;
}

function entry(
  slug: PilotCountrySlug,
  defaultLanguage: string,
  supported: readonly string[],
  regionalFallback: readonly string[],
): CountryLanguagePriorityEntry {
  return {
    countrySlug: slug,
    defaultLanguage,
    supportedLanguages: supported,
    resolveFallbackLanguages(selectedLanguage: string): readonly string[] {
      const sel = selectedLanguage.toLowerCase();
      if (supported.includes(sel)) {
        return dedupe([sel, defaultLanguage, ...regionalFallback, "en"]);
      }
      return dedupe([defaultLanguage, sel, ...regionalFallback, "en"]);
    },
  };
}

export const COUNTRY_LANGUAGE_PRIORITY_MAP: Record<PilotCountrySlug, CountryLanguagePriorityEntry> = {
  india: entry("india", "en", ["en", "hi", "ta", "te", "bn", "mr", "gu"], ["hi"]),
  "middle-east": entry("middle-east", "en", ["en", "ar", "ur", "tl", "hi"], ["ar", "ur"]),
  australia: entry("australia", "en", ["en", "ar", "zh", "hi", "pa", "tl"], ["en"]),
  china: entry("china", "en", ["en", "zh", "zh-tw", "ar", "hi", "tl"], ["zh"]),
  korea: entry("korea", "en", ["en", "ko", "zh", "ja", "tl", "hi"], ["ko"]),
  japan: entry("japan", "en", ["en", "ja", "zh", "tl", "vi"], ["ja"]),
  germany: entry("germany", "en", ["en", "de", "ar", "tr", "hi"], ["de"]),
  france: entry("france", "en", ["en", "fr", "ar", "pt", "es"], ["fr"]),
  italy: entry("italy", "en", ["en", "it", "ar", "ro", "es"], ["it"]),
  hungary: entry("hungary", "en", ["en", "hu", "de", "ro", "ar"], ["hu"]),
  portugal: entry("portugal", "en", ["en", "pt", "es", "fr", "ar"], ["pt"]),
  mexico: entry("mexico", "en", ["en", "es", "pt", "fr", "ar"], ["es"]),
  philippines: entry("philippines", "en", ["en", "tl"], ["tl"]),
};
