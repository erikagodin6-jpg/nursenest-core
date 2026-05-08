import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

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

function marketingI18nRootCandidates(): string[] {
  return Array.from(
    new Set([
      path.resolve(process.cwd(), "public", "i18n"),
      path.resolve(process.cwd(), "nursenest-core", "public", "i18n"),
      path.resolve(process.cwd(), ".next", "static", "i18n"),
      path.resolve(process.cwd(), "..", "client", "public", "i18n"),
    ]),
  );
}

function hasEnglishMarketingShardTree(root: string): boolean {
  try {
    return existsSync(path.join(root, "en", "pages.json"));
  } catch {
    return false;
  }
}

/**
 * Resolves the directory that contains shard JSON (`en/pages.json`, …).
 * Prefers a tree with real shards so empty `.next/static/i18n` does not win.
 */
export function resolveMarketingShardI18nRoot(): string {
  for (const candidate of marketingI18nRootCandidates()) {
    const resolved = path.resolve(candidate);
    if (hasEnglishMarketingShardTree(resolved)) return resolved;
  }

  for (const candidate of marketingI18nRootCandidates()) {
    try {
      if (existsSync(path.resolve(candidate))) return path.resolve(candidate);
    } catch {
      /* noop */
    }
  }

  return path.resolve(process.cwd(), "public", "i18n");
}

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

export function loadMarketingMessageShardsSync(
  locale: string,
  shards: readonly I18nShardFilename[]
): MarketingMessages {
  try {
    const safeLocale = locale || DEFAULT_LOCALE;
    const baseDir = resolveMarketingShardI18nRoot();
    const merged = mergeShards(baseDir, safeLocale, shards);
    if (Object.keys(merged).length === 0 && safeLocale !== DEFAULT_LOCALE) {
      return mergeShards(baseDir, DEFAULT_LOCALE, shards);
    }
    return merged;
  } catch {
    return {};
  }
}

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

export function getMarketingShardBundle(
  locale: string,
  shards: readonly I18nShardFilename[]
): Promise<MarketingMessages> {
  return loadMarketingMessageShards(locale, shards);
}
