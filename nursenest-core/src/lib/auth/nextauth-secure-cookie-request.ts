/**
 * Auth.js / NextAuth v5 names session cookies with a `__Secure-` prefix when issued over HTTPS.
 * `getToken({ req, secret })` defaults to `secureCookie: false`, which misses those cookies in proxy
 * and rate limiting — authenticated requests then look anonymous.
 */
export type NextAuthHttpsSignal =
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

/**
 * Resolves whether `getToken` should use the secure session cookie name, and records which input
 * determined that (for diagnostics — no secrets).
 */
export function resolveNextAuthHttpsForRequest(request: { headers: Headers; nextUrl: URL }): NextAuthHttpsResolution {
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
