import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const ONBOARDING_FLOW_PATH = path.resolve(ROOT, "src/components/onboarding/trial-onboarding-flow.tsx");

describe("trial onboarding flow CTA contract", () => {
  const src = fs.readFileSync(ONBOARDING_FLOW_PATH, "utf8");

  it("summarizes the learner's saved setup before the final continuation CTA", () => {
    assert.match(src, /Your study start is ready/);
    assert.match(src, /Continue to my study hub/);
    assert.match(src, /Pathway/);
    assert.match(src, /Timeline/);
    assert.match(src, /Starting mode/);
  });
});
