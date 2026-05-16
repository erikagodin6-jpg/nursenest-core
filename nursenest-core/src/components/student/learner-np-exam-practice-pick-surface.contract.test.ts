import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";
import assert from "node:assert/strict";

const ROOT = process.cwd();

function source(rel: string): string {
  return readFileSync(join(ROOT, rel), "utf8");
}

describe("Learner NP exam practice picker", () => {
  it("contains CNPLE pathway detection", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.match(src, /isCnplePathway/);
  });

  it("routes CNPLE simulation into the LOFT learner flow", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.match(src, /"\/app\/cases\/cnple"/);
    assert.match(src, /LOFT Simulation/);
  });

  it("exposes learner navigation for lessons and question-bank access", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.match(src, /Question bank/);
    assert.match(src, /Lessons/);
  });
});
