import type { ReactNode } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";

async function loadAlliedMessagesSafe(locale: string) {
  try {
    return await loadMarketingMessageShards(locale, MARKETING_ALLIED_VERTICAL_MESSAGE_SHARDS);
  } catch {
    return {};
  }
}

export async function MarketingAlliedI18nShards({
  locale,
  children,
}: {
  locale: string;
  children: ReactNode;
}) {
  const primary = await loadAlliedMessagesSafe(locale);

  const fallback =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : await loadAlliedMessagesSafe(DEFAULT_MARKETING_LOCALE);

  return (
    <MarketingI18nShardLayer messages={primary} fallbackMessages={fallback}>
      {children}
    </MarketingI18nShardLayer>
  );
}