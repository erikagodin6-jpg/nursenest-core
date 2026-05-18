import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { ALLIED_PROFESSION_DEDICATED_CATALOGS } from "@/content/pathway-lessons/allied-professions/registry";
import medicalLaboratoryTechnologistCatalog, {
  medicalLaboratoryTechnologistLessons,
} from "@/content/pathway-lessons/allied-professions/medical-laboratory-technologist";

const REQUIRED_DOMAINS = [
  "hematology-cbc-interpretation",
  "blood-banking-crossmatch",
  "clinical-chemistry-panels",
  "microbiology-culture-identification",
  "coagulation-studies-guide",
  "urinalysis-body-fluids",
  "lab-values",
] as const;

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
});
