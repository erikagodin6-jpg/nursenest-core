/**
 * NP marketing hubs must accept CNPLE / NCLEX-family authoring tags on rows published under `*-np-*` pathways.
 *
 * Run: `npx tsx --test src/lib/lessons/pathway-np-hub-exam-context.test.ts`
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import catalog from "@/content/pathway-lessons/catalog.json";
import {
  normalizeLesson,
  pathwayLessonMatchesMarketingPathwayContext,
  sortAndFilterLessonsForPathwayContext,
  type LessonInput,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

type CatalogShape = {
  pathways: Record<string, { lessons?: LessonInput[] }>;
};

const catalogData = catalog as CatalogShape;

function catalogTemplate(): LessonInput {
  const row = catalogData.pathways["us-rn-nclex-rn"]?.lessons?.[0];
  assert.ok(row, "catalog must include a US RN lesson template for structural gate");
  return { ...row! };
}

function baseRaw(overrides: Partial<LessonInput>): LessonInput {
  return {
    ...catalogTemplate(),
    ...overrides,
  };
}

describe("NP / CNPLE pathway lesson inventory (exam metadata contract)", () => {
  it("normalizes CNPLE authoring string in exams[] to NP for ca-np-cnple", () => {
    const raw = baseRaw({ slug: `np-cnple-alias-${Date.now()}`, exams: ["CNPLE"] as LessonInput["exams"] });
    const rec = normalizeLesson(raw, "ca-np-cnple");
    assert.ok(rec.exams?.includes("NP"), `expected NP in exams, got ${JSON.stringify(rec.exams)}`);
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("ca-np-cnple", rec), true);
  });

  it("matches ca-np-cnple hub when only NCLEX_RN stamps exist on the row (legacy shared authoring)", () => {
    const raw = baseRaw({
      slug: `np-nclex-rn-stamp-${Date.now()}`,
      exams: ["NCLEX_RN"],
      examMeta: [{ exam: "NCLEX_RN", yieldLevel: "common" }],
    });
    const rec = normalizeLesson(raw, "ca-np-cnple");
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("ca-np-cnple", rec), true);
  });

  it("does not treat NP hub rules as matching US RN pathway (wrong pathway id)", () => {
    const raw = baseRaw({
      slug: `np-wrong-pathway-${Date.now()}`,
      exams: ["NCLEX_RN"],
      examMeta: [{ exam: "NCLEX_RN", yieldLevel: "common" }],
    });
    const rec = normalizeLesson(raw, "us-rn-nclex-rn");
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("us-rn-nclex-rn", rec), true);
    assert.equal(pathwayLessonMatchesMarketingPathwayContext("ca-np-cnple", rec), false);
  });

  it("survives the same marketing hub list filter as other pathways (publicComplete + context)", () => {
    const raw = baseRaw({
      slug: `np-hub-list-filter-${Date.now()}`,
      exams: ["NCLEX_RN"],
      examMeta: [{ exam: "NCLEX_RN", yieldLevel: "common" }],
    });
    const rec = normalizeLesson(raw, "ca-np-cnple");
    assert.equal(rec.structuralQuality?.publicComplete, true);
    const filtered = sortAndFilterLessonsForPathwayContext("ca-np-cnple", [rec]);
    assert.equal(filtered.length, 1);
  });
});
