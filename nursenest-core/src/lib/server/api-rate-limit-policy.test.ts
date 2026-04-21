/**
 * Global API rate limit path classification (Edge proxy) — no HTTP, no buckets.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  authRouteKind,
  isAdminApiRateLimitPath,
  isAiExpensiveRateLimitPath,
  isAuthStrictPath,
  isBillingRateLimitPath,
  isHomeStatsRateLimitPath,
  isLearnerContentAnonymousApiPath,
  isPricingRateLimitPath,
  isPublicFlashcardTagsRateLimitPath,
  isPublicJsonRateLimitPath,
  retryAfterSecondsFrom429Streak,
} from "@/lib/server/rate-limit";

const rateLimitTsPath = join(dirname(fileURLToPath(import.meta.url)), "rate-limit.ts");

describe("enforceApiRateLimit path classification", () => {
  it("skips proxy RL for POST /api/signup so only the signup route bucket applies", () => {
    const src = readFileSync(rateLimitTsPath, "utf8");
    assert.match(src, /API_SIGNUP_POST_ROUTE/);
    assert.match(src, /pathname === API_SIGNUP_POST_ROUTE/);
    assert.doesNotMatch(src, /if \(pathname === "\/api\/signup"/);
  });

  it("skips proxy RL for POST /api/auth/callback/credentials (authorize handles combo RL + lockout)", () => {
    const src = readFileSync(rateLimitTsPath, "utf8");
    assert.match(src, /\/callback\/credentials/);
    assert.match(src, /PINNED_AUTH_BASE_PATH/);
  });

  it("orders signup bypass before generic public catch-all so POST /api/signup does not debit ratelimit:public:ip", () => {
    const src = readFileSync(rateLimitTsPath, "utf8");
    const fn = src.indexOf("export async function enforceApiRateLimit");
    assert.ok(fn >= 0);
    const idxSignup = src.indexOf("pathname === API_SIGNUP_POST_ROUTE", fn);
    const idxPublic = src.indexOf("`ratelimit:public:ip:${ipKey}`", fn);
    assert.ok(idxSignup > 0 && idxPublic > 0, "expected signup bypass and public catch-all markers");
    assert.ok(idxSignup < idxPublic, "signup bypass must appear before generic public RL");
  });

  it("orders credentials callback bypass before auth strict debit so first login is not blocked by proxy IP bucket", () => {
    const src = readFileSync(rateLimitTsPath, "utf8");
    const fn = src.indexOf("export async function enforceApiRateLimit");
    assert.ok(fn >= 0);
    const idxCred = src.indexOf("callback/credentials", fn);
    const idxAuthStrict = src.indexOf("isAuthStrictPath(pathname)", fn);
    assert.ok(idxCred > 0 && idxAuthStrict > 0, "expected credentials bypass and auth strict markers");
    assert.ok(idxCred < idxAuthStrict, "credentials bypass must appear before auth strict branch");
  });

  it("marks admin API subtree for dedicated RL (nn-db-final-002)", () => {
    assert.equal(isAdminApiRateLimitPath("/api/admin"), true);
    assert.equal(isAdminApiRateLimitPath("/api/admin/ops/run"), true);
    assert.equal(isAdminApiRateLimitPath("/api/administration"), false);
    assert.equal(isAdminApiRateLimitPath("/api/questions"), false);
  });

  it("runs dedicated marketing public content RL branch before shared admin:user debit", () => {
    const src = readFileSync(rateLimitTsPath, "utf8");
    const fn = src.indexOf("export async function enforceApiRateLimit");
    assert.ok(fn >= 0);
    const idxMarketing = src.indexOf("enforceDedicatedAdminMarketingPublicContentRateLimit", fn);
    const idxBlogBatch = src.indexOf("enforceDedicatedAdminBlogBatchRateLimit", fn);
    assert.ok(idxMarketing > 0 && idxBlogBatch > 0);
    assert.ok(idxMarketing < idxBlogBatch, "marketing public content must short-circuit before blog batch RL");
  });

  it("marks billing / checkout + subscribe", () => {
    assert.equal(isBillingRateLimitPath("/api/subscriptions/checkout"), true);
    assert.equal(isBillingRateLimitPath("/api/subscribe"), true);
    assert.equal(isBillingRateLimitPath("/api/subscriptions/webhook"), false);
  });

  it("marks public pricing JSON for dedicated per-IP bucket", () => {
    assert.equal(isPricingRateLimitPath("/api/pricing"), true);
    assert.equal(isPricingRateLimitPath("/api/pricing/options"), true);
    assert.equal(isPricingRateLimitPath("/api/pricing-matrix"), false);
  });

  it("does not classify /api/pricing/options under public_json RL (dedicated pricing branch in proxy)", () => {
    assert.equal(isPublicJsonRateLimitPath("/api/pricing/options"), false);
    assert.equal(isPricingRateLimitPath("/api/pricing/options"), true);
  });

  it("marks anonymous questions/lessons API paths for stricter per-IP bucket", () => {
    assert.equal(isLearnerContentAnonymousApiPath("/api/questions"), true);
    assert.equal(isLearnerContentAnonymousApiPath("/api/questions/discovery"), true);
    assert.equal(isLearnerContentAnonymousApiPath("/api/lessons"), true);
    assert.equal(isLearnerContentAnonymousApiPath("/api/lessons/foo"), true);
    assert.equal(isLearnerContentAnonymousApiPath("/api/public/home-stats"), false);
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

  it("isolates flashcard-tags for stricter cap than generic public_json", () => {
    assert.equal(isPublicFlashcardTagsRateLimitPath("/api/public/flashcard-tags"), true);
    assert.equal(isPublicFlashcardTagsRateLimitPath("/api/public/home-stats"), false);
    assert.equal(isPublicJsonRateLimitPath("/api/public/flashcard-tags"), true);
  });

  it("splits auth kinds for per-route buckets", () => {
    assert.equal(authRouteKind("/api/auth/signin"), "signin");
    assert.equal(authRouteKind("/api/auth/signin/credentials"), "signin");
    assert.equal(authRouteKind("/api/auth/callback/credentials"), "credentials_callback");
    assert.equal(authRouteKind("/api/auth/callback/google"), "callback");
    assert.equal(authRouteKind("/api/auth/forgot-password"), "forgot");
    assert.equal(authRouteKind("/api/auth/reset-password"), "reset");
    assert.equal(authRouteKind("/api/auth/csrf"), "csrf");
  });

  it("exponential Retry-After from streak (capped)", () => {
    assert.equal(retryAfterSecondsFrom429Streak(1), 5);
    assert.equal(retryAfterSecondsFrom429Streak(2), 10);
    assert.equal(retryAfterSecondsFrom429Streak(3), 20);
    assert.equal(retryAfterSecondsFrom429Streak(5), 80);
    assert.equal(retryAfterSecondsFrom429Streak(20), 80);
  });
});
