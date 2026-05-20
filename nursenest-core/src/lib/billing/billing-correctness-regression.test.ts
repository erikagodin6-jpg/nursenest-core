/**
 * High-value billing / entitlement regressions — pure functions + static contracts (no Stripe HTTP, no DB).
 *
 * Complements: `entitlement-content-gates.test.ts`, `stripe-webhook-policy.test.ts`, e2e paid flows.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import { ContentStatus, CountryCode, SubscriptionStatus, TierCode, TrialStatus, UserRole } from "@prisma/client";
import { inferPremiumEligibleFromSubscriptionRow } from "@/lib/observability/billing-entitlement-audit";
import {
  userCanAccessExam,
  questionAccessWhere,
} from "@/lib/entitlements/content-access-scope";
import type { AccessScope, UserAccess } from "@/lib/entitlements/user-access-types";
import { deriveBillingSurface } from "@/lib/learner/derive-billing-page-surface";
import type { BillingSubscriptionRow, BillingUserRow } from "@/lib/learner/billing-page-payload-types";
import { pastDueSubscriptionGrantsPremium } from "@/lib/entitlements/past-due-policy";
import { subscriptionStatusForSession } from "@/lib/entitlements/subscription-session-status";
import { effectiveTierCountryForAccess } from "@/lib/entitlements/subscription-plan";
import {
  mapStripeSubscriptionStatus,
  isHighRiskDbActiveStripeEndedOrPaused,
} from "@/lib/stripe/stripe-subscription-field-map";

const here = dirname(fileURLToPath(import.meta.url));
const nursenestCoreRoot = join(here, "..", "..", "..");

/** Local copy of {@link accessScopeFromUserAccess} — avoids importing `get-user-access` (Prisma chain) in tests. */
function accessScopeFromUserAccess(ua: UserAccess): AccessScope {
  return {
    hasAccess: ua.hasPremium,
    reason: ua.reason,
    tier: ua.allowedProfession.tier,
    country: ua.allowedRegion.country,
    alliedCareer: ua.allowedProfession.alliedCareer,
  };
}

function billingUser(over: Partial<BillingUserRow> = {}): BillingUserRow {
  return {
    tier: TierCode.RN,
    country: "US",
    role: UserRole.LEARNER,
    trialStatus: TrialStatus.NONE,
    trialEndsAt: null,
    trialStartedAt: null,
    learnerPath: null,
    passwordHash: null,
    ...over,
  };
}

function billingSub(
  status: SubscriptionStatus,
  opts: { cancelAtPeriodEnd?: boolean } = {},
): BillingSubscriptionRow {
  return {
    status,
    stripeSubscriptionId: "sub_test",
    stripeCustomerId: "cus_test",
    planTier: TierCode.RN,
    planCountry: CountryCode.US,
    alliedCareer: null,
    cancelAtPeriodEnd: opts.cancelAtPeriodEnd ?? false,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
  };
}

function ua(partial: Partial<UserAccess> & Pick<UserAccess, "hasPremium" | "reason">): UserAccess {
  const tier = partial.allowedProfession?.tier ?? TierCode.RN;
  const country = partial.allowedRegion?.country ?? CountryCode.US;
  return {
    userId: partial.userId ?? "u_test",
    hasPremium: partial.hasPremium,
    reason: partial.reason,
    allowedRegion: partial.allowedRegion ?? { country, billingRegionSlug: null },
    allowedProfession: partial.allowedProfession ?? {
      tier,
      alliedCareer: partial.allowedProfession?.alliedCareer ?? null,
    },
    allowedExam: partial.allowedExam ?? { pathwayId: null },
    plan:
      partial.plan ??
      ({
        planCode: null,
        duration: null,
        status: "active",
        expiresAt: null,
        cancelAtPeriodEnd: false,
      } as UserAccess["plan"]),
  };
}

describe("billing correctness — paid access vs UI surfaces", () => {
  it("valid paid user (active_subscription) maps to premium scope and billing active_paid", () => {
    const access = ua({
      hasPremium: true,
      reason: "active_subscription",
      allowedProfession: { tier: TierCode.RN, alliedCareer: null },
      allowedRegion: { country: CountryCode.US, billingRegionSlug: null },
    });
    const scope = accessScopeFromUserAccess(access);
    assert.equal(scope.hasAccess, true);
    assert.equal(scope.reason, "active_subscription");
    assert.equal(
      deriveBillingSurface({
        user: billingUser(),
        subscription: billingSub(SubscriptionStatus.ACTIVE),
        hasAccess: true,
        entitlementReason: "active_subscription",
        trialEndsAt: null,
      }),
      "active_paid",
    );
  });

  it("checkout success alone / missing webhook mirror: no subscription row + no access → inactive (trusted DB state required)", () => {
    assert.equal(
      deriveBillingSurface({
        user: billingUser(),
        subscription: null,
        hasAccess: false,
        entitlementReason: "no_access",
        trialEndsAt: null,
      }),
      "inactive",
    );
  });

  it("canceled-at-period-end: still ACTIVE row + access → active_scheduled_cancel (not cancelled banner)", () => {
    assert.equal(
      deriveBillingSurface({
        user: billingUser(),
        subscription: billingSub(SubscriptionStatus.ACTIVE, { cancelAtPeriodEnd: true }),
        hasAccess: true,
        entitlementReason: "active_subscription",
        trialEndsAt: null,
      }),
      "active_scheduled_cancel",
    );
  });

  it("expired / ended subscription: CANCELLED row → cancelled surface", () => {
    assert.equal(
      deriveBillingSurface({
        user: billingUser(),
        subscription: billingSub(SubscriptionStatus.CANCELLED),
        hasAccess: false,
        entitlementReason: "no_access",
        trialEndsAt: null,
      }),
      "cancelled",
    );
  });

  it("payment failure: PAST_DUE without grace entitlement → past_due surface", () => {
    assert.equal(
      deriveBillingSurface({
        user: billingUser(),
        subscription: billingSub(SubscriptionStatus.PAST_DUE),
        hasAccess: false,
        entitlementReason: "no_access",
        trialEndsAt: null,
      }),
      "past_due",
    );
  });
});

describe("billing correctness — subscription session + premium rows", () => {
  it("subscriptionStatusForSession: paid active_subscription → active", () => {
    assert.equal(
      subscriptionStatusForSession(
        ua({
          hasPremium: true,
          reason: "active_subscription",
          plan: {
            planCode: null,
            duration: null,
            status: "active",
            expiresAt: null,
            cancelAtPeriodEnd: false,
          },
        }),
      ),
      "active",
    );
  });

  it("expired subscription loses access: no_access → session none", () => {
    assert.equal(
      subscriptionStatusForSession(
        ua({
          hasPremium: false,
          reason: "no_access",
          plan: {
            planCode: null,
            duration: null,
            status: "canceled",
            expiresAt: new Date("2020-01-01"),
            cancelAtPeriodEnd: false,
          },
        }),
      ),
      "none",
    );
  });
});

describe("billing correctness — wrong region / wrong tier (plan snapshot vs content)", () => {
  it("wrong-country plan: effective region from subscription blocks other-country exam", () => {
    const effective = effectiveTierCountryForAccess(
      { tier: TierCode.RN, country: CountryCode.US },
      { planTier: TierCode.RN, planCountry: CountryCode.CA },
    );
    assert.equal(effective.country, CountryCode.CA);
    const scope = accessScopeFromUserAccess(
      ua({
        hasPremium: true,
        reason: "active_subscription",
        allowedRegion: { country: effective.country, billingRegionSlug: null },
        allowedProfession: { tier: effective.tier, alliedCareer: null },
      }),
    );
    assert.equal(
      userCanAccessExam(scope, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.US,
        tier: TierCode.RN,
      }),
      false,
    );
  });

  it("wrong-tier plan: purchased RN cannot access NP-only exam in same country", () => {
    const effective = effectiveTierCountryForAccess(
      { tier: TierCode.NP, country: CountryCode.US },
      { planTier: TierCode.RN, planCountry: CountryCode.US },
    );
    assert.equal(effective.tier, TierCode.RN);
    const scope = accessScopeFromUserAccess(
      ua({
        hasPremium: true,
        reason: "active_subscription",
        allowedRegion: { country: CountryCode.US, billingRegionSlug: null },
        allowedProfession: { tier: effective.tier, alliedCareer: null },
      }),
    );
    assert.equal(
      userCanAccessExam(scope, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.US,
        tier: TierCode.NP,
      }),
      false,
    );
  });

  it("no premium → question filter empty", () => {
    const scope = accessScopeFromUserAccess(
      ua({ hasPremium: false, reason: "no_access", allowedProfession: { tier: TierCode.RN, alliedCareer: null } }),
    );
    const w = questionAccessWhere(scope) as { id?: { in: string[] } };
    assert.deepEqual(w.id, { in: [] });
  });
});

describe("billing correctness — manual (staff) override", () => {
  it("admin_override scope allows higher pathway tier in same country (explicit product behavior)", () => {
    const scope = accessScopeFromUserAccess(
      ua({
        hasPremium: true,
        reason: "admin_override",
        allowedProfession: { tier: TierCode.RN, alliedCareer: null },
        allowedRegion: { country: CountryCode.US, billingRegionSlug: null },
      }),
    );
    assert.equal(scope.reason, "admin_override");
    assert.equal(
      userCanAccessExam(scope, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.US,
        tier: TierCode.NP,
      }),
      true,
    );
  });

  it("admin_override still denied on country mismatch", () => {
    const scope = accessScopeFromUserAccess(
      ua({
        hasPremium: true,
        reason: "admin_override",
        allowedProfession: { tier: TierCode.RN, alliedCareer: null },
        allowedRegion: { country: CountryCode.US, billingRegionSlug: null },
      }),
    );
    assert.equal(
      userCanAccessExam(scope, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.CA,
        tier: TierCode.RN,
      }),
      false,
    );
  });

  it("billing UI: staff role → admin surface (not subscription emulation)", () => {
    assert.equal(
      deriveBillingSurface({
        user: billingUser({ role: UserRole.SUPPORT_ADMIN }),
        subscription: null,
        hasAccess: true,
        entitlementReason: "admin_override",
        trialEndsAt: null,
      }),
      "admin",
    );
  });
});

describe("billing correctness — Stripe status mapping & ordering safety", () => {
  it("duplicate logical mapping: same Stripe status always maps to same DB enum", () => {
    assert.equal(mapStripeSubscriptionStatus("active"), SubscriptionStatus.ACTIVE);
    assert.equal(mapStripeSubscriptionStatus("active"), SubscriptionStatus.ACTIVE);
  });

  it("out-of-order safe: incomplete maps to null (handler must not clobber ACTIVE with uncertain state)", () => {
    assert.equal(mapStripeSubscriptionStatus("incomplete"), null);
  });

  it("payment failure path: past_due maps to PAST_DUE", () => {
    assert.equal(mapStripeSubscriptionStatus("past_due"), SubscriptionStatus.PAST_DUE);
  });

  it("reconciliation signal: DB active-like + Stripe canceled is high-risk drift", () => {
    assert.equal(isHighRiskDbActiveStripeEndedOrPaused(SubscriptionStatus.ACTIVE, "canceled"), true);
  });
});

describe("billing correctness — row-level premium eligibility (reconciliation / audits)", () => {
  const fresh = new Date("2026-06-01T12:00:00.000Z");

  it("reconciliation repairs align with eligibility: ACTIVE grants premium row", () => {
    assert.equal(
      inferPremiumEligibleFromSubscriptionRow({
        status: SubscriptionStatus.ACTIVE,
        updatedAt: fresh,
        currentPeriodEnd: null,
        pastDueSince: null,
      }),
      true,
    );
  });

  it("CANCELLED row does not grant premium (expired / ended)", () => {
    assert.equal(
      inferPremiumEligibleFromSubscriptionRow({
        status: SubscriptionStatus.CANCELLED,
        updatedAt: fresh,
        currentPeriodEnd: null,
        pastDueSince: null,
      }),
      false,
    );
  });

  it("strict past_due policy: payment failure does not grant premium via past-due helper", () => {
    assert.equal(
      pastDueSubscriptionGrantsPremium("strict", {
        updatedAt: fresh,
        currentPeriodEnd: new Date("2026-12-01T00:00:00.000Z"),
        pastDueSince: fresh,
      }),
      false,
    );
  });
});

describe("billing correctness — static contracts (webhook dedup & trust boundaries)", () => {
  it("webhook idempotency: claim uses primary key insert (duplicate → P2002 / duplicate path)", () => {
    const idem = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "stripe-webhook-idempotency.ts"),
      "utf8",
    );
    assert.match(idem, /stripeWebhookEvent\.create/);
    assert.match(idem, /P2002/);
    assert.match(idem, /"duplicate"/);
  });

  it("entitlements are DB-backed (comment contract): not from client query params or redirect alone", () => {
    const apply = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"),
      "utf8",
    );
    assert.match(apply, /never from client query params or redirect URLs/);
  });

  it("invoice handler skips payment success path when row already CANCELLED", () => {
    const apply = readFileSync(
      join(nursenestCoreRoot, "src", "lib", "stripe", "apply-stripe-webhook-event.ts"),
      "utf8",
    );
    assert.match(apply, /row\.status === SubscriptionStatus\.CANCELLED/);
  });
});
