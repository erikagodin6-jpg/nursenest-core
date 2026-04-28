import assert from "node:assert/strict";
import test from "node:test";
import { SubscriptionStatus } from "@prisma/client";
import {
  activeLikePaidWindowOpen,
  cancelledPaidThroughActive,
  mergeSubscriptionCurrentPeriodEnds,
  subscriptionEntitlementEndMs,
  subscriptionRowGrantsPremiumAfterStatus,
} from "@/lib/entitlements/subscription-paid-access";

const future = new Date("2099-06-15T00:00:00.000Z");
const past = new Date("2020-01-01T00:00:00.000Z");
const now = new Date("2025-06-01T00:00:00.000Z").getTime();

test("entitlement end is max of period and trial", () => {
  const trialLater = new Date("2099-07-01T00:00:00.000Z");
  assert.equal(
    subscriptionEntitlementEndMs({ currentPeriodEnd: future, trialEnd: trialLater }),
    trialLater.getTime(),
  );
});

test("ACTIVE with future period — paid window open", () => {
  assert.equal(activeLikePaidWindowOpen({ currentPeriodEnd: future, trialEnd: null }, now), true);
});

test("ACTIVE with past period — paid window closed", () => {
  assert.equal(activeLikePaidWindowOpen({ currentPeriodEnd: past, trialEnd: null }, now), false);
});

test("ACTIVE with null anchors — window open (sync gap)", () => {
  assert.equal(activeLikePaidWindowOpen({ currentPeriodEnd: null, trialEnd: null }, now), true);
});

test("CANCELLED with future period — paid through", () => {
  assert.equal(
    cancelledPaidThroughActive(
      { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: future, trialEnd: null },
      now,
    ),
    true,
  );
});

test("CANCELLED with past period — no paid through", () => {
  assert.equal(
    cancelledPaidThroughActive(
      { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: past, trialEnd: null },
      now,
    ),
    false,
  );
});

test("CANCELLED with no end — no paid through", () => {
  assert.equal(
    cancelledPaidThroughActive(
      { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: null, trialEnd: null },
      now,
    ),
    false,
  );
});

test("mergeSubscriptionCurrentPeriodEnds picks later date", () => {
  const a = new Date("2025-01-01T00:00:00.000Z");
  const b = new Date("2026-01-01T00:00:00.000Z");
  const m = mergeSubscriptionCurrentPeriodEnds(a, b);
  assert.equal(m?.toISOString(), b.toISOString());
});

test("subscriptionRowGrantsPremiumAfterStatus: PAST_DUE passes row gate", () => {
  assert.equal(
    subscriptionRowGrantsPremiumAfterStatus(
      { status: SubscriptionStatus.PAST_DUE, currentPeriodEnd: past, trialEnd: null },
      now,
    ),
    true,
  );
});

test("subscriptionRowGrantsPremiumAfterStatus: CANCELLED uses period end", () => {
  assert.equal(
    subscriptionRowGrantsPremiumAfterStatus(
      { status: SubscriptionStatus.CANCELLED, currentPeriodEnd: future, trialEnd: null },
      now,
    ),
    true,
  );
});
