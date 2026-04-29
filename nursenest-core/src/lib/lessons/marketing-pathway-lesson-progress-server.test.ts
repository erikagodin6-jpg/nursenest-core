import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { canShowPaidPathwayLessonProgress } from "./marketing-pathway-lesson-progress-server";
import type { MarketingPathwayLessonProgressSessionContext } from "./marketing-pathway-lesson-progress-server";

describe("canShowPaidPathwayLessonProgress (tier-agnostic gate)", () => {
  const noUser: MarketingPathwayLessonProgressSessionContext = {
    userId: "",
    learnerPath: null,
    scope: { hasAccess: true, reason: "ok", tier: "pro", country: "US", alliedCareer: null },
  };

  it("is false without a user id (anonymous)", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    assert.equal(canShowPaidPathwayLessonProgress(noUser, pathway), false);
  });

  it("is false when scope has no access (unpaid)", () => {
    const pathway = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pathway);
    const ctx: MarketingPathwayLessonProgressSessionContext = {
      userId: "user-1",
      learnerPath: null,
      scope: { hasAccess: false, reason: "no_access", tier: null, country: null, alliedCareer: null },
    };
    assert.equal(canShowPaidPathwayLessonProgress(ctx, pathway), false);
  });

  /**
   * RN → RPN/PN → NP → Allied: same gate for every pathway id the hubs render.
   */
  it("matches RN, RPN/PN, NP, and Allied pathway ids when access is on (country aligned) and learnerPath matches NP specialty", () => {
    const tiers = [
      { id: "us-rn-nclex-rn", learnerPath: null as string | null },
      { id: "ca-rn-nclex-rn", learnerPath: null },
      { id: "ca-rpn-rex-pn", learnerPath: null },
      { id: "us-np-fnp", learnerPath: "us-np-fnp" },
      { id: "ca-allied-core", learnerPath: null },
    ];
    for (const { id, learnerPath } of tiers) {
      const pathway = getExamPathwayById(id);
      assert.ok(pathway, id);
      const ctx: MarketingPathwayLessonProgressSessionContext = {
        userId: "subscriber-1",
        learnerPath,
        scope: {
          hasAccess: true,
          reason: "ok",
          tier: "pro",
          country: pathway.countryCode,
          alliedCareer: null,
        },
      };
      assert.equal(canShowPaidPathwayLessonProgress(ctx, pathway), true, id);
    }
  });
});
