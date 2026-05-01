import "server-only";

import { existsSync } from "node:fs";
import path from "node:path";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { PUBLIC_I18N_SHARD_FILENAMES, type I18nShardFilename } from "@shared/i18n-shard-policy";
import { stripStaffKeysFromPublicMergedBundle } from "@/lib/i18n/strip-staff-i18n-keys";
import { readCachedI18nJsonFile } from "@/lib/i18n/i18n-translation-cache";

const LOCALE_RE = /^[a-z]{2}(-[a-z]{2})?$/i;
const PUBLIC_I18N_ALLOWED_ROOTS = Array.from(
  new Set([
    path.resolve(/* turbopackIgnore: true */ process.cwd(), "public", "i18n"),
    path.resolve(/* turbopackIgnore: true */ process.cwd(), "..", "client", "public", "i18n"),
  ]),
);
const ADMIN_I18N_ALLOWED_ROOTS = Array.from(
  new Set([
    path.resolve(/* turbopackIgnore: true */ process.cwd(), "i18n-admin-only"),
  ]),
);

function isWithinAllowedRoot(resolvedPath: string, allowedRoot: string): boolean {
  return resolvedPath === allowedRoot || resolvedPath.startsWith(`${allowedRoot}${path.sep}`);
}

function resolveAllowedRoot(candidates: readonly string[], requestedRoot: string): string | null {
  const resolvedRequestedRoot = path.resolve(requestedRoot);
  return candidates.find((root) => root === resolvedRequestedRoot) ?? null;
}

function resolveAllowedLocaleDir(candidates: readonly string[], locale: string): string | null {
  if (!LOCALE_RE.test(locale)) return null;
  for (const root of candidates) {
    if (!existsSync(root)) continue;
    const localeDir = path.resolve(root, locale);
    if (!isWithinAllowedRoot(localeDir, root)) continue;
    if (existsSync(localeDir)) return localeDir;
  }
  return null;
}

function mergeShardJsonFiles(
  /** `public/i18n/{locale}` (not the parent `i18n` dir). */
  localeDir: string,
  shardNames: readonly string[],
  merged: MarketingMessages,
  locale: string,
): void {
  for (const name of shardNames) {
    const fp = path.resolve(path.join(localeDir, `${name}.json`));
    if (!existsSync(fp)) continue;
    const part = readCachedI18nJsonFile(fp, { locale, shard: name });
    if (!part) continue;
    for (const [k, v] of Object.entries(part)) {
      if (k in merged) {
        safeServerLog("i18n", "shard_duplicate_key_last_wins", {
          locale,
          shard: name,
          key: k.slice(0, 120),
        });
      }
      merged[k] = v;
    }
  }
}

export type LoadMergedNextPublicOptions = {
  /**
   * When true, also loads staff-only `admin.json` from `i18n-admin-only/{locale}/`.
   * Default false — public API and marketing surfaces must not receive staff strings.
   */
  includeStaffShards?: boolean;
  /**
   * When set, only these shard files are read from `public/i18n/{locale}/` (omit for full merge).
   * Used during `next build` to avoid loading large route tables (`pages.json`, `allied.json`, …) when
   * a merged bundle is only needed for chrome / fallback glue.
   */
  shardFilenames?: readonly I18nShardFilename[];
};

/**
 * Loads flat messages from `public/i18n/{locale}/*.json` shards (anonymous-safe).
 * Staff strings live in `i18n-admin-only/{locale}/admin.json` and are excluded unless
 * {@link LoadMergedNextPublicOptions.includeStaffShards} is true.
 */
export function loadMergedMarketingMessagesFromNextPublicDir(
  i18nDir: string,
  locale: string,
  options?: LoadMergedNextPublicOptions,
): MarketingMessages | null {
  if (!LOCALE_RE.test(locale)) return null;
  const includeStaffShards = options?.includeStaffShards === true;
  const shardFilenames: readonly string[] =
    options?.shardFilenames && options.shardFilenames.length > 0
      ? options.shardFilenames
      : PUBLIC_I18N_SHARD_FILENAMES;
  const publicRoot = resolveAllowedRoot(PUBLIC_I18N_ALLOWED_ROOTS, i18nDir);
  if (!publicRoot) return null;

  const legacy = path.resolve(publicRoot, `${locale}.json`);
  if (!isWithinAllowedRoot(legacy, publicRoot)) return null;
  if (existsSync(legacy)) {
    if (options?.shardFilenames && options.shardFilenames.length > 0) {
      /** Per-shard mode: ignore monolithic legacy file so callers can bound I/O during `next build`. */
    } else {
      const normalized = readCachedI18nJsonFile(legacy, { locale, shard: "legacy" });
      if (!normalized || Object.keys(normalized).length === 0) return null;
      if (!includeStaffShards) {
        return stripStaffKeysFromPublicMergedBundle(normalized);
      }
      return normalized;
    }
  }
  const localeDir = path.resolve(publicRoot, locale);
  if (!isWithinAllowedRoot(localeDir, publicRoot)) return null;
  if (!existsSync(localeDir)) return null;
  const merged: MarketingMessages = {};
  mergeShardJsonFiles(localeDir, shardFilenames, merged, locale);

  if (includeStaffShards) {
    const adminLocaleDir = resolveAllowedLocaleDir(ADMIN_I18N_ALLOWED_ROOTS, locale);
    if (adminLocaleDir) {
      mergeShardJsonFiles(adminLocaleDir, ["admin"], merged, locale);
    }
  }

  return Object.keys(merged).length > 0 ? merged : null;
}
