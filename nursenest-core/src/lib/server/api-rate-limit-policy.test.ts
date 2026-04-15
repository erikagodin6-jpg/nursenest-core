/**
 * Global API rate limit path classification (Edge proxy) — no HTTP, no buckets.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isAiExpensiveRateLimitPath,
  isAuthStrictPath,
  isBillingRateLimitPath,
  isPublicJsonRateLimitPath,
} from "@/lib/server/rate-limit";

describe("enforceApiRateLimit path classification", () => {
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
});
