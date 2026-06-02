/**
 * Run: node --import tsx --test src/lib/educational-cognition/persistence-runtime.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  assertPersistenceRuntimeReady,
} from "@/lib/educational-cognition/persistence-runtime-governance";
import { validateEnvelopeSerialization } from "@/lib/educational-cognition/cognition-persistence-observability";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

describe("persistence runtime governance", () => {
  it("assertPersistenceRuntimeReady returns structured assertion", async () => {
    const result = await assertPersistenceRuntimeReady();
    assert.ok(typeof result.ok === "boolean");
    assert.ok(result.health.mode);
    assert.ok(result.health.lastProbeAt);
  });
});

describe("envelope serialization validation", () => {
  it("accepts bounded fresh envelope", () => {
    const env = buildFreshCognitionEnvelope(EMPTY_LEARNER_STATE("us-rn-nclex-rn"), "inferred");
    const v = validateEnvelopeSerialization(env);
    assert.equal(v.ok, true);
    assert.ok(v.byteLength > 0);
  });

  it("rejects circular references", () => {
    const circular: Record<string, unknown> = {};
    circular.self = circular;
    const v = validateEnvelopeSerialization(circular);
    assert.equal(v.ok, false);
  });
});
