import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, it } from "node:test";
import {
  evaluatePathwayLessonStructuralGate,
  validatePathwayLessonPremium,
} from "@/lib/lessons/pathway-lesson-premium";
import { applyAlliedStructuralCompletion } from "@/lib/lessons/allied-pathway-lesson-structural-normalization";
import type { PathwayLessonRecord, PathwayLessonSection } from "@/lib/lessons/pathway-lesson-types";

const ALLIED_PATHWAY_IDS = ["us-allied-core", "ca-allied-core"] as const;
const coreRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");
const alliedCatalog = JSON.parse(
  readFileSync(join(coreRoot, "src/content/pathway-lessons/allied-bundled-catalog.json"), "utf8"),
) as {
  pathways: Record<string, Array<Record<string, unknown>>>;
};

type BlockingSummary = {
  slug: string;
  pathwayId: string;
  structureMode: string;
  publicComplete: boolean;
  structuralScore: string;
  missingFields: string[];
  issues: string[];
};

function asLessonRecord(raw: Record<string, unknown>, pathwayId: string): PathwayLessonRecord {
  return {
    slug: String(raw.slug ?? ""),
    title: String(raw.title ?? ""),
    topic: String(raw.topic ?? ""),
    topicSlug: String(raw.topicSlug ?? ""),
    bodySystem: String(raw.bodySystem ?? ""),
    previewSectionCount: Number(raw.previewSectionCount ?? 1) || 1,
    seoTitle: typeof raw.seoTitle === "string" ? raw.seoTitle : "",
    seoDescription: typeof raw.seoDescription === "string" ? raw.seoDescription : "",
    sections: Array.isArray(raw.sections) ? (raw.sections as PathwayLessonSection[]) : [],
    relatedLessonRefs: Array.isArray(raw.relatedLessonRefs)
      ? (raw.relatedLessonRefs as PathwayLessonRecord["relatedLessonRefs"])
      : undefined,
    premiumOmittedSections: Array.isArray(raw.premiumOmittedSections)
      ? (raw.premiumOmittedSections as PathwayLessonRecord["premiumOmittedSections"])
      : undefined,
    system: String(raw.system ?? raw.bodySystem ?? ""),
    pathwayId,
  } as PathwayLessonRecord;
}

function summarizeMissingFields(lesson: PathwayLessonRecord): string[] {
  const missing: string[] = [];
  if (!lesson.seoTitle?.trim()) missing.push("seoTitle");
  if (!lesson.seoDescription?.trim()) missing.push("seoDescription");
  if ((lesson.relatedLessonRefs?.length ?? 0) < 2) missing.push("relatedLessonRefs");
  if (!lesson.sections?.length) missing.push("sections");
  if (lesson.sections.some((section) => !section.body?.trim())) missing.push("emptySectionBody");
  const bodies = lesson.sections.map((section) => section.body).join("\n\n");
  if (!/\/app\/flashcards\?pathwayId=/i.test(bodies)) missing.push("flashcardsLink");
  if (!/\/app\/practice-tests\?pathwayId=/i.test(bodies)) missing.push("practiceQuestionsLink");
  if (!/\/app\/cat\?pathwayId=/i.test(bodies)) missing.push("catLink");
  if (!lesson.sections.some((section) => /exam focus|clinical judgment/i.test(section.heading))) {
    missing.push("clinicalJudgmentOrExamFocusSection");
  }
  return missing;
}

describe("Allied health structural completion", () => {
  it("logs exact allied lesson gate blockers before publish normalization", () => {
    const blocking: BlockingSummary[] = [];
    let totalLessons = 0;
    let publicComplete = 0;

    for (const pathwayId of ALLIED_PATHWAY_IDS) {
      const rawLessons = alliedCatalog.pathways[pathwayId] ?? [];
      assert.ok(rawLessons.length > 0, `expected bundled allied lessons for ${pathwayId}`);

      for (const raw of rawLessons) {
        totalLessons += 1;
        const lesson = asLessonRecord(raw, pathwayId);
        const completed = applyAlliedStructuralCompletion({
          lessonSlug: lesson.slug,
          title: lesson.title,
          pathwayId,
          topicSlug: lesson.topicSlug,
          seoTitle: lesson.seoTitle,
          seoDescription: lesson.seoDescription,
          sections: lesson.sections,
          relatedLessonRefs: lesson.relatedLessonRefs,
          premiumOmittedSections: lesson.premiumOmittedSections,
        });
        lesson.seoTitle = completed.seoTitle;
        lesson.seoDescription = completed.seoDescription;
        lesson.sections = completed.sections;
        lesson.relatedLessonRefs = completed.relatedLessonRefs;
        lesson.premiumOmittedSections = completed.premiumOmittedSections;
        const gate = evaluatePathwayLessonStructuralGate(lesson);
        const premium = validatePathwayLessonPremium(lesson);
        if (gate.publicComplete) publicComplete += 1;
        if (!gate.publicComplete) {
          const missingFields = summarizeMissingFields(lesson);
          const summary: BlockingSummary = {
            slug: lesson.slug,
            pathwayId,
            structureMode: gate.structureMode,
            publicComplete: gate.publicComplete,
            structuralScore: `${gate.issues.length} issues / ${gate.warnings.length} warnings / ${gate.internalStudyLinkCount} internal links`,
            missingFields,
            issues: [...gate.issues, ...premium.issues],
          };
          blocking.push(summary);
          console.error(
            `[LESSON_GATE_FAILURE] ${JSON.stringify({
              pathwayId,
              slug: lesson.slug,
              missing_fields: missingFields,
              structural_score: summary.structuralScore,
              publicComplete: gate.publicComplete,
              issues: summary.issues,
            })}`,
          );
        }
      }
    }

    console.error(
      `[ALLIED_COMPLETION_SUMMARY] ${JSON.stringify({
        total_lessons: totalLessons,
        public_complete: publicComplete,
        incomplete: blocking.length,
        blocking_reasons: blocking.slice(0, 10).map((row) => ({
          pathwayId: row.pathwayId,
          slug: row.slug,
          missingFields: row.missingFields,
          issues: row.issues.slice(0, 6),
        })),
      })}`,
    );

    assert.equal(blocking.length, 0, `expected all allied lessons to be publicComplete; blocking=${blocking.length}`);
  });
});
