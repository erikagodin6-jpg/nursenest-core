import "server-only";

import { loadMarketingPublicContentOverridesForLocale } from "@/lib/marketing/load-marketing-public-content-overrides";

/** Registry-sourced marketing lines that may be overridden by DB (`marketing.*` keys). */
export async function resolveRegistryMarketingHeadline(
  locale: string,
  defaultHeadline: string,
): Promise<string> {
  const map = await loadMarketingPublicContentOverridesForLocale(locale);
  const v = map["marketing.globalRoot.headline"];
  return typeof v === "string" && v.trim().length > 0 ? v : defaultHeadline;
}
