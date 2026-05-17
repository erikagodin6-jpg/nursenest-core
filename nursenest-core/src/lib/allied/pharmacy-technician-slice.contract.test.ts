import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { ALLIED_PROFESSIONS } from "@/lib/allied/allied-professions-registry";
import { ALLIED_PROFESSION_DEDICATED_CATALOGS } from "@/content/pathway-lessons/allied-professions/registry";
import pharmacyTechnicianCatalog, {
  pharmacyTechnicianLessons,
} from "@/content/pathway-lessons/allied-professions/pharmacy-technician";

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

    for (const required of [
      "pharmacy-tech",
      "pharmacy-calculations",
      "top-200-drugs",
      "medication-safety",
      "pharmacy-law-and-ethics",
      "pharmacy-compounding",
    ]) {
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
});
