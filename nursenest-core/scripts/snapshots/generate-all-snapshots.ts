#!/usr/bin/env tsx
/**
 * Orchestrator: generate all study content snapshots.
 *
 * Runs flashcard + lesson snapshot generators in parallel, then writes manifest.json.
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/snapshots/generate-all-snapshots.ts
 *
 * Environment:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR  — output directory (required)
 *   DATABASE_URL                  — Postgres connection string (required)
 */

import "@/lib/db/script-env-bootstrap";

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { generateFlashcardSnapshots } from "./generate-flashcard-snapshots";
import { generateLessonSnapshots } from "./generate-lesson-snapshots";

const SNAPSHOT_DIR = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();

interface SnapshotManifest {
  lastRefreshedAt: string;
  surfaces: {
    flashcards: { written: number; skipped: number; errors: number };
    lessons: { written: number; skipped: number; errors: number };
  };
  durationMs: number;
}

async function writeManifest(dir: string, manifest: SnapshotManifest): Promise<void> {
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
}

async function main(): Promise<void> {
  if (!SNAPSHOT_DIR) {
    console.error("[snapshots] Error: STUDY_PUBLISHED_SNAPSHOT_DIR is not set. Exiting.");
    process.exit(1);
  }

  console.log(`[snapshots] Output directory: ${SNAPSHOT_DIR}`);
  const t0 = Date.now();

  console.log("[snapshots] ── Flashcard snapshots ──────────────────────────────");
  const [flashcardResult, lessonResult] = await Promise.all([
    generateFlashcardSnapshots(),
    generateLessonSnapshots(),
  ]);

  console.log("[snapshots] ── Summary ──────────────────────────────────────────");
  console.log(`  Flashcards: ${flashcardResult.written} written, ${flashcardResult.skipped} skipped, ${flashcardResult.errors} errors`);
  console.log(`  Lessons:    ${lessonResult.written} written, ${lessonResult.skipped} skipped, ${lessonResult.errors} errors`);

  const durationMs = Date.now() - t0;
  const manifest: SnapshotManifest = {
    lastRefreshedAt: new Date().toISOString(),
    surfaces: {
      flashcards: { written: flashcardResult.written, skipped: flashcardResult.skipped, errors: flashcardResult.errors },
      lessons: { written: lessonResult.written, skipped: lessonResult.skipped, errors: lessonResult.errors },
    },
    durationMs,
  };

  await writeManifest(SNAPSHOT_DIR, manifest);
  console.log(`[snapshots] Manifest written. Total time: ${durationMs}ms`);

  const totalErrors = flashcardResult.errors + lessonResult.errors;
  if (totalErrors > 0) {
    console.error(`[snapshots] Completed with ${totalErrors} error(s).`);
    process.exit(1);
  }
}

main().catch((e) => {
  console.error("[snapshots] Fatal error:", e);
  process.exit(1);
});
