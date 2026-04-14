import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { pastDueSubscriptionGrantsPremium } from "./past-due-policy";

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
});
