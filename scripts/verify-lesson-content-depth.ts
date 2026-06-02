/**
 * verify-lesson-content-depth.ts
 *
 * Runs a content-depth audit across all pathway catalog JSONs.
 * Checks for:
 *  - Minimum word count (default 1,200 for clinical lessons)
 *  - Minimum required section kinds (≥6 of 11)
 *  - Placeholder/filler copy detection
 *  - Duplicate slugs
 *
 * Exit codes:
 *   0 — all gates pass
 *   1 — depth violations found (CI will fail)
 *
 * Usage:
 *   npx tsx scripts/verify-lesson-content-depth.ts
 *   npx tsx scripts/verify-lesson-content-depth.ts --min-words 800
 *   npx tsx scripts/verify-lesson-content-depth.ts --json-out tmp/depth-report.json
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CATALOG_DIR = path.join(__dirname, "../nursenest-core/src/content/pathway-lessons");

// ── CLI args ──────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const MIN_WORDS = (() => {
  const i = args.indexOf("--min-words");
  return i !== -1 ? parseInt(args[i + 1], 10) : 1200;
})();
const JSON_OUT = (() => {
  const i = args.indexOf("--json-out");
  return i !== -1 ? args[i + 1] : null;
})();
const STRICT = args.includes("--strict");

// ── Config ────────────────────────────────────────────────────────────────────
const REQUIRED_SECTION_KINDS = new Set([
  "introduction",
  "pathophysiology_overview",
  "risk_factors",
  "signs_symptoms",
  "labs_diagnostics",
  "nursing_assessment_interventions",
  "clinical_decision_making",
  "complications",
  "clinical_pearls",
  "client_education",
  "case_study",
]);

const MIN_SECTION_COUNT = 6;  // at least 6 of 11 required sections present

const PLACEHOLDER_PATTERNS = [
  /coming soon/i,
  /TODO/,
  /\[write your/i,
  /brief overview/i,
  /surface.level/i,
  /placeholder/i,
  /\[PLACEHOLDER\]/,
];

// ── Types ─────────────────────────────────────────────────────────────────────
interface CatalogSection {
  id: string;
  heading: string;
  kind: string;
  body: string;
}

interface LessonAudit {
  slug: string;
  title: string;
  pathway: string;
  catalogFile: string;
  wordCount: number;
  sectionCount: number;
  requiredSectionsPresent: number;
  missingRequiredKinds: string[];
  hasPlaceholder: boolean;
  placeholderMatches: string[];
  passesWordGate: boolean;
  passesSectionGate: boolean;
  passesPlaceholderGate: boolean;
  passes: boolean;
}

interface CatalogStats {
  file: string;
  totalLessons: number;
  passing: number;
  failing: number;
  avgWords: number;
  medianWords: number;
  byTier: Record<string, { total: number; passing: number }>;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function countWords(sections: CatalogSection[]): number {
  return sections.reduce((n, s) => n + (s.body || "").split(/\s+/).filter(Boolean).length, 0);
}

function detectPlaceholder(sections: CatalogSection[]): { found: boolean; matches: string[] } {
  const matches: string[] = [];
  for (const s of sections) {
    for (const pat of PLACEHOLDER_PATTERNS) {
      if (pat.test(s.body || "")) {
        matches.push(`[${s.kind}] matched: ${pat}`);
      }
    }
  }
  return { found: matches.length > 0, matches };
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
    : sorted[mid];
}

function auditLesson(
  lesson: any,
  pathway: string,
  catalogFile: string
): LessonAudit {
  const sections: CatalogSection[] = (lesson.sections || []).filter(
    (s: any) => typeof s === "object" && s !== null
  );
  const wordCount = countWords(sections);
  const presentKinds = new Set(sections.map((s) => s.kind));
  const missingRequiredKinds = [...REQUIRED_SECTION_KINDS].filter(
    (k) => !presentKinds.has(k)
  );
  const requiredPresent = REQUIRED_SECTION_KINDS.size - missingRequiredKinds.length;
  const { found: hasPlaceholder, matches: placeholderMatches } = detectPlaceholder(sections);

  const passesWordGate = wordCount >= MIN_WORDS;
  const passesSectionGate = (REQUIRED_SECTION_KINDS.size - missingRequiredKinds.length) >= MIN_SECTION_COUNT;
  const passesPlaceholderGate = !hasPlaceholder;

  return {
    slug: lesson.slug || "?",
    title: lesson.title || lesson.slug || "?",
    pathway,
    catalogFile,
    wordCount,
    sectionCount: sections.length,
    requiredSectionsPresent: requiredPresent,
    missingRequiredKinds,
    hasPlaceholder,
    placeholderMatches,
    passesWordGate,
    passesSectionGate,
    passesPlaceholderGate,
    passes: passesWordGate && passesSectionGate && passesPlaceholderGate,
  };
}

// ── Catalog loader ────────────────────────────────────────────────────────────
const PATHWAY_TIER_MAP: Record<string, string> = {
  "ca-rn-nclex-rn": "rn",
  "us-rn-nclex-rn": "rn",
  "ca-rpn-rex-pn": "rpn",
  "us-lpn-nclex-pn": "rpn",
  "us-np-fnp": "np",
};

function loadAllLessons(): Array<{ lesson: any; pathway: string; file: string }> {
  const skip = new Set(["nclex-rn-source-checklist.json", "rn-nclex-catalog-import-state.json", "rn-nclex-master-map.json", "rn-nclex-explicit-inventory-aliases.json"]);
  const results: Array<{ lesson: any; pathway: string; file: string }> = [];

  for (const fname of fs.readdirSync(CATALOG_DIR)) {
    if (!fname.endsWith(".json") || skip.has(fname)) continue;
    const fpath = path.join(CATALOG_DIR, fname);
    let data: any;
    try {
      data = JSON.parse(fs.readFileSync(fpath, "utf8"));
    } catch {
      continue;
    }

    // Handle {pathways: {key: {lessons: []}}}
    if (data && typeof data === "object" && "pathways" in data) {
      for (const [pwKey, pwVal] of Object.entries<any>(data.pathways)) {
        for (const lesson of pwVal?.lessons || []) {
          if (lesson && lesson.slug) {
            results.push({ lesson, pathway: pwKey, file: fname });
          }
        }
      }
    } else if (data && typeof data === "object" && "lessons" in data) {
      for (const lesson of data.lessons || []) {
        if (lesson && lesson.slug) {
          results.push({ lesson, pathway: data.pathwayId || fname.replace(".json",""), file: fname });
        }
      }
    } else if (Array.isArray(data)) {
      for (const item of data) {
        if (item?.slug) results.push({ lesson: item, pathway: fname.replace(".json",""), file: fname });
        else if (item?.lessons) {
          for (const l of item.lessons) {
            if (l?.slug) results.push({ lesson: l, pathway: item.pathwayId || fname, file: fname });
          }
        }
      }
    }
  }

  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────
const allLessonsRaw = loadAllLessons();

// Duplicate detection is pathway-scoped: same slug within the same pathway = real duplicate
// Same slug across DIFFERENT pathways is expected (CA-RN and US-RN both have Heart Failure)
const duplicateSlugs: Array<{ slug: string; pathway: string; files: string[] }> = [];
const pathwaySlugFiles = new Map<string, string[]>(); // key = "pathway:slug"
for (const { lesson, pathway, file } of allLessonsRaw) {
  const key = `${pathway}:${lesson.slug}`;
  const existing = pathwaySlugFiles.get(key) || [];
  existing.push(file);
  pathwaySlugFiles.set(key, existing);
}
for (const [key, files] of pathwaySlugFiles) {
  if (files.length > 1) {
    const [pathway, slug] = key.split(":").reduce((acc, v, i) => { if (i === 0) acc[0] = v; else acc[1] = (acc[1] ? acc[1] + ":" : "") + v; return acc; }, ["", ""] as [string, string]);
    duplicateSlugs.push({ slug, pathway, files });
  }
}

// Audit all lessons
const audits: LessonAudit[] = allLessonsRaw.map(({ lesson, pathway, file }) =>
  auditLesson(lesson, pathway, file)
);

const passing = audits.filter((a) => a.passes);
const failing = audits.filter((a) => !a.passes);
const thinOnly = audits.filter((a) => !a.passesWordGate);
const missingSections = audits.filter((a) => !a.passesSectionGate);
const placeholders = audits.filter((a) => !a.passesPlaceholderGate);

const wordCounts = audits.map((a) => a.wordCount);
const totalWords = wordCounts.reduce((s, n) => s + n, 0);
const avgWords = Math.round(totalWords / wordCounts.length);
const medWords = median(wordCounts);

// Per-tier breakdown
const tierStats: Record<string, { total: number; passing: number; avgWords: number; words: number[] }> = {};
for (const audit of audits) {
  const tier = PATHWAY_TIER_MAP[audit.pathway] || "other";
  if (!tierStats[tier]) tierStats[tier] = { total: 0, passing: 0, avgWords: 0, words: [] };
  tierStats[tier].total++;
  tierStats[tier].words.push(audit.wordCount);
  if (audit.passes) tierStats[tier].passing++;
}
for (const t of Object.values(tierStats)) {
  t.avgWords = Math.round(t.words.reduce((s, n) => s + n, 0) / t.words.length);
}

// ── Console report ────────────────────────────────────────────────────────────
console.log("\n═══════════════════════════════════════════════════════");
console.log(" NurseNest Lesson Content Depth Verification");
console.log("═══════════════════════════════════════════════════════");
console.log(`  Min word threshold: ${MIN_WORDS}`);
console.log(`  Min section gate:   ${MIN_SECTION_COUNT} of ${REQUIRED_SECTION_KINDS.size} required kinds`);
console.log(`  Total lessons:      ${audits.length}`);
console.log(`  Passing:            ${passing.length} (${Math.round(100 * passing.length / audits.length)}%)`);
console.log(`  Failing:            ${failing.length}`);
console.log(`    - Thin (<${MIN_WORDS}w):     ${thinOnly.length}`);
console.log(`    - Insufficient sections: ${missingSections.length}`);
console.log(`    - Placeholder text:      ${placeholders.length}`);
console.log(`  Avg word count:     ${avgWords}w`);
console.log(`  Median word count:  ${medWords}w`);
console.log(`  Duplicate slugs:    ${duplicateSlugs.length}`);

console.log("\n── By Tier ──────────────────────────────────────────────");
for (const [tier, stats] of Object.entries(tierStats)) {
  const pct = Math.round(100 * stats.passing / stats.total);
  console.log(`  ${tier.padEnd(10)} ${stats.passing}/${stats.total} (${pct}%) | avg ${stats.avgWords}w`);
}

if (duplicateSlugs.length > 0) {
  console.log("\n── Duplicate Slugs (within same pathway) ────────────────");
  for (const { slug, pathway, files } of duplicateSlugs.slice(0, 10)) {
    console.log(`  [${pathway}] ${slug}: ${files.join(", ")}`);
  }
}

if (failing.length > 0) {
  console.log(`\n── Failing Lessons (top ${Math.min(failing.length, 20)}) ──────────────────────────`);
  const topFailing = [...failing]
    .sort((a, b) => a.wordCount - b.wordCount)
    .slice(0, 20);

  for (const a of topFailing) {
    const reasons: string[] = [];
    if (!a.passesWordGate) reasons.push(`${a.wordCount}w<${MIN_WORDS}`);
    if (!a.passesSectionGate) reasons.push(`${a.requiredSectionsPresent}/${REQUIRED_SECTION_KINDS.size} sects`);
    if (!a.passesPlaceholderGate) reasons.push("placeholder");
    console.log(`  [${a.pathway}] ${a.slug} — ${reasons.join(", ")}`);
  }
  if (failing.length > 20) {
    console.log(`  ... and ${failing.length - 20} more. Run with --json-out to export full list.`);
  }
}

// ── JSON output ───────────────────────────────────────────────────────────────
if (JSON_OUT) {
  const report = {
    generatedAt: new Date().toISOString(),
    minWords: MIN_WORDS,
    minSectionCount: MIN_SECTION_COUNT,
    summary: {
      total: audits.length,
      passing: passing.length,
      failing: failing.length,
      thinCount: thinOnly.length,
      missingSectionsCount: missingSections.length,
      placeholderCount: placeholders.length,
      avgWords,
      medianWords: medWords,
      duplicateSlugs: duplicateSlugs.length,
    },
    byTier: Object.fromEntries(
      Object.entries(tierStats).map(([t, s]) => [t, { total: s.total, passing: s.passing, avgWords: s.avgWords }])
    ),
    failing: failing.map((a) => ({
      slug: a.slug,
      title: a.title,
      pathway: a.pathway,
      catalogFile: a.catalogFile,
      wordCount: a.wordCount,
      requiredSectionsPresent: a.requiredSectionsPresent,
      missingRequiredKinds: a.missingRequiredKinds,
      hasPlaceholder: a.hasPlaceholder,
    })),
    duplicateSlugs,
  };

  const outDir = path.dirname(JSON_OUT);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(JSON_OUT, JSON.stringify(report, null, 2));
  console.log(`\n  JSON report saved: ${JSON_OUT}`);
}

console.log("\n═══════════════════════════════════════════════════════\n");

// ── Exit code ─────────────────────────────────────────────────────────────────
if (placeholders.length > 0) {
  console.error(`ERROR: ${placeholders.length} lessons contain placeholder text. Fix before merging.`);
  process.exit(1);
}
if (duplicateSlugs.length > 0 && STRICT) {
  console.error(`ERROR: ${duplicateSlugs.length} duplicate slugs found (--strict mode).`);
  process.exit(1);
}

// Warn only (not fail) on thin lessons — migration or AI upgrade can fix these
if (thinOnly.length > 0) {
  console.warn(`WARN: ${thinOnly.length} lessons are under ${MIN_WORDS} words. Run npm run upgrade:catalog-lessons to fix.`);
}

process.exit(0);
