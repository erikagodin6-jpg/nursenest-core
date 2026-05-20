/**
 * Static guard for the premium individual lesson reading-page redesign.
 *
 * Run from `nursenest-core/`:
 *   node --import tsx --test tests/contracts/premium-individual-lesson-redesign.contract.test.ts
 */
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const PREMIUM_CSS_PATH = path.resolve(ROOT, "src/app/premium-redesign-2026.css");
const DETAIL_BODY_PATH = path.resolve(
  ROOT,
  "src/app/(marketing)/(default)/[locale]/[slug]/[examCode]/lessons/[lessonSlug]/pathway-lesson-detail-page-body.tsx",
);
const DETAIL_HEADER_PATH = path.resolve(ROOT, "src/components/lessons/pathway-lesson-detail-header.tsx");
const SECTION_CARD_PATH = path.resolve(ROOT, "src/components/lessons/lesson-section-card.tsx");
const SECTION_NAV_PATH = path.resolve(ROOT, "src/components/lessons/lesson-section-nav.tsx");
const SECTION_THEME_PATH = path.resolve(ROOT, "src/lib/ui/lesson-section-theme.ts");
const ACTIONS_PATH = path.resolve(ROOT, "src/components/lessons/pathway-lesson-actions.tsx");
const PROGRESS_PATH = path.resolve(ROOT, "src/components/lessons/lesson-study-phase-progress.tsx");
const SCREENSHOT_DIR = path.resolve(ROOT, "docs/screenshots/premium-individual-lessons");

const REQUIRED_THEMES = ["ocean", "blossom", "midnight", "sunset", "aurora"] as const;
const REQUIRED_SCREENSHOT_PREFIXES = [
  "lesson-reading",
  "ecg-lesson",
  "section-system",
  "linked-learning",
] as const;
const REQUIRED_SECTION_LABELS = [
  "Pathophysiology",
  "Clinical Pearls",
  "Labs & Diagnostics",
  "Pharmacology & Treatment",
  "Nursing Interventions",
  "Patient Education",
  "Safety Considerations",
  "Priority Actions",
  "ECG Concepts",
  "NGN Clinical Judgment",
  "Communication",
  "Documentation",
  "Delegation",
  "Cultural Considerations",
] as const;
const REQUIRED_RECOMMENDATIONS = [
  "Review Flashcards",
  "Practice Related Questions",
  "Continue Weak Area Recovery",
  "Recommended Next Lesson",
  "Take A Readiness Quiz",
] as const;

function read(filePath: string): string {
  return fs.readFileSync(filePath, "utf8");
}

describe("premium individual lesson redesign", () => {
  const css = read(PREMIUM_CSS_PATH);
  const detailBody = read(DETAIL_BODY_PATH);
  const detailHeader = read(DETAIL_HEADER_PATH);
  const sectionCard = read(SECTION_CARD_PATH);
  const sectionNav = read(SECTION_NAV_PATH);
  const sectionTheme = read(SECTION_THEME_PATH);
  const actions = read(ACTIONS_PATH);
  const progress = read(PROGRESS_PATH);

  it("keeps all five required themes covered by the lesson reading layer", () => {
    for (const theme of REQUIRED_THEMES) {
      assert.match(css, new RegExp(`html\\[data-theme="${theme}"\\]`), `${theme} must be covered`);
    }
    assert.match(css, /--nn-lessons-theme-covered\s*:\s*1/, "theme coverage sentinel missing");
  });

  it("adds individual lesson hooks for metadata, progress, actions, recommendations, TOC, and section system", () => {
    assert.match(detailHeader, /data-nn-premium-individual-lesson-header-meta/, "header metadata hook missing");
    assert.match(progress, /data-nn-premium-individual-lesson-progress/, "progress hook missing");
    assert.match(actions, /data-nn-premium-individual-lesson-actions/, "sticky action hook missing");
    assert.match(actions, /data-nn-premium-individual-lesson-recommendations/, "recommendation hook missing");
    assert.match(detailBody, /data-nn-premium-lessons-section-system/, "section system hook missing");
    assert.match(sectionNav, /data-nn-premium-lessons-on-this-page/, "TOC hook missing");
    assert.match(sectionCard, /getLessonSectionTheme\(kind, heading\)/, "heading-aware section mapper missing");
  });

  it("surfaces required premium section labels and recommendation CTAs", () => {
    for (const label of REQUIRED_SECTION_LABELS) {
      assert.match(sectionTheme, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} missing`);
    }
    for (const label of REQUIRED_RECOMMENDATIONS) {
      assert.match(actions, new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")), `${label} missing`);
    }
  });

  it("keeps styling token-driven with mobile safe-area and reduced-motion support", () => {
    for (const token of [
      "--nn-module-clinical-pearls",
      "--nn-module-readiness",
      "--nn-module-practice",
      "--nn-module-flashcards",
      "--nn-module-labs",
      "--semantic-chart-7",
      "--semantic-chart-8",
    ]) {
      assert.match(css, new RegExp(token), `${token} should be consumed`);
    }
    assert.match(css, /env\(safe-area-inset-bottom/, "safe-area handling missing");
    assert.match(css, /prefers-reduced-motion:\s*reduce/, "reduced-motion handling missing");
    assert.match(css, /data-nn-premium-individual-lesson-actions/, "sticky controls styling missing");
  });

  it("archives Figma-first PNG evidence for all required individual lesson screens and themes", () => {
    for (const theme of REQUIRED_THEMES) {
      for (const prefix of REQUIRED_SCREENSHOT_PREFIXES) {
        const filePath = path.join(SCREENSHOT_DIR, `${prefix}-${theme}-desktop.png`);
        assert.ok(fs.existsSync(filePath), `${filePath} must exist`);
      }

      const mobilePath = path.join(SCREENSHOT_DIR, `lesson-reading-${theme}-mobile.png`);
      assert.ok(fs.existsSync(mobilePath), `${mobilePath} must exist`);
    }
  });
});
