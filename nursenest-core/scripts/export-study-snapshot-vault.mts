#!/usr/bin/env npx tsx
/**
 * Snapshot Vault Export — Phase 6 of the Self-Healing Delivery Initiative
 *
 * Generates static JSON snapshots of all study surfaces that can serve as
 * tertiary fallbacks when both the primary DB and secondary cache are unavailable.
 *
 * Output directory: STUDY_PUBLISHED_SNAPSHOT_DIR (env var) or ./data/snapshots
 *
 * Snapshot format: StudyPublishedSnapshotEnvelope<T> (versioned JSON)
 *
 * Run: npx tsx scripts/export-study-snapshot-vault.mts
 * Cron: 0 2 * * *   (nightly at 02:00 UTC)
 */

import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_DIR = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim()
  || path.join(ROOT, "data", "snapshots");

const VERSION = new Date().toISOString().slice(0, 10).replace(/-/g, "");
const NOW = new Date().toISOString();

type SnapshotEnvelope<T> = {
  schema: "nursenest.study_snapshot.v1";
  surface: string;
  version: string;
  capturedAt: string;
  payload: T;
};

function envelope<T>(surface: string, payload: T): SnapshotEnvelope<T> {
  return {
    schema: "nursenest.study_snapshot.v1",
    surface,
    version: VERSION,
    capturedAt: NOW,
    payload,
  };
}

async function writeSnapshot(relPath: string[], data: unknown): Promise<void> {
  const dir = path.join(OUT_DIR, ...relPath.slice(0, -1));
  await mkdir(dir, { recursive: true });
  const filePath = path.join(OUT_DIR, ...relPath);
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`  ✓ ${relPath.join("/")}`);
}

// ─── 1. Flashcard Gap-Closure Cards ──────────────────────────────────────────

async function exportFlashcardSnapshots(): Promise<void> {
  console.log("\n[1] Flashcard gap-closure snapshots...");

  const { NCLEX_PN_GAP_FLASHCARDS } = await import(
    "../src/content/flashcards/nclex-pn-gap-closure-flashcards.js"
  );
  const { CNPLE_GAP_FLASHCARDS } = await import(
    "../src/content/flashcards/cnple-gap-closure-flashcards.js"
  );

  // NCLEX-PN flashcards
  await writeSnapshot(
    ["flashcards", "gap-closure-nclex-pn.json"],
    envelope("flashcard_gap_closure_nclex_pn", {
      exam: "NCLEX-PN",
      cardCount: NCLEX_PN_GAP_FLASHCARDS.length,
      cards: NCLEX_PN_GAP_FLASHCARDS,
    }),
  );

  // CNPLE flashcards
  await writeSnapshot(
    ["flashcards", "gap-closure-cnple.json"],
    envelope("flashcard_gap_closure_cnple", {
      exam: "CNPLE",
      cardCount: CNPLE_GAP_FLASHCARDS.length,
      cards: CNPLE_GAP_FLASHCARDS,
    }),
  );

  console.log(`  Exported ${NCLEX_PN_GAP_FLASHCARDS.length + CNPLE_GAP_FLASHCARDS.length} flashcards`);
}

// ─── 2. Question Bank Snapshots ───────────────────────────────────────────────

async function exportQuestionSnapshots(): Promise<void> {
  console.log("\n[2] Question bank snapshots...");

  const { NCLEX_PN_GAP_QUESTIONS } = await import(
    "../src/content/questions/nclex-pn-gap-closure-questions.js"
  );

  await writeSnapshot(
    ["questions", "gap-closure-nclex-pn.json"],
    envelope("question_bank_gap_closure_nclex_pn", {
      exam: "NCLEX-PN",
      questionCount: NCLEX_PN_GAP_QUESTIONS.length,
      questions: NCLEX_PN_GAP_QUESTIONS,
    }),
  );

  console.log(`  Exported ${NCLEX_PN_GAP_QUESTIONS.length} questions`);
}

// ─── 3. Lesson Catalog Snapshots ─────────────────────────────────────────────

async function exportLessonSnapshots(): Promise<void> {
  console.log("\n[3] Lesson catalog snapshots...");

  const { readFileSync } = await import("node:fs");
  const catalogPath = path.join(ROOT, "src/content/pathway-lessons/catalog.json");
  const catalog = JSON.parse(readFileSync(catalogPath, "utf8")) as {
    pathways: Record<string, { lessons: Array<{ slug: string; title: string; topic: string }> }>;
  };

  let totalLessons = 0;
  for (const [pathwayId, data] of Object.entries(catalog.pathways)) {
    const lessons = data.lessons ?? [];
    totalLessons += lessons.length;

    // Slim snapshot: just enough metadata for hub rendering without DB
    const slim = lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      topic: l.topic,
    }));

    await writeSnapshot(
      ["lessons", `catalog-slim-${pathwayId}.json`],
      envelope(`lessons_catalog_slim_${pathwayId}`, {
        pathwayId,
        lessonCount: slim.length,
        lessons: slim,
      }),
    );
  }

  console.log(`  Exported ${totalLessons} lesson metadata rows across ${Object.keys(catalog.pathways).length} pathways`);
}

// ─── 4. Hub Bootstrap Snapshots ───────────────────────────────────────────────

async function exportHubBootstrapSnapshots(): Promise<void> {
  console.log("\n[4] Hub bootstrap snapshots...");

  // Flashcard hub pathway bootstrap (CA/US × RN/RPN/NP)
  const pathwayOptions = [
    { id: "us-lpn-nclex-pn", label: "NCLEX-PN (US LPN)" },
    { id: "ca-rpn-rex-pn", label: "REx-PN (Canadian RPN)" },
    { id: "us-rn-nclex-rn", label: "NCLEX-RN (US RN)" },
    { id: "ca-rn-nclex-rn", label: "NCLEX-RN (Canadian RN)" },
    { id: "ca-np-cnple", label: "CNPLE (Canadian NP)" },
    { id: "us-np-fnp", label: "FNP (US NP)" },
  ];

  for (const { country, tier } of [
    { country: "CA", tier: "RPN" },
    { country: "US", tier: "RPN" },
    { country: "CA", tier: "RN" },
    { country: "US", tier: "RN" },
    { country: "CA", tier: "NP" },
    { country: "US", tier: "NP" },
  ]) {
    await writeSnapshot(
      ["flashcards", `hub-bootstrap-${country}-${tier}.json`],
      envelope("flashcards_hub_pathway_bootstrap", {
        pathwayOptions,
        compatibleRows: pathwayOptions.map((p) => ({ id: p.id, shortName: p.label.split(" ")[0] ?? p.id })),
      }),
    );
  }

  console.log(`  Exported 6 hub bootstrap snapshots`);
}

// ─── 5. Manifest ──────────────────────────────────────────────────────────────

async function writeManifest(surfaces: string[]): Promise<void> {
  await writeSnapshot(
    ["snapshot-manifest.json"],
    {
      schema: "nursenest.snapshot_manifest.v1",
      generatedAt: NOW,
      version: VERSION,
      snapshotDir: OUT_DIR,
      surfaces,
      totalFiles: surfaces.length + 1,
      note: "Set STUDY_PUBLISHED_SNAPSHOT_DIR to this directory path in deployment env vars.",
    },
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  console.log(`\nStudy Content Snapshot Vault Export`);
  console.log(`Output: ${OUT_DIR}`);
  console.log(`Version: ${VERSION}\n`);

  await mkdir(OUT_DIR, { recursive: true });

  const surfaces: string[] = [];

  try { await exportFlashcardSnapshots(); surfaces.push("flashcard_gap_closure"); } catch (e) { console.error("  ✗ Flashcards failed:", e); }
  try { await exportQuestionSnapshots(); surfaces.push("question_bank_gap_closure"); } catch (e) { console.error("  ✗ Questions failed:", e); }
  try { await exportLessonSnapshots(); surfaces.push("lessons_catalog_slim"); } catch (e) { console.error("  ✗ Lessons failed:", e); }
  try { await exportHubBootstrapSnapshots(); surfaces.push("flashcards_hub_bootstrap"); } catch (e) { console.error("  ✗ Hub bootstrap failed:", e); }

  await writeManifest(surfaces);

  console.log(`\n✓ Snapshot vault written to: ${OUT_DIR}`);
  console.log(`✓ ${surfaces.length} surfaces exported`);
  console.log(`\nTo activate: set STUDY_PUBLISHED_SNAPSHOT_DIR=${OUT_DIR}`);
  console.log(`To schedule: add "0 2 * * * npx tsx scripts/export-study-snapshot-vault.mts" to crontab`);
}

main().catch((e) => { console.error("Export failed:", e); process.exit(1); });
