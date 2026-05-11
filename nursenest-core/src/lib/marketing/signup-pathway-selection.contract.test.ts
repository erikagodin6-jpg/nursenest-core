import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const SIGNUP_FORM_PATH = path.resolve(ROOT, "src/components/auth/signup-form.tsx");

describe("signup pathway selection contract", () => {
  const src = fs.readFileSync(SIGNUP_FORM_PATH, "utf8");

  it("requires an explicit pathway choice instead of defaulting to RN", () => {
    assert.doesNotMatch(src, /useState<SignupTierValue>\("RN"\)/);
    assert.match(src, /useState<SignupTierSelection>\(""\)/);
    assert.match(src, /pages\.signup\.tierPrompt/);
    assert.match(src, /name="tier"[\s\S]*required/);
  });

  it("keeps exam focus gated behind pathway selection", () => {
    assert.match(src, /pages\.signup\.examFocusPrompt/);
    assert.match(src, /name="examFocus"[\s\S]*disabled=\{!tier\}/);
  });
});
