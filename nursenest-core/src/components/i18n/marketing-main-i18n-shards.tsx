import type { ReactNode } from "react";
import { headers } from "next/headers";
import { MarketingI18nShardLayer } from "@/components/i18n/marketing-i18n-provider";
import { BreadcrumbJsonLd } from "@/components/seo/breadcrumb-json-ld";
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
import { buildMarketingRouteBreadcrumbItems } from "@/lib/seo/marketing-route-breadcrumbs";

const MARKETING_MAIN_SHARDS_TIMEOUT_MS = 2600;

function safeTrace(scope: string, label: string, meta?: Record<string, unknown>) {
  try {
    layoutStderrTrace(scope, label, meta);
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

async function readMarketingRequestPathname(): Promise<string> {
  try {
    return (await headers()).get("x-nn-request-pathname")?.trim() ?? "/";
  } catch {
    return "/";
  }
}

async function loadPrimaryAndFallback(locale: string): Promise<{
  primary: MarketingMessages;
  fallback: MarketingMessages | undefined;
}> {
  safeTrace("marketing_main", "load_start", { locale });

  let primary =
    (await safeAwait(
      loadMarketingMessageShards(locale, MARKETING_PAGE_BODY_MESSAGE_SHARDS),
      `marketing_main:${locale}`,
      MARKETING_MAIN_SHARDS_TIMEOUT_MS,
    )) ?? {};

  if (Object.keys(primary).length === 0) {
    primary = safeSyncLoad(locale);
  }

  let fallbackMessages: MarketingMessages | undefined =
    locale === DEFAULT_MARKETING_LOCALE
      ? undefined
      : ((await safeAwait(
          loadMarketingMessageShards(DEFAULT_MARKETING_LOCALE, MARKETING_PAGE_BODY_MESSAGE_SHARDS),
          "marketing_main:en",
          MARKETING_MAIN_SHARDS_TIMEOUT_MS,
        )) ?? {});

  if (locale !== DEFAULT_MARKETING_LOCALE && Object.keys(fallbackMessages ?? {}).length === 0) {
    fallbackMessages = safeSyncLoad(DEFAULT_MARKETING_LOCALE);
  }

  safeTrace("marketing_main", "load_done", {
    locale,
    primary: Object.keys(primary).length,
    fallback: fallbackMessages ? Object.keys(fallbackMessages).length : 0,
  });

  return {
    primary,
    fallback: locale === DEFAULT_MARKETING_LOCALE ? undefined : fallbackMessages,
  };
}

/**
 * Merges page-body marketing shards (`pages` JSON) into the parent chrome provider.
 *
 * **Single `{children}` render:** Previously this used `<Suspense>` with the same
 * `{children}` in both the fallback and the deferred branch, which could duplicate
 * the homepage (and other routes) in streamed HTML / hydration. Loads are awaited
 * here once, then one `MarketingI18nShardLayer` wraps the segment page.
 *
 * **`trailingChrome`:** Pass `SiteFooter` here (not as a layout sibling after `<main>`)
 * so the footer does not stream in HTML before deferred main content — fixes `/`
 * showing footer blocks above the hero during RSC streaming.
 */
export async function MarketingMainI18nShards({
  locale,
  children,
  publicContentOverrides,
  trailingChrome,
}: {
  locale: string;
  children: ReactNode;
  publicContentOverrides?: Record<string, string>;
  /** e.g. `<SiteFooter />` — rendered only after shard load, after `{children}`. */
  trailingChrome?: ReactNode;
}) {
  const [{ primary, fallback }, requestPathname] = await Promise.all([
    loadPrimaryAndFallback(locale),
    readMarketingRequestPathname(),
  ]);
  const breadcrumbItems = buildMarketingRouteBreadcrumbItems(requestPathname);

  return (
    <MarketingI18nShardLayer
      messages={safeMerge(primary, publicContentOverrides)}
      fallbackMessages={fallback ? safeMerge(fallback, publicContentOverrides) : undefined}
    >
      {breadcrumbItems.length > 0 ? <BreadcrumbJsonLd items={breadcrumbItems} /> : null}
      {children}
      {trailingChrome}
    </MarketingI18nShardLayer>
  );
}
