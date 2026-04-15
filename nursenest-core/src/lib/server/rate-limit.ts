/**
 * Global API rate limits (Edge-safe). Uses in-memory buckets per isolate — tune Redis/KV for multi-instance parity.
 *
 * Priority: paid learner traffic gets a higher per-user ceiling; auth-sensitive endpoints are tight per IP.
 */
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/http/rate-limit-in-memory";
import { getTrustedClientIp } from "@/lib/http/client-ip";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Brute-force sensitive auth endpoints (not session polling). */
const AUTH_STRICT_SUBSTRINGS = [
  "/api/auth/callback",
  "/api/auth/signin",
  "/api/auth/csrf",
  "/api/auth/providers",
  "/api/auth/register",
  "/api/auth/error",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
  "/api/auth/change-password",
] as const;

const LEARNER_PREFIXES = [
  "/api/lessons",
  "/api/questions",
  "/api/flashcards",
  "/api/learner",
  "/api/auth/sync-session",
] as const;

/** Billing / newsletter — expensive or spam-prone; separate bucket from generic public API. */
const BILLING_RATE_PATH_PREFIXES = ["/api/subscriptions/checkout", "/api/subscribe"] as const;

/** LLM / heavy AI routes — per-IP cap in addition to per-route user limits. */
const AI_EXPENSIVE_PREFIXES = ["/api/coach", "/api/ai"] as const;

const BILLING_WINDOW_MS = 60_000;
const BILLING_MAX = 28;

const AI_EXPENSIVE_WINDOW_MS = 60_000;
const AI_EXPENSIVE_MAX = 42;

/** Webhooks, health, and admin APIs (own RBAC / tooling) skip global buckets. */
const EXEMPT_PREFIXES = ["/api/subscriptions/webhook", "/api/health", "/api/admin"] as const;

const AUTH_STRICT_WINDOW_MS = 10_000;
const AUTH_STRICT_MAX = 5;

const PUBLIC_WINDOW_MS = 60_000;
const PUBLIC_MAX = 60;

/** Marketing / public JSON under `/api/public/*` (cached counts, etc.) — tighter than generic `/api/*` to blunt scanners. */
const PUBLIC_JSON_WINDOW_MS = 60_000;
const PUBLIC_JSON_MAX = 45;

const LEARNER_WINDOW_MS = 60_000;
const LEARNER_MAX = 120;

/** After many 429s, temporarily tighten public IP bucket (abuse signal only). */
const ABUSE_STRIKE_WINDOW_MS = 120_000;
const ABUSE_STRIKE_MAX = 40;
const TIGHT_PUBLIC_MAX = 30;

const strikeBuckets = new Map<string, { count: number; resetAt: number }>();

function recordStrikeAndTighten(ip: string): boolean {
  const now = Date.now();
  let b = strikeBuckets.get(ip);
  if (!b || b.resetAt <= now) {
    b = { count: 0, resetAt: now + ABUSE_STRIKE_WINDOW_MS };
    strikeBuckets.set(ip, b);
  }
  b.count += 1;
  return b.count >= ABUSE_STRIKE_MAX;
}

/** Exported for unit tests — auth-sensitive paths get stricter per-IP limits. */
export function isAuthStrictPath(pathname: string): boolean {
  return AUTH_STRICT_SUBSTRINGS.some((s) => pathname.startsWith(s));
}

function isLearnerPath(pathname: string): boolean {
  return LEARNER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Exported for policy tests — checkout + public subscribe. */
export function isBillingRateLimitPath(pathname: string): boolean {
  return BILLING_RATE_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Exported for policy tests — Study Coach + `/api/ai/*`. */
export function isAiExpensiveRateLimitPath(pathname: string): boolean {
  return AI_EXPENSIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Public marketing JSON routes — separate bucket from generic anonymous `/api/*`. */
export function isPublicJsonRateLimitPath(pathname: string): boolean {
  return pathname.startsWith("/api/public/");
}

function isExemptPath(pathname: string): boolean {
  return EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function publicCapForIp(ip: string, base: number): number {
  const b = strikeBuckets.get(ip);
  if (b && b.resetAt > Date.now() && b.count >= ABUSE_STRIKE_MAX) {
    return TIGHT_PUBLIC_MAX;
  }
  return base;
}

/**
 * Returns a 429 response when over limit; otherwise `null` (caller continues).
 */
export async function enforceApiRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api/")) return null;
  if (isExemptPath(pathname)) return null;

  const ip = getTrustedClientIp(request);
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = secret ? await getToken({ req: request, secret }) : null;
  const userId =
    (typeof token?.sub === "string" && token.sub) ||
    (token as { id?: string } | null)?.id ||
    null;

  if (pathname === "/api/signup" || pathname.startsWith("/api/signup/")) {
    const key = `ratelimit:signup:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: AUTH_STRICT_WINDOW_MS, max: AUTH_STRICT_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "auth_strict", path: pathname.slice(0, 96) });
      return json429(10);
    }
    return null;
  }

  if (isBillingRateLimitPath(pathname)) {
    const key = `ratelimit:billing:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: BILLING_WINDOW_MS, max: BILLING_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "billing", path: pathname.slice(0, 96) });
      return json429(60);
    }
    return null;
  }

  if (isAiExpensiveRateLimitPath(pathname)) {
    const key = `ratelimit:ai_expensive:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: AI_EXPENSIVE_WINDOW_MS, max: AI_EXPENSIVE_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "ai_expensive", path: pathname.slice(0, 96) });
      return json429(60);
    }
    return null;
  }

  if (isAuthStrictPath(pathname)) {
    const key = `ratelimit:auth_strict:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: AUTH_STRICT_WINDOW_MS, max: AUTH_STRICT_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "auth_strict", path: pathname.slice(0, 96) });
      return json429(10);
    }
    return null;
  }

  if (pathname.startsWith("/api/auth/session")) {
    /** Session polling can be chatty; stay below learner tier but above generic public. */
    const cap = publicCapForIp(ip, 120);
    const key = `ratelimit:auth_session:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: PUBLIC_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "auth_session", path: "/api/auth/session" });
      const res = json429(60);
      if (recordStrikeAndTighten(ip)) {
        safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ip) });
      }
      return res;
    }
    return null;
  }

  if (isLearnerPath(pathname) && userId) {
    const key = `ratelimit:learner:user:${userId}`;
    const { ok } = checkRateLimit(key, { windowMs: LEARNER_WINDOW_MS, max: LEARNER_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "learner", path: pathname.slice(0, 96) });
      return json429(60);
    }
    return null;
  }

  if (isPublicJsonRateLimitPath(pathname)) {
    const cap = publicCapForIp(ip, PUBLIC_JSON_MAX);
    const key = `ratelimit:public_json:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: PUBLIC_JSON_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "public_json", path: pathname.slice(0, 96) });
      const res = json429(60);
      if (recordStrikeAndTighten(ip)) {
        safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ip) });
      }
      return res;
    }
    return null;
  }

  const cap = publicCapForIp(ip, PUBLIC_MAX);
  const key = `ratelimit:public:ip:${ip}`;
  const { ok } = checkRateLimit(key, { windowMs: PUBLIC_WINDOW_MS, max: cap });
  if (!ok) {
    safeServerLog("security", "rate_limit_exceeded", { kind: "public", path: pathname.slice(0, 96) });
    const res = json429(60);
    if (recordStrikeAndTighten(ip)) {
      safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ip) });
    }
    return res;
  }
  return null;
}

function hashIp(ip: string): string {
  let h = 0;
  for (let i = 0; i < ip.length; i++) h = (h * 31 + ip.charCodeAt(i)) | 0;
  return String(h >>> 0);
}

function json429(retryAfterSec: number): NextResponse {
  return NextResponse.json(
    { error: "Too many requests", code: "rate_limit_exceeded" },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}
