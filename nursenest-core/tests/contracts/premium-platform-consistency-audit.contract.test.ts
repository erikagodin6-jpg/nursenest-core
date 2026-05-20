/**
 * Static guard for the Premium Platform Consistency Audit.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-platform-consistency-audit.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-platform-consistency-audit.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-platform-consistency-audit");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "lessons",
  "flashcards",
  "cat-exams",
  "practice-exams",
  "dashboard-learner-cockpit",
  "report-cards-readiness",
  "auth",
  "settings-billing",
  "allied-health",
  "new-grad",
  "pre-nursing",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium platform consistency audit", () => {
  const report = read(REPORT_PATH);

  it("contains the required audit sections", () => {
    for (const heading of [
      "Capitalization And Copy Inventory",
      "Placeholder And Weak Copy Findings",
      "Official Naming Findings",
      "Visual Cohesion Findings",
      "Theme Parity Findings",
      "Mobile UX Findings",
      "Figma-First PNG Evidence",
      "Automated Audit Guards",
      "Unresolved Inconsistencies",
      "App Store Readiness Observations",
      "Prioritized Implementation Backlog",
    ]) {
      assert.match(report, new RegExp(`## ${heading}`), `${heading} section missing`);
    }
  });

  it("tracks high-signal capitalization and label findings", () => {
    for (const phrase of [
      "Clinical Scenarios",
      "Medication Calculations",
      "Practice Questions",
      "Open Lesson",
      "Weak Areas",
      "OSCE Station Library",
      "No Cards Match This Combination",
      "Search Lessons",
    ]) {
      assert.match(report, new RegExp(phrase), `${phrase} finding missing`);
    }
  });

  it("preserves official exam and pathway naming rules in the report", () => {
    for (const term of [
      "NCLEX-RN",
      "REx-PN",
      "NCLEX-PN",
      "CNPLE",
      "FNP",
      "AGPCNP",
      "PMHNP",
      "WHNP",
      "PNP-PC",
      "Pre-Nursing",
      "New Grad",
      "Allied Health",
    ]) {
      assert.match(report, new RegExp(term), `${term} naming rule missing`);
    }
  });

  it("archives PNG evidence for all audit frame groups, viewports, and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        for (const viewport of ["desktop", "mobile"]) {
          const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-${viewport}.png`);
          assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
        }
      }
    }
  });

  it("documents theme, mobile, and audit-only constraints", () => {
    for (const phrase of [
      "Ocean",
      "Blossom",
      "Midnight",
      "Sunset",
      "Aurora",
      "safe-area",
      "Horizontal overflow",
      "Copy fixes are recommended but not applied",
      "truthpack JSON could not be consulted",
    ]) {
      assert.match(report, new RegExp(phrase), `${phrase} constraint missing`);
    }
  });
});
