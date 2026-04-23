import assert from "node:assert/strict";
import { describe, it } from "node:test";

/** Mirrors the operational alert threshold in `pathway-lesson-loader` (`hub_inventory_pipeline_shrink`). */
function pathwayHubRenderablePassesRegressionGate(
  sqlPublishedEffectiveLocale: number,
  renderableAfterPipeline: number,
): boolean {
  if (sqlPublishedEffectiveLocale > 100 && renderableAfterPipeline < 10) return false;
  return true;
}

describe("pathway lesson hub density regression gate", () => {
  it("fails when a large SQL corpus collapses to almost nothing on the hub", () => {
    assert.equal(pathwayHubRenderablePassesRegressionGate(800, 1), false);
  });

  it("passes for healthy RN-scale hubs", () => {
    assert.equal(pathwayHubRenderablePassesRegressionGate(800, 120), true);
  });

  it("ignores the gate for small pathways", () => {
    assert.equal(pathwayHubRenderablePassesRegressionGate(40, 0), true);
  });
});
