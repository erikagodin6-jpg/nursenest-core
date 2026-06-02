/**
 * Run: `node --import tsx --test src/lib/ai-tutor/deterministic-fallback.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  defaultWeakTopicFallback,
  runDeterministicTutoringFallbackChain,
} from "@/lib/ai-tutor/deterministic-fallback";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";

const ctx = (keys: string[]): TutoringPromptContext => ({
  entitlementSnapshot: {
    hasAccess: true,
    reason: "active_subscription",
    tier: "RN",
    country: "US",
    alliedCareer: null,
    pathwayId: "nclex-rn",
  },
  focusContentIds: [],
  focusContentLabels: [],
  topicKeys: keys,
  signalNames: [],
});

describe("deterministic-fallback", () => {
  it("runs chain in order", () => {
    const first = () => null;
    const second = (c: TutoringPromptContext) =>
      ({
        source: "deterministic",
        summaryLines: [c.topicKeys[0] ?? ""],
        suggestedHrefs: [],
        usedDeterministicFallback: true,
      }) as const;
    const out = runDeterministicTutoringFallbackChain(ctx(["a"]), [first, second]);
    assert.equal(out?.summaryLines[0], "a");
  });

  it("default weak topic fallback returns educational lines", () => {
    const out = defaultWeakTopicFallback(ctx(["electrolytes"]));
    assert.ok(out?.summaryLines.some((l) => /electrolytes/i.test(l)));
  });
});
