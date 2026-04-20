import "server-only";
import { existsSync, statSync } from "fs";
import path from "path";
import { safeAwait } from "@/lib/async/safe-await";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { I18nShardFilename } from "@shared/i18n-shard-policy";
import { readCachedI18nJsonFile } from "@/lib/i18n/i18n-translation-cache";
import { loadSharedMarketingMessagesOnce } from "@/lib/marketing-i18n/shared-marketing-message-cache";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";
import { coerceFlatMessageValue } from "@/lib/marketing-i18n/safe-marketing-messages";

const mergedShardCache = new Map<string, MarketingMessages>();

/**
 * Hard cap for the async work inside `loadSharedMarketingMessagesOnce` (Sentry span + shard impl).
 * On timeout we sync-fallback so the **deduped promise always settles** (never wedges waiters).
 *
 * Invariant: MUST be **strictly less** than every route-level `safeAwait(..., loadMarketingMessageShards(...))`
 * budget that can race the same deduped promise (e.g. homepage body 2800ms in `page.tsx`, metadata and
 * layout/main shard wrappers in `page.tsx`, `marketing-layout-chrome-messages.server.ts`,
 * `marketing-main-i18n-shards.tsx`). Then the shared promise completes before callers hit their outer timeout,
 * avoiding misleading `[timeout]` on the caller while the factory is still running.
 */
const MARKETING_SHARD_ASYNC_FACTORY_BUDGET_MS = 2500;

/**
 * Stable string key for process-wide shard dedupe (layout, metadata, routes).
 * Value-based on shard **names** only — not array identity — so callers can pass
 * fresh `readonly` arrays (e.g. `lessonsPageMessageShards()`) without bypassing the cache.
 */
function marketingShardsAsyncCacheKey(locale: string, shards: readonly I18nShardFilename[]): string {
  return `${locale}|${shards.join(",")}`;
}

/** Two cwd candidates — matches `load-marketing-messages.ts`. */
function resolveNextI18nPublicDir(): string | null {
  const candidates = [
    path.join(process.cwd(), "public", "i18n"),
    path.join(process.cwd(), "nursenest-core", "public", "i18n"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

/** Staff-only shards (not under `public/`). Matches `script/lib/next-public-i18n-bundle.ts`. */
function resolveAdminOnlyI18nDir(): string | null {
  const candidates = [
    path.join(process.cwd(), "nursenest-core", "i18n-admin-only"),
    path.join(process.cwd(), "i18n-admin-only"),
  ];
  for (const p of candidates) {
    if (existsSync(p)) return p;
  }
  return null;
}

function readShardFile(i18nDir: string, locale: string, shard: I18nShardFilename): Record<string, string> | null {
  if (shard === "admin") {
    const adminRoot = resolveAdminOnlyI18nDir();
    if (!adminRoot) return null;
    const fp = path.resolve(path.join(adminRoot, locale, "admin.json"));
    if (!existsSync(fp)) return null;
    return readCachedI18nJsonFile(fp, { locale, shard: "admin" });
  }
  const fp = path.resolve(path.join(i18nDir, locale, `${shard}.json`));
  if (!existsSync(fp)) return null;
  return readCachedI18nJsonFile(fp, { locale, shard });
}

/** Legacy monolithic `{locale}.json` (pre-shard deployments). */
function tryReadLegacyLocaleBundle(i18nDir: string, locale: string): MarketingMessages | null {
  const fp = path.resolve(path.join(i18nDir, `${locale}.json`));
  if (!existsSync(fp)) return null;
  return readCachedI18nJsonFile(fp, { locale, shard: "legacy" });
}

/** Best-effort: copy missing string keys from the default-locale merge (avoids partial shard trees). */
function fillMissingFromDefaultLocale(
  merged: MarketingMessages,
  i18nDir: string,
  locale: string,
  shards: readonly I18nShardFilename[],
): void {
  if (locale === DEFAULT_MARKETING_LOCALE) return;
  try {
    const enMap = mergeShardMaps(i18nDir, DEFAULT_MARKETING_LOCALE, shards);
    for (const [k, v] of Object.entries(enMap)) {
      if (coerceFlatMessageValue(merged[k]) === undefined) merged[k] = v;
    }
  } catch {
    /* ignore */
  }
}

function mergeShardMaps(
  i18nDir: string,
  locale: string,
  shards: readonly I18nShardFilename[],
): MarketingMessages {
  const cacheKey = `${locale}|${shards.join(",")}`;
  const cached = mergedShardCache.get(cacheKey);
  if (cached) return cached;

  try {
    const localeShardDir = path.join(i18nDir, locale);
    let hasShardTree = false;
    try {
      hasShardTree = existsSync(localeShardDir) && statSync(localeShardDir).isDirectory();
    } catch {
      hasShardTree = false;
    }

    if (hasShardTree) {
      const merged: MarketingMessages = {};
      for (const name of shards) {
        try {
          const part = readShardFile(i18nDir, locale, name);
          if (!part) continue;
          for (const [k, v] of Object.entries(part)) {
            if (k in merged && process.env.NODE_ENV === "development") {
              safeServerLog("i18n", "shard_duplicate_key_last_wins", {
                locale,
                shard: name,
                key: k.slice(0, 120),
              });
            }
            merged[k] = v;
          }
        } catch (e) {
          safeServerLog("i18n", "marketing_shard_file_failed", {
            locale,
            shard: String(name).slice(0, 40),
            errorName: e instanceof Error ? e.name.slice(0, 80) : "non_error",
          });
        }
      }
      fillMissingFromDefaultLocale(merged, i18nDir, locale, shards);
      mergedShardCache.set(cacheKey, merged);
      return merged;
    }

    const legacy = tryReadLegacyLocaleBundle(i18nDir, locale);
    if (legacy && Object.keys(legacy).length > 0) {
      const filled: MarketingMessages = { ...legacy };
      fillMissingFromDefaultLocale(filled, i18nDir, locale, shards);
      mergedShardCache.set(cacheKey, filled);
      return filled;
    }

    const empty: MarketingMessages = {};
    fillMissingFromDefaultLocale(empty, i18nDir, locale, shards);
    mergedShardCache.set(cacheKey, empty);
    return empty;
  } catch (e) {
    safeServerLog("i18n", "merge_shard_maps_failed", {
      locale,
      errorName: e instanceof Error ? e.name.slice(0, 80) : "non_error",
    });
    if (locale !== DEFAULT_MARKETING_LOCALE) {
      try {
        return mergeShardMaps(i18nDir, DEFAULT_MARKETING_LOCALE, shards);
      } catch {
        /* fall through */
      }
    }
    return {};
  }
}

/**
 * Loads only the requested shard files for a locale (filesystem / public CDN mirror).
 * Does not fetch every locale or the full merged bundle.
 */
export function loadMarketingMessageShardsSync(
  locale: string,
  shards: readonly I18nShardFilename[],
): MarketingMessages {
  try {
    const dir = resolveNextI18nPublicDir();
    if (!dir) return {};
    return mergeShardMaps(dir, locale, shards);
  } catch (e) {
    safeServerLog("i18n", "marketing_shard_sync_load_failed", {
      locale,
      errorName: e instanceof Error ? e.name.slice(0, 80) : "non_error",
    });
    if (locale !== DEFAULT_MARKETING_LOCALE) {
      try {
        const dir = resolveNextI18nPublicDir();
        if (!dir) return {};
        return mergeShardMaps(dir, DEFAULT_MARKETING_LOCALE, shards);
      } catch {
        return {};
      }
    }
    return {};
  }
}

async function loadMarketingMessageShardsImpl(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<MarketingMessages> {
  if (shouldBypassMarketingI18nAtStartup()) {
    safeServerLog("i18n", "marketing_i18n_startup_bypass", {
      locale,
      mode: "shards",
      shard_count: shards.length,
      fallbackLocale: DEFAULT_MARKETING_LOCALE,
    });
    return loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards);
  }
  return loadMarketingMessageShardsSync(locale, shards);
}

/**
 * Async shard loader — **single** process-wide dedupe via {@link loadSharedMarketingMessagesOnce}
 * (do not wrap in `React.cache()`: it keys on array identity and breaks dedupe when callers pass
 * freshly allocated shard arrays with the same logical list).
 */
export async function loadMarketingMessageShards(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<MarketingMessages> {
  const key = marketingShardsAsyncCacheKey(locale, shards);
  return loadSharedMarketingMessagesOnce(`marketing_shards:${key}`, async () => {
    const loadInner = async (): Promise<MarketingMessages> => {
      if (!isSentryServerRuntimeEnabled()) {
        return loadMarketingMessageShardsImpl(locale, shards);
      }
      const { withSentryServerSpan } = await import("@/lib/observability/sentry-route-observability");
      return withSentryServerSpan(
        {
          name: "marketing.i18n.load_shards",
          op: "resource.load",
          attributes: { locale, shardCount: shards.length },
        },
        () => loadMarketingMessageShardsImpl(locale, shards),
      );
    };

    const raced = await safeAwait(loadInner(), `marketing_shards.factory:${key}`, MARKETING_SHARD_ASYNC_FACTORY_BUDGET_MS);
    if (raced != null) return raced;
    try {
      return loadMarketingMessageShardsSync(locale, shards);
    } catch {
      return loadMarketingMessageShardsSync(DEFAULT_MARKETING_LOCALE, shards);
    }
  });
}

/** Canonical async entry — same implementation as {@link loadMarketingMessageShards}. */
export function getMarketingShardBundle(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<MarketingMessages> {
  return loadMarketingMessageShards(locale, shards);
}
