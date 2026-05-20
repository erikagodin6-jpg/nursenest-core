import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import { catExamConditionRows, catHeroSummaryChips } from "@/lib/exam-pathways/pathway-cat-setup-display";
import { publicCopyForReadinessConfig, readinessConfigForPathway } from "@/lib/exam-pathways/pathway-readiness-config";

describe("pathway-cat-setup-display", () => {
  it("uses pathway min/max in hero chips for US RN (not generic 15-cap wording)", () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    const pc = publicCopyForReadinessConfig(rc);
    const chips = catHeroSummaryChips(rc, pc);
    const range = chips.find((c) => c.id === "range");
    assert.ok(range);
    assert.equal(range!.value, "85–145");
    assert.match(rc.questionRange, /85/);
    assert.match(rc.questionRange, /145/);
    assert.doesNotMatch(rc.questionRange, /15/);
  });

  it("surfaces REx-PN minimum (90) in exam condition rows", () => {
    const pathway = getExamPathwayById("ca-rpn-rex-pn");
    assert.ok(pathway);
    const rc = readinessConfigForPathway(pathway);
    const rows = catExamConditionRows(rc, "Canada RPN · REx-PN");
    const min = rows.find((r) => r.id === "min");
    assert.equal(min?.value, "90");
  });
});
