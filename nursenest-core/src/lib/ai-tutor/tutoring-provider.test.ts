/**
 * Run: `node --import tsx --test src/lib/ai-tutor/tutoring-provider.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createTutoringProvider } from "@/lib/ai-tutor/tutoring-provider-factory";
import type { TutoringPromptContext } from "@/lib/ai-tutor/types";

const ctx = (): TutoringPromptContext => ({
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
  topicKeys: ["gas_exchange"],
  signalNames: ["weak_topic"],
});

describe("StubTutoringProvider", () => {
  it("returns deterministic recommendation when entitled", async () => {
    const p = createTutoringProvider("stub");
    const rec = await p.generateRecommendation(ctx());
    assert.ok(rec);
    assert.equal(rec?.usedDeterministicFallback, true);
  });

  it("returns null when entitlement snapshot invalid", async () => {
    const p = createTutoringProvider("stub");
    const bad = { ...ctx(), entitlementSnapshot: { ...ctx().entitlementSnapshot, pathwayId: "" } };
    const rec = await p.generateRecommendation(bad);
    assert.equal(rec, null);
  });
});
