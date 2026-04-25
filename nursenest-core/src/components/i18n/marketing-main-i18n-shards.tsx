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

const MARKETING_MAIN_SHARDS_TIMEOUT_MS = 2600;

function safeTrace(...args: any[]) {
  try {
    layoutStderrTrace(...args);
  } catch {}
}

function safeMerge(base: MarketingMessages, overrides?: Record<string, string>) {
  try {
    return mergeMarketingMessagesWithPublicOverrides(base, overrides);
  } catch {
    return base;
  }
}

function safeSyncLoad(locale: string): MarketingMessages {
  try {
    return loadMarketingMessageShardsSync(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS);
  } catch {
    return {};
  }
}

async function safeAsyncLoad(locale: string): Promise<MarketingMessages> {
  try {
    return (
      (await safeAwait(
        loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS),
        `marketing_main:${locale}`,
        MARKETING_MAIN_SHARDS_TIMEOUT_MS,
      )) ?? {}
    );
  } catch {
    return {};
  }
}

function MarketingMainI18nShardsStreamingFallback({
  locale,
  children,
  publicContentOverrides,
}: {
  locale: string;
  children: ReactNode;
  publicContentOverrides?: Record<string, string>;
}) {
  safeTrace("marketing_main", "fallback", { locale });

  const primary = safeSyncLoad(locale);
  const fallback =
    locale === DEFAULT_MARKETING_LOCALE ? undefined : safeSyncLoad(DEFAULT_MARKETING_LOCALE);

  return (
    <MarketingI18nShardLayer
      messages={safeMerge(primary, publicContentOverrides)}
      fallbackMessages={fallback ? safeMerge(fallback, publicContentOverrides) : undefined}
    >
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
  safeTrace("marketing_main", "deferred_start", { locale });

  const primary = await safeAsyncLoad(locale);
  const fallback =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : await safeAsyncLoad(DEFAULT_MARKETING_LOCALE);

  safeTrace("marketing_main", "deferred_done", {
    locale,
    primary: Object.keys(primary).length,
    fallback: fallback ? Object.keys(fallback).length : 0,
  });

  return (
    <MarketingI18nShardLayer
      messages={safeMerge(primary, publicContentOverrides)}
      fallbackMessages={fallback ? safeMerge(fallback, publicContentOverrides) : undefined}
    >
      {children}
    </MarketingI18nShardLayer>
  );
}

export function MarketingMainI18nShards({
  locale,
  children,
  publicContentOverrides,
}: {
  locale: string;
  children: ReactNode;
  publicContentOverrides?: Record<string, string>;
}) {
  return (
    <Suspense
      fallback={
        <MarketingMainI18nShardsStreamingFallback
          locale={locale}
          publicContentOverrides={publicContentOverrides}
        >
          {children}
        </MarketingMainI18nShardsStreamingFallback>
      }
    >
      <MarketingMainI18nShardsDeferred
        locale={locale}
        publicContentOverrides={publicContentOverrides}
      >
        {children}
      </MarketingMainI18nShardsDeferred>
    </Suspense>
  );
}