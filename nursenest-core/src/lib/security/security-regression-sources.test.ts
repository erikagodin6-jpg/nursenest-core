/**
 * Static source assertions for security-sensitive routes (no HTTP, no DB).
 * Complements behavioral tests in pathway-entitlements, json-body-limit, stripe policy, etc.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("security regression (source contracts)", () => {
  it("credentials authorize uses per-IP rate limit and progressive lockout key", () => {
    const auth = readFileSync(join(nursenestCoreRoot, "src", "lib", "auth.ts"), "utf8");
    assert.match(auth, /checkRateLimitUnified\(`login:\$\{ip\}`/);
    assert.match(auth, /login-lock:/);
    assert.match(auth, /isLoginLocked\(/);
  });

  it("forgot-password returns generic success copy (no account enumeration)", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "auth", "forgot-password", "route.ts"),
      "utf8",
    );
    assert.match(src, /If an account exists for that email/);
    assert.match(src, /successPayload/);
  });

  it("reset-password increments credentialVersion and deletes reset tokens on success", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "auth", "reset-password", "route.ts"),
      "utf8",
    );
    assert.match(src, /credentialVersion:\s*\{\s*increment:\s*1\s*\}/);
    assert.match(src, /passwordResetToken\.deleteMany/);
  });

  it("practice test detail GET scopes row by session userId (IDOR guard)", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "practice-tests", "[id]", "route.ts"),
      "utf8",
    );
    assert.match(src, /userId:\s*gate\.userId/);
  });

  it("admin user lookup requires requireAdmin(req)", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "admin", "users", "lookup", "route.ts"),
      "utf8",
    );
    assert.match(src, /requireAdmin\(req\)/);
  });

  it("questions list enforces pageSize cap and skip ceiling", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "questions", "route.ts"), "utf8");
    assert.match(src, /MAX_QUESTION_PAGE_SIZE/);
    assert.match(src, /MAX_QUESTION_LIST_SKIP_ROWS/);
  });

  it("paid content stale cache module documents no entitlements in cache", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "durability", "paid-content-stale-cache.ts"), "utf8");
    assert.match(src, /never entitlements/);
  });

  it("webhook idempotency maps P2002 to duplicate replay success", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "stripe-webhook-idempotency.ts"),
      "utf8",
    );
    assert.match(src, /P2002/);
    assert.match(src, /duplicate/);
  });

  it("Stripe webhook route applies handlers before recording dedupe id", () => {
    const route = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "webhook", "route.ts"),
      "utf8",
    );
    const idxApply = route.indexOf("applyStripeWebhookEvent");
    const idxRecord = route.indexOf("recordStripeWebhookEventProcessed");
    assert.ok(idxApply > 0 && idxRecord > idxApply);
  });
});
