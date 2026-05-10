/**
 * Static guard for the premium Lessons convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-lessons-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const PREMIUM_CSS_PATH = path.resolve(ROOT, "src/app/premium-redesign-2026.css");
const SHELL_PATH = path.resolve(ROOT, "src/components/pathway-lessons/lessons-page-shell.tsx");
const DETAIL_BODY_PATH = path.resolve(
  ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);
const DETAIL_HEADER_PATH = path.resolve(ROOT, "src/components/lessons/pathway-lesson-detail-header.tsx");
const SECTION_NAV_PATH = path.resolve(ROOT, "src/components/lessons/lesson-section-nav.tsx");
const SECTION_THEME_PATH = path.resolve(ROOT, "src/lib/ui/lesson-section-theme.ts");
const STUDY_RAIL_PATH = path.resolve(ROOT, "src/components/lessons/pathway-lesson-study-rail.tsx");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-lessons-system");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_SCREENSHOT_PREFIXES = [
  "lessons-hub",
  "lesson-reading",
  "weak-area-linked-lessons",
  "progress-tracking",
] as const;
const REQUIRED_SECTION_LABELS = [
  "Clinical Pearls",
  "Pathophysiology",
  "Labs & Diagnostics",
  "Pharmacology & Treatment",
  "Nursing Interventions",
  "Patient Education",
  "Red Flags",
  "Exam Focus",
  "Next Steps",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium Lessons convergence", () => {
  const css = read(PREMIUM_CSS_PATH);
  const shell = read(SHELL_PATH);
  const detailBody = read(DETAIL_BODY_PATH);
  const detailHeader = read(DETAIL_HEADER_PATH);
  const sectionNav = read(SECTION_NAV_PATH);
  const sectionTheme = read(SECTION_THEME_PATH);
  const studyRail = read(STUDY_RAIL_PATH);

  it("keeps all five required themes covered by the premium Lessons layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-lessons-theme-covered\s*:\s*1/, "Lessons theme coverage sentinel missing");
  });

  it("uses shared semantic/module tokens instead of hardcoded product colors", () => {
    for (const token of [
      "--nn-module-clinical-pearls",
      "--nn-module-readiness",
      "--nn-module-practice",
      "--nn-module-flashcards",
      "--nn-module-labs",
      "--semantic-chart-7",
      "--semantic-chart-8",
    ]) {
      assert.match(css, new RegExp(token), `${token} should be consumed by Lessons`);
    }
  });

  it("exposes premium Lessons QA hooks for hub, hero, reading, section system, nav, rail, and linked learning", () => {
    assert.match(shell, /data-nn-premium-lessons-system/, "hub system hook missing");
    assert.match(shell, /data-nn-premium-lessons-hero/, "hub hero hook missing");
    assert.match(shell, /data-nn-premium-lessons-hub-body/, "hub body hook missing");
    assert.match(detailHeader, /data-nn-premium-lessons-reading-hero/, "reading hero hook missing");
    assert.match(detailBody, /data-nn-premium-lessons-reading-layout/, "reading layout hook missing");
    assert.match(detailBody, /data-nn-premium-lessons-section-system/, "section system hook missing");
    assert.match(detailBody, /data-nn-premium-lessons-study-rail/, "study rail hook missing");
    assert.match(detailBody, /data-nn-premium-lessons-linked-learning/, "linked learning hook missing");
    assert.match(sectionNav, /data-nn-premium-lessons-on-this-page/, "On This Page hook missing");
    assert.match(sectionNav, /data-nn-premium-lessons-mobile-nav/, "mobile nav hook missing");
  });

  it("surfaces the requested Title Case lesson section vocabulary", () => {
    for (const label of REQUIRED_SECTION_LABELS) {
      assert.match(sectionTheme, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} missing`);
    }
    for (const label of ["Study Progress", "Study Time", "Quick Recall", "Exam Readiness", "Related Practice"]) {
      assert.match(studyRail, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} missing`);
    }
  });

  it("keeps mobile safe-area, sticky/collapsible nav, and reduced-motion behavior in CSS", () => {
    assert.match(css, /env\(safe-area-inset-bottom/, "mobile safe-area handling missing");
    assert.match(css, /data-nn-premium-lessons-mobile-nav/, "mobile nav styling missing");
    assert.match(css, /prefers-reduced-motion:\s*reduce/, "reduced-motion handling missing");
    assert.match(css, /scroll-padding-top:\s*6rem/, "section scroll offset missing");
  });

  it("archives Figma-first PNG evidence for all required Lessons screens and themes", () => {
    for (const theme of REQUIRED_THEMES) {
      for (const prefix of REQUIRED_SCREENSHOT_PREFIXES) {
        const filePath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-desktop.png`);
        assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
      }

      const mobilePath = path.join(SCREENSHOT_DIR, `mobile-lesson-view-${theme}.png`);
      assert.ok(fs.existsSync(mobilePath), `${mobilePath} must exist`);
    }
  });
});
