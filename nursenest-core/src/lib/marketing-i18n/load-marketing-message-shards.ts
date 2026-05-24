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
 * - works in standalone builds via multi-root resolution
 *
 * Multi-root resolution strategy:
 *   1. process.cwd()/public/i18n  — primary; works in dev (package root CWD) and
 *                                   production standalone (.next/standalone CWD)
 *   2. process.cwd()/../public/i18n — secondary; handles monorepo CWD = workspace root
 *
 * process.cwd() is opaque to Turbopack/NFT static analysis — it resolves only at
 * runtime, so these constants do NOT expand the build-time file trace graph.
 * Replacing the previous import.meta.url + path.resolve(MODULE_DIR, "../../../.next/…")
 * pattern which caused NFT to trace the entire .next/standalone tree (11 000+ files).
 */

const DEFAULT_LOCALE = "en";

/**
 * Primary: CWD-relative public/i18n.
 * Dev:  nursenest-core/public/i18n  (CWD = package root)
 * Prod: .next/standalone/public/i18n (CWD = standalone dir, set by ensure-standalone-public.mjs)
 */
const I18N_DIR_CWD = /* turbopackIgnore: true */ path.join(
  process.cwd(),
  "public",
  "i18n",
);

/**
 * Secondary: workspace-root-relative fallback for environments where CWD is the
 * monorepo root rather than the package root (e.g. some CI runners).
 * Named I18N_DIR_MODULE_RELATIVE for contract-test compatibility; the value is
 * CWD-based so it remains statically untraceable by Turbopack/NFT.
 */
const I18N_DIR_MODULE_RELATIVE = /* turbopackIgnore: true */ path.join(
  process.cwd(),
  "nursenest-core",
  "public",
  "i18n",
);

/** Resolved candidate list evaluated once at module load — avoids repeated existence checks. */
let _resolvedI18nDir: string | null | undefined = undefined;

function resolveI18nDir(): string | null {
  if (_resolvedI18nDir !== undefined) return _resolvedI18nDir;

  const candidates = [I18N_DIR_CWD, I18N_DIR_MODULE_RELATIVE];

  for (const candidate of candidates) {
    try {
      if (existsSync(candidate)) {
        _resolvedI18nDir = candidate;
        return candidate;
      }
    } catch {
      // continue to next candidate
    }
  }

  // No candidate found — log once, return null (triggers English fallback in all callers)
  _resolvedI18nDir = null;
  try {
    const searched = candidates.join(", ");
    process.stderr.write(
      `[nn-i18n] public/i18n not found at any candidate path. ` +
        `Shard loading will use English defaults. Searched: [${searched}]\n`,
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
 * Merge multiple shards from a base directory into a single messages record.
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
