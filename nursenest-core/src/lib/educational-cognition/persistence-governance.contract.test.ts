/**
 * Durable cognition persistence + migration contracts.
 *
 * Run: node --import tsx --test src/lib/educational-cognition/persistence-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildFreshCognitionEnvelope,
  migrateCognitionEnvelopeFromStorage,
} from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { COGNITION_SNAPSHOT_VERSION } from "@/lib/educational-cognition/cognition-snapshot-types";
import { governCognitionHydration } from "@/lib/educational-cognition/cognition-hydration-governance";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";
import {
  getDurableCognitionStore,
  saveDurableLearnerCognition,
  hydratePriorLearnerState,
} from "@/lib/educational-cognition/learner-cognition-persistence";

describe("cognition snapshot migrations", () => {
  it("migrates legacy v1 server envelope to current cognition envelope", () => {
    const snapshot = EMPTY_LEARNER_STATE("us-rn-nclex-rn");
    const legacy = {
      version: 1,
      updatedAt: snapshot.updatedAt,
      pathwayId: "us-rn-nclex-rn",
      snapshot,
      stateFingerprint: "legacy_fp",
    };
    const migrated = migrateCognitionEnvelopeFromStorage(legacy, "us-rn-nclex-rn");
    assert.ok(migrated);
    assert.equal(migrated!.cognitionSnapshotVersion, COGNITION_SNAPSHOT_VERSION);
    assert.equal(migrated!.cognitionReliability, "persisted");
  });

  it("returns null for irreparable storage payloads", () => {
    assert.equal(migrateCognitionEnvelopeFromStorage(null, null), null);
    assert.equal(migrateCognitionEnvelopeFromStorage({ bad: true }, null), null);
  });
});

describe("hydration reliability governance", () => {
  it("marks stale envelopes as degraded", () => {
    const snapshot = EMPTY_LEARNER_STATE("us-rn-nclex-rn");
    const envelope = buildFreshCognitionEnvelope(snapshot, "persisted");
    envelope.updatedAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
    const hydration = governCognitionHydration({
      userId: "user_test",
      pathwayId: "us-rn-nclex-rn",
      stored: envelope,
      fromDatabase: true,
    });
    assert.equal(hydration.mode, "degraded");
    assert.ok(hydration.stale);
    assert.ok(hydration.warnings.includes("cognition_envelope_stale"));
  });
});

describe("in-memory durable store (dev / fallback)", () => {
  it("persists graph continuity across save", () => {
    const userId = `contract_user_${Date.now()}`;
    const snapshot = EMPTY_LEARNER_STATE("us-rn-nclex-rn");
    saveDurableLearnerCognition(userId, snapshot, {
      graphContinuity: {
        currentTopicSlug: "pharmacology",
        remediationPathwayIds: ["/app/questions?studyMode=weak"],
        glossaryContinuityKeys: ["potassium"],
        interpretationContinuityKeys: ["electrolytes"],
        lastGraphStepId: "step_1",
        lastGraphHref: "/app/lessons",
      },
    });
    const hydrated = hydratePriorLearnerState({ userId, pathwayId: "us-rn-nclex-rn" });
    assert.equal(hydrated.pathwayId, "us-rn-nclex-rn");
    const row = getDurableCognitionStore().get(userId);
    assert.equal(row?.graphContinuity?.currentTopicSlug, "pharmacology");
    getDurableCognitionStore().delete(userId);
  });
});
