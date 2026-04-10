import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  remediationCatPracticeHref,
  remediationTopicDrillHref,
  remediationWeakModeTestHref,
  remediationWeakModeTestHrefForPathway,
} from "@/lib/learner/remediation-links";

describe("remediation links", () => {
  it("generates topic drill link with encoded topic", () => {
    const href = remediationTopicDrillHref("Cardiac / CVS");
    assert.equal(href, "/app/questions?preset=topic_drill&topic=Cardiac%20%2F%20CVS");
  });

  it("generates weak-mode link with optional topic", () => {
    assert.equal(remediationWeakModeTestHref(), "/app/practice-tests?focus=weak");
    assert.equal(
      remediationWeakModeTestHref("Pharmacology & Dosing"),
      "/app/practice-tests?focus=weak&topic=Pharmacology%20%26%20Dosing",
    );
  });

  it("adds pathway context for weak-mode links when available", () => {
    assert.equal(
      remediationWeakModeTestHrefForPathway("Respiratory", "us-rn-nclex-rn"),
      "/app/practice-tests?focus=weak&topic=Respiratory&pathwayId=us-rn-nclex-rn",
    );
  });

  it("generates CAT-focused weak-mode links", () => {
    assert.equal(
      remediationCatPracticeHref("Respiratory", "us-rn-nclex-rn"),
      "/app/practice-tests?cat=1&focus=weak&pathwayId=us-rn-nclex-rn&topic=Respiratory",
    );
  });
});

