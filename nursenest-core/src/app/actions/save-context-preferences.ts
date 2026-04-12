"use server";

/**
 * Server action to persist user context preferences.
 *
 * Saves preferred region, locale, profession, and exam to the user's
 * cookies (and optionally account when DB fields are available).
 *
 * Currently, the User model only has `country` (CA|US) and `tier` fields.
 * Until we add dedicated preference columns, we persist to cookies only
 * for the global context system and use the existing profile API for
 * country/tier changes.
 */

import { cookies } from "next/headers";
import { isGlobalRegionSlug, isGlobalLocaleCode } from "@/lib/i18n/global-regions";
import type { GlobalRegionSlug, GlobalLocaleCode } from "@/lib/i18n/global-regions";
import {
  GLOBAL_REGION_COOKIE,
  globalRegionSetCookieValue,
} from "@/lib/region/global-region-cookie";
import { MARKETING_LOCALE_COOKIE } from "@/lib/i18n/marketing-locale-cookie";

const PROFESSION_COOKIE = "nn_preferred_profession";
const EXAM_COOKIE = "nn_preferred_exam";
const COOKIE_MAX_AGE = 365 * 24 * 60 * 60; // 1 year

type SaveResult = { ok: boolean; error?: string };

export async function saveContextPreferences(input: {
  region?: string;
  locale?: string;
  profession?: string;
  exam?: string;
}): Promise<SaveResult> {
  try {
    const jar = await cookies();

    if (input.region) {
      if (!isGlobalRegionSlug(input.region)) {
        return { ok: false, error: "Invalid region" };
      }
      jar.set(GLOBAL_REGION_COOKIE, input.region, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }

    if (input.locale) {
      if (!isGlobalLocaleCode(input.locale)) {
        return { ok: false, error: "Invalid locale" };
      }
      jar.set(MARKETING_LOCALE_COOKIE, input.locale, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }

    if (input.profession) {
      jar.set(PROFESSION_COOKIE, input.profession, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }

    if (input.exam) {
      jar.set(EXAM_COOKIE, input.exam, {
        path: "/",
        maxAge: COOKIE_MAX_AGE,
        sameSite: "lax",
      });
    }

    return { ok: true };
  } catch {
    return { ok: false, error: "Failed to save preferences" };
  }
}
