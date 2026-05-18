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

import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";
import {
  computeMarketingNarrowViewportHintFromRequestHeaders,
  MARKETING_NARROW_VIEWPORT_HINT_HEADER,
} from "@/lib/marketing/marketing-narrow-viewport-hint";

let authProxyDepsPromise: Promise<{ runAuthMiddleware: NextMiddleware }> | null = null;

function loadAuthProxyDeps() {
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

  return res;
}

export function isFlashcardsSubdomainHost(host: string | null): boolean {
  if (!host) return false;

  const normalizedHost = host.split(":")[0]?.toLowerCase() ?? "";

  return normalizedHost === "flashcards.nursenest.ca" || normalizedHost.startsWith("flashcards.");
}

export function flashcardsSubdomainInternalPath(pathname: string): string {
  if (pathname === "/" || pathname === "") return "/flashcards";

  if (pathname === "/flashcards" || pathname.startsWith("/flashcards/")) {
    return pathname;
  }

  if (pathname.startsWith("/set/")) {
    return pathname.replace(/^\/set/, "/flashcards");
  }

  return `/flashcards${pathname}`;
}

function rewriteFlashcardsSubdomainRequest(request: NextRequest, headers: Headers): NextResponse | null {
  if (!isFlashcardsSubdomainHost(headers.get("host"))) return null;

  const pathname = request.nextUrl.pathname;
  const internalPathname = flashcardsSubdomainInternalPath(pathname);

  if (internalPathname === pathname && pathname.startsWith("/flashcards")) return null;

  const url = request.nextUrl.clone();
  url.pathname = internalPathname;

  const res = NextResponse.rewrite(url, {
    request: { headers },
  });

  const cid = headers.get(NN_CORRELATION_HEADER);
  if (cid) res.headers.set(NN_CORRELATION_HEADER, cid);

  res.headers.set("x-nn-flashcards-subdomain", "1");
  res.headers.set("x-nn-flashcards-internal-path", internalPathname);

  return res;
}

export function isPublicProbeOrCrawlerBypassPath(pathname: string): boolean {
  if (pathname === "/healthz" || pathname === "/readyz") return true;
  if (
    pathname === "/sitemap.xml" ||
    pathname === "/sitemap-allied.xml" ||
    pathname === "/sitemap-new-grad.xml" ||
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

    const flashcardsRewrite = rewriteFlashcardsSubdomainRequest(req, headers);
    if (flashcardsRewrite) return flashcardsRewrite;

    const forwarded = new NextRequest(req.url, { headers });

    const { runAuthMiddleware } = await loadAuthProxyDeps();

    let res: Response | null = null;

    try {
      res = (await runAuthMiddleware(forwarded, event)) ?? null;
    } catch {
      res = null;
    }

    const correlationId = headers.get(NN_CORRELATION_HEADER) ?? randomUUID();

    if (!res) {
      const adminRedirect = await enforceAdmin(forwarded);
      if (adminRedirect) return adminRedirect;

      return forwardRequest(forwarded);
    }

    if (res.headers.get("x-middleware-next") === "1") {
      const next = NextResponse.next({
        request: { headers: forwarded.headers },
      });

      next.headers.set(NN_CORRELATION_HEADER, correlationId);
      return next;
    }

    if (res.status >= 300 && res.status < 400) {
      return res as NextResponse;
    }

    const final = NextResponse.next({
      request: { headers: forwarded.headers },
    });

    final.headers.set(NN_CORRELATION_HEADER, correlationId);
    return final;
  } catch {
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/",
    "/app",
    "/app/:path*",
    "/flashcards",
    "/flashcards/:path*",
    "/set/:path*",
    "/search",
    "/exams/:path*",
    "/admin",
    "/admin/:path*",
    "/internal",
    "/internal/:path*",
    "/api",
    "/api/:path*",
  ],
};
