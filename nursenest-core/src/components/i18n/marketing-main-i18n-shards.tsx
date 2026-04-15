import type { ReactNode } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";

/**
 * Server-only: loads `pages.*` shard(s) and merges them into i18n context for subtree (typically `<main>`).
 * Keeps header/footer on the smaller chrome bundle from the parent layout.
 */
export async function MarketingMainI18nShards({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const primary = await loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
  const fallback =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
  return (
    <MarketingI18nShardLayer messages={primary} fallbackMessages={fallback}>
      {children}
    </MarketingI18nShardLayer>
  );
}
