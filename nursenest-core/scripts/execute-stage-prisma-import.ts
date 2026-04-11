#!/usr/bin/env npx tsx
/**
 * execute-stage-prisma-import.ts
 *
 * Stage I executor — reads Stage-I JSON files from data/pipeline/runs/ and
 * drives the actual Prisma upserts for PathwayLesson and ExamQuestion.
 *
 * Safety guarantees:
 *   - Default is DRY-RUN. Pass --apply to write.
 *   - Lessons: upsert by (pathwayId, slug, locale); conflictStrategy "skip" = createMany skipDuplicates.
 *   - Questions: dedup by stemHash before write; never overwrites an existing stemHash.
 *   - Chunked at BATCH_SIZE (≤ 100) per pipeline safeguard.
 *   - Writes a checkpoint JSON after each chunk.
 *   - Resumable: skips rows whose stemHash / lesson composite key already exist in DB.
 *
 * Usage:
 *   # Dry-run all Stage-I files
 *   npx tsx scripts/execute-stage-prisma-import.ts
 *
 *   # Apply a single import file
 *   npx tsx scripts/execute-stage-prisma-import.ts \
 *     --file=data/pipeline/runs/np-phase2-prisma-import.json \
 *     --apply
 *
 *   # Apply all Stage-I files
 *   npx tsx scripts/execute-stage-prisma-import.ts --dir=data/pipeline/runs --apply
 *
 * Env: DATABASE_URL must be set.
 */

import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BATCH_SIZE = 50; // ≤ 100 per pipeline safeguard

// ─── Stage-I JSON types (mirrors transform-to-prisma-import.ts) ───────────────

interface LessonSection {
  id: string;
  heading: string;
  kind: string;
  body: string;
}

type PrismaTierCode = "RPN" | "LVN_LPN" | "RN" | "NP" | "ALLIED";

// Map legacy payment-tier labels → Prisma TierCode enum (career program enum)
const TIER_CODE_MAP: Record<string, PrismaTierCode | null> = {
  NP: "NP", np: "NP", PREMIUM: "NP", premium: "NP",
  RPN: "RPN", rpn: "RPN",
  RN: "RN", rn: "RN", BASIC: "RN", basic: "RN",
  LVN_LPN: "LVN_LPN", LPN: "LVN_LPN", lpn: "LVN_LPN",
  ALLIED: "ALLIED", allied: "ALLIED",
  FREE: null, free: null, PRO: null, pro: null,
};

function normalizeTierCode(raw: string | null | undefined): PrismaTierCode | null {
  if (!raw) return null;
  return TIER_CODE_MAP[raw] ?? null;
}

interface PathwayLessonUpsert {
  pipelineId: string;
  upsertKey: { pathwayId: string; slug: string; locale: string };
  conflictStrategy: "skip" | "update";
  data: {
    pathwayId: string;
    slug: string;
    title: string;
    topic: string;
    topicSlug: string;
    bodySystem: string;
    seoTitle: string;
    seoDescription: string;
    sections: LessonSection[];
    previewSectionCount: number;
    countryCode: "US" | "CA" | null;
    tierCode: string | null;
    status: "PUBLISHED" | "DRAFT" | "ARCHIVED";
    sortOrder: number;
    locale: string;
    generatedAt: string;
  };
}

interface ExamQuestionUpsert {
  pipelineId: string;
  upsertKey: { stemHash: string };
  conflictStrategy: "skip" | "update";
  data: {
    tier: string;
    exam: string;
    questionType: string;
    status: "published" | "draft";
    stem: string;
    options: Record<string, string> | string[];
    correctAnswer: string | string[];
    rationale: string;
    difficulty: number;
    tags: string[];
    bodySystem: string;
    topic: string | null;
    subtopic: string | null;
    regionScope: string;
    stemHash: string;
    careerType: string;
    countryCode: string | null;
    languageCode: string;
    cognitiveLevel: string | null;
    incorrectAnswerRationale: Record<string, string> | null;
    nclexClientNeedsCategory: string | null;
    isScenario: boolean;
    isMockExamEligible: boolean;
    isAdaptiveEligible: boolean;
    isFlashcardSource: boolean;
    isStudyGuideLinked: boolean;
    isTutorReady: boolean;
    publishedAt: string;
    sourceVersion: number;
    generatedAt: string;
  };
}

interface StagePrismaImport {
  schemaVersion: 1;
  stage: "prisma_import";
  runId: string;
  generatedAt: string;
  programs: string[];
  sourceFiles: string[];
  pathwayLessonUpserts: PathwayLessonUpsert[];
  examQuestionUpserts: ExamQuestionUpsert[];
  summary: {
    pathwayLessonsTotal: number;
    examQuestionsTotal: number;
  };
}

// ─── Checkpoint ───────────────────────────────────────────────────────────────

interface Checkpoint {
  runId: string;
  file: string;
  lessonsInserted: number;
  lessonsSkipped: number;
  questionsInserted: number;
  questionsSkipped: number;
  completedAt?: string;
}

function writeCheckpoint(checkpointPath: string, data: Checkpoint): void {
  fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
  fs.writeFileSync(checkpointPath, JSON.stringify(data, null, 2), "utf8");
}

// ─── Lesson upsert ────────────────────────────────────────────────────────────

async function executeLessonUpserts(
  upserts: PathwayLessonUpsert[],
  dryRun: boolean,
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < upserts.length; i += BATCH_SIZE) {
    const chunk = upserts.slice(i, i + BATCH_SIZE);

    if (dryRun) {
      inserted += chunk.length;
      continue;
    }

    // Check which (pathwayId, slug, locale) combos already exist
    const keys = chunk.map((u) => ({
      pathwayId: u.data.pathwayId,
      slug: u.data.slug,
      locale: u.data.locale,
    }));

    const existing = await prisma.pathwayLesson.findMany({
      where: {
        OR: keys.map((k) => ({
          pathwayId: k.pathwayId,
          slug: k.slug,
          locale: k.locale,
        })),
      },
      select: { pathwayId: true, slug: true, locale: true },
    });

    const existingSet = new Set(
      existing.map((e) => `${e.pathwayId}::${e.slug}::${e.locale}`),
    );

    for (const u of chunk) {
      const key = `${u.data.pathwayId}::${u.data.slug}::${u.data.locale}`;

      if (u.conflictStrategy === "skip" && existingSet.has(key)) {
        skipped++;
        continue;
      }

      if (u.conflictStrategy === "update" && existingSet.has(key)) {
        await prisma.pathwayLesson.update({
          where: {
            pathwayId_slug_locale: {
              pathwayId: u.data.pathwayId,
              slug: u.data.slug,
              locale: u.data.locale,
            },
          },
          data: {
            title: u.data.title,
            sections: u.data.sections,
            seoTitle: u.data.seoTitle,
            seoDescription: u.data.seoDescription,
            tierCode: normalizeTierCode(u.data.tierCode) ?? undefined,
            updatedAt: new Date(),
          },
        });
        inserted++;
        continue;
      }

      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      try {
        await prisma.pathwayLesson.create({
          data: {
            pathwayId: u.data.pathwayId,
            slug: u.data.slug,
            title: u.data.title,
            topic: u.data.topic,
            topicSlug: u.data.topicSlug,
            bodySystem: u.data.bodySystem,
            seoTitle: u.data.seoTitle,
            seoDescription: u.data.seoDescription,
            sections: u.data.sections,
            previewSectionCount: u.data.previewSectionCount,
            countryCode: u.data.countryCode ?? undefined,
            tierCode: normalizeTierCode(u.data.tierCode) ?? undefined,
            status: u.data.status,
            sortOrder: u.data.sortOrder,
            locale: u.data.locale,
          },
        });
        inserted++;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Unique constraint")) {
          skipped++;
        } else {
          process.stderr.write(`  [lesson] create failed slug=${u.data.slug}: ${msg}\n`);
          skipped++;
        }
      }
    }

    process.stderr.write(
      `  [lessons] chunk ${i}–${Math.min(i + BATCH_SIZE, upserts.length)}: inserted=${inserted} skipped=${skipped}\n`,
    );
  }

  return { inserted, skipped };
}

// ─── Question upsert ──────────────────────────────────────────────────────────

async function executeQuestionUpserts(
  upserts: ExamQuestionUpsert[],
  dryRun: boolean,
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < upserts.length; i += BATCH_SIZE) {
    const chunk = upserts.slice(i, i + BATCH_SIZE);

    if (dryRun) {
      inserted += chunk.length;
      continue;
    }

    const hashes = chunk.map((u) => u.data.stemHash).filter(Boolean);
    const existing = await prisma.examQuestion.findMany({
      where: { stemHash: { in: hashes } },
      select: { stemHash: true },
    });
    const existingSet = new Set(existing.map((e) => e.stemHash).filter(Boolean) as string[]);

    const toInsert = chunk.filter(
      (u) => u.conflictStrategy === "skip" && !existingSet.has(u.data.stemHash),
    );
    skipped += chunk.length - toInsert.length;

    if (toInsert.length === 0) {
      process.stderr.write(`  [questions] chunk ${i}–${i + chunk.length}: all skipped (existing)\n`);
      continue;
    }

    await prisma.examQuestion.createMany({
      data: toInsert.map((u) => ({
        tier: u.data.tier,
        exam: u.data.exam,
        questionType: u.data.questionType,
        status: "published",
        stem: u.data.stem,
        options: u.data.options,
        correctAnswer: Array.isArray(u.data.correctAnswer)
          ? u.data.correctAnswer[0]
          : u.data.correctAnswer,
        rationale: u.data.rationale,
        difficulty: u.data.difficulty,
        tags: u.data.tags,
        bodySystem: u.data.bodySystem,
        topic: u.data.topic,
        subtopic: u.data.subtopic,
        regionScope: u.data.regionScope,
        stemHash: u.data.stemHash,
        careerType: u.data.careerType,
        countryCode: u.data.countryCode,
        languageCode: u.data.languageCode,
        cognitiveLevel: u.data.cognitiveLevel,
        incorrectAnswerRationale: u.data.incorrectAnswerRationale ?? undefined,
        nclexClientNeedsCategory: u.data.nclexClientNeedsCategory,
        isScenario: u.data.isScenario,
        isMockExamEligible: u.data.isMockExamEligible,
        isAdaptiveEligible: u.data.isAdaptiveEligible,
        isFlashcardSource: u.data.isFlashcardSource,
        isStudyGuideLinked: u.data.isStudyGuideLinked,
        isTutorReady: u.data.isTutorReady,
        publishedAt: new Date(u.data.publishedAt),
        sourceVersion: u.data.sourceVersion,
      })),
      skipDuplicates: true,
    });

    inserted += toInsert.length;
    process.stderr.write(
      `  [questions] chunk ${i}–${Math.min(i + BATCH_SIZE, upserts.length)}: inserted=${toInsert.length} skipped=${chunk.length - toInsert.length}\n`,
    );
  }

  return { inserted, skipped };
}

// ─── File executor ────────────────────────────────────────────────────────────

async function executeFile(
  filePath: string,
  dryRun: boolean,
): Promise<Checkpoint> {
  const raw: StagePrismaImport = JSON.parse(fs.readFileSync(filePath, "utf8"));

  if (raw.stage !== "prisma_import" || raw.schemaVersion !== 1) {
    throw new Error(`${filePath}: not a valid Stage-I prisma_import file (stage=${raw.stage}, v=${raw.schemaVersion})`);
  }

  process.stderr.write(`
[execute] ${path.basename(filePath)}
  runId   : ${raw.runId}
  lessons : ${raw.summary.pathwayLessonsTotal}
  questions: ${raw.summary.examQuestionsTotal}
  dry-run : ${dryRun}
`);

  const lessonResult = await executeLessonUpserts(raw.pathwayLessonUpserts, dryRun);
  const questionResult = await executeQuestionUpserts(raw.examQuestionUpserts, dryRun);

  const checkpoint: Checkpoint = {
    runId: raw.runId,
    file: path.relative(process.cwd(), filePath),
    lessonsInserted: lessonResult.inserted,
    lessonsSkipped: lessonResult.skipped,
    questionsInserted: questionResult.inserted,
    questionsSkipped: questionResult.skipped,
    completedAt: new Date().toISOString(),
  };

  process.stderr.write(`
[summary] ${path.basename(filePath)}
  lessons  : inserted=${lessonResult.inserted}  skipped=${lessonResult.skipped}
  questions: inserted=${questionResult.inserted}  skipped=${questionResult.skipped}
`);

  return checkpoint;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const get = (name: string) => argv.find((a) => a.startsWith(`--${name}=`))?.slice(`--${name}=`.length);

  const dryRun = !argv.includes("--apply");
  const fileArg = get("file");
  const dirArg = get("dir");

  process.stderr.write(`
NurseNest Stage-I Prisma Import Executor
  mode    : ${dryRun ? "DRY-RUN (pass --apply to write)" : "APPLY"}
  file    : ${fileArg ?? "(not set)"}
  dir     : ${dirArg ?? "data/pipeline/runs (default)"}
`);

  const runsDir = path.resolve(
    process.cwd(),
    dirArg ?? "data/pipeline/runs",
  );
  const checkpointDir = path.join(runsDir, "checkpoints");

  // Collect files to process
  let files: string[] = [];

  if (fileArg) {
    files = [path.resolve(process.cwd(), fileArg)];
  } else {
    files = fs
      .readdirSync(runsDir)
      .filter((f) => f.endsWith("-prisma-import.json"))
      .map((f) => path.join(runsDir, f));
  }

  if (files.length === 0) {
    process.stderr.write("No Stage-I import files found.\n");
    process.exit(1);
  }

  process.stderr.write(`\nFiles to process: ${files.map((f) => path.basename(f)).join(", ")}\n`);

  const allCheckpoints: Checkpoint[] = [];

  for (const filePath of files) {
    const checkpoint = await executeFile(filePath, dryRun);
    allCheckpoints.push(checkpoint);

    if (!dryRun) {
      const checkpointPath = path.join(
        checkpointDir,
        `${path.basename(filePath, ".json")}-checkpoint.json`,
      );
      writeCheckpoint(checkpointPath, checkpoint);
      process.stderr.write(`  [checkpoint] written: ${checkpointPath}\n`);
    }
  }

  // Final JSON report to stdout
  const report = {
    executedAt: new Date().toISOString(),
    dryRun,
    files: files.map((f) => path.basename(f)),
    results: allCheckpoints,
    totals: {
      lessonsInserted: allCheckpoints.reduce((s, c) => s + c.lessonsInserted, 0),
      lessonsSkipped: allCheckpoints.reduce((s, c) => s + c.lessonsSkipped, 0),
      questionsInserted: allCheckpoints.reduce((s, c) => s + c.questionsInserted, 0),
      questionsSkipped: allCheckpoints.reduce((s, c) => s + c.questionsSkipped, 0),
    },
  };

  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  prisma.$disconnect().catch(() => {});
  process.exit(1);
});
