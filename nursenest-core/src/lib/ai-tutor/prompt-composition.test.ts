/**
 * Run: `node --import tsx --test src/lib/ai-tutor/prompt-composition.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { composeTutoringPromptEnvelope, escapePlainTextForPromptFragment } from "@/lib/ai-tutor/prompt-composition";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";

const baseCtx = (): TutoringPromptContext => ({
  entitlementSnapshot: {
    hasAccess: true,
    reason: "active_subscription",
    tier: "RN",
    country: "US",
    alliedCareer: null,
    pathwayId: "nclex-rn",
  },
  focusContentIds: ["q1"],
  focusContentLabels: ['Safe <script>alert("x")</script> title'],
  topicKeys: ["fluid_balance"],
  signalNames: ["weak_topic_priority"],
});

describe("prompt-composition", () => {
  it("strips angle brackets from labels", () => {
    const out = escapePlainTextForPromptFragment('<img src="x">');
    assert.match(out, /^[^<>]+$/);
  });

  it("compose uses structured envelope only", () => {
    const env = composeTutoringPromptEnvelope(baseCtx());
    assert.ok(env.includes("PATHWAY_ID: nclex-rn"));
    assert.ok(!env.includes("<script>"));
  });
});
