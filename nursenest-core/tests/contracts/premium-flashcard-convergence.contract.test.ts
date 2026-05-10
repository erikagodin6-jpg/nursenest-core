/**
 * Static guard for the premium flashcard convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-flashcard-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const FLASHCARD_CSS_PATH = path.resolve(process.cwd(), "src/app/learner-flashcard-premium.css");
const HUB_CLIENT_PATH = path.resolve(process.cwd(), "src/components/flashcards/flashcards-hub-client.tsx");
const STUDY_STACK_PATH = path.resolve(process.cwd(), "src/components/flashcards/flashcard-study-question-stack.tsx");
const ACTIVE_SESSION_PATH = path.resolve(process.cwd(), "src/components/study/active-study-session.tsx");
const MCQ_LIST_PATH = path.resolve(process.cwd(), "src/components/flashcards/flashcard-exam-mcq-answer-list.tsx");
const SCREENSHOT_DIR = path.resolve(process.cwd(), "docs/screenshots/premium-flashcard-system");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_SCREENSHOT_PREFIXES = [
  "deck-library",
  "study-view",
  "weak-area-recovery",
  "ecg-image-cards",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium flashcard convergence", () => {
  const css = read(FLASHCARD_CSS_PATH);
  const hubClient = read(HUB_CLIENT_PATH);
  const studyStack = read(STUDY_STACK_PATH);
  const activeSession = read(ACTIVE_SESSION_PATH);
  const mcqList = read(MCQ_LIST_PATH);

  it("keeps all five public themes covered by the premium flashcard layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-flashcard-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("uses shared ecosystem module tokens instead of flashcard-only hardcoded color systems", () => {
    for (const token of [
      "--nn-module-flashcards",
      "--nn-module-weak-areas",
      "--nn-module-ecg",
      "--nn-module-labs",
      "--semantic-chart-7",
      "--semantic-chart-8",
    ]) {
      assert.match(css, new RegExp(token), `${token} should be consumed by flashcards`);
    }
  });

  it("exposes QA hooks for deck library, study, reveal, image, confidence, and bookmark states", () => {
    assert.match(hubClient, /data-nn-premium-flashcard-convergence/, "hub convergence hook missing");
    assert.match(studyStack, /data-nn-premium-flashcard-study/, "study hook missing");
    assert.match(studyStack, /data-nn-premium-flashcard-reveal/, "reveal hook missing");
    assert.match(studyStack, /data-nn-flashcard-media="image"/, "image/lab card hook missing");
    assert.match(activeSession, /data-nn-premium-flashcard-confidence/, "confidence hook missing");
    assert.match(activeSession, /data-nn-premium-flashcard-bookmarks/, "bookmark/weak controls hook missing");
    assert.match(mcqList, /data-nn-premium-flashcard-mcq/, "MCQ flashcard hook missing");
  });

  it("keeps tactile motion mobile-safe and reduced-motion aware", () => {
    assert.match(css, /@keyframes nn-flashcard-reveal-lift/, "reveal motion keyframe missing");
    assert.match(css, /prefers-reduced-motion:\s*reduce/, "reduced-motion handling missing");
    assert.match(css, /env\(safe-area-inset-bottom/, "mobile safe-area sticky controls missing");
  });

  it("archives Figma-first PNG evidence for all required flashcard screens and themes", () => {
    for (const theme of REQUIRED_THEMES) {
      for (const prefix of REQUIRED_SCREENSHOT_PREFIXES) {
        const filePath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-desktop.png`);
        assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
      }

      const mobilePath = path.join(SCREENSHOT_DIR, `flashcard-flow-${theme}-mobile.png`);
      assert.ok(fs.existsSync(mobilePath), `${mobilePath} must exist`);
    }
  });
});
