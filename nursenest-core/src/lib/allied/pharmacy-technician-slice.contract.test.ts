import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { ALLIED_PROFESSION_DEDICATED_CATALOGS } from "@/content/pathway-lessons/allied-professions/registry";
import pharmacyTechnicianCatalog, {
  pharmacyTechnicianLessons,
} from "@/content/pathway-lessons/allied-professions/pharmacy-technician";
import { pharmacyTechnicianFlashcards } from "@/content/flashcards/allied-pharmacy-technician";
import { pharmacyTechnicianQuestions } from "@/content/questions/allied-pharmacy-technician";

const REQUIRED_DOMAINS = [
  "pharmacy-tech",
  "pharmacy-calculations",
  "top-200-drugs",
  "medication-safety",
  "pharmacy-law-and-ethics",
  "pharmacy-compounding",
] as const;

const REQUIRED_READINESS_DOMAINS = [
  "calculations",
  "pharmacology",
  "medicationSafety",
  "law",
  "compounding",
] as const;

describe("pharmacy technician allied slice", () => {
  it("is registered as a dedicated allied profession shard", () => {
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "pharmacy-tech");

    assert.ok(profession, "pharmacy-tech profession must exist in ALLIED_PROFESSIONS");
    assert.equal(profession?.dedicatedCatalogFile, "pharmacy-technician");
    assert.equal(ALLIED_PROFESSION_DEDICATED_CATALOGS["pharmacy-technician"], pharmacyTechnicianCatalog);
  });

  it("ships a production-sized MVP lesson package", () => {
    assert.ok(Array.isArray(pharmacyTechnicianLessons));
    assert.ok(
      pharmacyTechnicianLessons.length >= 6,
      `expected at least 6 pharmacy technician lessons, got ${pharmacyTechnicianLessons.length}`,
    );
  });

  it("keeps all lessons scoped to the allied pharmacy technician lane", () => {
    for (const lesson of pharmacyTechnicianLessons) {
      assert.equal(lesson.pathwayId, "us-allied-core", `${lesson.slug} must remain in us-allied-core`);
      assert.equal(
        lesson.alliedProfessionKey,
        "pharmacy-tech",
        `${lesson.slug} must remain profession-scoped to pharmacy-tech`,
      );
      assert.equal(lesson.system, "pharmacy", `${lesson.slug} must use pharmacy system metadata`);
      assert.equal(lesson.bodySystem, "pharmacy", `${lesson.slug} must use pharmacy bodySystem metadata`);
    }
  });

  it("covers the core pharmacy technician readiness domains", () => {
    const topicSlugs = new Set(pharmacyTechnicianLessons.map((lesson) => lesson.topicSlug));

    for (const required of REQUIRED_DOMAINS) {
      assert.ok(topicSlugs.has(required), `missing pharmacy technician domain: ${required}`);
    }
  });

  it("uses the long-form NurseNest instructional lesson pattern", () => {
    for (const lesson of pharmacyTechnicianLessons) {
      assert.ok(lesson.sections.length >= 5, `${lesson.slug} must have at least 5 instructional sections`);
      assert.ok(lesson.preTest.length >= 1, `${lesson.slug} must include a pre-test item`);
      assert.ok(lesson.postTest.length >= 1, `${lesson.slug} must include a post-test item`);
      assert.ok(lesson.studyTakeaways.length >= 3, `${lesson.slug} must include study takeaways`);
      assert.ok(lesson.studyCommonTraps.length >= 3, `${lesson.slug} must include common traps`);
      assert.ok(lesson.seoTitle.includes("Pharmacy") || lesson.seoTitle.includes("Top 200"));
      assert.match(lesson.seoDescription, /Pharmacy|PTCE|ExCPT|technician|compounding/i);
    }
  });

  it("ships profession-scoped pharmacy technician flashcards", () => {
    assert.ok(
      pharmacyTechnicianFlashcards.length >= 25,
      `expected at least 25 pharmacy technician flashcards, got ${pharmacyTechnicianFlashcards.length}`,
    );

    const decks = new Set(pharmacyTechnicianFlashcards.map((card) => card.deck));
    for (const requiredDeck of [
      "top-200-drugs",
      "sig-codes",
      "calculations",
      "medication-safety",
      "law-and-ethics",
      "compounding",
    ]) {
      assert.ok(decks.has(requiredDeck), `missing pharmacy technician flashcard deck: ${requiredDeck}`);
    }

    for (const card of pharmacyTechnicianFlashcards) {
      assert.equal(card.alliedProfessionKey, "pharmacy-tech", `${card.id} must remain pharmacy-tech scoped`);
      assert.ok(card.front.length > 6, `${card.id} front is too thin`);
      assert.ok(card.back.length > 3, `${card.id} back is too thin`);
      assert.ok(card.explanation.length > 30, `${card.id} explanation is too thin`);
      assert.ok(card.examTags.includes("PTCE"), `${card.id} must support PTCE tagging`);
      assert.ok(card.examTags.includes("ExCPT"), `${card.id} must support ExCPT tagging`);
    }
  });

  it("ships profession-scoped pharmacy technician question-bank seeds", () => {
    assert.ok(
      pharmacyTechnicianQuestions.length >= 12,
      `expected at least 12 pharmacy technician questions, got ${pharmacyTechnicianQuestions.length}`,
    );

    const questionDomains = new Set(pharmacyTechnicianQuestions.map((question) => question.domain));
    for (const required of ["workflow", ...REQUIRED_READINESS_DOMAINS]) {
      assert.ok(questionDomains.has(required), `missing pharmacy technician question domain: ${required}`);
    }

    const lessonSlugs = new Set(pharmacyTechnicianLessons.map((lesson) => lesson.slug));
    for (const question of pharmacyTechnicianQuestions) {
      assert.equal(question.alliedProfessionKey, "pharmacy-tech", `${question.id} must remain pharmacy-tech scoped`);
      assert.ok(question.options.length >= 4, `${question.id} must include at least 4 options`);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${question.id} correctIndex is invalid`);
      assert.equal(
        question.incorrectRationales.length,
        question.options.length - 1,
        `${question.id} must explain each incorrect option`,
      );
      assert.ok(question.rationale.length > 60, `${question.id} rationale is too thin`);
      assert.ok(question.examTags.includes("PTCE"), `${question.id} must support PTCE tagging`);
      assert.ok(question.examTags.includes("ExCPT"), `${question.id} must support ExCPT tagging`);
      if (question.lessonSlug) {
        assert.ok(lessonSlugs.has(question.lessonSlug), `${question.id} links to missing lesson ${question.lessonSlug}`);
      }
    }
  });
});
