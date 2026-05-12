import assert from "node:assert/strict";
import test from "node:test";
import {
  ECG_ROUTE_CONFIGS,
  assertNoEcgForRpn,
  canAccessEcgModuleForTier,
  ecgQuestionTierFilterForTier,
  isEcgModuleEnabled,
  isEcgModuleMarketingInventoryEnabled,
  normalizeEcgLevel,
  normalizeEcgMode,
} from "@/lib/ecg-module/ecg-module-config";

test("ECG module feature flag defaults to enabled; explicit false/0 disables it", () => {
  // Explicit enable
  assert.equal(isEcgModuleEnabled({ ENABLE_ECG_MODULE: "true" }), true);
  assert.equal(isEcgModuleEnabled({ ENABLE_ECG_MODULE: "1" }), true);
  // Explicit disable
  assert.equal(isEcgModuleEnabled({ ENABLE_ECG_MODULE: "false" }), false);
  assert.equal(isEcgModuleEnabled({ ENABLE_ECG_MODULE: "0" }), false);
  // Default ON when env var absent (matches isAdvancedEcgModuleEnabled pattern)
  assert.equal(isEcgModuleEnabled({ ENABLE_ECG_MODULE: undefined }), true);
  assert.equal(isEcgModuleEnabled({}), true);
});

test("ECG marketing inventory flag defaults to enabled; explicit false/0 disables it", () => {
  // Explicit enable
  assert.equal(isEcgModuleMarketingInventoryEnabled({ NEXT_PUBLIC_ENABLE_ECG_MODULE: "true" }), true);
  assert.equal(isEcgModuleMarketingInventoryEnabled({ NEXT_PUBLIC_ENABLE_ECG_MODULE: "1" }), true);
  // Explicit disable
  assert.equal(isEcgModuleMarketingInventoryEnabled({ NEXT_PUBLIC_ENABLE_ECG_MODULE: "false" }), false);
  assert.equal(isEcgModuleMarketingInventoryEnabled({ NEXT_PUBLIC_ENABLE_ECG_MODULE: "0" }), false);
  // Default ON when env var absent (matches isAdvancedEcgModuleEnabled pattern)
  assert.equal(isEcgModuleMarketingInventoryEnabled({}), true);
  assert.equal(isEcgModuleMarketingInventoryEnabled({ NEXT_PUBLIC_ENABLE_ECG_MODULE: undefined }), true);
});

test("RPN cannot access ECG module while RN and NP can", () => {
  assert.equal(canAccessEcgModuleForTier("RPN"), false);
  assert.equal(canAccessEcgModuleForTier("LVN_LPN"), false);
  assert.equal(canAccessEcgModuleForTier("RN"), true);
  assert.equal(canAccessEcgModuleForTier("NP"), true);
});

test("ECG question pools are scoped by RN/NP tier and never expose RPN", () => {
  assert.deepEqual(ecgQuestionTierFilterForTier("RPN"), []);
  assert.deepEqual(ecgQuestionTierFilterForTier("RN"), ["rn"]);
  assert.deepEqual(ecgQuestionTierFilterForTier("NP"), ["rn", "np"]);
});

test("assertNoEcgForRpn blocks RPN and rex-pn access paths", () => {
  assert.throws(() => assertNoEcgForRpn("RPN", "ca-rpn-rex-pn"));
  assert.throws(() => assertNoEcgForRpn("RN", "ca-rpn-rex-pn"));
  assert.doesNotThrow(() => assertNoEcgForRpn("RN", "us-rn-nclex-rn"));
  assert.doesNotThrow(() => assertNoEcgForRpn("NP", "us-np-fnp"));
});

test("basic and advanced route configs remain separate", () => {
  assert.equal(ECG_ROUTE_CONFIGS["/modules/ecg/basic/lessons"].level, "basic");
  assert.equal(ECG_ROUTE_CONFIGS["/modules/ecg/basic/quizzes"].questionMode, "quiz");
  assert.equal(ECG_ROUTE_CONFIGS["/modules/ecg/advanced/video-drills"].level, "advanced");
  assert.equal(ECG_ROUTE_CONFIGS["/modules/ecg/advanced/video-drills"].questionMode, "drill");
  assert.equal(ECG_ROUTE_CONFIGS["/modules/ecg/advanced/scenarios"].kind, "scenarios");
});

test("ECG level and mode normalization is strict", () => {
  assert.equal(normalizeEcgLevel("basic"), "basic");
  assert.equal(normalizeEcgLevel("advanced"), "advanced");
  assert.equal(normalizeEcgLevel("rpn"), null);
  assert.equal(normalizeEcgMode("lesson"), "lesson");
  assert.equal(normalizeEcgMode("quiz"), "quiz");
  assert.equal(normalizeEcgMode("drill"), "drill");
  assert.equal(normalizeEcgMode("scenario"), null);
});
