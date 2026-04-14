import test from "node:test";
import assert from "node:assert/strict";
import { SubscriptionStatus } from "@prisma/client";
import { pastDueSinceForStatusTransition } from "./subscription-past-due-since";

test("transition into PAST_DUE sets pastDueSince", () => {
  const p = pastDueSinceForStatusTransition(SubscriptionStatus.PAST_DUE, SubscriptionStatus.ACTIVE);
  assert.ok(p?.pastDueSince instanceof Date);
});

test("stay PAST_DUE does not emit patch", () => {
  assert.equal(pastDueSinceForStatusTransition(SubscriptionStatus.PAST_DUE, SubscriptionStatus.PAST_DUE), undefined);
});

test("leave PAST_DUE clears pastDueSince", () => {
  assert.deepEqual(pastDueSinceForStatusTransition(SubscriptionStatus.ACTIVE, SubscriptionStatus.PAST_DUE), {
    pastDueSince: null,
  });
});
