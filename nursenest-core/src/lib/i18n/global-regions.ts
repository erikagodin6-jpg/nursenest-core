/**
 * Global region + locale config for international expansion.
 *
 * Regions are ordered by market priority (underserved global markets first).
 * This is additive to the existing US/CA region system — it does NOT replace
 * the legacy `NursenestRegion` ("US" | "CA") or `CountryCode` enum in Prisma.
 *
 * Integration points:
 *   - `geo-resolver.ts`   → edge detection → region + locale
 *   - `global-region-cookie.ts` → override persistence
 *   - `regional-pricing-map.ts` → display prices per region
 *   - `proxy.ts`          → root "/" geo-redirect
 */

// ── Locale codes ─────────────────────────────────────────────────────────────

/** Wider than legacy list: must cover marketing cookies (`zh`, `ar`, …) used with `saveContextPreferences`. */
export const GLOBAL_LOCALE_CODES = [
  "en",
  "fr",
  "es",
  "tl",
  "hi",
  "ja",
  "ko",
  "it",
  "el",
  "de",
  "zh",
  "zh-tw",
  "ar",
  "vi",
  "pa",
  "pt",
  "ur",
  "fa",
  "th",
  "tr",
  "id",
  "ru",
  "ht",
  "hu",
] as const;
export type GlobalLocaleCode = (typeof GLOBAL_LOCALE_CODES)[number];

export function isGlobalLocaleCode(v: string): v is GlobalLocaleCode {
  return (GLOBAL_LOCALE_CODES as readonly string[]).includes(v);
}

// ── Region slugs (priority order: underserved first) ─────────────────────────

export const GLOBAL_REGION_SLUGS = [
  // High priority — underserved, high volume
  "philippines",
  "india",
  "nigeria",
  "kenya",
  "pakistan",
  "bangladesh",
  "south-africa",
  // Secondary — growing or niche
  "uae",
  "saudi-arabia",
  "singapore",
  "jamaica",
  "trinidad",
  "ireland",
  "new-zealand",
  // Asia / Europe expansion (SEO + geo; exam hubs may still route via US/CA pathways)
  "japan",
  "china",
  "south-korea",
  "indonesia",
  "vietnam",
  "thailand",
  "italy",
  "greece",
  "germany",
  "france",
  "hungary",
  "portugal",
  "mexico",
  // Legacy / competitive
  "us",
  "canada",
  "uk",
  "aus",
] as const;

export type GlobalRegionSlug = (typeof GLOBAL_REGION_SLUGS)[number];

export function isGlobalRegionSlug(v: string): v is GlobalRegionSlug {
  return (GLOBAL_REGION_SLUGS as readonly string[]).includes(v);
}

// ── Region metadata ──────────────────────────────────────────────────────────

export type RegionPriority = "high" | "secondary" | "legacy";

export type RegionConfig = {
  slug: GlobalRegionSlug;
  displayName: string;
  priority: RegionPriority;
  defaultLocale: GlobalLocaleCode;
  allowedLocales: readonly GlobalLocaleCode[];
  currencyCode: string;
  currencySymbol: string;
  /**
   * ISO 3166-1 alpha-2 codes that map to this region.
   * Used by geo-resolver to determine region from IP country header.
   */
  countryCodes: readonly string[];
};

export const REGION_CONFIG: Record<GlobalRegionSlug, RegionConfig> = {
  // ── High priority ──────────────────────────────────────────────────────────
  philippines: {
    slug: "philippines",
    displayName: "Philippines",
    priority: "high",
    defaultLocale: "tl",
    allowedLocales: ["tl", "en"],
    currencyCode: "PHP",
    currencySymbol: "₱",
    countryCodes: ["PH"],
  },
  india: {
    slug: "india",
    displayName: "India",
    priority: "high",
    defaultLocale: "en",
    allowedLocales: ["en", "hi"],
    currencyCode: "INR",
    currencySymbol: "₹",
    countryCodes: ["IN"],
  },
  nigeria: {
    slug: "nigeria",
    displayName: "Nigeria",
    priority: "high",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "NGN",
    currencySymbol: "₦",
    countryCodes: ["NG"],
  },
  kenya: {
    slug: "kenya",
    displayName: "Kenya",
    priority: "high",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "KES",
    currencySymbol: "KSh",
    countryCodes: ["KE"],
  },
  pakistan: {
    slug: "pakistan",
    displayName: "Pakistan",
    priority: "high",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "PKR",
    currencySymbol: "Rs",
    countryCodes: ["PK"],
  },
  bangladesh: {
    slug: "bangladesh",
    displayName: "Bangladesh",
    priority: "high",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "BDT",
    currencySymbol: "৳",
    countryCodes: ["BD"],
  },
  "south-africa": {
    slug: "south-africa",
    displayName: "South Africa",
    priority: "high",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "ZAR",
    currencySymbol: "R",
    countryCodes: ["ZA"],
  },
  // ── Secondary ──────────────────────────────────────────────────────────────
  uae: {
    slug: "uae",
    displayName: "United Arab Emirates",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "AED",
    currencySymbol: "د.إ",
    countryCodes: ["AE"],
  },
  "saudi-arabia": {
    slug: "saudi-arabia",
    displayName: "Saudi Arabia",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "SAR",
    currencySymbol: "ر.س",
    countryCodes: ["SA"],
  },
  singapore: {
    slug: "singapore",
    displayName: "Singapore",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "SGD",
    currencySymbol: "S$",
    countryCodes: ["SG"],
  },
  jamaica: {
    slug: "jamaica",
    displayName: "Jamaica",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "JMD",
    currencySymbol: "J$",
    countryCodes: ["JM"],
  },
  trinidad: {
    slug: "trinidad",
    displayName: "Trinidad and Tobago",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "TTD",
    currencySymbol: "TT$",
    countryCodes: ["TT"],
  },
  ireland: {
    slug: "ireland",
    displayName: "Ireland",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "EUR",
    currencySymbol: "€",
    countryCodes: ["IE"],
  },
  "new-zealand": {
    slug: "new-zealand",
    displayName: "New Zealand",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "NZD",
    currencySymbol: "NZ$",
    countryCodes: ["NZ"],
  },
  japan: {
    slug: "japan",
    displayName: "Japan",
    priority: "secondary",
    defaultLocale: "ja",
    allowedLocales: ["ja", "en"],
    currencyCode: "JPY",
    currencySymbol: "¥",
    countryCodes: ["JP"],
  },
  china: {
    slug: "china",
    displayName: "China",
    priority: "secondary",
    defaultLocale: "zh",
    allowedLocales: ["zh", "en", "zh-tw"],
    currencyCode: "CNY",
    currencySymbol: "¥",
    countryCodes: ["CN"],
  },
  "south-korea": {
    slug: "south-korea",
    displayName: "South Korea",
    priority: "secondary",
    defaultLocale: "ko",
    allowedLocales: ["ko", "en"],
    currencyCode: "KRW",
    currencySymbol: "₩",
    countryCodes: ["KR"],
  },
  indonesia: {
    slug: "indonesia",
    displayName: "Indonesia",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "IDR",
    currencySymbol: "Rp",
    countryCodes: ["ID"],
  },
  vietnam: {
    slug: "vietnam",
    displayName: "Vietnam",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "VND",
    currencySymbol: "₫",
    countryCodes: ["VN"],
  },
  thailand: {
    slug: "thailand",
    displayName: "Thailand",
    priority: "secondary",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "THB",
    currencySymbol: "฿",
    countryCodes: ["TH"],
  },
  italy: {
    slug: "italy",
    displayName: "Italy",
    priority: "secondary",
    defaultLocale: "it",
    allowedLocales: ["it", "en"],
    currencyCode: "EUR",
    currencySymbol: "€",
    countryCodes: ["IT"],
  },
  greece: {
    slug: "greece",
    displayName: "Greece",
    priority: "secondary",
    defaultLocale: "el",
    allowedLocales: ["el", "en"],
    currencyCode: "EUR",
    currencySymbol: "€",
    countryCodes: ["GR"],
  },
  germany: {
    slug: "germany",
    displayName: "Germany",
    priority: "secondary",
    defaultLocale: "de",
    allowedLocales: ["de", "en"],
    currencyCode: "EUR",
    currencySymbol: "€",
    countryCodes: ["DE"],
  },
  france: {
    slug: "france",
    displayName: "France",
    priority: "secondary",
    defaultLocale: "fr",
    allowedLocales: ["fr", "en"],
    currencyCode: "EUR",
    currencySymbol: "€",
    countryCodes: ["FR"],
  },
  hungary: {
    slug: "hungary",
    displayName: "Hungary",
    priority: "secondary",
    defaultLocale: "hu",
    allowedLocales: ["hu", "en"],
    currencyCode: "HUF",
    currencySymbol: "Ft",
    countryCodes: ["HU"],
  },
  portugal: {
    slug: "portugal",
    displayName: "Portugal",
    priority: "secondary",
    defaultLocale: "pt",
    allowedLocales: ["pt", "en"],
    currencyCode: "EUR",
    currencySymbol: "€",
    countryCodes: ["PT"],
  },
  mexico: {
    slug: "mexico",
    displayName: "Mexico",
    priority: "secondary",
    defaultLocale: "es",
    allowedLocales: ["es", "en"],
    currencyCode: "MXN",
    currencySymbol: "$",
    countryCodes: ["MX"],
  },
  // ── Legacy / competitive ───────────────────────────────────────────────────
  us: {
    slug: "us",
    displayName: "United States",
    priority: "legacy",
    defaultLocale: "en",
    allowedLocales: ["en", "es"],
    currencyCode: "USD",
    currencySymbol: "$",
    countryCodes: ["US", "GU", "PR", "VI", "AS", "MP"],
  },
  canada: {
    slug: "canada",
    displayName: "Canada",
    priority: "legacy",
    defaultLocale: "en",
    allowedLocales: ["en", "fr"],
    currencyCode: "CAD",
    currencySymbol: "$",
    countryCodes: ["CA"],
  },
  uk: {
    slug: "uk",
    displayName: "United Kingdom",
    priority: "legacy",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "GBP",
    currencySymbol: "£",
    countryCodes: ["GB"],
  },
  aus: {
    slug: "aus",
    displayName: "Australia",
    priority: "legacy",
    defaultLocale: "en",
    allowedLocales: ["en"],
    currencyCode: "AUD",
    currencySymbol: "A$",
    countryCodes: ["AU"],
  },
};

// ── Derived lookups (built once at module load, edge-safe) ───────────────────

const _countryToRegion = new Map<string, GlobalRegionSlug>();
for (const cfg of Object.values(REGION_CONFIG)) {
  for (const cc of cfg.countryCodes) {
    _countryToRegion.set(cc.toUpperCase(), cfg.slug);
  }
}

/**
 * Map an ISO 3166-1 alpha-2 country code to our region slug.
 * Returns `undefined` for unmapped countries (caller should apply fallback).
 */
export function regionFromCountryCode(isoAlpha2: string): GlobalRegionSlug | undefined {
  return _countryToRegion.get(isoAlpha2.toUpperCase().trim());
}

/** Default locale for a given region. */
export function defaultLocaleByRegion(region: GlobalRegionSlug): GlobalLocaleCode {
  return REGION_CONFIG[region].defaultLocale;
}

/** Whether a locale is valid for a region. */
export function isAllowedLocaleForRegion(locale: GlobalLocaleCode, region: GlobalRegionSlug): boolean {
  return (REGION_CONFIG[region].allowedLocales as readonly string[]).includes(locale);
}

/** All valid `{locale, region}` pairs. */
export function* eachAllowedLocaleRegionPair(): Generator<{ locale: GlobalLocaleCode; region: GlobalRegionSlug }> {
  for (const cfg of Object.values(REGION_CONFIG)) {
    for (const locale of cfg.allowedLocales) {
      yield { locale, region: cfg.slug };
    }
  }
}

/**
 * Regions grouped by priority tier.
 * Useful for admin dashboards and pricing config UIs.
 */
export function regionsByPriority(priority: RegionPriority): GlobalRegionSlug[] {
  return GLOBAL_REGION_SLUGS.filter((s) => REGION_CONFIG[s].priority === priority);
}

// ── Fallback region ───────────────────────────────────────────────────────────
// Must be a region with a valid hub route (/us or /canada). Changing this to
// any other slug will 404 visitors whose geo-IP cannot be detected.

export const GLOBAL_DEFAULT_REGION: GlobalRegionSlug = "us";
export const GLOBAL_DEFAULT_LOCALE: GlobalLocaleCode = "en";
