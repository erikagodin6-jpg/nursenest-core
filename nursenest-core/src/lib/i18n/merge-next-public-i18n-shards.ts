import { existsSync, readFileSync } from "fs";
import path from "path";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { PUBLIC_I18N_SHARD_FILENAMES } from "@shared/i18n-shard-policy";
import { stripStaffKeysFromPublicMergedBundle } from "@/lib/i18n/strip-staff-i18n-keys";

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
    const fp = path.join(localeDir, `${name}.json`);
    if (!existsSync(fp)) continue;
    let parsed: unknown;
    try {
      parsed = JSON.parse(readFileSync(fp, "utf8"));
    } catch {
      safeServerLog("i18n", "shard_json_invalid", { locale, shard: name });
      continue;
    }
    const part = normalizeMarketingMessagesRecord(parsed);
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

  const legacy = path.join(i18nDir, `${locale}.json`);
  if (existsSync(legacy)) {
    try {
      const parsed: unknown = JSON.parse(readFileSync(legacy, "utf8"));
      const normalized = normalizeMarketingMessagesRecord(parsed);
      if (Object.keys(normalized).length === 0) return null;
      if (!includeStaffShards) {
        return stripStaffKeysFromPublicMergedBundle(normalized);
      }
      return normalized;
    } catch {
      return null;
    }
  }
  const localeDir = path.join(i18nDir, locale);
  if (!existsSync(localeDir)) return null;
  const merged: MarketingMessages = {};
  mergeShardJsonFiles(localeDir, PUBLIC_I18N_SHARD_FILENAMES, merged, locale);

  if (includeStaffShards) {
    const adminRoot = resolveAdminOnlyI18nDir();
    if (adminRoot) {
      const adminLocaleDir = path.join(adminRoot, locale);
      mergeShardJsonFiles(adminLocaleDir, ["admin"], merged, locale);
    }
  }

  return Object.keys(merged).length > 0 ? merged : null;
}
