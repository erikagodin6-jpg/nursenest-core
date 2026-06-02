"use server";

import { cookies } from "next/headers";
import { DEFAULT_MARKETING_LOCALE, isMarketingLocaleCode } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_LOCALE_COOKIE, MARKETING_LOCALE_COOKIE_MAX_AGE } from "@/lib/i18n/marketing-locale-cookie";

/**
 * Sets or clears the marketing UI locale cookie. Layout + server pages read this on `(default)` routes.
 * Call `router.refresh()` (and optionally `router.push` off `/[locale]/…`) from the client afterward.
 */
export async function preferMarketingLocale(locale: string): Promise<{ ok: boolean }> {
  if (!isMarketingLocaleCode(locale)) return { ok: false };
  const jar = await cookies();
  if (locale === DEFAULT_MARKETING_LOCALE) {
    jar.delete(MARKETING_LOCALE_COOKIE);
  } else {
    jar.set(MARKETING_LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: MARKETING_LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: true,
    });
  }
  return { ok: true };
}
