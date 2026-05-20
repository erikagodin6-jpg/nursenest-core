import test from "node:test";
import assert from "node:assert/strict";

import { balanceCatItemExposure } from "./cat-item-exposure-balancing";

test("flagship item with high exposure becomes overexposed or retire", () => {
  const result = balanceCatItemExposure({
    qualityWeight: 1.15,
    qualityBand: "flagship",
    totalExposures: 6200,
    recentExposures7d: 180,
    recentExposures30d: 950,
    incorrectRate: 0.42,
    discriminationIndex: 0.46,
  });

  assert.ok(result.adjustedWeight < 1.15);
  assert.ok(result.exposureBand === "retire" || result.exposureBand === "overexposed");
});

test("rested strong item becomes healthy candidate", () => {
  const result = balanceCatItemExposure({
    qualityWeight: 0.98,
    qualityBand: "preferred",
    totalExposures: 180,
    recentExposures7d: 4,
    recentExposures30d: 12,
    incorrectRate: 0.55,
    discriminationIndex: 0.44,
    lastServedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
  });

  assert.ok(result.adjustedWeight >= 0.8);
  assert.ok(result.longevityScore >= 70);
});

test("exclude band remains excluded", () => {
  const result = balanceCatItemExposure({
    qualityWeight: 0.3,
    qualityBand: "exclude",
    totalExposures: 0,
  });

  assert.equal(result.adjustedWeight, 0);
});

test("underused experimental item gets favorable treatment", () => {
  const result = balanceCatItemExposure({
    qualityWeight: 0.76,
    qualityBand: "standard",
    totalExposures: 18,
    recentExposures7d: 1,
    recentExposures30d: 3,
    incorrectRate: 0.48,
    discriminationIndex: 0.31,
    isExperimental: true,
  });

  assert.ok(result.exposureBand === "underused" || result.exposureBand === "healthy");
  assert.ok(result.adjustedWeight >= 0.65);
});
