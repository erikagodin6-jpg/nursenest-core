#!/usr/bin/env node
/**
 * Validates optional `generated-indexes/*.json` against live catalog merge (no disk shortcut during live leg).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-pathways-catalog";
import {
  getCatalogLessonsRaw,
  getLessonSummariesIndex,
  getMarketingHubEffectiveCatalogSlugSet,
  listCatalogPathwayIdsWithLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import { parsePathwayLessonGeneratedIndexV1 } from "@/lib/lessons/pathway-lesson-generated-index";
import { marketingPathwayLessonDetailPath } from "@/lib/lessons/lesson-routes";

const coreRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const realIndexDir = path.join(coreRoot, "src", "content", "pathway-lessons", "generated-indexes");

function listGeneratedJsonFiles(): string[] {
  if (!fs.existsSync(realIndexDir)) return [];
  return fs.readdirSync(realIndexDir).filter((f) => f.endsWith(".json") && f !== "package.json");
}

function liveSummariesWithoutDiskIndex(pathwayId: string): ReturnType<typeof getLessonSummariesIndex> {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-index-live-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = emptyDir;
  try {
    resetCatalogLessonsRawMergeCacheForTests();
    return getLessonSummariesIndex(pathwayId);
  } finally {
    if (prev === undefined) delete process.env.NN_PATHWAY_LESSON_INDEX_DIR;
    else process.env.NN_PATHWAY_LESSON_INDEX_DIR = prev;
    resetCatalogLessonsRawMergeCacheForTests();
  }
}

function liveMarketingSlugSetWithoutDisk(pathwayId: string): Set<string> {
  const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), "nn-lesson-index-live-"));
  const prev = process.env.NN_PATHWAY_LESSON_INDEX_DIR;
  process.env.NN_PATHWAY_LESSON_INDEX_DIR = emptyDir;
  try {
    resetCatalogLessonsRawMergeCacheForTests();
    return getMarketingHubEffectiveCatalogSlugSet(pathwayId);
  } finally {
    if (prev === undefined) delete process.env.NN_PATHWAY_LESSON_INDEX_DIR;
    else process.env.NN_PATHWAY_LESSON_INDEX_DIR = prev;
    resetCatalogLessonsRawMergeCacheForTests();
  }
}

function assertDetailHrefs(pathwayId: string, slugs: string[]): void {
  const pathway = getExamPathwayById(pathwayId);
  if (!pathway) return;
  for (const slug of slugs) {
    const href = marketingPathwayLessonDetailPath(pathway, slug);
    if (!href || !href.includes(`/lessons/`)) {
      throw new Error(`[verify:lesson-indexes] broken detail href pathway=${pathwayId} slug=${slug} href=${href}`);
    }
  }
}

async function main(): Promise<void> {
  const files = listGeneratedJsonFiles();
  if (files.length === 0) {
    console.info("[verify:lesson-indexes] no generated *.json files — skip (run npm run build:lesson-indexes first).");
    return;
  }

  const catalogIds = new Set(listCatalogPathwayIdsWithLessonsSync());

  for (const file of files) {
    const pathwayId = file.replace(/\.json$/i, "");
    if (!catalogIds.has(pathwayId)) {
      throw new Error(`[verify:lesson-indexes] generated file for unknown pathway: ${file}`);
    }
    const raw = JSON.parse(fs.readFileSync(path.join(realIndexDir, file), "utf8")) as unknown;
    const parsed = parsePathwayLessonGeneratedIndexV1(raw, pathwayId);
    if (!parsed) {
      throw new Error(`[verify:lesson-indexes] invalid JSON schema: ${file}`);
    }

    const rawLen = getCatalogLessonsRaw(pathwayId).length;
    if (parsed.mergedRawLessonCount !== rawLen) {
      throw new Error(
        `[verify:lesson-indexes] mergedRawLessonCount mismatch pathway=${pathwayId} file=${parsed.mergedRawLessonCount} live=${rawLen}`,
      );
    }

    const liveSummaries = liveSummariesWithoutDiskIndex(pathwayId);
    if (liveSummaries.length !== parsed.summaries.length) {
      throw new Error(
        `[verify:lesson-indexes] summary count mismatch pathway=${pathwayId} live=${liveSummaries.length} file=${parsed.summaries.length}`,
      );
    }
    const liveSlugs = [...liveSummaries.map((r) => r.slug)].sort();
    const fileSlugs = [...parsed.summaries.map((r) => r.slug)].sort();
    if (liveSlugs.join("\0") !== fileSlugs.join("\0")) {
      throw new Error(`[verify:lesson-indexes] slug set mismatch pathway=${pathwayId}`);
    }

    const liveEff = liveMarketingSlugSetWithoutDisk(pathwayId);
    const fileEff = new Set(parsed.marketingEffectiveSlugsLowercase.map((s) => s.toLowerCase()));
    if (liveEff.size !== fileEff.size) {
      throw new Error(
        `[verify:lesson-indexes] marketing effective slug count mismatch pathway=${pathwayId} live=${liveEff.size} file=${fileEff.size}`,
      );
    }
    for (const s of liveEff) {
      if (!fileEff.has(s)) {
        throw new Error(`[verify:lesson-indexes] marketing slug missing in file pathway=${pathwayId} slug=${s}`);
      }
    }

    assertDetailHrefs(pathwayId, fileSlugs);
    console.info(`[verify:lesson-indexes] ok pathway=${pathwayId} lessons=${parsed.summaries.length}`);
  }
  console.info(`[verify:lesson-indexes] all ${files.length} file(s) validated.`);
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
