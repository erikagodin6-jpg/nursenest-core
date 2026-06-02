/**
 * Run: node --import tsx --test src/lib/educational-cognition/cognition-repair.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { repairDurableLearnerCognitionEnvelope } from "@/lib/educational-cognition/repair-durable-learner-cognition-envelope";
import { buildFreshCognitionEnvelope } from "@/lib/educational-cognition/cognition-snapshot-migrations";
import { EMPTY_LEARNER_STATE } from "@/lib/learner/rn-coaching-intelligence/learner-state-types";

describe("repairDurableLearnerCognitionEnvelope", () => {
  it("prunes invalid graph hrefs and dedupes remediation pathways", () => {
    const snapshot = {
      ...EMPTY_LEARNER_STATE("us-rn-nclex-rn"),
      reasoningPatterns: ["not_a_real_pattern" as never, "monitoring_gap"],
      competencyStates: [
        {
          competencyId: "not_valid" as never,
          masteryScore: 40,
          volatility: "stable",
          sessionEvidenceCount: 2,
          persistentWeak: true,
          remediationResponsive: null,
          lastUpdatedAt: new Date().toISOString(),
        },
      ],
    };
    const envelope = buildFreshCognitionEnvelope(snapshot, "inferred");
    envelope.graphContinuity = {
      currentTopicSlug: "pharm",
      remediationPathwayIds: ["/app/lessons", "bad-href", "/app/lessons"],
      glossaryContinuityKeys: ["k"],
      interpretationContinuityKeys: [],
      lastGraphStepId: "s1",
      lastGraphHref: "/app/lessons",
    };
    const { report, envelope: repaired } = repairDurableLearnerCognitionEnvelope(envelope);
    assert.ok(report.repairOperations.length > 0);
    assert.ok(repaired.graphContinuity!.remediationPathwayIds.every((h) => h.startsWith("/app/")));
    assert.equal(repaired.snapshot.reasoningPatterns.includes("monitoring_gap" as never), true);
  });
});
