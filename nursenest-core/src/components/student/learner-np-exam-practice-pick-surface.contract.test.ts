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
    assert.doesNotMatch(src, /CAT adaptive/);
  });

  it("includes CNPLE learner-app actions", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");

    assert.match(src, /Practice Tests/);
    assert.match(src, /\/app\/practice-tests\?pathwayId=ca-np-cnple/);

    assert.match(src, /Flashcards/);
    assert.match(src, /\/app\/flashcards\?pathwayId=ca-np-cnple/);

    assert.match(src, /Lessons/);
    assert.match(src, /\/app\/lessons\?pathwayId=ca-np-cnple/);

    assert.match(src, /Question bank/);
  });

  it("does not send signed-in CNPLE learners to the public lessons route", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.doesNotMatch(src, /\/canada\/np\/cnple\/lessons/);
  });

  it("preserves non-CNPLE CAT practice flow", () => {
    const src = source("src/components/student/learner-np-exam-practice-pick-surface.tsx");
    assert.match(src, /Practice exams & CAT/);
    assert.match(src, /encodeURIComponent\(p.id\)/);
  });
});
