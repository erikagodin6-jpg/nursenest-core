/**
 * Central guard for **indexable** public marketing URLs emitted to sitemaps, JSON-LD, breadcrumbs,
 * hreflang, and internal links.
 *
 * **Static guarantees (sync):** parseable URL, expected origin, canonical shape (no query/hash),
 * disallowed pathname patterns (auth noindex, locale+region bugs, `/seo` rewrite surface, app/api/admin).
 *
 * **Not verified synchronously:** HTTP 404, redirects, or HTML `noindex` (requires runtime fetch or
 * per-route metadata registry). Use {@link validatePublicUrlHttpOptional} in CI or smoke jobs when
 * `PUBLIC_URL_HTTP_VALIDATE=true`.
 */
import { resolveCanonicalSiteOrigin } from "@/lib/seo/canonical-site";
import { isAuthNoindexMarketingPathname } from "@/lib/seo/sitemap-marketing-exclusions";
import { isDisallowedMarketingSeoPathname } from "@/lib/seo/marketing-locale-regional-url-invariants";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { absoluteUrl, MARKETING_SITE_ORIGIN } from "@/lib/seo/site-origin";

export type PublicUrlInvalidCode =
  | "parse_error"
  | "wrong_origin"
  | "non_https"
  | "has_query_or_hash"
  | "trailing_slash"
  | "blocked_system_prefix"
  | "auth_noindex_path"
  | "disallowed_locale_regional_shape"
  | "http_not_ok"
  | "redirect"
  | "runtime_check_disabled";

export type PublicUrlValidationResult =
  | { ok: true }
  | { ok: false; code: PublicUrlInvalidCode; detail?: string };

const BLOCKED_PREFIXES = [
  "/app",
  "/admin",
  "/api",
  "/seo/",
  "/_next/",
  "/healthz",
] as const;

function normalizeExpectedOrigins(explicit?: string): string[] {
  const primary = (explicit ?? MARKETING_SITE_ORIGIN).replace(/\/$/, "");
  const canonical = resolveCanonicalSiteOrigin().replace(/\/$/, "");
  if (primary === canonical) return [primary];
  return [primary, canonical];
}

function isHttpsOrLocalhost(url: URL): boolean {
  if (url.protocol === "https:") return true;
  if (url.protocol !== "http:") return false;
  const host = url.hostname.toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host.endsWith(".local");
}

/**
 * Returns whether an absolute public URL is safe to emit in sitemaps, schema, alternates, and links.
 * Prefer calling this for **every** string that becomes a crawlable same-origin URL.
 */
export function isValidPublicUrl(url: string, options?: { origin?: string }): PublicUrlValidationResult {
  let parsed: URL;
  try {
    parsed = new URL(url.trim());
  } catch (e) {
    return { ok: false, code: "parse_error", detail: e instanceof Error ? e.message : String(e) };
  }

  if (!isHttpsOrLocalhost(parsed)) {
    return { ok: false, code: "non_https", detail: parsed.protocol };
  }

  const expected = normalizeExpectedOrigins(options?.origin);
  if (!expected.includes(parsed.origin)) {
    return { ok: false, code: "wrong_origin", detail: `${parsed.origin} not in ${expected.join(",")}` };
  }

  if (parsed.search !== "" || parsed.hash !== "") {
    return { ok: false, code: "has_query_or_hash" };
  }

  const pathname = parsed.pathname || "/";
  if (pathname !== "/" && pathname.endsWith("/")) {
    return { ok: false, code: "trailing_slash", detail: pathname };
  }

  const lowerPath = pathname.toLowerCase();
  for (const prefix of BLOCKED_PREFIXES) {
    if (lowerPath === prefix || lowerPath.startsWith(prefix)) {
      return { ok: false, code: "blocked_system_prefix", detail: prefix };
    }
  }

  if (isAuthNoindexMarketingPathname(pathname)) {
    return { ok: false, code: "auth_noindex_path", detail: pathname };
  }

  if (isDisallowedMarketingSeoPathname(pathname)) {
    return { ok: false, code: "disallowed_locale_regional_shape", detail: pathname };
  }

  return { ok: true };
}

/**
 * Logs structured errors and drops invalid URLs. Use when building urlsets or URL arrays.
 */
export function filterIndexablePublicUrls(
  urls: readonly string[],
  logScope: string,
  logEvent: string,
  origin?: string,
): string[] {
  const out: string[] = [];
  for (const u of urls) {
    const r = isValidPublicUrl(u, origin ? { origin } : undefined);
    if (r.ok) {
      out.push(u);
      continue;
    }
    safeServerLog(logScope, logEvent, {
      url: u.slice(0, 500),
      code: r.ok ? "" : r.code,
      detail: r.ok ? "" : (r.detail ?? "").slice(0, 200),
    });
  }
  return out;
}

/** Absolute URL for a path; returns `null` if invalid (logs). */
export function absoluteUrlIfValidPublicPath(path: string, logScope: string, logEvent: string): string | null {
  const abs = absoluteUrl(path);
  const r = isValidPublicUrl(abs, { origin: MARKETING_SITE_ORIGIN });
  if (r.ok) return abs;
  safeServerLog(logScope, logEvent, {
    path: path.slice(0, 300),
    code: r.code,
    detail: (r.detail ?? "").slice(0, 200),
  });
  return null;
}

/**
 * Drop invalid hreflang targets; preserves `x-default` when valid.
 */
export function filterPublicHreflangRecord(
  languages: Record<string, string>,
  logScope: string,
  logEvent: string,
  origin?: string,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [lang, url] of Object.entries(languages)) {
    const r = isValidPublicUrl(url, origin ? { origin } : undefined);
    if (r.ok) {
      out[lang] = url;
      continue;
    }
    safeServerLog(logScope, logEvent, {
      lang,
      url: url.slice(0, 500),
      code: r.code,
      detail: (r.detail ?? "").slice(0, 200),
    });
  }
  return out;
}

/**
 * Optional HEAD/GET check (same-origin only). Enable with `PUBLIC_URL_HTTP_VALIDATE=true` in CI/smoke.
 * Does **not** read HTML for `noindex` — only status / redirect chain.
 */
export async function validatePublicUrlHttpOptional(url: string): Promise<PublicUrlValidationResult> {
  const staticResult = isValidPublicUrl(url);
  if (!staticResult.ok) return staticResult;
  if (process.env.PUBLIC_URL_HTTP_VALIDATE !== "true") {
    return { ok: true };
  }
  try {
    const res = await fetch(url, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(15_000),
    });
    if (res.status >= 300 && res.status < 400) {
      return { ok: false, code: "redirect", detail: String(res.status) };
    }
    if (res.status === 404 || res.status === 410) {
      return { ok: false, code: "http_not_ok", detail: String(res.status) };
    }
    if (res.status < 200 || res.status >= 400) {
      return { ok: false, code: "http_not_ok", detail: String(res.status) };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, code: "http_not_ok", detail: e instanceof Error ? e.message : String(e) };
  }
}
