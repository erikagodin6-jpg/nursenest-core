import "server-only";

import { loadMarketingPublicContentOverridesForLocale } from "@/lib/marketing/load-marketing-public-content-overrides";
import { normalizeResolvedMarketingLeaf } from "@/lib/marketing-i18n/marketing-message-value-policy";

const HEADLINE_KEY = "marketing.globalRoot.headline" as const;

/** Registry-sourced marketing lines that may be overridden by DB (`marketing.*` keys). */
export async function resolveRegistryMarketingHeadline(
  locale: string,
  defaultHeadline: string,
): Promise<string> {
  const map = await loadMarketingPublicContentOverridesForLocale(locale);
  const v = map[HEADLINE_KEY];
  if (typeof v !== "string") return defaultHeadline;
  const normalized = normalizeResolvedMarketingLeaf(v, HEADLINE_KEY);
  return normalized !== undefined && normalized.trim().length > 0 ? normalized : defaultHeadline;
}
