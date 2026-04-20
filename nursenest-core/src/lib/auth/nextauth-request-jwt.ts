import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextAuthHttpsSignal } from "@/lib/auth/nextauth-secure-cookie-request";
import { resolveNextAuthHttpsForRequest } from "@/lib/auth/nextauth-secure-cookie-request";
import { NN_CORRELATION_HEADER } from "@/lib/observability/correlation-id";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * JWT read diagnostics: set `NN_AUTH_JWT_DIAG=1` for all paths (briefly — can be chatty on hot routes).
 * With only `ADMIN_ACCESS_DEBUG=1`, logs are limited to `/admin*` to avoid noise from rate limiting.
 */
function shouldEmitAuthSessionJwtDiag(pathname: string): boolean {
  const jwtDiag = process.env.NN_AUTH_JWT_DIAG?.trim().toLowerCase();
  if (jwtDiag === "1" || jwtDiag === "true") return true;
  const adminDbg = process.env.ADMIN_ACCESS_DEBUG?.trim().toLowerCase();
  if (adminDbg === "1" || adminDbg === "true") return pathname.startsWith("/admin");
  return false;
}

export type SessionJwtPayload = Awaited<ReturnType<typeof getToken>>;

/** Non-secret JWT read outcome for diagnostics (proxy gate + optional `auth_session_jwt_from_request`). */
export type AuthSessionJwtReadMeta = {
  httpsSignal: NextAuthHttpsSignal;
  secureCookieModePrimary: boolean;
  primaryJwtReadOk: boolean;
  fallbackJwtReadOk: boolean;
  resolvedJwtOk: boolean;
};

/**
 * Single pass: primary `secureCookie` hint plus one fallback decode (same as {@link getAuthSessionJwtFromRequest}).
 * Use from `proxy.ts` when `ADMIN_ACCESS_DEBUG` needs JWT fields on the same log line as the DB gate.
 */
export async function readAuthSessionJwtWithMeta(
  request: NextRequest,
  secret: string,
): Promise<{ token: SessionJwtPayload | null; readMeta: AuthSessionJwtReadMeta }> {
  const { secureCookie: primary, signal } = resolveNextAuthHttpsForRequest(request);
  const first = await getToken({ req: request, secret, secureCookie: primary });
  const second = first ? null : await getToken({ req: request, secret, secureCookie: !primary });
  const resolved = first ?? second;
  const readMeta: AuthSessionJwtReadMeta = {
    httpsSignal: signal,
    secureCookieModePrimary: primary,
    primaryJwtReadOk: Boolean(first),
    fallbackJwtReadOk: Boolean(second),
    resolvedJwtOk: Boolean(resolved),
  };
  return { token: resolved, readMeta };
}

/**
 * Reads the Auth.js session JWT from the incoming request cookie.
 *
 * Tries {@link resolveNextAuthHttpsForRequest} first, then the opposite `secureCookie` flag.
 * Behind some reverse proxies, `x-forwarded-proto` ordering or internal `nextUrl` can disagree with
 * how the session cookie was named (`authjs.session-token` vs `__Secure-authjs.session-token`),
 * which makes a single `getToken` pass miss a valid cookie and falsely treat the user as signed out
 * (notably `/admin` gate in `src/proxy.ts`).
 */
export async function getAuthSessionJwtFromRequest(
  request: NextRequest,
  secret: string,
): Promise<SessionJwtPayload | null> {
  const { token, readMeta } = await readAuthSessionJwtWithMeta(request, secret);

  if (shouldEmitAuthSessionJwtDiag(request.nextUrl.pathname)) {
    const path = request.nextUrl.pathname;
    const correlationId = request.headers.get(NN_CORRELATION_HEADER)?.trim()?.slice(0, 64);
    safeServerLog("admin_access", "auth_session_jwt_from_request", {
      path: path.length > 160 ? `${path.slice(0, 160)}…` : path,
      httpsSignal: readMeta.httpsSignal,
      secureCookieModePrimary: readMeta.secureCookieModePrimary,
      primaryJwtReadOk: readMeta.primaryJwtReadOk,
      fallbackJwtReadOk: readMeta.fallbackJwtReadOk,
      resolvedJwtOk: readMeta.resolvedJwtOk,
      ...(correlationId ? { correlationId } : {}),
    });
  }

  return token;
}

/**
 * Whether a decoded session JWT carries a stable user identity.
 * Must stay aligned with {@link enforceAdminProxyRoute} in `src/proxy.ts` and `authorized()` in
 * `src/lib/auth-middleware.ts` so “authenticated?” checks do not diverge.
 */
export function sessionJwtHasUserIdentity(token: SessionJwtPayload | null): boolean {
  if (!token) return false;
  const sub = typeof token.sub === "string" ? token.sub.trim() : "";
  const legacyIdRaw = (token as { id?: string | null }).id;
  const legacyId = typeof legacyIdRaw === "string" ? legacyIdRaw.trim() : "";
  const email = typeof token.email === "string" ? token.email.trim() : "";
  return Boolean(sub || legacyId || email);
}
