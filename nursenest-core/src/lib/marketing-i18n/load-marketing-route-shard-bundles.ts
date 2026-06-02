import "server-only";

import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { loadMarketingMessageShards } from "@/lib/marketing-i18n/load-marketing-message-shards";
import {
  MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
  MARKETING_PAGE_BODY_MESSAGE_SHARDS,
} from "@/lib/marketing-i18n/marketing-i18n-shard-groups";

/**
 * Safe caches
 */
const pageBodyCache = new Map<
  string,
  Promise<{ primary: MarketingMessages; en: MarketingMessages }>
>();

const layoutOverlayCache = new Map<string, Promise<MarketingMessages>>();

/**
 * SAFE: page body + EN fallback
 */
export async function loadMarketingPageBodyWithEnFallback(
  locale: string,
): Promise<{ primary: MarketingMessages; en: MarketingMessages }> {
  let cached = pageBodyCache.get(locale);

  if (!cached) {
    cached = (async () => {
      try {
        const primary =
          (await loadMarketingMessageShards(
            locale,
            MARKETING_PAGE_BODY_MESSAGE_SHARDS,
          )) ?? {};

        const en =
          locale === DEFAULT_MARKETING_LOCALE
            ? primary
            : (await loadMarketingMessageShards(
                DEFAULT_MARKETING_LOCALE,
                MARKETING_PAGE_BODY_MESSAGE_SHARDS,
              )) ?? {};

        return { primary, en };
      } catch {
        return { primary: {}, en: {} };
      }
    })();

    pageBodyCache.set(locale, cached);
  }

  return cached;
}

/**
 * SAFE: layout overlay
 */
export async function loadMarketingLayoutShardsOverlay(
  locale: string,
): Promise<MarketingMessages> {
  let cached = layoutOverlayCache.get(locale);

  if (!cached) {
    cached = (async () => {
      try {
        const base =
          (await loadMarketingMessageShards(
            DEFAULT_MARKETING_LOCALE,
            MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
          )) ?? {};

        if (locale === DEFAULT_MARKETING_LOCALE) {
          return base;
        }

        const overlay =
          (await loadMarketingMessageShards(
            locale,
            MARKETING_DEFAULT_LAYOUT_MESSAGE_SHARDS,
          )) ?? {};

        return { ...base, ...overlay };
      } catch {
        return {};
      }
    })();

    layoutOverlayCache.set(locale, cached);
  }

  return cached;
}