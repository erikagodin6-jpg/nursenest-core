/**
 * Run: node --import tsx --test src/lib/educational-cognition/telemetry-isolation.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  governTelemetryIsolation,
  partitionTelemetrySurface,
  filterCognitionTelemetryProps,
} from "@/lib/educational-cognition/telemetry-isolation-governance";
import { buildCognitionTelemetryLineage } from "@/lib/educational-cognition/cognition-telemetry-lineage";
import { buildCognitionVersionMetadata } from "@/lib/educational-cognition/cognition-version-governance";

describe("telemetry isolation governance", () => {
  it("strips learner identifiers from public marketing telemetry", () => {
    const result = governTelemetryIsolation({
      surface: "public_marketing",
      event: "page_view",
      props: {
        user_id: "secret",
        pathway_id: "us-rn-nclex-rn",
        cat_theta: 1.2,
      },
    });
    assert.ok(result.strippedKeys.includes("user_id"));
    assert.ok(result.strippedKeys.includes("cat_theta"));
  });

  it("blocks cat_* events on public surfaces", () => {
    const result = governTelemetryIsolation({
      surface: "public_marketing",
      event: "cat_session_start",
      props: {},
      pathwayId: "ca-np-cnple",
    });
    assert.equal(result.violationCode, "public_cat_namespace");
  });

  it("partitions learner routes as authenticated", () => {
    assert.equal(partitionTelemetrySurface("/app/dashboard"), "learner_authenticated");
    assert.equal(partitionTelemetrySurface("/canada/np/cnple"), "public_marketing");
  });
});

describe("cognition telemetry lineage", () => {
  it("builds allowlisted props only", () => {
    const lineage = buildCognitionTelemetryLineage({
      surface: "learner_authenticated",
      event: "cognition_context_resolved",
      pathwayId: "us-rn-nclex-rn",
      version: buildCognitionVersionMetadata(),
      extra: {
        envelope_version: 2,
        user_email: "must_not_leak@example.com",
      },
    });
    assert.equal(lineage.props.pathway_id, "us-rn-nclex-rn");
    assert.equal(lineage.props.envelope_version, 2);
    assert.ok(!("user_email" in lineage.props));
  });

  it("filterCognitionTelemetryProps drops unknown keys", () => {
    const filtered = filterCognitionTelemetryProps({
      pathway_id: "x",
      secret_token: "nope",
      cognition_integrity_tier: "valid",
    });
    assert.equal(filtered.pathway_id, "x");
    assert.equal(filtered.secret_token, undefined);
    assert.equal(filtered.cognition_integrity_tier, "valid");
  });
});
