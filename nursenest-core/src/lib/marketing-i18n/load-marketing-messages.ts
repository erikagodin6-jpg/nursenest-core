import "server-only";
import { existsSync, readFileSync, statSync } from "fs";
import path from "path";
import type { MarketingMessages } from "@/lib/marketing-i18n-core";
import { DEFAULT_MARKETING_LOCALE } from "@/lib/i18n/marketing-locale-policy";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Canonical merged bundles live at `public/i18n/{locale}.json` (built by
 * `script/compile-i18n.ts` + `script/merge-marketing-i18n.ts`).
 * Supports cwd = repo root or `nursenest-core/` when running Next.js.
 *
 * Optional: upload the same files to DigitalOcean Spaces (or any HTTPS host) and set
 * `MARKETING_I18N_CDN_BASE` so runtime can load bundles without shipping `public/i18n` in the image.
 */
function resolveMergedI18nPath(locale: string): string | null {
  const root = process.cwd();
  const candidates = [
    path.join(root, "public", "i18n", `${locale}.json`),
    path.join(root, "nursenest-core", "public", "i18n", `${locale}.json`),
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

let enBundleCache: MarketingMessages | null = null;

const MAX_MERGED_BUNDLE_BYTES = 12 * 1024 * 1024;

function loadEnglishBundleFromDisk(): MarketingMessages {
  if (enBundleCache) return enBundleCache;
  const fp = resolveMergedI18nPath(DEFAULT_MARKETING_LOCALE);
  if (!fp) {
    safeServerLog("i18n", "merged_bundle_missing", { locale: DEFAULT_MARKETING_LOCALE });
    enBundleCache = {} as MarketingMessages;
    return enBundleCache;
  }
  try {
    const st = statSync(fp);
    if (st.size > MAX_MERGED_BUNDLE_BYTES) {
      safeServerLog("i18n", "merged_bundle_unusually_large", {
        locale: DEFAULT_MARKETING_LOCALE,
        bytes: st.size,
      });
    }
  } catch {
    /* best-effort stat */
  }
  const raw = readFileSync(fp, "utf8");
  enBundleCache = JSON.parse(raw) as MarketingMessages;
  return enBundleCache;
}

function loadFromDiskSync(locale: string): MarketingMessages | null {
  const fp = resolveMergedI18nPath(locale);
  if (!fp) return null;
  try {
    const raw = readFileSync(fp, "utf8");
    return JSON.parse(raw) as MarketingMessages;
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

  const url = `${base}/${encodeURIComponent(locale)}.json`;
  const work = (async () => {
    try {
      const res = await fetch(url, { cache: "force-cache" });
      if (!res.ok) {
        safeServerLog("i18n", "cdn_bundle_fetch_failed", { locale, status: res.status });
        return null;
      }
      const data = (await res.json()) as MarketingMessages;
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
  if (locale !== DEFAULT_MARKETING_LOCALE) {
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
  if (locale !== DEFAULT_MARKETING_LOCALE) {
    const enDisk = loadFromDiskSync(DEFAULT_MARKETING_LOCALE);
    if (enDisk) return enDisk;
    const enCdn = await loadFromCdn(DEFAULT_MARKETING_LOCALE);
    if (enCdn) return enCdn;
    return loadEnglishBundleFromDisk();
  }
  return {} as MarketingMessages;
}
