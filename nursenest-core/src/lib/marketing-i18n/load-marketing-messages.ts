import "server-only";
import { existsSync, statSync } from "fs";
import path from "path";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { normalizeMarketingMessagesRecord } from "@/lib/marketing-i18n/safe-marketing-messages";
import { loadMergedMarketingMessagesFromNextPublicDir } from "@/lib/i18n/merge-next-public-i18n-shards";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { I18N_SHARD_FILENAMES } from "@shared/i18n-shard-policy";

/**
 * Canonical Next.js bundles live under `public/i18n/{locale}/{domain}.json` (built by
 * `script/compile-i18n.ts` + `script/merge-marketing-i18n.ts`). Legacy `public/i18n/{locale}.json`
 * is still read when present.
 *
 * Resolution: two `process.cwd()`-relative candidates (app root on DO; monorepo root in dev).
 * Note: `process.cwd()` is dynamic so Turbopack cannot statically trace the exact files.
 * The NFT warning for next.config.ts is suppressed via `outputFileTracingExcludes` in
 * next.config.ts, and the i18n files are explicitly included via `outputFileTracingIncludes`.
 * The `..` candidate is intentionally absent so tracing never escapes the package root.
 *
 * Optional: `MARKETING_I18N_CDN_BASE` loads bundles when files are not on disk. CDN payloads are
 * merged with on-disk English for any missing/empty keys so stale CDN objects cannot drop groups
 * like `home.landing.*`.
 */
const MAX_MERGED_BUNDLE_BYTES = 12 * 1024 * 1024;

const isEmptyValue = (v: string | undefined): boolean =>
  v === undefined || (typeof v === "string" && v.trim() === "");

/** Fill holes in `primary` using `fallback` (same contract as client `formatMarketingMessage`). */
function mergeMissingMessageKeys(primary: MarketingMessages, fallback: MarketingMessages): MarketingMessages {
  const p = normalizeMarketingMessagesRecord(primary);
  const f = normalizeMarketingMessagesRecord(fallback);
  if (!f || Object.keys(f).length === 0) return p;
  const out: MarketingMessages = { ...p };
  for (const [k, v] of Object.entries(f)) {
    if (isEmptyValue(out[k]) && !isEmptyValue(v)) out[k] = v;
  }
  return out;
}

/** Two scoped candidates only — no `..` so paths never escape the package root. */
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

function marketingI18nCdnBase(): string | null {
  const b = process.env.MARKETING_I18N_CDN_BASE?.trim();
  return b && /^https?:\/\//i.test(b) ? b.replace(/\/$/, "") : null;
}

/** In-flight dedupe for CDN fetches (locale key). */
const cdnInflight = new Map<string, Promise<MarketingMessages | null>>();
const cdnResolved = new Map<string, MarketingMessages>();

/** Cached successful parse of on-disk English only (never cache empty/missing). */
let englishDiskBundleCache: MarketingMessages | null = null;
let englishDiskBundleLoadAttempted = false;

function tryLoadEnglishDiskBundle(): MarketingMessages | null {
  if (englishDiskBundleCache) return englishDiskBundleCache;
  if (englishDiskBundleLoadAttempted) return null;
  englishDiskBundleLoadAttempted = true;
  const dir = resolveNextI18nPublicDir();
  if (!dir) {
    safeServerLog("i18n", "merged_bundle_missing", { locale: DEFAULT_MARKETING_LOCALE });
    return null;
  }
  try {
    const legacy = path.join(dir, `${DEFAULT_MARKETING_LOCALE}.json`);
    let bytes = 0;
    if (existsSync(legacy)) {
      bytes = statSync(/* turbopackIgnore: true */ legacy).size;
    } else {
      for (const name of I18N_SHARD_FILENAMES) {
        const fp = path.join(dir, DEFAULT_MARKETING_LOCALE, `${name}.json`);
        if (existsSync(fp)) bytes += statSync(/* turbopackIgnore: true */ fp).size;
      }
    }
    if (bytes > MAX_MERGED_BUNDLE_BYTES) {
      safeServerLog("i18n", "merged_bundle_unusually_large", {
        locale: DEFAULT_MARKETING_LOCALE,
        bytes,
      });
    }
  } catch {
    /* best-effort stat */
  }
  try {
    const parsed = loadMergedMarketingMessagesFromNextPublicDir(dir, DEFAULT_MARKETING_LOCALE);
    if (!parsed || Object.keys(parsed).length === 0) {
      safeServerLog("i18n", "merged_bundle_read_failed", { locale: DEFAULT_MARKETING_LOCALE });
      return null;
    }
    englishDiskBundleCache = parsed;
    return parsed;
  } catch {
    safeServerLog("i18n", "merged_bundle_read_failed", { locale: DEFAULT_MARKETING_LOCALE });
    return null;
  }
}

function loadEnglishBundleFromDisk(): MarketingMessages {
  return tryLoadEnglishDiskBundle() ?? ({} as MarketingMessages);
}

function loadFromDiskSync(locale: string): MarketingMessages | null {
  const dir = resolveNextI18nPublicDir();
  if (!dir) return null;
  try {
    const parsed = loadMergedMarketingMessagesFromNextPublicDir(dir, locale);
    if (!parsed || Object.keys(parsed).length === 0) return null;
    return parsed;
  } catch {
    safeServerLog("i18n", "merged_bundle_read_failed", { locale });
    return null;
  }
}

async function loadFromCdn(locale: string): Promise<MarketingMessages | null> {
  const base = marketingI18nCdnBase();
  if (!base) return null;

  const hit = cdnResolved.get(locale);
  if (hit) return hit;

  const pending = cdnInflight.get(locale);
  if (pending) return pending;

  const legacyUrl = `${base}/${encodeURIComponent(locale)}.json`;
  const work = (async () => {
    try {
      let data: MarketingMessages | null = null;
      const legacyRes = await fetch(legacyUrl, { cache: "force-cache" });
      if (legacyRes.ok) {
        data = normalizeMarketingMessagesRecord(await legacyRes.json());
      } else {
        const merged: MarketingMessages = {};
        for (const name of I18N_SHARD_FILENAMES) {
          const shardUrl = `${base}/${encodeURIComponent(locale)}/${encodeURIComponent(name)}.json`;
          const res = await fetch(shardUrl, { cache: "force-cache" });
          if (!res.ok) {
            safeServerLog("i18n", "cdn_shard_fetch_failed", { locale, shard: name, status: res.status });
            return null;
          }
          const part = normalizeMarketingMessagesRecord(await res.json());
          for (const [k, v] of Object.entries(part)) {
            if (k in merged) {
              safeServerLog("i18n", "cdn_shard_duplicate_key_last_wins", {
                locale,
                shard: name,
                key: k.slice(0, 120),
              });
            }
            merged[k] = v;
          }
        }
        data = merged;
      }
      if (!data || Object.keys(data).length === 0) {
        safeServerLog("i18n", "cdn_bundle_fetch_failed", { locale, status: legacyRes.status });
        return null;
      }
      const enDisk = tryLoadEnglishDiskBundle();
      if (enDisk && Object.keys(enDisk).length > 0) {
        data = mergeMissingMessageKeys(data, enDisk);
      }
      cdnResolved.set(locale, data);
      return data;
    } catch (e) {
      const detail = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
      safeServerLog("i18n", "cdn_bundle_fetch_error", { locale, detail });
      return null;
    } finally {
      cdnInflight.delete(locale);
    }
  })();

  cdnInflight.set(locale, work);
  return work;
}

/**
 * Synchronous load from local `public/i18n` only (no CDN). Prefer `loadMarketingMessages` in async contexts.
 * @deprecated Use `loadMarketingMessages` — CDN-backed bundles require async fetch when files are not on disk.
 */
export function loadMarketingMessagesSync(locale: string): MarketingMessages {
  const disk = loadFromDiskSync(locale);
  if (disk) return disk;
  safeServerLog("i18n", "merged_bundle_missing", { locale, syncOnly: true });
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return loadEnglishBundleFromDisk();
  }
  return {} as MarketingMessages;
}

/** Server / Node: merged monolith + marketing strings. Tries disk first, then optional CDN, then English. */
export async function loadMarketingMessages(locale: string): Promise<MarketingMessages> {
  const disk = loadFromDiskSync(locale);
  if (disk) return disk;

  const fromCdn = await loadFromCdn(locale);
  if (fromCdn) return fromCdn;

  safeServerLog("i18n", "merged_bundle_missing", { locale });
  if (locale === DEFAULT_MARKETING_LOCALE) {
    return loadEnglishBundleFromDisk();
  }
  return {} as MarketingMessages;
}
