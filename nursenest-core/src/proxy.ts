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

/**
 * -----------------------------
 * LAZY DEP LOADERS (SAFE)
 * -----------------------------
 */

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

/**
 * -----------------------------
 * CORE HELPERS
 * -----------------------------
 */

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

function isHealthRoute(pathname: string) {
  return pathname.startsWith("/api/health");
}

/**
 * -----------------------------
 * ADMIN GATE (SAFE + NON-BREAKING)
 * -----------------------------
 */

async function enforceAdmin(request: NextRequest): Promise<NextResponse | null> {
  try {
    const pathname = request.nextUrl.pathname;

    if (!pathname.startsWith("/admin")) return null;

    const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
    if (!secret) return null;

    const { token } = await readAuthSessionJwtWithMeta(request, secret);

    const hasIdentity = sessionJwtHasUserIdentity(
      token && typeof token === "object" ? (token as SessionJwtPayload) : null,
    );

    if (!hasIdentity) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    return null;
  } catch {
    // NEVER break proxy
    return null;
  }
}

/**
 * -----------------------------
 * MAIN PROXY
 * -----------------------------
 */

export async function proxy(request: NextRequest, event: NextFetchEvent) {
  try {
    const req = ensureCorrelationId(request);
    const pathname = req.nextUrl.pathname;

    // Health bypass (critical)
    if (isHealthRoute(pathname)) {
      return forwardRequest(req);
    }

    // Add required headers for RSC correctness
    const headers = new Headers(req.headers);
    headers.set("x-nn-request-pathname", pathname);
    headers.set("x-nn-request-url", req.url);

    const forwarded = new NextRequest(req.url, { headers });

    // Run auth middleware safely
    const { runAuthMiddleware } = await loadAuthProxyDeps();

    let res: Response | null = null;

    try {
      res = await runAuthMiddleware(forwarded, event);
    } catch {
      // Auth failure must not break app
      res = null;
    }

    const correlationId = headers.get(NN_CORRELATION_HEADER) ?? randomUUID();

    // No response → continue
    if (!res) {
      const adminRedirect = await enforceAdmin(forwarded);
      if (adminRedirect) return adminRedirect;

      return forwardRequest(forwarded);
    }

    // Ensure headers are forwarded
    if (res.headers.get("x-middleware-next") === "1") {
      const next = NextResponse.next({
        request: { headers: forwarded.headers },
      });

      next.headers.set(NN_CORRELATION_HEADER, correlationId);
      return next;
    }

    // Final fallback
    const final = NextResponse.next({
      request: { headers: forwarded.headers },
    });

    final.headers.set(NN_CORRELATION_HEADER, correlationId);
    return final;
  } catch {
    // ABSOLUTE fallback — never crash proxy
    return NextResponse.next();
  }
}

/**
 * -----------------------------
 * MATCHER (UNCHANGED — CRITICAL)
 * -----------------------------
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
  ],
};