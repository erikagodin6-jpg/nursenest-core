#!/usr/bin/env node
/**
 * Batch structural upgrade for pathway lesson JSON (scaffold append, no slug changes).
 * Pathway bundled catalogs only — not lesson-library.json (v1).
 *
 *   node scripts/upgrade-existing-lesson-depth.mjs --tier=rn --limit=25 --dry-run
 *   node scripts/upgrade-existing-lesson-depth.mjs --tier=rn --limit=25 --write --json-out=tmp/rn-upgrade.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  walkPathwayCatalogLocations,
  auditLesson,
  tierFilterMatches,
  normalizeTierFilter,
} from "./lib/lesson-clinical-depth-shared.mjs";
import {
  upgradeLessonInMemory,
  loadCatalogJson,
  saveCatalogJson,
  applyLessonAtLocation,
  lessonsStructuralFingerprint,
} from "./lib/lesson-depth-upgrade-lib.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const PATHWAY_DIR = process.env.NN_LESSON_PATHWAY_DIR
  ? path.resolve(process.env.NN_LESSON_PATHWAY_DIR)
  : path.join(REPO_ROOT, "nursenest-core", "src", "content", "pathway-lessons");

function parseLimit(argv) {
  const p = argv.find((a) => a.startsWith("--limit="));
  if (!p) return 10;
  return Math.max(1, parseInt(p.split("=", 2)[1], 10) || 10);
}

function main() {
  const argv = process.argv.slice(2);
  const tier = normalizeTierFilter(argv);
  if (!tier) {
    console.error("Required: --tier=rn|rpn|pn|np|allied|new-grad");
    process.exit(2);
  }
  const limit = parseLimit(argv);
  const write = argv.includes("--write");
  const dryRun = !write;
  const onlyMissingSpine = !argv.includes("--all-spine");
  const jsonOut = (argv.find((a) => a.startsWith("--json-out=")) || "").split("=", 2)[1];

  const backlog = [];
  for (const loc of walkPathwayCatalogLocations(PATHWAY_DIR)) {
    if (!tierFilterMatches(tier, loc.pathwayId)) continue;
    const row = auditLesson({
      lesson: loc.lesson,
      source: path.relative(REPO_ROOT, loc.filePath),
      pathwayId: loc.pathwayId,
    });
    backlog.push({ loc, row });
  }
  backlog.sort((a, b) => (b.row.priorityScore ?? 0) - (a.row.priorityScore ?? 0));

  const results = [];
  const byFile = new Map();
  const fpSeen = new Map();
  let count = 0;

  for (const { loc, row } of backlog) {
    const up = upgradeLessonInMemory(loc.lesson, { onlyMissingSpine });
    if (!up.ok) {
      results.push({
        slug: row.slug,
        pathwayId: row.pathwayId,
        file: path.relative(REPO_ROOT, loc.filePath),
        action: "skipped",
        reason: up.skippedReason,
        priorityScore: row.priorityScore,
        missingSpineSections: row.missingSpineSections,
      });
      continue;
    }
    const fp = lessonsStructuralFingerprint(up.lesson);
    if (fpSeen.has(fp)) {
      results.push({
        slug: row.slug,
        pathwayId: row.pathwayId,
        file: path.relative(REPO_ROOT, loc.filePath),
        action: "skipped",
        reason: "duplicate_structural_fingerprint_in_batch",
        priorityScore: row.priorityScore,
        missingSpineSections: row.missingSpineSections,
      });
      continue;
    }
    if (count >= limit) break;
    fpSeen.set(fp, row.slug);
    count++;

    results.push({
      slug: row.slug,
      title: row.title,
      pathwayId: row.pathwayId,
      bodySystem: row.bodySystem,
      topic: row.topic,
      file: path.relative(REPO_ROOT, loc.filePath),
      action: dryRun ? "would_write" : "written",
      priorityScore: row.priorityScore,
      missingSpineSections: row.missingSpineSections,
      genericFillerFlags: row.genericFillerFlags,
      wordsBefore: up.wordsBefore,
      wordsAfter: up.wordsAfter,
    });

    if (!byFile.has(loc.filePath)) byFile.set(loc.filePath, []);
    byFile.get(loc.filePath).push({ loc, lesson: up.lesson });
  }

  if (write) {
    for (const [filePath, mutations] of byFile.entries()) {
      const data = loadCatalogJson(filePath);
      for (const { loc, lesson } of mutations) applyLessonAtLocation(data, loc, lesson);
      saveCatalogJson(filePath, data);
      console.log(`Wrote ${path.relative(REPO_ROOT, filePath)} (${mutations.length} lessons)`);
    }
  } else {
    const n = results.filter((r) => r.action === "would_write").length;
    console.log(`Dry run: ${n} lesson(s) would update (tier=${tier}, limit=${limit}).`);
  }

  const summary = {
    totalResults: results.length,
    written: results.filter((r) => r.action === "written").length,
    wouldWrite: results.filter((r) => r.action === "would_write").length,
  };
  console.log(JSON.stringify({ summary }, null, 2));

  if (jsonOut) {
    const outPath = path.isAbsolute(jsonOut) ? jsonOut : path.join(REPO_ROOT, jsonOut);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(
      outPath,
      `${JSON.stringify({ generatedAt: new Date().toISOString(), tier, dryRun, limit, onlyMissingSpine, summary, results }, null, 2)}\n`,
      "utf8",
    );
    console.log(`Report: ${outPath}`);
  }
}

main();
