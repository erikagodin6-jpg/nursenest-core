import "server-only";
import { existsSync, statSync } from "fs";
import path from "path";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { isSentryServerRuntimeEnabled } from "@/lib/observability/sentry-flags";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { I18nShardFilename } from "@shared/i18n-shard-policy";
import { readCachedI18nJsonFile } from "@/lib/i18n/i18n-translation-cache";
import { loadSharedMarketingMessagesOnce } from "@/lib/marketing-i18n/shared-marketing-message-cache";
import { shouldBypassMarketingI18nAtStartup } from "@/lib/marketing-i18n/marketing-i18n-startup";

const mergedShardCache = new Map<string, MarketingMessages>();

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

function mergeShardMaps(
  i18nDir: string,
  locale: string,
  shards: readonly I18nShardFilename[],
): MarketingMessages {
  const cacheKey = `${locale}|${shards.join(",")}`;
  const cached = mergedShardCache.get(cacheKey);
  if (cached) return cached;

  const localeShardDir = path.join(i18nDir, locale);
  const hasShardTree = existsSync(localeShardDir) && statSync(localeShardDir).isDirectory();
  if (hasShardTree) {
    const merged: MarketingMessages = {};
    for (const name of shards) {
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
    }
    mergedShardCache.set(cacheKey, merged);
    return merged;
  }
  const legacy = tryReadLegacyLocaleBundle(i18nDir, locale);
  if (legacy && Object.keys(legacy).length > 0) {
    mergedShardCache.set(cacheKey, legacy);
    return legacy;
  }
  const empty: MarketingMessages = {};
  mergedShardCache.set(cacheKey, empty);
  return empty;
}

/**
 * Loads only the requested shard files for a locale (filesystem / public CDN mirror).
 * Does not fetch every locale or the full merged bundle.
 */
export function loadMarketingMessageShardsSync(
  locale: string,
  shards: readonly I18nShardFilename[],
): MarketingMessages {
  const dir = resolveNextI18nPublicDir();
  if (!dir) return {};
  return mergeShardMaps(dir, locale, shards);
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
  });
}

/** Canonical async entry — same implementation as {@link loadMarketingMessageShards}. */
export function getMarketingShardBundle(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<MarketingMessages> {
  return loadMarketingMessageShards(locale, shards);
}
