import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { remediationTopicDrillHref, remediationWeakModeTestHref } from "@/lib/learner/remediation-links";

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
});

