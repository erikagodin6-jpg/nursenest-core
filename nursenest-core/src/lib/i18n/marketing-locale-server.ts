import "server-only";

import { cookies } from "next/headers";
import { MARKETING_LOCALE_COOKIE, normalizePreferredMarketingLocale } from "@/lib/i18n/marketing-locale-cookie";

/** Active marketing UI locale on unprefixed `(default)` routes (from preference cookie). */
export async function getMarketingLocaleForDefaultRoute(): Promise<string> {
  const jar = await cookies();
  return normalizePreferredMarketingLocale(jar.get(MARKETING_LOCALE_COOKIE)?.value);
}
