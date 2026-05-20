/**
 * Run: node --import tsx --test src/lib/educational-cognition/cognition-persistence-observability.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  probeLearnerCognitionPersistence,
  emitCognitionPersistenceEvent,
} from "@/lib/educational-cognition/cognition-persistence-observability";
import { prepareDurableCognitionEnvelope } from "@/lib/educational-cognition/prepare-durable-cognition-envelope";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

describe("cognition persistence observability", () => {
  it("probe returns a health state without throwing", async () => {
    const health = await probeLearnerCognitionPersistence();
    assert.ok(["available", "degraded", "memory_only", "unconfigured"].includes(health.mode));
    assert.ok(health.lastProbeAt);
  });

  it("emit persistence events does not throw", () => {
    assert.doesNotThrow(() => {
      emitCognitionPersistenceEvent("persistence_degraded", { reason: "contract_simulation" });
    });
  });

  it("prepare pipeline survives malformed snapshot", () => {
    const prepared = prepareDurableCognitionEnvelope(
      { snapshot: { readinessTrajectory: [70] } },
      "us-rn-nclex-rn",
    );
    assert.ok(prepared.envelope || prepared.integrityTier === "corrupted");
  });

  it("prepare valid envelope retains snapshot", () => {
    const env = buildFreshCognitionEnvelope(EMPTY_LEARNER_STATE("us-rn-nclex-rn"), "persisted");
    const prepared = prepareDurableCognitionEnvelope(env, "us-rn-nclex-rn");
    assert.ok(prepared.envelope);
    assert.equal(prepared.envelope!.snapshot.pathwayId, "us-rn-nclex-rn");
  });
});
