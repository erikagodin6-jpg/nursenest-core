/**
 * Preference sync — reconciles cookie, localStorage, and account-level
 * preferences for country, language, profession, and exam context.
 *
 * Priority order (highest wins):
 *   1. Account-level saved preferences (logged-in users)
 *   2. Cookie preferences (logged-out or overridden)
 *   3. Geo-detected defaults
 *
 * After login, account preferences win over cookie values.
 * Temporary switching (via context bar) updates cookies only;
 * permanent changes go through the settings page → account API.
 */

import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import { REGION_CONFIG, isAllowedLocaleForRegion } from "@/lib/i18n/global-regions";
import {
  GLOBAL_REGION_COOKIE,
  parseGlobalRegionCookie,
  globalRegionSetCookieValue,
} from "@/lib/region/global-region-cookie";
import { MARKETING_LOCALE_COOKIE } from "@/lib/i18n/marketing-locale-cookie";

// ── Types ────────────────────────────────────────────────────────────────────

export type UserContextPreferences = {
  region: GlobalRegionSlug;
  locale: GlobalLocaleCode;
  profession: string | null;
  exam: string | null;
};

export type PreferenceSource = "account" | "cookie" | "geo" | "default";

export type ResolvedPreferences = UserContextPreferences & {
  source: PreferenceSource;
};

export type AccountPreferences = {
  preferredRegion?: GlobalRegionSlug | null;
  preferredLocale?: GlobalLocaleCode | null;
  preferredProfession?: string | null;
  preferredExam?: string | null;
};

// ── Resolve preferences ──────────────────────────────────────────────────────

/**
 * Resolve the effective user context from available preference sources.
 *
 * Pure function — no side effects. Call this on the server during SSR
 * or on the client during hydration.
 */
export function resolvePreferences(
  accountPrefs: AccountPreferences | null,
  cookieRegion: GlobalRegionSlug | null,
  cookieLocale: GlobalLocaleCode | null,
  geoRegion: GlobalRegionSlug | null,
): ResolvedPreferences {
  // 1. Account preferences win when logged in
  if (accountPrefs?.preferredRegion) {
    const region = accountPrefs.preferredRegion;
    const locale = resolveLocaleForRegion(
      accountPrefs.preferredLocale ?? null,
      cookieLocale,
      region,
    );
    return {
      region,
      locale,
      profession: accountPrefs.preferredProfession ?? null,
      exam: accountPrefs.preferredExam ?? null,
      source: "account",
    };
  }

  // 2. Cookie preferences
  if (cookieRegion) {
    const locale = resolveLocaleForRegion(cookieLocale, null, cookieRegion);
    return {
      region: cookieRegion,
      locale,
      profession: null,
      exam: null,
      source: "cookie",
    };
  }

  // 3. Geo-detected
  if (geoRegion) {
    const regionCfg = REGION_CONFIG[geoRegion];
    return {
      region: geoRegion,
      locale: regionCfg.defaultLocale,
      profession: null,
      exam: null,
      source: "geo",
    };
  }

  // 4. Global default (Philippines-first, per global-regions.ts)
  return {
    region: "philippines",
    locale: "en",
    profession: null,
    exam: null,
    source: "default",
  };
}

/**
 * After login, sync account preferences into cookies so SSR respects them.
 *
 * Returns Set-Cookie header values to apply.
 */
export function buildPostLoginCookieSync(
  accountPrefs: AccountPreferences,
): string[] {
  const cookies: string[] = [];

  if (accountPrefs.preferredRegion) {
    cookies.push(globalRegionSetCookieValue(accountPrefs.preferredRegion));
  }

  if (accountPrefs.preferredLocale) {
    cookies.push(
      `${MARKETING_LOCALE_COOKIE}=${accountPrefs.preferredLocale}; Path=/; Max-Age=${365 * 24 * 60 * 60}; SameSite=Lax`,
    );
  }

  return cookies;
}

/**
 * When a user temporarily switches context (via the context bar),
 * persist ONLY to cookies — do not update account preferences.
 *
 * Returns Set-Cookie header values.
 */
export function buildTemporarySwitchCookies(
  region: GlobalRegionSlug,
  locale: GlobalLocaleCode,
): string[] {
  return [
    globalRegionSetCookieValue(region),
    `${MARKETING_LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${365 * 24 * 60 * 60}; SameSite=Lax`,
  ];
}

/**
 * Determine whether account preferences differ from cookie preferences.
 * Used to show a "preferences restored" toast after login.
 */
export function preferencesNeedSync(
  accountPrefs: AccountPreferences | null,
  cookieRegion: GlobalRegionSlug | null,
  cookieLocale: GlobalLocaleCode | null,
): boolean {
  if (!accountPrefs) return false;
  if (accountPrefs.preferredRegion && accountPrefs.preferredRegion !== cookieRegion) return true;
  if (accountPrefs.preferredLocale && accountPrefs.preferredLocale !== cookieLocale) return true;
  return false;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function resolveLocaleForRegion(
  primaryLocale: GlobalLocaleCode | null,
  fallbackLocale: GlobalLocaleCode | null,
  region: GlobalRegionSlug,
): GlobalLocaleCode {
  // Prefer primary if valid for region
  if (primaryLocale && isAllowedLocaleForRegion(primaryLocale, region)) {
    return primaryLocale;
  }
  // Try fallback
  if (fallbackLocale && isAllowedLocaleForRegion(fallbackLocale, region)) {
    return fallbackLocale;
  }
  // Region default
  return REGION_CONFIG[region].defaultLocale;
}
