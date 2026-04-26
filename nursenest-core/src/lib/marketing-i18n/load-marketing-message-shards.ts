import "server-only";

import path from "path";
import { existsSync, readFileSync } from "fs";

import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import type { I18nShardFilename } from "@shared/i18n-shard-policy";

/**
 * VERY SAFE i18n loader
 * - never throws
 * - never blocks
 * - always returns something
 * - works in standalone builds
 */

const DEFAULT_LOCALE = "en";

/**
 * Resolve i18n directory safely across environments
 */
function resolveI18nDir(): string | null {
  try {
    const env = process.env.NN_MARKETING_I18N_DIR;
    if (env && existsSync(env)) return env;

    const candidates = [
      path.join(process.cwd(), "public", "i18n"),
      path.join(process.cwd(), ".next", "static", "i18n"),
      path.join(process.cwd(), "i18n"),
    ];

    const main = process.argv[1];
    if (main) {
      const entry = path.dirname(main);
      candidates.push(path.join(entry, "public", "i18n"));
      candidates.push(path.join(entry, ".next", "static", "i18n"));
    }

    for (const p of candidates) {
      try {
        if (existsSync(p)) return p;
      } catch {}
    }

    console.warn("[i18n] directory not found, fallback to empty");
    return null;
  } catch (err) {
    console.error("[i18n] resolve failed", err);
    return null;
  }
}

/**
 * Load shard file safely
 */
function readShard(
  baseDir: string,
  locale: string,
  shard: I18nShardFilename
): Record<string, string> {
  try {
    const file = path.join(baseDir, locale, `${shard}.json`);
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
    const dir = resolveI18nDir();
    if (!dir) return {};

    const safeLocale = locale || DEFAULT_LOCALE;

    const merged = mergeShards(dir, safeLocale, shards);

    // fallback to default locale if empty
    if (Object.keys(merged).length === 0 && safeLocale !== DEFAULT_LOCALE) {
      return mergeShards(dir, DEFAULT_LOCALE, shards);
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