import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { checkRateLimit, consumeRateLimit } from "@/lib/http/rate-limit-in-memory";
import { getTrustedClientIp, ipRateLimitKey } from "@/lib/http/client-ip";
import { readDeviceRequestContext } from "@/lib/http/device-request";

function userPrefix(userId: string): string {
  return userId.slice(0, 8);
}

function logAbuse(kind: string, route: string, userId: string, ip: string, extra?: Record<string, unknown>): void {
  safeServerLog("security", "abuse_suspected", {
    kind,
    route,
    userIdPrefix: userPrefix(userId),
    ipSample: ip.length > 16 ? `${ip.slice(0, 12)}…` : ip,
    ...extra,
  });
}

function tooMany(
  code: string,
  retryAfterSec: number,
  detail?: string,
): NextResponse {
  return NextResponse.json(
    { error: "Too many requests", code, ...(detail ? { detail } : {}) },
    {
      status: 429,
      headers: { "Retry-After": String(retryAfterSec) },
    },
  );
}

function checkDeviceMismatch(req: NextRequest, route: string, userId: string, ip: string): void {
  const d = readDeviceRequestContext(req);
  if (d.mismatch) {
    logAbuse("device_header_mismatch", route, userId, ip, {
      hasCookie: d.cookieValue ? 1 : 0,
      hasHeader: d.headerValue ? 1 : 0,
    });
  }
}

/** GET /api/questions — IP + per-user + bulk row volume (10m window). */
export function enforceQuestionsListProtection(
  req: NextRequest,
  userId: string,
  pageSize: number,
): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "questions_list";
  checkDeviceMismatch(req, route, userId, ip);

  const ipKey = ipRateLimitKey(ip, route);
  const ipLim = checkRateLimit(ipKey, { windowMs: 60_000, max: 420 });
  if (!ipLim.ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  const userKey = `api:user:${userId}:${route}`;
  const userLim = checkRateLimit(userKey, { windowMs: 60_000, max: 96 });
  if (!userLim.ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  const volKey = `api:vol:qlist:${userId}`;
  const vol = consumeRateLimit(volKey, pageSize, { windowMs: 600_000, max: 360 });
  if (!vol.ok) {
    logAbuse("bulk_question_fetch", route, userId, ip, { pageSize });
    return tooMany("bulk_limit", 600, "Question list volume limit exceeded. Try again later.");
  }

  return null;
}

/** GET /api/questions/[id] — high churn of IDs (scraping). */
export function enforceQuestionByIdProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "question_by_id";
  checkDeviceMismatch(req, route, userId, ip);

  const ipKey = ipRateLimitKey(ip, route);
  if (!checkRateLimit(ipKey, { windowMs: 60_000, max: 540 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  const userKey = `api:user:${userId}:${route}`;
  if (!checkRateLimit(userKey, { windowMs: 60_000, max: 200 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** GET /api/questions/discovery — expensive aggregates. */
export function enforceDiscoveryProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "questions_discovery";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 36 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 8 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 120);
  }

  return null;
}

/** GET /api/lessons — IP + user + row volume. */
export function enforceLessonsListProtection(
  req: NextRequest,
  userId: string,
  pageSize: number,
): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "lessons_list";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 480 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 120 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  const vol = consumeRateLimit(`api:vol:lessons:${userId}`, pageSize, { windowMs: 600_000, max: 480 });
  if (!vol.ok) {
    logAbuse("bulk_list_fetch", route, userId, ip, { pageSize });
    return tooMany("bulk_limit", 600);
  }

  return null;
}

/** POST /api/questions/grade */
export function enforceQuestionGradeProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "questions_grade";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 90 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 180 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** GET/POST/DELETE /api/learner/notes — note save/load; throttle bulk abuse. */
export function enforceLearnerNotesProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "learner_notes";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 120 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 90 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** GET /api/practice-tests/[id] — full question payloads for review. */
export function enforcePracticeTestDetailProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "practice_test_detail";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 90 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 120 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** PATCH /api/practice-tests/[id] — save, complete, CAT advance, abandon. */
export function enforcePracticeTestMutationProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "practice_test_mutate";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 120 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 180 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** GET /api/exams/attempt/[id] — graded review snapshot. */
export function enforceExamAttemptDetailProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "exam_attempt_detail";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 90 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 120 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** GET /api/practice-tests — list user sessions (bounded take in handler). */
export function enforcePracticeTestsListProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "practice_tests_list";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 180 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 90 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** GET /api/flashcards/decks/[deckRef]/study — subscriber card batches. */
export function enforceFlashcardStudyProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "flashcard_study";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 120 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 90 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** POST /api/flashcards/decks/[deckRef]/review */
export function enforceFlashcardReviewProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "flashcard_review";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 180 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 240 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  return null;
}

/** POST /api/exams/start — heavy session build. */
export function enforceExamStartProtection(req: NextRequest, userId: string): NextResponse | null {
  const ip = getTrustedClientIp(req);
  const route = "exam_start";
  checkDeviceMismatch(req, route, userId, ip);

  if (!checkRateLimit(ipRateLimitKey(ip, route), { windowMs: 60_000, max: 24 }).ok) {
    logAbuse("ip_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 60);
  }

  if (!checkRateLimit(`api:user:${userId}:${route}`, { windowMs: 60_000, max: 8 }).ok) {
    logAbuse("user_rate_limit", route, userId, ip);
    return tooMany("rate_limited", 120);
  }

  return null;
}
