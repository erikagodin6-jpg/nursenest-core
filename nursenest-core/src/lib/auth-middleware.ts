import "./auth-trust-env";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authCallbacks } from "@/lib/auth-callbacks";
import { JWT_SESSION_MAX_AGE_SEC, JWT_SESSION_UPDATE_AGE_SEC } from "@/lib/auth/auth-session-constants";

/**
 * Edge-only NextAuth instance: no Prisma, bcrypt, or PrismaAdapter.
 * Bundling `@/lib/auth` into middleware pulled Prisma into the Edge runtime and
 * broke session resolution in production behind proxies.
 *
 * Credentials `authorize` is never invoked here (login uses the Node route handler).
 * JWT/session callbacks must match `auth.ts` exactly.
 */
export const { auth: middlewareAuth } = NextAuth({
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
    authorized({ auth, request }) {
      const path = request.nextUrl.pathname;
      const hasUser =
        !!(auth?.user && ((auth.user as { id?: string }).id || auth.user.email));
      if (path.startsWith("/app") || path.startsWith("/admin")) {
        return hasUser;
      }
      return true;
    },
  },
});
