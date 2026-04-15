/**
 * Static + pure checks for server-side entitlement enforcement, stale-cache scoping, and admin RBAC.
 * Does not use Prisma or Next runtime.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { subscriberQuestionsListStaleKey } from "@/lib/durability/questions-list-stale-key";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("authorization & entitlement policy (static)", () => {
  it("stale fallback keys for question lists are scoped per user id", () => {
    const u1 = "user_cuid_111111111111";
    const u2 = "user_cuid_222222222222";
    const sp = new URLSearchParams({ page: "1" });
    const k1 = subscriberQuestionsListStaleKey(u1, sp);
    const k2 = subscriberQuestionsListStaleKey(u2, sp);
    assert.ok(k1.includes(u1));
    assert.ok(k2.includes(u2));
    assert.notEqual(k1, k2);
  });

  it("requireSubscriberSession denies when hasAccess is false (source contract)", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "entitlements", "require-subscriber-session.ts"),
      "utf8",
    );
    assert.match(src, /!entitlement\.hasAccess/);
    assert.match(src, /notSubscribedResponse/);
  });

  it("getUserAccess is DB-backed for subscriptions (not JWT tier alone)", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "entitlements", "get-user-access.ts"), "utf8");
    assert.match(src, /getUserAccessCore/);
    assert.match(src, /prisma\.subscription\.findMany/);
  });

  it("staff-session for admin APIs uses DB role, not client-supplied tier", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "auth", "staff-session.ts"), "utf8");
    assert.match(src, /prisma\.user\.findUnique/);
    assert.match(src, /isStaffRole/);
  });

  it("admin path policy constrains support vs content vs super", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "auth", "admin-path-policy.ts"), "utf8");
    assert.match(src, /tier === "support"/);
    assert.match(src, /tier === "content"/);
    assert.match(src, /SUPER_ONLY_PREFIXES/);
  });

  it("generative AI learner routes use requireSubscriberSession", () => {
    const coach = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "coach", "route.ts"), "utf8");
    assert.match(coach, /requireSubscriberSession/);
    const plan = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "ai", "study-plan", "generate", "route.ts"),
      "utf8",
    );
    assert.match(plan, /requireSubscriberSession/);
  });

  it("cron routes use shared enforceCronSecretOrResponse", () => {
    for (const name of ["jobs", "blog-publish", "stripe-reconcile", "blog-batch-schedule", "content-completion"]) {
      const src = readFileSync(join(nursenestCoreRoot, "src", "app", "api", "cron", name, "route.ts"), "utf8");
      assert.match(src, /enforceCronSecretOrResponse/, `cron ${name} imports shared guard`);
    }
  });

  it("paid content stale cache documents entitlement separation", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "durability", "paid-content-stale-cache.ts"),
      "utf8",
    );
    assert.match(src, /never entitlements/);
  });

  it("admin audit log avoids importing ensure-admin (no circular deps)", () => {
    const audit = readFileSync(join(nursenestCoreRoot, "src", "lib", "admin", "admin-audit-log.ts"), "utf8");
    assert.ok(!audit.includes("ensure-admin"), "audit should use admin-types only");
    assert.match(audit, /admin-types/);
  });

  it("admin user lookup and support routes pass req into requireAdmin for RBAC path", () => {
    const lookup = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "admin", "users", "lookup", "route.ts"),
      "utf8",
    );
    assert.match(lookup, /requireAdmin\(req\)/);
    const support = readFileSync(
      join(nursenestCoreRoot, "src", "app", "api", "admin", "users", "[userId]", "support", "route.ts"),
      "utf8",
    );
    assert.match(support, /requireAdmin\(req\)/);
  });
});
