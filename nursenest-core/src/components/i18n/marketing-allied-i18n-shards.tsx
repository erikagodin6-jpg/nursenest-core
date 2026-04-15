import type { ReactNode } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";

/** Server-only: merges `allied.*` copy for `/allied-health/*` without loading it on every marketing route. */
export async function MarketingAlliedI18nShards({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const primary = await loadMarketingMessageShards(locale, MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS);
  const fallback =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS);
  return (
    <MarketingI18nShardLayer messages={primary} fallbackMessages={fallback}>
      {children}
    </MarketingI18nShardLayer>
  );
}
