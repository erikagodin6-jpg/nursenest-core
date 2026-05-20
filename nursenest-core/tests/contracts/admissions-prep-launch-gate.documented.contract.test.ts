/**
 * Ensures the mandatory admissions-prep launch gate document stays present in-repo.
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const GATE = path.resolve(ROOT, "docs/governance/admissions-prep-launch-gate.md");

describe("admissions prep launch gate documentation", () => {
  it("exists and states no partial launch + hidden/flag controls", () => {
    assert.ok(fs.existsSync(GATE), `missing ${GATE}`);
    const text = fs.readFileSync(GATE, "utf8");
    assert.match(text, /No partial public launches/i);
    assert.ok(text.includes('status: "hidden"') || text.includes("`hidden`"));
    assert.match(text, /NN_INTERNAL_ADMISSIONS_PREP_PATHWAYS/i);
    assert.match(text, /noindex/i);
  });
});
