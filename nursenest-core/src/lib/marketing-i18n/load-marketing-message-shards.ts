import "server-only";

import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

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
 *   1. process.cwd()/public/i18n       — primary (pkgRoot/public/i18n in Docker runtime)
 *   2. __dirname-relative backup path  — stable absolute path from this file's location
 *   3. Adjacent standalone public/i18n — belt-and-suspenders for non-Docker standalone
 *
 * The first root that contains the requested locale directory wins.
 */

const DEFAULT_LOCALE = "en";

/** Primary: CWD-relative (works when server cwd = package root). */
const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));

const I18N_DIR_MODULE_RELATIVE = /* turbopackIgnore: true */ path.resolve(
  MODULE_DIR,
  "../../../public/i18n",
);

const I18N_DIR_CWD = I18N_DIR_MODULE_RELATIVE;

/**
 * Secondary: file-relative path from this module's location.
 * In the standalone bundle, this file lives inside the Next.js output tree.
 * Walking up from `src/lib/marketing-i18n/` reaches the package root reliably.
 * turbopackIgnore prevents Turbopack from resolving this at build time.
 */
/**
 * Tertiary: standalone output's own public directory (populated by ensure-standalone-public.mjs).
 * Resolves relative to the project root's .next/standalone directory.
 */
const I18N_DIR_STANDALONE_PUBLIC = /* turbopackIgnore: true */ path.resolve(
  MODULE_DIR,
  "../../../.next/standalone/nursenest-core/public/i18n",
);

/** Resolved candidate list evaluated once at module load — avoids repeated existence checks. */
let _resolvedI18nDir: string | null | undefined = undefined;

function resolveI18nDir(): string | null {
  if (_resolvedI18nDir !== undefined) return _resolvedI18nDir;

  const candidates = [I18N_DIR_CWD, I18N_DIR_MODULE_RELATIVE, I18N_DIR_STANDALONE_PUBLIC];

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
