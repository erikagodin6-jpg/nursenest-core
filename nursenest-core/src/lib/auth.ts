import "./auth-trust-env";
import { Auth } from "@auth/core";
import { compare } from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { authCallbacks } from "@/lib/auth-callbacks";
import { JWT_SESSION_MAX_AGE_SEC, JWT_SESSION_UPDATE_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { hashLoginIdentifierForLog } from "@/lib/auth/log-auth-identifier";
import {
  isLoginLocked,
  recordLoginFailure,
  clearLoginFailures,
  getFailureCount,
} from "@/lib/auth/login-lockout";
import { isGmailLikeAddress, normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import { isEmailLikeIdentifier, normalizeLoginIdentifier } from "@/lib/auth/normalize-login-identifier";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import type { Prisma } from "@prisma/client";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import {
  getUserAccess,
  subscriptionStatusForSession,
  type SessionSubscriptionStatus,
} from "@/lib/entitlements/get-user-access";
import { prisma } from "@/lib/db";
import * as Sentry from "@sentry/nextjs";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";

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
  const nu = process.env.NEXTAUTH_URL?.trim();
  if (nu) {
    try {
      const pathname = new URL(nu.startsWith("http") ? nu : `https://${nu}`).pathname;
      if (pathname && pathname !== "/" && pathname !== "") {
        safeServerLogCritical(
          "auth",
          "nextauth_url_must_be_origin_only",
          { pathname, hint: "Use https://www.example.com — not a path to /login. Wrong pathname breaks next-auth/react credential POST URLs." },
          new Error("NEXTAUTH_URL should be origin-only (no /login path)"),
        );
      }
    } catch {
      /* ignore malformed NEXTAUTH_URL here — runtime will surface auth errors */
    }
  }
}

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

const CREDENTIALS_USER_SELECT = {
  id: true,
  email: true,
  normalizedEmail: true,
  name: true,
  passwordHash: true,
  role: true,
  country: true,
  tier: true,
  alliedProfessionKey: true,
  credentialVersion: true,
} as const;

type CredentialsUserRow = Prisma.UserGetPayload<{ select: typeof CREDENTIALS_USER_SELECT }>;

let authDebugStartupConfigLogged = false;

function logAuthDebugStartupConfigOnce(): void {
  if (authDebugStartupConfigLogged) return;
  authDebugStartupConfigLogged = true;
  const has = (k: string) =>
    Boolean(typeof process.env[k] === "string" && process.env[k]!.trim().length > 0);
  console.error(
    `[auth-debug] ${JSON.stringify({
      event: "auth_startup_config",
      AUTH_URL: has("AUTH_URL"),
      NEXTAUTH_URL: has("NEXTAUTH_URL"),
      AUTH_SECRET: has("AUTH_SECRET"),
      NEXTAUTH_SECRET: has("NEXTAUTH_SECRET"),
      configuredBasePath: PINNED_AUTH_BASE_PATH,
    })}`,
  );
}

logAuthDebugStartupConfigOnce();

function logAuthDebugLine(payload: Record<string, unknown>): void {
  console.error(`[auth-debug] ${JSON.stringify(payload)}`);
}

export const authConfig: NextAuthConfig = {
  /**
   * No Prisma adapter: schema has no Account/Session/VerificationToken models required by
   * @auth/prisma-adapter. Credentials + JWT persist the session in the cookie only; users
   * are written via /api/signup and read here.
   */
  /**
   * Pinned via {@link PINNED_AUTH_BASE_PATH} — keep in lockstep with `auth-middleware.ts`.
   * `AUTH_URL` / `NEXTAUTH_URL` must be origin-only; see `auth-base-path.ts`.
   */
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
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email or username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const enteredEmailRaw = String(credentials.email ?? "");
        const ip = clientIpFromRequest(request);
        const rl = checkRateLimit(`login:${ip}`, { windowMs: 60_000, max: 40 });
        if (!rl.ok) {
          safeServerLog("auth", "login_rate_limited", { ip: ip.slice(0, 64) });
          Sentry.captureMessage("login_rate_limited", {
            level: "warning",
            tags: { flow: "auth", kind: "rate_limit" },
          });
          logAuthDebugLine({
            event: "credentials_attempt",
            failureReason: "rate_limited",
            ip: ip.slice(0, 64),
          });
          return null;
        }

        const identifier = normalizeLoginIdentifier(enteredEmailRaw);
        const password = String(credentials.password ?? "");
        const idHash = identifier ? hashLoginIdentifierForLog(identifier) : "";
        const authMode = isEmailLikeIdentifier(identifier) ? "email" : "username";
        const lockKey = `login-lock:${idHash || ip}`;

        if (!identifier || !password) {
          safeServerLog("auth", "login_failed", {
            reason: "missing_fields",
            ip: ip.slice(0, 64),
          });
          logAuthDebugLine({
            event: "credentials_attempt",
            enteredEmailRaw,
            enteredEmailLower: identifier,
            authMode,
            failureReason: "missing_fields",
            ip: ip.slice(0, 64),
          });
          return null;
        }

        const lockStatus = isLoginLocked(lockKey);
        if (lockStatus.locked) {
          safeServerLog("auth", "login_locked_out", {
            idHash,
            ip: ip.slice(0, 64),
            remainingMin: Math.ceil(lockStatus.remainingMs / 60_000),
          });
          logAuthDebugLine({
            event: "credentials_attempt",
            enteredEmailRaw,
            enteredEmailLower: identifier,
            authMode,
            failureReason: "login_locked_out",
            idHash,
            ip: ip.slice(0, 64),
          });
          return null;
        }

        const enteredEmailLower = identifier;
        const enteredEmailNormalized = isEmailLikeIdentifier(identifier)
          ? normalizeEmailForDedup(identifier)
          : "";
        const gmailLike = isGmailLikeAddress(identifier);

        let exactEmailUserCount = 0;
        let normalizedEmailUserCount = 0;
        let usernameMatchCount = 0;

        let user: CredentialsUserRow | null = null;

        let lookupStrategy: "exact_email" | "normalized_gmail" | "username" | null = null;

        try {
          if (isEmailLikeIdentifier(identifier)) {
            const dedup = normalizeEmailForDedup(identifier);
            [exactEmailUserCount, normalizedEmailUserCount] = await Promise.all([
              prisma.user.count({
                where: { email: { equals: identifier, mode: "insensitive" } },
              }),
              prisma.user.count({
                where: { normalizedEmail: dedup },
              }),
            ]);

            if (exactEmailUserCount > 1 || normalizedEmailUserCount > 1) {
              logAuthDebugLine({
                event: "credentials_attempt",
                enteredEmailRaw,
                enteredEmailLower,
                enteredEmailNormalized,
                isGmailLikeAddress: gmailLike,
                exactEmailUserCount,
                normalizedEmailUserCount,
                failureReason: "duplicate_user_match",
                ip: ip.slice(0, 64),
                idHash,
              });
            }

            user = await prisma.user.findFirst({
              where: { email: { equals: identifier, mode: "insensitive" } },
              select: CREDENTIALS_USER_SELECT,
            });
            if (user) {
              lookupStrategy = "exact_email";
            }
            /**
             * Gmail / Googlemail: signup stores {@link normalizeEmailForDedup} on `User.normalizedEmail`
             * (dots and +aliases normalized). A literal `email` match can fail when the user types an
             * equivalent address (e.g. `janedoe@gmail.com` vs stored `jane.doe@gmail.com`).
             */
            if (!user && gmailLike) {
              user = await prisma.user.findFirst({
                where: { normalizedEmail: dedup },
                select: CREDENTIALS_USER_SELECT,
              });
              if (user) lookupStrategy = "normalized_gmail";
            }
          } else {
            usernameMatchCount = await prisma.user.count({
              where: { username: { equals: identifier, mode: "insensitive" } },
            });
            if (usernameMatchCount > 1) {
              logAuthDebugLine({
                event: "credentials_attempt",
                enteredEmailRaw,
                enteredEmailLower,
                authMode: "username",
                usernameMatchCount,
                failureReason: "duplicate_user_match",
                ip: ip.slice(0, 64),
                idHash,
              });
            }
            user = await prisma.user.findFirst({
              where: { username: { equals: identifier, mode: "insensitive" } },
              select: CREDENTIALS_USER_SELECT,
            });
            if (user) lookupStrategy = "username";
          }
        } catch (e) {
          const detail = e instanceof Error ? e.message.slice(0, 800) : String(e).slice(0, 800);
          safeServerLogCritical("auth", "user_lookup_failed", { surface: "credentials", detail }, e);
          safeServerLog("auth", "login_failed", {
            reason: "db_error",
            authMode,
            idHash,
            ip: ip.slice(0, 64),
          });
          logAuthDebugLine({
            event: "credentials_attempt",
            enteredEmailRaw,
            enteredEmailLower,
            enteredEmailNormalized,
            isGmailLikeAddress: gmailLike,
            exactEmailUserCount,
            normalizedEmailUserCount,
            usernameMatchCount,
            authMode,
            failureReason: "db_error",
            detail: detail.slice(0, 400),
            ip: ip.slice(0, 64),
            idHash,
          });
          return null;
        }

        const baseDebug = {
          event: "credentials_attempt" as const,
          enteredEmailRaw,
          enteredEmailLower,
          enteredEmailNormalized,
          isGmailLikeAddress: gmailLike,
          exactEmailUserCount,
          normalizedEmailUserCount,
          usernameMatchCount,
          matchedUserId: user?.id ?? null,
          matchedUserEmail: user?.email ?? null,
          matchedUserNormalizedEmail: user?.normalizedEmail ?? null,
          hasPasswordHash: Boolean(user?.passwordHash),
          passwordCompareOk: null as boolean | null,
          lookupStrategy,
          failureReason: "" as string,
          ip: ip.slice(0, 64),
          idHash,
          authMode,
        };

        if (!user) {
          recordLoginFailure(lockKey);
          let notFoundReason: string;
          if (authMode === "email") {
            if (!gmailLike) {
              notFoundReason = "no_matching_user_exact";
            } else if (exactEmailUserCount === 0 && normalizedEmailUserCount === 0) {
              notFoundReason = "no_matching_user_normalized";
            } else {
              notFoundReason = "auth_config_callback_issue";
            }
          } else {
            notFoundReason = "no_matching_user_username";
          }
          baseDebug.failureReason = notFoundReason;
          baseDebug.passwordCompareOk = false;
          logAuthDebugLine(baseDebug);
          safeServerLog("auth", "login_failed", {
            reason: "user_not_found",
            authMode,
            idHash,
            ip: ip.slice(0, 64),
            failureCount: getFailureCount(lockKey),
            gmailNormalizedLookupTried:
              isEmailLikeIdentifier(identifier) && isGmailLikeAddress(identifier) ? "yes" : "no",
          });
          return null;
        }

        if (!user.passwordHash) {
          recordLoginFailure(lockKey);
          baseDebug.failureReason = "missing_password_hash";
          baseDebug.passwordCompareOk = false;
          logAuthDebugLine(baseDebug);
          safeServerLog("auth", "login_failed", {
            reason: "no_password_hash",
            authMode,
            idHash,
            userIdPrefix: user.id.slice(0, 8),
            ip: ip.slice(0, 64),
            hasPasswordHash: false,
          });
          return null;
        }

        let passwordOk = false;
        try {
          passwordOk = await compare(password, user.passwordHash);
        } catch (e) {
          recordLoginFailure(lockKey);
          const detail = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
          baseDebug.failureReason = "bcrypt_compare_error";
          baseDebug.passwordCompareOk = false;
          logAuthDebugLine({ ...baseDebug, bcryptDetail: detail });
          safeServerLog("auth", "login_failed", {
            reason: "password_compare_error",
            authMode,
            idHash,
            userIdPrefix: user.id.slice(0, 8),
            ip: ip.slice(0, 64),
            detail,
          });
          return null;
        }

        if (!passwordOk) {
          recordLoginFailure(lockKey);
          baseDebug.failureReason = "bcrypt_mismatch";
          baseDebug.passwordCompareOk = false;
          logAuthDebugLine(baseDebug);
          safeServerLog("auth", "login_failed", {
            reason: "invalid_password",
            authMode,
            idHash,
            ip: ip.slice(0, 64),
            failureCount: getFailureCount(lockKey),
            passwordCompareOk: false,
          });
          return null;
        }

        clearLoginFailures(lockKey);

        prisma.user.update({
          where: { id: user.id },
          data: {
            lastLoginIp: ip !== "unknown" ? ip.slice(0, 64) : null,
            lastLoginAt: new Date(),
          },
        }).catch(() => {});

        safeServerLog("auth", "login_success", {
          authMode,
          role: user.role,
          userIdPrefix: user.id.slice(0, 8),
        });

        logAuthDebugLine({
          event: "credentials_success",
          enteredEmailRaw,
          enteredEmailLower,
          enteredEmailNormalized,
          isGmailLikeAddress: gmailLike,
          exactEmailUserCount,
          normalizedEmailUserCount,
          usernameMatchCount,
          matchedUserId: user.id,
          matchedUserEmail: user.email,
          matchedUserNormalizedEmail: user.normalizedEmail,
          hasPasswordHash: true,
          passwordCompareOk: true,
          failureReason: "success",
          lookupStrategy:
            lookupStrategy === "username"
              ? "username"
              : lookupStrategy === "normalized_gmail"
                ? "normalized_gmail"
                : "exact_email",
        });

        let subscriptionStatus: SessionSubscriptionStatus = "none";
        if (isLearnerEntitlementStaffBypassRole(user.role)) {
          subscriptionStatus = "active";
        } else {
          try {
            const ua = await getUserAccess(user.id);
            subscriptionStatus = subscriptionStatusForSession(ua);
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
          alliedProfessionKey: user.alliedProfessionKey ?? null,
          subscriptionStatus,
          credentialVersion: user.credentialVersion ?? 0,
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
