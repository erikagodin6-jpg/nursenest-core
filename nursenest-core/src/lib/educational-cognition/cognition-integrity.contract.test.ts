/**
 * Run: node --import tsx --test src/lib/educational-cognition/cognition-integrity.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { assessCognitionEnvelopeIntegrity } from "@/lib/educational-cognition/cognition-envelope-integrity";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

describe("assessCognitionEnvelopeIntegrity", () => {
  it("classifies valid envelopes", () => {
    const env = buildFreshCognitionEnvelope(EMPTY_LEARNER_STATE("us-rn-nclex-rn"), "persisted");
    const r = assessCognitionEnvelopeIntegrity(env, "us-rn-nclex-rn");
    assert.equal(r.tier, "valid");
    assert.ok(r.envelope);
  });

  it("salvages partial snapshot without destructive reset", () => {
    const r = assessCognitionEnvelopeIntegrity(
      {
        cognitionSnapshotVersion: 2,
        snapshot: {
          readinessTrajectory: [55, 60],
          measurementWeaknesses: ["potassium"],
        },
      },
      "us-rn-nclex-rn",
    );
    assert.ok(r.tier === "repaired" || r.tier === "degraded");
    assert.ok(r.envelope?.snapshot.readinessTrajectory.length >= 1);
  });

  it("marks irreparable payloads corrupted without throwing", () => {
    const r = assessCognitionEnvelopeIntegrity({ nope: true }, null);
    assert.equal(r.tier, "corrupted");
    assert.equal(r.envelope, null);
  });
});
