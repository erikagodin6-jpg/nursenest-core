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
};
