import assert from "node:assert/strict";
import { describe, it, beforeEach, afterEach } from "node:test";
import {
  pastDueGraceWindowEndMs,
  pastDueSubscriptionGrantsPremium,
  readPastDueGraceDays,
} from "./past-due-policy";

describe("pastDueSubscriptionGrantsPremium", () => {
  const base = new Date("2026-01-10T12:00:00.000Z");
  const periodEnd = new Date("2026-02-10T12:00:00.000Z");

  it("strict never grants", () => {
    assert.equal(
      pastDueSubscriptionGrantsPremium(
        "strict",
        { updatedAt: base, currentPeriodEnd: periodEnd },
        base.getTime(),
      ),
      false,
    );
  });

  it("grace grants within window before period end", () => {
    assert.equal(
      pastDueSubscriptionGrantsPremium(
        "grace",
        { updatedAt: base, currentPeriodEnd: periodEnd },
        base.getTime() + 2 * 86_400_000,
      ),
      true,
    );
  });

  it("grace ends at currentPeriodEnd when earlier than updatedAt + days", () => {
    const end = new Date(base.getTime() + 3 * 86_400_000);
    assert.equal(
      pastDueSubscriptionGrantsPremium("grace", { updatedAt: base, currentPeriodEnd: end }, end.getTime()),
      true,
    );
    assert.equal(
      pastDueSubscriptionGrantsPremium("grace", { updatedAt: base, currentPeriodEnd: end }, end.getTime() + 1),
      false,
    );
  });

  it("pastDueSince anchors grace; fresh updatedAt does not extend window", () => {
    const pastDueSince = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-25T00:00:00.000Z");
    const period = new Date("2026-03-01T00:00:00.000Z");
    const graceDays = 7;
    const endFromSince = pastDueGraceWindowEndMs(
      { updatedAt, currentPeriodEnd: period, pastDueSince },
      graceDays,
    );
    const endFromUpdatedOnly = pastDueGraceWindowEndMs({ updatedAt, currentPeriodEnd: period, pastDueSince: null }, graceDays);
    assert.ok(endFromSince < endFromUpdatedOnly);
    assert.equal(
      pastDueSubscriptionGrantsPremium("grace", { updatedAt, currentPeriodEnd: period, pastDueSince }, endFromSince),
      true,
    );
    assert.equal(
      pastDueSubscriptionGrantsPremium("grace", { updatedAt, currentPeriodEnd: period, pastDueSince }, endFromSince + 1),
      false,
    );
  });

  it("null currentPeriodEnd uses only anchor + grace days", () => {
    const anchor = new Date("2026-01-01T00:00:00.000Z");
    const updatedAt = new Date("2026-01-05T00:00:00.000Z");
    const end = pastDueGraceWindowEndMs(
      { updatedAt, currentPeriodEnd: null, pastDueSince: anchor },
      readPastDueGraceDays(),
    );
    assert.equal(
      pastDueSubscriptionGrantsPremium(
        "grace",
        { updatedAt, currentPeriodEnd: null, pastDueSince: anchor },
        end,
      ),
      true,
    );
    assert.equal(
      pastDueSubscriptionGrantsPremium(
        "grace",
        { updatedAt, currentPeriodEnd: null, pastDueSince: anchor },
        end + 1,
      ),
      false,
    );
  });
});

describe("readPastDueGraceDays with env", () => {
  const key = "ENTITLEMENT_PAST_DUE_GRACE_DAYS";
  let prev: string | undefined;

  beforeEach(() => {
    prev = process.env[key];
  });

  afterEach(() => {
    if (prev === undefined) delete process.env[key];
    else process.env[key] = prev;
  });

  it("respects ENTITLEMENT_PAST_DUE_GRACE_DAYS when set", () => {
    process.env[key] = "3";
    assert.equal(readPastDueGraceDays(), 3);
  });
});
