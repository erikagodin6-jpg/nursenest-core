/**
 * Hermetic contracts: subscription time-window helpers + static wiring that
 * `/app` RSC and subscriber APIs both resolve entitlements via getUserAccess / @/lib/auth.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import {
  activeLikePaidWindowOpen,
  cancelledPaidThroughActive,
  subscriptionRowGrantsPremiumAfterStatus,
} from "@/lib/entitlements/subscription-paid-access";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

describe("entitlements web/mobile gates (contract)", () => {
  it("active subscription with future period end grants paid window", () => {
    const future = new Date(Date.now() + 86_400_000);
    assert.equal(
      activeLikePaidWindowOpen(
        { currentPeriodEnd: future, trialEnd: null },
        Date.now(),
      ),
      true,
    );
    assert.equal(
      subscriptionRowGrantsPremiumAfterStatus(
        { status: SubscriptionStatus.ACTIVE, currentPeriodEnd: future, trialEnd: null },
        Date.now(),
      ),
      true,
    );
  });

  it("active subscription past period end does not grant paid window", () => {
    const past = new Date(Date.now() - 86_400_000);
    assert.equal(
      activeLikePaidWindowOpen(
        { currentPeriodEnd: past, trialEnd: null },
        Date.now(),
      ),
      false,
    );
    assert.equal(
      subscriptionRowGrantsPremiumAfterStatus(
        { status: SubscriptionStatus.ACTIVE, currentPeriodEnd: past, trialEnd: null },
        Date.now(),
      ),
      false,
    );
  });

  it("cancelled subscription grants access only until period end (paid-through)", () => {
    const future = new Date(Date.now() + 86_400_000);
    const past = new Date(Date.now() - 86_400_000);
    assert.equal(
      cancelledPaidThroughActive(
        { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: future, trialEnd: null },
        Date.now(),
      ),
      true,
    );
    assert.equal(
      cancelledPaidThroughActive(
        { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: past, trialEnd: null },
        Date.now(),
      ),
      false,
    );
    assert.equal(
      subscriptionRowGrantsPremiumAfterStatus(
        { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: future, trialEnd: null },
        Date.now(),
      ),
      true,
    );
    assert.equal(
      subscriptionRowGrantsPremiumAfterStatus(
        { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: past, trialEnd: null },
        Date.now(),
      ),
      false,
    );
  });

  it("PAST_DUE row still participates in premium selection logic at helper level", () => {
    assert.equal(
      subscriptionRowGrantsPremiumAfterStatus(
        { status: SubscriptionStatus.PAST_DUE, currentPeriodEnd: null, trialEnd: null },
        Date.now(),
      ),
      true,
    );
  });

  it("resolveEntitlement delegates to getUserAccess", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "entitlements", "resolve-entitlement.ts"), "utf8");
    assert.match(src, /getUserAccess\(/);
  });

  it("resolveEntitlementForPage delegates to resolveEntitlement", () => {
    const src = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "entitlements", "resolve-entitlement-for-page.ts"),
      "utf8",
    );
    assert.match(src, /resolveEntitlement\(/);
  });

  it("requireSubscriberSession deps wire auth from @/lib/auth and getUserAccess", () => {
    const gate = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "entitlements", "require-subscriber-session.ts"),
      "utf8",
    );
    assert.match(gate, /requireSubscriberSessionDeps\.auth\(\)/);
    assert.match(gate, /requireSubscriberSessionDeps\.getUserAccess\(/);
    const deps = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "entitlements", "require-subscriber-session-deps.ts"),
      "utf8",
    );
    assert.match(deps, /import \{ auth \} from "@\/lib\/auth"/);
    assert.match(deps, /import \{ accessScopeFromUserAccess, getUserAccess \} from "@\/lib\/entitlements\/get-user-access"/);
  });

  it("learner app layout resolves entitlements via resolveEntitlementForPage", () => {
    const layout = readFileSync(
      join(nursenestCoreRoot, "src", "app", "(student)", "app", "(learner)", "layout.tsx"),
      "utf8",
    );
    assert.match(layout, /resolveEntitlementForPage\(/);
  });

  it("protected route session defaults to auth from @/lib/auth", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "auth", "protected-route-session.ts"), "utf8");
    assert.match(src, /"@\/lib\/auth"/);
    assert.match(src, /\bauth\(\)/);
  });

  it("getUserAccess core loads subscriptions from Prisma", () => {
    const src = readFileSync(join(nursenestCoreRoot, "src", "lib", "entitlements", "get-user-access.ts"), "utf8");
    assert.match(src, /prisma\.subscription\.findMany/);
    assert.match(src, /isLearnerEntitlementStaffBypassRole/);
  });
});
