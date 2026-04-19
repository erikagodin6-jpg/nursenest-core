import "server-only";

import { cache } from "react";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  MARKETING_PAGE_BODY_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

/**
 * Loads only the `pages` shard for `locale`, plus English `pages` for missing-key resolution.
 * Prefer this over {@link loadMarketingMessages} when a route only needs `pages.*` keys.
 */
export const loadMarketingPageBodyWithEnFallback = cache(async function loadMarketingPageBodyWithEnFallback(
  locale: string,
): Promise<{ primary: MarketingMessages; en: MarketingMessages }> {
  const primary = (await loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS)) ?? {};
  const en =
    locale === DEFAULT_MARKETING_LOCALE
      ? primary
      : ((await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS)) ?? {});
  return { primary, en };
});

/**
 * English marketing chrome + `pages` shards, overlaid by the same shard set for `locale`.
 * Same intent as `{ ...enMessages, ...localeMessages }` from merged bundles, without loading monolith JSON.
 */
export const loadMarketingLayoutShardsOverlay = cache(async function loadMarketingLayoutShardsOverlay(
  locale: string,
): Promise<MarketingMessages> {
  const base =
    (await loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS)) ?? {};
  if (locale === DEFAULT_MARKETING_LOCALE) return base;
  const overlay = (await loadMarketingMessageShards(locale, MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS)) ?? {};
  return { ...base, ...overlay };
});
