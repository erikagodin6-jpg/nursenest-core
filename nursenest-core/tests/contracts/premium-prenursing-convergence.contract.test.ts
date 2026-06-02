/**
 * Static guard for the premium Pre-Nursing convergence pass.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-prenursing-convergence.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const PREMIUM_CSS_PATH = path.resolve(process.cwd(), "src/app/premium-redesign-2026.css");
const ACTIONS_PATH = path.resolve(process.cwd(), "src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx");
const LANDING_CLIENT_PATH = path.resolve(process.cwd(), "src/components/pre-nursing/pre-nursing-landing-client.tsx");
const HUB_MAIN_PATH = path.resolve(process.cwd(), "src/components/pre-nursing/pre-nursing-marketing-hub-main.tsx");
const SCREENSHOT_DIR = path.resolve(process.cwd(), "docs/screenshots/premium-prenursing-system");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_SCREENSHOT_PREFIXES = [
  "public-hub",
  "learner-dashboard",
  "flashcards",
  "practice-readiness",
] as const;
const REQUIRED_CATEGORIES = [
  "Anatomy & Physiology",
  "Pharmacology Basics",
  "Medical Terminology",
  "Dosage Calculations",
  "Study Skills",
  "Time Management",
  "Nursing School Preparation",
  "Fundamentals Foundations",
  "Communication Basics",
  "Safety & Infection Prevention",
  "Basic Pathophysiology",
  "Healthcare Ethics",
  "Clinical Reasoning Foundations",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium Pre-Nursing convergence", () => {
  const css = read(PREMIUM_CSS_PATH);
  const actions = read(ACTIONS_PATH);
  const landingClient = read(LANDING_CLIENT_PATH);
  const hubMain = read(HUB_MAIN_PATH);

  it("keeps all five public themes covered by the premium Pre-Nursing layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-prenursing-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("uses shared ecosystem module tokens and expanded semantic hues", () => {
    for (const token of [
      "--nn-module-clinical-pearls",
      "--nn-module-labs",
      "--nn-module-practice",
      "--nn-module-safety",
      "--nn-module-flashcards",
      "--semantic-chart-7",
      "--semantic-chart-8",
    ]) {
      assert.match(css, new RegExp(token), `${token} should be consumed by Pre-Nursing`);
    }
  });

  it("surfaces the requested category structure with title-case labels", () => {
    for (const category of REQUIRED_CATEGORIES) {
      assert.match(landingClient, new RegExp(category.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${category} missing`);
    }
  });

  it("exposes QA hooks for readiness, quick modes, categories, foundations, and module library", () => {
    assert.match(hubMain, /data-nn-qa-pre-nursing-marketing-hub/, "hub QA hook missing");
    assert.match(actions, /data-nn-premium-prenursing-hero/, "hero hook missing");
    assert.match(actions, /data-nn-premium-prenursing-readiness/, "readiness hook missing");
    assert.match(actions, /data-nn-premium-prenursing-quick-modes/, "quick modes hook missing");
    assert.match(landingClient, /data-nn-premium-prenursing-categories/, "category rail hook missing");
    assert.match(landingClient, /data-nn-premium-prenursing-foundations/, "foundations hook missing");
    assert.match(landingClient, /data-nn-premium-prenursing-module-library/, "module library hook missing");
  });

  it("keeps mobile safe-area and reduced-motion behavior in the convergence CSS", () => {
    assert.match(css, /env\(safe-area-inset-bottom/, "mobile safe-area handling missing");
    assert.match(css, /prefers-reduced-motion:\s*reduce/, "reduced-motion handling missing");
  });

  it("archives Figma-first PNG evidence for all required Pre-Nursing screens and themes", () => {
    for (const theme of REQUIRED_THEMES) {
      for (const prefix of REQUIRED_SCREENSHOT_PREFIXES) {
        const filePath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-desktop.png`);
        assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
      }

      const mobilePath = path.join(SCREENSHOT_DIR, `mobile-flow-${theme}.png`);
      assert.ok(fs.existsSync(mobilePath), `${mobilePath} must exist`);
    }
  });
});
