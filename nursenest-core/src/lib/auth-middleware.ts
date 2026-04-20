import "./auth-trust-env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authCallbacks } from "@/lib/auth-callbacks";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";
import { JWT_SESSION_MAX_AGE_SEC, JWT_SESSION_UPDATE_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { getAuthSessionJwtFromRequest, sessionJwtHasUserIdentity } from "@/lib/auth/nextauth-request-jwt";
import type { NextRequest } from "next/server";

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
      const hasUser =
        !!(auth?.user && ((auth.user as { id?: string }).id || auth.user.email));
      if (path.startsWith("/app")) {
        return hasUser;
      }
      /**
       * Admin surfaces: NextAuth’s `getSession` → `auth` can disagree with cookie-backed `getToken`
       * when `secureCookie` / proxy TLS hints differ from how the cookie was issued.
       * Run the same dual-read JWT path as {@link enforceAdminProxyRoute} **first** so valid session
       * cookies are not treated as signed-out before the proxy DB gate runs.
       */
      if (path.startsWith("/admin") || path.startsWith("/api/admin")) {
        const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
        if (secret) {
          const token = await getAuthSessionJwtFromRequest(request as NextRequest, secret);
          if (sessionJwtHasUserIdentity(token)) return true;
        }
        return hasUser;
      }
      return true;
    },
  },
});
