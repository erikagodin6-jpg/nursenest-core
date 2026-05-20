/**
 * Cross-pathway meaningful-clinical counts: upgraded gate vs legacy gate + delta.
 * Run from `nursenest-core/`: `npx tsx scripts/meaningful-clinical-content-audit.runner.mts`
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import catalog from "@/content/pathway-lessons/catalog.json";
import { getCatalogPathwayLessonsSync } from "@/lib/lessons/pathway-lesson-catalog-sync";
import {
  lessonSectionsHaveMeaningfulClinicalContent,
  lessonSectionsHaveMeaningfulClinicalContentLegacy,
  MEANINGFUL_LESSON_LEGACY_MIN_SECTIONS,
  MEANINGFUL_LESSON_LEGACY_MIN_TOTAL_WORDS,
  MEANINGFUL_LESSON_MIN_SECTIONS,
  MEANINGFUL_LESSON_MIN_TOTAL_WORDS,
} from "@/lib/lessons/pathway-lesson-premium";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPORT_JSON = join(__dirname, "../reports/meaningful-clinical-content-audit.json");

type PathwayRow = {
  pathwayId: string;
  lessons: number;
  meaningfulNew: number;
  meaningfulLegacy: number;
  deltaVsLegacy: number;
};

const pathwayIds = Object.keys((catalog as { pathways?: Record<string, unknown> }).pathways ?? {}).sort();

const perPathway: PathwayRow[] = [];
let lessonsTotal = 0;
let meaningfulNewTotal = 0;
let meaningfulLegacyTotal = 0;

for (const pathwayId of pathwayIds) {
  const lessons = getCatalogPathwayLessonsSync(pathwayId);
  let meaningfulNew = 0;
  let meaningfulLegacy = 0;
  for (const lesson of lessons) {
    if (lessonSectionsHaveMeaningfulClinicalContent(lesson.sections)) meaningfulNew += 1;
    if (lessonSectionsHaveMeaningfulClinicalContentLegacy(lesson.sections)) meaningfulLegacy += 1;
  }
  lessonsTotal += lessons.length;
  meaningfulNewTotal += meaningfulNew;
  meaningfulLegacyTotal += meaningfulLegacy;
  perPathway.push({
    pathwayId,
    lessons: lessons.length,
    meaningfulNew,
    meaningfulLegacy,
    deltaVsLegacy: meaningfulNew - meaningfulLegacy,
  });
}

const summary = {
  generatedAt: new Date().toISOString(),
  gateNew: {
    minSections: MEANINGFUL_LESSON_MIN_SECTIONS,
    minTotalWords: MEANINGFUL_LESSON_MIN_TOTAL_WORDS,
    description:
      "Four clinical pillars (pathophysiology, assessment/diagnosis, interventions/treatment, clinical application), scenario + decision signals, anti-glossary/listicle heuristics.",
  },
  gateLegacy: {
    minSections: MEANINGFUL_LESSON_LEGACY_MIN_SECTIONS,
    minTotalWords: MEANINGFUL_LESSON_LEGACY_MIN_TOTAL_WORDS,
    description: "≥3 sections, ≥400 words, one clinical-keyword hit in any section.",
  },
  totals: {
    pathwayCount: pathwayIds.length,
    lessons: lessonsTotal,
    meaningfulNew: meaningfulNewTotal,
    meaningfulLegacy: meaningfulLegacyTotal,
    meaningfulNewPct: lessonsTotal ? ((meaningfulNewTotal / lessonsTotal) * 100).toFixed(2) : "0",
    meaningfulLegacyPct: lessonsTotal ? ((meaningfulLegacyTotal / lessonsTotal) * 100).toFixed(2) : "0",
    deltaMeaningfulCount: meaningfulNewTotal - meaningfulLegacyTotal,
    deltaMeaningfulPctPoints: lessonsTotal
      ? (((meaningfulNewTotal - meaningfulLegacyTotal) / lessonsTotal) * 100).toFixed(2)
      : "0",
  },
  perPathway,
};

mkdirSync(dirname(REPORT_JSON), { recursive: true });
writeFileSync(REPORT_JSON, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

// eslint-disable-next-line no-console -- audit runner
console.log(JSON.stringify(summary, null, 2));
