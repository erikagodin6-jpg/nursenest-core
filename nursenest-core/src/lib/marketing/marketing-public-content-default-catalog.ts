import "server-only";

import { GLOBAL_ROOT_HOMEPAGE } from "@/lib/marketing/countries/registry";
import { loadMarketingMessageShardsSync } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  getMarketingPublicContentKeyDef,
  isMarketingPublicContentEditableKey,
} from "@/lib/marketing/marketing-public-content-policy";

/**
 * Catalog default for an allowlisted marketing public-content key (i18n shard or registry).
 * Used by admin diagnostics and API search; never bypasses the allowlist.
 */
export function getMarketingPublicContentDefaultCatalogValue(messageKey: string, locale: string): string {
  if (!isMarketingPublicContentEditableKey(messageKey)) return "";
  const def = getMarketingPublicContentKeyDef(messageKey);
  if (!def) return "";
  if (def.source === "registry" && messageKey === "marketing.globalRoot.headline") {
    return GLOBAL_ROOT_HOMEPAGE.headline;
  }
  const messages = loadMarketingMessageShardsSync(locale, ["marketing"]);
  const v = messages[messageKey];
  return typeof v === "string" ? v : "";
}
