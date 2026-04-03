import "server-only";

import { cookies } from "next/headers";
import {
  MARKETING_LOCALE_COOKIE,
  normalizePreferredMarketingLocale,
} from "@/lib/i18n/marketing-locale-cookie";

/**
 * Active marketing UI locale on `(marketing)/(default)` routes (unprefixed URLs like `/`, `/pricing`,
 * `/login`, and exam hubs `/us/…`, `/canada/…`).
 *
 * Source of truth: `MARKETING_LOCALE_COOKIE`, set by the language picker, `/[locale]/…` layouts, and
 * `preferMarketingLocale`. When absent or invalid, {@link normalizePreferredMarketingLocale} returns English.
 */
export async function getMarketingLocaleForDefaultRoute(): Promise<string> {
  const jar = await cookies();
  return normalizePreferredMarketingLocale(jar.get(MARKETING_LOCALE_COOKIE)?.value);
}
