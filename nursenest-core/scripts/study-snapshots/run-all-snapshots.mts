/**
 * Snapshot orchestrator — runs every snapshot exporter in sequence, then uploads
 * the consolidated manifest.json to Spaces.
 *
 * Designed for nightly cron (Railway scheduled job, 02:00 UTC).
 *
 * Required env vars:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR — local filesystem scratch dir (written first, then uploaded)
 *   DATABASE_URL                 — production DB
 *
 * Optional (for Spaces upload):
 *   SPACES_ENDPOINT, SPACES_BUCKET, SPACES_KEY, SPACES_SECRET
 *   SPACES_PREFIX   (default: content-snapshots)
 *   SPACES_DRY_RUN  (if "true", skips actual S3 PUT)
 *
 * Tiers exported: RN, RPN, NP
 * Country exported: US, CA (configurable via SNAPSHOT_COUNTRIES env var)
 *
 * Exit 0 = all stages complete.
 * Exit 1 = at least one stage failed.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/run-all-snapshots.mts
 */
import "../stub-server-only.cjs";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { execSync } from "node:child_process";

import {
  uploadManifestToSpaces,
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";

const SCRIPT_DIR = import.meta.dirname ?? __dirname;
const ROOT_DIR = path.resolve(SCRIPT_DIR, "../..");

import { tmpdir } from "node:os";
const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim() || tmpdir();

const TIERS = (process.env.SNAPSHOT_TIERS ?? "RN,RPN,NP").split(",").map((t) => t.trim().toUpperCase());
const COUNTRIES = (process.env.SNAPSHOT_COUNTRIES ?? "US,CA").split(",").map((c) => c.trim().toUpperCase());

interface StageResult {
  stage: string;
  ok: boolean;
  durationMs: number;
  error?: string;
}

function run(label: string, cmd: string): StageResult {
  const start = Date.now();
  try {
    execSync(cmd, {
      cwd: ROOT_DIR,
      stdio: "inherit",
      env: { ...process.env },
    });
    return { stage: label, ok: true, durationMs: Date.now() - start };
  } catch (err: unknown) {
    return {
      stage: label,
      ok: false,
      durationMs: Date.now() - start,
      error: String(err instanceof Error ? err.message : err).slice(0, 200),
    };
  }
}

async function buildManifest(results: StageResult[]): Promise<string> {
  // Try to read existing manifest (may have been written by sub-scripts)
  let prev: Record<string, unknown> = {};
  try {
    const raw = await readFile(path.join(baseDir!, "manifest.json"), "utf8");
    prev = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    // no prior manifest
  }

  const manifest = {
    schema: "nursenest.study_snapshot_manifest.v1",
    generatedAt: new Date().toISOString(),
    healthy: results.every((r) => r.ok),
    stageCount: results.length,
    failedStages: results.filter((r) => !r.ok).map((r) => r.stage),
    stages: results.map((r) => ({
      stage: r.stage,
      ok: r.ok,
      durationMs: r.durationMs,
      ...(r.error ? { error: r.error } : {}),
    })),
    ...prev,
    lastRefreshedAt: new Date().toISOString(),
  };

  return JSON.stringify(manifest, null, 2);
}

async function main(): Promise<void> {
  const started = Date.now();
  console.log(`[snapshots] Starting full snapshot run`);
  console.log(`[snapshots] Base dir: ${baseDir}`);
  console.log(`[snapshots] Tiers: ${TIERS.join(", ")}`);
  console.log(`[snapshots] Countries: ${COUNTRIES.join(", ")}`);
  console.log("");

  const useSpaces = spacesConfigured();
  if (useSpaces) console.log("[snapshots] Spaces upload: ENABLED");
  else console.log("[snapshots] Spaces upload: DISABLED (no SPACES_* env vars)");
  console.log("");

  const results: StageResult[] = [];
  const tsx = "npx tsx";

  // ─── Stage 1: Lessons hub bootstrap ────────────────────────────────────────
  for (const tier of TIERS) {
    for (const country of COUNTRIES) {
      // Typical: page 1, pageSize 24 (matches production defaults)
      results.push(
        run(
          `lessons-hub:${tier}:${country}`,
          `${tsx} scripts/study-snapshots/export-pathway-lessons-hub-snapshot.mts ${tier} ${country} 1 24`,
        ),
      );
    }
  }

  // ─── Stage 2: Flashcards hub bootstrap ─────────────────────────────────────
  for (const tier of TIERS) {
    for (const country of COUNTRIES) {
      results.push(
        run(
          `flashcards-hub:${tier}:${country}`,
          `${tsx} scripts/study-snapshots/export-flashcards-hub-bootstrap-snapshot.mts ${tier} ${country}`,
        ),
      );
    }
  }

  // ─── Stage 3: Practice tests hub bootstrap ─────────────────────────────────
  for (const tier of TIERS) {
    for (const country of COUNTRIES) {
      results.push(
        run(
          `practice-hub:${tier}:${country}`,
          `${tsx} scripts/study-snapshots/export-practice-tests-hub-bootstrap-snapshot.mts ${tier} ${country}`,
        ),
      );
    }
  }

  // ─── Stage 4: Question packs (all tiers, all core topics) ──────────────────
  results.push(
    run(
      "question-packs:all",
      `${tsx} scripts/study-snapshots/export-question-packs.mts`,
    ),
  );

  // ─── Stage 5: CAT resilience pools (RN/RPN/NP, slots A/B/C) ───────────────
  results.push(
    run(
      "cat-resilience-pools:all",
      `${tsx} scripts/study-snapshots/export-cat-resilience-pools.mts`,
    ),
  );

  // ─── Stage 6: Flashcard subscriber list ────────────────────────────────────
  for (const tier of TIERS) {
    for (const country of COUNTRIES) {
      results.push(
        run(
          `flashcard-list:${tier}:${country}`,
          `${tsx} scripts/study-snapshots/export-flashcards-subscriber-list-snapshot.mts ${tier} ${country}`,
        ),
      );
    }
  }

  // ─── Phase 2.5: Manifest acceleration ────────────────────────────────────
  // Question discovery aggregates (replaces GROUP BY on startup)
  results.push(run("question-manifests:all", `${tsx} scripts/study-snapshots/export-question-manifests.mts`));

  // Flashcard inventory counts (replaces 3-query Prisma transaction on startup)
  results.push(run("flashcard-inventory:all", `${tsx} scripts/study-snapshots/export-flashcard-inventory-snapshots.mts`));

  // Lesson count + first-page manifests (replaces contentItem.count() + findMany on startup)
  results.push(run("lesson-manifests:all", `${tsx} scripts/study-snapshots/export-lesson-manifests.mts`));

  // Clinical skills category manifest
  results.push(run("clinical-skills-manifest", `${tsx} scripts/study-snapshots/export-clinical-skills-manifests.mts`));

  // ECG category manifest
  results.push(run("ecg-manifest", `${tsx} scripts/study-snapshots/export-ecg-manifests.mts`));

  // ─── Stage 7: Build + upload manifest ──────────────────────────────────────
  const manifestJson = await buildManifest(results);
  const manifestPath = path.join(baseDir!, "manifest.json");
  await writeFile(manifestPath, manifestJson, "utf8");
  console.log(`\n[snapshots] Manifest written: ${manifestPath}`);

  if (useSpaces) {
    // Upload manifest
    await uploadManifestToSpaces(manifestJson);

    // Upload existing filesystem snapshots that were written by sub-scripts
    // (sub-scripts write to disk; this stage syncs them all to Spaces)
    const surfacePaths = [
      { dir: "lessons",         relKeyPrefix: "lessons/"    },
      { dir: "flashcards",      relKeyPrefix: "flashcards/" },
      { dir: "practice-tests",  relKeyPrefix: "practice-tests/" },
      // question-packs and cat-pools are uploaded within their own scripts
    ];

    const { readdir } = await import("node:fs/promises");
    for (const { dir, relKeyPrefix } of surfacePaths) {
      const dirPath = path.join(baseDir!, dir);
      try {
        const files = await readdir(dirPath);
        for (const f of files.filter((x) => x.endsWith(".json"))) {
          await uploadSnapshotToSpaces(path.join(dirPath, f), `${relKeyPrefix}${f}`);
        }
      } catch {
        // dir may not exist if all sub-scripts in that surface failed
      }
    }
  }

  // ─── Final report ─────────────────────────────────────────────────────────
  const totalMs = Date.now() - started;
  const failed = results.filter((r) => !r.ok);

  console.log(`\n${"─".repeat(70)}`);
  console.log(`[snapshots] COMPLETE — ${results.length} stages in ${totalMs}ms`);
  for (const r of results) {
    const tag = r.ok ? "✓" : "✗";
    console.log(`  ${tag} ${r.stage.padEnd(40)} ${r.durationMs}ms${r.error ? ` — ${r.error}` : ""}`);
  }

  if (failed.length > 0) {
    console.error(`\n[snapshots] ${failed.length} stage(s) FAILED: ${failed.map((r) => r.stage).join(", ")}`);
    process.exit(1);
  }

  console.log(`\n[snapshots] All stages passed`);
}

main().catch((e) => {
  console.error("[snapshots] Fatal:", e);
  process.exit(1);
});
