import type {
  BlogSampleEntry,
  LocalizationTier,
  PilotCountrySlug,
  Ranked,
  ResolveLocalizedContentParams,
} from "@/config/country-localization-types";
import { COUNTRY_LANGUAGE_PRIORITY_MAP } from "@/config/country-language-priority-map";

/** Manifest / sample rows use these ISO-style targets per pilot hub. */
export const PILOT_COUNTRY_TARGETS: Record<PilotCountrySlug, readonly string[]> = {
  india: ["IN"],
  australia: ["AU"],
  /** GCC hubs + migration source countries used in pilot sample rows. */
  "middle-east": ["GCC", "ME", "AE", "SA", "QA", "IN"],
};

function targetsMatchCountry(entry: BlogSampleEntry, country: PilotCountrySlug): boolean {
  const want = PILOT_COUNTRY_TARGETS[country].map((s) => s.toUpperCase());
  return entry.countryTargets.some((t) => want.includes(String(t).toUpperCase()));
}

/**
 * Ordered UI languages to try for blog + featured copy selection.
 * Does not change URL locale — only prioritizes which localized *content* rows win.
 */
export function resolveLanguageTryOrder(
  country: PilotCountrySlug | null,
  selectedLanguage: string,
): readonly string[] {
  if (!country) {
    const fallback = selectedLanguage.toLowerCase();
    return fallback === "en" ? ["en"] : [fallback, "en"];
  }
  return COUNTRY_LANGUAGE_PRIORITY_MAP[country].resolveFallbackLanguages(selectedLanguage);
}

/**
 * High-level resolver for nav, featured, blog, quicklinks modules.
 * Preserves route intent: `currentRoute` is available for future “sticky hub” rules.
 */
export function resolveLocalizedContent(input: ResolveLocalizedContentParams): {
  activeCountry: PilotCountrySlug | null;
  languageTryOrder: readonly string[];
  contentType: ResolveLocalizedContentParams["contentType"];
} {
  void input.currentRoute;
  void input.globalRegion;
  const languageTryOrder = resolveLanguageTryOrder(input.selectedCountry, input.selectedLanguage);
  return {
    activeCountry: input.selectedCountry,
    languageTryOrder,
    contentType: input.contentType,
  };
}

function languageTier(entryLang: string, order: readonly string[]): LocalizationTier {
  const el = entryLang.toLowerCase();
  const idx = order.findIndex((l) => l.toLowerCase() === el);
  if (idx === 0) return 1;
  if (idx === 1) return 2;
  if (idx === 2) return 3;
  if (idx >= 3) return 4;
  return 5;
}

/**
 * Ranks a batch of sample/planned blog rows for hub cards.
 * Country relevance beats language-only matches; see tier notes in product spec.
 */
export function rankBlogSample(
  entry: BlogSampleEntry,
  country: PilotCountrySlug,
  languageTryOrder: readonly string[],
): Ranked<BlogSampleEntry> {
  const countryMatch = targetsMatchCountry(entry, country);
  const tier: LocalizationTier = countryMatch ? languageTier(entry.language, languageTryOrder) : 6;
  const langIdx = languageTryOrder.findIndex((l) => l.toLowerCase() === entry.language.toLowerCase());
  const priority = entry.publicationPriority ?? 0;
  const score = (7 - tier) * 1000 + priority + (langIdx >= 0 ? 50 - langIdx : 0);
  return { item: entry, tier, score };
}

export function rankAndSortBlogSamples(
  entries: readonly BlogSampleEntry[],
  country: PilotCountrySlug,
  languageTryOrder: readonly string[],
): Ranked<BlogSampleEntry>[] {
  return entries
    .map((e) => rankBlogSample(e, country, languageTryOrder))
    .sort((a, b) => b.score - a.score);
}
