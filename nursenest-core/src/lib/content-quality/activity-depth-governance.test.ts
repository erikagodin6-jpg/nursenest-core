import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { evaluateActivityDepth, summarizeActivityDepthStandard } from "@/lib/content-quality/activity-depth-governance";

describe("activity-depth-governance", () => {
  it("blocks underbuilt activities before they can feel like short placeholder quizzes", () => {
    const verdict = evaluateActivityDepth({
      track: "prioritization_delegation",
      interactionCount: 3,
      questionCount: 3,
      flashcardCount: 2,
      averageRationaleWords: 40,
      remediationPromptCount: 1,
      branchingPointCount: 0,
      implementedElements: ["active recall"],
    });

    assert.equal(verdict.readiness, "blocked");
    assert.ok(verdict.score < 75);
    assert.ok(verdict.findings.some((finding) => finding.id === "interactions"));
    assert.ok(verdict.findings.some((finding) => finding.id === "missing_rationale_reveal"));
  });

  it("marks substantial activities as premium when they meet depth and retention standards", () => {
    const verdict = evaluateActivityDepth({
      track: "prioritization_delegation",
      interactionCount: 34,
      questionCount: 32,
      flashcardCount: 30,
      averageRationaleWords: 190,
      remediationPromptCount: 6,
      branchingPointCount: 7,
      implementedElements: [
        "patient ranking",
        "delegation sorting",
        "escalation event",
        "reassessment prompt",
        "retention flashcards",
        "active recall",
        "rationale reveal",
        "confidence calibration",
        "remediation recommendation",
        "transfer/application prompt",
        "retention checkpoint",
      ],
    });

    assert.equal(verdict.readiness, "premium");
    assert.equal(verdict.findings.length, 0);
  });

  it("summarizes standards for admin and generation prompts", () => {
    assert.match(summarizeActivityDepthStandard("ecg_advanced"), /minimum 25 interactions/);
  });
});
