/**
 * Client telemetry governance — LOFT leakage detection.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/client-telemetry-governance.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { governClientTelemetryCapture } from "@/lib/educational-cognition/client-telemetry-governance";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

describe("governClientTelemetryCapture", () => {
  it("renames cat_* events on LOFT when CAT session is inactive", () => {
    const r = governClientTelemetryCapture({
      pathwayId: CNPLE_PATHWAY_ID,
      event: "cat_exam_phase_transition",
      catSessionActive: false,
    });
    assert.equal(r.normalizedEvent, "practice_session_exam_phase_transition");
  });

  it("strips forbidden psychometric props on LOFT", () => {
    const r = governClientTelemetryCapture({
      pathwayId: CNPLE_PATHWAY_ID,
      event: "practice_session_submit",
      props: { theta: 1.2, precision: 0.4, topic: "cardio" },
      catSessionActive: false,
    });
    assert.ok(r.strippedProps.includes("theta"));
    assert.ok(r.strippedProps.includes("precision"));
  });

  it("allows cat_* events when CAT session is active on CAT pathway", () => {
    const r = governClientTelemetryCapture({
      pathwayId: "us-rn-nclex-rn",
      event: "cat_advance_requested",
      catSessionActive: true,
    });
    assert.equal(r.normalizedEvent, "cat_advance_requested");
    assert.equal(r.violationCode, null);
  });
});
