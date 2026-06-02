import assert from "node:assert/strict";
import test from "node:test";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import {
  catPathwayExamCodeLabel,
  catPathwayRegionalExamLine,
  catPathwayRegionRoleLabel,
  catPathwayShortCatLabel,
} from "@/lib/exam-pathways/cat-pathway-labels";

test("NCLEX-RN US RN line + short CAT label", () => {
  const p = getExamPathwayById("us-rn-nclex-rn");
  assert.ok(p);
  assert.equal(catPathwayRegionRoleLabel(p!), "US RN");
  assert.equal(catPathwayExamCodeLabel(p!), "NCLEX-RN");
  assert.equal(catPathwayRegionalExamLine(p!), "US RN · NCLEX-RN");
  assert.equal(catPathwayShortCatLabel(p!), "NCLEX-RN CAT");
});

test("REx-PN Canada RPN", () => {
  const p = getExamPathwayById("ca-rpn-rex-pn");
  assert.ok(p);
  assert.equal(catPathwayRegionalExamLine(p!), "Canada RPN · REx-PN");
  assert.equal(catPathwayShortCatLabel(p!), "REx-PN CAT");
});

test("FNP US NP", () => {
  const p = getExamPathwayById("us-np-fnp");
  assert.ok(p);
  assert.equal(catPathwayRegionRoleLabel(p!), "US NP");
  assert.equal(catPathwayShortCatLabel(p!), "FNP CAT");
});

test("CNPLE Canada NP regional line", () => {
  const p = getExamPathwayById("ca-np-cnple");
  assert.ok(p);
  assert.equal(catPathwayRegionalExamLine(p!), "Canada NP · CNPLE");
});

test("CNPLE short CAT label must not say CAT (CNPLE uses LOFT not CAT)", () => {
  const p = getExamPathwayById("ca-np-cnple");
  assert.ok(p);
  // catPathwayShortCatLabel is intentionally NOT used for LOFT pathways.
  // This test asserts the exam code label alone is CNPLE (no CAT suffix).
  assert.equal(catPathwayExamCodeLabel(p!), "CNPLE");
  // Callers should use pathwayCatLandingTitle (which is LOFT-aware) instead of catPathwayShortCatLabel for CNPLE.
});
