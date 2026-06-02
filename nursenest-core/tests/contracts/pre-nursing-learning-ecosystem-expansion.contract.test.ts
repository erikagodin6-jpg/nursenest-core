import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  PRE_NURSING_CATEGORIES,
  PRE_NURSING_LEARNING_FLOW,
  PRE_NURSING_LESSON_QUALITY_STANDARD,
  PRE_NURSING_PATHWAY_PROGRESSION,
  PRE_NURSING_QUESTION_REQUIREMENTS,
} from "../../src/lib/pre-nursing/pre-nursing-learning-ecosystem";

const ROOT = process.cwd();
const src = (rel: string): string => readFileSync(join(ROOT, rel), "utf8");

const REQUIRED_CATEGORIES = [
  "Anatomy & Physiology",
  "Medical Terminology",
  "Pathophysiology Foundations",
  "Pharmacology Foundations",
  "Chemistry",
  "Biology",
  "Microbiology",
  "Health Assessment Foundations",
  "Dosage Calculation Foundations",
  "Healthcare Ethics",
  "Communication & Documentation",
  "Study Skills for Nursing School",
] as const;

describe("Pre-Nursing learning ecosystem expansion", () => {
  it("defines all required foundational categories with lessons, questions, readiness, hints, and study pearls", () => {
    const byTitle = new Map(PRE_NURSING_CATEGORIES.map((category) => [category.title, category]));
    for (const title of REQUIRED_CATEGORIES) {
      const category = byTitle.get(title);
      assert.ok(category, `${title} missing from Pre-Nursing category architecture`);
      assert.ok(category.lessonSlugs.length >= 1, `${title} must map to at least one lesson module`);
      assert.ok(category.questionFocus.length >= 2, `${title} must define practice question focus`);
      assert.match(category.readinessLabel, /Readiness/);
      assert.ok(category.studyPearl.length > 35, `${title} needs a useful study pearl`);
      assert.ok(category.hintExample.length > 25, `${title} needs a reasoning-oriented hint example`);
    }
  });

  it("expands A&P, terminology, pathophysiology, and pharmacology into their required subdomains", () => {
    const bySlug = new Map(PRE_NURSING_CATEGORIES.map((category) => [category.slug, category]));
    assert.deepEqual(bySlug.get("anatomy-physiology")!.systems, [
      "Cardiovascular",
      "Respiratory",
      "Neurological",
      "Endocrine",
      "Renal",
      "Gastrointestinal",
      "Musculoskeletal",
      "Immune",
      "Integumentary",
      "Reproductive",
    ]);
    assert.deepEqual(bySlug.get("medical-terminology")!.terminologyTracks, [
      "Prefixes",
      "Suffixes",
      "Root Words",
      "Body Systems",
      "Procedures",
      "Diseases",
      "Diagnostics",
    ]);
    assert.ok(bySlug.get("pathophysiology-foundations")!.pathophysiologyTracks?.includes("Acid-Base Balance"));
    assert.ok(bySlug.get("pharmacology-foundations")!.pharmacologyTracks?.includes("Medication Administration Principles"));
  });

  it("keeps the public hub lesson-first and removes CAT/readiness exam positioning", () => {
    const actions = src("src/components/pre-nursing/pre-nursing-marketing-hub-actions.tsx");
    const main = src("src/components/pre-nursing/pre-nursing-marketing-hub-main.tsx");
    assert.deepEqual(PRE_NURSING_LEARNING_FLOW.map((step) => step.label), ["Learn", "Review", "Practice", "Master"]);
    assert.match(actions, /Lesson-First Study Flow/);
    assert.match(actions, /Start free lessons/);
    assert.match(actions, /View Flashcards/);
    assert.match(actions, /Start Practice/);
    assert.doesNotMatch(actions, /Readiness Exams|Open Exams|Mini CAT|Mini Adaptive Exam/);
    assert.doesNotMatch(main, /mini-cat|examsHref|CAT exams are required/i);
  });

  it("codifies college-level lesson and foundational question quality gates", () => {
    for (const required of [
      "Learning Objectives",
      "Core Concepts",
      "Visual Explanations",
      "Key Definitions",
      "Clinical Connections",
      "Knowledge Checks",
      "Study Tips",
      "Common Mistakes",
      "Summary",
      "Flashcard Links",
      "Practice Question Links",
      "Related Lessons",
    ]) {
      assert.ok(PRE_NURSING_LESSON_QUALITY_STANDARD.includes(required as never), `${required} missing`);
    }
    for (const required of ["Hint", "Correct Answer", "Why Correct", "Why Incorrect", "Study Tip", "Related Lesson"]) {
      assert.ok(PRE_NURSING_QUESTION_REQUIREMENTS.includes(required as never), `${required} missing`);
    }
  });

  it("shows long-term pathway progression into nursing and allied pathways", () => {
    assert.deepEqual(PRE_NURSING_PATHWAY_PROGRESSION, [
      "Pre-Nursing",
      "Nursing School",
      "RN / RPN",
      "NP / Advanced Practice",
      "Allied Health",
    ]);
    assert.match(src("src/components/pre-nursing/pre-nursing-marketing-hub-main.tsx"), /data-nn-pre-nursing-pathway-progression/);
  });
});
