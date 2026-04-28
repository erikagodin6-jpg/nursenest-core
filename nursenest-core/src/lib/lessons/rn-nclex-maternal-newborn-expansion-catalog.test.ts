import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  getCatalogLessonsRawFromBundledOnly,
  getCatalogPathwayLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  pathwayLessonMarketingDetailHref,
  pathwayLessonPublicDetailPath,
} from "@/lib/lessons/pathway-lesson-types";

/** Must match `scripts/maternal-newborn-expansion-defs-a.mjs` + `defs-b.mjs` order and slugs. */
export const RN_NCLEX_MATERNAL_NEWBORN_EXPANSION_SLUGS = [
  "prenatal-assessment-routine-care-nclex",
  "gravidity-parity-nclex",
  "naegels-rule-edd-nclex",
  "pregnancy-warning-signs-nclex",
  "hyperemesis-gravidarum-nclex",
  "gestational-diabetes-nursing-nclex",
  "placenta-previa-nclex",
  "placental-abruption-nclex",
  "preterm-labour-nclex",
  "premature-rupture-membranes-nclex",
  "amniotic-fluid-complications-nclex",
  "fetal-heart-rate-monitoring-basics-nclex",
  "fetal-decelerations-early-variable-late-nclex",
  "uterine-tachysystole-nclex",
  "induction-augmentation-labour-nclex",
  "oxytocin-nursing-care-nclex",
  "epidural-labour-nursing-care-nclex",
  "magnesium-sulfate-nursing-care-nclex",
  "shoulder-dystocia-nclex",
  "umbilical-cord-prolapse-nclex",
  "uterine-rupture-nclex",
  "cesarean-birth-nursing-care-nclex",
  "postpartum-assessment-bubble-he-nclex",
  "postpartum-hemorrhage-first-actions-nclex",
  "postpartum-infection-nclex",
  "postpartum-depression-psychosis-nclex",
  "breastfeeding-assessment-teaching-nclex",
  "mastitis-nursing-care-nclex",
  "newborn-assessment-apgar-normal-findings-nclex",
  "newborn-hypoglycemia-nclex",
  "newborn-jaundice-phototherapy-nclex",
  "neonatal-abstinence-syndrome-nclex",
  "newborn-respiratory-distress-nclex",
  "newborn-safety-safe-sleep-nclex",
  "circumcision-newborn-care-nclex",
  "maternal-priority-first-actions-nclex",
  "which-maternal-patient-unstable-nclex",
  "which-newborn-unstable-nclex",
  "maternal-newborn-ngn-case-studies-nclex",
] as const;

describe("RN NCLEX maternal & newborn expansion catalog", () => {
  it("bundled-only merge includes 39 unique expansion slugs once each", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const raw = getCatalogLessonsRawFromBundledOnly(pathwayId);
      const slugs = raw.map((l) => l.slug.trim());
      const set = new Set(slugs);
      assert.equal(slugs.length, set.size, `duplicate slug in bundled list for ${pathwayId}`);
      for (const expected of RN_NCLEX_MATERNAL_NEWBORN_EXPANSION_SLUGS) {
        assert.ok(set.has(expected), `missing expansion slug ${expected} for ${pathwayId}`);
      }
    }
  });

  it("each expansion lesson normalizes to publicComplete with maternity topic and General body system", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const rawList = getCatalogLessonsRawFromBundledOnly(pathwayId).filter((r) =>
        (RN_NCLEX_MATERNAL_NEWBORN_EXPANSION_SLUGS as readonly string[]).includes(r.slug.trim()),
      );
      assert.equal(rawList.length, RN_NCLEX_MATERNAL_NEWBORN_EXPANSION_SLUGS.length);
      for (const raw of rawList) {
        const lesson = normalizeLesson(raw, pathwayId);
        assert.equal(lesson.topicSlug, "maternity");
        assert.equal(lesson.bodySystem.trim().toLowerCase(), "general");
        assert.ok(lesson.structuralQuality?.publicComplete, `publicComplete false for ${lesson.slug}`);
        assert.equal(lesson.structuralQuality?.structureMode, "legacy");
        const href = pathwayLessonMarketingDetailHref(`/us/rn/nclex-rn/lessons`, lesson.slug);
        assert.ok(href && href.length > 10);
        const pathway = getExamPathwayById(pathwayId);
        assert.ok(pathway);
        const detailPath = pathwayLessonPublicDetailPath(pathway, lesson.slug);
        assert.ok(detailPath?.includes(lesson.slug));
      }
    }
  });

  it("full catalog sync list includes expansion rows on RN pathways (lesson-library merge)", () => {
    for (const pathwayId of ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const) {
      const lessons = getCatalogPathwayLessonsSync(pathwayId);
      const bySlug = new Map(lessons.map((l) => [l.slug.trim(), l]));
      for (const slug of RN_NCLEX_MATERNAL_NEWBORN_EXPANSION_SLUGS) {
        const hit = bySlug.get(slug);
        assert.ok(hit, `getCatalogPathwayLessonsSync missing ${slug} for ${pathwayId}`);
        assert.equal(hit!.topicSlug, "maternity");
        assert.equal(hit!.structuralQuality?.publicComplete, true);
      }
    }
  });
});
