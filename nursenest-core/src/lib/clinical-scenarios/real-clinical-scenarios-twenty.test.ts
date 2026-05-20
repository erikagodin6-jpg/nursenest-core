import assert from "node:assert/strict";
import { test } from "node:test";
import { realTwentyPremiumCount, realTwentyPremiumSpecs } from "@/lib/clinical-scenarios/real-clinical-scenarios-twenty";

test("realTwentyPremiumSpecs yields 20 premium-flagged branching scenarios", () => {
  assert.equal(realTwentyPremiumCount(), 20);
  const specs = realTwentyPremiumSpecs();
  assert.equal(specs.length, 20);
  for (const s of specs) {
    assert.ok(s.title.startsWith("[seed:real-v1-"));
    assert.ok(Array.isArray(s.referencesJson));
    const refs = s.referencesJson as unknown[];
    assert.ok(refs.some((r) => r && typeof r === "object" && (r as { isPremium?: boolean }).isPremium === true));
    assert.equal(s.stages.length, 5);
  }
});
