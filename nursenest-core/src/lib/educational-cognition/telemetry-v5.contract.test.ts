/**
 * Telemetry V5 cognition contracts.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/telemetry-v5.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  COGNITION_TELEMETRY_EVENTS,
  normalizeCognitionTelemetryProps,
} from "@/lib/educational-cognition/cognition-telemetry-governance";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

describe("cognition telemetry V5", () => {
  it("exposes canonical event families", () => {
    assert.equal(COGNITION_TELEMETRY_EVENTS.cognitionContextResolved, "cognition_context_resolved");
    assert.equal(COGNITION_TELEMETRY_EVENTS.dashboardWidgetRendered, "dashboard_widget_rendered");
    assert.equal(COGNITION_TELEMETRY_EVENTS.psychometricViolationDetected, "psychometric_violation_detected");
  });

  it("normalizes envelope with ontology and measurement fields", () => {
    const ctx = resolveEducationalCognitionContext(CNPLE_PATHWAY_ID);
    const props = normalizeCognitionTelemetryProps(ctx, { source_surface: "contract_test" });
    assert.equal(props.testing_model, "LOFT");
    assert.equal(props.source_surface, "contract_test");
    assert.ok(typeof props.ontology_namespace === "string");
    assert.ok(props.ontology_namespace.includes("cognition"));
    assert.ok(ctx.ontology.telemetryNamespaces.length > 0);
  });
});
