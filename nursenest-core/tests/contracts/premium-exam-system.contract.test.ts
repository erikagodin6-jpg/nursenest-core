/**
 * Static guard for the premium CAT + practice exam system.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-exam-system.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const EXAM_CSS_PATH = path.resolve(process.cwd(), "src/app/learner-exam-session-premium.css");
const BOARD_PARTS_PATH = path.resolve(
  process.cwd(),
  "src/components/student/practice-test-runner/practice-test-runner-board-parts.tsx",
);
const QUESTION_CARD_PATH = path.resolve(process.cwd(), "src/components/study/cat-question-card.tsx");
const BOWTIE_PATH = path.resolve(process.cwd(), "src/components/exams/questions/bowtie-question-renderer.tsx");
const ECG_MEDIA_PATH = path.resolve(process.cwd(), "src/components/study/ecg-video-question-media.tsx");
const SCREENSHOT_DIR = path.resolve(process.cwd(), "docs/screenshots/premium-exam-system");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FORMATS = [
  "mcq",
  "sata",
  "bowtie",
  "matrix",
  "ordered",
  "hotspot",
  "case",
  "ecg",
  "medcalc",
  "audio",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium exam system", () => {
  const css = read(EXAM_CSS_PATH);
  const boardParts = read(BOARD_PARTS_PATH);
  const questionCard = read(QUESTION_CARD_PATH);
  const bowtie = read(BOWTIE_PATH);
  const ecgMedia = read(ECG_MEDIA_PATH);

  it("keeps all five public themes covered by the premium exam layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
  });

  it("declares premium format tokens for all major exam question types", () => {
    for (const format of REQUIRED_FORMATS) {
      assert.match(css, new RegExp(`--nn-exam-format-${format}\\s*:`), `${format} token missing`);
    }
  });

  it("exposes QA hooks for major implemented exam renderers", () => {
    assert.match(questionCard, /data-nn-qa-exam-format="mcq"/, "MCQ hook missing");
    assert.match(questionCard, /data-nn-qa-exam-format="sata"/, "SATA hook missing");
    assert.match(bowtie, /data-nn-qa-exam-format="bowtie"/, "Bow Tie hook missing");
    assert.match(boardParts, /data-nn-qa-exam-format="hotspot"/, "clinical image/hotspot hook missing");
    assert.match(ecgMedia, /data-nn-qa-exam-format="ecg"/, "ECG hook missing");
  });

  it("archives Figma-first PNG evidence for desktop, mobile, and all five themes", () => {
    for (const theme of REQUIRED_THEMES) {
      for (const prefix of [
        "cat-active",
        "practice-active",
        "question-formats",
        "results-analytics",
      ]) {
        const filePath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-desktop.png`);
        assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
      }

      const mobilePath = path.join(SCREENSHOT_DIR, `exam-flow-${theme}-mobile.png`);
      assert.ok(fs.existsSync(mobilePath), `${mobilePath} must exist`);
    }
  });

  it("keeps CAT mode rationale-hidden language and practice remediation language documented in CSS", () => {
    assert.match(css, /CAT licensing convergence/, "CAT exam convergence section missing");
    assert.match(css, /Practice Exam convergence/, "Practice exam convergence section missing");
    assert.match(css, /No per-question rationale appears during active exam|rationale-hidden|Rationale/, "rationale treatment should stay documented");
  });
});
