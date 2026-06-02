/**
 * Static guard for Premium Allied Health + New Grad convergence.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-allied-newgrad-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const CSS_PATH = path.resolve(ROOT, "src/app/premium-allied-newgrad-convergence.css");
const GLOBALS_PATH = path.resolve(ROOT, "src/app/globals.css");
const ALLIED_HUB_PATH = path.resolve(ROOT, "src/components/marketing/allied-health-pathway-hub.tsx");
const NEW_GRAD_HUB_PATH = path.resolve(ROOT, "src/components/marketing/nursing-tier-hub-page.tsx");
const REGISTRY_PATH = path.resolve(ROOT, "src/lib/allied/allied-professions-registry.ts");
const REPORT_PATH = path.resolve(ROOT, "docs/reports/premium-allied-newgrad-convergence.md");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-allied-newgrad-convergence");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_FRAME_GROUPS = [
  "allied-health-hub",
  "allied-learner-dashboard",
  "allied-lessons",
  "allied-flashcards",
  "allied-practice-exams",
  "new-grad-hub",
  "new-grad-dashboard",
  "new-grad-readiness-analytics",
] as const;
const REQUIRED_PROFESSION_KEYS = [
  "mlt",
  "paramedic",
  "occupational-therapy",
  "social-work",
  "psychotherapy",
  "psw-hca",
  "respiratory",
  "physiotherapy",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium Allied Health and New Grad convergence", () => {
  const css = read(CSS_PATH);
  const globals = read(GLOBALS_PATH);
  const alliedHub = read(ALLIED_HUB_PATH);
  const newGradHub = read(NEW_GRAD_HUB_PATH);
  const registry = read(REGISTRY_PATH);

  it("imports the additive Allied/New Grad convergence layer", () => {
    assert.match(globals, /@import "\.\/premium-allied-newgrad-convergence\.css";/, "globals.css must import the convergence layer");
  });

  it("covers all five required themes, including Sunset and Aurora", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-allied-newgrad-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("keeps Allied profession registry coverage for requested supported professions", () => {
    for (const key of REQUIRED_PROFESSION_KEYS) {
      assert.match(registry, new RegExp(`professionKey:\\s*"${key}"`), `${key} must exist in ALLIED_PROFESSIONS`);
    }
  });

  it("adds shared convergence hooks without changing alliedProfessionKey routing helpers", () => {
    assert.match(alliedHub, /data-nn-allied-pathway-hub="1"/, "Allied root hook missing");
    assert.match(alliedHub, /data-nn-allied-newgrad-convergence="allied"/, "Allied convergence hook missing");
    assert.match(alliedHub, /alliedProfessionKey=\{profKey \|\| null\}/, "alliedProfessionKey must still flow into premium modules");
    assert.match(alliedHub, /withAlliedProfessionMarketingQuery/, "Allied profession query scoping must remain");
    assert.match(newGradHub, /nn-premium-pathway-hub--new-grad nn-new-grad-hub/, "New Grad class hook missing");
    assert.match(newGradHub, /data-nn-new-grad-convergence=\{isNewGradHub \? "1" : undefined\}/, "New Grad convergence hook missing");
  });

  it("normalizes high-confidence Allied labels to Title Case", () => {
    for (const phrase of [
      "Practice Questions",
      "Live Pathway Snapshot",
      "Live Inventory",
      "Practice Exam Ready",
      "Choose Your Allied Health Track",
      "Open Study Hub",
      "Study Modes",
      "Lessons by Category",
    ]) {
      assert.match(alliedHub, new RegExp(phrase), `${phrase} missing`);
    }
    for (const phrase of [
      "Practice questions",
      "Live pathway snapshot",
      "live inventory",
      "Practice exam ready",
      "Open study hub",
      "Study modes",
      "Lessons by category",
    ]) {
      assert.doesNotMatch(alliedHub, new RegExp(`>${phrase}<|title="${phrase}"`), `${phrase} should not remain as a visible exact label`);
    }
  });

  it("declares premium parity primitives for layout, cards, mobile, motion, and theme depth", () => {
    for (const pattern of [
      /--nn-allied-newgrad-panel/,
      /--nn-allied-newgrad-newgrad-panel/,
      /--nn-allied-newgrad-shadow/,
      /--nn-allied-newgrad-radius/,
      /nn-nursing-tier-hub-hero-band/,
      /nn-hub-tier-study-band/,
      /nn-qa-pathway-lessons-grid/,
      /nn-exam-hub-study-card--lessons/,
      /nn-exam-hub-study-card--flashcards/,
      /nn-exam-hub-study-card--practice/,
      /nn-exam-hub-study-card--cat/,
      /prefers-reduced-motion/,
      /overflow-x:\s*clip/,
    ]) {
      assert.match(css, pattern, `missing parity primitive: ${pattern}`);
    }
  });

  it("archives Figma-first PNG evidence for frame groups, viewports, and themes", () => {
    for (const group of REQUIRED_FRAME_GROUPS) {
      for (const theme of REQUIRED_THEMES) {
        for (const viewport of ["desktop", "mobile"]) {
          const filePath = path.join(SCREENSHOT_DIR, `${group}-${theme}-${viewport}.png`);
          assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
        }
      }
    }
  });

  it("keeps a report with audit, theme, route, evidence, unresolved, and readiness sections", () => {
    const report = read(REPORT_PATH);
    for (const phrase of [
      "Professions Audited",
      "Layouts Normalized",
      "Theme Coverage",
      "Capitalization Fixes",
      "Route Validation",
      "Screenshot Exports",
      "Tests Run",
      "Unresolved Issues",
      "App Store Readiness Observations",
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
