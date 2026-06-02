import assert from "node:assert/strict";
import test from "node:test";
import {
  HOTSPOT_ASSETS,
  HOTSPOT_OVERLAYS,
  HOTSPOT_QUESTIONS,
  HOTSPOT_SUPPORTED_CONTENT,
  validateHotspotAsset,
  validateHotspotOverlay,
  validateHotspotQuestionForPublication,
  type HotspotAsset,
} from "@/lib/hotspots/hotspot-question-infrastructure";

test("hotspot infrastructure supports required profession domains", () => {
  assert.deepEqual(Object.keys(HOTSPOT_SUPPORTED_CONTENT).sort(), [
    "ecg",
    "mlt",
    "nursing",
    "ot_pt",
    "paramedic",
    "respiratory_therapy",
  ]);
  assert.ok(HOTSPOT_SUPPORTED_CONTENT.nursing.includes("Injection Sites"));
  assert.ok(HOTSPOT_SUPPORTED_CONTENT.ecg.includes("Rhythm Strip Findings"));
  assert.ok(HOTSPOT_SUPPORTED_CONTENT.respiratory_therapy.includes("Ventilator Screens"));
});

test("hotspot assets reject AI-generated production imagery", () => {
  const asset = HOTSPOT_ASSETS[0];
  assert.equal(asset.aiGenerated, false);
  assert.equal(validateHotspotAsset(asset).ok, true);

  const unsafeAsset = { ...asset, id: "unsafe", aiGenerated: true as unknown as false } satisfies HotspotAsset;
  const result = validateHotspotAsset(unsafeAsset);
  assert.equal(result.ok, false);
  assert.ok(result.issues.includes("ai_generated_assets_are_not_allowed"));
});

test("approved overlays keep coordinates, rationales, and image assets separate", () => {
  const overlay = HOTSPOT_OVERLAYS[0];
  const asset = HOTSPOT_ASSETS.find((item) => item.id === overlay.assetId);
  assert.ok(asset);
  assert.equal(asset.url.includes("deltoid-injection-site.svg"), true);
  assert.equal(overlay.regions.some((region) => region.role === "correct"), true);
  assert.equal(overlay.regions.some((region) => region.role === "distractor"), true);
  assert.equal(validateHotspotOverlay(overlay, asset).ok, true);
});

test("hotspot questions cannot publish without approved asset and overlay gates", () => {
  const question = HOTSPOT_QUESTIONS[0];
  const result = validateHotspotQuestionForPublication(question);
  assert.equal(result.ok, true);

  const broken = { ...question, correctRegionIds: ["missing-region"] };
  const brokenResult = validateHotspotQuestionForPublication(broken);
  assert.equal(brokenResult.ok, false);
  assert.ok(brokenResult.issues.includes("unknown_region:missing-region"));
});
