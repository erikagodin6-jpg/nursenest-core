/**
 * Static guard for the Premium Color Depth Convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-color-depth-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_PATH = path.resolve(ROOT, "src/app/premium-color-depth-convergence.css");
const GLOBALS_PATH = path.resolve(ROOT, "src/app/globals.css");
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-color-depth-convergence.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-color-depth-audit");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "dashboard-richness",
  "lessons-richness",
  "analytics-richness",
  "flashcard-richness",
  "cat-practice-richness",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium color depth convergence", () => {
  const css = read(CSS_PATH);
  const globals = read(GLOBALS_PATH);

  it("imports the additive color-depth convergence layer", () => {
    assert.match(globals, /@import "\.\/premium-color-depth-convergence\.css";/, "globals.css must import the color-depth layer");
  });

  it("keeps all five required themes covered, including Sunset and Aurora", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-color-depth-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("declares ambient gradients, complementary accents, layered surfaces, and premium shadows", () => {
    for (const pattern of [
      /--nn-depth-ambient/,
      /radial-gradient/,
      /--nn-depth-surface/,
      /--nn-depth-surface-alt/,
      /--nn-depth-shadow/,
      /--nn-depth-shadow-hover/,
      /--nn-depth-chart-a/,
      /--nn-depth-chart-e/,
      /color-mix\(in srgb, var\(--semantic-/,
    ]) {
      assert.match(css, pattern, `missing color-depth primitive: ${pattern}`);
    }
  });

  it("targets ecosystem surfaces without changing routing, data, or entitlement code", () => {
    for (const pattern of [
      /data-nn-premium-full-platform-convergence/,
      /nn-premium-auth-system/,
      /nn-premium-lessons-system/,
      /nn-flashcards-hub-premium/,
      /nn-dash--learner-home/,
      /nn-labs-hub/,
      /data-nn-med-calc-hub/,
      /data-nn-scenario-study-shell/,
    ]) {
      assert.match(css, pattern, `missing ecosystem target: ${pattern}`);
    }
  });

  it("archives PNG evidence for required color-depth frames, viewports, and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        for (const viewport of ["desktop", "mobile"]) {
          const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-${viewport}.png`);
          assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
        }
      }
    }
  });

  it("keeps a report covering theme richness, accessibility, unresolved issues, and App Store readiness", () => {
    const report = read(REPORT_PATH);
    for (const phrase of [
      "Theme Enhancements",
      "Complementary Color Systems Added",
      "Flatness Issues Fixed",
      "Analytics Palette Improvements",
      "Screenshot Exports",
      "Accessibility Findings",
      "Unresolved Visual Issues",
      "App Store Visual Readiness Observations",
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
