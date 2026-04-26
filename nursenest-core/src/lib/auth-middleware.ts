import "./auth-trust-env";

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { authCallbacks } from "@/lib/auth-callbacks";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";
import {
  JWT_SESSION_MAX_AGE_SEC,
  JWT_SESSION_UPDATE_AGE_SEC,
} from "@/lib/auth/auth-session-constants";
import {
  getAuthSessionJwtFromRequest,
  sessionJwtHasUserIdentity,
} from "@/lib/auth/nextauth-request-jwt";

function hasSignedInUser(auth: unknown): boolean {
  const user = (auth as { user?: { id?: unknown; email?: unknown; sub?: unknown } } | null)?.user;

  return Boolean(
    user &&
      ((typeof user.id === "string" && user.id.trim().length > 0) ||
        (typeof user.email === "string" && user.email.trim().length > 0) ||
        (typeof user.sub === "string" && user.sub.trim().length > 0)),
  );
}

function canonicalAuthOrigin(): string | null {
  const raw = process.env.AUTH_URL?.trim() || process.env.NEXTAUTH_URL?.trim();
  if (!raw) return null;

  try {
    const base = raw.startsWith("http") ? raw : `https://${raw}`;
    return new URL(base).origin;
  } catch {
    return null;
  }
}

function nextRequestForEdgeJwtRead(request: NextRequest): NextRequest {
  const envOrigin = canonicalAuthOrigin();
  if (!envOrigin) return request;

  const { href, origin } = request.nextUrl;
  if (origin === envOrigin) return request;

  return new NextRequest(href.replace(origin, envOrigin), {
    headers: request.headers,
  });
}

async function hasReadableSessionJwt(request: NextRequest): Promise<boolean> {
  const secret = (process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET)?.trim();
  if (!secret) return false;

  try {
    const reqForJwt = nextRequestForEdgeJwtRead(request);
    const token = await getAuthSessionJwtFromRequest(reqForJwt, secret);
    return sessionJwtHasUserIdentity(token);
  } catch {
    return false;
  }
}

function isAppPath(pathname: string): boolean {
  return pathname === "/app" || pathname.startsWith("/app/");
}

function isAdminPath(pathname: string): boolean {
  return (
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/api/admin" ||
    pathname.startsWith("/api/admin/")
  );
}

/**
 * Edge-only NextAuth instance.
 *
 * Keep this Prisma-free and bcrypt-free. Middleware must not import the Node auth
 * handler or PrismaAdapter, otherwise Edge session resolution can fail in production.
 */
export const { auth: middlewareAuth } = NextAuth({
  basePath: PINNED_AUTH_BASE_PATH,
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: JWT_SESSION_MAX_AGE_SEC,
    updateAge: JWT_SESSION_UPDATE_AGE_SEC,
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
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

    async authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const signedInFromAuth = hasSignedInUser(auth);

      if (isAppPath(pathname)) {
        return signedInFromAuth;
      }

      if (isAdminPath(pathname)) {
        if (signedInFromAuth) return true;
        return hasReadableSessionJwt(request as NextRequest);
      }

      return true;
    },
  },
});