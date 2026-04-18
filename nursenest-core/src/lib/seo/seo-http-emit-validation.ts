/**
 * Optional HTTP verification for URLs we emit (sitemap, canonical, hreflang).
 *
 * - `SEO_HTTP_VALIDATE_EMITTED_URLS=1` — HEAD/GET each URL (sitemap merge path; see `sitemap-all-xml.ts`).
 * - `SEO_HTTP_VALIDATE_PAGE_METADATA=1` — after metadata resolves, check canonical + hreflang (`safe-marketing-metadata.ts`).
 * - `SEO_HTTP_VALIDATE_STRICT=1` — throw {@link SeoHttpValidationStrictError} on 404/410/5xx for sitemap flows and
 *   for page-metadata validation only outside production request rendering (development or explicit CI checks).
 *
 * Caps: `SEO_HTTP_VALIDATE_MAX_URLS` (default 2000 sitemap), `SEO_HTTP_VALIDATE_CONCURRENCY` (default 8).
 *
 * Does not run unless one of the `SEO_HTTP_VALIDATE_*` toggles above is set (avoid prod latency / self-DoS).
 */
import type { Metadata } from "next";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export class SeoHttpValidationStrictError extends Error {
  readonly failures: readonly SeoHttpValidationFailure[];

  constructor(failures: SeoHttpValidationFailure[]) {
    super(`seo_http_validation_strict: ${failures.length} bad response(s)`);
    this.name = "SeoHttpValidationStrictError";
    this.failures = failures;
  }
}

export type SeoHttpValidationKind = "sitemap" | "canonical" | "hreflang";

export type SeoHttpValidationEntry = {
  url: string;
  sourceFile: string;
  generator: string;
  kind: SeoHttpValidationKind;
};

export type SeoHttpValidationFailure = SeoHttpValidationEntry & {
  status: number;
  detail?: string;
};

function envEnabled(flag: string): boolean {
  const v = process.env[flag]?.trim().toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

export function isSeoHttpValidationEnabled(): boolean {
  return envEnabled("SEO_HTTP_VALIDATE_EMITTED_URLS");
}

export function isSeoPageMetadataHttpValidationEnabled(): boolean {
  return envEnabled("SEO_HTTP_VALIDATE_PAGE_METADATA");
}

export function isSeoHttpValidationStrict(): boolean {
  return envEnabled("SEO_HTTP_VALIDATE_STRICT");
}

export function seoHttpValidationEnvironmentName(): string {
  return process.env.VERCEL_ENV?.trim() || process.env.NODE_ENV?.trim() || "unknown";
}

export function shouldEnforceStrictPageMetadataValidation(): boolean {
  if (!isSeoHttpValidationStrict()) return false;
  if (envEnabled("CI")) return true;
  return process.env.NODE_ENV !== "production";
}

function maxUrls(): number {
  const raw = process.env.SEO_HTTP_VALIDATE_MAX_URLS?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 2000;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 50_000) : 2000;
}

function concurrency(): number {
  const raw = process.env.SEO_HTTP_VALIDATE_CONCURRENCY?.trim();
  const n = raw ? Number.parseInt(raw, 10) : 8;
  return Number.isFinite(n) && n > 0 ? Math.min(n, 32) : 8;
}

/** Single request; HEAD first, GET fallback when HEAD unsupported. `redirect: manual` — 3xx logged, not failed. */
export async function fetchHttpStatusForSeoValidation(
  url: string,
  options?: { timeoutMs?: number },
): Promise<{ status: number; detail?: string }> {
  const ctrl = new AbortController();
  const timeoutMs = options?.timeoutMs ?? 12_000;
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: ctrl.signal,
      headers: { "user-agent": "NurseNest-SeoHttpValidator/1.0" },
    });
    if (res.status === 405 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: ctrl.signal,
        headers: {
          "user-agent": "NurseNest-SeoHttpValidator/1.0",
          range: "bytes=0-0",
        },
      });
    }
    return { status: res.status };
  } catch (e) {
    return {
      status: 0,
      detail: e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200),
    };
  } finally {
    clearTimeout(timer);
  }
}

/** True for 404/410/5xx and network/abort failures (`status === 0`). */
export function isSeoHttpValidationBadStatus(status: number): boolean {
  if (status === 404 || status === 410) return true;
  if (status >= 500 && status < 600) return true;
  if (status === 0) return true;
  return false;
}

export function classifySeoHttpValidationFailureReason(failures: readonly SeoHttpValidationFailure[]): string {
  const first = failures[0];
  if (!first) return "unknown";
  if (first.status === 0) {
    const detail = (first.detail ?? "").toLowerCase();
    if (detail.includes("abort") || detail.includes("timeout")) return "timeout";
    return "network_error";
  }
  return `bad_status_${first.status}`;
}

function logFailure(f: SeoHttpValidationFailure, requestPathname?: string): void {
  safeServerLog("seo", "http_emit_url_bad_response", {
    url: f.url.slice(0, 800),
    status: String(f.status),
    kind: f.kind,
    sourceFile: f.sourceFile,
    generator: f.generator.slice(0, 200),
    detail: (f.detail ?? "").slice(0, 200),
    ...(requestPathname ? { requestPathname: requestPathname.slice(0, 400) } : {}),
  });
}

async function runPool<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = [];
  for (let i = 0; i < items.length; i += limit) {
    const chunk = items.slice(i, i + limit);
    out.push(...(await Promise.all(chunk.map(worker))));
  }
  return out;
}

/**
 * Validate unique URLs with shared source/generator/kind (typical sitemap batch).
 */
export async function validateUrlsHttpBatch(
  urls: readonly string[],
  ctx: { sourceFile: string; generator: string; kind: SeoHttpValidationKind },
): Promise<{ failures: SeoHttpValidationFailure[] }> {
  const uniq = [...new Set(urls.map((u) => u.trim()).filter(Boolean))];
  const cap = maxUrls();
  const slice = uniq.slice(0, cap);
  if (uniq.length > cap) {
    safeServerLog("seo", "http_validate_url_cap", {
      sourceFile: ctx.sourceFile,
      generator: ctx.generator,
      total: String(uniq.length),
      cap: String(cap),
    });
  }

  const failures: SeoHttpValidationFailure[] = [];
  const conc = concurrency();

  await runPool(slice, conc, async (url) => {
    const { status, detail } = await fetchHttpStatusForSeoValidation(url);
    if (status >= 300 && status < 400) {
      safeServerLog("seo", "http_emit_url_redirect", {
        url: url.slice(0, 800),
        status: String(status),
        kind: ctx.kind,
        sourceFile: ctx.sourceFile,
        generator: ctx.generator,
      });
    }
    if (isSeoHttpValidationBadStatus(status)) {
      const f: SeoHttpValidationFailure = {
        url,
        status,
        sourceFile: ctx.sourceFile,
        generator: ctx.generator,
        kind: ctx.kind,
        detail,
      };
      failures.push(f);
      logFailure(f);
    }
    return null;
  });

  if (isSeoHttpValidationStrict() && failures.length > 0) {
    throw new SeoHttpValidationStrictError(failures);
  }

  return { failures };
}

/** Extract alternates from Next metadata and validate each URL. */
export type MetadataAlternatesHttpValidationResult = {
  failures: SeoHttpValidationFailure[];
  strictRequested: boolean;
  strictEnforced: boolean;
  environmentName: string;
  reason?: string;
};

const PAGE_METADATA_HTTP_TIMEOUT_MS = 2_000;

export async function validateMetadataAlternatesHttp(
  m: Metadata,
  ctx: { pathname: string; routeGroup?: string; sourceFile: string; generator: string },
): Promise<MetadataAlternatesHttpValidationResult> {
  const strictRequested = isSeoHttpValidationStrict();
  const strictEnforced = shouldEnforceStrictPageMetadataValidation();
  const environmentName = seoHttpValidationEnvironmentName();

  if (!isSeoPageMetadataHttpValidationEnabled()) {
    return {
      failures: [],
      strictRequested,
      strictEnforced: false,
      environmentName,
    };
  }

  const entries: SeoHttpValidationEntry[] = [];
  const alt = m.alternates;
  if (!alt) {
    return {
      failures: [],
      strictRequested,
      strictEnforced,
      environmentName,
    };
  }

  const canon = alt.canonical;
  if (canon != null) {
    const url = typeof canon === "string" ? canon : typeof (canon as { toString?: () => string }).toString === "function" ? String(canon) : "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      entries.push({
        url,
        sourceFile: ctx.sourceFile,
        generator: `${ctx.generator}#canonical`,
        kind: "canonical",
      });
    }
  }

  const langs = alt.languages;
  if (langs && typeof langs === "object") {
    for (const [lang, href] of Object.entries(langs)) {
      if (typeof href === "string" && (href.startsWith("http://") || href.startsWith("https://"))) {
        entries.push({
          url: href,
          sourceFile: ctx.sourceFile,
          generator: `${ctx.generator}#hreflang:${lang}`,
          kind: "hreflang",
        });
      }
    }
  }

  if (entries.length === 0) {
    return {
      failures: [],
      strictRequested,
      strictEnforced,
      environmentName,
    };
  }

  const failures: SeoHttpValidationFailure[] = [];
  await runPool(entries, concurrency(), async (e) => {
    const { status, detail } = await fetchHttpStatusForSeoValidation(e.url, {
      timeoutMs: PAGE_METADATA_HTTP_TIMEOUT_MS,
    });
    if (status >= 300 && status < 400) {
      safeServerLog("seo", "http_emit_url_redirect", {
        url: e.url.slice(0, 800),
        status: String(status),
        kind: e.kind,
        sourceFile: e.sourceFile,
        generator: e.generator,
        pathname: ctx.pathname.slice(0, 300),
        routeGroup: (ctx.routeGroup ?? "").slice(0, 120),
      });
    }
    if (isSeoHttpValidationBadStatus(status)) {
      const f: SeoHttpValidationFailure = { ...e, status, detail };
      failures.push(f);
      logFailure(f, ctx.pathname);
    }
    return null;
  });

  if (strictEnforced && failures.length > 0) {
    throw new SeoHttpValidationStrictError(failures);
  }

  const reason = failures.length > 0 ? classifySeoHttpValidationFailureReason(failures) : undefined;

  return {
    failures,
    strictRequested,
    strictEnforced,
    environmentName,
    reason,
  };
}
