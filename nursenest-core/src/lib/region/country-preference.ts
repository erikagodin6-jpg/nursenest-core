/**
 * Five-country preference layer on top of the binary NursenestRegion ("US" | "CA").
 * Persisted to localStorage + cookie and (when authenticated) the user profile.
 *
 * UK, Australia, and Ireland map to "US" routing since the content library is
 * currently US/CA only; labels are country-specific for display purposes.
 */

import type { NursenestRegion } from "@/lib/region/use-nursenest-region";
import type { GlobalRegionSlug } from "@/lib/i18n/global-regions";
import { GLOBAL_REGION_COOKIE, GLOBAL_REGION_COOKIE_MAX_AGE } from "@/lib/region/global-region-cookie";

export type CountryPreference = "us" | "canada" | "uk" | "aus" | "ireland";

export const COUNTRY_PREFERENCE_COOKIE = "nn_country_preference";
export const COUNTRY_PREFERENCE_STORAGE_KEY = "nn_country_preference";
export const COUNTRY_PREFERENCE_COOKIE_MAX_AGE = 60 * 60 * 24 * 400; // ~13 months

export type CountryExamLabels = {
  rn: string;
  pn: string;
  np: string;
  allied: string;
};

export type CountryConfig = {
  preference: CountryPreference;
  displayName: string;
  flag: string;
  nursenestRegion: NursenestRegion;
  examLabels: CountryExamLabels;
};

export const COUNTRY_CONFIGS: Record<CountryPreference, CountryConfig> = {
  canada: {
    preference: "canada",
    displayName: "Canada",
    flag: "🇨🇦",
    nursenestRegion: "CA",
    examLabels: {
      rn: "NCLEX-RN Canada",
      pn: "REx-PN",
      np: "CNPLE",
      allied: "Allied Health",
    },
  },
  us: {
    preference: "us",
    displayName: "United States",
    flag: "🇺🇸",
    nursenestRegion: "US",
    examLabels: {
      rn: "NCLEX-RN",
      pn: "NCLEX-PN",
      np: "NP",
      allied: "Allied Health",
    },
  },
  uk: {
    preference: "uk",
    displayName: "United Kingdom",
    flag: "🇬🇧",
    nursenestRegion: "US",
    examLabels: {
      rn: "NCLEX-RN",
      pn: "NCLEX-PN",
      np: "NP",
      allied: "Allied Health",
    },
  },
  aus: {
    preference: "aus",
    displayName: "Australia",
    flag: "🇦🇺",
    nursenestRegion: "US",
    examLabels: {
      rn: "NCLEX-RN",
      pn: "NCLEX-PN",
      np: "NP",
      allied: "Allied Health",
    },
  },
  ireland: {
    preference: "ireland",
    displayName: "Ireland",
    flag: "🇮🇪",
    nursenestRegion: "US",
    examLabels: {
      rn: "NCLEX-RN",
      pn: "NCLEX-PN",
      np: "NP",
      allied: "Allied Health",
    },
  },
};

export const COUNTRY_PREFERENCE_OPTIONS: CountryPreference[] = [
  "canada",
  "us",
  "uk",
  "aus",
  "ireland",
];

export function isCountryPreference(v: string | null | undefined): v is CountryPreference {
  if (!v) return false;
  return Object.prototype.hasOwnProperty.call(COUNTRY_CONFIGS, v);
}

export function parseCountryPreference(raw: string | null | undefined): CountryPreference | null {
  if (!raw) return null;
  const v = raw.trim().toLowerCase();
  return isCountryPreference(v) ? v : null;
}

export function countryPreferenceToNursenestRegion(pref: CountryPreference): NursenestRegion {
  return COUNTRY_CONFIGS[pref].nursenestRegion;
}

export function countryPreferenceToGlobalRegion(pref: CountryPreference): GlobalRegionSlug {
  switch (pref) {
    case "canada":
      return "canada";
    case "uk":
      return "uk";
    case "aus":
      return "aus";
    case "ireland":
      return "ireland";
    case "us":
    default:
      return "us";
  }
}

export function countryExamLabels(pref: CountryPreference): CountryExamLabels {
  return COUNTRY_CONFIGS[pref].examLabels;
}

export function readCountryPreferenceCookie(): CountryPreference | null {
  if (typeof document === "undefined") return null;
  try {
    const m = document.cookie.match(
      new RegExp(`(?:^|; )${COUNTRY_PREFERENCE_COOKIE}=([^;]*)`),
    );
    const raw = m?.[1] ? decodeURIComponent(m[1]) : null;
    return parseCountryPreference(raw);
  } catch {
    return null;
  }
}

export function writeCountryPreferenceCookie(pref: CountryPreference): void {
  if (typeof document === "undefined") return;
  try {
    document.cookie = `${COUNTRY_PREFERENCE_COOKIE}=${pref};path=/;max-age=${COUNTRY_PREFERENCE_COOKIE_MAX_AGE};SameSite=Lax`;
    document.cookie = `${GLOBAL_REGION_COOKIE}=${countryPreferenceToGlobalRegion(pref)};path=/;max-age=${GLOBAL_REGION_COOKIE_MAX_AGE};SameSite=Lax`;
  } catch {
    /* ignore */
  }
}

export function readCountryPreferenceStorage(): CountryPreference | null {
  try {
    const raw = typeof localStorage !== "undefined"
      ? localStorage.getItem(COUNTRY_PREFERENCE_STORAGE_KEY)
      : null;
    return parseCountryPreference(raw);
  } catch {
    return null;
  }
}

export function writeCountryPreferenceStorage(pref: CountryPreference): void {
  try {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(COUNTRY_PREFERENCE_STORAGE_KEY, pref);
    }
  } catch {
    /* ignore */
  }
}

/** Persist the preference to localStorage + cookie (both written atomically). */
export function persistCountryPreference(pref: CountryPreference): void {
  writeCountryPreferenceStorage(pref);
  writeCountryPreferenceCookie(pref);
}

/** Read the most recent client-side preference (cookie wins over localStorage). */
export function resolveClientCountryPreference(): CountryPreference | null {
  return readCountryPreferenceCookie() ?? readCountryPreferenceStorage();
}
