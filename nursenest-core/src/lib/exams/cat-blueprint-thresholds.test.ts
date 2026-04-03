import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED,
  CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM,
  CAT_BLUEPRINT_SESSION_MAPPED_WARN,
  getCatBlueprintQualityThresholds,
} from "@/lib/exams/cat-blueprint-thresholds";

describe("getCatBlueprintQualityThresholds", () => {
  it("exposes centralized warning thresholds for logging and admin JSON", () => {
    const t = getCatBlueprintQualityThresholds();
    assert.equal(t.poolMappedFractionWarning, 0.9);
    assert.equal(t.sessionMappedFractionWarning, 0.85);
    assert.equal(t.practicePoolLogFraction, 0.85);
    assert.equal(CAT_BLUEPRINT_POOL_MAPPED_WARN_EXAM_SIM, 0.9);
    assert.equal(CAT_BLUEPRINT_SESSION_MAPPED_WARN, 0.85);
    assert.equal(CAT_BLUEPRINT_LOG_POOL_PRACTICE_MAPPED, 0.85);
  });
});
