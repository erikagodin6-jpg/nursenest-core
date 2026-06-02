import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import type { I18nShardFilename } from "@/lib/i18n/i18n-shard-policy";

/**
 * VERY SAFE i18n shard loader
 * - never throws
 * - never blocks indefinitely (callers wrap with timeout)
 * - always returns something (empty object as worst-case)
 * - bounded to a single deterministic directory so Turbopack/NFT tracing stays stable
 */

const DEFAULT_LOCALE = "en";

/**
 * Canonical marketing i18n root. Production standalone builds copy `public/i18n`
 * alongside the standalone output, so `process.cwd()` is sufficient. An explicit
 * `NN_I18N_DIR` override is available for tests or bespoke environments.
 */
const ENV_I18N_DIR = process.env.NN_I18N_DIR?.trim();
const I18N_DIR = ENV_I18N_DIR ? path.resolve(ENV_I18N_DIR) : path.join(process.cwd(), "public", "i18n");

/** Cached existence check so repeated lookups avoid touching the filesystem. */
let _resolvedI18nDir: string | null | undefined = undefined;
const shardCache = new Map<string, Record<string, string>>();
const mergedShardCache = new Map<string, MarketingMessages>();

function resolveI18nDir(): string | null {
  if (_resolvedI18nDir !== undefined) return _resolvedI18nDir;

  try {
    if (existsSync(I18N_DIR)) {
      _resolvedI18nDir = I18N_DIR;
      return _resolvedI18nDir;
    }
  } catch {
    // ignore and fall through to null logging below
  }

  _resolvedI18nDir = null;
  try {
    process.stderr.write(
      `[nn-i18n] public/i18n not found at expected path: ${I18N_DIR}. ` +
        "Shard loading will use English defaults.\n",
    );
  } catch {
    // ignore logging failure
  }
  return null;
}

/**
 * Load a single shard file safely. Returns empty object if file is missing or invalid.
 */
function readShard(
  baseDir: string,
  locale: string,
  shard: I18nShardFilename
): Record<string, string> {
  const cacheKey = `${baseDir}:${locale}:${shard}`;
  const cached = shardCache.get(cacheKey);
  if (cached) return cached;

  try {
    const file = path.join(baseDir, locale, `${shard}.json`);
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    const data = parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
    shardCache.set(cacheKey, data);
    return data;
  } catch {
    const empty: Record<string, string> = {};
    shardCache.set(cacheKey, empty);
    return empty;
  }
}

/**
 * Merge multiple shards from a base directory into a single messages record.
 */
function mergeShards(
  baseDir: string,
  locale: string,
  shards: readonly I18nShardFilename[]
): MarketingMessages {
  const cacheKey = `${baseDir}:${locale}:${shards.join("|")}`;
  const cached = mergedShardCache.get(cacheKey);
  if (cached) return cached;

  const result: MarketingMessages = {};
  for (const shard of shards) {
    const data = readShard(baseDir, locale, shard);
    Object.assign(result, data);
  }
  mergedShardCache.set(cacheKey, result);
  return result;
}

/**
 * Synchronous shard loader — safe, never throws, returns empty object on all error paths.
 * Falls back to English default locale if the requested locale has no content.
 */
export function loadMarketingMessageShardsSync(
  locale: string,
  shards: readonly I18nShardFilename[]
): MarketingMessages {
  try {
    const dir = resolveI18nDir();
    if (!dir) return {};

    const safeLocale = locale || DEFAULT_LOCALE;
    const merged = mergeShards(dir, safeLocale, shards);

    if (Object.keys(merged).length === 0 && safeLocale !== DEFAULT_LOCALE) {
      return mergeShards(dir, DEFAULT_LOCALE, shards);
    }

    return merged;
  } catch {
    return {};
  }
}

/**
 * Async wrapper — never throws, always resolves.
 */
export async function loadMarketingMessageShards(
  locale: string,
  shards: readonly I18nShardFilename[]
): Promise<MarketingMessages> {
  try {
    return loadMarketingMessageShardsSync(locale, shards);
  } catch {
    return {};
  }
}

/**
 * Alias for backward compatibility.
 */
export function getMarketingShardBundle(
  locale: string,
  shards: readonly I18nShardFilename[]
): Promise<MarketingMessages> {
  return loadMarketingMessageShards(locale, shards);
}
