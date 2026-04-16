/**
 * Global API rate limit path classification (Edge proxy) — no HTTP, no buckets.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  authRouteKind,
  isAdminApiRateLimitPath,
  isAiExpensiveRateLimitPath,
  isAuthStrictPath,
  isBillingRateLimitPath,
  isHomeStatsRateLimitPath,
  isPublicJsonRateLimitPath,
  retryAfterSecondsFrom429Streak,
} from "@/lib/server/rate-limit";

describe("enforceApiRateLimit path classification", () => {
  it("marks admin API subtree for dedicated RL (nn-db-final-002)", () => {
    assert.equal(isAdminApiRateLimitPath("/api/admin"), true);
    assert.equal(isAdminApiRateLimitPath("/api/admin/ops/run"), true);
    assert.equal(isAdminApiRateLimitPath("/api/administration"), false);
    assert.equal(isAdminApiRateLimitPath("/api/questions"), false);
  });

  it("marks billing / checkout + subscribe", () => {
    assert.equal(isBillingRateLimitPath("/api/subscriptions/checkout"), true);
    assert.equal(isBillingRateLimitPath("/api/subscribe"), true);
    assert.equal(isBillingRateLimitPath("/api/subscriptions/webhook"), false);
  });

  it("marks AI-heavy routes", () => {
    assert.equal(isAiExpensiveRateLimitPath("/api/coach"), true);
    assert.equal(isAiExpensiveRateLimitPath("/api/ai/study-plan/generate"), true);
    assert.equal(isAiExpensiveRateLimitPath("/api/questions"), false);
  });

  it("keeps auth credential surfaces strict", () => {
    assert.equal(isAuthStrictPath("/api/auth/forgot-password"), true);
    assert.equal(isAuthStrictPath("/api/auth/reset-password"), true);
    assert.equal(isAuthStrictPath("/api/auth/change-password"), true);
  });

  it("routes public marketing JSON under a dedicated bucket", () => {
    assert.equal(isPublicJsonRateLimitPath("/api/public/home-stats"), true);
    assert.equal(isPublicJsonRateLimitPath("/api/public/foo/bar"), true);
    assert.equal(isPublicJsonRateLimitPath("/api/questions"), false);
  });

  it("isolates home-stats for tighter cap than generic public_json", () => {
    assert.equal(isHomeStatsRateLimitPath("/api/public/home-stats"), true);
    assert.equal(isHomeStatsRateLimitPath("/api/public/flashcard-tags"), false);
  });

  it("splits auth kinds for per-route buckets", () => {
    assert.equal(authRouteKind("/api/auth/signin"), "signin");
    assert.equal(authRouteKind("/api/auth/signin/credentials"), "signin");
    assert.equal(authRouteKind("/api/auth/callback/google"), "callback");
    assert.equal(authRouteKind("/api/auth/forgot-password"), "forgot");
    assert.equal(authRouteKind("/api/auth/reset-password"), "reset");
    assert.equal(authRouteKind("/api/auth/csrf"), "csrf");
  });

  it("exponential Retry-After from streak (capped)", () => {
    assert.equal(retryAfterSecondsFrom429Streak(1), 10);
    assert.equal(retryAfterSecondsFrom429Streak(2), 20);
    assert.equal(retryAfterSecondsFrom429Streak(3), 40);
    assert.equal(retryAfterSecondsFrom429Streak(10), 300);
  });
});
