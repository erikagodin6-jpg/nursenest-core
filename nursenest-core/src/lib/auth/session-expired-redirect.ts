import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  AUTH_SESSION_EXPIRED_PARAM,
  buildLearnerResumePathFromParts,
  buildSessionExpiredLoginHref,
  shouldSkipSessionExpiredRedirect,
} from "@/lib/auth/auth-flow-governance";
import {
  getAuthSessionJwtFromRequest,
  sessionJwtHasUserIdentity,
} from "@/lib/auth/nextauth-request-jwt";
import { resolveAuthSecretFromEnv } from "@/lib/auth/auth-session-signing-env";
import { captureServerEvent } from "@/lib/observability/posthog-server";
import { safeServerLog } from "@/lib/observability/safe-server-log";

const SESSION_COOKIE_NAMES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
] as const;

export function requestHasAuthSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => request.cookies.has(name));
}

export async function requestHasStaleAuthSession(request: NextRequest): Promise<boolean> {
  if (!requestHasAuthSessionCookie(request)) return false;
  const secret = resolveAuthSecretFromEnv();
  if (!secret) return false;
  const token = await getAuthSessionJwtFromRequest(request, secret);
  return !sessionJwtHasUserIdentity(token);
}

function isLoginRedirectLocation(location: string): boolean {
  try {
    const url = location.startsWith("http") ? new URL(location) : new URL(location, "http://local");
    const path = url.pathname.replace(/^\/(en|fr)(?=\/|$)/, "") || url.pathname;
    return path === "/login" || path.startsWith("/login?");
  } catch {
    return location.includes("/login");
  }
}

function learnerPathRequiresSessionExpiry(request: NextRequest): boolean {
  const path = request.nextUrl.pathname;
  return path.startsWith("/app") || path.startsWith("/admin");
}

/**
 * When Auth.js middleware sends an unauthenticated user to login, preserve study destination
 * and mark session=expired when a stale session cookie was present.
 */
export async function maybeEnhanceSessionExpiredLoginRedirect(
  response: Response,
  request: NextRequest,
): Promise<Response> {
  if (response.status < 300 || response.status >= 400) return response;
  const location = response.headers.get("Location");
  if (!location || !isLoginRedirectLocation(location)) return response;

  if (!learnerPathRequiresSessionExpiry(request)) return response;
  if (shouldSkipSessionExpiredRedirect(request.nextUrl.pathname, request.nextUrl.search)) {
    return response;
  }

  const stale = await requestHasStaleAuthSession(request);
  if (!stale && !requestHasAuthSessionCookie(request)) {
    return response;
  }

  const resume = buildLearnerResumePathFromParts(
    request.nextUrl.pathname,
    request.nextUrl.search,
    request.nextUrl.hash,
  );

  const localeMatch = request.nextUrl.pathname.match(/^\/(en|fr)(?=\/|$)/);
  const locale = localeMatch?.[1] ?? "en";
  const target = buildSessionExpiredLoginHref(resume, locale);

  safeServerLog("auth", "session_expired_redirected", {
    from_path: request.nextUrl.pathname.slice(0, 120),
    stale_cookie: stale,
  });

  captureServerEvent("anonymous", "session_expired_redirected", {
    stale_cookie: stale,
    had_cookie: requestHasAuthSessionCookie(request),
  });

  const headers = new Headers(response.headers);
  headers.set("Location", target.startsWith("http") ? target : new URL(target, request.url).toString());
  return new Response(null, { status: response.status, headers });
}
