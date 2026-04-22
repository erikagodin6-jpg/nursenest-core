import { Suspense, type ReactNode } from "react";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { MARKETING_PAGE_BODY_MESSAGE_SHARDS } from "@/lib/marketing-i18n/marketing-i18n-shard-groups";
import {
  loadMarketingMessageShards,
  loadMarketingMessageShardsSync,
} from "@/lib/marketing-i18n/load-marketing-message-shards";
import { safeAwait } from "@/lib/async/safe-await";
import { mergeMarketingMessagesWithPublicOverrides } from "@/lib/marketing/merge-marketing-messages-with-public-overrides";
import { layoutStderrTrace } from "@/lib/observability/layout-stderr-trace";

/** Must exceed `MARKETING_SHARD_ASYNC_FACTORY_BUDGET_MS` in `load-marketing-message-shards.ts` (2500). */
const MARKETING_MAIN_SHARDS_TIMEOUT_MS = 2600;

/** Dedupe dev/build stderr traces — shard loads are already singleton via `loadSharedMarketingMessagesOnce`. */
const marketingMainShardTraceLogged = new Set<string>();

/**
 * First paint for `<main>`: sync `pages` merge (warms `mergedShardCache`) so hero/body copy is
 * correct while the deferred segment runs telemetry + shared async dedupe.
 */
function MarketingMainI18nShardsStreamingFallback({
  locale,
  children,
  publicContentOverrides,
}: {
  locale: string;
  children: ReactNode;
  publicContentOverrides?: Record<string, string>;
}) {
  const traceKey = `fallback:${locale}`;
  if (!marketingMainShardTraceLogged.has(traceKey)) {
    marketingMainShardTraceLogged.add(traceKey);
    layoutStderrTrace("marketing_main_shards", "marketing main shards streaming fallback (sync pages)", {
      route: "shared-marketing-main",
      locale,
    });
  }
  let primary: MarketingMessages = {};
  let fallback: MarketingMessages | undefined;
  try {
    primary = loadMarketingMessageShardsSync(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
    fallback =
      locale === DEFAULT_MARKETING_LOCALE
        ? undefined
        : loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
  } catch (e) {
    layoutStderrTrace("marketing_main_shards", "marketing_main_shards_sync_pages_failed", {
      route: "shared-marketing-main",
      locale,
      error: e instanceof Error ? e.message.slice(0, 240) : String(e).slice(0, 240),
    });
    primary = {};
    fallback =
      locale === DEFAULT_MARKETING_LOCALE
        ? undefined
        : (() => {
            try {
              return loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
            } catch (inner) {
              layoutStderrTrace("marketing_main_shards", "marketing_main_shards_sync_en_fallback_failed", {
                route: "shared-marketing-main",
                locale,
                error: inner instanceof Error ? inner.message.slice(0, 240) : String(inner).slice(0, 240),
              });
              return {};
            }
          })();
  }
  const mergedPrimary = mergeMarketingMessagesWithPublicOverrides(primary, publicContentOverrides);
  const mergedFallback = fallback
    ? mergeMarketingMessagesWithPublicOverrides(fallback, publicContentOverrides)
    : undefined;
  return (
    <MarketingI18nShardLayer messages={mergedPrimary} fallbackMessages={mergedFallback}>
      {children}
    </MarketingI18nShardLayer>
  );
}

async function MarketingMainI18nShardsDeferred({
  locale,
  children,
  publicContentOverrides,
}: {
  locale: string;
  children: ReactNode;
  publicContentOverrides?: Record<string, string>;
}) {
  const traceKeyStart = `deferred_start:${locale}`;
  if (!marketingMainShardTraceLogged.has(traceKeyStart)) {
    marketingMainShardTraceLogged.add(traceKeyStart);
    layoutStderrTrace("marketing_main_shards", "marketing main shards deferred start", {
      route: "shared-marketing-main",
      locale,
    });
  }
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
  const traceKeyAfter = `deferred_after:${locale}`;
  if (!marketingMainShardTraceLogged.has(traceKeyAfter)) {
    marketingMainShardTraceLogged.add(traceKeyAfter);
    layoutStderrTrace("marketing_main_shards", "marketing main shards deferred after load", {
      route: "shared-marketing-main",
      locale,
      primaryCount: Object.keys(primary).length,
      fallbackCount: fallback ? Object.keys(fallback).length : 0,
    });
  }
  const mergedPrimary = mergeMarketingMessagesWithPublicOverrides(primary, publicContentOverrides);
  const mergedFallback = fallback
    ? mergeMarketingMessagesWithPublicOverrides(fallback, publicContentOverrides)
    : undefined;
  return (
    <MarketingI18nShardLayer messages={mergedPrimary} fallbackMessages={mergedFallback}>
      {children}
    </MarketingI18nShardLayer>
  );
}

/**
 * Server-only: merges `pages.*` under `<main>` while layout keeps chrome-only shards.
 * Uses `Suspense` so the route shell can stream before the async shard segment finishes; the
 * fallback uses the same `pages` JSON via sync load (shared `mergedShardCache` with the async path).
 */
export function MarketingMainI18nShards({
  locale,
  children,
  publicContentOverrides,
}: {
  locale: string;
  children: ReactNode;
  /** Merged after `pages` shard JSON — allowlisted keys only (see marketing-public-content-policy). */
  publicContentOverrides?: Record<string, string>;
}) {
  return (
    <Suspense
      fallback={
        <MarketingMainI18nShardsStreamingFallback locale={locale} publicContentOverrides={publicContentOverrides}>
          {children}
        </MarketingMainI18nShardsStreamingFallback>
      }
    >
      <MarketingMainI18nShardsDeferred locale={locale} publicContentOverrides={publicContentOverrides}>
        {children}
      </MarketingMainI18nShardsDeferred>
    </Suspense>
  );
}
