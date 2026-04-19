import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  isBuildSafeModeEnabled,
  isProductionBuildInvocation,
  shouldReduceNonCriticalBuildWork,
} from "./build-safe-mode";

describe("build-safe-mode", () => {
  it("should not throw and return booleans", () => {
    assert.equal(typeof isBuildSafeModeEnabled(), "boolean");
    assert.equal(typeof isProductionBuildInvocation(), "boolean");
    assert.equal(typeof shouldReduceNonCriticalBuildWork(), "boolean");
  });
});
