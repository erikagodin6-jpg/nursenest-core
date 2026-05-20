/**
 * Run: node --import tsx --test src/lib/educational-cognition/cognition-replay.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { replayCognitionEnvelope, diffReplayPrimaryNext } from "@/lib/educational-cognition/cognition-replay-runtime";
import { replayGraphContinuityCheckpoint } from "@/lib/educational-cognition/graph-continuity-replay";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

describe("cognition replay runtime", () => {
  it("replays a valid envelope without throwing", async () => {
    const env = buildFreshCognitionEnvelope(EMPTY_LEARNER_STATE("us-rn-nclex-rn"), "persisted");
    const result = await replayCognitionEnvelope({
      raw: env,
      pathwayId: "us-rn-nclex-rn",
    });
    assert.equal(result.pathwayId, "us-rn-nclex-rn");
    assert.ok(result.envelope);
  });

  it("diffReplayPrimaryNext detects title changes", () => {
    const diff = diffReplayPrimaryNext(
      { primaryNextTitle: "A", pathwayId: "x", hydrationMode: "full", graphStepCount: 0, warnings: [], version: {} as never, envelope: null },
      { primaryNextTitle: "B", pathwayId: "x", hydrationMode: "full", graphStepCount: 0, warnings: [], version: {} as never, envelope: null },
    );
    assert.equal(diff.changed, true);
  });
});

describe("graph continuity replay", () => {
  it("restores checkpoint href when continuity valid", () => {
    const result = replayGraphContinuityCheckpoint({
      currentTopicSlug: "pharmacology",
      remediationPathwayIds: ["/app/questions"],
      glossaryContinuityKeys: [],
      interpretationContinuityKeys: [],
      lastGraphStepId: "s1",
      lastGraphHref: "/app/questions",
      remediationReturnHref: "/app/questions",
      graphCheckpointAt: new Date().toISOString(),
    });
    assert.ok(result.checkpointHref);
    assert.equal(result.restored, true);
  });
});
