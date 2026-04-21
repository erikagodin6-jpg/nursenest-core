/**
 * Static source assertions for security-sensitive routes (no HTTP, no DB).
 * Complements behavioral tests in pathway-entitlements, json-body-limit, stripe policy, etc.
 */
import assert from "node:assert/strict";
import { execSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("security regression (source contracts)", () => {
  it("credentials authorize wires combo-only Redis failure limits + progressive lockout key", () => {
    const auth = readFileSync(join(nursenestCoreRoot, "src", "lib", "auth.ts"), "utf8");
    const rl = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "server", "credentials-login-rate-limit.ts"),
      "utf8",
    );
    assert.match(rl, /isCredentialsLoginRateLimited/);
    assert.match(auth, /consumeCredentialsLoginFailure/);
    assert.match(auth, /resetCredentialsLoginRateLimitKeys/);
    assert.match(auth, /login-lock:/);
    assert.match(auth, /isLoginLocked\(/);
    assert.match(rl, /no longer uses a per-IP-only/);
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

  it("signup route uses the same distributed key as API_SIGNUP_PER_IP_RATE_LIMIT (no duplicate proxy bucket)", () => {
    const signup = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "signup", "route.ts"), "utf8");
    assert.match(signup, /API_SIGNUP_PER_IP_RATE_LIMIT\.rateLimitKeyForIp/);
    const rl = readFileSync(join(nursenestCoreRoot, "src", "lib", "server", "rate-limit.ts"), "utf8");
    assert.match(rl, /ratelimit:signup:ip:/);
    assert.doesNotMatch(
      readFileSync(join(nursenestCoreRoot, "src", "lib", "server", "rate-limit.ts"), "utf8"),
      /if \(pathname === "\/api\/signup"/,
      "signup should not be rate-limited twice in proxy and route",
    );
  });

  it("RATE_LIMIT_STORE=memory cannot silently disable Postgres buckets in production when DATABASE_URL is set", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "http", "rate-limit-store-resolve.ts"),
      "utf8",
    );
    assert.match(src, /NN_RATE_LIMIT_ALLOW_MEMORY_IN_PRODUCTION/);
    assert.match(src, /rate_limit_store_memory_ignored_in_production/);
  });

  it("unified rate limit fails closed in production when Postgres path throws", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "http", "rate-limit-unified.ts"),
      "utf8",
    );
    assert.match(src, /NODE_ENV === "production"/);
    assert.match(src, /logRateLimitPgUnavailableOnce/);
    assert.match(src, /return \{ ok: false, remaining: 0 \}/);
    assert.match(src, /getInMemoryRateLimitStoreSingleton\(\)\.check/);
  });

  it("unified meta read fails closed in production when Postgres is unavailable", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "http", "rate-limit-unified.ts"),
      "utf8",
    );
    assert.match(src, /readRateLimitWindowCountUnified/);
    assert.match(src, /rate_limit_meta_read_degraded/);
    assert.match(src, /fail_closed_count_max/);
  });

  it("Postgres RL check() binds prisma before $transaction", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "http", "rate-limit-distributed.ts"),
      "utf8",
    );
    const checkIdx = src.indexOf("async check(");
    assert.ok(checkIdx >= 0);
    const checkBlock = src.slice(checkIdx, checkIdx + 400);
    assert.match(checkBlock, /const prisma = await getPrisma\(\)/);
    assert.match(checkBlock, /\$transaction/);
  });

  it("global API RL uses shared store for 429 streak + abuse strike (not process-local Maps)", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "server", "rate-limit.ts"), "utf8");
    assert.match(src, /consumeRateLimitUnified\(/);
    assert.match(src, /readRateLimitWindowCountUnified\(/);
    assert.match(src, /ratelimit:meta:429_streak:ip:/);
    assert.match(src, /ratelimit:meta:abuse_strike:ip:/);
  });

  it("legacy blog generator admin APIs use dedicated Postgres RL keys (not only shared admin user bucket)", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "server", "rate-limit.ts"), "utf8");
    assert.match(src, /ratelimit:admin:legacy_blog:/);
    assert.match(src, /admin_legacy_blog_tooling/);
  });

  it("admin blog library and schedulers use dedicated blog_content rate limit keys", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "server", "rate-limit.ts"), "utf8");
    assert.match(src, /ratelimit:admin:blog_content:/);
    assert.match(src, /admin_blog_content/);
  });

  it("admin blog generation jobs API uses dedicated rate limit keys and requireAdmin", () => {
    const rl = readFileSync(join(nursenestCoreRoot, "src", "lib", "server", "rate-limit.ts"), "utf8");
    assert.match(rl, /ratelimit:admin:blog_generation_jobs:/);
    assert.match(rl, /admin_blog_generation_jobs/);
    const jobs = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "admin", "blog", "generation-jobs", "route.ts"),
      "utf8",
    );
    assert.match(jobs, /requireAdmin\(req\)/);
  });

  it("admin/debug API routes do not use requireAdmin(_req)", () => {
    const out = execSync(
      `cd "${nursenestCoreRoot}" && (rg -l 'requireAdmin\\(_req\\)' src/app/api/admin src/app/api/debug 2>/dev/null || true)`,
      { encoding: "utf8" },
    ).trim();
    assert.equal(out, "", "use requireAdmin(req) so RBAC sees the invoked URL");
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

  it("Stripe webhook route claims dedupe id before applyStripeWebhookEvent", () => {
    const route = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "subscriptions", "webhook", "route.ts"),
      "utf8",
    );
    const idxClaim = route.indexOf("await claimStripeWebhookEventOrDuplicate");
    const idxApply = route.indexOf("await applyStripeWebhookEvent");
    assert.ok(idxClaim > 0 && idxApply > idxClaim);
  });
});
