/**
 * Hermetic: native-style clients reuse the same Next route handlers as the web app;
 * session is transported via Cookie (e.g. Auth.js session cookies), not a separate mobile billing path.
 *
 * Run: `npm --prefix nursenest-core run test:unit:mobile-subscriber-api`
 * Or: `NODE_ENV=test node --import tsx --test src/lib/entitlements/mobile-style-subscriber-api.contract.test.ts`
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { CountryCode, TierCode, UserRole } from "@prisma/client";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { GET as getCommandCenter } from "@/app/api/learner/command-center/route";
import { GET as getFlashcardsDueSummary } from "@/app/api/flashcards/due-summary/route";
import { prisma } from "@/lib/db";
import { requireSubscriberSessionDeps } from "@/lib/entitlements/require-subscriber-session-deps";
import type { UserAccess } from "@/lib/entitlements/user-access-types";

const userId = "usr_mobile_style_contract_1";

/** Cookie patterns Auth.js / NextAuth use in browsers and in native shells that attach the same jar to fetch(). */
function mobileStyleSessionRequest(url: string): Request {
  return new Request(url, {
    method: "GET",
    headers: {
      Cookie: "__Secure-authjs.session-token=mock.jwt; Path=/; HttpOnly; Secure",
      Accept: "application/json",
    },
  });
}

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

function wireSubscriberDeps() {
  mock.method(requireSubscriberSessionDeps, "correlationIdFromHeaders", async () => "corr-mobile-contract");
  mock.method(requireSubscriberSessionDeps, "maybeBlockOrTouchAccountSharingAfterSubscriberOk", async () => null);
}

describe("mobile-style subscriber API (contract)", () => {
  it("Request carries Cookie header like a native shell reusing the website session jar", () => {
    const req = mobileStyleSessionRequest("http://localhost/api/learner/command-center");
    assert.match(req.headers.get("cookie") ?? "", /__Secure-authjs\.session-token=/);
  });

  describe("GET /api/learner/command-center", () => {
    it("returns 401 unauthorized when auth resolves no session (anonymous / signed-out; cookie jar alone does not bypass gate)", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => null);

      const res = await getCommandCenter(mobileStyleSessionRequest("http://localhost/api/learner/command-center"));
      assert.equal(res.status, 401);
      const body = (await res.json()) as { code?: string };
      assert.equal(body.code, "unauthorized");
    });

    it("returns 403 not_subscribed when session exists but getUserAccess has no premium (website never paid)", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({
          hasPremium: false,
          reason: "no_access",
          plan: { planCode: null, duration: null, status: "none", expiresAt: null, cancelAtPeriodEnd: false },
        }),
      );

      const res = await getCommandCenter(mobileStyleSessionRequest("http://localhost/api/learner/command-center"));
      assert.equal(res.status, 403);
      const body = (await res.json()) as { code?: string };
      assert.equal(body.code, "not_subscribed");
    });

    it("returns 403 not_subscribed for lapsed canceled subscription (no paid-through window)", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({
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
      );

      const res = await getCommandCenter(mobileStyleSessionRequest("http://localhost/api/learner/command-center"));
      assert.equal(res.status, 403);
      const body = (await res.json()) as { code?: string };
      assert.equal(body.code, "not_subscribed");
    });

    it("returns 403 not_subscribed when past_due row does not grant premium (strict policy / expired grace)", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({
          hasPremium: false,
          reason: "no_access",
          plan: {
            planCode: "pro",
            duration: null,
            status: "past_due",
            expiresAt: new Date(Date.now() - 86_400_000),
            cancelAtPeriodEnd: false,
          },
        }),
      );

      const res = await getCommandCenter(mobileStyleSessionRequest("http://localhost/api/learner/command-center"));
      assert.equal(res.status, 403);
      const body = (await res.json()) as { code?: string };
      assert.equal(body.code, "not_subscribed");
    });

    it("admin_override (staff bypass from getUserAccess) passes gate; without DB URL returns database-unavailable 503", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({
          hasPremium: true,
          reason: "admin_override",
          sessionJwt: { role: UserRole.ADMIN, credentialVersion: 1 },
        }),
      );

      const prev = process.env.DATABASE_URL;
      delete process.env.DATABASE_URL;
      try {
        const res = await getCommandCenter(mobileStyleSessionRequest("http://localhost/api/learner/command-center"));
        assert.equal(res.status, 503);
        const body = (await res.json()) as { error?: string };
        assert.match(String(body.error ?? ""), /Database unavailable/i);
      } finally {
        if (prev !== undefined) process.env.DATABASE_URL = prev;
      }
    });

    it("returns blocking response when account-sharing guard fires after subscriber ok", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({ hasPremium: true, reason: "active_subscription" }),
      );
      mock.method(
        requireSubscriberSessionDeps,
        "maybeBlockOrTouchAccountSharingAfterSubscriberOk",
        async () => NextResponse.json({ code: "blocked" }, { status: 429 }),
      );

      const res = await getCommandCenter(mobileStyleSessionRequest("http://localhost/api/learner/command-center"));
      assert.equal(res.status, 429);
    });
  });

  describe("GET /api/flashcards/due-summary (subscriber-only, minimal DB surface)", () => {
    it("paid active_subscription returns 200 JSON with due counters (same gate as web; Cookie on Request)", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({ hasPremium: true, reason: "active_subscription" }),
      );

      const prevDb = process.env.DATABASE_URL;
      process.env.DATABASE_URL = "postgresql://mock:mock@127.0.0.1:5432/mock_entitlements_contract";
      mock.method(prisma.flashcardProgress, "count", async () => 0);
      try {
        const res = await getFlashcardsDueSummary(
          mobileStyleSessionRequest("http://localhost/api/flashcards/due-summary") as NextRequest,
        );
        assert.equal(res.status, 200);
        const body = (await res.json()) as { dueToday?: number; overdue?: number; learning?: number; asOf?: string };
        assert.equal(body.dueToday, 0);
        assert.equal(body.overdue, 0);
        assert.equal(body.learning, 0);
        assert.ok(typeof body.asOf === "string" && body.asOf.length > 8);
      } finally {
        if (prevDb !== undefined) process.env.DATABASE_URL = prevDb;
        else delete process.env.DATABASE_URL;
      }
    });

    it("canceled_paid_through (getUserAccess outcome) still reaches 200 on due-summary", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({
          hasPremium: true,
          reason: "canceled_paid_through",
          plan: {
            planCode: "pro",
            duration: null,
            status: "canceled",
            expiresAt: new Date(Date.now() + 86_400_000),
            cancelAtPeriodEnd: true,
          },
        }),
      );

      const prevDb = process.env.DATABASE_URL;
      process.env.DATABASE_URL = "postgresql://mock:mock@127.0.0.1:5432/mock_entitlements_contract";
      mock.method(prisma.flashcardProgress, "count", async () => 0);
      try {
        const res = await getFlashcardsDueSummary(
          mobileStyleSessionRequest("http://localhost/api/flashcards/due-summary") as NextRequest,
        );
        assert.equal(res.status, 200);
      } finally {
        if (prevDb !== undefined) process.env.DATABASE_URL = prevDb;
        else delete process.env.DATABASE_URL;
      }
    });

    it("past_due_grace (getUserAccess outcome under grace policy) returns 200", async () => {
      wireSubscriberDeps();
      mock.method(requireSubscriberSessionDeps, "auth", async () => ({ user: { id: userId } }));
      mock.method(requireSubscriberSessionDeps, "getUserAccess", async () =>
        baseUserAccess({
          hasPremium: true,
          reason: "past_due_grace",
          plan: {
            planCode: "pro",
            duration: null,
            status: "past_due",
            expiresAt: new Date(Date.now() + 86_400_000),
            cancelAtPeriodEnd: false,
          },
        }),
      );

      const prevDb = process.env.DATABASE_URL;
      process.env.DATABASE_URL = "postgresql://mock:mock@127.0.0.1:5432/mock_entitlements_contract";
      mock.method(prisma.flashcardProgress, "count", async () => 0);
      try {
        const res = await getFlashcardsDueSummary(
          mobileStyleSessionRequest("http://localhost/api/flashcards/due-summary") as NextRequest,
        );
        assert.equal(res.status, 200);
      } finally {
        if (prevDb !== undefined) process.env.DATABASE_URL = prevDb;
        else delete process.env.DATABASE_URL;
      }
    });
  });
});
