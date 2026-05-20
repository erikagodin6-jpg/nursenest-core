/**
 * Static guard for the Premium Mobile Study Experience Audit.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-mobile-study-experience-audit.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_PATH = path.resolve(ROOT, "src/app/premium-mobile-study-experience-audit.css");
const GLOBALS_PATH = path.resolve(ROOT, "src/app/globals.css");
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-mobile-study-experience-audit.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-mobile-study-audit");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "dashboard-mobile",
  "lessons-mobile",
  "flashcards-mobile",
  "cat-exams-mobile",
  "practice-exams-mobile",
  "readiness-analytics-mobile",
  "auth-mobile",
  "settings-mobile",
  "ecg-mobile",
  "allied-health-mobile",
  "new-grad-mobile",
  "pre-nursing-mobile",
  "mobile-nav",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium mobile study experience audit", () => {
  const css = read(CSS_PATH);
  const globals = read(GLOBALS_PATH);

  it("imports the additive mobile study audit layer", () => {
    assert.match(globals, /@import "\.\/premium-mobile-study-experience-audit\.css";/, "globals.css must import the mobile study layer");
  });

  it("covers all five required themes, including Sunset and Aurora", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-mobile-study-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("declares mobile overlap, safe-area, tap-target, keyboard, and reading primitives", () => {
    for (const pattern of [
      /--nn-mobile-study-safe-bottom/,
      /--nn-mobile-study-safe-top/,
      /--nn-mobile-study-tap-target/,
      /--nn-mobile-study-sticky-reserve/,
      /env\(safe-area-inset-bottom/,
      /overflow-x:\s*clip/,
      /scroll-padding-bottom/,
      /max-height:\s*calc\(100dvh/,
      /font-size:\s*max\(1rem,\s*16px\)/,
      /text-wrap:\s*pretty/,
    ]) {
      assert.match(css, pattern, `missing mobile primitive: ${pattern}`);
    }
  });

  it("targets brand, logo, nav, study, clinical, and pathway mobile surfaces", () => {
    for (const pattern of [
      /nn-brand-header-logo-slot/,
      /nn-brand-learner-logo-slot/,
      /nn-header-logo-link/,
      /nn-learner-shell-sticky/,
      /nn-learner-shell-bottom-scroll/,
      /nn-mobile-nav/,
      /nn-premium-lessons-system/,
      /nn-flashcards-hub-premium/,
      /nn-practice-session/,
      /nn-exam-session-premium/,
      /nn-labs-hub/,
      /data-nn-med-calc-hub/,
      /data-nn-scenario-study-shell/,
      /nn-pre-nursing-marketing-hub/,
      /nn-new-grad-hub/,
      /nn-allied-health-hub/,
    ]) {
      assert.match(css, pattern, `missing mobile target: ${pattern}`);
    }
  });

  it("preserves focused CAT exam isolation while preventing sticky overlap", () => {
    assert.match(css, /nn-cat-question-card--exam-stack/, "CAT exam stack mobile guard missing");
    assert.match(css, /nn-cat-question-card__exam-footer--anchored/, "CAT anchored footer guard missing");
    assert.match(css, /max-width:\s*min\(46vw,\s*10rem\)/, "focused exam logo minimization guard missing");
  });

  it("archives mobile-first PNG evidence for required frames and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-mobile.png`);
        assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
      }
    }
  });

  it("keeps a report covering fixes, branding, evidence, tests, unresolved issues, and readiness", () => {
    const report = read(REPORT_PATH);
    for (const phrase of [
      "Overlap Fixes",
      "Mobile UX Fixes",
      "Branding Consistency Fixes",
      "Aesthetic Cohesion Fixes",
      "Screenshots Exported",
      "Tests Run",
      "Unresolved Issues",
      "App Store Mobile Readiness Observations",
      "Ocean",
      "Blossom",
      "Midnight",
      "Sunset",
      "Aurora",
      "truthpack JSON could not be consulted",
    ]) {
      assert.match(report, new RegExp(phrase), `${phrase} missing from report`);
    }
  });
});
