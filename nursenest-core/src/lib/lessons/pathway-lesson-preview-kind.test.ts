import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CountryCode, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { getPathwayLessonPreviewKind } from "./pathway-lesson-access";

function scope(p: Partial<AccessScope> & Pick<AccessScope, "hasAccess" | "reason">): AccessScope {
  return {
    hasAccess: p.hasAccess,
    reason: p.reason,
    tier: p.tier ?? null,
    country: p.country ?? null,
  };
}

describe("getPathwayLessonPreviewKind", () => {
  const usRn = getExamPathwayById("us-rn-nclex-rn")!;
  const caRn = getExamPathwayById("ca-rn-nclex-rn")!;
  const usFnp = getExamPathwayById("us-np-fnp")!;

  it("anonymous when no user id", () => {
    assert.equal(getPathwayLessonPreviewKind(scope({ hasAccess: false, reason: "no_access" }), usRn, null, ""), "anonymous");
  });

  it("inactive when no access", () => {
    assert.equal(
      getPathwayLessonPreviewKind(
        scope({ hasAccess: false, reason: "no_access", tier: TierCode.RN, country: CountryCode.US }),
        usRn,
        null,
        "u1",
      ),
      "inactive_subscription",
    );
  });

  it("wrong plan when country does not match pathway", () => {
    assert.equal(
      getPathwayLessonPreviewKind(
        scope({ hasAccess: true, reason: "active_subscription", tier: TierCode.RN, country: CountryCode.US }),
        caRn,
        null,
        "u1",
      ),
      "wrong_plan_country",
    );
  });

  it("np mismatch when learner path does not match hub", () => {
    assert.equal(
      getPathwayLessonPreviewKind(
        scope({ hasAccess: true, reason: "active_subscription", tier: TierCode.NP, country: CountryCode.US }),
        usFnp,
        "us-np-pmhnp",
        "u1",
      ),
      "np_specialty_mismatch",
    );
  });

  it("default preview when entitled and pathway matches", () => {
    assert.equal(
      getPathwayLessonPreviewKind(
        scope({ hasAccess: true, reason: "active_subscription", tier: TierCode.RN, country: CountryCode.US }),
        usRn,
        null,
        "u1",
      ),
      "default_preview",
    );
  });
});
