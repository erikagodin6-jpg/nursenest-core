/**
 * Run: `npm --prefix nursenest-core run audit:paywall-security`
 * Or: `NODE_ENV=test node --import tsx --test src/lib/entitlements/require-subscriber-session.test.ts`
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { CountryCode, TierCode, UserRole } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireSubscriberSession, notSubscribedResponse } from "@/lib/entitlements/require-subscriber-session";
import { requireSubscriberSessionDeps } from "@/lib/entitlements/require-subscriber-session-deps";
import type { UserAccess } from "@/lib/entitlements/user-access-types";

const userId = "usr_sub_gate_test_1";

afterEach(() => {
  mock.restoreAll();
});

function baseUserAccess(over: Partial<UserAccess> & Pick<UserAccess, "hasPremium" | "reason">): UserAccess {
  return {
    userId,
    hasPremium: over.hasPremium,
    reason: over.reason,
    allowedRegion: { country: CountryCode.US, billingRegionSlug: null },
    allowedProfession: { tier: TierCode.RN, alliedCareer: null },
    allowedExam: { pathwayId: null },
    plan: {
      planCode: null,
      duration: null,
      status: over.plan?.status ?? "active",
      expiresAt: over.plan?.expiresAt ?? null,
      cancelAtPeriodEnd: over.plan?.cancelAtPeriodEnd ?? false,
    },
    sessionJwt: { role: UserRole.LEARNER, credentialVersion: 0 },
    ...over,
  };
}

describe("notSubscribedResponse", () => {
  it("returns 403 with stable contract code", async () => {
    const res = notSubscribedResponse();
    assert.equal(res.status, 403);
    const body = (await res.json()) as { code?: string };
    assert.equal(body.code, "not_subscribed");
  });
});

describe("requireSubscriberSession", () => {
  it("returns 401 when there is no session user id", async () => {
    mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "");
    mock.method(requireSubscriberSessionDeps, "auth", async () => null);
    const out = await requireSubscriberSession();
    assert.equal(out.ok, false);
    assert.equal(out.response.status, 401);
    const j = (await out.response.json()) as { code?: string };
    assert.equal(j.code, "unauthorized");
  });

  it("returns ok with entitlement when getUserAccess grants active_subscription", async () => {
    mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "");
    mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
    const ua = baseUserAccess({ hasPremium: true, reason: "active_subscription" });
    mock.method(requireSubscriberSessionDeps, "getUserAccess", async () => ua);
    mock.method(requireSubscriberSessionDeps, "maybeBlockOrTouchAccountSharingAfterSubscriberOk", async () => null);

    const out = await requireSubscriberSession();
    assert.equal(out.ok, true);
    if (out.ok) {
      assert.equal(out.userId, userId);
      assert.equal(out.userAccess.hasPremium, true);
      assert.equal(out.entitlement.hasAccess, true);
      assert.equal(out.entitlement.reason, "active_subscription");
    }
  });

  it("returns 403 not_subscribed when subscription lapsed (no_access)", async () => {
    mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "");
    mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
    mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
      baseUserAccess({
        hasPremium: false,
        reason: "no_access",
        plan: { planCode: null, duration: null, status: "canceled", expiresAt: new Date("2020-01-01"), cancelAtPeriodEnd: false },
      }),
    );

    const out = await requireSubscriberSession();
    assert.equal(out.ok, false);
    assert.equal(out.response.status, 403);
    const j = (await out.response.json()) as { code?: string };
    assert.equal(j.code, "not_subscribed");
  });

  it("staff admin_override passes the gate same as paid subscriber", async () => {
    mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "");
    mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
    mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
      baseUserAccess({
        hasPremium: true,
        reason: "admin_override",
        sessionJwt: { role: UserRole.ADMIN, credentialVersion: 1 },
      }),
    );
    mock.method(requireSubscriberSessionDeps, "maybeBlockOrTouchAccountSharingAfterSubscriberOk", async () => null);

    const out = await requireSubscriberSession();
    assert.equal(out.ok, true);
    if (out.ok) assert.equal(out.entitlement.reason, "admin_override");
  });

  it("returns 503 when getUserAccess throws (parity with API verify-failed path)", async () => {
    mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "");
    mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
    mock.method(requireSubscriberSessionDeps, "getUserAccess", async () => {
      throw new Error("simulated db failure");
    });

    const out = await requireSubscriberSession();
    assert.equal(out.ok, false);
    assert.equal(out.response.status, 503);
    const j = (await out.response.json()) as { code?: string };
    assert.equal(j.code, "access_verify_failed");
  });

  it("returns blocking response when account-sharing guard returns a response", async () => {
    mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "");
    mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
    mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
      baseUserAccess({ hasPremium: true, reason: "active_subscription" }),
    );
    const block = NextResponse.json({ code: "blocked" }, { status: 429 });
    mock.method(requireSubscriberSessionDeps, "maybeBlockOrTouchAccountSharingAfterSubscriberOk", async () => block);

    const out = await requireSubscriberSession();
    assert.equal(out.ok, false);
    assert.equal(out.response.status, 429);
  });
});
