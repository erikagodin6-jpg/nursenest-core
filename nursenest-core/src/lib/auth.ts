import "./auth-trust-env";
import { Auth } from "@auth/core";
import { CredentialsSignin } from "@auth/core/errors";
import { compare } from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { authCallbacks } from "@/lib/auth-callbacks";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";
import { JWT_SESSION_MAX_AGE_SEC, JWT_SESSION_UPDATE_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { clearLoginFailures } from "@/lib/auth/login-lockout";
import { hashLoginIdentifierForLog } from "@/lib/auth/log-auth-identifier";
import { nodeJwtCallback } from "@/lib/auth/node-jwt-callback";
import { normalizeLoginIdentifier, sanitizeRawLoginIdentifier } from "@/lib/auth/normalize-login-identifier";
import { normalizeStoredPasswordHash } from "@/lib/auth/normalize-stored-password-hash";
import { prisma } from "@/lib/db";
import {
  getUserAccess,
  subscriptionStatusForSession,
  type SessionSubscriptionStatus,
} from "@/lib/entitlements/get-user-access";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { recordCredentialsLoginFailure } from "@/lib/observability/production-signal-metrics";
import { Prisma } from "@prisma/client";

if (process.env.NODE_ENV === "production") {
  const hasSecret = Boolean(
    (process.env.AUTH_SECRET && process.env.AUTH_SECRET.trim().length > 0) ||
      (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_SECRET.trim().length > 0),
  );

  if (!hasSecret) {
    safeServerLogCritical(
      "auth",
      "missing_auth_secret",
      { surface: "startup" },
      new Error("AUTH_SECRET (or NEXTAUTH_SECRET) must be set in production for JWT signing"),
    );
  }

  const nextAuthUrl = process.env.NEXTAUTH_URL?.trim();
  if (nextAuthUrl) {
    try {
      const pathname = new URL(nextAuthUrl.startsWith("http") ? nextAuthUrl : `https://${nextAuthUrl}`).pathname;
      if (pathname && pathname !== "/" && pathname !== "") {
        safeServerLogCritical(
          "auth",
          "nextauth_url_must_be_origin_only",
          { pathname, hint: "Use https://www.example.com, not a path to /login." },
          new Error("NEXTAUTH_URL should be origin-only"),
        );
      }
    } catch {
      /* Runtime auth errors surface malformed NEXTAUTH_URL. */
    }
  }
}

const isProd = process.env.NODE_ENV === "production";

const CREDENTIALS_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  passwordHash: true,
  role: true,
  country: true,
  tier: true,
  alliedProfessionKey: true,
  credentialVersion: true,
} as const;

type CredentialsUserRow = Prisma.UserGetPayload<{ select: typeof CREDENTIALS_USER_SELECT }>;

function clientIpFromRequest(req: Request): string {
  return getTrustedClientIp(req);
}

/** Same behavior as next-auth/lib/env `reqWithEnvURL` (not a public export). */
function reqWithEnvURL(req: NextRequest): NextRequest {
  const url = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL;
  if (!url) return req;
  const { origin: envOrigin } = new URL(url);
  const { href, origin } = req.nextUrl;
  return new NextRequest(href.replace(origin, envOrigin), req);
}

function authCredentialDiagnosticCodesEnabled(): boolean {
  return (
    process.env.PLAYWRIGHT_DIAGNOSTIC_AUTH_CODES === "1" ||
    process.env.CI === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

/* =========================
   HELPERS (centralized)
   ========================= */

function reject(code: string): null {
  if (authCredentialDiagnosticCodesEnabled()) {
    const err = new CredentialsSignin();
    err.code = code;
    throw err;
  }
  return null;
}

function rejectRateLimited(): never {
  const err = new CredentialsSignin();
  err.code = "rate_limit_exceeded";
  throw err;
}

function safeRememberMe(input: unknown): boolean {
  if (typeof input !== "string") return true;

  const v = input.trim().toLowerCase();

  if (["false", "0", "off", "no"].includes(v)) return false;
  if (["true", "1", "on", "yes"].includes(v)) return true;

  // default = short session (safer)
  return false;
}

async function safeUserUpdateLastLogin(userId: string, ip: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginIp: ip !== "unknown" ? ip.slice(0, 64) : null,
        lastLoginAt: new Date(),
      },
    });
  } catch (e) {
    safeServerLog("auth", "last_login_update_failed", {
      userIdPrefix: userId.slice(0, 8),
    });
  }
}

/* =========================
   AUTH CONFIG
   ========================= */

export const authConfig: NextAuthConfig = {
  basePath: PINNED_AUTH_BASE_PATH,
  trustHost: true,

  session: {
    strategy: "jwt",
    maxAge: JWT_SESSION_MAX_AGE_SEC,
    updateAge: JWT_SESSION_UPDATE_AGE_SEC,
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

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    Credentials({
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Stay signed in", type: "text" },
      },

      async authorize(credentials, request) {
        const ip = clientIpFromRequest(request);
        const emailRaw = String(credentials.email ?? "");
        const password = String(credentials.password ?? "");

        const emailSanitized = sanitizeRawLoginIdentifier(emailRaw);
        const emailLower = normalizeLoginIdentifier(emailSanitized);

        const idHash = emailLower
          ? hashLoginIdentifierForLog(emailLower)
          : "";

        if (!emailLower || !password) {
          recordCredentialsLoginFailure("missing_fields", request);
          return reject("missing_credentials");
        }

        /* =========================
           USER LOOKUP
           ========================= */

        let user: CredentialsUserRow | null = null;

        try {
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { email: { equals: emailLower, mode: "insensitive" } },
                { username: { equals: emailLower, mode: "insensitive" } },
              ],
            },
            select: CREDENTIALS_USER_SELECT,
          });
        } catch (e) {
          safeServerLogCritical("auth", "db_error", {}, e);
          recordCredentialsLoginFailure("db_error", request);
          return reject("db_error");
        }

        if (!user) {
          recordCredentialsLoginFailure("not_found", request);
          return reject("user_missing");
        }

        /* =========================
           PASSWORD CHECK
           ========================= */

        const hash = normalizeStoredPasswordHash(user.passwordHash);

        if (!hash) {
          recordCredentialsLoginFailure("no_password_hash", request);
          return reject("no_password_hash");
        }

        let passwordOk = false;

        try {
          passwordOk = await compare(password, hash);
        } catch {
          recordCredentialsLoginFailure("system_error", request);
          return reject("system_error");
        }

        if (!passwordOk) {
          recordCredentialsLoginFailure("bad_password", request);
          return reject("password_invalid");
        }

        /* =========================
           SUCCESS
           ========================= */

        await clearLoginFailures(`login-lock:${idHash || ip}`);

        await safeUserUpdateLastLogin(user.id, ip);

        const rememberMe = safeRememberMe(credentials.rememberMe);

        let subscriptionStatus: SessionSubscriptionStatus = "none";

        try {
          const ua = await getUserAccess(user.id);
          subscriptionStatus = subscriptionStatusForSession(ua);
        } catch {
          // tolerate DB failure — do not block login
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          country: user.country,
          tier: user.tier,
          alliedProfessionKey: user.alliedProfessionKey ?? null,
          subscriptionStatus,
          credentialVersion: user.credentialVersion ?? 0,
          rememberMe,
        };
      },
    }),
  ],

  callbacks: {
    ...authCallbacks,
    jwt: nodeJwtCallback,
  },
};

/* =========================
   HANDLERS
   ========================= */

const { auth, signIn, signOut } = NextAuth(authConfig);

export { auth, signIn, signOut };

export const handlers = {
  GET: (req: NextRequest) =>
    Auth(reqWithEnvURL(req), { ...authConfig, trustHost: true }),

  POST: (req: NextRequest) =>
    Auth(reqWithEnvURL(req), { ...authConfig, trustHost: true }),
};