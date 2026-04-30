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
import { fileURLToPath } from "node:url";

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
} from "@/lib/lessons/pathway-lesson-catalog-sync";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pkgRoot = path.resolve(__dirname, "..");

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
    /** RPN/PN (ca-rpn-rex-pn + us-lpn-nclex-pn) — same validateExpandedLesson contract as RN. */
    rpnExpandLessonsTotal: number;
    rpnExpandPassing: number;
    rpnExpandBelow1200Words: number;
    rpnExpandMissingRequiredSection: number;
    rpnExpandThinSectionLessons: number;
    rpnExpandThinSectionsTotal: number;
    rpnExpandClinicalGapLessons: number;
    rpnExpandMissingClinicalTotal: number;
    rpnExpandFlashcardIssueLessons: number;
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
  sequentialGateViolations: string[];
  strictExit: boolean;
};

function parseArgs(argv: string[]) {
  const strict = argv.includes("--strict") || String(process.env.STRICT_LESSON_DEPTH_GATE ?? "").trim() === "1";
  const jsonIdx = argv.indexOf("--write-json");
  const writeJson = jsonIdx >= 0 && argv[jsonIdx + 1] ? path.resolve(process.cwd(), argv[jsonIdx + 1]!) : null;
  return { strict, writeJson };
}

function main() {
  const { strict, writeJson } = parseArgs(process.argv.slice(2));
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

  let rpnExpandLessonsTotal = 0;
  let rpnExpandPassing = 0;
  let rpnExpandBelow1200 = 0;
  let rpnExpandMissingSection = 0;
  let rpnExpandThinLessons = 0;
  let rpnExpandThinSectionsTotal = 0;
  let rpnExpandClinicalGapLessons = 0;
  let rpnExpandMissingClinicalTotal = 0;
  let rpnExpandFlashcardIssueLessons = 0;

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
      if (isRpnPnExpandPathwayId(pathwayId)) {
        const ev = validateExpandedLesson(lesson);
        rpnExpandLessonsTotal += 1;
        if (ev.pass) rpnExpandPassing += 1;
        if (ev.totalWords < LESSON_DEPTH_TOTAL_WORD_MIN) rpnExpandBelow1200 += 1;
        if (ev.missingSections.length > 0) rpnExpandMissingSection += 1;
        if (ev.thinSections.length > 0) {
          rpnExpandThinLessons += 1;
          rpnExpandThinSectionsTotal += ev.thinSections.length;
        }
        if (ev.missingClinicalRequirements.length > 0) {
          rpnExpandClinicalGapLessons += 1;
          rpnExpandMissingClinicalTotal += ev.missingClinicalRequirements.length;
        }
        if (ev.flashcardPromptErrors.length > 0 || ev.flashcardPromptCount < 8) rpnExpandFlashcardIssueLessons += 1;
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
      rpnExpandLessonsTotal,
      rpnExpandPassing,
      rpnExpandBelow1200Words: rpnExpandBelow1200,
      rpnExpandMissingRequiredSection: rpnExpandMissingSection,
      rpnExpandThinSectionLessons: rpnExpandThinLessons,
      rpnExpandThinSectionsTotal,
      rpnExpandClinicalGapLessons,
      rpnExpandMissingClinicalTotal,
      rpnExpandFlashcardIssueLessons,
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
    },
    byPathway,
    cohortRollups: rollups,
    sequentialGateViolations,
    strictExit: strict,
  };

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
  console.log("\n--- RPN/PN expanded-lesson contract (ca-rpn-rex-pn + us-lpn-nclex-pn) ---");
  console.log(`RPN/PN lessons (total): ${summary.totals.rpnExpandLessonsTotal}`);
  console.log(`RPN/PN fully passing expanded contract: ${summary.totals.rpnExpandPassing}`);
  console.log(`RPN/PN lessons total words < ${LESSON_DEPTH_TOTAL_WORD_MIN}: ${summary.totals.rpnExpandBelow1200Words}`);
  console.log(`RPN/PN lessons with any missing required section: ${summary.totals.rpnExpandMissingRequiredSection}`);
  console.log(`RPN/PN lessons with any thin section (<150w): ${summary.totals.rpnExpandThinSectionLessons}`);
  console.log(`RPN/PN thin section rows (sum across lessons): ${summary.totals.rpnExpandThinSectionsTotal}`);
  console.log(`RPN/PN lessons with any missing clinical requirement: ${summary.totals.rpnExpandClinicalGapLessons}`);
  console.log(`RPN/PN missing clinical requirement rows (sum): ${summary.totals.rpnExpandMissingClinicalTotal}`);
  console.log(`RPN/PN lessons with flashcard prompt issues or <8 prompts: ${summary.totals.rpnExpandFlashcardIssueLessons}`);
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
  for (const r of rollups) {
    if (r.totalLessons === 0 && r.cohort === "OTHER") continue;
    console.log(
      `${r.cohort.padEnd(10)} ${r.completionPct}% (${r.passingLessons}/${r.totalLessons} lessons)  pathways: ${r.pathwayIds.length}`,
    );
  }
  console.log("\n--- Sequential tier gate (RN → PN → NP → Allied → New Grad) ---");
  if (sequentialGateViolations.length === 0) {
    console.log("PASS: every populated tier ahead of the first deficit is at 100%, or no violations.");
  } else {
    for (const v of sequentialGateViolations) console.log(`FAIL: ${v}`);
  }

  if (writeJson) {
    fs.mkdirSync(path.dirname(writeJson), { recursive: true });
    fs.writeFileSync(writeJson, JSON.stringify(summary, null, 2), "utf8");
    console.log(`\nWrote JSON: ${writeJson}`);
  }

  if (strict && sequentialGateViolations.length > 0) {
    console.error("\nStrict mode: exiting with code 1 (sequential gate).");
    process.exit(1);
  }

  if (summary.totals.rnExpandLessonsTotal > 0 && summary.totals.rnExpandPassing !== summary.totals.rnExpandLessonsTotal) {
    console.error(
      `\nRN expanded-lesson contract: ${summary.totals.rnExpandPassing}/${summary.totals.rnExpandLessonsTotal} lessons pass — exiting 1.`,
    );
    process.exit(1);
  }

  if (summary.totals.rpnExpandLessonsTotal > 0 && summary.totals.rpnExpandPassing !== summary.totals.rpnExpandLessonsTotal) {
    console.error(
      `\nRPN/PN expanded-lesson contract: ${summary.totals.rpnExpandPassing}/${summary.totals.rpnExpandLessonsTotal} lessons pass — exiting 1.`,
    );
    process.exit(1);
  }

  if (summary.totals.npExpandLessonsTotal > 0 && summary.totals.npExpandPassing !== summary.totals.npExpandLessonsTotal) {
    console.error(
      `\nNP expanded-lesson contract: ${summary.totals.npExpandPassing}/${summary.totals.npExpandLessonsTotal} lessons pass — exiting 1.`,
    );
    process.exit(1);
  }

  console.log("\nverify:lesson-content-depth OK (RN + RPN/PN + NP expand contracts satisfied when those lessons are present).");
}

main();
