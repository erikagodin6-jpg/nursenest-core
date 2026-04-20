/**
 * Auth.js / NextAuth v5 names session cookies with a `__Secure-` prefix when issued over HTTPS.
 * `getToken({ req, secret })` defaults to `secureCookie: false`, which misses those cookies in proxy
 * and rate limiting — authenticated requests then look anonymous.
 */
export type NextAuthHttpsSignal =
  | "auth_env_url_https"
  | "auth_env_url_http"
  | "xff_any_https"
  | "xff_all_http"
  | "xff_inconclusive"
  | "fwd_ssl_on"
  | "cf_visitor_https"
  | "next_url_https"
  | "next_url_http";

export type NextAuthHttpsResolution = {
  secureCookie: boolean;
  signal: NextAuthHttpsSignal;
};

function isLikelyLocalDevHostname(hostname: string): boolean {
  const h = hostname.trim().toLowerCase();
  if (!h) return false;
  return h === "localhost" || h === "127.0.0.1" || h === "[::1]" || h.endsWith(".local");
}

function requestHostname(request: { headers: Headers; nextUrl: URL }): string {
  const raw = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  if (raw) {
    try {
      return new URL(`http://${raw}`).hostname.toLowerCase();
    } catch {
      return raw.toLowerCase();
    }
  }
  return request.nextUrl.hostname.toLowerCase();
}

/**
 * Resolves whether `getToken` should use the secure session cookie name, and records which input
 * determined that (for diagnostics — no secrets).
 */
export function resolveNextAuthHttpsForRequest(request: { headers: Headers; nextUrl: URL }): NextAuthHttpsResolution {
  /**
   * Match `@auth/core` init: when `AUTH_URL` / `NEXTAUTH_URL` is an https origin, session cookies use
   * the `__Secure-` name even if `x-forwarded-proto` is wrong/missing on the edge request (common behind
   * misconfigured proxies). Skip this for localhost-style hosts so dev heuristics stay unchanged.
   */
  if (!isLikelyLocalDevHostname(requestHostname(request))) {
    const envRaw = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
    if (envRaw) {
      try {
        const u = new URL(envRaw.includes("://") ? envRaw : `https://${envRaw}`);
        if (u.protocol === "https:") {
          return { secureCookie: true, signal: "auth_env_url_https" };
        }
        if (u.protocol === "http:") {
          return { secureCookie: false, signal: "auth_env_url_http" };
        }
      } catch {
        /* ignore malformed env — fall through to forwarded headers */
      }
    }
  }

  const rawProto = request.headers.get("x-forwarded-proto");
  if (rawProto) {
    const segments = rawProto
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    if (segments.length > 0) {
      if (segments.some((s) => s === "https")) {
        return { secureCookie: true, signal: "xff_any_https" };
      }
      if (segments.every((s) => s === "http")) {
        return { secureCookie: false, signal: "xff_all_http" };
      }
      return { secureCookie: false, signal: "xff_inconclusive" };
    }
  }

  const forwardedSsl = request.headers.get("x-forwarded-ssl")?.trim().toLowerCase();
  if (forwardedSsl === "on") {
    return { secureCookie: true, signal: "fwd_ssl_on" };
  }

  const cfVisitor = request.headers.get("cf-visitor");
  if (cfVisitor) {
    try {
      const v = JSON.parse(cfVisitor) as { scheme?: string };
      if (v?.scheme?.toLowerCase() === "https") {
        return { secureCookie: true, signal: "cf_visitor_https" };
      }
    } catch {
      /* ignore malformed header — same as legacy behavior (fall through to nextUrl) */
    }
  }

  if (request.nextUrl.protocol === "https:") {
    return { secureCookie: true, signal: "next_url_https" };
  }
  return { secureCookie: false, signal: "next_url_http" };
}

export function nextAuthSecureCookieForRequest(request: { headers: Headers; nextUrl: URL }): boolean {
  return resolveNextAuthHttpsForRequest(request).secureCookie;
}
