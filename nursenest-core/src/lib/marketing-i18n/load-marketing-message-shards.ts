import "server-only";
import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import type { I18nShardFilename } from "@shared/i18n-shard-policy";

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
    const fp = path.join(adminRoot, locale, "admin.json");
    if (!existsSync(fp)) return null;
    try {
      const parsed: unknown = JSON.parse(readFileSync(fp, "utf8"));
      const normalized = normalizeMarketingMessagesRecord(parsed);
      return Object.keys(normalized).length > 0 ? normalized : null;
    } catch {
      safeServerLog("i18n", "shard_json_invalid", { locale, shard: "admin" });
      return null;
    }
  }
  const fp = path.join(i18nDir, locale, `${shard}.json`);
  if (!existsSync(fp)) return null;
  try {
    const parsed: unknown = JSON.parse(readFileSync(fp, "utf8"));
    const normalized = normalizeMarketingMessagesRecord(parsed);
    return Object.keys(normalized).length > 0 ? normalized : null;
  } catch {
    safeServerLog("i18n", "shard_json_invalid", { locale, shard });
    return null;
  }
}

/** Legacy monolithic `{locale}.json` (pre-shard deployments). */
function tryReadLegacyLocaleBundle(i18nDir: string, locale: string): MarketingMessages | null {
  const fp = path.join(i18nDir, `${locale}.json`);
  if (!existsSync(fp)) return null;
  try {
    const parsed: unknown = JSON.parse(readFileSync(fp, "utf8"));
    const normalized = normalizeMarketingMessagesRecord(parsed);
    return Object.keys(normalized).length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

function mergeShardMaps(
  i18nDir: string,
  locale: string,
  shards: readonly I18nShardFilename[],
): MarketingMessages {
  const localeShardDir = path.join(i18nDir, locale);
  const hasShardTree = existsSync(localeShardDir) && statSync(localeShardDir).isDirectory();
  if (hasShardTree) {
    const merged: MarketingMessages = {};
    for (const name of shards) {
      const part = readShardFile(i18nDir, locale, name);
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
    return merged;
  }
  const legacy = tryReadLegacyLocaleBundle(i18nDir, locale);
  if (legacy && Object.keys(legacy).length > 0) {
    return legacy;
  }
  return {};
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

export async function loadMarketingMessageShards(
  locale: string,
  shards: readonly I18nShardFilename[],
): Promise<MarketingMessages> {
  return loadMarketingMessageShardsSync(locale, shards);
}
