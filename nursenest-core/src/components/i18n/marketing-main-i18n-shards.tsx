import type { ReactNode } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import { safeAwait } from "@/lib/async/safe-await";
import { renderTrace } from "@/lib/observability/render-trace";

const MARKETING_MAIN_SHARDS_TIMEOUT_MS = 1200;

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
  renderTrace("marketing main shards start", { route: "shared-marketing-main", locale });
  const primary =
    (await safeAwait(
      loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS),
      `marketing_main_shards.primary:${locale}`,
      MARKETING_MAIN_SHARDS_TIMEOUT_MS,
    )) ?? {};
  const fallback =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : ((await safeAwait(
          loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS),
          `marketing_main_shards.fallback:${DEFAULT_MARKETING_LOCALE}`,
          MARKETING_MAIN_SHARDS_TIMEOUT_MS,
        )) ?? undefined);
  renderTrace("marketing main shards after load", {
    route: "shared-marketing-main",
    locale,
    primaryCount: Object.keys(primary).length,
    fallbackCount: fallback ? Object.keys(fallback).length : 0,
  });
  return (
    <MarketingI18nShardLayer messages={primary} fallbackMessages={fallback}>
      {children}
    </MarketingI18nShardLayer>
  );
}
