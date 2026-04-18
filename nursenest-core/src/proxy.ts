/**
 * Next.js 16+: `proxy` replaces `middleware` (same matcher + auth behavior).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Unauthenticated `/app/*` requests are handled by {@link middlewareAuth}'s `authorized` callback
 * (sign-in). Do **not** pre-redirect `/app/lessons` with `getToken()` — in Edge it can miss valid JWTs
 * that the same middleware resolves, incorrectly sending paying subscribers to the public `/lessons` hub.
 */
import type { NextFetchEvent, NextMiddleware } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";

type ProxyAuthDeps = {
  getToken: typeof import("next-auth/jwt").getToken;
  runAuthMiddleware: NextMiddleware;
};

type ProxyAdminDeps = {
  isPathAllowedForStaffTier: typeof import("@/lib/auth/admin-path-policy").isPathAllowedForStaffTier;
  loadUserRoleFromDbIdentity: typeof import("@/lib/auth/admin-role-source").loadUserRoleFromDbIdentity;
  safeServerLog: typeof import("@/lib/observability/safe-server-log").safeServerLog;
};

type ProxyApiDeps = {
  emitStructuredLog: typeof import("@/lib/observability/structured-log").emitStructuredLog;
  enforceApiRateLimit: typeof import("@/lib/server/rate-limit").enforceApiRateLimit;
  isRateLimitingEnabled: typeof import("@/lib/config/production-safety-flags").isRateLimitingEnabled;
};

type ProxyMarketingDeps = {
  EXAM_HUB_PREVIEW_COOKIE: typeof import("@/lib/admin/exam-hub-preview-cookie").EXAM_HUB_PREVIEW_COOKIE;
  MARKETING_LOCALE_COOKIE: typeof import("@/lib/i18n/marketing-locale-cookie").MARKETING_LOCALE_COOKIE;
  MARKETING_LOCALE_COOKIE_MAX_AGE: typeof import("@/lib/i18n/marketing-locale-cookie").MARKETING_LOCALE_COOKIE_MAX_AGE;
  REGIONAL_EXAM_MARKETING_FALLBACK_PATH: typeof import("@/lib/marketing/expansion-exams-path-gate").REGIONAL_EXAM_MARKETING_FALLBACK_PATH;
  canonicalExamHubPathFromPossiblyLocalizedPath: typeof import("@/lib/i18n/exam-hub-path").canonicalExamHubPathFromPossiblyLocalizedPath;
  globalRegionSlugFromRegionalMarketingPublicPath: typeof import("@/lib/marketing/regional-marketing-public-gate").globalRegionSlugFromRegionalMarketingPublicPath;
  isRegionPublishedForPublicSite: typeof import("@/lib/navigation/country-exam-launch-readiness").isRegionPublishedForPublicSite;
};

let authDepsPromise: Promise<ProxyAuthDeps> | undefined;
let adminDepsPromise: Promise<ProxyAdminDeps> | undefined;
let apiDepsPromise: Promise<ProxyApiDeps> | undefined;
let marketingDepsPromise: Promise<ProxyMarketingDeps> | undefined;

async function loadAuthProxyDeps(): Promise<ProxyAuthDeps> {
  authDepsPromise ??= (async () => {
    await import("@/lib/auth-trust-env");
    const [{ getToken }, { middlewareAuth }] = await Promise.all([
      import("next-auth/jwt"),
      import("@/lib/auth-middleware"),
    ]);
    return {
      getToken,
      runAuthMiddleware: middlewareAuth as unknown as NextMiddleware,
    };
  })();
  return authDepsPromise;
}

async function loadAdminProxyDeps(): Promise<ProxyAdminDeps> {
  adminDepsPromise ??= (async () => {
    const [{ isPathAllowedForStaffTier }, { loadUserRoleFromDbIdentity }, { safeServerLog }] = await Promise.all([
      import("@/lib/auth/admin-path-policy"),
      import("@/lib/auth/admin-role-source"),
      import("@/lib/observability/safe-server-log"),
    ]);
    return {
      isPathAllowedForStaffTier,
      loadUserRoleFromDbIdentity,
      safeServerLog,
    };
  })();
  return adminDepsPromise;
}

async function loadApiProxyDeps(): Promise<ProxyApiDeps> {
  apiDepsPromise ??= (async () => {
    const [{ emitStructuredLog }, { enforceApiRateLimit }, { isRateLimitingEnabled }] = await Promise.all([
      import("@/lib/observability/structured-log"),
      import("@/lib/server/rate-limit"),
      import("@/lib/config/production-safety-flags"),
    ]);
    return {
      emitStructuredLog,
      enforceApiRateLimit,
      isRateLimitingEnabled,
    };
  })();
  return apiDepsPromise;
}

async function loadMarketingProxyDeps(): Promise<ProxyMarketingDeps> {
  marketingDepsPromise ??= (async () => {
    const [
      { EXAM_HUB_PREVIEW_COOKIE },
      { MARKETING_LOCALE_COOKIE, MARKETING_LOCALE_COOKIE_MAX_AGE },
      { REGIONAL_EXAM_MARKETING_FALLBACK_PATH },
      { canonicalExamHubPathFromPossiblyLocalizedPath },
      { globalRegionSlugFromRegionalMarketingPublicPath },
      { isRegionPublishedForPublicSite },
    ] = await Promise.all([
      import("@/lib/admin/exam-hub-preview-cookie"),
      import("@/lib/i18n/marketing-locale-cookie"),
      import("@/lib/marketing/expansion-exams-path-gate"),
      import("@/lib/i18n/exam-hub-path"),
      import("@/lib/marketing/regional-marketing-public-gate"),
      import("@/lib/navigation/country-exam-launch-readiness"),
    ]);
    return {
      EXAM_HUB_PREVIEW_COOKIE,
      MARKETING_LOCALE_COOKIE,
      MARKETING_LOCALE_COOKIE_MAX_AGE,
      REGIONAL_EXAM_MARKETING_FALLBACK_PATH,
      canonicalExamHubPathFromPossiblyLocalizedPath,
      globalRegionSlugFromRegionalMarketingPublicPath,
      isRegionPublishedForPublicSite,
    };
  })();
  return marketingDepsPromise;
}

function isHealthProxyBypassPath(pathname: string): boolean {
  return pathname === "/api/health" || pathname === "/api/healthz" || pathname === "/api/health/ready";
}

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
  /**
   * Full request URL — lets {@link resolveAdminRequestPath} recover `/admin/...` when pathname-only
   * headers are missing in RSC (non-super staff would otherwise see RBAC path `/` and be redirected).
   */
  requestHeaders.set("x-nn-request-url", request.url);

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

function adminAccessDebug(): boolean {
  return process.env.ADMIN_ACCESS_DEBUG === "1" || process.env.ADMIN_ACCESS_DEBUG === "true";
}

function copySetCookies(from: Response, to: NextResponse): NextResponse {
  const cookies =
    typeof from.headers.getSetCookie === "function"
      ? from.headers.getSetCookie()
      : (() => {
          const single = from.headers.get("set-cookie");
          return single ? [single] : [];
        })();
  for (const c of cookies) {
    if (c) to.headers.append("Set-Cookie", c);
  }
  return to;
}

function redirectWithCorrelation(request: NextRequest, pathname: string, correlationId: string): NextResponse {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  const response = NextResponse.redirect(url);
  response.headers.set(NN_CORRELATION_HEADER, correlationId.slice(0, 128));
  return response;
}

async function enforceAdminProxyRoute(
  request: NextRequest,
  authDeps: ProxyAuthDeps,
  adminDeps: ProxyAdminDeps,
): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin")) return null;

  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = secret ? await authDeps.getToken({ req: request, secret }) : null;
  const userId =
    (typeof token?.sub === "string" && token.sub.trim()) ||
    (token as { id?: string } | null)?.id?.trim() ||
    null;
  const email = typeof token?.email === "string" && token.email.trim().length > 0 ? token.email.trim() : null;
  const correlationId = request.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();

  if (!userId && !email) {
    if (adminAccessDebug()) {
      adminDeps.safeServerLog("admin_access", "proxy_admin_gate", {
        pathAttempted: pathname,
        email: email ?? undefined,
        role: "missing_token_identity",
        result: "redirect_login",
      });
    }
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.headers.set(NN_CORRELATION_HEADER, correlationId.slice(0, 128));
    return response;
  }

  const roleRecord = await adminDeps.loadUserRoleFromDbIdentity({ userId, email });
  if (!roleRecord?.isAdmin) {
    if (adminAccessDebug()) {
      adminDeps.safeServerLog("admin_access", "proxy_admin_gate", {
        pathAttempted: pathname,
        email: email ?? undefined,
        role: roleRecord?.role ?? "missing",
        result: "redirect_non_admin",
      });
    }
    return redirectWithCorrelation(request, "/app", correlationId);
  }

  if (!adminDeps.isPathAllowedForStaffTier(roleRecord.tier, pathname)) {
    if (adminAccessDebug()) {
      adminDeps.safeServerLog("admin_access", "proxy_admin_gate", {
        pathAttempted: pathname,
        email: email ?? undefined,
        role: roleRecord.role,
        result: "redirect_rbac",
      });
    }
    return redirectWithCorrelation(request, "/admin", correlationId);
  }

  if (adminAccessDebug()) {
    adminDeps.safeServerLog("admin_access", "proxy_admin_gate", {
      pathAttempted: pathname,
      email: email ?? undefined,
      role: roleRecord.role,
      result: "allow",
    });
  }

  return null;
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
  copySetCookies(res, next);
  next.headers.set(NN_CORRELATION_HEADER, correlationId.slice(0, 128));
  return next;
}

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  const req = ensureIncomingCorrelationId(request);
  const pathname = req.nextUrl.pathname;
  if (isHealthProxyBypassPath(pathname)) {
    const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
    const next = NextResponse.next();
    next.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
    return next;
  }

  if (pathname.startsWith("/api")) {
    const { emitStructuredLog, enforceApiRateLimit, isRateLimitingEnabled } = await loadApiProxyDeps();
    const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim();
    emitStructuredLog("request_start", "info", {
      correlationId: cid,
      route: pathname.slice(0, 200),
      method: req.method,
    });

    /** Next.js 16+ proxy defaults to the Node.js runtime — `checkRateLimitUnified` uses shared Postgres buckets when `DATABASE_URL` is set (not per-instance memory). */
    if (pathname.startsWith("/api/") && isRateLimitingEnabled()) {
      const limited = await enforceApiRateLimit(req);
      if (limited) {
        const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
        limited.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
        return limited;
      }
    }
  }

  const marketingDeps = await loadMarketingProxyDeps();
  // ── Existing: locale-prefixed exam hub canonical redirect ──────────────────
  const canonicalExamHub = marketingDeps.canonicalExamHubPathFromPossiblyLocalizedPath(pathname);
  if (canonicalExamHub) {
    const url = req.nextUrl.clone();
    url.pathname = canonicalExamHub.canonicalPath;
    const response = NextResponse.redirect(url);
    const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
    response.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
    response.cookies.set(marketingDeps.MARKETING_LOCALE_COOKIE, canonicalExamHub.locale, {
      path: "/",
      maxAge: marketingDeps.MARKETING_LOCALE_COOKIE_MAX_AGE,
      sameSite: "lax",
      httpOnly: true,
    });
    return response;
  }

  // Unpublished regional marketing (`/exams/…` hubs + country-topic SEO trees): redirect to a published hub.
  const gatedRegion = marketingDeps.globalRegionSlugFromRegionalMarketingPublicPath(pathname);
  if (gatedRegion && !marketingDeps.isRegionPublishedForPublicSite(gatedRegion)) {
    const previewRegion = req.cookies.get(marketingDeps.EXAM_HUB_PREVIEW_COOKIE)?.value ?? "";
    const allowStaffPreview = previewRegion === gatedRegion;
    if (!allowStaffPreview) {
      const url = req.nextUrl.clone();
      url.pathname = marketingDeps.REGIONAL_EXAM_MARKETING_FALLBACK_PATH;
      const response = NextResponse.redirect(url, 307);
      const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
      response.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
      return response;
    }
  }

  const authDeps = await loadAuthProxyDeps();
  const forwarded = withPathnameHeader(req);
  const res = await authDeps.runAuthMiddleware(forwarded, event);
  const outCid = forwarded.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
  if (res == null) {
    const adminRedirect = pathname.startsWith("/admin")
      ? await enforceAdminProxyRoute(forwarded, authDeps, await loadAdminProxyDeps())
      : null;
    if (adminRedirect) {
      return adminRedirect;
    }
    const next = NextResponse.next({ request: { headers: forwarded.headers } });
    next.headers.set(NN_CORRELATION_HEADER, outCid.slice(0, 128));
    return next;
  }
  const merged = mergeAuthContinueWithForwardedRequest(res, forwarded, outCid);
  if (merged !== res) {
    const adminRedirect = pathname.startsWith("/admin")
      ? await enforceAdminProxyRoute(forwarded, authDeps, await loadAdminProxyDeps())
      : null;
    if (adminRedirect) {
      return copySetCookies(res, adminRedirect);
    }
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
    "/exams",
    "/exams/:path*",
    "/us",
    "/us/:path*",
    "/canada",
    "/canada/:path*",
    "/:locale/us",
    "/:locale/us/:path*",
    "/:locale/canada",
    "/:locale/canada/:path*",
    "/:locale/exams",
    "/:locale/exams/:path*",
    // Must match REGIONAL_MARKETING_LOCALE_PREFIX_MATCHERS in regional-marketing-public-gate.ts (inlined for Next static matcher analysis).
    "/:locale/japan",
    "/:locale/japan/:path*",
    "/:locale/india",
    "/:locale/india/:path*",
    "/:locale/china",
    "/:locale/china/:path*",
    "/:locale/korea",
    "/:locale/korea/:path*",
    "/:locale/germany",
    "/:locale/germany/:path*",
    "/:locale/france",
    "/:locale/france/:path*",
    "/:locale/italy",
    "/:locale/italy/:path*",
    "/:locale/hungary",
    "/:locale/hungary/:path*",
    "/:locale/portugal",
    "/:locale/portugal/:path*",
    "/:locale/mexico",
    "/:locale/mexico/:path*",
    "/:locale/australia",
    "/:locale/australia/:path*",
    "/:locale/middle-east",
    "/:locale/middle-east/:path*",
    "/japan",
    "/japan/:path*",
    "/india",
    "/india/:path*",
    "/china",
    "/china/:path*",
    "/korea",
    "/korea/:path*",
    "/germany",
    "/germany/:path*",
    "/france",
    "/france/:path*",
    "/italy",
    "/italy/:path*",
    "/hungary",
    "/hungary/:path*",
    "/portugal",
    "/portugal/:path*",
    "/mexico",
    "/mexico/:path*",
    "/australia",
    "/australia/:path*",
    "/middle-east",
    "/middle-east/:path*",
  ],
};
