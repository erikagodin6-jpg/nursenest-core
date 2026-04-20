import "./auth-trust-env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authCallbacks } from "@/lib/auth-callbacks";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";
import { JWT_SESSION_MAX_AGE_SEC, JWT_SESSION_UPDATE_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { getAuthSessionJwtFromRequest, sessionJwtHasUserIdentity } from "@/lib/auth/nextauth-request-jwt";
import type { NextRequest } from "next/server";

/**
 * When the platform forwards `https` externally but `request.nextUrl.origin` is still an internal
 * origin (or differs from `AUTH_URL`), `resolveNextAuthHttpsForRequest` + cookie-name parity can
 * disagree with how the session cookie was issued. Mirror `reqWithEnvURL` in `auth.ts` so
 * {@link getAuthSessionJwtFromRequest} sees the same canonical origin as login.
 */
function nextRequestForEdgeJwtRead(request: NextRequest): NextRequest {
  const raw = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (!raw) return request;
  try {
    const base = raw.startsWith("http") ? raw : `https://${raw}`;
    const envOrigin = new URL(base).origin;
    const { href, origin } = request.nextUrl;
    if (origin === envOrigin) return request;
    return new NextRequest(href.replace(origin, envOrigin), { headers: request.headers });
  } catch {
    return request;
  }
}

/**
 * Edge-only NextAuth instance: no Prisma, bcrypt, or PrismaAdapter.
 * Bundling `@/lib/auth` into middleware pulled Prisma into the Edge runtime and
 * broke session resolution in production behind proxies.
 *
 * Credentials `authorize` is never invoked here (login uses the Node route handler).
 * JWT/session callbacks must match `auth.ts` exactly.
 *
 * `basePath` must use {@link PINNED_AUTH_BASE_PATH} (same as `auth.ts`). `AUTH_URL` / `NEXTAUTH_URL`
 * are origin-only — see `auth-base-path.ts`.
 */
export const { auth: middlewareAuth } = NextAuth({
  basePath: PINNED_AUTH_BASE_PATH,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: JWT_SESSION_MAX_AGE_SEC,
    updateAge: JWT_SESSION_UPDATE_AGE_SEC,
  },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async () => null,
    }),
  ],
  callbacks: {
    ...authCallbacks,
    /**
     * Matcher must include bare `/app` and `/admin` (see `src/proxy.ts`). If those roots are skipped,
     * layouts could run without a session and use `redirect("/login")` in RSC, which has caused raw
     * Flight payloads to appear in the browser document (Next.js 16).
     */
    async authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const u = auth?.user as { id?: string; email?: string | null; sub?: string } | undefined;
      const hasUser = Boolean(
        u &&
          ((typeof u.id === "string" && u.id.trim()) ||
            (typeof u.email === "string" && u.email.trim()) ||
            (typeof u.sub === "string" && u.sub.trim())),
      );
      if (path.startsWith("/app")) {
        return hasUser;
      }
      /**
       * `/admin` + `/api/admin` only — authentication, not RBAC.
       *
       * NextAuth’s session → `auth` can be empty in Edge while the session JWT cookie is still
       * valid (`__Secure-` vs plain name / TLS hint mismatch). That made `authorized()` return false
       * and redirect to `/login` before `enforceAdminProxyRoute` could run.
       *
       * Use the same {@link getAuthSessionJwtFromRequest} dual-read as the proxy gate. If the JWT
       * carries identity, treat as signed-in here; staff vs learner and tier limits stay in
       * `enforceAdminProxyRoute` + `requireAdmin`.
       */
      if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
        const secret = (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET)?.trim();
        if (!secret) return hasUser;
        try {
          const reqForJwt = nextRequestForEdgeJwtRead(request as NextRequest);
          const token = await getAuthSessionJwtFromRequest(reqForJwt, secret);
          if (sessionJwtHasUserIdentity(token)) return true;
        } catch {
          /* malformed request / token decode — fall back to Auth.js session */
        }
        return hasUser;
      }
      return true;
    },
  },
});
