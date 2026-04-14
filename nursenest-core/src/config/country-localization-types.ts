/**
 * Shared types for country + language aware marketing content (incremental rollout).
 * Reference hubs: India, Middle East (Gulf), Australia — extended to all regional nursing verticals
 * using the same resolver, sample batches, and server-only manifest summaries.
 */

import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import type { RegionalMarketingStrip } from "@/lib/marketing/regional-marketing-nav-priority";

/** URL / i18n segment for regional exam hubs (`/exams/{slug}` and related marketing routes). */
export type PilotCountrySlug =
  | "india"
  | "middle-east"
  | "australia"
  | "china"
  | "korea"
  | "japan"
  | "germany"
  | "france"
  | "italy"
  | "hungary"
  | "portugal"
  | "mexico"
  | "philippines";

export type NursingScopeTier = "EN" | "RN" | "NP" | "PN" | "ALLIED";

export type CountryExamMapEntry = {
  countrySlug: PilotCountrySlug;
  /** Primary marketing exam hub path (English default route). */
  examsHubPath: string;
  /** Topic / sub-routes surfaced in nav and quick links. */
  topicPaths: readonly string[];
  /** Nursing scope labels for copy and future filters — not flattened to one generic “exam”. */
  nursingScopes: readonly NursingScopeTier[];
  alliedHealthScopes: readonly string[];
};

export type CountryLanguagePriorityEntry = {
  countrySlug: PilotCountrySlug;
  /** BCP-47 style codes used in manifests (`en`, `hi`, `ar`, …). */
  defaultLanguage: string;
  supportedLanguages: readonly string[];
  /**
   * Ordered fallbacks after the user’s selected UI language fails to match content.
   * Always ends with `en` where English is used as site fallback.
   */
  resolveFallbackLanguages(selectedLanguage: string): readonly string[];
};

export type NavPriorityEntry = {
  countrySlug: PilotCountrySlug;
  /** Logical nav groups — map to i18n keys in components, not raw labels here. */
  navOrdering: readonly string[];
};

export type FeaturedContentSlot = {
  id: string;
  /** i18n key suffix under `featured.{countrySlug}.*` */
  titleKey: string;
  bodyKey: string;
};

export type CountryFeaturedContentEntry = {
  countrySlug: PilotCountrySlug;
  slots: readonly FeaturedContentSlot[];
};

export type CountryBlogPriorityEntry = {
  countrySlug: PilotCountrySlug;
  /** On-disk manifest (planned rows, not full posts). */
  manifestRelativePath: string;
  /** i18n key for `blog.tag` link construction */
  blogTagNameKey: string;
  /** Sample batch bundled for hub UI — `data/blog-content/.../sample-posts.json` */
  sampleBatchRelativePath: string;
};

export type CountryRouteEntry = {
  countrySlug: PilotCountrySlug;
  examsHubPath: string;
  registrationPath?: string;
  howToPath?: string;
  workAbroadPath?: string;
  extraTopicPaths?: readonly string[];
};

export type BlogSampleEntry = {
  slug: string;
  title: string;
  language: string;
  countryTargets: readonly string[];
  profession?: string;
  exam?: string;
  intentType?: string;
  translationGroupId: string;
  canonicalClusterId?: string;
  publicationPriority: number;
  status: "sample" | "planned";
};

export type BlogSampleFile = {
  version: number;
  countrySlug: PilotCountrySlug;
  entries: BlogSampleEntry[];
};

export type ResolveLocalizedContentParams = {
  /** From `resolveRegionalMarketingStrip` or explicit hub context. */
  selectedCountry: PilotCountrySlug | null;
  /** Marketing UI locale / user language preference (URL prefix). */
  selectedLanguage: string;
  /** `nn_global_region` when available — refines Middle East vs India, etc. */
  globalRegion?: GlobalRegionSlug | null;
  /** Current path without locale prefix — preserves intentional navigation. */
  currentRoute: string;
  contentType: "blog" | "nav" | "featured" | "quicklinks";
};

/** 1 = best match … 6 = global fallback (see resolver). */
export type LocalizationTier = 1 | 2 | 3 | 4 | 5 | 6;

export type Ranked<T> = { item: T; tier: LocalizationTier; score: number };

/** Maps marketing strip + cookie to regional hub slug (null = not a regional exam hub context). */
export function regionalStripToPilotCountry(
  strip: RegionalMarketingStrip | null,
  globalRegion: GlobalRegionSlug | null | undefined,
): PilotCountrySlug | null {
  if (strip === "india") return "india";
  if (strip === "middle_east") return "middle-east";
  if (strip === "australia") return "australia";
  if (strip === "china") return "china";
  if (strip === "korea") return "korea";
  if (strip === "japan") return "japan";
  if (strip === "germany") return "germany";
  if (strip === "france") return "france";
  if (strip === "italy") return "italy";
  if (strip === "hungary") return "hungary";
  if (strip === "portugal") return "portugal";
  if (strip === "mexico") return "mexico";
  if (strip === "philippines") return "philippines";

  if (!strip && globalRegion === "india") return "india";
  if (!strip && (globalRegion === "uae" || globalRegion === "saudi-arabia")) return "middle-east";
  if (!strip && globalRegion === "aus") return "australia";
  if (!strip && globalRegion === "china") return "china";
  if (!strip && globalRegion === "south-korea") return "korea";
  if (!strip && globalRegion === "japan") return "japan";
  if (!strip && globalRegion === "germany") return "germany";
  if (!strip && globalRegion === "france") return "france";
  if (!strip && globalRegion === "italy") return "italy";
  if (!strip && globalRegion === "hungary") return "hungary";
  if (!strip && globalRegion === "portugal") return "portugal";
  if (!strip && globalRegion === "mexico") return "mexico";
  if (!strip && globalRegion === "philippines") return "philippines";
  return null;
}
