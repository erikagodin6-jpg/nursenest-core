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

  it("exposes learner-app navigation for CNPLE", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.match(src, /Practice Tests/);
    assert.match(src, /Flashcards/);
    assert.match(src, /Lessons/);
    assert.match(src, /Question bank/);
    assert.match(src, /app\/lessons\?pathwayId=/);
    assert.match(src, /app\/flashcards\?pathwayId=/);
  });

  it("does not route signed-in CNPLE learners to the public lessons page", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.doesNotMatch(src, /\/canada\/np\/cnple\/lessons/);
  });

  it("preserves CAT wording for non-CNPLE NP pathways only", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.match(src, /Practice exams & CAT/);
  });
});
