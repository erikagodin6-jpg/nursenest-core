import { existsSync } from "fs";
import path from "path";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { PUBLIC_I18N_SHARD_FILENAMES, type I18nShardFilename } from "@shared/i18n-shard-policy";
import { stripStaffKeysFromPublicMergedBundle } from "@/lib/i18n/strip-staff-i18n-keys";
import { readCachedI18nJsonFile } from "@/lib/i18n/i18n-translation-cache";

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
  const includeStaffShards = options?.includeStaffShards === true;
  const shardFilenames: readonly string[] =
    options?.shardFilenames && options.shardFilenames.length > 0
      ? options.shardFilenames
      : PUBLIC_I18N_SHARD_FILENAMES;

  const legacy = path.resolve(path.join(i18nDir, `${locale}.json`));
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
  const localeDir = path.join(i18nDir, locale);
  if (!existsSync(localeDir)) return null;
  const merged: MarketingMessages = {};
  mergeShardJsonFiles(localeDir, shardFilenames, merged, locale);

  if (includeStaffShards) {
    const adminRoot = resolveAdminOnlyI18nDir();
    if (adminRoot) {
      const adminLocaleDir = path.join(adminRoot, locale);
      mergeShardJsonFiles(adminLocaleDir, ["admin"], merged, locale);
    }
  }

  return Object.keys(merged).length > 0 ? merged : null;
}
