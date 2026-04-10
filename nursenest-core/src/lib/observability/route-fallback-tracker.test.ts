import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { recordRouteRenderFallback } from "@/lib/observability/route-fallback-tracker";

describe("recordRouteRenderFallback", () => {
  it("does not throw and accepts dependencyName", () => {
    assert.doesNotThrow(() =>
      recordRouteRenderFallback({
        fallbackType: "hub_data_load_failed",
        pathname: "/us/rn/nclex-rn",
        pathwayId: "us-rn-nclex-rn",
        dependencyName: "lesson_count",
      }),
    );
  });
});
