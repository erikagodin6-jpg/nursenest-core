import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const HUB_PATH = path.resolve(ROOT, "src/components/exam-pathways/exam-pathway-hub.tsx");
const STUDY_MODES_PATH = path.resolve(ROOT, "src/components/exam-pathways/exam-pathway-hub-study-modes.tsx");
const PREMIUM_MODULES_TEST_PATH = path.resolve(ROOT, "src/components/exam-pathways/exam-pathway-hub-premium-modules.contract.test.tsx");

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("RN slice layout readiness", () => {
  const hub = read(HUB_PATH);
  const studyModes = read(STUDY_MODES_PATH);
  const premiumModulesContract = read(PREMIUM_MODULES_TEST_PATH);

  it("keeps the pathway hub wide enough for RN slice cards and readable hero copy", () => {
    assert.match(hub, /max-w-6xl/, "pathway hub shell must not regress to cramped max-w-4xl");
    assert.doesNotMatch(hub, /max-w-4xl/, "pathway hub shell should stay wider than the old 4xl cap");
    assert.match(hub, /lg:px-6/, "desktop padding should preserve breathing room around RN slices");
    assert.match(hub, /max-w-\[min\(100%,48rem\)\]/, "hero title line length should stay readable");
    assert.match(hub, /max-w-3xl/, "hero/support copy should allow RN descriptions without cramped wrapping");
  });

  it("adds RN-specific hooks for visual QA and future E2E proof", () => {
    assert.match(hub, /data-nn-rn-slice-readiness=\{pathway\.roleTrack === "rn" \? "1" : undefined\}/);
    assert.match(studyModes, /data-nn-rn-study-grid=\{pathway\.roleTrack === "rn" \? "1" : undefined\}/);
  });

  it("uses a stable three-card desktop grid for Lessons, Questions, and CAT", () => {
    assert.match(studyModes, /grid-cols-1 gap-5 p-0 md:grid-cols-3 md:gap-6/);
    assert.doesNotMatch(studyModes, /sm:grid-cols-2 sm:gap-6 lg:grid-cols-3/, "avoid intermediate 2-column compression for the three primary RN study cards");
    assert.match(studyModes, /<li key=\{card\.key\} className="min-w-0"/);
    assert.match(studyModes, /className=\{`\$\{card\.extraClass \?\? ""\} min-w-0`\}/);
  });

  it("protects long NCLEX/CAT labels from overflow and tiny clipped badges", () => {
    assert.match(studyModes, /whitespace-normal break-words/);
    assert.match(studyModes, /max-w-3xl text-pretty/, "study-mode explanatory copy should remain readable");
    assert.match(studyModes, /nn-exam-hub-study-card--lessons/);
    assert.match(studyModes, /nn-exam-hub-study-card--questions/);
    assert.match(studyModes, /nn-exam-hub-study-card--cat/);
  });

  it("keeps RN premium module coverage for the actual NCLEX-RN hub", () => {
    assert.match(premiumModulesContract, /getExamPathwayById\("us-rn-nclex-rn"\)/);
    assert.match(premiumModulesContract, /data-nn-qa-hub-ecg/);
    assert.match(premiumModulesContract, /data-nn-qa-hub-premium-module="hub_lessons"/);
    assert.match(premiumModulesContract, /data-nn-qa-hub-premium-module="pathway_cat_landing"/);
    assert.match(premiumModulesContract, /Flashcards/i);
    assert.match(premiumModulesContract, /Practice exams/i);
  });
});
