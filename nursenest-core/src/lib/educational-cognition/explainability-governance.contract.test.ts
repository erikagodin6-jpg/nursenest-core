/**
 * Run: node --import tsx --test src/lib/educational-cognition/explainability-governance.contract.test.ts
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildCognitionExplainability,
  serializeExplainabilityForPublic,
} from "@/lib/educational-cognition/cognition-explainability";
import { resolveEducationalCognitionContext } from "@/lib/educational-cognition/resolve-educational-cognition-context";

describe("explainability governance", () => {
  it("exposes required public fields without psychometric internals", () => {
    const ctx = resolveEducationalCognitionContext("us-rn-nclex-rn", {
      weakTopicLabels: ["pharmacology"],
    });
    const explain = buildCognitionExplainability({ ctx, primaryReason: "Focus pharmacology." });
    const pub = serializeExplainabilityForPublic(explain);

    assert.ok(pub.derivedFrom.length > 0);
    assert.ok(pub.recommendationReason);
    assert.ok(["low", "medium", "high"].includes(pub.confidenceTier));
    assert.ok(pub.ontologyRevision.length > 0);
    const serialized = JSON.stringify(pub);
    assert.ok(!/theta|pass_probability|cat_precision/i.test(serialized));
  });

  it("includes graph and remediation signals when fatigue active", () => {
    const ctx = resolveEducationalCognitionContext("us-rn-nclex-rn", {
      weakTopicLabels: ["cardiovascular"],
    });
    ctx.learnerState.remediationFatigueScore = 0.85;
    ctx.remediation.fatigueCapActive = true;
    const explain = buildCognitionExplainability({ ctx });
    assert.ok(explain.remediationSignals.some((s) => s.includes("fatigue")));
  });
});
