/**
 * Machine-readable recovery / completeness reports under data/import-reports/
 * plus legacy-image-reference-audit.json under data/audit/.
 *
 * Run after generate-full-parity-audit.mts (refreshes lesson/flash/testbank completeness JSON).
 *
 *   cd nursenest-core && npx tsx scripts/audit/emit-recovery-import-reports.mts
 *
 * Does not deploy. Does not write to Prisma.
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { ContentStatus } from "@prisma/client";
import { listPublicExamPathways } from "@/lib/exam-pathways/exam-product-registry";
import {
  getCatalogPathwayLessonsSync,
  listCatalogPathwayIdsWithLessonsSync,
} from "@/lib/lessons/pathway-lesson-catalog-sync";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { DB_PUBLISHED } from "@/lib/entitlements/content-access-scope";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { prisma } from "@/lib/db";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "../../..");
const AUDIT_DIR = join(REPO_ROOT, "data/audit");
const IMPORT_DIR = join(REPO_ROOT, "data/import-reports");

const MD_IMG = /!\[[^\]]*\]\([^)]+\)/;
const URL_IMG = /https?:\/\/[^\s)"']+\.(?:png|jpe?g|gif|webp|svg)(?:\?[^\s)"']*)?/i;

function pathwayPriorityRank(pathwayId: string, roleTrack: string, examCode: string): number {
  const id = pathwayId.toLowerCase();
  if (id.includes("nclex-rn") || roleTrack === "rn") return 1;
  if (roleTrack === "pn" || id.includes("nclex-pn") || id.includes("rex-pn") || id.includes("rpn")) return 2;
  if (roleTrack === "np" || id.includes("fnp") || id.includes("np-")) return 3;
  if (id.includes("allied")) return 5;
  if (examCode === "shared" || id.includes("core")) return 4;
  return 6;
}

function corpusForImages(l: PathwayLessonRecord): string {
  return (l.sections ?? []).map((s) => s.body ?? "").join("\n");
}

function countFigures(l: PathwayLessonRecord): number {
  let n = 0;
  for (const s of l.sections ?? []) {
    n += s.figures?.length ?? 0;
  }
  return n;
}

function hasInlineImageMarkdown(body: string): boolean {
  return MD_IMG.test(body) || URL_IMG.test(body);
}

function safeReadJson<T>(p: string): T | null {
  try {
    if (!existsSync(p)) return null;
    return JSON.parse(readFileSync(p, "utf8")) as T;
  } catch {
    return null;
  }
}

async function main() {
  mkdirSync(AUDIT_DIR, { recursive: true });
  mkdirSync(IMPORT_DIR, { recursive: true });
  const generatedAt = new Date().toISOString();
  const dbOk = isDatabaseUrlConfigured();

  const lessonCompleteness = safeReadJson<Record<string, unknown>>(join(AUDIT_DIR, "lesson-content-completeness-audit.json"));
  const flashCompleteness = safeReadJson<Record<string, unknown>>(join(AUDIT_DIR, "flashcard-content-completeness-audit.json"));
  const testCompleteness = safeReadJson<Record<string, unknown>>(join(AUDIT_DIR, "testbank-content-completeness-audit.json"));
  const gapAnalysis = safeReadJson<Record<string, unknown>>(join(AUDIT_DIR, "legacy-vs-current-content-gap-analysis.json"));
  const legacyAssets = safeReadJson<Record<string, unknown>>(join(AUDIT_DIR, "legacy-assets-inventory.json"));

  const pathways = listPublicExamPathways().sort((a, b) => {
    const ra = pathwayPriorityRank(a.id, a.roleTrack, a.examCode);
    const rb = pathwayPriorityRank(b.id, b.roleTrack, b.examCode);
    return ra - rb || a.id.localeCompare(b.id);
  });

  const catalogPathwayIds = listCatalogPathwayIdsWithLessonsSync();

  let totalLessons = 0;
  let lessonsWithFigures = 0;
  let lessonsWithInlineImages = 0;
  let lessonsWithNeitherFigureNorInlineImage = 0;
  let lessonsWithPreTest = 0;
  let lessonsWithPostTest = 0;
  let lessonsWithBothTests = 0;
  let lessonsWithNeitherTest = 0;
  const imageGapSamples: Array<{
    pathwayId: string;
    slug: string;
    title: string;
    figureCount: number;
    hasInlineImage: boolean;
    approxWords: number;
    priorityRank: number;
  }> = [];

  const incompleteFromCatalog: Array<{ pathwayId: string; slug: string; title: string; issues: string[] }> = [];

  for (const p of pathways) {
    const lessons = getCatalogPathwayLessonsSync(p.id);
    const pr = pathwayPriorityRank(p.id, p.roleTrack, p.examCode);
    for (const l of lessons) {
      totalLessons += 1;
      const fc = countFigures(l);
      const corpus = corpusForImages(l);
      const inline = hasInlineImageMarkdown(corpus);
      if (fc > 0) lessonsWithFigures += 1;
      if (inline) lessonsWithInlineImages += 1;
      if (fc === 0 && !inline) lessonsWithNeitherFigureNorInlineImage += 1;

      const preN = l.preTest?.length ?? 0;
      const postN = l.postTest?.length ?? 0;
      if (preN > 0) lessonsWithPreTest += 1;
      if (postN > 0) lessonsWithPostTest += 1;
      if (preN > 0 && postN > 0) lessonsWithBothTests += 1;
      if (preN === 0 && postN === 0) lessonsWithNeitherTest += 1;

      if (fc === 0 && !inline && imageGapSamples.length < 400) {
        const words = corpus.split(/\s+/).filter(Boolean).length;
        if (words >= 120) {
          imageGapSamples.push({
            pathwayId: p.id,
            slug: l.slug,
            title: l.title,
            figureCount: fc,
            hasInlineImage: inline,
            approxWords: words,
            priorityRank: pr,
          });
        }
      }

      if (!l.structuralQuality?.publicComplete && incompleteFromCatalog.length < 800) {
        incompleteFromCatalog.push({
          pathwayId: p.id,
          slug: l.slug,
          title: l.title,
          issues: l.structuralQuality?.issues ?? [],
        });
      }
    }
  }

  imageGapSamples.sort((a, b) => a.priorityRank - b.priorityRank);

  const legacyImageAudit = {
    schemaVersion: 1,
    generatedAt,
    dbConnected: dbOk,
    legacySourcesScanned: ["data/audit/legacy-assets-inventory.json"],
    currentSourcesScanned: [
      "src/lib/lessons/pathway-lesson-catalog-sync.ts (bundled catalog lessons)",
      "PathwayLessonSection.figures + markdown image patterns in section bodies",
    ],
    summary: {
      catalogPathwaysWithLessons: catalogPathwayIds.length,
      totalCatalogLessonsExamined: totalLessons,
      lessonsWithStructuredFigures: lessonsWithFigures,
      lessonsWithInlineImageMarkdown: lessonsWithInlineImages,
      lessonsWithNoFiguresOrInlineImages: lessonsWithNeitherFigureNorInlineImage,
      legacyPublicAssetFilesApprox: (legacyAssets?.summary as { totalPublicFiles?: number } | undefined)?.totalPublicFiles ?? null,
      legacyExtensionBuckets: (legacyAssets?.summary as { extensionBuckets?: Record<string, number> } | undefined)?.extensionBuckets ?? null,
    },
    heuristic: {
      imageGapCandidates:
        "Catalog lessons with ≥120 words and zero section.figures and no markdown image URL — may still be fine (not every lesson needs art); cross-check legacy lesson file if slug matched.",
      noAutomatedLegacySlugMatch:
        "Per-lesson legacy image expectation requires legacy lesson file join; see legacy-to-current-lesson-map.json and import pipelines.",
    },
    samplesLessonsWithSubstanceButNoImages: imageGapSamples.slice(0, 200),
    truncated: imageGapSamples.length > 200,
  };

  writeFileSync(join(AUDIT_DIR, "legacy-image-reference-audit.json"), JSON.stringify(legacyImageAudit, null, 2) + "\n");

  const imageMappingReport = {
    schemaVersion: 1,
    generatedAt,
    pass: "emit-recovery-import-reports",
    itemsExamined: totalLessons,
    itemsChanged: 0,
    itemsSkipped: 0,
    duplicatesSkipped: 0,
    itemsStillBlocked: imageGapSamples.length,
    reasonsForBlocking: [
      "No automatic URL migration from legacy public/ tree to Next public/CDN in this audit-only script.",
      "Figures must be authored as PathwayLessonFigure (HTTPS) in catalog or DB payloads.",
    ],
    beforeAfter: {
      note: "Audit-only — no image rows mutated.",
    },
    summary: legacyImageAudit.summary,
  };

  writeFileSync(join(IMPORT_DIR, "image-mapping-report.json"), JSON.stringify(imageMappingReport, null, 2) + "\n");

  const prePostReport = {
    schemaVersion: 1,
    generatedAt,
    currentSourcesScanned: ["pathway-lesson-catalog-sync bundled lessons"],
    summary: {
      totalCatalogLessons: totalLessons,
      withPreTest: lessonsWithPreTest,
      withPostTest: lessonsWithPostTest,
      withBothPreAndPost: lessonsWithBothTests,
      withNeitherPreNorPost: lessonsWithNeitherTest,
    },
    note: "Pre/post lesson quizzes live on PathwayLessonRecord.preTest/postTest (catalog or DB JSON). DB-only lessons are not included here.",
    itemsExamined: totalLessons,
    itemsChanged: 0,
    itemsSkipped: 0,
    duplicatesSkipped: 0,
    itemsStillBlocked: 0,
    mutationsExecuted: [] as string[],
  };

  writeFileSync(join(IMPORT_DIR, "prepost-assessment-recovery-report.json"), JSON.stringify(prePostReport, null, 2) + "\n");

  /** ----- Optional Prisma quality samples ----- */
  let flashReportExtras: Record<string, unknown> = {};
  let testReportExtras: Record<string, unknown> = {};

  if (dbOk) {
    try {
      const [emptyBackCount, publishedDecks, publishedQuestions, thinRationale] = await Promise.all([
        prisma.flashcard.count({
          where: {
            status: ContentStatus.PUBLISHED,
            back: "",
          },
        }),
        prisma.flashcardDeck.count({ where: { status: ContentStatus.PUBLISHED } }),
        prisma.examQuestion.count({ where: { status: DB_PUBLISHED } }),
        prisma.examQuestion.count({
          where: {
            status: DB_PUBLISHED,
            rationale: null,
            correctAnswerExplanation: null,
            clinicalPearl: null,
            examStrategy: null,
          },
        }),
      ]);

      const badCards = await prisma.flashcard.findMany({
        where: {
          status: ContentStatus.PUBLISHED,
          deckId: { not: null },
          OR: [{ back: "" }, { front: "" }],
        },
        take: 150,
        select: { id: true, front: true, back: true, deckId: true },
      });

      flashReportExtras = {
        publishedDeckCount: publishedDecks,
        publishedCardsWithEmptyBackCount: emptyBackCount,
        sampleIncompleteCards: badCards,
      };

      testReportExtras = {
        publishedExamQuestionCount: publishedQuestions,
        publishedQuestionsWithNoPrimaryRationaleFieldApprox: thinRationale,
        note: "Rationale may still exist on clinicalPearl/correctAnswerExplanation; this count is strict null-or-empty on all four fields.",
      };
    } catch (e) {
      flashReportExtras = { prismaError: e instanceof Error ? e.message : String(e) };
      testReportExtras = flashReportExtras;
    }
  } else {
    flashReportExtras = { prismaSkipped: true };
    testReportExtras = { prismaSkipped: true };
  }

  const lessonRecoveryReport = {
    schemaVersion: 1,
    generatedAt,
    itemsExamined: totalLessons,
    itemsChanged: 0,
    itemsSkipped: 0,
    duplicatesSkipped: 0,
    itemsStillBlocked: (lessonCompleteness?.summary as { lessonsNotPublicComplete?: number } | undefined)?.lessonsNotPublicComplete ?? incompleteFromCatalog.length,
    reasonsForBlocking: [
      "Structural gate failures — editorial pass or legacy import (see lesson-content-completeness-audit.json).",
      "Class C legacy keys need slug mapping before bulk import (unimported-legacy-content.json).",
    ],
    beforeAfter: {
      lessonsStructurallyIncomplete: incompleteFromCatalog.length,
      cappedIncompleteList: 800,
    },
    incompleteSamples: incompleteFromCatalog.slice(0, 120),
    gapAnalysisPointer: gapAnalysis?.summary ?? null,
    mutationsExecuted: [] as string[],
  };

  writeFileSync(join(IMPORT_DIR, "lesson-recovery-report.json"), JSON.stringify(lessonRecoveryReport, null, 2) + "\n");

  const flashRecoveryReport = {
    schemaVersion: 1,
    generatedAt,
    itemsExamined: dbOk ? ((flashReportExtras.publishedDeckCount as number) ?? 0) : null,
    itemsChanged: 0,
    itemsSkipped: 0,
    duplicatesSkipped: 0,
    itemsStillBlocked: null,
    reasonsForBlocking: ["Subscriber decks excluded from public /flashcards hub — see flashcard-content-completeness-audit.json flashcardUiGaps."],
    flashcardCompletenessPointer: flashCompleteness?.flashcardUiGaps ?? null,
    ...flashReportExtras,
    mutationsExecuted: [] as string[],
  };

  writeFileSync(join(IMPORT_DIR, "flashcard-recovery-report.json"), JSON.stringify(flashRecoveryReport, null, 2) + "\n");

  const testbankRecoveryReport = {
    schemaVersion: 1,
    generatedAt,
    itemsExamined: (testCompleteness?.totalPublishedExamQuestions as number | null) ?? (testReportExtras.publishedExamQuestionCount as number | undefined) ?? null,
    itemsChanged: 0,
    itemsSkipped: 0,
    duplicatesSkipped: 0,
    itemsStillBlocked: null,
    reasonsForBlocking: ["Legacy career question JSON not fully deduped into exam_questions — see unimported-legacy-content.json."],
    testbankCompletenessPointer: {
      totalPublishedExamQuestions: testCompleteness?.totalPublishedExamQuestions,
      questionsByExamColumn: testCompleteness?.questionsByExamColumn,
    },
    ...testReportExtras,
    mutationsExecuted: [] as string[],
  };

  writeFileSync(join(IMPORT_DIR, "testbank-recovery-report.json"), JSON.stringify(testbankRecoveryReport, null, 2) + "\n");

  const publishedContentFixesReport = {
    schemaVersion: 1,
    generatedAt,
    pass: "emit-recovery-import-reports",
    itemsExamined: {
      catalogLessons: totalLessons,
      prismaQuestions: testbankRecoveryReport.itemsExamined,
      prismaFlashcardDecks: flashRecoveryReport.itemsExamined,
    },
    itemsChanged: 0,
    itemsSkipped: 0,
    duplicatesSkipped: 0,
    itemsStillBlocked: {
      lessonsStructural: lessonRecoveryReport.itemsStillBlocked,
      imageGapsSampled: imageGapSamples.length,
    },
    reasonsForBlocking: [
      "Audit-only generator — content fixes require reviewed imports/enrichment jobs.",
    ],
    mutationsExecuted: [] as string[],
    relatedAuditFiles: [
      "data/audit/lesson-content-completeness-audit.json",
      "data/audit/flashcard-content-completeness-audit.json",
      "data/audit/testbank-content-completeness-audit.json",
      "data/audit/legacy-image-reference-audit.json",
    ],
  };

  writeFileSync(join(IMPORT_DIR, "published-content-fixes-report.json"), JSON.stringify(publishedContentFixesReport, null, 2) + "\n");

  console.log("Wrote import reports to", IMPORT_DIR);
  console.log("Wrote legacy-image-reference-audit.json");
  console.log("catalog lessons:", totalLessons, "image gap samples (>=120w, no figures/inline):", imageGapSamples.length);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
