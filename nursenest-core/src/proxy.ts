/**
 * Next.js 16+: `proxy` replaces `middleware` (same matcher + auth behavior).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Unauthenticated `/app/*` requests are handled by {@link middlewareAuth}'s `authorized` callback
 * (sign-in). Do **not** pre-redirect `/app/lessons` with `getToken()` — in Edge it can miss valid JWTs
 * that the same middleware resolves, incorrectly sending paying subscribers to the public `/lessons` hub.
 */
import "@/lib/auth-trust-env";
import type { NextFetchEvent, NextMiddleware } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { middlewareAuth } from "@/lib/auth-middleware";
import { NN_CORRELATION_HEADER } from "@/lib/observability/request-correlation";
import { canonicalExamHubPathFromPossiblyLocalizedPath } from "@/lib/i18n/exam-hub-path";
import { MARKETING_LOCALE_COOKIE, MARKETING_LOCALE_COOKIE_MAX_AGE } from "@/lib/i18n/marketing-locale-cookie";
import { isRateLimitingEnabled } from "@/lib/config/production-safety-flags";
import { enforceApiRateLimit } from "@/lib/server/rate-limit";

/** NextAuth `auth` middleware typing does not always align with App Router `NextRequest` + `NextFetchEvent`. */
const runAuthMiddleware = middlewareAuth as unknown as NextMiddleware;

function ensureIncomingCorrelationId(request: NextRequest): NextRequest {
  if (request.headers.get(NN_CORRELATION_HEADER)?.trim()) return request;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NN_CORRELATION_HEADER, randomUUID().slice(0, 128));
  return new NextRequest(request.url, { headers: requestHeaders });
}

function withPathnameHeader(request: NextRequest): NextRequest {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);

  const correlationId =
    requestHeaders.get(NN_CORRELATION_HEADER)?.trim() ||
    requestHeaders.get("x-request-id")?.trim() ||
    randomUUID();
  requestHeaders.set(NN_CORRELATION_HEADER, correlationId.slice(0, 128));

  /** Trusted pathname for server RBAC + layouts (RSC must not rely on spoofable client headers). */
  requestHeaders.set("x-nn-request-pathname", pathname);

  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    requestHeaders.set("x-nn-admin-path", pathname);
  }

  const isExamHub =
    pathname === "/us" ||
    pathname.startsWith("/us/") ||
    pathname === "/canada" ||
    pathname.startsWith("/canada/");
  if (isExamHub) {
    requestHeaders.set("x-nn-pathname", pathname);
  }

  return new NextRequest(request.url, { headers: requestHeaders });
}

/**
 * Auth.js middleware returns `NextResponse.next()` without `request` overrides, so headers set only on
 * the cloned `NextRequest` are not forwarded to Server Components. Next.js only applies inbound
 * request header overrides when `NextResponse.next({ request: { headers } })` is used (see
 * `handleMiddlewareField` in `next/dist/server/web/spec-extension/response.js`).
 *
 * Re-wrap the "continue" response so `x-nn-request-pathname` / `x-nn-admin-path` reach `resolveAdminRequestPath`,
 * while preserving session `Set-Cookie` from the auth middleware.
 */
function mergeAuthContinueWithForwardedRequest(res: Response, forwarded: NextRequest, correlationId: string): Response {
  if (res.headers.get("x-middleware-next") !== "1") {
    return res;
  }
  const next = NextResponse.next({
    request: { headers: forwarded.headers },
  });
  const cookies =
    typeof res.headers.getSetCookie === "function"
      ? res.headers.getSetCookie()
      : (() => {
          const single = res.headers.get("set-cookie");
          return single ? [single] : [];
        })();
  for (const c of cookies) {
    if (c) next.headers.append("Set-Cookie", c);
  }
  next.headers.set(NN_CORRELATION_HEADER, correlationId.slice(0, 128));
  return next;
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const req = ensureIncomingCorrelationId(request);
  const pathname = req.nextUrl.pathname;

  if (pathname.startsWith("/api/") && isRateLimitingEnabled()) {
    const limited = await enforceApiRateLimit(req);
    if (limited) {
      const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
      limited.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
      return limited;
    }
  }

  // ── Existing: locale-prefixed exam hub canonical redirect ──────────────────
  const canonicalExamHub = canonicalExamHubPathFromPossiblyLocalizedPath(pathname);
  if (canonicalExamHub) {
    const url = req.nextUrl.clone();
    url.pathname = canonicalExamHub.canonicalPath;
    const response = NextResponse.redirect(url);
    const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
    response.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
    response.cookies.set(MARKETING_LOCALE_COOKIE, canonicalExamHub.locale, {
      path: "/",
      maxAge: MARKETING_LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: true,
    });
    return response;
  }

  const forwarded = withPathnameHeader(req);
  const res = await runAuthMiddleware(forwarded, event);
  const outCid = forwarded.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
  const merged = mergeAuthContinueWithForwardedRequest(res, forwarded, outCid);
  if (merged !== res) {
    return merged;
  }
  res.headers.set(NN_CORRELATION_HEADER, outCid.slice(0, 128));
  return res;
}

/**
 * Include bare `/app` and `/admin` — `/app/:path*` alone can miss the dashboard root on some matchers.
 * `/us/*` and `/canada/*` run proxy so `x-nn-pathname` reaches `(default)/layout` for cookie-backed i18n on exam hubs.
 * Locale-prefixed legacy forms (`/fr/canada/...`) also pass through here so we can strip the locale prefix,
 * persist `nn_marketing_locale`, and redirect to the canonical country-first hub URL.
 */
export const config = {
  matcher: [
    "/app",
    "/app/:path*",
    "/admin",
    "/admin/:path*",
    "/api",
    "/api/:path*",
    "/api/admin",
    "/api/admin/:path*",
    "/us",
    "/us/:path*",
    "/canada",
    "/canada/:path*",
    "/:locale/us",
    "/:locale/us/:path*",
    "/:locale/canada",
    "/:locale/canada/:path*",
  ],
};
