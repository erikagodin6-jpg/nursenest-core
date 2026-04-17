import { isLocaleSeoIndexable } from "@/lib/i18n/language-readiness";
import { isCoreHostedNonDefaultLocale } from "@/lib/i18n/marketing-locale-policy";

/**
 * Partial-tier localized routes ship `noindex` and are omitted from `/sitemap.xml` — not a regression.
 */
export function isExpectedNoindexLocalizedMarketingPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length === 0) return false;
  const first = parts[0];
  if (!isCoreHostedNonDefaultLocale(first)) return false;
  return !isLocaleSeoIndexable(first);
}
