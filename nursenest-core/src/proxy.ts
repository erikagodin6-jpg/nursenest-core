// (FULL FILE REWRITE — SAFE, HARDENED)

import "@/lib/auth-trust-env";
import type { NextFetchEvent, NextMiddleware } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";

import {
  readAuthSessionJwtWithMeta,
  sessionJwtHasUserIdentity,
  type SessionJwtPayload,
} from "@/lib/auth/nextauth-request-jwt";
import {
  isProtectedLearnerApiPath,
  isProtectedLearnerAuthPath,
} from "@/lib/auth/protected-learner-surfaces";

import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";
import {
  computeMarketingNarrowViewportHintFromRequestHeaders,
  MARKETING_NARROW_VIEWPORT_HINT_HEADER,
} from "@/lib/marketing/marketing-narrow-viewport-hint";
import {
  REFERRAL_CLICK_PENDING_COOKIE,
  REFERRAL_CODE_COOKIE,
  REFERRAL_COOKIE_MAX_AGE_SECONDS,
  REFERRAL_LANDING_COOKIE,
  REFERRAL_UTM_CAMPAIGN_COOKIE,
  REFERRAL_UTM_MEDIUM_COOKIE,
  REFERRAL_UTM_SOURCE_COOKIE,
  referralCodeFromSearchParams,
} from "@/lib/referrals/referral-attribution-cookies";

let authProxyDepsPromise: Promise<{ runAuthMiddleware: NextMiddleware }> | null = null;

const PUBLIC_ASSET_EXTENSION_RE =
  /\.(?:avif|bmp|css|gif|ico|jpe?g|js|json|map|mp4|ogg|otf|pdf|png|svg|ttf|txt|webm|webmanifest|webp|woff2?)$/i;

function hasConfiguredAuthSecret(): boolean {
  return Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0),
  );
}

function loadAuthProxyDeps() {
  if (!hasConfiguredAuthSecret()) {
    return Promise.resolve({
      runAuthMiddleware: ((req: NextRequest) =>
        NextResponse.next({ request: { headers: req.headers } })) as NextMiddleware,
    });
  }

  if (!authProxyDepsPromise) {
    authProxyDepsPromise = import("@/lib/auth-middleware")
      .then(({ middlewareAuth }) => ({
        runAuthMiddleware: middlewareAuth as unknown as NextMiddleware,
      }))
      .catch(() => ({
        runAuthMiddleware: ((req: NextRequest) => NextResponse.next({ request: { headers: req.headers } })) as NextMiddleware,
      }));
  }
  return authProxyDepsPromise;
}

function loginRedirectForProtectedPath(request: NextRequest): NextResponse {
  const url = request.nextUrl.clone();
  const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("callbackUrl", callbackUrl);
  return NextResponse.redirect(url);
}

function unauthorizedApiResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized", code: "unauthorized" },
    {
      status: 401,
      headers: {
        "Cache-Control": "private, no-store, max-age=0",
      },
    },
  );
}

async function hasReadableProxySessionJwt(request: NextRequest): Promise<boolean> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret) return false;

  try {
    const { token } = await readAuthSessionJwtWithMeta(request, secret);
    return sessionJwtHasUserIdentity(
      token && typeof token === "object" ? (token as SessionJwtPayload) : null,
    );
  } catch {
    return false;
  }
}

async function failClosedProtectedLearnerRequest(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  if (!isProtectedLearnerAuthPath(pathname)) return null;

  const hasSession = await hasReadableProxySessionJwt(request);
  if (hasSession) return null;

  if (isProtectedLearnerApiPath(pathname)) {
    return unauthorizedApiResponse();
  }

  return loginRedirectForProtectedPath(request);
}

function ensureCorrelationId(request: NextRequest): NextRequest {
  if (request.headers.get(NN_CORRELATION_HEADER)) return request;

  const headers = new Headers(request.headers);
  headers.set(NN_CORRELATION_HEADER, randomUUID());

  return new NextRequest(request.url, { headers });
}

function forwardRequest(request: NextRequest): NextResponse {
  const res = NextResponse.next({
    request: { headers: request.headers },
  });

  const cid = request.headers.get(NN_CORRELATION_HEADER);
  if (cid) res.headers.set(NN_CORRELATION_HEADER, cid);

  return attachReferralAttributionCookies(request, res);
}

function setReferralCookie(res: NextResponse, name: string, value: string): void {
  res.cookies.set(name, value.slice(0, 512), {
    path: "/",
    maxAge: REFERRAL_COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

function attachReferralAttributionCookies(request: NextRequest, response: NextResponse): NextResponse {
  const code = referralCodeFromSearchParams(request.nextUrl.searchParams);
  if (!code) return response;

  setReferralCookie(response, REFERRAL_CODE_COOKIE, code);
  setReferralCookie(response, REFERRAL_LANDING_COOKIE, `${request.nextUrl.pathname}${request.nextUrl.search}`.slice(0, 512));
  setReferralCookie(response, REFERRAL_CLICK_PENDING_COOKIE, "1");

  const utmSource = request.nextUrl.searchParams.get("utm_source")?.trim();
  const utmMedium = request.nextUrl.searchParams.get("utm_medium")?.trim();
  const utmCampaign = request.nextUrl.searchParams.get("utm_campaign")?.trim();
  if (utmSource) setReferralCookie(response, REFERRAL_UTM_SOURCE_COOKIE, utmSource);
  if (utmMedium) setReferralCookie(response, REFERRAL_UTM_MEDIUM_COOKIE, utmMedium);
  if (utmCampaign) setReferralCookie(response, REFERRAL_UTM_CAMPAIGN_COOKIE, utmCampaign);

  return response;
}

export function isStaticAssetBypassPath(pathname: string): boolean {
  if (!pathname || pathname === "/") return false;

  if (
    pathname.startsWith("/_next/") ||
    pathname.startsWith("/static/") ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/img/") ||
    pathname.startsWith("/logos/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/marketing/homepage-screenshots/")
  ) {
    return true;
  }

  if (
    pathname === "/favicon.ico" ||
    pathname === "/apple-touch-icon.png" ||
    pathname === "/manifest.json" ||
    pathname === "/site.webmanifest" ||
    pathname === "/icon-192.png" ||
    pathname === "/icon-512.png"
  ) {
    return true;
  }

  if (
    pathname.startsWith("/api/marketing-assets/") ||
    pathname.startsWith("/api/assets/")
  ) {
    return true;
  }

  return PUBLIC_ASSET_EXTENSION_RE.test(pathname);
}

export function isPublicProbeOrCrawlerBypassPath(pathname: string): boolean {
  if (pathname === "/healthz" || pathname === "/readyz") return true;
  /*
   * Sitemap index + all child urlsets must bypass auth middleware so Googlebot
   * can fetch them without hitting session/redirect logic. Previously only
   * /sitemap.xml, /sitemap-allied.xml, and /sitemap-new-grad.xml were listed;
   * the other 10 child sitemaps (sitemap-core, sitemap-blog, sitemap-pathways,
   * sitemap-lessons, sitemap-localized, sitemap-clinical-modules, sitemap-cnple,
   * sitemap-authority-clusters, sitemap-fr-blog, sitemap-es-blog) went through
   * the full auth middleware chain and were unreachable to crawlers (GSC error).
   * Pattern covers all current and future /sitemap-*.xml children automatically.
   */
  if (
    pathname === "/sitemap.xml" ||
    (pathname.startsWith("/sitemap-") && pathname.endsWith(".xml")) ||
    pathname === "/robots.txt"
  ) {
    return true;
  }
  if (pathname === "/api/health" || pathname.startsWith("/api/health/")) return true;
  return false;
}

async function enforceAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    const pathname = request.nextUrl.pathname;

    if (!pathname.startsWith("/admin") && !pathname.startsWith("/internal")) return null;

    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) return null;

    const { token } = await readAuthSessionJwtWithMeta(request, secret);

    const hasIdentity = sessionJwtHasUserIdentity(
      token && typeof token === "object" ? (token as SessionJwtPayload) : null,
    );

    if (!hasIdentity) {
      const url = request.nextUrl.clone();
      const callbackUrl = `${pathname}${request.nextUrl.search}`;
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(url);
    }

    return null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  try {
    const req = ensureCorrelationId(request);
    const pathname = req.nextUrl.pathname;

    if (isStaticAssetBypassPath(pathname)) {
      return NextResponse.next();
    }

    if (isPublicProbeOrCrawlerBypassPath(pathname)) {
      return forwardRequest(req);
    }

    const headers = new Headers(req.headers);
    headers.set("x-nn-request-pathname", pathname);
    headers.set("x-nn-request-url", req.url);
    headers.set(
      MARKETING_NARROW_VIEWPORT_HINT_HEADER,
      computeMarketingNarrowViewportHintFromRequestHeaders(headers) ? "1" : "0",
    );

    const forwarded = new NextRequest(req.url, { headers });

    if (!hasConfiguredAuthSecret()) {
      const protectedDeny = await failClosedProtectedLearnerRequest(forwarded);
      if (protectedDeny) return protectedDeny;
    }

    const { runAuthMiddleware } = await loadAuthProxyDeps();

    let res: Response | null = null;

    try {
      res = (await runAuthMiddleware(forwarded, event)) ?? null;
    } catch {
      res = null;
    }

    const correlationId = headers.get(NN_CORRELATION_HEADER) ?? randomUUID();

    if (!res) {
      const protectedDeny = await failClosedProtectedLearnerRequest(forwarded);
      if (protectedDeny) return protectedDeny;

      const adminRedirect = await enforceAdmin(forwarded);
      if (adminRedirect) return adminRedirect;

      return forwardRequest(forwarded);
    }

    if (res.headers.get("x-middleware-next") === "1") {
      const next = NextResponse.next({
        request: { headers: forwarded.headers },
      });

      next.headers.set(NN_CORRELATION_HEADER, correlationId);
      return attachReferralAttributionCookies(forwarded, next);
    }

    if (res.status >= 300 && res.status < 400) {
      if (isProtectedLearnerApiPath(pathname)) {
        const unauthorized = unauthorizedApiResponse();
        unauthorized.headers.set(NN_CORRELATION_HEADER, correlationId);
        return unauthorized;
      }

      const { maybeEnhanceSessionExpiredLoginRedirect } = await import(
        "@/lib/auth/session-expired-redirect"
      );
      return (await maybeEnhanceSessionExpiredLoginRedirect(res, forwarded)) as NextResponse;
    }

    const final = NextResponse.next({
      request: { headers: forwarded.headers },
    });

    final.headers.set(NN_CORRELATION_HEADER, correlationId);
    return attachReferralAttributionCookies(forwarded, final);
  } catch {
    return attachReferralAttributionCookies(request, NextResponse.next());
  }
}

export const config = {
  matcher: [
    /*
     * Run proxy for application routes only. Static public files and Next build
     * assets must never enter auth, marketing, or pathway resolution logic.
     */
    "/((?!_next/|static/|assets/|images/|img/|logos/|brand/|marketing/homepage-screenshots/|favicon\\.ico$|apple-touch-icon\\.png$|manifest\\.json$|site\\.webmanifest$|icon-192\\.png$|icon-512\\.png$|api/marketing-assets/|api/assets/|.*\\.(?:avif|bmp|css|gif|ico|jpe?g|js|json|map|mp4|ogg|otf|pdf|png|svg|ttf|txt|webm|webmanifest|webp|woff2?)$).*)",
  ],
};
