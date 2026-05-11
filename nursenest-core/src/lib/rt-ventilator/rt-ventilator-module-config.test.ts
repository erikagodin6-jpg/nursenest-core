import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  canAccessRtVentilatorModuleForTierAndProfession,
  isRtVentilatorLearnerModuleEnabled,
  isRtVentilatorMarketingSurfacesEnabled,
} from "./rt-ventilator-module-config";

describe("rt-ventilator-module-config", () => {
  it("gates learner module via ENABLE_RT_VENTILATOR_MODULE", () => {
    assert.equal(isRtVentilatorLearnerModuleEnabled({ ENABLE_RT_VENTILATOR_MODULE: "true" }), true);
    assert.equal(isRtVentilatorLearnerModuleEnabled({ ENABLE_RT_VENTILATOR_MODULE: "0" }), false);
  });

  it("gates marketing via NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING", () => {
    assert.equal(isRtVentilatorMarketingSurfacesEnabled({ NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING: "1" }), true);
    assert.equal(isRtVentilatorMarketingSurfacesEnabled({ NEXT_PUBLIC_ENABLE_RT_VENTILATOR_MARKETING: "false" }), false);
  });

  it("allows only ALLIED + RRT / respiratory profession scope", () => {
    assert.equal(
      canAccessRtVentilatorModuleForTierAndProfession({ tier: "ALLIED", alliedProfessionKey: "respiratory" }),
      true,
    );
    assert.equal(canAccessRtVentilatorModuleForTierAndProfession({ tier: "ALLIED", alliedCareer: "rrt" }), true);
    assert.equal(
      canAccessRtVentilatorModuleForTierAndProfession({ tier: "RN", alliedProfessionKey: "respiratory" }),
      false,
    );
    assert.equal(canAccessRtVentilatorModuleForTierAndProfession({ tier: "ALLIED", alliedProfessionKey: "mlt" }), false);
    assert.equal(canAccessRtVentilatorModuleForTierAndProfession({ tier: "ALLIED", alliedCareer: "mlt" }), false);
  });
});
