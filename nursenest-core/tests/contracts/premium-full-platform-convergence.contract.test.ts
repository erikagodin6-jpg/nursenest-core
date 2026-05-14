/**
 * Static guard for the full platform premium convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-full-platform-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_PATH = path.resolve(ROOT, "src/app/full-platform-convergence.css");
const GLOBALS_PATH = path.resolve(ROOT, "src/app/globals.css");
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-full-platform-convergence.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-full-platform-convergence");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "exam-study-system",
  "learner-cockpit",
  "account-platform",
  "clinical-modules",
  "admin-preview",
] as const;
const REQUIRED_MODULE_FILES = [
  ["practice-tests", "src/components/student/practice-tests-hub-client.tsx"],
  ["practice-tests", "src/components/flashcards/flashcards-pathway-pick-surface.tsx"],
  ["practice-tests", "src/components/student/learner-np-exam-practice-pick-surface.tsx"],
  ["cat", "src/components/student/pathway-cat-session-start-client.tsx"],
  ["lessons", "src/app/(student)/app/(learner)/lessons/page.tsx"],
  ["exam-session", "src/components/exam/exam-session-shell.tsx"],
  ["practice-session", "src/components/study/practice-session-layout.tsx"],
  ["flashcards", "src/components/flashcards/flashcards-hub-client.tsx"],
  ["learner-dashboard", "src/components/student/learner-dashboard-page-shell.tsx"],
  ["billing", "src/components/student/learner-billing-page-content.tsx"],
  ["account-deletion", "src/components/account/account-delete-danger-zone.tsx"],
  ["ecg", "src/components/ecg-module/ecg-module-page.tsx"],
  ["labs", "src/components/labs/labs-hub-page.tsx"],
  ["med-calculations", "src/components/med-calculations/med-calculations-hub-page.tsx"],
  ["clinical-scenarios", "src/components/scenarios/ScenarioStudyShell.tsx"],
  ["admin-dashboard", "src/components/admin/admin-dashboard-overview.tsx"],
  ["admin-clinical-scenarios", "src/app/(admin)/admin/clinical-scenarios/page.tsx"],
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium full platform convergence", () => {
  const css = read(CSS_PATH);
  const globals = read(GLOBALS_PATH);

  it("imports the additive full-platform convergence layer", () => {
    assert.match(globals, /@import "\.\/full-platform-convergence\.css";/, "globals.css must import the convergence layer");
  });

  it("keeps all five required public themes covered", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-platform-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("declares shared layout, touch, mobile, sticky, focus, and reduced-motion primitives", () => {
    for (const pattern of [
      /--nn-platform-radius-card/,
      /--nn-platform-gap-section/,
      /--nn-platform-touch-target/,
      /focus-visible/,
      /env\(safe-area-inset-bottom/,
      /overflow-x:\s*clip/,
      /prefers-reduced-motion:\s*reduce/,
      /data-nn-premium-platform-sticky-controls/,
    ]) {
      assert.match(css, pattern, `missing platform primitive: ${pattern}`);
    }
  });

  it("covers every plan family with platform hooks", () => {
    for (const family of ["exam-study", "learner-account", "clinical", "admin-preview"]) {
      assert.match(css, new RegExp(`data-nn-premium-platform-family="${family}"`), `${family} family styling missing`);
    }
  });

  it("adds representative module hooks across study, account, clinical, and admin surfaces", () => {
    for (const [module, relativePath] of REQUIRED_MODULE_FILES) {
      const source = read(path.resolve(ROOT, relativePath));
      assert.match(source, /data-nn-premium-full-platform-convergence/, `${relativePath} missing root convergence hook`);
      assert.match(source, /data-nn-premium-platform-family/, `${relativePath} missing family hook`);
      assert.match(source, new RegExp(`data-nn-premium-platform-module="${module}"|data-nn-premium-platform-module=\\{`), `${relativePath} missing module hook for ${module}`);
    }
  });

  it("archives Figma-first PNG evidence for required frame groups, viewports, and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        for (const viewport of ["desktop", "mobile"]) {
          const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-${viewport}.png`);
          assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
        }
      }
    }
  });

  it("keeps a module-by-module audit report with unresolved risk tracking", () => {
    const report = read(REPORT_PATH);
    for (const phrase of [
      "Module Audit Matrix",
      "Exam / Study Systems",
      "Learner Cockpit And Account Platform",
      "Clinical Modules",
      "Admin And Preview Cohesion",
      "Unresolved Issues",
      "Truthpack Constraint",
    ]) {
      assert.match(report, new RegExp(phrase), `${phrase} missing from report`);
    }
  });
});
