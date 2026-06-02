/**
 * Allied Health learning experience parity contract.
 *
 * Run:
 *   node --import tsx --test tests/contracts/allied-health-learning-experience-parity.contract.test.ts
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import {
  ALLIED_LEARNING_PARITY_PROFILES,
  ALLIED_MARKETING_SCREENSHOT_REQUIREMENTS,
  ALLIED_PREMIUM_LAYOUT_REQUIREMENTS,
  ALLIED_RATIONALE_TEMPLATE_SECTIONS,
  buildAlliedRationaleSectionHeadings,
  getAlliedLearningParityProfile,
} from "@/lib/allied/allied-learning-parity-framework";

const ROOT = process.cwd();
const read = (rel: string) => readFileSync(path.resolve(ROOT, rel), "utf8");

const REQUIRED_PROFESSIONS = [
  "respiratory",
  "paramedic",
  "mlt",
  "occupational-therapy",
  "physiotherapy",
  "social-work",
  "psychotherapy",
  "psw-hca",
] as const;

describe("Allied Health learning experience parity", () => {
  it("defines first-class premium layout requirements for every Allied pathway", () => {
    for (const requirement of [
      "Theme-Aware Design",
      "Canonical Navigation",
      "Shared Learning Shell",
      "Progress Tracking",
      "Report Cards",
      "Analytics",
      "Subscription Gating",
      "Shared Card Layouts",
      "Accessibility Standards",
    ]) {
      assert.ok(ALLIED_PREMIUM_LAYOUT_REQUIREMENTS.includes(requirement as never), `${requirement} missing`);
    }

    const unification = read("src/lib/governance/learner-experience-unification.ts");
    assert.match(unification, /allied_health/);
    assert.match(unification, /forbiddenForks:\s*\["rn-question-layout", "np-question-layout", "allied-question-layout"/);
  });

  it("covers requested professions with hints, pearls, rationale focus, simulations, skills, and readiness domains", () => {
    for (const professionKey of REQUIRED_PROFESSIONS) {
      const profile = getAlliedLearningParityProfile(professionKey);
      assert.ok(profile, `${professionKey} missing parity profile`);
      assert.ok(profile.hintExample.length > 45, `${professionKey} hint should guide reasoning`);
      assert.doesNotMatch(profile.hintExample, /\b(answer|option [A-D]|correct is)\b/i, `${professionKey} hint reveals answer`);
      assert.ok(profile.clinicalPearlExample.length > 35, `${professionKey} pearl too thin`);
      assert.ok(profile.rationaleFocus.length >= 3, `${professionKey} rationale focus missing`);
      assert.ok(profile.simulationExamples.length >= 3, `${professionKey} simulations missing`);
      assert.ok(profile.clinicalSkills.length >= 3, `${professionKey} skills missing`);
      assert.ok(profile.readinessDomains.length >= 3, `${professionKey} readiness domains missing`);
    }

    assert.equal(ALLIED_LEARNING_PARITY_PROFILES.length >= REQUIRED_PROFESSIONS.length, true);
  });

  it("standardizes Allied premium rationale sections", () => {
    assert.deepEqual(buildAlliedRationaleSectionHeadings(), [
      "Correct Answer",
      "Why It Is Correct",
      "Why The Other Options Are Incorrect",
      "Clinical Application",
      "Exam Strategy",
      "Clinical Pearl",
      "Related Topics",
    ]);
    for (const section of ALLIED_RATIONALE_TEMPLATE_SECTIONS) {
      assert.ok(section.length > 5);
    }

    const questionClient = read("src/components/student/question-bank-practice-client.tsx");
    assert.match(questionClient, /PremiumRationalePanel/, "Allied question practice should continue using the premium rationale panel");
    assert.match(questionClient, /clinicalPearl/, "question completion must support clinical pearls");
    assert.match(questionClient, /rationaleSections/, "question completion must support structured rationale sections");
  });

  it("uses real Allied content counts instead of vague labels where inventory exists", () => {
    const overview = read("src/lib/marketing/allied-pathway-hub-overview.ts");
    assert.match(overview, /contentCounts/, "Allied hub overview must expose a count object");
    assert.match(overview, /questions:\s*questionSnapshot\.status === "ok" \? questionSnapshot\.pathwayScopedCount : null/);
    assert.match(overview, /flashcards:\s*flashcards\?\.cards \?\? null/);
    assert.match(overview, /lessons:\s*pathwayLessonCount/);
    assert.match(overview, /select:\s*\{\s*cardCount:\s*true\s*\}/s, "flashcard counts must come from deck cardCount data");
    assert.doesNotMatch(overview, />Included<|>Available<|>Ready</, "overview loader must not invent vague count labels");
  });

  it("requires dedicated profession marketing screenshots and documents no nursing screenshot reuse", () => {
    for (const requirement of [
      "Question Bank Screenshot",
      "Flashcard Screenshot",
      "Lesson Screenshot",
      "Simulation Screenshot",
      "Clinical Skills Screenshot",
      "Readiness Dashboard Screenshot",
    ]) {
      assert.ok(ALLIED_MARKETING_SCREENSHOT_REQUIREMENTS.includes(requirement as never), `${requirement} missing`);
    }

    const doc = read("docs/allied-health-learning-experience-parity.md");
    for (const phrase of [
      "All Allied Health pathways should feel like first-class NurseNest products",
      "Hint System",
      "Clinical Pearls",
      "Premium Rationales",
      "Content Counts",
      "Simulations And Clinical Skills",
      "Readiness And Report Cards",
      "Marketing Parity",
      "Dedicated Allied screenshots must not reuse nursing screenshots",
    ]) {
      assert.match(doc, new RegExp(phrase), `${phrase} missing from Allied parity doc`);
    }
  });
});
