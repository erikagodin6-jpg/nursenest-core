/**
 * Static guard for the Premium Atmospheric Ecosystem Convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-atmospheric-ecosystem-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_PATH = path.resolve(ROOT, "src/app/premium-atmospheric-ecosystem-convergence.css");
const GLOBALS_PATH = path.resolve(ROOT, "src/app/globals.css");
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-atmospheric-ecosystem-convergence.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-atmospheric-convergence");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "dashboard-richness",
  "ecosystem-richness",
  "analytics-richness",
  "lessons-richness",
  "flashcards-richness",
  "nav-branding-consistency",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium atmospheric ecosystem convergence", () => {
  const css = read(CSS_PATH);
  const globals = read(GLOBALS_PATH);

  it("imports the additive atmospheric convergence layer", () => {
    assert.match(globals, /@import "\.\/premium-atmospheric-ecosystem-convergence\.css";/, "globals.css must import the atmospheric layer");
  });

  it("keeps the homepage as the visual standard without redesigning it", () => {
    assert.match(css, /--nn-atmosphere-homepage-standard\s*:\s*1/, "homepage standard sentinel missing");
    assert.doesNotMatch(css, /\.nn-home-marketing-rich-hero\s*\{/, "atmospheric pass must not redesign the homepage hero");
  });

  it("covers all required themes, including Sunset and Aurora", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-atmospheric-ecosystem-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("declares expanded complementary palette and atmospheric depth primitives", () => {
    for (const pattern of [
      /--nn-atmosphere-mint/,
      /--nn-atmosphere-aqua/,
      /--nn-atmosphere-lavender/,
      /--nn-atmosphere-peach/,
      /--nn-atmosphere-gold/,
      /--nn-atmosphere-plum/,
      /--nn-atmosphere-dashboard/,
      /--nn-atmosphere-panel/,
      /--nn-atmosphere-brand-frame/,
      /--nn-atmosphere-tactile/,
    ]) {
      assert.match(css, pattern, `missing atmospheric primitive: ${pattern}`);
    }
  });

  it("targets dashboard, educational modules, nav, and brand/logo surfaces", () => {
    for (const pattern of [
      /nn-dash--learner-home/,
      /nn-premium-lessons-system/,
      /nn-flashcards-hub-premium/,
      /nn-exam-session-premium/,
      /nn-labs-hub/,
      /data-nn-med-calc-hub/,
      /data-nn-scenario-study-shell/,
      /nn-brand-header-logo-slot/,
      /nn-brand-learner-logo-slot/,
      /nn-header-logo-link/,
      /nn-learner-shell-primary-nav/,
      /nn-mobile-nav/,
    ]) {
      assert.match(css, pattern, `missing ecosystem target: ${pattern}`);
    }
  });

  it("declares module identity accents for study rhythm", () => {
    for (const pattern of [
      /--nn-module-lessons/,
      /--nn-module-flashcards/,
      /--nn-module-practice/,
      /--nn-module-cat/,
      /--nn-module-weak-areas/,
      /--nn-module-ecg/,
      /--nn-module-readiness/,
    ]) {
      assert.match(css, pattern, `missing module accent: ${pattern}`);
    }
  });

  it("archives PNG evidence for required atmospheric frames, viewports, and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        for (const viewport of ["desktop", "mobile"]) {
          const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-${viewport}.png`);
          assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
        }
      }
    }
  });

  it("keeps a report covering atmosphere, branding, dashboards, accessibility, and readiness", () => {
    const report = read(REPORT_PATH);
    for (const phrase of [
      "Atmosphere Improvements",
      "Expanded Palette Systems",
      "Card Differentiation Improvements",
      "Branding Improvements",
      "Dashboard Richness Improvements",
      "Screenshot Exports",
      "Accessibility Findings",
      "Unresolved Visual Inconsistencies",
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
