/**
 * Next.js 16+: `proxy` replaces `middleware` (same matcher + auth behavior).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Guests on `/app/lessons` are redirected to the public `/lessons` hub; signed-in learners keep
 * the subscriber lesson list (auth runs after this check).
 *
 * Geo-routing: root "/" is the ONLY path that triggers an automatic geo-redirect.
 * All other paths pass through to auth middleware unchanged.
 */
import "@/lib/auth-trust-env";
import type { NextFetchEvent, NextMiddleware } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { middlewareAuth } from "@/lib/auth-middleware";
import { canonicalExamHubPathFromPossiblyLocalizedPath } from "@/lib/i18n/exam-hub-path";
import { MARKETING_LOCALE_COOKIE, MARKETING_LOCALE_COOKIE_MAX_AGE } from "@/lib/i18n/marketing-locale-cookie";
import { resolveGeo, geoRedirectPath } from "@/lib/i18n/geo-resolver";
import {
  GLOBAL_REGION_COOKIE,
  GLOBAL_REGION_COOKIE_MAX_AGE,
  parseGlobalRegionCookie,
} from "@/lib/region/global-region-cookie";

/** NextAuth `auth` middleware typing does not always align with App Router `NextRequest` + `NextFetchEvent`. */
const runAuthMiddleware = middlewareAuth as unknown as NextMiddleware;

function withPathnameHeader(request: NextRequest): NextRequest {
  const pathname = request.nextUrl.pathname;
  const requestHeaders = new Headers(request.headers);

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api/admin")
  ) {
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

  if (isExamHub || pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    return new NextRequest(request.url, { headers: requestHeaders });
  }
  return request;
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const pathname = request.nextUrl.pathname;

  // ── Root "/" geo-redirect (the ONLY auto-redirect path) ────────────────────
  if (pathname === "/") {
    const ipCountry =
      request.headers.get("x-vercel-ip-country") ??
      request.headers.get("cf-ipcountry");
    const acceptLang = request.headers.get("accept-language");
    const overrideCookie = parseGlobalRegionCookie(
      request.cookies.get(GLOBAL_REGION_COOKIE)?.value,
    );

    const geo = resolveGeo(ipCountry, acceptLang, overrideCookie);
    const redirectTo = geoRedirectPath(geo);
    const url = request.nextUrl.clone();
    url.pathname = redirectTo;

    const response = NextResponse.redirect(url, 307);

    if (!overrideCookie) {
      response.cookies.set(GLOBAL_REGION_COOKIE, geo.region, {
        path: "/",
        maxAge: GLOBAL_REGION_COOKIE_MAX_AGE,
        sameSite: "lax",
        httpOnly: false,
      });
    }

    response.headers.set("x-nn-geo-source", geo.source);
    if (geo.detectedCountryCode) {
      response.headers.set("x-nn-geo-country", geo.detectedCountryCode);
    }

    return response;
  }

  // ── Existing: locale-prefixed exam hub canonical redirect ──────────────────
  const canonicalExamHub = canonicalExamHubPathFromPossiblyLocalizedPath(pathname);
  if (canonicalExamHub) {
    const url = request.nextUrl.clone();
    url.pathname = canonicalExamHub.canonicalPath;
    const response = NextResponse.redirect(url);
    response.cookies.set(MARKETING_LOCALE_COOKIE, canonicalExamHub.locale, {
      path: "/",
      maxAge: MARKETING_LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: true,
    });
    return response;
  }

  // ── Existing: guest /app/lessons → /lessons ────────────────────────────────
  if (pathname === "/app/lessons") {
    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    const token = secret ? await getToken({ req: request, secret }) : null;
    if (!token) {
      return NextResponse.redirect(new URL("/lessons", request.url));
    }
  }

  return runAuthMiddleware(withPathnameHeader(request), event);
}

/**
 * Include bare `/app` and `/admin` — `/app/:path*` alone can miss the dashboard root on some matchers.
 * `/us/*` and `/canada/*` run proxy so `x-nn-pathname` reaches `(default)/layout` for cookie-backed i18n on exam hubs.
 * Locale-prefixed legacy forms (`/fr/canada/...`) also pass through here so we can strip the locale prefix,
 * persist `nn_marketing_locale`, and redirect to the canonical country-first hub URL.
 * Root "/" is matched for geo-routing.
 */
export const config = {
  matcher: [
    "/",
    "/app",
    "/app/:path*",
    "/admin",
    "/admin/:path*",
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
