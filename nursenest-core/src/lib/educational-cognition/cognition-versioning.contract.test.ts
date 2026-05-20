/**
 * Run: node --import tsx --test src/lib/educational-cognition/cognition-versioning.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCognitionVersionMetadata,
  cognitionVersionTelemetryProps,
  COGNITION_SCHEMA_VERSION,
  HYDRATION_VERSION,
} from "@/lib/educational-cognition/cognition-version-governance";
import { buildCognitionTelemetryV5Payload } from "@/lib/educational-cognition/cognition-telemetry-v5";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition";
import { CNPLE_PATHWAY_ID } from "@/lib/testing/testing-model-pathway-map";

describe("cognition version governance", () => {
  it("emits required version fields for telemetry", () => {
    const meta = buildCognitionVersionMetadata({ migrationPath: "legacy_v1_server_envelope" });
    const props = cognitionVersionTelemetryProps(meta);
    assert.equal(meta.cognitionSchemaVersion, COGNITION_SCHEMA_VERSION);
    assert.equal(meta.hydrationVersion, HYDRATION_VERSION);
    assert.ok(props.cognition_schema_version);
    assert.ok(props.ontology_revision);
    assert.equal(props.migration_path, "legacy_v1_server_envelope");
  });

  it("V5 payload path includes version metadata via emit merge", () => {
    const ctx = resolveEducationalCognitionContext(CNPLE_PATHWAY_ID);
    const payload = buildCognitionTelemetryV5Payload(ctx, "contract_versioning");
    assert.ok(payload.learner_state_version >= 1);
    assert.ok(payload.pathway_id);
  });
});
