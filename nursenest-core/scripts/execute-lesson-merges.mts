/**
 * Lesson Merge Executor
 *
 * Reads APPROVED_MERGES from canonical-lesson-rules.ts and either:
 *   --dry-run   Print what would happen without modifying anything (default)
 *   --execute   Apply merges to the catalog JSON files and mark deprecated lessons
 *
 * IMPORTANT: Review the audit report at .claude/audits/lesson-duplicate-audit-categorized.md
 * before running with --execute.
 *
 * Usage:
 *   npx tsx scripts/execute-lesson-merges.mts --dry-run
 *   npx tsx scripts/execute-lesson-merges.mts --execute
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { APPROVED_MERGES, PENDING_OVERLAP_CHECK } from "../src/lib/lessons/canonical-lesson-rules.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_DIR = path.join(__dirname, "../src/content/pathway-lessons");
const DRY_RUN = !process.argv.includes("--execute");

type LessonRecord = {
  slug: string;
  title: string;
  sections?: Array<{ id: string; kind: string; heading: string; body: string }>;
  canonicalLessonId?: string | null;
  mergedFromSlugs?: string[];
  deprecatedAt?: string | null;
  redirectToSlug?: string | null;
  [key: string]: unknown;
};

type CatalogPathway = {
  lessons: LessonRecord[];
  [key: string]: unknown;
};

type Catalog = {
  version?: number;
  pathways?: Record<string, CatalogPathway>;
  lessons?: LessonRecord[];
};

// ── Load/save catalog files ────────────────────────────────────────────────

/** All catalog file paths that contain lessons for a given pathway. */
function findAllCatalogFilesForPathway(pathwayId: string): string[] {
  const files = fs.readdirSync(CATALOG_DIR).filter((f) => f.endsWith(".json"));
  const found: string[] = [];
  for (const file of files) {
    const fullPath = path.join(CATALOG_DIR, file);
    let raw: Catalog;
    try {
      raw = JSON.parse(fs.readFileSync(fullPath, "utf8")) as Catalog;
    } catch {
      continue;
    }
    const pw = raw.pathways?.[pathwayId];
    if (!pw) continue;
    const lessons = Array.isArray(pw) ? pw : (pw as CatalogPathway).lessons;
    if (Array.isArray(lessons) && lessons.length > 0) {
      found.push(fullPath);
    }
  }
  return found;
}

function loadCatalog(filePath: string): Catalog {
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as Catalog;
}

function saveCatalog(filePath: string, catalog: Catalog): void {
  fs.writeFileSync(filePath, JSON.stringify(catalog, null, 2) + "\n");
}

function getLessonsForPathway(catalog: Catalog, pathwayId: string): LessonRecord[] {
  const pw = catalog.pathways?.[pathwayId];
  if (!pw) return [];
  // Some catalogs store { lessons: [] }, others store the array directly
  if (Array.isArray(pw)) return pw as unknown as LessonRecord[];
  return (pw as CatalogPathway).lessons ?? [];
}

/** Find a lesson by slug across all catalog files for a pathway. Returns { lesson, filePath }. */
function findLessonAcrossCatalogs(
  slug: string,
  pathwayId: string,
): { lesson: LessonRecord; filePath: string; catalog: Catalog } | null {
  const files = fs.readdirSync(CATALOG_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const fullPath = path.join(CATALOG_DIR, file);
    let raw: Catalog;
    try {
      raw = JSON.parse(fs.readFileSync(fullPath, "utf8")) as Catalog;
    } catch {
      continue;
    }
    const lessons = getLessonsForPathway(raw, pathwayId);
    const lesson = lessons.find((l) => l.slug === slug);
    if (lesson) return { lesson, filePath: fullPath, catalog: raw };
  }
  return null;
}

// ── Section merging ────────────────────────────────────────────────────────

/**
 * Merge unique sections from source lesson into target lesson.
 * A section is "unique" if its kind does not already exist in the target.
 */
function mergeSections(
  targetSections: LessonRecord["sections"],
  sourceSections: LessonRecord["sections"],
): LessonRecord["sections"] {
  const target = targetSections ?? [];
  const source = sourceSections ?? [];
  const existingKinds = new Set(target.map((s) => s.kind));
  const unique = source.filter((s) => !existingKinds.has(s.kind));
  return [...target, ...unique];
}

// ── Dry-run output helpers ─────────────────────────────────────────────────

function log(msg: string): void {
  console.log(msg);
}

function logDiff(label: string, before: string, after: string): void {
  if (before === after) return;
  console.log(`  [${label}]`);
  console.log(`    BEFORE: ${before}`);
  console.log(`    AFTER:  ${after}`);
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  if (DRY_RUN) {
    log("=== DRY RUN MODE — no files will be modified ===\n");
  } else {
    log("=== EXECUTE MODE — catalog files will be modified ===\n");
    log("Sleeping 3 seconds for last-chance abort (Ctrl+C)...\n");
    await new Promise((r) => setTimeout(r, 3000));
  }

  log(`Processing ${APPROVED_MERGES.length} approved merges...\n`);

  const results: Array<{ merge: (typeof APPROVED_MERGES)[0]; status: string; detail: string }> = [];

  for (const merge of APPROVED_MERGES) {
    log(`--- [${merge.risk.toUpperCase()}] ${merge.pathwayId} ---`);
    log(`  Canonical: ${merge.canonicalSlug} → "${merge.canonicalTitle}"`);
    log(`  Merge in:  ${merge.mergeSlugs.join(", ")}`);
    log(`  Rationale: ${merge.rationale}`);

    // Find canonical across all catalog files for this pathway
    const canonicalResult = findLessonAcrossCatalogs(merge.canonicalSlug, merge.pathwayId);
    if (!canonicalResult) {
      log(`  ⚠ Canonical slug "${merge.canonicalSlug}" not found in any catalog for ${merge.pathwayId} — skipping.`);
      results.push({ merge, status: "SKIPPED", detail: "Canonical lesson not found" });
      log("");
      continue;
    }
    const { lesson: canonical, filePath: canonicalFile, catalog: canonicalCatalog } = canonicalResult;

    // Find each merge source (may be in different expansion catalog)
    const mergeResults = merge.mergeSlugs.map((slug) => findLessonAcrossCatalogs(slug, merge.pathwayId));
    const missing = merge.mergeSlugs.filter((_, i) => !mergeResults[i]);
    if (missing.length > 0) {
      log(`  ⚠ Missing merge sources: ${missing.join(", ")} — proceeding with found lessons.`);
    }

    const toMergeEntries = mergeResults.filter(
      (r): r is NonNullable<typeof r> => r !== null
    );

    if (toMergeEntries.length === 0) {
      log(`  ⚠ No merge source lessons found — skipping.`);
      results.push({ merge, status: "SKIPPED", detail: "No merge sources found" });
      log("");
      continue;
    }

    // What would change?
    const beforeSectionCount = (canonical.sections ?? []).length;
    const uniqueSectionsToAdd = toMergeEntries.flatMap(({ lesson: src }) =>
      (src.sections ?? []).filter(
        (s) => !(canonical.sections ?? []).find((cs) => cs.kind === s.kind)
      )
    );

    logDiff("title", canonical.title, merge.canonicalTitle);
    log(
      `  Sections: ${beforeSectionCount} → ${beforeSectionCount + uniqueSectionsToAdd.length} (+${uniqueSectionsToAdd.length} unique from merge sources)`
    );
    for (const s of uniqueSectionsToAdd) {
      log(`    + [${s.kind}] ${s.heading}`);
    }
    log(`  Deprecating: ${toMergeEntries.map(({ lesson: l }) => l.slug).join(", ")}`);
    log(`  Canonical file: ${path.relative(process.cwd(), canonicalFile)}`);

    if (!DRY_RUN) {
      // Apply merge to canonical
      canonical.title = merge.canonicalTitle;
      canonical.sections = mergeSections(
        canonical.sections,
        toMergeEntries.flatMap(({ lesson: l }) => l.sections ?? [])
      );
      canonical.mergedFromSlugs = [
        ...(canonical.mergedFromSlugs ?? []),
        ...toMergeEntries.map(({ lesson: l }) => l.slug),
      ];
      saveCatalog(canonicalFile, canonicalCatalog);

      // Mark deprecated lessons in their respective catalog files
      const now = new Date().toISOString();
      // Group by file to avoid double-writes
      const byFile = new Map<string, { catalog: Catalog; lessons: LessonRecord[] }>();
      for (const { lesson: dep, filePath, catalog: cat } of toMergeEntries) {
        dep.canonicalLessonId = merge.canonicalSlug;
        dep.deprecatedAt = now;
        dep.redirectToSlug = merge.canonicalSlug;
        if (!byFile.has(filePath)) byFile.set(filePath, { catalog: cat, lessons: [] });
        byFile.get(filePath)!.lessons.push(dep);
      }
      for (const [fp, { catalog: cat }] of byFile.entries()) {
        if (fp !== canonicalFile) saveCatalog(fp, cat);
      }

      log(`  ✓ Merge applied`);
      results.push({ merge, status: "APPLIED", detail: `${toMergeEntries.length} lessons deprecated` });
    } else {
      log(`  [DRY RUN] Would write changes to ${path.relative(process.cwd(), canonicalFile)}`);
      results.push({ merge, status: "DRY_RUN", detail: `Would deprecate ${toMergeEntries.length} lessons` });
    }

    log("");
  }

  // Summary
  log("=".repeat(60));
  log("MERGE SUMMARY");
  log("=".repeat(60));
  for (const r of results) {
    const icon = r.status === "APPLIED" ? "✓" : r.status === "SKIPPED" ? "⚠" : "~";
    log(`${icon} [${r.status}] ${r.merge.pathwayId}/${r.merge.canonicalSlug} — ${r.detail}`);
  }

  log("\nPending overlap checks (not yet approved):");
  for (const p of PENDING_OVERLAP_CHECK) {
    log(`  ${p.pathwayId}: ${p.slugA} ↔ ${p.slugB}`);
    log(`  → ${p.note}`);
  }

  if (DRY_RUN) {
    log("\nRun with --execute to apply the merges.");
  } else {
    const applied = results.filter((r) => r.status === "APPLIED").length;
    log(`\n✓ Applied ${applied} merges. Run the redirect audit next:`);
    log("  node scripts/audit-lesson-redirect-coverage.mjs");
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
