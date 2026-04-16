/**
 * Global API rate limits (Edge-safe). In-memory buckets per isolate — use Redis/KV for multi-instance parity.
 *
 * Priority: authenticated learner traffic gets a higher per-user ceiling; auth + public scraping get tight per-IP caps.
 * Repeated 429s from an IP increase `Retry-After` (exponential backoff) to protect real users from bot floods.
 */
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { checkRateLimitUnified } from "@/lib/http/rate-limit-unified";
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

/** Subscription APIs (portal, status) — tighter per-IP cap than generic `/api/*` (webhook exempt in {@link isExemptPath}). */
const SUBSCRIPTION_API_STRICT_PREFIX = "/api/subscriptions/";
const SUBSCRIPTION_STRICT_WINDOW_MS = 60_000;
const SUBSCRIPTION_STRICT_MAX = 40;

/** LLM / heavy AI routes — per-IP cap in addition to per-route user limits. */
const AI_EXPENSIVE_PREFIXES = ["/api/coach", "/api/ai"] as const;

const BILLING_WINDOW_MS = 60_000;
const BILLING_MAX = 24;

const AI_EXPENSIVE_WINDOW_MS = 60_000;
const AI_EXPENSIVE_MAX = 36;

/** Webhooks, health, and admin APIs (own RBAC / tooling) skip global buckets. */
const EXEMPT_PREFIXES = ["/api/subscriptions/webhook", "/api/health", "/api/admin"] as const;

/** Signup — per IP (stricter than generic public; bots target this). */
const SIGNUP_WINDOW_MS = 60_000;
const SIGNUP_MAX = 5;

/** Per auth *kind* so login throttles don’t consume forgot-password quota (and vice versa). */
const AUTH_KIND_LIMITS: Record<string, { windowMs: number; max: number }> = {
  signin: { windowMs: 60_000, max: 10 },
  callback: { windowMs: 60_000, max: 24 },
  csrf: { windowMs: 60_000, max: 45 },
  providers: { windowMs: 60_000, max: 28 },
  forgot: { windowMs: 60_000, max: 5 },
  reset: { windowMs: 60_000, max: 5 },
  change: { windowMs: 60_000, max: 5 },
  register: { windowMs: 60_000, max: 8 },
  error: { windowMs: 60_000, max: 18 },
  auth_other: { windowMs: 60_000, max: 10 },
};

const PUBLIC_WINDOW_MS = 60_000;
const PUBLIC_MAX = 48;

/** Marketing / public JSON under `/api/public/*` (cached counts, tags) — scanners love these. */
const PUBLIC_JSON_WINDOW_MS = 60_000;
const PUBLIC_JSON_MAX = 28;

/** Hot stats endpoint — hammered by bots + homepage; tight per IP before generic public_json. */
const HOME_STATS_WINDOW_MS = 60_000;
const HOME_STATS_MAX = 20;

const LEARNER_WINDOW_MS = 60_000;
const LEARNER_MAX = 120;

/** After many 429s, temporarily tighten public IP bucket (abuse signal only). */
const ABUSE_STRIKE_WINDOW_MS = 120_000;
const ABUSE_STRIKE_MAX = 32;
const TIGHT_PUBLIC_MAX = 24;

const strikeBuckets = new Map<string, { count: number; resetAt: number }>();

/** Rolling window of 429s per IP — drives exponential Retry-After. */
const STREAK_WINDOW_MS = 600_000;
const STREAK_MAX_KEYS = 4000;
const streakBuckets = new Map<string, { count: number; resetAt: number }>();

function pruneStreakBuckets(): void {
  if (streakBuckets.size <= STREAK_MAX_KEYS) return;
  const now = Date.now();
  for (const [k, s] of streakBuckets) {
    if (s.resetAt < now) streakBuckets.delete(k);
    if (streakBuckets.size <= STREAK_MAX_KEYS * 0.75) break;
  }
}

function bump429Streak(ip: string): number {
  pruneStreakBuckets();
  const now = Date.now();
  let s = streakBuckets.get(ip);
  if (!s || s.resetAt <= now) {
    s = { count: 1, resetAt: now + STREAK_WINDOW_MS };
  } else {
    s.count += 1;
  }
  streakBuckets.set(ip, s);
  return s.count;
}

/** Exported for unit tests — 10s → 20s → … capped at 300s. */
export function retryAfterSecondsFrom429Streak(streak: number): number {
  return Math.min(300, Math.floor(10 * Math.pow(2, Math.min(Math.max(0, streak - 1), 5))));
}

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

/**
 * NextAuth route “kind” for isolated buckets (login vs forgot-password vs callback, …).
 * Exported for policy tests.
 */
export function authRouteKind(pathname: string): string {
  if (pathname.includes("/forgot-password")) return "forgot";
  if (pathname.includes("/reset-password")) return "reset";
  if (pathname.includes("/change-password")) return "change";
  if (pathname.includes("/signin")) return "signin";
  if (pathname.includes("/callback")) return "callback";
  if (pathname.includes("/csrf")) return "csrf";
  if (pathname.includes("/providers")) return "providers";
  if (pathname.includes("/register")) return "register";
  if (pathname.includes("/error")) return "error";
  return "auth_other";
}

/** Dedicated stats endpoint — tighter than generic `/api/public/*`. */
export function isHomeStatsRateLimitPath(pathname: string): boolean {
  return pathname === "/api/public/home-stats";
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

function json429WithBackoff(ip: string): NextResponse {
  const streak = bump429Streak(ip);
  const sec = retryAfterSecondsFrom429Streak(streak);
  return NextResponse.json(
    { error: "Too many requests", code: "rate_limit_exceeded" },
    {
      status: 429,
      headers: { "Retry-After": String(sec) },
    },
  );
}

/** Subscriber learner bucket: fixed Retry-After (no exponential on user id — avoids punishing shared devices unfairly). */
function json429LearnerFixed(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests", code: "rate_limit_exceeded" },
    {
      status: 429,
      headers: { "Retry-After": "60" },
    },
  );
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
    const { ok } = await checkRateLimitUnified(key, { windowMs: SIGNUP_WINDOW_MS, max: SIGNUP_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "signup", path: pathname.slice(0, 96) });
      return json429WithBackoff(ip);
    }
    return null;
  }

  if (isBillingRateLimitPath(pathname)) {
    const key = `ratelimit:billing:ip:${ip}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: BILLING_WINDOW_MS, max: BILLING_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "billing", path: pathname.slice(0, 96) });
      return json429WithBackoff(ip);
    }
    return null;
  }

  if (isAiExpensiveRateLimitPath(pathname)) {
    const key = `ratelimit:ai_expensive:ip:${ip}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: AI_EXPENSIVE_WINDOW_MS, max: AI_EXPENSIVE_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "ai_expensive", path: pathname.slice(0, 96) });
      return json429WithBackoff(ip);
    }
    return null;
  }

  /** Stats — scanned heavily; limit before generic public_json. */
  if (isHomeStatsRateLimitPath(pathname)) {
    const cap = publicCapForIp(ip, HOME_STATS_MAX);
    const key = `ratelimit:public_home_stats:ip:${ip}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: HOME_STATS_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "public_home_stats", path: pathname.slice(0, 96) });
      const res = json429WithBackoff(ip);
      if (recordStrikeAndTighten(ip)) {
        safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ip) });
      }
      return res;
    }
    return null;
  }

  if (isAuthStrictPath(pathname)) {
    const kind = authRouteKind(pathname);
    const limits = AUTH_KIND_LIMITS[kind] ?? AUTH_KIND_LIMITS.auth_other;
    const key = `ratelimit:auth:${kind}:ip:${ip}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: limits.windowMs, max: limits.max });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", {
        kind: "auth_kind",
        authKind: kind,
        path: pathname.slice(0, 96),
      });
      return json429WithBackoff(ip);
    }
    return null;
  }

  if (pathname.startsWith("/api/auth/session")) {
    const cap = publicCapForIp(ip, 120);
    const key = `ratelimit:auth_session:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: PUBLIC_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "auth_session", path: "/api/auth/session" });
      const res = json429WithBackoff(ip);
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
      return json429LearnerFixed();
    }
    return null;
  }

  if (isPublicJsonRateLimitPath(pathname)) {
    const cap = publicCapForIp(ip, PUBLIC_JSON_MAX);
    const key = `ratelimit:public_json:ip:${ip}`;
    const { ok } = checkRateLimit(key, { windowMs: PUBLIC_JSON_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "public_json", path: pathname.slice(0, 96) });
      const res = json429WithBackoff(ip);
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
    const res = json429WithBackoff(ip);
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
