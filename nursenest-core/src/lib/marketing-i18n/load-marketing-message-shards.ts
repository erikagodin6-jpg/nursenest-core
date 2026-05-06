import "server-only";

import { existsSync, readFileSync } from "node:fs";

import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import type { I18nShardFilename } from "@/lib/i18n/i18n-shard-policy";

/**
 * VERY SAFE i18n loader
 * - never throws
 * - never blocks
 * - always returns something
 * - works in standalone builds
 */

const DEFAULT_LOCALE = "en";

const I18N_DIR = /* turbopackIgnore: true */ `${process.cwd()}/public/i18n`;

/**
 * Load shard file safely
 */
function readShard(
  baseDir: string,
  locale: string,
  shard: I18nShardFilename
): Record<string, string> {
  try {
    const file = `${baseDir}/${locale}/${shard}.json`;
    if (!existsSync(file)) return {};
    const parsed = JSON.parse(readFileSync(file, "utf8"));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, string>)
      : {};
  } catch {
    return {};
  }
}

/**
 * Merge shards
 */
function mergeShards(
  baseDir: string,
  locale: string,
  shards: readonly I18nShardFilename[]
): MarketingMessages {
  const result: MarketingMessages = {};

  for (const shard of shards) {
    const data = readShard(baseDir, locale, shard);
    Object.assign(result, data);
  }

  return result;
}

/**
 * PUBLIC API — SAFE
 */
export function loadMarketingMessageShardsSync(
  locale: string,
  shards: readonly I18nShardFilename[]
): MarketingMessages {
  try {
    const safeLocale = locale || DEFAULT_LOCALE;

    const merged = mergeShards(I18N_DIR, safeLocale, shards);

    // fallback to default locale if empty
    if (Object.keys(merged).length === 0 && safeLocale !== DEFAULT_LOCALE) {
      return mergeShards(I18N_DIR, DEFAULT_LOCALE, shards);
    }

    return merged;
  } catch {
    return {};
  }
}

/**
 * Async wrapper (never throws)
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
 * Alias
 */
export function getMarketingShardBundle(
  locale: string,
  shards: readonly I18nShardFilename[]
): Promise<MarketingMessages> {
  return loadMarketingMessageShards(locale, shards);
}