#!/usr/bin/env tsx
/**
 * Generate lesson hub page snapshots for all active pathways.
 *
 * Writes to $STUDY_PUBLISHED_SNAPSHOT_DIR/lessons-hub/{pathwayId}/{locale}/
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/snapshots/generate-lesson-snapshots.ts
 */

import "@/lib/db/script-env-bootstrap";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";

import { EXAM_PATHWAYS } from "@/lib/exam-pathways/exam-pathways-catalog";
import { getPathwayLessonsPageFresh } from "@/lib/lessons/pathway-lesson-loader";
import { stableListOptsKey } from "@/lib/study-content-failover/study-published-snapshot-store";
import type { StudyPublishedSnapshotEnvelope } from "@/lib/study-content-failover/study-published-snapshot-types";
import type { PathwayLessonsPageResult } from "@/lib/lessons/pathway-lesson-loader";

const SNAPSHOT_DIR = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
const LOCALES = ["en", "fr"] as const;
const PAGE_SIZE = 40;

type WriteResult = { path: string; records: number; skipped?: boolean; error?: string };

async function ensureDir(dir: string): Promise<void> {
  await mkdir(dir, { recursive: true });
}

function versionStamp(payload: unknown): string {
  const hash = createHash("sha256")
    .update(JSON.stringify(payload))
    .digest("hex")
    .slice(0, 16);
  return `${new Date().toISOString().slice(0, 19)}Z-sha256:${hash}`;
}

async function generateLessonHubSnapshot(
  baseDir: string,
  pathwayId: string,
  locale: string,
): Promise<WriteResult[]> {
  const results: WriteResult[] = [];
  const optsKey = stableListOptsKey(undefined);
  const page = 1;

  const filePath = path.join(
    baseDir,
    pathwayId,
    locale,
    `p${page}-s${PAGE_SIZE}-${optsKey}.json`,
  );

  try {
    const pageResult = await getPathwayLessonsPageFresh(pathwayId, page, PAGE_SIZE, locale, undefined);

    if (!pageResult || pageResult.total === 0) {
      results.push({ path: filePath, records: 0, skipped: true });
      return results;
    }

    const payload: PathwayLessonsPageResult = {
      items: pageResult.items,
      total: pageResult.total,
      page: pageResult.page,
      pageSize: pageResult.pageSize,
      pageCount: pageResult.pageCount,
      locale: pageResult.locale,
      renderableAll: pageResult.renderableAll,
    };

    const envelope: StudyPublishedSnapshotEnvelope<PathwayLessonsPageResult> = {
      schema: "nursenest.study_snapshot.v1",
      surface: "pathway_lessons_hub",
      version: versionStamp(payload),
      capturedAt: new Date().toISOString(),
      payload,
    };

    await ensureDir(path.dirname(filePath));
    await writeFile(filePath, JSON.stringify(envelope, null, 2), "utf8");
    results.push({ path: filePath, records: pageResult.total });
  } catch (e) {
    results.push({ path: filePath, records: 0, error: e instanceof Error ? e.message : String(e) });
  }

  return results;
}

export async function generateLessonSnapshots(): Promise<{
  results: WriteResult[];
  written: number;
  skipped: number;
  errors: number;
}> {
  if (!SNAPSHOT_DIR) {
    console.error("[snapshots] STUDY_PUBLISHED_SNAPSHOT_DIR is not set");
    process.exit(1);
  }

  const baseDir = path.join(SNAPSHOT_DIR, "lessons-hub");
  await ensureDir(baseDir);
  const allResults: WriteResult[] = [];

  for (const pathway of EXAM_PATHWAYS) {
    for (const locale of LOCALES) {
      const results = await generateLessonHubSnapshot(baseDir, pathway.id, locale);
      for (const r of results) {
        allResults.push(r);
        if (r.error) console.error(`  ✗ ${pathway.id}/${locale}: ${r.error}`);
        else if (!r.skipped) console.log(`  ✓ ${pathway.id}/${locale} (${r.records} lessons)`);
      }
    }
  }

  const written = allResults.filter((r) => !r.skipped && !r.error).length;
  const skipped = allResults.filter((r) => r.skipped).length;
  const errors = allResults.filter((r) => Boolean(r.error)).length;

  return { results: allResults, written, skipped, errors };
}

if (process.argv[1] === import.meta.filename || process.argv[1]?.endsWith("generate-lesson-snapshots.ts")) {
  const t0 = Date.now();
  console.log("[snapshots] Generating lesson hub snapshots...");
  generateLessonSnapshots()
    .then(({ written, skipped, errors }) => {
      console.log(`[snapshots] Done in ${Date.now() - t0}ms: ${written} written, ${skipped} skipped, ${errors} errors`);
      if (errors > 0) process.exit(1);
    })
    .catch((e) => {
      console.error("[snapshots] Fatal error:", e);
      process.exit(1);
    });
}
