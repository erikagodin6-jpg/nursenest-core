#!/usr/bin/env node
/**
 * Global clinical-depth audit for bundled pathway lessons + lesson library (all tiers).
 * Read-only. Does NOT run during Next.js render.
 *
 *   node scripts/audit-lesson-clinical-depth.mjs
 *   node scripts/audit-lesson-clinical-depth.mjs --tier=rn --json-out=tmp/rn-audit.json
 *   node scripts/audit-lesson-clinical-depth.mjs --enforce
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { walkPathwayCatalogLocations, auditLesson, normalizeTierFilter, tierFilterMatches } from "./lib/lesson-clinical-depth-shared.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.join(__dirname, "..");
const PATHWAY_DIR = path.join(REPO_ROOT, "nursenest-core", "src", "content", "pathway-lessons");
const LESSON_LIBRARY = path.join(REPO_ROOT, "nursenest-core", "src", "content", "lessons", "lesson-library.json");

function loadJson(fp) {
  return JSON.parse(fs.readFileSync(fp, "utf8"));
}

function walkPathwayCatalogs() {
  const rows = [];
  for (const loc of walkPathwayCatalogLocations(PATHWAY_DIR)) {
    const file = path.basename(loc.filePath);
    rows.push(
      auditLesson({
        lesson: loc.lesson,
        source: `pathway-lessons/${file}`,
        pathwayId: loc.pathwayId,
      }),
    );
  }
  return rows;
}

function walkLessonLibrary() {
  const rows = [];
  if (!fs.existsSync(LESSON_LIBRARY)) return rows;
  const data = loadJson(LESSON_LIBRARY);
  const lessons = data.lessons;
  if (!Array.isArray(lessons)) return rows;
  const source = "content/lessons/lesson-library.json";
  for (const lesson of lessons) {
    const ids = Array.isArray(lesson.pathwayIds) ? lesson.pathwayIds : ["library"];
    for (const pathwayId of ids) {
      const { pathwayIds: _p, ...rest } = lesson;
      rows.push(auditLesson({ lesson: rest, source, pathwayId }));
    }
  }
  return rows;
}

function aggregate(rows) {
  const byTier = new Map();
  const critical = rows.filter((r) => r.critical);
  const flagged = rows.filter((r) => r.flags.length > 0);
  const flagHistogram = new Map();
  const manualReview = rows.filter(
    (r) =>
      r.flags.includes("generic_boilerplate_heavy") ||
      r.flags.includes("thin_total_words") ||
      r.flags.includes("weak_pathophysiology_language") ||
      r.flags.includes("thin_short_form_spine") ||
      r.flags.includes("thin_clinical_meaning"),
  );
  for (const r of rows) {
    byTier.set(r.tier, (byTier.get(r.tier) ?? 0) + 1);
    for (const f of r.flags) flagHistogram.set(f, (flagHistogram.get(f) ?? 0) + 1);
  }
  const topFlags = [...flagHistogram.entries()].sort((a, b) => b[1] - a[1]).slice(0, 18);
  return {
    scannedLessons: rows.length,
    uniqueSlugNote: "lesson-library rows duplicated per pathwayId in scan",
    lessonsWithAnyFlag: flagged.length,
    criticalCount: critical.length,
    manualReviewQueueApprox: manualReview.length,
    byTier: Object.fromEntries(byTier.entries()),
    topFlags,
    sampleCritical: critical.slice(0, 40).map((r) => ({ slug: r.slug, pathwayId: r.pathwayId, flags: r.flags })),
  };
}

function main() {
  const argv = process.argv.slice(2);
  const enforce = argv.includes("--enforce");
  const jsonIdx = argv.findIndex((a) => a.startsWith("--json-out="));
  const jsonOut = jsonIdx >= 0 ? argv[jsonIdx].split("=", 2)[1] : null;
  const tierFilter = normalizeTierFilter(argv);

  let rows = [...walkPathwayCatalogs(), ...walkLessonLibrary()];
  if (tierFilter) {
    rows = rows.filter((r) => tierFilterMatches(tierFilter, r.pathwayId));
  }
  const summary = aggregate(rows);

  console.log("=== Lesson clinical depth audit ===");
  console.log(JSON.stringify({ ...summary, tierFilter: tierFilter ?? "all" }, null, 2));

  if (jsonOut) {
    const outPath = path.isAbsolute(jsonOut) ? jsonOut : path.join(REPO_ROOT, jsonOut);
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), tierFilter: tierFilter ?? "all", summary, rows }, null, 2)}\n`);
    console.log(`Wrote ${outPath}`);
  }

  if (enforce && summary.criticalCount > 0) {
    console.error(`::error:: audit-lesson-clinical-depth: --enforce failed (${summary.criticalCount} critical lessons).`);
    process.exit(1);
  }
}

main();
