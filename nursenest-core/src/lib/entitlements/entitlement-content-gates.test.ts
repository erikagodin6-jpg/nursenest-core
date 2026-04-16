/**
 * Server-side tier/region gates for premium content — no DB; encodes “wrong country / wrong tier” behavior.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ContentStatus, CountryCode, TierCode } from "@prisma/client";
import {
  lessonAccessWhere,
  questionAccessWhere,
  userCanAccessExam,
} from "@/lib/entitlements/content-access-scope";
import type { AccessScope } from "@/lib/entitlements/user-access-types";

function scope(partial: Partial<AccessScope> & Pick<AccessScope, "hasAccess" | "reason">): AccessScope {
  return {
    hasAccess: partial.hasAccess,
    reason: partial.reason,
    tier: partial.tier === undefined ? TierCode.RN : partial.tier,
    /** Avoid `??` so explicit `null` country is preserved (ambiguous region → deny). */
    country: partial.country === undefined ? CountryCode.US : partial.country,
    alliedCareer: partial.alliedCareer === undefined ? null : partial.alliedCareer,
  };
}

describe("questionAccessWhere + userCanAccessExam (paid learner)", () => {
  const activePaid = scope({
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: CountryCode.US,
  });

  it("active paid user: clause includes tier ladder and region", () => {
    const w = questionAccessWhere(activePaid) as { tier?: { in: string[] }; OR?: unknown[] };
    assert.ok(Array.isArray(w.tier?.in));
    assert.ok(w.tier!.in.includes("rn"));
    assert.ok(Array.isArray(w.OR));
  });

  it("wrong country: same tier but exam in other country → denied", () => {
    assert.equal(
      userCanAccessExam(activePaid, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.CA,
        tier: TierCode.RN,
      }),
      false,
    );
  });

  it("wrong tier: RN entitlement cannot access NP-only exam in same country", () => {
    assert.equal(
      userCanAccessExam(activePaid, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.US,
        tier: TierCode.NP,
      }),
      false,
    );
  });

  it("correct tier depth: RN user can access RN exam US", () => {
    assert.equal(
      userCanAccessExam(activePaid, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.US,
        tier: TierCode.RN,
      }),
      true,
    );
  });

  it("deny by default: premium reason but null country → no rows", () => {
    const ambiguous = scope({
      hasAccess: true,
      reason: "active_subscription",
      tier: TierCode.RN,
      country: null,
    });
    const w = questionAccessWhere(ambiguous) as { id?: { in: string[] } };
    assert.deepEqual(w.id, { in: [] });
  });

  it("no_access → empty question filter", () => {
    const w = questionAccessWhere(
      scope({ hasAccess: false, reason: "no_access", tier: TierCode.RN, country: CountryCode.US }),
    ) as { id?: { in: string[] } };
    assert.deepEqual(w.id, { in: [] });
  });
});

describe("lessonAccessWhere", () => {
  it("denies lessons when country is null (ambiguous region)", () => {
    const w = lessonAccessWhere(
      scope({
        hasAccess: true,
        reason: "active_subscription",
        tier: TierCode.RN,
        country: null,
      }),
    ) as { id?: { in: string[] } };
    assert.deepEqual(w.id, { in: [] });
  });
});

describe("admin_override (staff learner entitlement)", () => {
  const adminScope = scope({
    hasAccess: true,
    reason: "admin_override",
    tier: TierCode.RN,
    country: CountryCode.US,
  });

  it("staff bypass: can read NP exam in same country (tier not subscription-limited)", () => {
    assert.equal(
      userCanAccessExam(adminScope, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.US,
        tier: TierCode.NP,
      }),
      true,
    );
  });

  it("staff bypass: still denied across country mismatch", () => {
    assert.equal(
      userCanAccessExam(adminScope, {
        status: ContentStatus.PUBLISHED,
        country: CountryCode.CA,
        tier: TierCode.RN,
      }),
      false,
    );
  });
});
