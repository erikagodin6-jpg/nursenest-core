/**
 * Fetches live merged translation JSON (same artifacts as server `public/i18n` + `/api/assets/i18n/*`).
 * Used to distinguish stale deploy/CDN vs client-only issues when console reports missing keys.
 */

import type { APIRequestContext } from "@playwright/test";
import { PRODUCTION_I18N_ACCOUNT_NAV_KEYS } from "./observer-error-taxonomy";

export type ProductionI18nFetchResult = {
  /** Absolute URL that was requested */
  url: string;
  status: number;
  cacheControl: string | null;
  contentLength: string | null;
  /** First ~240 chars of body (for logs; JSON may be one line) */
  bodySnippet: string;
  keysPresent: Record<string, boolean>;
  parseOk: boolean;
  parseError?: string;
};

function snippet(body: string, max = 240): string {
  const t = body.replace(/\s+/g, " ").trim();
  return t.length <= max ? t : `${t.slice(0, max - 1)}…`;
}

/**
 * GET `{baseUrl}/i18n/en.json` — static file from Next `public/i18n` (preferred for “what ships in the build”).
 */
export async function fetchStaticI18nEn(
  request: APIRequestContext,
  baseUrl: string,
): Promise<ProductionI18nFetchResult> {
  const url = new URL("/i18n/en.json", baseUrl.replace(/\/$/, "")).href;
  const res = await request.get(url);
  const headers = res.headers();
  const body = await res.text();
  let parseOk = false;
  let parseError: string | undefined;
  const keysPresent: Record<string, boolean> = {};
  try {
    const json = JSON.parse(body) as Record<string, unknown>;
    parseOk = true;
    for (const k of PRODUCTION_I18N_ACCOUNT_NAV_KEYS) {
      keysPresent[k] = typeof json[k] === "string" && String(json[k]).trim().length > 0;
    }
  } catch (e) {
    parseError = e instanceof Error ? e.message : String(e);
  }
  return {
    url,
    status: res.status(),
    cacheControl: headers["cache-control"] ?? null,
    contentLength: headers["content-length"] ?? null,
    bodySnippet: snippet(body),
    keysPresent,
    parseOk,
    parseError,
  };
}

/**
 * GET `{baseUrl}/api/assets/i18n/en.json` — may 307 to `MARKETING_I18N_CDN_BASE` in production.
 * Playwright follows redirects by default; final URL reflects CDN vs origin.
 */
export async function fetchApiAssetsI18nEn(
  request: APIRequestContext,
  baseUrl: string,
): Promise<ProductionI18nFetchResult & { finalUrl: string }> {
  const url = new URL("/api/assets/i18n/en.json", baseUrl.replace(/\/$/, "")).href;
  const res = await request.get(url);
  const finalUrl = res.url();
  const headers = res.headers();
  const body = await res.text();
  let parseOk = false;
  let parseError: string | undefined;
  const keysPresent: Record<string, boolean> = {};
  try {
    const json = JSON.parse(body) as Record<string, unknown>;
    parseOk = true;
    for (const k of PRODUCTION_I18N_ACCOUNT_NAV_KEYS) {
      keysPresent[k] = typeof json[k] === "string" && String(json[k]).trim().length > 0;
    }
  } catch (e) {
    parseError = e instanceof Error ? e.message : String(e);
  }
  return {
    url,
    finalUrl,
    status: res.status(),
    cacheControl: headers["cache-control"] ?? null,
    contentLength: headers["content-length"] ?? null,
    bodySnippet: snippet(body),
    keysPresent,
    parseOk,
    parseError,
  };
}

export function formatI18nKeyDiff(keysPresent: Record<string, boolean>): { missing: string[]; ok: boolean } {
  const missing = Object.entries(keysPresent)
    .filter(([, v]) => !v)
    .map(([k]) => k);
  return { missing, ok: missing.length === 0 };
}
