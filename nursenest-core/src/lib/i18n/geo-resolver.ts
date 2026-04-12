/**
 * Edge-safe geo + language resolver.
 *
 * Runs in proxy / edge context with zero DB calls and zero blocking I/O.
 * Reads IP-country headers (Vercel, Cloudflare) and Accept-Language to
 * determine the best `{ region, locale }` pair for a visitor.
 *
 * Priority:
 *   1. Override cookie (`nn_global_region`)
 *   2. IP-country header → region → region's default locale
 *   3. Accept-Language negotiation (constrained to region's allowed locales)
 *   4. Global fallback: `{ region: "philippines", locale: "en" }`
 */

import {
  type GlobalLocaleCode,
  type GlobalRegionSlug,
  GLOBAL_DEFAULT_LOCALE,
  GLOBAL_DEFAULT_REGION,
  GLOBAL_LOCALE_CODES,
  REGION_CONFIG,
  isGlobalLocaleCode,
  isGlobalRegionSlug,
  regionFromCountryCode,
} from "./global-regions";

// ── Types ────────────────────────────────────────────────────────────────────

export type GeoResolution = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  /** How the region was determined. */
  source: "cookie" | "ip" | "fallback";
  /** Raw ISO alpha-2 from the header, if present. */
  detectedCountryCode: string | null;
};

// ── Public resolver ──────────────────────────────────────────────────────────

/**
 * Resolve region + locale from edge-available signals.
 *
 * @param ipCountryHeader  Value of `x-vercel-ip-country` or `cf-ipcountry`
 * @param acceptLanguage   Value of `Accept-Language` header
 * @param overrideCookie   Value of `nn_global_region` cookie (region slug)
 */
export function resolveGeo(
  ipCountryHeader: string | null | undefined,
  acceptLanguage: string | null | undefined,
  overrideCookie: string | null | undefined,
): GeoResolution {
  // 1. Cookie override
  if (overrideCookie && isGlobalRegionSlug(overrideCookie)) {
    const region = overrideCookie;
    const locale = pickLocaleForRegion(region, acceptLanguage);
    return { region, locale, source: "cookie", detectedCountryCode: null };
  }

  // 2. IP-country detection
  const rawCountry = (ipCountryHeader ?? "").toUpperCase().trim();
  if (rawCountry.length === 2) {
    const region = regionFromCountryCode(rawCountry);
    if (region) {
      const locale = pickLocaleForRegion(region, acceptLanguage);
      return { region, locale, source: "ip", detectedCountryCode: rawCountry };
    }
  }

  // 3. Fallback — global-first default (Philippines, not US)
  return {
    region: GLOBAL_DEFAULT_REGION,
    locale: GLOBAL_DEFAULT_LOCALE,
    source: "fallback",
    detectedCountryCode: rawCountry.length === 2 ? rawCountry : null,
  };
}

// ── Accept-Language negotiation ──────────────────────────────────────────────

/**
 * Pick the best locale for a region from Accept-Language.
 * Falls back to the region's default locale.
 *
 * Only considers our supported locale codes — no BCP-47 subtag matching beyond
 * primary language code (sufficient for the 5 locales we support).
 */
function pickLocaleForRegion(
  region: GlobalRegionSlug,
  acceptLanguage: string | null | undefined,
): GlobalLocaleCode {
  const cfg = REGION_CONFIG[region];
  if (!acceptLanguage) return cfg.defaultLocale;

  const preferred = parseAcceptLanguage(acceptLanguage);
  for (const tag of preferred) {
    const primary = tag.split("-")[0]?.toLowerCase();
    if (!primary) continue;
    if (
      isGlobalLocaleCode(primary) &&
      (cfg.allowedLocales as readonly string[]).includes(primary)
    ) {
      return primary;
    }
  }

  return cfg.defaultLocale;
}

/**
 * Parse Accept-Language into an ordered list of language tags (highest q first).
 * Handles: `en-US,en;q=0.9,tl;q=0.8`
 * Lightweight — no allocation beyond the result array.
 */
function parseAcceptLanguage(header: string): string[] {
  return header
    .split(",")
    .map((part) => {
      const [tag, ...rest] = part.trim().split(";");
      const qStr = rest.find((r) => r.trim().startsWith("q="));
      const q = qStr ? parseFloat(qStr.trim().slice(2)) : 1.0;
      return { tag: (tag ?? "").trim(), q: Number.isFinite(q) ? q : 0 };
    })
    .filter((e) => e.tag.length > 0)
    .sort((a, b) => b.q - a.q)
    .map((e) => e.tag);
}

// ── Utility: build the redirect path for root "/" ────────────────────────────

/**
 * Build the localized root path for a geo resolution.
 * Uses the pattern `/{locale}/{region}` (e.g. `/tl/philippines`, `/en/india`).
 * English locale omits the prefix to match the existing default-route convention:
 * `/{region}` for English (e.g. `/india`), `/{locale}/{region}` for others.
 */
export function geoRedirectPath(resolution: GeoResolution): string {
  if (resolution.locale === "en") {
    return `/${resolution.region}`;
  }
  return `/${resolution.locale}/${resolution.region}`;
}
