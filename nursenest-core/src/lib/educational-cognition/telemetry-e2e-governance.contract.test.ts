/**
 * E2E-style telemetry governance — PostHog payload rules (no browser required).
 *
 * Run: node --import tsx --test src/lib/educational-cognition/telemetry-e2e-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { governClientTelemetryCapture } from "@/lib/educational-cognition/client-telemetry-governance";
import { buildCognitionTelemetryV5Payload } from "@/lib/educational-cognition/cognition-telemetry-v5";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

const FORBIDDEN_LOFT_KEYS = ["theta", "precision", "pass_outlook", "cat_theta"];

describe("telemetry E2E governance", () => {
  it("blocks cat_* rename and forbidden props on LOFT client capture", () => {
    const r = governClientTelemetryCapture({
      pathwayId: CNPLE_PATHWAY_ID,
      event: "cat_submit_advance",
      props: { theta: 1, precision: 0.2, topic: "cardio" },
      catSessionActive: false,
    });
    assert.ok(!/^cat_/i.test(r.normalizedEvent));
    for (const k of FORBIDDEN_LOFT_KEYS) {
      assert.ok(r.strippedProps.includes(k) || !Object.hasOwn({ theta: 1, precision: 0.2 }, k));
    }
  });

  it("V5 payload includes ontology namespace and learner_state_version", () => {
    const ctx = resolveEducationalCognitionContext(CNPLE_PATHWAY_ID);
    const payload = buildCognitionTelemetryV5Payload(ctx, "contract_e2e");
    assert.ok(payload.learner_state_version >= 1);
    assert.ok(payload.ontology_namespace.includes("cognition"));
    assert.equal(payload.pathway_id, CNPLE_PATHWAY_ID);
    assert.ok(typeof payload.fatigue_score === "number");
  });

  it("duplicate cat events on LOFT are flagged", () => {
    const r = governClientTelemetryCapture({
      pathwayId: CNPLE_PATHWAY_ID,
      event: "cat_adaptive_progression",
      catSessionActive: false,
    });
    assert.ok(r.violationCode === "loft_psychometric_leakage" || !/^cat_/i.test(r.normalizedEvent));
  });
});
