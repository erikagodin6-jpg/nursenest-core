import "./auth-trust-env";
import { Auth } from "@auth/core";
import { compare } from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { authCallbacks } from "@/lib/auth-callbacks";
import { isEmailLikeIdentifier, normalizeLoginIdentifier } from "@/lib/auth/normalize-login-identifier";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { SubscriptionStatus, UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";

function clientIpFromRequest(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown"
  );
}

/** Same behavior as next-auth/lib/env `reqWithEnvURL` (not a public export). */
function reqWithEnvURL(req: NextRequest): NextRequest {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!url) return req;
  const { origin: envOrigin } = new URL(url);
  const { href, origin } = req.nextUrl;
  return new NextRequest(href.replace(origin, envOrigin), req);
}

const isProd = process.env.NODE_ENV === "production";

export const authConfig: NextAuthConfig = {
  /**
   * No Prisma adapter: schema has no Account/Session/VerificationToken models required by
   * @auth/prisma-adapter. Credentials + JWT persist the session in the cookie only; users
   * are written via /api/signup and read here.
   */
  trustHost: true,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60,
  },
  cookies: {
    sessionToken: {
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: isProd,
      },
    },
  },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const ip = clientIpFromRequest(request);
        const rl = checkRateLimit(`login:${ip}`, { windowMs: 60_000, max: 40 });
        if (!rl.ok) {
          safeServerLog("auth", "login_rate_limited", { ip: ip.slice(0, 64) });
          Sentry.captureMessage("login_rate_limited", {
            level: "warning",
            tags: { flow: "auth", kind: "rate_limit" },
          });
          return null;
        }

        const identifier = normalizeLoginIdentifier(String(credentials.email ?? ""));
        const password = String(credentials.password ?? "");
        if (!identifier || !password) {
          safeServerLog("auth", "credentials_rejected", { reason: "missing_fields" });
          return null;
        }

        let user;
        try {
          if (isEmailLikeIdentifier(identifier)) {
            user = await prisma.user.findUnique({
              where: { email: identifier },
            });
          } else {
            user = await prisma.user.findUnique({
              where: { username: identifier },
            });
          }
        } catch (e) {
          const detail = e instanceof Error ? e.message.slice(0, 800) : String(e).slice(0, 800);
          safeServerLogCritical("auth", "user_lookup_failed", { surface: "credentials", detail }, e);
          return null;
        }

        if (!user?.passwordHash) {
          safeServerLog("auth", "credentials_rejected", { reason: "no_account_or_no_password" });
          return null;
        }

        const ok = await compare(password, user.passwordHash);
        if (!ok) {
          safeServerLog("auth", "credentials_rejected", { reason: "invalid_password" });
          return null;
        }

        safeServerLog("auth", "credentials_ok", {
          mode: isEmailLikeIdentifier(identifier) ? "email" : "username",
        });

        let subscriptionStatus: "active" | "grace" | "none" = "none";
        if (user.role === UserRole.ADMIN) {
          subscriptionStatus = "active";
        } else {
          try {
            const sub = await prisma.subscription.findFirst({
              where: { userId: user.id, status: { in: [SubscriptionStatus.ACTIVE, SubscriptionStatus.GRACE] } },
              orderBy: { createdAt: "desc" },
              select: { status: true },
            });
            if (sub?.status === SubscriptionStatus.ACTIVE) subscriptionStatus = "active";
            else if (sub?.status === SubscriptionStatus.GRACE) subscriptionStatus = "grace";
          } catch {
            /* DB unavailable — session still usable; entitlements resolve server-side */
          }
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          country: user.country,
          tier: user.tier,
          subscriptionStatus,
        };
      },
    }),
  ],
  callbacks: authCallbacks,
};

const { auth, signIn, signOut } = NextAuth(authConfig);

export { auth, signIn, signOut };

/**
 * Turbopack production builds can drop or mishandle config passed into the default
 * next-auth handler closure. Call @auth/core Auth() with an object literal that
 * ends in trustHost: true so assertConfig always sees a plain boolean.
 */
export const handlers = {
  GET: (req: NextRequest) =>
    Auth(reqWithEnvURL(req), { ...authConfig, trustHost: true }),
  POST: (req: NextRequest) =>
    Auth(reqWithEnvURL(req), { ...authConfig, trustHost: true }),
};
