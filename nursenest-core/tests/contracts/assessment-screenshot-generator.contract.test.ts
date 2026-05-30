import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const ROOT = process.cwd();
const SCRIPT = join(ROOT, "scripts", "generate-assessment-screenshots.ts");
const source = readFileSync(SCRIPT, "utf8");

describe("assessment marketing screenshot generator", () => {
  it("plans captures for every required learner activity area", () => {
    for (const category of [
      "cat",
      "practice-exams",
      "flashcards",
      "clinical-skills",
      "pharmacology",
      "ecg",
      "loft",
      "tier-showcase",
      "learner-journey",
      "clinical-judgment-showcase",
      "simulation-showcase",
      "ecg-marketing",
      "pricing-assets",
      "marketing-composites",
      "qa-visual-regression",
    ]) {
      assert.match(source, new RegExp(`category: "${category}"`), `${category} capture specs must exist`);
    }
  });

  it("defines tier-specific showcase folders and pricing assets", () => {
    for (const tier of ["rn", "rpn", "np", "allied", "rt", "new-grad", "ecg", "advanced-ecg"]) {
      assert.match(source, new RegExp(`${tier}`), `${tier} tier must be represented`);
      assert.match(source, new RegExp(`pricing-\\$\\{tier\\}|pricing-${tier}`), `${tier} pricing capture must be planned`);
    }

    assert.match(source, /outputSubdir: `tiers\/\$\{tier\}`/, "tier captures must output to marketing-assets/screenshots/tiers/{tier}");
    assert.match(source, /marketing-composites\/sources\/\$\{tier\}/, "composite sources must be grouped by tier");
  });

  it("plans the full learner journey sequence", () => {
    for (const step of [
      "landing-page",
      "tier-selection",
      "hub-selection",
      "choose-activity",
      "question-screen",
      "submit-answer",
      "view-rationale",
      "continue-studying",
      "analytics",
      "improvement-dashboard",
      "weak-area-remediation",
      "return-to-learning",
    ]) {
      assert.match(source, new RegExp(step), `${step} journey capture missing`);
    }

    assert.match(source, /outputSubdir: `learner-journey\/\$\{vp\}`/, "journey screenshots must be grouped by viewport");
  });

  it("covers major CAT and practice-exam interaction types", () => {
    for (const slug of [
      "mcq",
      "sata",
      "bowtie",
      "matrix",
      "case-study",
      "prioritization",
      "sequencing",
      "delegation",
      "clinical-judgment",
      "trend-interpretation",
      "medication-calculation",
      "hotspot",
      "drag-drop",
    ]) {
      assert.match(source, new RegExp(`cat-\\$\\{format\\.slug\\}|cat-${slug}|practice-exam-${slug}`), `${slug} coverage missing`);
    }
  });

  it("captures required themes, viewports, and marketing crop presets", () => {
    for (const theme of ["ocean", "blossom", "midnight"]) {
      assert.match(source, new RegExp(`"${theme}"`), `${theme} theme must be included`);
    }

    for (const viewport of ["desktop", "tablet", "mobile"]) {
      assert.match(source, new RegExp(`${viewport}: \\{ width:`), `${viewport} viewport must be defined`);
    }

    for (const crop of [
      "landscape-hd",
      "landscape-social",
      "social-square",
      "portrait-story",
      "instagram-portrait",
      "linkedin-square",
      "facebook-square",
      "open-graph",
      "hero",
    ]) {
      assert.match(source, new RegExp(`"${crop}"`), `${crop} crop preset must be defined`);
    }
  });

  it("rejects loading/error captures and writes audit artifacts", () => {
    for (const blocked of ["Just a moment", "Loading", "Please wait", "Fetching", "Application error"]) {
      assert.match(source, new RegExp(`"${blocked}"`), `${blocked} must remain a blocked capture phrase`);
    }

    assert.match(source, /writeValidationReport/, "validation report must be generated");
    assert.match(source, /writeAuditCoverageReport/, "coverage report must be generated");
    assert.match(source, /writeQaVisualReport/, "QA visual regression report must be generated");
    assert.match(source, /gallery", "index\.html"/, "gallery HTML must be generated");
    assert.match(source, /qa-visual-report\.html/, "QA visual report file must be written");
  });

  it("upgrades the executive review gallery workflow", () => {
    for (const filter of ["Tier", "Theme", "Device", "Activity", "Question Type", "Marketing Asset", "Simulation", "ECG"]) {
      assert.match(source, new RegExp(filter), `${filter} filter must exist in gallery`);
    }

    for (const status of ["Pending", "Approved", "Needs Revision"]) {
      assert.match(source, new RegExp(status), `${status} approval workflow state missing`);
    }

    for (const checklist of ["Branding visible", "Theme colors present", "No clipping", "No overlap", "Mobile compliant", "Readable text", "Accurate content", "Production-ready"]) {
      assert.match(source, new RegExp(checklist), `${checklist} review checklist item missing`);
    }
  });
});
