/**
 * Global API rate limits (Node proxy). Uses {@link checkRateLimitUnified}: Postgres-backed windows in production
 * when `DATABASE_URL` is set; Retry-After streak + abuse-strike tightening use {@link consumeRateLimitUnified} /
 * {@link readRateLimitWindowCountUnified} so metadata is not per-instance.
 *
 * Priority: authenticated learner traffic gets a higher per-user ceiling; auth + public scraping get tight per-IP caps.
 * Repeated 429s from an IP increase `Retry-After` (exponential backoff) to protect real users from bot floods.
 */
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getAuthSessionJwtFromRequest } from "@/lib/auth/nextauth-request-jwt";
import type { SessionJwtPayload } from "@/lib/auth/nextauth-request-jwt";
import { tightenPublicCap } from "@/lib/config/rate-limit-tightening";
import {
  checkRateLimitUnified,
  consumeRateLimitUnified,
  readRateLimitWindowCountUnified,
} from "@/lib/http/rate-limit-unified";
import { getTrustedClientIp, rateLimitClientPartition } from "@/lib/http/client-ip";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  buildAuthStrictRateLimit429Json,
  publicRequestOriginForAuthUiRedirect,
} from "@/lib/server/rate-limit-auth-429-json";

/** Brute-force sensitive auth endpoints (not session polling). */
const AUTH_STRICT_SUBSTRINGS = [
  "/api/auth/callback",
  "/api/auth/signin",
  "/api/auth/csrf",
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

/** Anonymous access to heavy content list APIs — tighter than generic `/api/*` (protects Prisma + DB). */
const LEARNER_ANON_CONTENT_WINDOW_MS = 60_000;
const LEARNER_ANON_CONTENT_MAX = 40;

/** Billing / newsletter — expensive or spam-prone; separate bucket from generic public API. */
const BILLING_RATE_PATH_PREFIXES = ["/api/subscriptions/checkout", "/api/subscribe"] as const;

/** Public pricing matrix — scraped by bots; dedicated cap before generic `/api/*`. */
const PRICING_PATH_PREFIX = "/api/pricing";

/** Subscription APIs (portal, status) — tighter per-IP cap than generic `/api/*` (webhook exempt in {@link isExemptPath}). */
const SUBSCRIPTION_API_STRICT_PREFIX = "/api/subscriptions/";
const SUBSCRIPTION_STRICT_WINDOW_MS = 60_000;
const SUBSCRIPTION_STRICT_MAX = 40;

/** LLM / heavy AI routes — per-IP cap in addition to per-route user limits. */
const AI_EXPENSIVE_PREFIXES = ["/api/coach", "/api/ai"] as const;

const BILLING_WINDOW_MS = 60_000;
const BILLING_MAX = 18;

const PRICING_WINDOW_MS = 60_000;
const PRICING_MAX = 20;

const AI_EXPENSIVE_WINDOW_MS = 60_000;
const AI_EXPENSIVE_MAX = 36;

/** Webhooks + health skip global buckets. Admin uses a dedicated high ceiling in {@link enforceApiRateLimit} (nn-db-final-002). */
const EXEMPT_PREFIXES = ["/api/subscriptions/webhook", "/api/health"] as const;

/**
 * Stolen-session abuse protection: per-user cap above normal learner traffic ({@link LEARNER_MAX}),
 * still bounded. Unauthenticated probes use a separate per-IP bucket.
 */
const ADMIN_API_WINDOW_MS = 60_000;
/** ~7 req/s sustained — legitimate admin UIs; blocks hammering with a stolen cookie. Blog subtree uses dedicated buckets. */
const ADMIN_API_MAX_PER_USER = 420;
/** Stricter than {@link PUBLIC_MAX} — anonymous hits to `/api/admin/*` should be rare. */
const ADMIN_API_MAX_PER_IP_UNAUTH = 120;

/** Signup — per IP (stricter than generic public; bots target this). */
const SIGNUP_WINDOW_MS = 60_000;
const SIGNUP_MAX = 4;

/**
 * Single bucket for `POST /api/signup` (Node route handler). Proxy does **not** duplicate this key — one increment per request.
 * @see nursenest-core/src/app/api/signup/route.ts
 */
export const API_SIGNUP_PER_IP_RATE_LIMIT = {
  windowMs: SIGNUP_WINDOW_MS,
  max: SIGNUP_MAX,
  rateLimitKeyForIp: (ip: string) => `ratelimit:signup:ip:${ip}`,
} as const;

/** Per auth *kind* so login throttles don’t consume forgot-password quota (and vice versa). */
const AUTH_KIND_LIMITS: Record<string, { windowMs: number; max: number }> = {
  /**
   * POST `/api/auth/signin/*` (non-credentials OAuth entry) — keep separate from credential POST.
   * GET sign-in HTML is throttled via {@link AUTH_BOOTSTRAP_SIGNIN_GET_MAX} instead of this bucket.
   */
  signin: { windowMs: 60_000, max: 48 },
  /**
   * Credential POST (`/api/auth/callback/credentials`) — isolated from generic OAuth callbacks so
   * shared egress / CI does not exhaust the same bucket as Google/GitHub returns.
   */
  credentials_callback: { windowMs: 60_000, max: 120 },
  /** OAuth + non-credential callbacks — shared IPs (schools, offices) need headroom. */
  callback: { windowMs: 60_000, max: 48 },
  /** POST-only CSRF surfaces; GET `/api/auth/csrf` uses {@link AUTH_BOOTSTRAP_CSRF_GET_MAX}. */
  csrf: { windowMs: 60_000, max: 120 },
  forgot: { windowMs: 60_000, max: 8 },
  reset: { windowMs: 60_000, max: 8 },
  change: { windowMs: 60_000, max: 8 },
  register: { windowMs: 60_000, max: 12 },
  error: { windowMs: 60_000, max: 24 },
  auth_other: { windowMs: 60_000, max: 16 },
};

const PUBLIC_WINDOW_MS = 60_000;
const PUBLIC_MAX = 56;

/** Authenticated NextAuth session polling — per-user so NAT/shared IP does not evict real sessions. */
const AUTH_SESSION_WINDOW_MS = 60_000;
const AUTH_SESSION_MAX_PER_USER = 6000;

/** GET CSRF bootstrap — not a password attempt; must not share the tight legacy `csrf` POST bucket. */
const AUTH_BOOTSTRAP_CSRF_WINDOW_MS = 60_000;
const AUTH_BOOTSTRAP_CSRF_GET_MAX = 420;

/** GET Auth.js sign-in HTML — prefetch/RSC can fan out; keep far from credential POST ceilings. */
const AUTH_BOOTSTRAP_SIGNIN_GET_WINDOW_MS = 60_000;
const AUTH_BOOTSTRAP_SIGNIN_GET_MAX = 320;

/** Marketing / public JSON under `/api/public/*` (cached counts, tags) — scanners love these. */
const PUBLIC_JSON_WINDOW_MS = 60_000;
const PUBLIC_JSON_MAX = 24;

/** Hot stats endpoint — hammered by bots + homepage; tight per IP before generic public_json. */
const HOME_STATS_WINDOW_MS = 60_000;
const HOME_STATS_MAX = 14;

/** Flashcard tag list — DB join; tighter than generic `/api/public/*` now that route is cache-backed. */
const FLASHCARD_TAGS_WINDOW_MS = 60_000;
const FLASHCARD_TAGS_MAX = 12;

const LEARNER_WINDOW_MS = 60_000;
const LEARNER_MAX = 120;

/** After many 429s, temporarily tighten public IP bucket (abuse signal only). */
const ABUSE_STRIKE_WINDOW_MS = 120_000;
/** Policy threshold — tighten public caps after this many 429s in the abuse window. */
const ABUSE_STRIKE_MAX = 48;
/** Bucket ceiling for Postgres/in-memory (strikes continue counting past the policy threshold). */
const ABUSE_STRIKE_BUCKET_MAX = 4096;
const TIGHT_PUBLIC_MAX = 32;

/** Rolling window of 429s per IP — drives exponential Retry-After (shared store). */
const STREAK_WINDOW_MS = 600_000;
const STREAK_BUCKET_MAX = 512;

function abuseStrikeMetaKey(ip: string): string {
  return `ratelimit:meta:abuse_strike:ip:${ip}`;
}

function streakMetaKey(ip: string): string {
  return `ratelimit:meta:429_streak:ip:${ip}`;
}

/** Exported for unit tests — softer backoff so shared IPs recover (capped at 120s). */
export function retryAfterSecondsFrom429Streak(streak: number): number {
  return Math.min(120, Math.floor(5 * Math.pow(2, Math.min(Math.max(0, streak - 1), 4))));
}

async function recordStrikeAndTighten(ip: string): Promise<boolean> {
  const key = abuseStrikeMetaKey(ip);
  const r = await consumeRateLimitUnified(key, 1, {
    windowMs: ABUSE_STRIKE_WINDOW_MS,
    max: ABUSE_STRIKE_BUCKET_MAX,
  });
  const strikes = ABUSE_STRIKE_BUCKET_MAX - Math.max(0, r.remaining);
  return strikes >= ABUSE_STRIKE_MAX;
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
  if (pathname.includes("/callback/credentials")) return "credentials_callback";
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

/** Public flashcard tags — expensive list query; stricter than generic public JSON. */
export function isPublicFlashcardTagsRateLimitPath(pathname: string): boolean {
  return pathname === "/api/public/flashcard-tags";
}

function isLearnerPath(pathname: string): boolean {
  return LEARNER_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Exported for policy tests — checkout + public subscribe. */
export function isBillingRateLimitPath(pathname: string): boolean {
  return BILLING_RATE_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Public pricing catalog JSON — scraped heavily; separate bucket before generic `/api/*`. */
export function isPricingRateLimitPath(pathname: string): boolean {
  return pathname === PRICING_PATH_PREFIX || pathname.startsWith(`${PRICING_PATH_PREFIX}/`);
}

/** Exported for policy tests — Study Coach + `/api/ai/*`. */
export function isAiExpensiveRateLimitPath(pathname: string): boolean {
  return AI_EXPENSIVE_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** Public marketing JSON routes — separate bucket from generic anonymous `/api/*`. */
export function isPublicJsonRateLimitPath(pathname: string): boolean {
  return pathname.startsWith("/api/public/");
}

/** `/api/questions` and `/api/lessons` without a session — per-IP cap before generic public bucket. */
export function isLearnerContentAnonymousApiPath(pathname: string): boolean {
  return (
    pathname === "/api/questions" ||
    pathname.startsWith("/api/questions/") ||
    pathname === "/api/lessons" ||
    pathname.startsWith("/api/lessons/")
  );
}

function isExemptPath(pathname: string): boolean {
  return EXEMPT_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/** `/api/admin` and nested routes — light global RL (see ADMIN_API_* constants). */
export function isAdminApiRateLimitPath(pathname: string): boolean {
  return pathname === "/api/admin" || pathname.startsWith("/api/admin/");
}

async function publicCapForIpAsync(ip: string, base: number): Promise<number> {
  const { count } = await readRateLimitWindowCountUnified(abuseStrikeMetaKey(ip), {
    windowMs: ABUSE_STRIKE_WINDOW_MS,
    max: ABUSE_STRIKE_BUCKET_MAX,
  });
  if (count >= ABUSE_STRIKE_MAX) {
    return tightenPublicCap(TIGHT_PUBLIC_MAX);
  }
  return base;
}

function isLikelyBrowserDocumentNavigation(request: NextRequest): boolean {
  const mode = request.headers.get("sec-fetch-mode");
  if (mode === "navigate") return true;
  const dest = request.headers.get("sec-fetch-dest");
  if (dest === "document") return true;
  const accept = request.headers.get("accept") ?? "";
  return accept.includes("text/html");
}

/**
 * GETs to these paths are commonly full-page navigations (back button, `window.location`, OAuth return).
 * Returning JSON 429 would paint raw JSON in the document — redirect to `/login` instead.
 */
function isAuthStrictPathForDocumentRateLimitRedirect(pathname: string): boolean {
  if (pathname === "/api/auth/error") return true;
  if (pathname === "/api/auth/providers") return true;
  if (pathname === "/api/auth/signin" || pathname.startsWith("/api/auth/signin/")) return true;
  return false;
}

/**
 * Auth.js browser `signIn({ redirect: false })` always parses `const data = await res.json()` then
 * `new URL(data.url)` **before** branching on `res.ok`. A bare JSON 429 without `url` throws `TypeError: Invalid URL`,
 * which breaks the login UX and can surface odd client states when a duplicate POST races.
 *
 * For proxy rate limits on `/api/auth/*` strict paths, include a stable **UI** `url` (see {@link buildAuthStrictRateLimit429Json}).
 */
async function json429WithBackoff(ip: string, request?: NextRequest): Promise<NextResponse> {
  const r = await consumeRateLimitUnified(streakMetaKey(ip), 1, {
    windowMs: STREAK_WINDOW_MS,
    max: STREAK_BUCKET_MAX,
  });
  const streak = r.ok ? STREAK_BUCKET_MAX - Math.max(0, r.remaining) : STREAK_BUCKET_MAX;
  const sec = retryAfterSecondsFrom429Streak(streak);
  if (
    request &&
    request.method.toUpperCase() === "GET" &&
    isLikelyBrowserDocumentNavigation(request) &&
    isAuthStrictPathForDocumentRateLimitRedirect(request.nextUrl.pathname)
  ) {
    const dest = request.nextUrl.clone();
    dest.pathname = "/login";
    dest.search = "";
    dest.searchParams.set("error", "rate_limited");
    dest.searchParams.set("code", "rate_limit_exceeded");
    dest.searchParams.set("retryAfterSec", String(sec));
    return NextResponse.redirect(dest, {
      status: 302,
      headers: {
        "Retry-After": String(sec),
        "Cache-Control": "no-store",
      },
    });
  }
  const body =
    request != null
      ? buildAuthStrictRateLimit429Json(publicRequestOriginForAuthUiRedirect(request), sec)
      : { error: "Too many requests", code: "rate_limit_exceeded", retryAfterSec: sec };
  return NextResponse.json(body, {
    status: 429,
    headers: {
      "Retry-After": String(sec),
      "Cache-Control": "no-store",
    },
  });
}

/** Subscriber learner bucket: fixed Retry-After (no exponential on user id — avoids punishing shared devices unfairly). */
function json429LearnerFixed(): NextResponse {
  return NextResponse.json(
    { error: "Too many requests", code: "rate_limit_exceeded", retryAfterSec: 60 },
    {
      status: 429,
      headers: { "Retry-After": "60", "Cache-Control": "no-store" },
    },
  );
}

/** Admin API bucket — fixed Retry-After; per-user key resists stolen-session floods. */
function json429AdminFixed(meta: { limiter: string; path: string; bucketType: "admin_user" | "admin_ip_unauth" }): NextResponse {
  return NextResponse.json(
    {
      error: "Too many requests",
      code: "rate_limit_exceeded",
      scope: "admin_api",
      limiter: meta.limiter,
      bucketType: meta.bucketType,
      path: meta.path,
      retryAfterSec: 60,
    },
    {
      status: 429,
      headers: {
        "Retry-After": "60",
        "Cache-Control": "no-store",
        "X-NN-RateLimit-Scope": "admin_api",
        "X-NN-RateLimiter": meta.limiter,
        "X-NN-RateLimit-Bucket": meta.bucketType,
      },
    },
  );
}

/** Blog batch scheduler subtree — dedicated buckets per action (avoids one hot `ratelimit:admin:user:*` row + separates preview vs writes vs run). */
export const ADMIN_BLOG_BATCH_SCHEDULE_API_PREFIX = "/api/admin/blog/batch-schedule";

/**
 * Legacy `/admin/blog/generate` tooling — heavy AI + chunked shell writes.
 * Uses dedicated buckets so normal admin traffic elsewhere does not evict these flows from the shared
 * {@link ADMIN_API_MAX_PER_USER} ceiling, and JWT-miss / shared-IP cases get a realistic operator budget.
 */
export type AdminLegacyBlogToolingKind = "generate_ai" | "batch_chunk";

export function adminLegacyBlogToolingRateLimitKind(pathname: string, method: string): AdminLegacyBlogToolingKind | null {
  const m = method.toUpperCase();
  if (m !== "POST") return null;
  if (pathname === "/api/admin/blog/generate-ai") return "generate_ai";
  if (pathname === "/api/admin/blog/batch-chunk") return "batch_chunk";
  return null;
}

export type AdminBlogBatchRateLimitKind = "read" | "preview" | "write" | "run";

const ADMIN_BLOG_BATCH_WINDOW_MS = 60_000;

const ADMIN_BLOG_BATCH_MAX_USER: Record<AdminBlogBatchRateLimitKind, number> = {
  read: 520,
  preview: 220,
  write: 260,
  run: 200,
};

const ADMIN_BLOG_BATCH_MAX_IP_BASE: Record<AdminBlogBatchRateLimitKind, number> = {
  read: 240,
  preview: 120,
  write: 120,
  run: 96,
};

const ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS = 60_000;

/** Per authenticated staff user — AI writes are expensive; chunk endpoint may loop many times for “run all”. */
const ADMIN_LEGACY_BLOG_TOOLING_MAX_USER: Record<AdminLegacyBlogToolingKind, number> = {
  /** Single POST per click; headroom for dev refresh + QA without sharing the generic admin bucket. */
  generate_ai: 240,
  batch_chunk: 2400,
};

/** Unauthenticated hits still reach `requireAdmin` (403) — keep bounded; generous enough for JWT-read quirks + NAT. */
const ADMIN_LEGACY_BLOG_TOOLING_MAX_IP_BASE: Record<AdminLegacyBlogToolingKind, number> = {
  generate_ai: 160,
  batch_chunk: 720,
};

/**
 * Classifies blog batch scheduling API traffic for dedicated rate limits (path + method only — no body read in proxy).
 */
export function adminBlogBatchRateLimitKind(pathname: string, method: string): AdminBlogBatchRateLimitKind | null {
  const m = method.toUpperCase();
  const p = ADMIN_BLOG_BATCH_SCHEDULE_API_PREFIX;
  if (pathname !== p && !pathname.startsWith(`${p}/`)) return null;
  if (pathname === `${p}/preview` && m === "POST") return "preview";
  if (pathname === `${p}/run` && m === "POST") return "run";
  if (pathname === p && m === "GET") return "read";
  if (pathname === p && m === "POST") return "write";
  if (pathname.startsWith(`${p}/`) && pathname !== `${p}/run` && pathname !== `${p}/preview`) {
    if (m === "GET") return "read";
    if (m === "PATCH") return "write";
  }
  return null;
}

/** `/api/admin/blog/*` except batch-schedule + legacy generator paths (those use their own buckets). */
const ADMIN_BLOG_CONTENT_API_PREFIX = "/api/admin/blog";

export type AdminBlogContentApiKind = "read" | "write";

/**
 * Library, campaigns, draft-batch, control panel, localized flows, etc. — high enough for real editors
 * without debiting the global {@link ADMIN_API_MAX_PER_USER} pool.
 */
export function adminBlogContentApiRateLimitKind(pathname: string, method: string): AdminBlogContentApiKind | null {
  if (pathname !== ADMIN_BLOG_CONTENT_API_PREFIX && !pathname.startsWith(`${ADMIN_BLOG_CONTENT_API_PREFIX}/`)) {
    return null;
  }
  if (adminBlogBatchRateLimitKind(pathname, method) != null) return null;
  if (adminLegacyBlogToolingRateLimitKind(pathname, method) != null) return null;
  const m = method.toUpperCase();
  if (m === "GET" || m === "HEAD") return "read";
  if (m === "POST" || m === "PUT" || m === "PATCH" || m === "DELETE") return "write";
  return null;
}

const ADMIN_BLOG_CONTENT_WINDOW_MS = 60_000;

const ADMIN_BLOG_CONTENT_MAX_USER: Record<AdminBlogContentApiKind, number> = {
  read: 900,
  write: 640,
};

const ADMIN_BLOG_CONTENT_MAX_IP_BASE: Record<AdminBlogContentApiKind, number> = {
  read: 420,
  write: 280,
};

function json429AdminBlogContent(
  kind: AdminBlogContentApiKind,
  meta: { path: string; bucketKeyType: "user" | "ip_unauth"; windowMs: number; max: number },
): NextResponse {
  const retry = 30;
  return NextResponse.json(
    {
      error: "Too many requests",
      code: "rate_limit_exceeded",
      scope: "admin_blog_content",
      action: kind,
      limiter: "admin_blog_content",
      bucketType: "dedicated",
      bucketKeyType: meta.bucketKeyType,
      path: meta.path,
      windowMs: meta.windowMs,
      max: meta.max,
      retryAfterSec: retry,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retry),
        "Cache-Control": "no-store",
        "X-NN-RateLimit-Scope": "admin_blog_content",
        "X-NN-RateLimit-Action": kind,
        "X-NN-RateLimiter": "admin_blog_content",
        "X-NN-RateLimit-Bucket": meta.bucketKeyType,
      },
    },
  );
}

async function enforceDedicatedAdminBlogContentRateLimit(
  pathname: string,
  method: string,
  userId: string | null,
  ipKey: string,
): Promise<NextResponse | null> {
  const kind = adminBlogContentApiRateLimitKind(pathname, method);
  if (kind == null) return null;

  const pathShort = pathname.slice(0, 160);
  const userMax = ADMIN_BLOG_CONTENT_MAX_USER[kind];
  const ipMax = tightenPublicCap(ADMIN_BLOG_CONTENT_MAX_IP_BASE[kind]);

  if (userId) {
    const key = `ratelimit:admin:blog_content:${kind}:user:${userId}`;
    const { ok, remaining } = await checkRateLimitUnified(key, {
      windowMs: ADMIN_BLOG_CONTENT_WINDOW_MS,
      max: userMax,
    });
    if (!ok) {
      safeServerLog("security", "admin_blog_content_rate_limit_exceeded", {
        kind: "admin_blog_content_user",
        contentKind: kind,
        bucketKeyType: "user",
        path: pathShort,
        windowMs: ADMIN_BLOG_CONTENT_WINDOW_MS,
        max: userMax,
        ipHash: hashIp(ipKey),
        remaining,
      });
      return json429AdminBlogContent(kind, {
        path: pathShort,
        bucketKeyType: "user",
        windowMs: ADMIN_BLOG_CONTENT_WINDOW_MS,
        max: userMax,
      });
    }
    return null;
  }

  const key = `ratelimit:admin:blog_content:${kind}:ip_unauth:${ipKey}`;
  const { ok, remaining } = await checkRateLimitUnified(key, {
    windowMs: ADMIN_BLOG_CONTENT_WINDOW_MS,
    max: ipMax,
  });
  if (!ok) {
    safeServerLog("security", "admin_blog_content_rate_limit_exceeded", {
      kind: "admin_blog_content_ip",
      contentKind: kind,
      bucketKeyType: "ip_unauth",
      path: pathShort,
      windowMs: ADMIN_BLOG_CONTENT_WINDOW_MS,
      max: ipMax,
      ipHash: hashIp(ipKey),
      remaining,
    });
    return json429AdminBlogContent(kind, {
      path: pathShort,
      bucketKeyType: "ip_unauth",
      windowMs: ADMIN_BLOG_CONTENT_WINDOW_MS,
      max: ipMax,
    });
  }
  return null;
}

function json429AdminBlogBatch(kind: AdminBlogBatchRateLimitKind): NextResponse {
  const retry = 60;
  return NextResponse.json(
    {
      error: "Too many requests",
      code: "rate_limit_exceeded",
      scope: "admin_blog_batch",
      action: kind,
      limiter: "admin_blog_batch",
      bucketType: "dedicated",
      retryAfterSec: retry,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retry),
        "Cache-Control": "no-store",
        "X-NN-RateLimit-Scope": "admin_blog_batch",
        "X-NN-RateLimit-Action": kind,
        "X-NN-RateLimiter": "admin_blog_batch",
      },
    },
  );
}

function json429AdminLegacyBlogTooling(
  kind: AdminLegacyBlogToolingKind,
  meta: {
    path: string;
    bucketKeyType: "user" | "ip_unauth";
    windowMs: number;
    max: number;
  },
): NextResponse {
  /** Shorter than generic admin 60s — operators hitting the dedicated cap should cool off briefly, not sit idle a minute per retry. */
  const retry = 25;
  return NextResponse.json(
    {
      error: "Too many requests",
      code: "rate_limit_exceeded",
      scope: "admin_legacy_blog_tooling",
      action: kind,
      limiter: "admin_legacy_blog_tooling",
      bucketType: "dedicated",
      bucketKeyType: meta.bucketKeyType,
      path: meta.path,
      windowMs: meta.windowMs,
      max: meta.max,
      retryAfterSec: retry,
    },
    {
      status: 429,
      headers: {
        "Retry-After": String(retry),
        "Cache-Control": "no-store",
        "X-NN-RateLimit-Scope": "admin_legacy_blog_tooling",
        "X-NN-RateLimit-Action": kind,
        "X-NN-RateLimiter": "admin_legacy_blog_tooling",
        "X-NN-RateLimit-Bucket": meta.bucketKeyType,
      },
    },
  );
}

async function enforceDedicatedAdminLegacyBlogToolingRateLimit(
  pathname: string,
  method: string,
  userId: string | null,
  ipKey: string,
): Promise<NextResponse | null> {
  const kind = adminLegacyBlogToolingRateLimitKind(pathname, method);
  if (kind == null) return null;

  const pathShort = pathname.slice(0, 160);
  const userMax = ADMIN_LEGACY_BLOG_TOOLING_MAX_USER[kind];
  const ipMax = tightenPublicCap(ADMIN_LEGACY_BLOG_TOOLING_MAX_IP_BASE[kind]);

  if (userId) {
    const key = `ratelimit:admin:legacy_blog:${kind}:user:${userId}`;
    const { ok, remaining } = await checkRateLimitUnified(key, {
      windowMs: ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS,
      max: userMax,
    });
    if (!ok) {
      safeServerLog("security", "admin_legacy_blog_tooling_rate_limit_exceeded", {
        kind: "admin_legacy_blog_user",
        toolingKind: kind,
        bucketKeyType: "user",
        path: pathShort,
        windowMs: ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS,
        max: userMax,
        ipHash: hashIp(ipKey),
        remaining,
      });
      return json429AdminLegacyBlogTooling(kind, {
        path: pathShort,
        bucketKeyType: "user",
        windowMs: ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS,
        max: userMax,
      });
    }
    return null;
  }

  const key = `ratelimit:admin:legacy_blog:${kind}:ip_unauth:${ipKey}`;
  const { ok, remaining } = await checkRateLimitUnified(key, {
    windowMs: ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS,
    max: ipMax,
  });
  if (!ok) {
    safeServerLog("security", "admin_legacy_blog_tooling_rate_limit_exceeded", {
      kind: "admin_legacy_blog_ip",
      toolingKind: kind,
      bucketKeyType: "ip_unauth",
      path: pathShort,
      windowMs: ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS,
      max: ipMax,
      ipHash: hashIp(ipKey),
      remaining,
    });
    return json429AdminLegacyBlogTooling(kind, {
      path: pathShort,
      bucketKeyType: "ip_unauth",
      windowMs: ADMIN_LEGACY_BLOG_TOOLING_WINDOW_MS,
      max: ipMax,
    });
  }
  return null;
}

async function enforceDedicatedAdminBlogBatchRateLimit(
  pathname: string,
  method: string,
  userId: string | null,
  ipKey: string,
): Promise<NextResponse | null> {
  const blogKind = adminBlogBatchRateLimitKind(pathname, method);
  if (blogKind == null) return null;

  if (userId) {
    const key = `ratelimit:admin:blog_batch:${blogKind}:user:${userId}`;
    const { ok } = await checkRateLimitUnified(key, {
      windowMs: ADMIN_BLOG_BATCH_WINDOW_MS,
      max: ADMIN_BLOG_BATCH_MAX_USER[blogKind],
    });
    if (!ok) {
      safeServerLog("security", "admin_blog_batch_rate_limit_exceeded", {
        kind: "admin_blog_batch_user",
        blogKind,
        path: pathname.slice(0, 96),
        ipHash: hashIp(ipKey),
      });
      return json429AdminBlogBatch(blogKind);
    }
    return null;
  }

  const key = `ratelimit:admin:blog_batch:${blogKind}:ip_unauth:${ipKey}`;
  const { ok } = await checkRateLimitUnified(key, {
    windowMs: ADMIN_BLOG_BATCH_WINDOW_MS,
    max: tightenPublicCap(ADMIN_BLOG_BATCH_MAX_IP_BASE[blogKind]),
  });
  if (!ok) {
    safeServerLog("security", "admin_blog_batch_rate_limit_exceeded", {
      kind: "admin_blog_batch_ip",
      blogKind,
      path: pathname.slice(0, 96),
      ipHash: hashIp(ipKey),
    });
    return json429AdminBlogBatch(blogKind);
  }
  return null;
}

/** Auth.js strict proxy caps: avoid halving in dev/preview so shared IPs and tests are not false-positive blocked. */
function effectiveAuthStrictMax(base: number): number {
  if (process.env.NODE_ENV !== "production") return base;
  const ve = process.env.VERCEL_ENV?.trim();
  if (ve === "preview" || ve === "development") return Math.max(base, Math.ceil(base * 1.2));
  return tightenPublicCap(base);
}

/**
 * Prefer DB-style user id from JWT for per-user API limits. Falls back to a stable hash of email when
 * `sub`/`id` are absent so authenticated staff are not lumped into the anonymous per-IP admin bucket
 * (which caused spurious 429s on `/api/admin/*` while route-level `requireAdmin` still succeeded).
 */
export function rateLimitUserPartitionFromSessionJwt(token: SessionJwtPayload | null): string | null {
  if (!token || typeof token !== "object") return null;
  const t = token as { sub?: string; id?: string | null; email?: string | null };
  const sub = typeof t.sub === "string" ? t.sub.trim() : "";
  if (sub.length > 0) return sub;
  const legacyIdRaw = t.id;
  const legacyId = typeof legacyIdRaw === "string" ? legacyIdRaw.trim() : "";
  if (legacyId.length > 0) return legacyId;
  const email = typeof t.email === "string" ? t.email.trim().toLowerCase() : "";
  if (email.length > 0) {
    return `jwt_email:${createHash("sha256").update(email, "utf8").digest("hex").slice(0, 32)}`;
  }
  return null;
}

/**
 * Returns a 429 response when over limit; otherwise `null` (caller continues).
 */
export async function enforceApiRateLimit(request: NextRequest): Promise<NextResponse | null> {
  const pathname = request.nextUrl.pathname;
  if (!pathname.startsWith("/api/")) return null;
  if (isExemptPath(pathname)) return null;
  const method = request.method.toUpperCase();
  if (method === "OPTIONS" || method === "HEAD") return null;

  /**
   * NextAuth client `signIn()` always calls `GET /api/auth/providers` first. When this hits the strict
   * auth per-IP bucket (shared CI egress, prefetch bursts), `fetchData` gets a 429 → `null` providers →
   * the library hard-navigates to `/api/auth/error` **without** posting `/api/auth/callback/credentials`
   * (Playwright: “No POST response … within 45s”). Listing provider ids is not a brute-force surface;
   * keep brute-force protection on `/api/auth/callback/*` and `/api/auth/csrf`.
   */
  if (method === "GET" && pathname === "/api/auth/providers") {
    return null;
  }

  const ip = getTrustedClientIp(request);
  const ipKey = rateLimitClientPartition(request, ip);
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;
  const token = secret ? await getAuthSessionJwtFromRequest(request, secret) : null;
  const userId = rateLimitUserPartitionFromSessionJwt(token);

  if (isAdminApiRateLimitPath(pathname)) {
    const blogLimited = await enforceDedicatedAdminBlogBatchRateLimit(pathname, method, userId, ipKey);
    if (blogLimited) return blogLimited;
    if (adminBlogBatchRateLimitKind(pathname, method) != null) {
      return null;
    }

    const legacyLimited = await enforceDedicatedAdminLegacyBlogToolingRateLimit(pathname, method, userId, ipKey);
    if (legacyLimited) return legacyLimited;
    if (adminLegacyBlogToolingRateLimitKind(pathname, method) != null) {
      return null;
    }

    const blogContentLimited = await enforceDedicatedAdminBlogContentRateLimit(pathname, method, userId, ipKey);
    if (blogContentLimited) return blogContentLimited;
    if (adminBlogContentApiRateLimitKind(pathname, method) != null) {
      return null;
    }

    if (userId) {
      const key = `ratelimit:admin:user:${userId}`;
      const { ok, remaining } = await checkRateLimitUnified(key, {
        windowMs: ADMIN_API_WINDOW_MS,
        max: ADMIN_API_MAX_PER_USER,
      });
      if (!ok) {
        safeServerLog("security", "admin_api_rate_limit_exceeded", {
          kind: "admin_api_user",
          limiter: "admin_api_user",
          path: pathname.slice(0, 96),
          ipHash: hashIp(ipKey),
          remaining,
        });
        return json429AdminFixed({
          limiter: "admin_api_user",
          path: pathname.slice(0, 96),
          bucketType: "admin_user",
        });
      }
    } else {
      const key = `ratelimit:admin:ip_unauth:${ipKey}`;
      const { ok, remaining } = await checkRateLimitUnified(key, {
        windowMs: ADMIN_API_WINDOW_MS,
        max: tightenPublicCap(ADMIN_API_MAX_PER_IP_UNAUTH),
      });
      if (!ok) {
        safeServerLog("security", "admin_api_rate_limit_exceeded", {
          kind: "admin_api_ip",
          limiter: "admin_api_ip_unauth",
          path: pathname.slice(0, 96),
          ipHash: hashIp(ipKey),
          remaining,
        });
        return await json429WithBackoff(ipKey);
      }
    }
    return null;
  }

  if (isBillingRateLimitPath(pathname)) {
    const key = `ratelimit:billing:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, {
      windowMs: BILLING_WINDOW_MS,
      max: tightenPublicCap(BILLING_MAX),
    });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "billing", path: pathname.slice(0, 96) });
      return await json429WithBackoff(ipKey);
    }
    return null;
  }

  if (isPricingRateLimitPath(pathname)) {
    const key = `ratelimit:pricing:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, {
      windowMs: PRICING_WINDOW_MS,
      max: tightenPublicCap(PRICING_MAX),
    });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "pricing", path: pathname.slice(0, 96) });
      return await json429WithBackoff(ipKey);
    }
    return null;
  }

  if (isAiExpensiveRateLimitPath(pathname)) {
    const key = `ratelimit:ai_expensive:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, {
      windowMs: AI_EXPENSIVE_WINDOW_MS,
      max: tightenPublicCap(AI_EXPENSIVE_MAX),
    });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "ai_expensive", path: pathname.slice(0, 96) });
      return await json429WithBackoff(ipKey);
    }
    return null;
  }

  /** Stats — scanned heavily; limit before generic public_json. */
  if (isHomeStatsRateLimitPath(pathname)) {
    const cap = await publicCapForIpAsync(ipKey, tightenPublicCap(HOME_STATS_MAX));
    const key = `ratelimit:public_home_stats:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: HOME_STATS_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "public_home_stats", path: pathname.slice(0, 96) });
      const res = await json429WithBackoff(ipKey);
      if (await recordStrikeAndTighten(ipKey)) {
        safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ipKey) });
      }
      return res;
    }
    return null;
  }

  if (isPublicFlashcardTagsRateLimitPath(pathname)) {
    const cap = await publicCapForIpAsync(ipKey, tightenPublicCap(FLASHCARD_TAGS_MAX));
    const key = `ratelimit:public_flashcard_tags:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: FLASHCARD_TAGS_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "public_flashcard_tags", path: pathname.slice(0, 96) });
      return await json429WithBackoff(ipKey);
    }
    return null;
  }

  if (isAuthStrictPath(pathname)) {
    /** Passive browser bootstrap — never debit the POST credential / OAuth callback budgets. */
    if (method === "GET" && pathname === "/api/auth/csrf") {
      const key = `ratelimit:auth:bootstrap:csrf_get:ip:${ipKey}`;
      const max = effectiveAuthStrictMax(AUTH_BOOTSTRAP_CSRF_GET_MAX);
      const { ok, remaining } = await checkRateLimitUnified(key, {
        windowMs: AUTH_BOOTSTRAP_CSRF_WINDOW_MS,
        max,
      });
      if (!ok) {
        safeServerLog("security", "rate_limit_exceeded", {
          kind: "auth_bootstrap_csrf_get",
          limiter: "auth_bootstrap_csrf_get",
          keyShape: "ip_partition",
          method,
          path: pathname.slice(0, 96),
          windowMs: AUTH_BOOTSTRAP_CSRF_WINDOW_MS,
          max,
          remaining,
        });
        return await json429WithBackoff(ipKey, request);
      }
      return null;
    }
    if (method === "GET" && (pathname === "/api/auth/signin" || pathname.startsWith("/api/auth/signin/"))) {
      const key = `ratelimit:auth:bootstrap:signin_get:ip:${ipKey}`;
      const max = effectiveAuthStrictMax(AUTH_BOOTSTRAP_SIGNIN_GET_MAX);
      const { ok, remaining } = await checkRateLimitUnified(key, {
        windowMs: AUTH_BOOTSTRAP_SIGNIN_GET_WINDOW_MS,
        max,
      });
      if (!ok) {
        safeServerLog("security", "rate_limit_exceeded", {
          kind: "auth_bootstrap_signin_get",
          limiter: "auth_bootstrap_signin_get",
          keyShape: "ip_partition",
          method,
          path: pathname.slice(0, 96),
          windowMs: AUTH_BOOTSTRAP_SIGNIN_GET_WINDOW_MS,
          max,
          remaining,
        });
        return await json429WithBackoff(ipKey, request);
      }
      return null;
    }

    const kind = authRouteKind(pathname);
    const limits = AUTH_KIND_LIMITS[kind] ?? AUTH_KIND_LIMITS.auth_other;
    const key = `ratelimit:auth:${kind}:ip:${ipKey}`;
    const max = effectiveAuthStrictMax(limits.max);
    const { ok, remaining } = await checkRateLimitUnified(key, {
      windowMs: limits.windowMs,
      max,
    });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", {
        kind: "auth_kind",
        limiter: `auth_strict:${kind}`,
        authKind: kind,
        keyShape: "ip_partition",
        method,
        path: pathname.slice(0, 96),
        windowMs: limits.windowMs,
        max,
        remaining,
      });
      return await json429WithBackoff(ipKey, request);
    }
    return null;
  }

  if (pathname.startsWith("/api/auth/session")) {
    if (userId) {
      const key = `ratelimit:auth_session:user:${userId}`;
      const { ok, remaining } = await checkRateLimitUnified(key, {
        windowMs: AUTH_SESSION_WINDOW_MS,
        max: AUTH_SESSION_MAX_PER_USER,
      });
      if (!ok) {
        safeServerLog("security", "rate_limit_exceeded", {
          kind: "auth_session_user",
          limiter: "auth_session_user",
          keyShape: "user_id",
          method,
          path: "/api/auth/session",
          windowMs: AUTH_SESSION_WINDOW_MS,
          max: AUTH_SESSION_MAX_PER_USER,
          remaining,
        });
        return json429LearnerFixed();
      }
      return null;
    }
    const cap = await publicCapForIpAsync(ipKey, tightenPublicCap(200));
    const key = `ratelimit:auth_session:ip:${ipKey}`;
    const { ok, remaining } = await checkRateLimitUnified(key, { windowMs: PUBLIC_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", {
        kind: "auth_session_ip",
        limiter: "auth_session_ip",
        keyShape: "ip_partition",
        method,
        path: "/api/auth/session",
        windowMs: PUBLIC_WINDOW_MS,
        max: cap,
        remaining,
      });
      const res = await json429WithBackoff(ipKey, request);
      if (await recordStrikeAndTighten(ipKey)) {
        safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ipKey) });
      }
      return res;
    }
    return null;
  }

  if (pathname.startsWith(SUBSCRIPTION_API_STRICT_PREFIX) && !pathname.startsWith("/api/subscriptions/webhook")) {
    const key = `ratelimit:subscriptions:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, {
      windowMs: SUBSCRIPTION_STRICT_WINDOW_MS,
      max: tightenPublicCap(SUBSCRIPTION_STRICT_MAX),
    });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "subscriptions_api", path: pathname.slice(0, 96) });
      return await json429WithBackoff(ipKey);
    }
    return null;
  }

  if (isLearnerContentAnonymousApiPath(pathname) && !userId) {
    const key = `ratelimit:learner_anon_content:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, {
      windowMs: LEARNER_ANON_CONTENT_WINDOW_MS,
      max: tightenPublicCap(LEARNER_ANON_CONTENT_MAX),
    });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", {
        kind: "learner_anon_content",
        path: pathname.slice(0, 96),
      });
      return await json429WithBackoff(ipKey);
    }
    return null;
  }

  if (isLearnerPath(pathname) && userId) {
    const key = `ratelimit:learner:user:${userId}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: LEARNER_WINDOW_MS, max: LEARNER_MAX });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "learner", path: pathname.slice(0, 96) });
      return json429LearnerFixed();
    }
    return null;
  }

  if (isPublicJsonRateLimitPath(pathname)) {
    const cap = await publicCapForIpAsync(ipKey, tightenPublicCap(PUBLIC_JSON_MAX));
    const key = `ratelimit:public_json:ip:${ipKey}`;
    const { ok } = await checkRateLimitUnified(key, { windowMs: PUBLIC_JSON_WINDOW_MS, max: cap });
    if (!ok) {
      safeServerLog("security", "rate_limit_exceeded", { kind: "public_json", path: pathname.slice(0, 96) });
      const res = await json429WithBackoff(ipKey);
      if (await recordStrikeAndTighten(ipKey)) {
        safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ipKey) });
      }
      return res;
    }
    return null;
  }

  const cap = await publicCapForIpAsync(ipKey, tightenPublicCap(PUBLIC_MAX));
  const key = `ratelimit:public:ip:${ipKey}`;
  const { ok } = await checkRateLimitUnified(key, { windowMs: PUBLIC_WINDOW_MS, max: cap });
  if (!ok) {
    safeServerLog("security", "rate_limit_exceeded", { kind: "public", path: pathname.slice(0, 96) });
    const res = await json429WithBackoff(ipKey);
    if (await recordStrikeAndTighten(ipKey)) {
      safeServerLog("security", "rate_limit_abuse_tighten", { ipHash: hashIp(ipKey) });
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
