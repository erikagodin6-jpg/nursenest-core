#!/usr/bin/env npx tsx
/**
 * Bundled catalog lesson spine audit — canonical 14-section depth schema.
 *
 * Usage:
 *   npm run verify:lesson-content-depth
 *   npm run verify:lesson-content-depth -- --strict   # exit 1 if sequential tier gate fails
 *   npm run verify:lesson-content-depth -- --write-json out/lesson-depth-report.json
 *
 * Env:
 *   STRICT_LESSON_DEPTH_GATE=1  — same as --strict
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  analyzeLessonContentDepth,
  evaluateLessonDepthSequentialGate,
  LESSON_DEPTH_TOTAL_WORD_MIN,
  rollupDepthByCohort,
} from "@/lib/lessons/lesson-content-depth-schema";
import {
  isNpExpandPathwayId,
  isRpnPnExpandPathwayId,
  isRnNclexExpandPathwayId,
  validateExpandedLesson,
} from "@/lib/lessons/rn-expanded-lesson-contract";
import {
  buildLegacyNpIndex,
  findLegacyNpMatch,
  loadNpPhase2LegacyRecords,
} from "@/lib/lessons/np-legacy-lesson-merge";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
  normalizeLesson,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");
const RN_JSON_CLINICAL_PATHWAY_IDS = ["ca-rn-nclex-rn", "us-rn-nclex-rn"] as const;
const RPN_JSON_BACKED_PATHWAY_IDS = ["ca-rpn-rex-pn", "us-lpn-nclex-pn"] as const;
const RN_JSON_SKIP_FILES = new Set([
  "rn-nclex-catalog-import-state.json",
  "rn-nclex-master-map.json",
  "rn-nclex-explicit-inventory-aliases.json",
  "nclex-rn-source-checklist.json",
]);

type JsonBackedNormalizedLesson<PathwayId extends string = string> = {
  pathwayId: PathwayId;
  lesson: ReturnType<typeof normalizeLesson>;
  sourceFile: string;
};

type JsonBackedExpandReport = {
  pathwayIds: string[];
  liveCatalogLessonsTotal: number;
  totalJsonBackedLessons: number;
  adequate: number;
  enriched: number;
  unmatched: number;
  missingRequiredSections: number;
  below1200Words: number;
  thinSectionLessons: number;
  thinSectionsTotal: number;
  clinicalGapLessons: number;
  missingClinicalTotal: number;
  flashcardIssueLessons: number;
  scopedGoldExcluded: number;
  byPathway: Record<
    string,
    {
      liveCatalogLessonsTotal: number;
      totalJsonBackedLessons: number;
      adequate: number;
      enriched: number;
      unmatched: number;
      missingRequiredSections: number;
      below1200Words: number;
      scopedGoldExcluded: number;
    }
  >;
};

type SummaryJson = {
  generatedAt: string;
  totals: {
    pathways: number;
    lessons: number;
    passingAllSchema: number;
    below1200Words: number;
    missingRequiredSection: number;
    weakSectionWordFloor: number;
    legacyOnlyKinds: number;
    genericFiller: number;
    missingFlashcardSurface: number;
    /** RN NCLEX-RN/US+CA expanded-lesson contract (same rules as rn-ai-expand-lessons). */
    rnExpandLessonsTotal: number;
    rnExpandPassing: number;
    rnExpandBelow1200Words: number;
    rnExpandMissingRequiredSection: number;
    rnExpandThinSectionLessons: number;
    rnExpandThinSectionsTotal: number;
    rnExpandClinicalGapLessons: number;
    rnExpandMissingClinicalTotal: number;
    rnExpandFlashcardIssueLessons: number;
    /** RPN/PN JSON-backed live lessons only (`catalog.json` + expansion catalogs; excludes scoped-gold/code-backed rows). */
    rpnJsonBackedLessonsTotal: number;
    rpnJsonBackedAdequate: number;
    rpnJsonBackedEnriched: number;
    rpnJsonBackedUnmatched: number;
    rpnJsonBackedBelow1200Words: number;
    rpnJsonBackedMissingRequiredSection: number;
    rpnJsonBackedThinSectionLessons: number;
    rpnJsonBackedThinSectionsTotal: number;
    rpnJsonBackedClinicalGapLessons: number;
    rpnJsonBackedMissingClinicalTotal: number;
    rpnJsonBackedFlashcardIssueLessons: number;
    rpnJsonBackedScopedGoldExcluded: number;
    /** Canadian NP / CNPLE (`ca-np-cnple`) — same spine + NP gates in {@link validateExpandedLesson}. */
    npExpandLessonsTotal: number;
    npExpandPassing: number;
    npExpandWithLegacyMatch: number;
    npExpandBelow1200Words: number;
    npExpandMissingRequiredSection: number;
    npExpandThinSectionLessons: number;
    npExpandThinSectionsTotal: number;
    npExpandClinicalGapLessons: number;
    npExpandMissingClinicalTotal: number;
    npExpandFlashcardIssueLessons: number;
    npExpandMissingPathophysiology: number;
    npExpandMissingDiagnostics: number;
    npExpandMissingTreatments: number;
    npExpandMissingPharmacology: number;
    npExpandMissingDifferentialOrCdm: number;
    /** JSON-backed RN clinical lessons only: excludes scoped-gold and non-clinical strategy/delegation/safety topics. */
    rnJsonClinicalLessonsTotal: number;
    rnJsonClinicalPassing: number;
    rnJsonClinicalBelow1200Words: number;
    rnJsonClinicalMissingRequiredSection: number;
    rnJsonClinicalThinSectionLessons: number;
    rnJsonClinicalThinSectionsTotal: number;
    rnJsonClinicalGapLessons: number;
    rnJsonClinicalMissingClinicalTotal: number;
    rnJsonClinicalFlashcardIssueLessons: number;
    rnJsonClinicalLegacySectionLessons: number;
  };
  byPathway: Record<
    string,
    {
      lessonCount: number;
      passing: number;
      failingSlugs: string[];
    }
  >;
  cohortRollups: ReturnType<typeof rollupDepthByCohort>;
  reports: {
    rpnJsonBacked: JsonBackedExpandReport;
  };
  sequentialGateViolations: string[];
  strictExit: boolean;
};

function parseArgs(argv: string[]) {
  const strict = argv.includes("--strict") || String(process.env.STRICT_LESSON_DEPTH_GATE ?? "").trim() === "1";
  const jsonIdx = argv.indexOf("--write-json");
  const writeJson = jsonIdx >= 0 && argv[jsonIdx + 1] ? path.resolve(process.cwd(), argv[jsonIdx + 1]!) : null;
  return { strict, writeJson };
}

function readJsonBackedPathwayLessons(filePath: string, pathwayId: string): unknown[] {
  const raw = JSON.parse(fs.readFileSync(filePath, "utf8")) as { pathways?: Record<string, unknown> };
  const bucket = raw?.pathways?.[pathwayId];
  if (Array.isArray(bucket)) return bucket;
  if (bucket && typeof bucket === "object") {
    const lessons = (bucket as { lessons?: unknown[] }).lessons;
    return Array.isArray(lessons) ? lessons : [];
  }
  return [];
}

function loadJsonBackedLessonsForPathwayIds<PathwayId extends string>(opts: {
  pathwayIds: readonly PathwayId[];
  excludeTopics?: ReadonlySet<string>;
}): JsonBackedNormalizedLesson<PathwayId>[] {
  const catalogDir = path.join(pkgRoot, "src/content/pathway-lessons");
  const out: JsonBackedNormalizedLesson<PathwayId>[] = [];
  const seen = new Set<string>();
  for (const fileName of fs.readdirSync(catalogDir).sort()) {
    if (!fileName.endsWith(".json") || RN_JSON_SKIP_FILES.has(fileName)) continue;
    const filePath = path.join(catalogDir, fileName);
    for (const pathwayId of opts.pathwayIds) {
      for (const rawLesson of readJsonBackedPathwayLessons(filePath, pathwayId)) {
        const lesson = normalizeLesson(rawLesson as Parameters<typeof normalizeLesson>[0], pathwayId);
        if (opts.excludeTopics?.has(String(lesson.topic ?? "").trim())) continue;
        const dedupeKey = `${pathwayId}::${lesson.slug.trim().toLowerCase()}`;
        if (seen.has(dedupeKey)) continue;
        seen.add(dedupeKey);
        out.push({ pathwayId, lesson, sourceFile: fileName });
      }
    }
  }
  return out;
}

function loadRnClinicalJsonLessons(): JsonBackedNormalizedLesson<(typeof RN_JSON_CLINICAL_PATHWAY_IDS)[number]>[] {
  return loadJsonBackedLessonsForPathwayIds({
    pathwayIds: RN_JSON_CLINICAL_PATHWAY_IDS,
  });
}

function buildRpnJsonBackedReport(): JsonBackedExpandReport {
  const rows = loadJsonBackedLessonsForPathwayIds({ pathwayIds: RPN_JSON_BACKED_PATHWAY_IDS });
  const byPathway = Object.fromEntries(
    RPN_JSON_BACKED_PATHWAY_IDS.map((pathwayId) => [
      pathwayId,
      {
        liveCatalogLessonsTotal: getCatalogPathwayLessonsSync(pathwayId).length,
        totalJsonBackedLessons: 0,
        adequate: 0,
        enriched: 0,
        unmatched: 0,
        missingRequiredSections: 0,
        below1200Words: 0,
        scopedGoldExcluded: 0,
      },
    ]),
  ) as JsonBackedExpandReport["byPathway"];

  let adequate = 0;
  let enriched = 0;
  let unmatched = 0;
  let missingRequiredSections = 0;
  let below1200Words = 0;
  let thinSectionLessons = 0;
  let thinSectionsTotal = 0;
  let clinicalGapLessons = 0;
  let missingClinicalTotal = 0;
  let flashcardIssueLessons = 0;

  for (const row of rows) {
    const pathwayReport = byPathway[row.pathwayId];
    pathwayReport.totalJsonBackedLessons += 1;
    const analysis = analyzeLessonContentDepth(row.pathwayId, row.lesson);
    const isUnmatched = analysis.legacyOnlyKindsPresent.length > 0;
    if (isUnmatched) {
      unmatched += 1;
      pathwayReport.unmatched += 1;
      continue;
    }

    const ev = validateExpandedLesson(row.lesson);
    const isAdequate = ev.totalWords >= LESSON_DEPTH_TOTAL_WORD_MIN && ev.missingSections.length === 0;

    pathwayReport.enriched += 1;
    enriched += 1;
    if (isAdequate) {
      pathwayReport.adequate += 1;
      adequate += 1;
    }
    if (ev.missingSections.length > 0) {
      pathwayReport.missingRequiredSections += 1;
      missingRequiredSections += 1;
    }
    if (ev.totalWords < LESSON_DEPTH_TOTAL_WORD_MIN) {
      pathwayReport.below1200Words += 1;
      below1200Words += 1;
    }
    if (ev.thinSections.length > 0) {
      thinSectionLessons += 1;
      thinSectionsTotal += ev.thinSections.length;
    }
    if (ev.missingClinicalRequirements.length > 0) {
      clinicalGapLessons += 1;
      missingClinicalTotal += ev.missingClinicalRequirements.length;
    }
    if (ev.flashcardPromptErrors.length > 0 || ev.flashcardPromptCount < 8) flashcardIssueLessons += 1;
  }

  const liveCatalogLessonsTotal = RPN_JSON_BACKED_PATHWAY_IDS.reduce(
    (sum, pathwayId) => sum + byPathway[pathwayId].liveCatalogLessonsTotal,
    0,
  );
  const scopedGoldExcluded = Math.max(0, liveCatalogLessonsTotal - rows.length);
  for (const pathwayId of RPN_JSON_BACKED_PATHWAY_IDS) {
    const pathwayReport = byPathway[pathwayId];
    pathwayReport.scopedGoldExcluded = Math.max(
      0,
      pathwayReport.liveCatalogLessonsTotal - pathwayReport.totalJsonBackedLessons,
    );
  }

  return {
    pathwayIds: [...RPN_JSON_BACKED_PATHWAY_IDS],
    liveCatalogLessonsTotal,
    totalJsonBackedLessons: rows.length,
    adequate,
    enriched,
    unmatched,
    missingRequiredSections,
    below1200Words,
    thinSectionLessons,
    thinSectionsTotal,
    clinicalGapLessons,
    missingClinicalTotal,
    flashcardIssueLessons,
    scopedGoldExcluded,
    byPathway,
  };
}

export function buildLessonContentDepthSummary(strict = false): SummaryJson {
  const pathwayIds = listCatalogPathwayIdsWithLessonsSync().sort();

  const analyses: ReturnType<typeof analyzeLessonContentDepth>[] = [];
  const byPathway: SummaryJson["byPathway"] = {};

  let below1200 = 0;
  let missingRequired = 0;
  let weakFloor = 0;
  let legacyOnly = 0;
  let filler = 0;
  let noFlash = 0;

  let rnExpandLessonsTotal = 0;
  let rnExpandPassing = 0;
  let rnExpandBelow1200 = 0;
  let rnExpandMissingSection = 0;
  let rnExpandThinLessons = 0;
  let rnExpandThinSectionsTotal = 0;
  let rnExpandClinicalGapLessons = 0;
  let rnExpandMissingClinicalTotal = 0;
  let rnExpandFlashcardIssueLessons = 0;

  let npExpandLessonsTotal = 0;
  let npExpandPassing = 0;
  let npExpandWithLegacyMatch = 0;
  let npExpandBelow1200 = 0;
  let npExpandMissingSection = 0;
  let npExpandThinLessons = 0;
  let npExpandThinSectionsTotal = 0;
  let npExpandClinicalGapLessons = 0;
  let npExpandMissingClinicalTotal = 0;
  let npExpandFlashcardIssueLessons = 0;
  let npExpandMissingPathophysiology = 0;
  let npExpandMissingDiagnostics = 0;
  let npExpandMissingTreatments = 0;
  let npExpandMissingPharmacology = 0;
  let npExpandMissingDifferentialOrCdm = 0;
  let rnJsonClinicalLessonsTotal = 0;
  let rnJsonClinicalPassing = 0;
  let rnJsonClinicalBelow1200 = 0;
  let rnJsonClinicalMissingSection = 0;
  let rnJsonClinicalThinLessons = 0;
  let rnJsonClinicalThinSectionsTotal = 0;
  let rnJsonClinicalGapLessons = 0;
  let rnJsonClinicalMissingClinicalTotal = 0;
  let rnJsonClinicalFlashcardIssueLessons = 0;
  let rnJsonClinicalLegacySectionLessons = 0;

  const monorepoRoot = path.resolve(pkgRoot, "..");
  const npLegacyRecords = loadNpPhase2LegacyRecords(monorepoRoot);
  const npLegacyIndex = npLegacyRecords.length ? buildLegacyNpIndex(npLegacyRecords) : null;

  for (const pathwayId of pathwayIds) {
    const lessons = getCatalogPathwayLessonsSync(pathwayId);
    const failingSlugs: string[] = [];
    let passing = 0;
    for (const lesson of lessons) {
      const a = analyzeLessonContentDepth(pathwayId, lesson);
      analyses.push(a);
      if (a.passesAllSchema) passing += 1;
      else failingSlugs.push(a.slug);
      if (a.belowWordTotal) below1200 += 1;
      if (a.missingKindsStrict.length) missingRequired += 1;
      if (a.weakKinds.length) weakFloor += 1;
      if (a.legacyOnlyKindsPresent.length) legacyOnly += 1;
      if (a.genericFillerHits.length) filler += 1;
      if (a.missingFlashcardSurface) noFlash += 1;

      if (isRnNclexExpandPathwayId(pathwayId)) {
        const ev = validateExpandedLesson(lesson);
        rnExpandLessonsTotal += 1;
        if (ev.pass) rnExpandPassing += 1;
        if (ev.totalWords < LESSON_DEPTH_TOTAL_WORD_MIN) rnExpandBelow1200 += 1;
        if (ev.missingSections.length > 0) rnExpandMissingSection += 1;
        if (ev.thinSections.length > 0) {
          rnExpandThinLessons += 1;
          rnExpandThinSectionsTotal += ev.thinSections.length;
        }
        if (ev.missingClinicalRequirements.length > 0) {
          rnExpandClinicalGapLessons += 1;
          rnExpandMissingClinicalTotal += ev.missingClinicalRequirements.length;
        }
        if (ev.flashcardPromptErrors.length > 0 || ev.flashcardPromptCount < 8) rnExpandFlashcardIssueLessons += 1;
      }
      if (isNpExpandPathwayId(pathwayId)) {
        const ev = validateExpandedLesson(lesson, { pathwayId });
        npExpandLessonsTotal += 1;
        if (ev.pass) npExpandPassing += 1;
        if (npLegacyIndex) {
          const m = findLegacyNpMatch({
            slug: lesson.slug,
            title: lesson.title,
            topic: lesson.topic,
            index: npLegacyIndex,
          });
          if (m) npExpandWithLegacyMatch += 1;
        }
        if (ev.totalWords < LESSON_DEPTH_TOTAL_WORD_MIN) npExpandBelow1200 += 1;
        if (ev.missingSections.length > 0) npExpandMissingSection += 1;
        if (ev.thinSections.length > 0) {
          npExpandThinLessons += 1;
          npExpandThinSectionsTotal += ev.thinSections.length;
        }
        if (ev.missingClinicalRequirements.length > 0) {
          npExpandClinicalGapLessons += 1;
          npExpandMissingClinicalTotal += ev.missingClinicalRequirements.length;
        }
        if (ev.flashcardPromptErrors.length > 0 || ev.flashcardPromptCount < 8) npExpandFlashcardIssueLessons += 1;

        const weak = (kind: string) =>
          ev.missingSections.includes(kind) ||
          ev.thinSections.some((t) => t.kind === kind) ||
          ev.missingClinicalRequirements.some((m) => m.kind === kind);
        if (weak("pathophysiology_overview")) npExpandMissingPathophysiology += 1;
        if (weak("labs_diagnostics")) npExpandMissingDiagnostics += 1;
        if (weak("treatments")) npExpandMissingTreatments += 1;
        if (weak("pharmacology")) npExpandMissingPharmacology += 1;
        if (
          ev.missingClinicalRequirements.some(
            (m) => m.kind === "clinical_decision_making" && /differential/i.test(m.requirement),
          )
        ) {
          npExpandMissingDifferentialOrCdm += 1;
        }
      }
    }
    byPathway[pathwayId] = {
      lessonCount: lessons.length,
      passing,
      failingSlugs: failingSlugs.slice(0, 40),
    };
  }

  for (const row of loadRnClinicalJsonLessons()) {
    const analysis = analyzeLessonContentDepth(row.pathwayId, row.lesson);
    const ev = validateExpandedLesson(row.lesson);
    rnJsonClinicalLessonsTotal += 1;
    if (ev.pass) rnJsonClinicalPassing += 1;
    if (ev.totalWords < LESSON_DEPTH_TOTAL_WORD_MIN) rnJsonClinicalBelow1200 += 1;
    if (ev.missingSections.length > 0) rnJsonClinicalMissingSection += 1;
    if (ev.thinSections.length > 0) {
      rnJsonClinicalThinLessons += 1;
      rnJsonClinicalThinSectionsTotal += ev.thinSections.length;
    }
    if (ev.missingClinicalRequirements.length > 0) {
      rnJsonClinicalGapLessons += 1;
      rnJsonClinicalMissingClinicalTotal += ev.missingClinicalRequirements.length;
    }
    if (ev.flashcardPromptErrors.length > 0 || ev.flashcardPromptCount < 8) rnJsonClinicalFlashcardIssueLessons += 1;
    if (analysis.legacyOnlyKindsPresent.length > 0) rnJsonClinicalLegacySectionLessons += 1;
  }

  const rpnJsonBackedReport = buildRpnJsonBackedReport();

  const passingAll = analyses.filter((a) => a.passesAllSchema).length;
  const rollups = rollupDepthByCohort(analyses);
  const sequentialGateViolations = evaluateLessonDepthSequentialGate(rollups);

  const summary: SummaryJson = {
    generatedAt: new Date().toISOString(),
    totals: {
      pathways: pathwayIds.length,
      lessons: analyses.length,
      passingAllSchema: passingAll,
      below1200Words: below1200,
      missingRequiredSection: missingRequired,
      weakSectionWordFloor: weakFloor,
      legacyOnlyKinds: legacyOnly,
      genericFiller: filler,
      missingFlashcardSurface: noFlash,
      rnExpandLessonsTotal,
      rnExpandPassing,
      rnExpandBelow1200Words: rnExpandBelow1200,
      rnExpandMissingRequiredSection: rnExpandMissingSection,
      rnExpandThinSectionLessons: rnExpandThinLessons,
      rnExpandThinSectionsTotal,
      rnExpandClinicalGapLessons,
      rnExpandMissingClinicalTotal,
      rnExpandFlashcardIssueLessons,
      rpnJsonBackedLessonsTotal: rpnJsonBackedReport.totalJsonBackedLessons,
      rpnJsonBackedAdequate: rpnJsonBackedReport.adequate,
      rpnJsonBackedEnriched: rpnJsonBackedReport.enriched,
      rpnJsonBackedUnmatched: rpnJsonBackedReport.unmatched,
      rpnJsonBackedBelow1200Words: rpnJsonBackedReport.below1200Words,
      rpnJsonBackedMissingRequiredSection: rpnJsonBackedReport.missingRequiredSections,
      rpnJsonBackedThinSectionLessons: rpnJsonBackedReport.thinSectionLessons,
      rpnJsonBackedThinSectionsTotal: rpnJsonBackedReport.thinSectionsTotal,
      rpnJsonBackedClinicalGapLessons: rpnJsonBackedReport.clinicalGapLessons,
      rpnJsonBackedMissingClinicalTotal: rpnJsonBackedReport.missingClinicalTotal,
      rpnJsonBackedFlashcardIssueLessons: rpnJsonBackedReport.flashcardIssueLessons,
      rpnJsonBackedScopedGoldExcluded: rpnJsonBackedReport.scopedGoldExcluded,
      npExpandLessonsTotal,
      npExpandPassing,
      npExpandWithLegacyMatch,
      npExpandBelow1200Words: npExpandBelow1200,
      npExpandMissingRequiredSection: npExpandMissingSection,
      npExpandThinSectionLessons: npExpandThinLessons,
      npExpandThinSectionsTotal,
      npExpandClinicalGapLessons,
      npExpandMissingClinicalTotal,
      npExpandFlashcardIssueLessons,
      npExpandMissingPathophysiology,
      npExpandMissingDiagnostics,
      npExpandMissingTreatments,
      npExpandMissingPharmacology,
      npExpandMissingDifferentialOrCdm,
      rnJsonClinicalLessonsTotal,
      rnJsonClinicalPassing,
      rnJsonClinicalBelow1200Words: rnJsonClinicalBelow1200,
      rnJsonClinicalMissingRequiredSection: rnJsonClinicalMissingSection,
      rnJsonClinicalThinSectionLessons: rnJsonClinicalThinLessons,
      rnJsonClinicalThinSectionsTotal,
      rnJsonClinicalGapLessons,
      rnJsonClinicalMissingClinicalTotal,
      rnJsonClinicalFlashcardIssueLessons,
      rnJsonClinicalLegacySectionLessons,
    },
    byPathway,
    cohortRollups: rollups,
    reports: {
      rpnJsonBacked: rpnJsonBackedReport,
    },
    sequentialGateViolations,
    strictExit: strict,
  };
  return summary;
}

function main() {
  const { strict, writeJson } = parseArgs(process.argv.slice(2));
  const summary = buildLessonContentDepthSummary(strict);

  console.log("=== verify:lesson-content-depth (bundled catalog) ===\n");
  console.log(`Pathways with lessons: ${summary.totals.pathways}`);
  console.log(`Total lessons: ${summary.totals.lessons}`);
  console.log(`Passing all strict schema checks: ${summary.totals.passingAllSchema}`);
  console.log(`Lessons total words < ${LESSON_DEPTH_TOTAL_WORD_MIN}: ${summary.totals.below1200Words}`);
  console.log(`Lessons with any missing required section (absent/empty): ${summary.totals.missingRequiredSection}`);
  console.log(`Lessons with any section below per-kind word floor: ${summary.totals.weakSectionWordFloor}`);
  console.log(`Lessons still containing legacy-only kinds: ${summary.totals.legacyOnlyKinds}`);
  console.log(`Lessons with generic filler phrases: ${summary.totals.genericFiller}`);
  console.log(`Lessons without flashcard prompts section / recallPrompts: ${summary.totals.missingFlashcardSurface}`);
  console.log("\n--- RN expanded-lesson contract (us-rn-nclex-rn + ca-rn-nclex-rn) ---");
  console.log(`RN lessons (total): ${summary.totals.rnExpandLessonsTotal}`);
  console.log(`RN fully passing expanded contract: ${summary.totals.rnExpandPassing}`);
  console.log(`RN lessons total words < ${LESSON_DEPTH_TOTAL_WORD_MIN}: ${summary.totals.rnExpandBelow1200Words}`);
  console.log(`RN lessons with any missing required section: ${summary.totals.rnExpandMissingRequiredSection}`);
  console.log(`RN lessons with any thin section (<150w): ${summary.totals.rnExpandThinSectionLessons}`);
  console.log(`RN thin section rows (sum across lessons): ${summary.totals.rnExpandThinSectionsTotal}`);
  console.log(`RN lessons with any missing clinical requirement: ${summary.totals.rnExpandClinicalGapLessons}`);
  console.log(`RN missing clinical requirement rows (sum): ${summary.totals.rnExpandMissingClinicalTotal}`);
  console.log(`RN lessons with flashcard prompt issues or <8 prompts: ${summary.totals.rnExpandFlashcardIssueLessons}`);
  console.log(
    "\n--- RN JSON clinical gate (JSON-backed only; excludes scoped-gold + Exam Strategy + Leadership & Delegation + Safety & Prioritization) ---",
  );
  console.log(`RN JSON clinical lessons (total): ${summary.totals.rnJsonClinicalLessonsTotal}`);
  console.log(
    `RN JSON clinical lessons fully passing expanded contract: ${summary.totals.rnJsonClinicalPassing}`,
  );
  console.log(
    `RN JSON clinical lessons >= ${LESSON_DEPTH_TOTAL_WORD_MIN} words: ${summary.totals.rnJsonClinicalLessonsTotal - summary.totals.rnJsonClinicalBelow1200Words}`,
  );
  console.log(
    `RN JSON clinical lessons with any missing required section: ${summary.totals.rnJsonClinicalMissingRequiredSection}`,
  );
  console.log(
    `RN JSON clinical lessons still containing legacy-only sections: ${summary.totals.rnJsonClinicalLegacySectionLessons}`,
  );
  console.log(
    `RN JSON clinical lessons with any thin section (<150w): ${summary.totals.rnJsonClinicalThinSectionLessons}`,
  );
  console.log(`RN JSON clinical thin section rows (sum): ${summary.totals.rnJsonClinicalThinSectionsTotal}`);
  console.log(`RN JSON clinical lessons with any missing clinical requirement: ${summary.totals.rnJsonClinicalGapLessons}`);
  console.log(`RN JSON clinical missing clinical requirement rows (sum): ${summary.totals.rnJsonClinicalMissingClinicalTotal}`);
  console.log(
    `RN JSON clinical lessons with flashcard prompt issues or <8 prompts: ${summary.totals.rnJsonClinicalFlashcardIssueLessons}`,
  );
  console.log(
    "\n--- RPN/PN JSON-backed live gate (catalog.json + expansion catalogs only; scoped-gold/code-backed excluded) ---",
  );
  console.log(`RPN/PN live lessons from getCatalogPathwayLessonsSync(): ${summary.reports.rpnJsonBacked.liveCatalogLessonsTotal}`);
  console.log(`RPN/PN JSON-backed lessons (denominator): ${summary.totals.rpnJsonBackedLessonsTotal}`);
  console.log(`RPN/PN scoped-gold/code-backed lessons excluded: ${summary.totals.rpnJsonBackedScopedGoldExcluded}`);
  console.log(`RPN/PN enriched lessons (expanded-section shape, JSON-backed): ${summary.totals.rpnJsonBackedEnriched}`);
  console.log(`RPN/PN unmatched lessons (legacy JSON shape, not build-fatal): ${summary.totals.rpnJsonBackedUnmatched}`);
  console.log(`RPN/PN adequate enriched lessons (>= ${LESSON_DEPTH_TOTAL_WORD_MIN} words and no missing required sections): ${summary.totals.rpnJsonBackedAdequate}`);
  console.log(`RPN/PN enriched lessons total words < ${LESSON_DEPTH_TOTAL_WORD_MIN}: ${summary.totals.rpnJsonBackedBelow1200Words}`);
  console.log(`RPN/PN enriched lessons with any missing required section: ${summary.totals.rpnJsonBackedMissingRequiredSection}`);
  console.log(`RPN/PN enriched lessons with any thin section (<150w): ${summary.totals.rpnJsonBackedThinSectionLessons}`);
  console.log(`RPN/PN enriched thin section rows (sum across lessons): ${summary.totals.rpnJsonBackedThinSectionsTotal}`);
  console.log(`RPN/PN enriched lessons with any missing clinical requirement: ${summary.totals.rpnJsonBackedClinicalGapLessons}`);
  console.log(`RPN/PN enriched missing clinical requirement rows (sum): ${summary.totals.rpnJsonBackedMissingClinicalTotal}`);
  console.log(`RPN/PN enriched lessons with flashcard prompt issues or <8 prompts: ${summary.totals.rpnJsonBackedFlashcardIssueLessons}`);
  console.log("\n--- NP expanded-lesson contract (ca-np-cnple) ---");
  console.log(`NP lessons (total): ${summary.totals.npExpandLessonsTotal}`);
  console.log(`NP with legacy phase-2 match (slug/title/topic heuristic): ${summary.totals.npExpandWithLegacyMatch}`);
  console.log(`NP fully passing expanded contract (+ NP gates): ${summary.totals.npExpandPassing}`);
  console.log(`NP lessons total words < ${LESSON_DEPTH_TOTAL_WORD_MIN}: ${summary.totals.npExpandBelow1200Words}`);
  console.log(`NP lessons with any missing required section: ${summary.totals.npExpandMissingRequiredSection}`);
  console.log(`NP lessons with any thin section (<150w): ${summary.totals.npExpandThinSectionLessons}`);
  console.log(`NP thin section rows (sum across lessons): ${summary.totals.npExpandThinSectionsTotal}`);
  console.log(`NP lessons with any missing clinical requirement: ${summary.totals.npExpandClinicalGapLessons}`);
  console.log(`NP missing clinical requirement rows (sum): ${summary.totals.npExpandMissingClinicalTotal}`);
  console.log(`NP lessons with flashcard prompt issues or <8 prompts: ${summary.totals.npExpandFlashcardIssueLessons}`);
  console.log(`NP lessons weak/missing pathophysiology: ${summary.totals.npExpandMissingPathophysiology}`);
  console.log(`NP lessons weak/missing diagnostics/labs: ${summary.totals.npExpandMissingDiagnostics}`);
  console.log(`NP lessons weak/missing treatments: ${summary.totals.npExpandMissingTreatments}`);
  console.log(`NP lessons weak/missing pharmacology: ${summary.totals.npExpandMissingPharmacology}`);
  console.log(`NP lessons missing NP differential gate on clinical decision-making: ${summary.totals.npExpandMissingDifferentialOrCdm}`);
  console.log("\n--- Cohort completion % (strict pass / all lessons in cohort pathways) ---");
  for (const r of summary.cohortRollups) {
    if (r.totalLessons === 0 && r.cohort === "OTHER") continue;
    console.log(
      `${r.cohort.padEnd(10)} ${r.completionPct}% (${r.passingLessons}/${r.totalLessons} lessons)  pathways: ${r.pathwayIds.length}`,
    );
  }
  console.log("\n--- Sequential tier gate (RN → PN → NP → Allied → New Grad) ---");
  if (summary.sequentialGateViolations.length === 0) {
    console.log("PASS: every populated tier ahead of the first deficit is at 100%, or no violations.");
  } else {
    for (const v of summary.sequentialGateViolations) console.log(`FAIL: ${v}`);
  }

  if (writeJson) {
    fs.mkdirSync(path.dirname(writeJson), { recursive: true });
    fs.writeFileSync(writeJson, JSON.stringify(summary, null, 2), "utf8");
    console.log(`\nWrote JSON: ${writeJson}`);
  }

  if (strict && summary.sequentialGateViolations.length > 0) {
    console.error("\nStrict mode: exiting with code 1 (sequential gate).");
    process.exit(1);
  }

  if (
    summary.totals.rnJsonClinicalLessonsTotal > 0 &&
    summary.totals.rnJsonClinicalPassing !== summary.totals.rnJsonClinicalLessonsTotal
  ) {
    console.error(
      `\nRN JSON clinical expanded-lesson contract: ${summary.totals.rnJsonClinicalPassing}/${summary.totals.rnJsonClinicalLessonsTotal} lessons pass — exiting 1.`,
    );
    process.exit(1);
  }

  if (
    summary.totals.rpnJsonBackedLessonsTotal > 0 &&
    (summary.totals.rpnJsonBackedMissingRequiredSection > 0 || summary.totals.rpnJsonBackedBelow1200Words > 0)
  ) {
    console.error(
      `\nRPN/PN JSON-backed live gate: ${summary.totals.rpnJsonBackedMissingRequiredSection} lessons with missing required sections, ${summary.totals.rpnJsonBackedBelow1200Words} lessons below ${LESSON_DEPTH_TOTAL_WORD_MIN} words — exiting 1.`,
    );
    process.exit(1);
  }

  if (summary.totals.npExpandLessonsTotal > 0 && summary.totals.npExpandPassing !== summary.totals.npExpandLessonsTotal) {
    console.error(
      `\nNP expanded-lesson contract: ${summary.totals.npExpandPassing}/${summary.totals.npExpandLessonsTotal} lessons pass — exiting 1.`,
    );
    process.exit(1);
  }

  console.log("\nverify:lesson-content-depth OK (RN + RPN/PN + NP gates satisfied for configured build-failing conditions).");
}

if (process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url) {
  main();
}
