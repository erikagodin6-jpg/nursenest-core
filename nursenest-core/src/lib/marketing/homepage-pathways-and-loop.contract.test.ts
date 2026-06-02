/**
 * Contract: homepage pathway cards must surface RN / PN / NP / Allied / Pre-Nursing,
 * with international status handled separately, and the adaptive loop must show
 * Read → Practice → Detect Weakness → Remediate → Reassess.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";

const ROOT = process.cwd();

test("Premium homepage routes expose Pre-Nursing instead of International RN as a primary pathway card", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-homepage-routes.ts"), "utf8");

  assert.match(src, /id:\s*"pre-nursing"/);
  assert.doesNotMatch(src, /id:\s*"international-rn"/);
});

test("Premium study ecosystem encodes the full adaptive loop steps", () => {
  const src = fs.readFileSync(path.join(ROOT, "src/components/marketing/home/premium-study-ecosystem.tsx"), "utf8");

  for (const key of ["read", "practice", "detectWeakness", "remediate", "reassess"]) {
    assert.match(src, new RegExp(`key:\\s*"${key}"`), `missing adaptive-loop step ${key}`);
  }
});
