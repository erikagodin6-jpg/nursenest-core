import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { LESSON_CATEGORIES } from "@/lib/lessons/lesson-taxonomy";
import {
  getLessonSummariesIndex,
  getCatalogLessonsRaw,
  resetCatalogLessonsRawMergeCacheForTests,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  clearGeneratedPathwayLessonIndexCacheForTests,
  parsePathwayLessonGeneratedIndexV1,
} from "@/lib/lessons/pathway-lesson-generated-index";

test("parsePathwayLessonGeneratedIndexV1 rejects unknown schema", () => {
  assert.equal(parsePathwayLessonGeneratedIndexV1({ schemaVersion: 99, pathwayId: "x" }, "x"), null);
});

test("parsePathwayLessonGeneratedIndexV1 rejects pathwayId mismatch", () => {
  assert.equal(
    parsePathwayLessonGeneratedIndexV1(
      {
        schemaVersion: 1,
        pathwayId: "other",
        generatedAt: "t",
        mergedRawLessonCount: 0,
        effectiveLessonCount: 0,
        summaries: [],
        slugToDisplayTitle: {},
        marketingEffectiveSlugsLowercase: [],
        categoryCounts: Object.fromEntries(LESSON_CATEGORIES.map((c) => [c, 0])) as Record<string, number>,
      },
      "expected-id",
    ),
    null,
  );
});

test("untrusted generated index (stale mergedRawLessonCount) falls back to live summaries", () => {
  const pathwayId = "ca-rn-nclex-rn";
  resetCatalogLessonsRawMergeCacheForTests();
  const baselineLen = getLessonSummariesIndex(pathwayId).length;
  assert.ok(baselineLen > 0, "expected catalog lessons for ca-rn-nclex-rn");

  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nn-gen-index-test-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = tmp;
  try {
    const categoryCounts = Object.fromEntries(LESSON_CATEGORIES.map((c) => [c, 0])) as Record<string, number>;
    const junk = {
      schemaVersion: 1,
      pathwayId,
      generatedAt: new Date().toISOString(),
      mergedRawLessonCount: 9_999_999,
      effectiveLessonCount: 0,
      summaries: [],
      slugToDisplayTitle: {},
      marketingEffectiveSlugsLowercase: [],
      categoryCounts,
    };
    fs.writeFileSync(path.join(tmp, `${pathwayId}.json`), JSON.stringify(junk), "utf8");
    clearGeneratedPathwayLessonIndexCacheForTests();
    resetCatalogLessonsRawMergeCacheForTests();

    const after = getLessonSummariesIndex(pathwayId).length;
    assert.equal(after, baselineLen);
  } finally {
    if (prev === undefined) delete process.env.NN_PATHWAY_LESSON_INDEX_DIR;
    else process.env.NN_PATHWAY_LESSON_INDEX_DIR = prev;
    fs.rmSync(tmp, { recursive: true, force: true });
    clearGeneratedPathwayLessonIndexCacheForTests();
    resetCatalogLessonsRawMergeCacheForTests();
  }
});

test("trusted shape: summaries slugs must exist in merged raw rows", () => {
  const pathwayId = "ca-rn-nclex-rn";
  const raw = getCatalogLessonsRaw(pathwayId);
  const rawSlugs = new Set(raw.map((r) => r.slug.trim()).filter(Boolean));
  assert.ok(rawSlugs.size > 0);
  resetCatalogLessonsRawMergeCacheForTests();
  const summaries = getLessonSummariesIndex(pathwayId);
  for (const row of summaries) {
    assert.ok(rawSlugs.has(row.slug), `summary slug should exist in raw merge: ${row.slug}`);
  }
});

test("new grad pathway does not collapse to zero rendered lessons when raw lessons exist", () => {
  const pathwayId = "us-rn-new-grad-transition";
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "nn-new-grad-live-index-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = tmp;
  try {
    clearGeneratedPathwayLessonIndexCacheForTests();
    resetCatalogLessonsRawMergeCacheForTests();
    const raw = getCatalogLessonsRaw(pathwayId);
    assert.ok(raw.length > 0, "expected raw New Grad lessons to exist");

    const summaries = getLessonSummariesIndex(pathwayId);
    assert.ok(
      summaries.length > 0,
      `expected renderable New Grad summaries when raw lessons exist (raw=${raw.length}, rendered=${summaries.length})`,
    );
  } finally {
    if (prev === undefined) delete process.env.NN_PATHWAY_LESSON_INDEX_DIR;
    else process.env.NN_PATHWAY_LESSON_INDEX_DIR = prev;
    fs.rmSync(tmp, { recursive: true, force: true });
    clearGeneratedPathwayLessonIndexCacheForTests();
    resetCatalogLessonsRawMergeCacheForTests();
  }
});
