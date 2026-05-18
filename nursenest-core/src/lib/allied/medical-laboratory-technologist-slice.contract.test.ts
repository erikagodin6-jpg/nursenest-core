import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { ALLIED_PROFESSION_DEDICATED_CATALOGS } from "@/content/pathway-lessons/allied-professions/registry";
import medicalLaboratoryTechnologistCatalog, {
  medicalLaboratoryTechnologistLessons,
} from "@/content/pathway-lessons/allied-professions/medical-laboratory-technologist";
import { medicalLaboratoryTechnologistFlashcards } from "@/content/flashcards/allied-medical-laboratory-technologist";
import { medicalLaboratoryTechnologistQuestions } from "@/content/questions/allied-medical-laboratory-technologist";
import { mltRbcMorphologyReference } from "@/content/morphology/mlt-rbc-morphology-reference";

const REQUIRED_DOMAINS = [
  "hematology-cbc-interpretation",
  "blood-banking-crossmatch",
  "clinical-chemistry-panels",
  "microbiology-culture-identification",
  "coagulation-studies-guide",
  "urinalysis-body-fluids",
  "lab-values",
] as const;

const REQUIRED_FLASHCARD_DECKS = [
  "hematology",
  "blood-bank",
  "clinical-chemistry",
  "microbiology",
  "coagulation",
  "urinalysis",
  "quality-control",
] as const;

const REQUIRED_QUESTION_DOMAINS = [
  "hematology",
  "bloodBank",
  "chemistry",
  "microbiology",
  "coagulation",
  "urinalysis",
  "qualityControl",
] as const;

const REQUIRED_MORPHOLOGIES = ["schistocyte", "spherocyte", "target-cell", "sickle-cell", "bite-cell"] as const;

const WORKFLOW_MARKERS = [
  /specimen|preanalytic|pre-analytical/i,
  /analyzer|QC|quality control|calibration/i,
  /escalat|critical|report|verify|release/i,
];

describe("medical laboratory technologist allied slice", () => {
  it("is registered as a dedicated allied profession shard", () => {
    const profession = ALLIED_PROFESSIONS.find((p) => p.professionKey === "mlt");

    assert.ok(profession, "mlt profession must exist in ALLIED_PROFESSIONS");
    assert.equal(profession?.dedicatedCatalogFile, "medical-laboratory-technologist");
    assert.equal(
      ALLIED_PROFESSION_DEDICATED_CATALOGS["medical-laboratory-technologist"],
      medicalLaboratoryTechnologistCatalog,
    );
  });

  it("ships a production-sized MVP MLS/MLT lesson package", () => {
    assert.ok(Array.isArray(medicalLaboratoryTechnologistLessons));
    assert.ok(
      medicalLaboratoryTechnologistLessons.length >= 7,
      `expected at least 7 MLS/MLT lessons, got ${medicalLaboratoryTechnologistLessons.length}`,
    );
  });

  it("keeps all lessons scoped to the allied MLS/MLT lane", () => {
    for (const lesson of medicalLaboratoryTechnologistLessons) {
      assert.equal(lesson.pathwayId, "us-allied-core", `${lesson.slug} must remain in us-allied-core`);
      assert.equal(
        lesson.alliedProfessionKey,
        "mlt",
        `${lesson.slug} must remain profession-scoped to mlt`,
      );
      assert.ok(lesson.system.length > 2, `${lesson.slug} must include system metadata`);
      assert.ok(lesson.bodySystem.length > 2, `${lesson.slug} must include bodySystem metadata`);
    }
  });

  it("covers the core MLS/MLT readiness domains", () => {
    const topicSlugs = new Set(medicalLaboratoryTechnologistLessons.map((lesson) => lesson.topicSlug));

    for (const required of REQUIRED_DOMAINS) {
      assert.ok(topicSlugs.has(required), `missing MLS/MLT domain: ${required}`);
    }
  });

  it("uses the long-form NurseNest instructional pattern", () => {
    for (const lesson of medicalLaboratoryTechnologistLessons) {
      assert.ok(lesson.sections.length >= 4, `${lesson.slug} must have at least 4 instructional sections`);
      assert.ok(lesson.preTest.length >= 1, `${lesson.slug} must include a pre-test item`);
      assert.ok(lesson.postTest.length >= 1, `${lesson.slug} must include a post-test item`);
      assert.ok(lesson.studyTakeaways.length >= 3, `${lesson.slug} must include study takeaways`);
      assert.ok(lesson.studyCommonTraps.length >= 3, `${lesson.slug} must include common traps`);
      assert.match(lesson.seoTitle, /MLT|MLS|Laboratory|Hematology|Blood Bank|Chemistry|Microbiology|Coagulation|Urinalysis|Quality Control/i);
      assert.match(lesson.seoDescription, /MLS|MLT|laboratory|hematology|chemistry|microbiology|coagulation|urinalysis|quality control/i);
    }
  });

  it("preserves workflow-first laboratory reasoning instead of generic allied filler", () => {
    const lessonText = medicalLaboratoryTechnologistLessons
      .map((lesson) => [
        lesson.title,
        lesson.seoDescription,
        lesson.studyTakeaways.join(" "),
        lesson.studyCommonTraps.join(" "),
        lesson.sections.map((section: { body?: string }) => section.body ?? "").join(" "),
      ].join(" "))
      .join("\n");

    for (const marker of WORKFLOW_MARKERS) {
      assert.match(lessonText, marker, `MLS/MLT lesson package must include workflow marker ${marker}`);
    }
  });

  it("ships profession-scoped MLS/MLT flashcards with adaptive metadata", () => {
    assert.ok(
      medicalLaboratoryTechnologistFlashcards.length >= 16,
      `expected at least 16 MLS/MLT flashcards, got ${medicalLaboratoryTechnologistFlashcards.length}`,
    );

    const decks = new Set(medicalLaboratoryTechnologistFlashcards.map((card) => card.deck));
    for (const requiredDeck of REQUIRED_FLASHCARD_DECKS) {
      assert.ok(decks.has(requiredDeck), `missing MLS/MLT flashcard deck: ${requiredDeck}`);
    }

    for (const card of medicalLaboratoryTechnologistFlashcards) {
      assert.equal(card.alliedProfessionKey, "mlt", `${card.id} must remain mlt scoped`);
      assert.ok(card.front.length > 8, `${card.id} front is too thin`);
      assert.ok(card.back.length > 8, `${card.id} back is too thin`);
      assert.ok(card.explanation.length > 45, `${card.id} explanation is too thin`);
      assert.ok(card.examTags.includes("CSMLS"), `${card.id} must support CSMLS tagging`);
      assert.ok(card.examTags.includes("ASCP_MLS"), `${card.id} must support ASCP MLS tagging`);
      assert.ok(card.examTags.includes("ASCP_MLT"), `${card.id} must support ASCP MLT tagging`);
      assert.ok(card.workflowTags || card.morphologyTags, `${card.id} must expose adaptive metadata arrays`);
    }
  });

  it("ships profession-scoped MLS/MLT question-bank seeds", () => {
    assert.ok(
      medicalLaboratoryTechnologistQuestions.length >= 7,
      `expected at least 7 MLS/MLT questions, got ${medicalLaboratoryTechnologistQuestions.length}`,
    );

    const questionDomains = new Set(medicalLaboratoryTechnologistQuestions.map((question) => question.domain));
    for (const required of REQUIRED_QUESTION_DOMAINS) {
      assert.ok(questionDomains.has(required), `missing MLS/MLT question domain: ${required}`);
    }

    const lessonSlugs = new Set(medicalLaboratoryTechnologistLessons.map((lesson) => lesson.slug));
    for (const question of medicalLaboratoryTechnologistQuestions) {
      assert.equal(question.alliedProfessionKey, "mlt", `${question.id} must remain mlt scoped`);
      assert.ok(question.options.length >= 4, `${question.id} must include at least 4 options`);
      assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length, `${question.id} correctIndex is invalid`);
      assert.equal(
        question.incorrectRationales.length,
        question.options.length - 1,
        `${question.id} must explain each incorrect option`,
      );
      assert.ok(question.rationale.length > 75, `${question.id} rationale is too thin`);
      assert.ok(question.examTags.includes("CSMLS"), `${question.id} must support CSMLS tagging`);
      assert.ok(question.examTags.includes("ASCP_MLS"), `${question.id} must support ASCP MLS tagging`);
      assert.ok(question.examTags.includes("ASCP_MLT"), `${question.id} must support ASCP MLT tagging`);
      assert.ok((question.workflowTags ?? []).length >= 1, `${question.id} must include workflow tags`);
      if (question.lessonSlug) {
        assert.ok(lessonSlugs.has(question.lessonSlug), `${question.id} links to missing lesson ${question.lessonSlug}`);
      }
    }
  });

  it("ships morphology reference metadata for future image drills", () => {
    assert.ok(
      mltRbcMorphologyReference.length >= REQUIRED_MORPHOLOGIES.length,
      `expected at least ${REQUIRED_MORPHOLOGIES.length} morphology entries`,
    );

    const ids = new Set(mltRbcMorphologyReference.map((entry) => entry.id));
    for (const required of REQUIRED_MORPHOLOGIES) {
      assert.ok(ids.has(required), `missing RBC morphology reference: ${required}`);
    }

    for (const entry of mltRbcMorphologyReference) {
      assert.ok(entry.morphology.length > 3, `${entry.id} must include a morphology display name`);
      assert.ok(entry.description.length > 20, `${entry.id} description is too thin`);
      assert.ok(entry.associatedConditions.length >= 1, `${entry.id} must include associated conditions`);
      assert.ok(entry.differentialMorphologies.length >= 1, `${entry.id} must include differential morphologies`);
      assert.ok(entry.workflowImplications.length >= 1, `${entry.id} must include workflow implications`);
      assert.ok(entry.escalationTriggers.length >= 1, `${entry.id} must include escalation triggers`);
      assert.ok(entry.examRelevance.length > 40, `${entry.id} exam relevance is too thin`);
      assert.ok(entry.morphologyTags.length >= 1, `${entry.id} must include morphology tags`);
    }
  });
});
