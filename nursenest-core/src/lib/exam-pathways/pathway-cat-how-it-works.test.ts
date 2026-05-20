import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { catHowItWorksBulletItems } from "@/lib/exam-pathways/pathway-cat-how-it-works";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";

describe("catHowItWorksBulletItems", () => {
  it("returns non-empty bullets for RN CAT", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    const pc = publicCopyForReadinessConfig(rc);
    const bullets = catHowItWorksBulletItems(pc, rc);
    assert.ok(bullets.length >= 3);
    assert.ok(bullets.every((b) => b.length > 10));
  });
});
