import "./auth-trust-env";
import { Auth } from "@auth/core";
import { CredentialsSignin } from "@auth/core/errors";
import { compare } from "bcryptjs";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { NextRequest } from "next/server";
import { authCallbacks } from "@/lib/auth-callbacks";
import { nodeJwtCallback } from "@/lib/auth/node-jwt-callback";
import { JWT_SESSION_MAX_AGE_SEC, JWT_SESSION_UPDATE_AGE_SEC } from "@/lib/auth/auth-session-constants";
import { normalizeStoredPasswordHash } from "@/lib/auth/normalize-stored-password-hash";
import { hashLoginIdentifierForLog } from "@/lib/auth/log-auth-identifier";
import {
  isLoginLocked,
  recordLoginFailure,
  clearLoginFailures,
  getFailureCount,
} from "@/lib/auth/login-lockout";
import { isGmailLikeAddress, normalizeEmailForDedup } from "@/lib/auth/email-address-normalization";
import {
  isEmailLikeIdentifier,
  normalizeLoginIdentifier,
  sanitizeRawLoginIdentifier,
} from "@/lib/auth/normalize-login-identifier";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
import { Prisma } from "@prisma/client";
import { isLearnerEntitlementStaffBypassRole } from "@/lib/auth/staff-roles";
import { emitBillingAudit, prefixUserId } from "@/lib/observability/billing-entitlement-audit";
import {
  getUserAccess,
  subscriptionStatusForSession,
  type SessionSubscriptionStatus,
} from "@/lib/entitlements/get-user-access";
import { prisma } from "@/lib/db";
import { safeServerLog, safeServerLogCritical } from "@/lib/observability/safe-server-log";
import { PINNED_AUTH_BASE_PATH } from "@/lib/auth/auth-base-path";
import { logAuthIncidentLine } from "@/lib/auth/auth-incident-log";
import { recordCredentialsLoginFailure } from "@/lib/observability/production-signal-metrics";
import { correlationIdFromRequest } from "@/lib/observability/request-correlation";
import { emitStructuredLog } from "@/lib/observability/structured-log";

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
  const vercelEnv = process.env.VERCEL_ENV?.trim() || null;
  const nodeEnv = process.env.NODE_ENV ?? "unknown";
  logAuthIncidentLine({
    event: "auth_startup_env",
    AUTH_URL: has("AUTH_URL"),
    NEXTAUTH_URL: has("NEXTAUTH_URL"),
    AUTH_SECRET: has("AUTH_SECRET"),
    NEXTAUTH_SECRET: has("NEXTAUTH_SECRET"),
    DATABASE_URL: has("DATABASE_URL"),
    configuredAuthBasePath: PINNED_AUTH_BASE_PATH,
    environmentName: vercelEnv ?? nodeEnv,
    nodeEnv,
  });
}

logAuthDebugStartupConfigOnce();

/** Dev-only: set `NN_TRACE_CREDENTIALS_LOGIN=1` (non-production) to log safe authorize milestones (no secrets). */
function traceCredentialsAuthorizeDev(label: string, data: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "production") return;
  if (process.env.NN_TRACE_CREDENTIALS_LOGIN !== "1") return;
  safeServerLog("auth", "credentials_authorize_dev_trace", { label, ...data });
}

/**
 * When enabled, Auth.js includes `code=` on the credentials callback redirect for RN full-content / QA diagnostics.
 * Disabled in production unless PLAYWRIGHT_DIAGNOSTIC_AUTH_CODES=1 (opaque codes — no secrets).
 */
function authCredentialDiagnosticCodesEnabled(): boolean {
  return (
    process.env.PLAYWRIGHT_DIAGNOSTIC_AUTH_CODES === "1" ||
    process.env.CI === "true" ||
    process.env.NODE_ENV !== "production"
  );
}

function rejectCredentialsWithDiagnosticCode(code: string): never {
  const err = new CredentialsSignin();
  err.code = code;
  throw err;
}

/** Prefer diagnostic redirect codes when enabled; otherwise preserve legacy `return null` behavior. */
function rejectCredentialsOrNull(code: string): null {
  if (authCredentialDiagnosticCodesEnabled()) {
    rejectCredentialsWithDiagnosticCode(code);
  }
  return null;
}

type SentryAuthSdk = {
  captureMessage: (message: string, options: { level: "warning"; tags: Record<string, string> }) => void;
};

let sentryAuthSdkPromise: Promise<SentryAuthSdk | null> | null = null;

function loadSentryAuthSdk(): Promise<SentryAuthSdk | null> {
  if (process.env.SENTRY_ENABLED !== "true") return Promise.resolve(null);
  if (sentryAuthSdkPromise) return sentryAuthSdkPromise;
  sentryAuthSdkPromise = Promise.resolve().then(() => {
    try {
      const sentryModuleId = ["@sentry", "nextjs"].join("/");
      return require(sentryModuleId) as SentryAuthSdk;
    } catch {
      return null;
    }
  });
  return sentryAuthSdkPromise;
}

function captureAuthWarningSentry(message: string, options: { level: "warning"; tags: Record<string, string> }): void {
  void loadSentryAuthSdk()
    .then((Sentry) => {
      if (!Sentry) return;
      Sentry.captureMessage(message, options);
    })
    .catch(() => {});
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
        rememberMe: { label: "Stay signed in", type: "text" },
      },
      /**
       * Credentials login does **not** require `emailVerified` — only a matching user row,
       * non-empty bcrypt `passwordHash`, and `bcrypt.compare` success. Email verification is enforced
       * elsewhere (e.g. trial flows), not here.
       */
      async authorize(credentials, request) {
        const enteredEmailRaw = String(credentials.email ?? "");
        const enteredEmailSanitized = sanitizeRawLoginIdentifier(enteredEmailRaw);
        const enteredEmailLower = normalizeLoginIdentifier(enteredEmailSanitized);
        const enteredEmailNormalized = isEmailLikeIdentifier(enteredEmailLower)
          ? normalizeEmailForDedup(enteredEmailLower)
          : "";
        const ip = clientIpFromRequest(request);

        const rl = await checkRateLimitUnified(`login:${ip}`, { windowMs: 60_000, max: 40 });
        if (!rl.ok) {
          safeServerLog("auth", "login_rate_limited", { ip: ip.slice(0, 64) });
          captureAuthWarningSentry("login_rate_limited", {
            level: "warning",
            tags: { flow: "auth", kind: "rate_limit" },
          });
          logAuthIncidentLine({
            event: "credentials_login",
            outcome: "failure",
            requestReachedAuthorize: true,
            enteredEmailRaw,
            enteredEmailSanitized,
            enteredEmailLower,
            enteredEmailNormalized,
            lookupStrategyTried: [],
            exactEmailUserCount: 0,
            normalizedEmailUserCount: 0,
            trimmedEmailUserCount: 0,
            usernameMatchCount: 0,
            matchedUserId: null,
            matchedUserEmail: null,
            matchedUserNormalizedEmail: null,
            hasPasswordHash: false,
            accountLockedOut: false,
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason: "unknown_auth_failure",
            ip: ip.slice(0, 64),
          });
          recordCredentialsLoginFailure("rate_limited", request);
          return rejectCredentialsOrNull("rate_limited");
        }

        const password = String(credentials.password ?? "");
        const idHash = enteredEmailLower ? hashLoginIdentifierForLog(enteredEmailLower) : "";
        const authMode = isEmailLikeIdentifier(enteredEmailLower) ? "email" : "username";
        const lockKey = `login-lock:${idHash || ip}`;

        if (!enteredEmailLower || !password) {
          safeServerLog("auth", "login_failed", {
            reason: "missing_fields",
            ip: ip.slice(0, 64),
          });
          logAuthIncidentLine({
            event: "credentials_login",
            outcome: "failure",
            requestReachedAuthorize: true,
            enteredEmailRaw,
            enteredEmailSanitized,
            enteredEmailLower,
            enteredEmailNormalized,
            lookupStrategyTried: [],
            exactEmailUserCount: 0,
            normalizedEmailUserCount: 0,
            trimmedEmailUserCount: 0,
            usernameMatchCount: 0,
            matchedUserId: null,
            matchedUserEmail: null,
            matchedUserNormalizedEmail: null,
            hasPasswordHash: false,
            accountLockedOut: false,
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason: "unknown_auth_failure",
            ip: ip.slice(0, 64),
            authMode,
          });
          recordCredentialsLoginFailure("missing_fields", request);
          return rejectCredentialsOrNull("missing_credentials");
        }

        const lockStatus = await isLoginLocked(lockKey);
        if (lockStatus.locked) {
          safeServerLog("auth", "login_locked_out", {
            idHash,
            ip: ip.slice(0, 64),
            remainingMin: Math.ceil(lockStatus.remainingMs / 60_000),
          });
          logAuthIncidentLine({
            event: "credentials_login",
            outcome: "failure",
            requestReachedAuthorize: true,
            enteredEmailRaw,
            enteredEmailSanitized,
            enteredEmailLower,
            enteredEmailNormalized,
            lookupStrategyTried: [],
            exactEmailUserCount: 0,
            normalizedEmailUserCount: 0,
            trimmedEmailUserCount: 0,
            usernameMatchCount: 0,
            matchedUserId: null,
            matchedUserEmail: null,
            matchedUserNormalizedEmail: null,
            hasPasswordHash: false,
            accountLockedOut: true,
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason: "login_locked_out",
            ip: ip.slice(0, 64),
            idHash,
            authMode,
          });
          recordCredentialsLoginFailure("locked_out", request);
          return rejectCredentialsOrNull("account_locked");
        }

        const gmailLike = isGmailLikeAddress(enteredEmailLower);
        const normalizedStrategyLabel = gmailLike ? "normalized_gmail" : "normalized_email";
        let exactEmailUserCount = 0;
        let normalizedEmailUserCount = 0;
        let trimmedEmailUserCount = 0;
        let usernameMatchCount = 0;

        let user: CredentialsUserRow | null = null;

        let lookupStrategy: "exact_email" | "normalized_gmail" | "normalized_email" | "trimmed_email" | "username" | null =
          null;

        try {
          if (isEmailLikeIdentifier(enteredEmailLower)) {
            const dedup = normalizeEmailForDedup(enteredEmailLower);
            const trimmedCountRows = await prisma.$queryRaw<{ c: bigint }[]>(
              Prisma.sql`
                SELECT COUNT(*)::bigint AS c FROM "User"
                WHERE lower(btrim(email)) = lower(btrim(${enteredEmailLower}))
              `,
            );
            trimmedEmailUserCount = Number(trimmedCountRows[0]?.c ?? 0);

            [exactEmailUserCount, normalizedEmailUserCount] = await Promise.all([
              prisma.user.count({
                where: { email: { equals: enteredEmailLower, mode: "insensitive" } },
              }),
              prisma.user.count({
                where: { normalizedEmail: dedup },
              }),
            ]);

            if (exactEmailUserCount > 1 || normalizedEmailUserCount > 1 || trimmedEmailUserCount > 1) {
              await recordLoginFailure(lockKey);
              logAuthIncidentLine({
                event: "credentials_login",
                outcome: "failure",
                requestReachedAuthorize: true,
                enteredEmailRaw,
                enteredEmailSanitized,
                enteredEmailLower,
                enteredEmailNormalized,
                lookupStrategyTried: ["exact_email", normalizedStrategyLabel, "trimmed_email"],
                exactEmailUserCount,
                normalizedEmailUserCount,
                trimmedEmailUserCount,
                usernameMatchCount: 0,
                matchedUserId: null,
                matchedUserEmail: null,
                matchedUserNormalizedEmail: null,
                hasPasswordHash: false,
                accountLockedOut: false,
                passwordCompareOk: false,
                sessionIssued: false,
                finalFailureReason: "duplicate_user_match",
                ip: ip.slice(0, 64),
                idHash,
                authMode,
              });
              safeServerLog("auth", "login_failed", {
                reason: "duplicate_user_match",
                authMode,
                idHash,
                ip: ip.slice(0, 64),
              });
              recordCredentialsLoginFailure("duplicate_user_match", request);
              return rejectCredentialsOrNull("duplicate_user");
            }

            user = await prisma.user.findFirst({
              where: { email: { equals: enteredEmailLower, mode: "insensitive" } },
              select: CREDENTIALS_USER_SELECT,
            });
            if (user) {
              lookupStrategy = "exact_email";
            }
            if (!user) {
              user = await prisma.user.findFirst({
                where: { normalizedEmail: dedup },
                select: CREDENTIALS_USER_SELECT,
              });
              if (user) {
                lookupStrategy = gmailLike ? "normalized_gmail" : "normalized_email";
              }
            }
            if (!user) {
              try {
                const idRows = await prisma.$queryRaw<{ id: string }[]>(
                  Prisma.sql`
                    SELECT id FROM "User"
                    WHERE lower(btrim(email)) = lower(btrim(${enteredEmailLower}))
                    LIMIT 2
                  `,
                );
                if (idRows.length === 1) {
                  user = await prisma.user.findUnique({
                    where: { id: idRows[0].id },
                    select: CREDENTIALS_USER_SELECT,
                  });
                  if (user) lookupStrategy = "trimmed_email";
                }
              } catch {
                /* non-fatal */
              }
            }
          } else {
            usernameMatchCount = await prisma.user.count({
              where: { username: { equals: enteredEmailLower, mode: "insensitive" } },
            });
            if (usernameMatchCount > 1) {
              await recordLoginFailure(lockKey);
              logAuthIncidentLine({
                event: "credentials_login",
                outcome: "failure",
                requestReachedAuthorize: true,
                enteredEmailRaw,
                enteredEmailSanitized,
                enteredEmailLower,
                enteredEmailNormalized,
                lookupStrategyTried: ["username"],
                exactEmailUserCount: 0,
                normalizedEmailUserCount: 0,
                trimmedEmailUserCount: 0,
                usernameMatchCount,
                matchedUserId: null,
                matchedUserEmail: null,
                matchedUserNormalizedEmail: null,
                hasPasswordHash: false,
                accountLockedOut: false,
                passwordCompareOk: false,
                sessionIssued: false,
                finalFailureReason: "duplicate_user_match",
                ip: ip.slice(0, 64),
                idHash,
                authMode,
              });
              safeServerLog("auth", "login_failed", {
                reason: "duplicate_user_match",
                authMode,
                idHash,
                ip: ip.slice(0, 64),
              });
              recordCredentialsLoginFailure("duplicate_user_match", request);
              return rejectCredentialsOrNull("duplicate_user");
            }
            user = await prisma.user.findFirst({
              where: { username: { equals: enteredEmailLower, mode: "insensitive" } },
              select: CREDENTIALS_USER_SELECT,
            });
            if (user) lookupStrategy = "username";
          }
        } catch (e) {
          const detail = e instanceof Error ? e.message.slice(0, 800) : String(e).slice(0, 800);
          const postgresUrlAuthFailed =
            /password authentication failed|FATAL:\s*password authentication failed/i.test(detail);
          const finalFailureReason = postgresUrlAuthFailed ? "database_url_rejected" : "db_error";
          safeServerLogCritical("auth", "user_lookup_failed", { surface: "credentials", detail }, e);
          safeServerLog("auth", "login_failed", {
            reason: postgresUrlAuthFailed ? "database_url_invalid" : "db_error",
            authMode,
            idHash,
            ip: ip.slice(0, 64),
            postgresUrlAuthFailed,
          });
          logAuthIncidentLine({
            event: "credentials_login",
            outcome: "failure",
            requestReachedAuthorize: true,
            enteredEmailRaw,
            enteredEmailSanitized,
            enteredEmailLower,
            enteredEmailNormalized,
            lookupStrategyTried:
              authMode === "email" ? ["exact_email", normalizedStrategyLabel, "trimmed_email"] : ["username"],
            exactEmailUserCount,
            normalizedEmailUserCount,
            trimmedEmailUserCount,
            usernameMatchCount,
            matchedUserId: null,
            matchedUserEmail: null,
            matchedUserNormalizedEmail: null,
            hasPasswordHash: false,
            accountLockedOut: false,
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason,
            dbDetail: detail.slice(0, 400),
            ip: ip.slice(0, 64),
            idHash,
            authMode,
          });
          recordCredentialsLoginFailure("db_error", request);
          traceCredentialsAuthorizeDev("reject", {
            reason: postgresUrlAuthFailed ? "database_url_rejected" : "db_error",
            detail: detail.slice(0, 120),
          });
          return rejectCredentialsOrNull(postgresUrlAuthFailed ? "db_url_auth" : "db_lookup");
        }

        const lookupStrategyTried =
          authMode === "email"
            ? (["exact_email", normalizedStrategyLabel, "trimmed_email"] as const)
            : (["username"] as const);

        const incidentBase = {
          event: "credentials_login" as const,
          requestReachedAuthorize: true,
          enteredEmailRaw,
          enteredEmailSanitized,
          enteredEmailLower,
          enteredEmailNormalized,
          lookupStrategyTried: [...lookupStrategyTried],
          exactEmailUserCount,
          normalizedEmailUserCount,
          trimmedEmailUserCount,
          usernameMatchCount,
          matchedUserId: user?.id ?? null,
          matchedUserEmail: user?.email ?? null,
          matchedUserNormalizedEmail: user?.normalizedEmail ?? null,
          hasPasswordHash: Boolean(user?.passwordHash),
          accountLockedOut: false,
          ip: ip.slice(0, 64),
          idHash,
          authMode,
        };

        safeServerLog("auth", "credentials_authorize_lookup", {
          userFound: Boolean(user),
          userIdPrefix: user?.id ? user.id.slice(0, 8) : undefined,
          lookupStrategy: lookupStrategy ?? "none",
          authMode,
        });
        traceCredentialsAuthorizeDev("lookup_complete", {
          userFound: Boolean(user),
          lookupStrategy: lookupStrategy ?? "none",
          authMode,
          hasPasswordHash: Boolean(user?.passwordHash),
        });

        if (!user) {
          await recordLoginFailure(lockKey);
          let finalFailureReason:
            | "no_matching_user_exact"
            | "no_matching_user_normalized"
            | "no_matching_user_trimmed"
            | "unknown_auth_failure" = "unknown_auth_failure";
          if (authMode === "email") {
            if (trimmedEmailUserCount === 0) {
              finalFailureReason = "no_matching_user_trimmed";
            } else if (normalizedEmailUserCount === 0) {
              finalFailureReason = "no_matching_user_normalized";
            } else if (exactEmailUserCount === 0) {
              finalFailureReason = "no_matching_user_exact";
            } else {
              finalFailureReason = "unknown_auth_failure";
            }
          }
          logAuthIncidentLine({
            ...incidentBase,
            outcome: "failure",
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason,
          });
          safeServerLog("auth", "login_failed", {
            reason: "user_not_found",
            authMode,
            idHash,
            ip: ip.slice(0, 64),
            failureCount: await getFailureCount(lockKey),
            gmailNormalizedLookupTried:
              isEmailLikeIdentifier(enteredEmailLower) && isGmailLikeAddress(enteredEmailLower) ? "yes" : "no",
          });
          recordCredentialsLoginFailure("not_found", request);
          traceCredentialsAuthorizeDev("reject", { reason: "user_not_found", authMode });
          return rejectCredentialsOrNull("user_missing");
        }

        const storedPasswordHash = normalizeStoredPasswordHash(user.passwordHash);
        if (!storedPasswordHash) {
          await recordLoginFailure(lockKey);
          logAuthIncidentLine({
            ...incidentBase,
            outcome: "failure",
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason: "missing_password_hash",
          });
          safeServerLog("auth", "login_failed", {
            reason: "no_password_hash",
            authMode,
            idHash,
            userIdPrefix: user.id.slice(0, 8),
            ip: ip.slice(0, 64),
            hasPasswordHash: false,
          });
          recordCredentialsLoginFailure("no_password_hash", request);
          traceCredentialsAuthorizeDev("reject", { reason: "missing_password_hash", userIdPrefix: user.id.slice(0, 8) });
          return rejectCredentialsOrNull("no_password_hash");
        }

        let passwordOk = false;
        try {
          passwordOk = await compare(password, storedPasswordHash);
        } catch (e) {
          await recordLoginFailure(lockKey);
          const detail = e instanceof Error ? e.message.slice(0, 200) : String(e).slice(0, 200);
          safeServerLog("auth", "credentials_authorize_password", {
            passwordMatch: false,
            userIdPrefix: user.id.slice(0, 8),
            reason: "bcrypt_compare_error",
          });
          logAuthIncidentLine({
            ...incidentBase,
            outcome: "failure",
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason: "bcrypt_compare_error",
            bcryptDetail: detail,
          });
          safeServerLog("auth", "login_failed", {
            reason: "password_compare_error",
            authMode,
            idHash,
            userIdPrefix: user.id.slice(0, 8),
            ip: ip.slice(0, 64),
            detail,
          });
          recordCredentialsLoginFailure("system_error", request);
          traceCredentialsAuthorizeDev("reject", { reason: "bcrypt_compare_error", userIdPrefix: user.id.slice(0, 8) });
          return rejectCredentialsOrNull("system_error");
        }

        safeServerLog("auth", "credentials_authorize_password", {
          passwordMatch: passwordOk,
          userIdPrefix: user.id.slice(0, 8),
        });
        traceCredentialsAuthorizeDev("password_compare", {
          passwordMatch: passwordOk,
          userIdPrefix: user.id.slice(0, 8),
        });

        if (!passwordOk) {
          await recordLoginFailure(lockKey);
          logAuthIncidentLine({
            ...incidentBase,
            outcome: "failure",
            passwordCompareOk: false,
            sessionIssued: false,
            finalFailureReason: "bcrypt_mismatch",
          });
          safeServerLog("auth", "login_failed", {
            reason: "invalid_password",
            authMode,
            idHash,
            ip: ip.slice(0, 64),
            failureCount: await getFailureCount(lockKey),
            passwordCompareOk: false,
          });
          recordCredentialsLoginFailure("bad_password", request);
          traceCredentialsAuthorizeDev("reject", { reason: "password_mismatch", userIdPrefix: user.id.slice(0, 8) });
          return rejectCredentialsOrNull("password_invalid");
        }

        await clearLoginFailures(lockKey);

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

        const lookupStrategyResolved =
          lookupStrategy === "username"
            ? "username"
            : lookupStrategy === "normalized_gmail"
              ? "normalized_gmail"
              : lookupStrategy === "normalized_email"
                ? "normalized_email"
                : lookupStrategy === "trimmed_email"
                  ? "trimmed_email"
                  : "exact_email";

        const rememberRaw = String(credentials.rememberMe ?? "").trim().toLowerCase();
        const rememberMe =
          rememberRaw === "" ||
          !["false", "0", "off", "no"].includes(rememberRaw);

        logAuthIncidentLine({
          event: "credentials_login",
          outcome: "success",
          requestReachedAuthorize: true,
          enteredEmailRaw,
          enteredEmailSanitized,
          enteredEmailLower,
          enteredEmailNormalized,
          lookupStrategyTried: [...lookupStrategyTried],
          lookupStrategy: lookupStrategyResolved,
          exactEmailUserCount,
          normalizedEmailUserCount,
          trimmedEmailUserCount,
          usernameMatchCount,
          matchedUserId: user.id,
          matchedUserEmail: user.email,
          matchedUserNormalizedEmail: user.normalizedEmail,
          hasPasswordHash: true,
          accountLockedOut: false,
          passwordCompareOk: true,
          sessionIssued: true,
          finalFailureReason: null,
          ip: ip.slice(0, 64),
          idHash,
          authMode,
        });

        let subscriptionStatus: SessionSubscriptionStatus = "none";
        if (isLearnerEntitlementStaffBypassRole(user.role)) {
          subscriptionStatus = "active";
          emitBillingAudit("admin_override_applied", {
            userIdPrefix: prefixUserId(user.id),
            source: "admin",
            priorState: "entitlement_lookup_skipped",
            newState: "session_subscription_active",
            tier: String(user.tier),
            country: user.country != null ? String(user.country) : undefined,
            reason: "staff_learner_entitlement_bypass",
          });
        } else {
          try {
            const ua = await getUserAccess(user.id);
            subscriptionStatus = subscriptionStatusForSession(ua);
          } catch {
            /* DB unavailable — session still usable; entitlements resolve server-side */
          }
        }

        let loginRoutePath: string;
        try {
          loginRoutePath = new URL(request.url).pathname.slice(0, 200);
        } catch {
          loginRoutePath = `${PINNED_AUTH_BASE_PATH}/callback/credentials`;
        }
        emitStructuredLog("auth_login_succeeded", "info", {
          correlationId: correlationIdFromRequest(request),
          route: loginRoutePath,
          method: request.method,
          userRole: String(user.role),
          userState: subscriptionStatus,
          country: user.country != null ? String(user.country) : undefined,
          entitlementState: subscriptionStatus,
        });

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
