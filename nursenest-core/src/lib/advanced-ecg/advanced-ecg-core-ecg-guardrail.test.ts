import assert from "node:assert/strict";
import test from "node:test";
import {
  assertNoEcgForRpn,
  canAccessEcgModuleForTier,
  isEcgQuestionExcludedFromCat,
} from "@/lib/ecg-module/ecg-module-config";

test("core ECG gating and CAT exclusions remain unchanged", () => {
  assert.equal(canAccessEcgModuleForTier("RN"), true);
  assert.equal(canAccessEcgModuleForTier("NP"), true);
  assert.equal(canAccessEcgModuleForTier("RPN"), false);
  assert.throws(() => assertNoEcgForRpn("RPN", "ca-rpn-rex-pn"), /blocked for RPN/i);
  assert.equal(isEcgQuestionExcludedFromCat({ questionFormat: "ecg_video" }), true);
  assert.equal(isEcgQuestionExcludedFromCat({ tags: ["ecg-video"] }), true);
});
