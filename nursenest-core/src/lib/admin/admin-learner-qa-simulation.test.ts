import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode } from "@prisma/client";
import {
  billingRegionSlugForQaCountry,
  buildUserAccessForAdminLearnerQa,
  pathwayIdForQaTrack,
  signAdminLearnerQaCookieValue,
  verifyAdminLearnerQaCookieValue,
} from "@/lib/admin/admin-learner-qa-simulation";

describe("admin learner QA cookie", () => {
  it("rejects tampered HMAC", () => {
    process.env.ADMIN_LEARNER_QA_SECRET = "test-secret-at-least-16";
    const payload = {
      v: 1 as const,
      sub: "user-a",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "RN" as const,
      lifecycle: "paid_active" as const,
      country: "US" as const,
    };
    const good = signAdminLearnerQaCookieValue(payload);
    assert.ok(good);
    const [body, sig] = good!.split(".");
    const badSig = sig.length > 0 ? `${sig.slice(0, -1)}0` : "00";
    assert.equal(verifyAdminLearnerQaCookieValue(`${body}.${badSig}`, "user-a"), null);
    delete process.env.ADMIN_LEARNER_QA_SECRET;
  });

  it("rejects wrong user binding", () => {
    process.env.ADMIN_LEARNER_QA_SECRET = "test-secret-at-least-16";
    const payload = {
      v: 1 as const,
      sub: "user-a",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "RN" as const,
      lifecycle: "paid_active" as const,
      country: "US" as const,
    };
    const v = signAdminLearnerQaCookieValue(payload);
    assert.equal(verifyAdminLearnerQaCookieValue(v ?? "", "user-b"), null);
    delete process.env.ADMIN_LEARNER_QA_SECRET;
  });
});

describe("buildUserAccessForAdminLearnerQa", () => {
  it("paid RN grants premium", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: 9e15,
      track: "RN",
      lifecycle: "paid_active",
      country: "US",
    });
    assert.equal(ua.hasPremium, true);
    assert.equal(ua.reason, "active_subscription");
  });

  it("none RN denies premium", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: 9e15,
      track: "RN",
      lifecycle: "none",
      country: "CA",
    });
    assert.equal(ua.hasPremium, false);
    assert.equal(ua.reason, "no_access");
    assert.equal(ua.allowedRegion.country, CountryCode.CA);
    assert.equal(ua.allowedRegion.billingRegionSlug, billingRegionSlugForQaCountry("CA"));
  });

  it("expired RN denies premium with canceled plan", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: 9e15,
      track: "RN",
      lifecycle: "expired",
      country: "US",
    });
    assert.equal(ua.hasPremium, false);
    assert.equal(ua.plan.status, "canceled");
  });

  it("trial RN grants premium with active_trial", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: 9e15,
      track: "RN",
      lifecycle: "trial",
      country: "US",
    });
    assert.equal(ua.hasPremium, true);
    assert.equal(ua.reason, "active_trial");
  });

  it("NP WHNP maps pathway id", () => {
    assert.equal(pathwayIdForQaTrack("NP", "US", "WHNP"), "us-np-whnp");
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: 9e15,
      track: "NP",
      lifecycle: "paid_active",
      country: "US",
      npSpecialty: "AGPCNP",
    });
    assert.equal(ua.allowedExam.pathwayId, "us-np-agpcnp");
    assert.ok(String(ua.plan.planCode).includes("np_agpcnp"));
  });

  it("ALLIED uses selected career", () => {
    const ua = buildUserAccessForAdminLearnerQa({
      v: 1,
      sub: "u1",
      exp: 9e15,
      track: "ALLIED",
      lifecycle: "paid_active",
      country: "CA",
      alliedCareer: "rrt",
    });
    assert.equal(ua.allowedProfession.alliedCareer, "rrt");
  });

  it("legacy cookie without optional fields still verifies", () => {
    process.env.ADMIN_LEARNER_QA_SECRET = "test-secret-at-least-16";
    const payload = {
      v: 1 as const,
      sub: "user-a",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "NP" as const,
      lifecycle: "paid_active" as const,
      country: "US" as const,
    };
    const signed = signAdminLearnerQaCookieValue(payload);
    const out = verifyAdminLearnerQaCookieValue(signed ?? "", "user-a");
    assert.ok(out);
    assert.equal(out!.npSpecialty, undefined);
    assert.equal(pathwayIdForQaTrack(out!.track, out!.country, out!.npSpecialty ?? null), "us-np-fnp");
    delete process.env.ADMIN_LEARNER_QA_SECRET;
  });

  it("round-trips NP specialty and allied career in signed cookie", () => {
    process.env.ADMIN_LEARNER_QA_SECRET = "test-secret-at-least-16";
    const payload = {
      v: 1 as const,
      sub: "user-a",
      exp: Math.floor(Date.now() / 1000) + 3600,
      track: "NP" as const,
      lifecycle: "trial" as const,
      country: "US" as const,
      npSpecialty: "PMHNP" as const,
      planVariant: "monthly" as const,
    };
    const signed = signAdminLearnerQaCookieValue(payload);
    const out = verifyAdminLearnerQaCookieValue(signed ?? "", "user-a");
    assert.ok(out);
    assert.equal(out!.npSpecialty, "PMHNP");
    assert.equal(out!.planVariant, "monthly");
    delete process.env.ADMIN_LEARNER_QA_SECRET;
  });
});
