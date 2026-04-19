/**
 * Next.js 16+: `proxy` replaces `middleware` (same matcher + auth behavior).
 * @see https://nextjs.org/docs/messages/middleware-to-proxy
 *
 * Unauthenticated `/app/*` requests are handled by `middlewareAuth`'s `authorized` callback
 * (sign-in). Do **not** pre-redirect `/app/lessons` with `getToken()` — in Edge it can miss valid JWTs
 * that the same middleware resolves, incorrectly sending paying subscribers to the public `/lessons` hub.
 */
import "@/lib/auth-trust-env";
import type { NextFetchEvent, NextMiddleware } from "next/server";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";
import { NN_HOME_PERF_ANCHOR_HEADER, NN_HOME_PERF_REQUEST_KIND_HEADER } from "@/lib/observability/home-perf-headers";

type AdminProxyDeps = {
  getToken: typeof import("next-auth/jwt").getToken;
  loadUserRoleFromDbIdentity: typeof import("@/lib/auth/admin-role-source").loadUserRoleFromDbIdentity;
  isPathAllowedForStaffTier: typeof import("@/lib/auth/admin-path-policy").isPathAllowedForStaffTier;
  safeServerLog: typeof import("@/lib/observability/safe-server-log").safeServerLog;
};

type ApiProxyDeps = {
  emitStructuredLog: typeof import("@/lib/observability/structured-log").emitStructuredLog;
  isRateLimitingEnabled: typeof import("@/lib/config/production-safety-flags").isRateLimitingEnabled;
  enforceApiRateLimit: typeof import("@/lib/server/rate-limit").enforceApiRateLimit;
};

type AuthProxyDeps = {
  runAuthMiddleware: NextMiddleware;
};

type MarketingProxyDeps = {
  canonicalExamHubPathFromPossiblyLocalizedPath: typeof import("@/lib/i18n/exam-hub-path").canonicalExamHubPathFromPossiblyLocalizedPath;
  MARKETING_LOCALE_COOKIE: typeof import("@/lib/i18n/marketing-locale-cookie").MARKETING_LOCALE_COOKIE;
  MARKETING_LOCALE_COOKIE_MAX_AGE: typeof import("@/lib/i18n/marketing-locale-cookie").MARKETING_LOCALE_COOKIE_MAX_AGE;
  REGIONAL_EXAM_MARKETING_FALLBACK_PATH: typeof import("@/lib/marketing/expansion-exams-path-gate").REGIONAL_EXAM_MARKETING_FALLBACK_PATH;
  globalRegionSlugFromRegionalMarketingPublicPath: typeof import("@/lib/marketing/regional-marketing-public-gate").globalRegionSlugFromRegionalMarketingPublicPath;
  EXAM_HUB_PREVIEW_COOKIE: typeof import("@/lib/admin/exam-hub-preview-cookie").EXAM_HUB_PREVIEW_COOKIE;
  isRegionPublishedForPublicSite: typeof import("@/lib/navigation/country-exam-launch-readiness").isRegionPublishedForPublicSite;
};

let adminProxyDepsPromise: Promise<AdminProxyDeps> | null = null;
let apiProxyDepsPromise: Promise<ApiProxyDeps> | null = null;
let authProxyDepsPromise: Promise<AuthProxyDeps> | null = null;
let marketingProxyDepsPromise: Promise<MarketingProxyDeps> | null = null;

function loadAdminProxyDeps(): Promise<AdminProxyDeps> {
  if (!adminProxyDepsPromise) {
    adminProxyDepsPromise = Promise.all([
      import("next-auth/jwt"),
      import("@/lib/auth/admin-role-source"),
      import("@/lib/auth/admin-path-policy"),
      import("@/lib/observability/safe-server-log"),
    ]).then(([jwt, adminRoleSource, adminPathPolicy, safeServerLog]) => ({
      getToken: jwt.getToken,
      loadUserRoleFromDbIdentity: adminRoleSource.loadUserRoleFromDbIdentity,
      isPathAllowedForStaffTier: adminPathPolicy.isPathAllowedForStaffTier,
      safeServerLog: safeServerLog.safeServerLog,
    }));
  }
  return adminProxyDepsPromise;
}

function loadApiProxyDeps(): Promise<ApiProxyDeps> {
  if (!apiProxyDepsPromise) {
    apiProxyDepsPromise = Promise.all([
      import("@/lib/observability/structured-log"),
      import("@/lib/config/production-safety-flags"),
      import("@/lib/server/rate-limit"),
    ]).then(([structuredLog, productionSafetyFlags, rateLimit]) => ({
      emitStructuredLog: structuredLog.emitStructuredLog,
      isRateLimitingEnabled: productionSafetyFlags.isRateLimitingEnabled,
      enforceApiRateLimit: rateLimit.enforceApiRateLimit,
    }));
  }
  return apiProxyDepsPromise;
}

function loadAuthProxyDeps(): Promise<AuthProxyDeps> {
  if (!authProxyDepsPromise) {
    authProxyDepsPromise = import("@/lib/auth-middleware").then(({ middlewareAuth }) => ({
      /** NextAuth `auth` middleware typing does not always align with App Router `NextRequest` + `NextFetchEvent`. */
      runAuthMiddleware: middlewareAuth as unknown as NextMiddleware,
    }));
  }
  return authProxyDepsPromise;
}

function loadMarketingProxyDeps(): Promise<MarketingProxyDeps> {
  if (!marketingProxyDepsPromise) {
    marketingProxyDepsPromise = Promise.all([
      import("@/lib/i18n/exam-hub-path"),
      import("@/lib/i18n/marketing-locale-cookie"),
      import("@/lib/marketing/expansion-exams-path-gate"),
      import("@/lib/marketing/regional-marketing-public-gate"),
      import("@/lib/admin/exam-hub-preview-cookie"),
      import("@/lib/navigation/country-exam-launch-readiness"),
    ]).then(
      ([
        examHubPath,
        marketingLocaleCookie,
        expansionExamPathGate,
        regionalMarketingPublicGate,
        previewCookie,
        countryExamLaunchReadiness,
      ]) => ({
        canonicalExamHubPathFromPossiblyLocalizedPath: examHubPath.canonicalExamHubPathFromPossiblyLocalizedPath,
        MARKETING_LOCALE_COOKIE: marketingLocaleCookie.MARKETING_LOCALE_COOKIE,
        MARKETING_LOCALE_COOKIE_MAX_AGE: marketingLocaleCookie.MARKETING_LOCALE_COOKIE_MAX_AGE,
        REGIONAL_EXAM_MARKETING_FALLBACK_PATH: expansionExamPathGate.REGIONAL_EXAM_MARKETING_FALLBACK_PATH,
        globalRegionSlugFromRegionalMarketingPublicPath:
          regionalMarketingPublicGate.globalRegionSlugFromRegionalMarketingPublicPath,
        EXAM_HUB_PREVIEW_COOKIE: previewCookie.EXAM_HUB_PREVIEW_COOKIE,
        isRegionPublishedForPublicSite: countryExamLaunchReadiness.isRegionPublishedForPublicSite,
      }),
    );
  }
  return marketingProxyDepsPromise;
}

function isHealthProxyBypassPath(pathname: string): boolean {
  return pathname === "/api/health" || pathname === "/api/healthz" || pathname === "/api/health/ready";
}

const REGIONAL_MARKETING_PUBLIC_PREFIXES = [
  "/exams",
  "/us",
  "/canada",
  "/japan",
  "/india",
  "/china",
  "/korea",
  "/germany",
  "/france",
  "/italy",
  "/hungary",
  "/portugal",
  "/mexico",
  "/australia",
  "/middle-east",
] as const;

const REGIONAL_MARKETING_PUBLIC_LOCALE_SEGMENTS = [
  "exams",
  "us",
  "canada",
  "japan",
  "india",
  "china",
  "korea",
  "germany",
  "france",
  "italy",
  "hungary",
  "portugal",
  "mexico",
  "australia",
  "middle-east",
] as const;

function shouldLoadMarketingProxyDeps(pathname: string): boolean {
  if (REGIONAL_MARKETING_PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return true;
  }

  const [, localeSegment, publicSegment] = pathname.split("/", 3);
  return Boolean(
    localeSegment &&
      publicSegment &&
      REGIONAL_MARKETING_PUBLIC_LOCALE_SEGMENTS.some((segment) => segment === publicSegment),
  );
}

function ensureIncomingCorrelationId(request: NextRequest): NextRequest {
  if (request.headers.get(NN_CORRELATION_HEADER)?.trim()) return request;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set(NN_CORRELATION_HEADER, randomUUID().slice(0, 128));
  return new NextRequest(request.url, { headers: requestHeaders });
}

function isHomePerfTraceEnabledEdge(): boolean {
  return process.env.NN_TRACE_HOME_PERF?.trim().toLowerCase() === "true";
}

/**
 * `GET /` only: anchor + request kind for `home-perf-trace.ts`, and one `request_start` line on stderr.
 * Runs only when {@link isHomePerfTraceEnabledEdge} — removable via env.
 */
function appendHomePerfHeadersForGetRoot(request: NextRequest, requestHeaders: Headers): void {
  if (request.method !== "GET") return;
  if (request.nextUrl.pathname !== "/") return;
  if (!isHomePerfTraceEnabledEdge()) return;

  const anchor_ms = Date.now();
  requestHeaders.set(NN_HOME_PERF_ANCHOR_HEADER, String(anchor_ms));

  const rsc = request.headers.get("RSC") === "1";
  const dest = request.headers.get("Sec-Fetch-Dest")?.trim().toLowerCase() ?? "";
  let request_kind: string;
  if (rsc) {
    request_kind = "rsc_flight";
  } else if (dest === "document") {
    request_kind = "html_document";
  } else if (dest) {
    request_kind = `sec_fetch_${dest}`;
  } else {
    request_kind = "unknown";
  }
  requestHeaders.set(NN_HOME_PERF_REQUEST_KIND_HEADER, request_kind);

  const correlation = requestHeaders.get(NN_CORRELATION_HEADER)?.trim()?.slice(0, 64) ?? "";
  console.error(
    JSON.stringify({
      tag: "nn_home_perf",
      phase: "home.server.request_start",
      pathname: "/",
      duration_ms: 0,
      segment_ms: 0,
      wall_ms: anchor_ms,
      correlation: correlation || undefined,
      request_kind,
    }),
  );
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
   * Full request URL — lets `resolveAdminRequestPath` recover `/admin/...` when pathname-only
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

  appendHomePerfHeadersForGetRoot(request, requestHeaders);

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

async function enforceAdminProxyRoute(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/admin")) return null;

  const { getToken, loadUserRoleFromDbIdentity, isPathAllowedForStaffTier, safeServerLog } = await loadAdminProxyDeps();
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = secret ? await getToken({ req: request, secret }) : null;
  const userId =
    (typeof token?.sub === "string" && token.sub.trim()) ||
    (token as { id?: string } | null)?.id?.trim() ||
    null;
  const email = typeof token?.email === "string" && token.email.trim().length > 0 ? token.email.trim() : null;
  const correlationId = request.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();

  if (!userId && !email) {
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "proxy_admin_gate", {
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

  const roleRecord = await loadUserRoleFromDbIdentity({ userId, email });
  if (!roleRecord?.isAdmin) {
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "proxy_admin_gate", {
        pathAttempted: pathname,
        email: email ?? undefined,
        role: roleRecord?.role ?? "missing",
        result: "redirect_non_admin",
      });
    }
    return redirectWithCorrelation(request, "/app", correlationId);
  }

  if (!isPathAllowedForStaffTier(roleRecord.tier, pathname)) {
    if (adminAccessDebug()) {
      safeServerLog("admin_access", "proxy_admin_gate", {
        pathAttempted: pathname,
        email: email ?? undefined,
        role: roleRecord.role,
        result: "redirect_rbac",
      });
    }
    return redirectWithCorrelation(request, "/admin", correlationId);
  }

  if (adminAccessDebug()) {
    safeServerLog("admin_access", "proxy_admin_gate", {
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
    const { emitStructuredLog } = await loadApiProxyDeps();
    const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim();
    emitStructuredLog("request_start", "info", {
      correlationId: cid,
      route: pathname.slice(0, 200),
      method: req.method,
    });
  }

  /** Next.js 16+ proxy defaults to the Node.js runtime — `checkRateLimitUnified` uses shared Postgres buckets when `DATABASE_URL` is set (not per-instance memory). */
  if (pathname.startsWith("/api/")) {
    const { isRateLimitingEnabled, enforceApiRateLimit } = await loadApiProxyDeps();
    if (isRateLimitingEnabled()) {
      const limited = await enforceApiRateLimit(req);
      if (limited) {
        const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
        limited.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
        return limited;
      }
    }
  }

  if (shouldLoadMarketingProxyDeps(pathname)) {
    const {
      canonicalExamHubPathFromPossiblyLocalizedPath,
      MARKETING_LOCALE_COOKIE,
      MARKETING_LOCALE_COOKIE_MAX_AGE,
      REGIONAL_EXAM_MARKETING_FALLBACK_PATH,
      globalRegionSlugFromRegionalMarketingPublicPath,
      EXAM_HUB_PREVIEW_COOKIE,
      isRegionPublishedForPublicSite,
    } = await loadMarketingProxyDeps();

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

    // Unpublished regional marketing (`/exams/…` hubs + country-topic SEO trees): redirect to a published hub.
    const gatedRegion = globalRegionSlugFromRegionalMarketingPublicPath(pathname);
    if (gatedRegion && !isRegionPublishedForPublicSite(gatedRegion)) {
      const previewRegion = req.cookies.get(EXAM_HUB_PREVIEW_COOKIE)?.value ?? "";
      const allowStaffPreview = previewRegion === gatedRegion;
      if (!allowStaffPreview) {
        const url = req.nextUrl.clone();
        url.pathname = REGIONAL_EXAM_MARKETING_FALLBACK_PATH;
        const response = NextResponse.redirect(url, 307);
        const cid = req.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
        response.headers.set(NN_CORRELATION_HEADER, cid.slice(0, 128));
        return response;
      }
    }
  }

  const forwarded = withPathnameHeader(req);
  const { runAuthMiddleware } = await loadAuthProxyDeps();
  const res = await runAuthMiddleware(forwarded, event);
  const outCid = forwarded.headers.get(NN_CORRELATION_HEADER)?.trim() || randomUUID();
  if (res == null) {
    const adminRedirect = await enforceAdminProxyRoute(forwarded);
    if (adminRedirect) {
      return adminRedirect;
    }
    const next = NextResponse.next({ request: { headers: forwarded.headers } });
    next.headers.set(NN_CORRELATION_HEADER, outCid.slice(0, 128));
    return next;
  }
  const merged = mergeAuthContinueWithForwardedRequest(res, forwarded, outCid);
  if (merged !== res) {
    const adminRedirect = await enforceAdminProxyRoute(forwarded);
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
    "/",
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
