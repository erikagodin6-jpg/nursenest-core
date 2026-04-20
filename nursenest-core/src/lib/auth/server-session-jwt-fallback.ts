/**
 * Server-only by usage (`headers()`, React `cache`) — do not import from Client Components.
 * Intentionally no `import "server-only"` so Node unit tests can import {@link sessionHasUserIdentity}.
 */
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";
import type { Session } from "next-auth";
import type { SessionUserRole } from "@/types/next-auth";
import {
  ensureCookieHeaderForJwtRead,
  type CookieJarEntry,
} from "@/lib/auth/jwt-read-cookie-header-merge";
import { getAuthSessionJwtFromRequest, sessionJwtHasUserIdentity } from "@/lib/auth/nextauth-request-jwt";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/**
 * Builds a synthetic {@link NextRequest} from the current incoming request headers so
 * {@link getAuthSessionJwtFromRequest} can run with the same `secureCookie` parity as Edge (`proxy.ts`).
 * `pathname` only affects `nextUrl` fallback inside {@link resolveNextAuthHttpsForRequest}; cookies are path `/`.
 *
 * Under the hood, `getToken` (`@auth/core/jwt`) parses **only** the raw `Cookie` header string. Some App Router
 * requests omit `Cookie` from `headers()` while `cookies()` still exposes chips — JWT fallback would then return null
 * and `/admin` RSC gates (`requireAdmin`, `getStaffSession`) redirect to `/login` after Edge already allowed the request.
 */
function adminJwtReadDebug(): boolean {
  return process.env.ADMIN_ACCESS_DEBUG === "1" || process.env.ADMIN_ACCESS_DEBUG === "true";
}

async function incomingRequestForJwtRead(pathname: string): Promise<{
  req: NextRequest;
  cookieMeta: { hadIncomingCookieHeader: boolean; synthesizedFromJar: boolean };
}> {
  const merged = new Headers(await headers());
  let jar: CookieJarEntry[] = [];
  try {
    if (!merged.get("cookie")?.trim()) jar = (await cookies()).getAll();
  } catch {
    /* cookies() unavailable in this runtime context */
  }
  const cookieMeta = ensureCookieHeaderForJwtRead(merged, jar);
  const host = merged.get("x-forwarded-host")?.trim() || merged.get("host")?.trim() || "localhost";
  const rawProto = merged.get("x-forwarded-proto");
  const firstProto = rawProto?.split(",")[0]?.trim().toLowerCase() ?? "";
  let proto: "http" | "https" = "http";
  if (firstProto === "https" || firstProto === "http") {
    proto = firstProto;
  } else if (merged.get("x-forwarded-ssl")?.trim().toLowerCase() === "on") {
    proto = "https";
  } else if (merged.get("cf-visitor")) {
    try {
      const v = JSON.parse(merged.get("cf-visitor")!) as { scheme?: string };
      if (v?.scheme?.toLowerCase() === "https") proto = "https";
    } catch {
      /* ignore */
    }
  }
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const url = `${proto}://${host}${path}`;
  return { req: new NextRequest(url, { headers: merged }), cookieMeta };
}

/**
 * Session shape must stay aligned with {@link authCallbacks.session} in `auth-callbacks.ts`
 * (Edge middleware + Node `auth.ts` share the same JWT fields at login).
 */
function sessionFromJwtToken(token: JWT): Session | null {
  const id =
    typeof token.sub === "string" && token.sub.length > 0
      ? token.sub
      : typeof (token as { id?: string }).id === "string" && (token as { id: string }).id.length > 0
        ? (token as { id: string }).id
        : "";
  const email = typeof token.email === "string" ? token.email : "";
  if (!id.trim() && !email.trim()) return null;

  const expSec = typeof token.exp === "number" ? token.exp : Math.floor(Date.now() / 1000) + 3600;
  const name = typeof token.name === "string" && token.name.length > 0 ? token.name : email || "Learner";
  const role = (token.role ?? "LEARNER") as SessionUserRole;
  const country = (token.country === "CA" || token.country === "US" ? token.country : "US") as "CA" | "US";
  const tier = (token.tier === "RPN" ||
  token.tier === "LVN_LPN" ||
  token.tier === "RN" ||
  token.tier === "NP" ||
  token.tier === "ALLIED" ||
  token.tier === "PRE_NURSING" ||
  token.tier === "NEW_GRAD"
    ? token.tier
    : "RN") as Session["user"]["tier"];
  const alliedProfessionKey =
    typeof token.alliedProfessionKey === "string" ? token.alliedProfessionKey : null;
  const subscriptionStatus =
    token.subscriptionStatus === "active" ||
    token.subscriptionStatus === "grace" ||
    token.subscriptionStatus === "past_due_grace" ||
    token.subscriptionStatus === "past_due"
      ? token.subscriptionStatus
      : "none";
  const credentialVersion = typeof token.credentialVersion === "number" ? token.credentialVersion : 0;

  return {
    expires: new Date(expSec * 1000).toISOString(),
    user: {
      id,
      email,
      name,
      role,
      country,
      tier,
      alliedProfessionKey,
      subscriptionStatus,
      credentialVersion,
    },
  };
}

/**
 * When Node `auth()` misses the session cookie (e.g. `__Secure-` vs plain name behind proxies) but
 * Edge already admitted the user via {@link getAuthSessionJwtFromRequest}, rebuild a session from the
 * JWT using the **same** dual-read helper — keeps `/admin` RSC gates aligned with `src/proxy.ts`.
 */
export function sessionHasUserIdentity(session: Session | null | undefined): boolean {
  if (!session?.user) return false;
  const u = session.user as { id?: string; email?: string | null };
  return Boolean((typeof u.id === "string" && u.id.trim().length > 0) || (typeof u.email === "string" && u.email.trim().length > 0));
}

export const getAuthSessionWithJwtCookieFallback = cache(async (): Promise<Session | null> => {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  if (!secret?.trim()) return null;
  try {
    const { req, cookieMeta } = await incomingRequestForJwtRead("/admin");
    const token = await getAuthSessionJwtFromRequest(req, secret);
    const jwtIdentityOk = sessionJwtHasUserIdentity(token);

    if (adminJwtReadDebug()) {
      let jarHadSessionNamedCookie = false;
      try {
        const names = new Set((await cookies()).getAll().map((c) => c.name));
        jarHadSessionNamedCookie =
          names.has("authjs.session-token") ||
          names.has("__Secure-authjs.session-token") ||
          names.has("next-auth.session-token") ||
          names.has("__Secure-next-auth.session-token");
      } catch {
        /* ignore */
      }
      safeServerLog("admin_access", "jwt_fallback_rsc_read", {
        hadCookieHeaderInHeadersBag: cookieMeta.hadIncomingCookieHeader,
        synthesizedFromNextCookiesJar: cookieMeta.synthesizedFromJar,
        jarHadSessionNamedCookie,
        jwtIdentityOk,
      });
    }

    if (!token) return null;
    return sessionFromJwtToken(token as JWT);
  } catch {
    return null;
  }
});
