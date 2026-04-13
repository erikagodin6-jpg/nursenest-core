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
 *   - Writes a checkpoint JSON after each processed file.
 *   - Resumable: skips completed files from checkpoints and safely converges partial reruns via DB identity checks.
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
import { normalizeImportedQuestionShape, questionShapeNeedsRepair } from "./stage-prisma-import-normalize";

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
  questionsRepaired: number;
  completedAt?: string;
}

function writeCheckpoint(checkpointPath: string, data: Checkpoint): void {
  fs.mkdirSync(path.dirname(checkpointPath), { recursive: true });
  fs.writeFileSync(checkpointPath, JSON.stringify(data, null, 2), "utf8");
}

function readCheckpoint(checkpointPath: string): Checkpoint | null {
  if (!fs.existsSync(checkpointPath)) return null;
  return JSON.parse(fs.readFileSync(checkpointPath, "utf8")) as Checkpoint;
}

function checkpointPathForFile(checkpointDir: string, filePath: string): string {
  return path.join(checkpointDir, `${path.basename(filePath, ".json")}-checkpoint.json`);
}

// ─── Lesson upsert ────────────────────────────────────────────────────────────

async function executeLessonUpserts(
  upserts: PathwayLessonUpsert[],
  dryRun: boolean,
): Promise<{ inserted: number; skipped: number }> {
  const dedupedUpserts: PathwayLessonUpsert[] = [];
  const seenImportKeys = new Set<string>();
  let importDuplicateSkips = 0;
  for (const u of upserts) {
    const key = `${u.data.pathwayId}::${u.data.slug}::${u.data.locale}`;
    if (seenImportKeys.has(key)) {
      importDuplicateSkips += 1;
      continue;
    }
    seenImportKeys.add(key);
    dedupedUpserts.push(u);
  }
  if (importDuplicateSkips > 0) {
    process.stderr.write(
      `  [lessons] importer dedupe skipped ${importDuplicateSkips} duplicate upsert row(s) by (pathwayId, slug, locale)\n`,
    );
  }

  let inserted = 0;
  let skipped = importDuplicateSkips;

  for (let i = 0; i < dedupedUpserts.length; i += BATCH_SIZE) {
    const chunk = dedupedUpserts.slice(i, i + BATCH_SIZE);

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
        if (!dryRun) {
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
        }
        inserted++;
        continue;
      }

      if (existingSet.has(key)) {
        skipped++;
        continue;
      }

      if (dryRun) {
        inserted++;
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
          process.stderr.write(`  [lesson] create failed slug=${u.data.slug}: ${msg}
`);
          skipped++;
        }
      }
    }

    process.stderr.write(
      `  [lessons] chunk ${i}–${Math.min(i + BATCH_SIZE, dedupedUpserts.length)}: inserted=${inserted} skipped=${skipped}
`,
    );
  }

  return { inserted, skipped };
}

// ─── Question upsert ──────────────────────────────────────────────────────────

async function executeQuestionUpserts(
  upserts: ExamQuestionUpsert[],
  dryRun: boolean,
): Promise<{ inserted: number; skipped: number; repaired: number }> {
  let inserted = 0;
  let skipped = 0;
  let repaired = 0;

  for (let i = 0; i < upserts.length; i += BATCH_SIZE) {
    const chunk = upserts.slice(i, i + BATCH_SIZE);
    const normalizedChunk = chunk.map((u) => ({
      original: u,
      normalized: normalizeImportedQuestionShape(u.data.options, u.data.correctAnswer),
    }));

    const hashes = chunk.map((u) => u.data.stemHash).filter(Boolean);
    const existing = await prisma.examQuestion.findMany({
      where: { stemHash: { in: hashes } },
      select: { id: true, stemHash: true, options: true, correctAnswer: true },
    });
    const existingByHash = new Map(existing.map((row) => [row.stemHash ?? "", row]));

    const toInsert: Array<{ original: ExamQuestionUpsert; normalized: ReturnType<typeof normalizeImportedQuestionShape> }> = [];

    for (const item of normalizedChunk) {
      const existingRow = existingByHash.get(item.original.data.stemHash);
      if (existingRow) {
        skipped++;
        if (
          questionShapeNeedsRepair(
            existingRow.options,
            existingRow.correctAnswer,
            item.normalized.options,
            item.normalized.correctAnswer,
          )
        ) {
          if (!dryRun) {
            await prisma.$executeRawUnsafe(
              "UPDATE exam_questions SET options = $1::jsonb, correct_answer = $2::jsonb WHERE id = $3",
              JSON.stringify(item.normalized.options),
              JSON.stringify(item.normalized.correctAnswer),
              existingRow.id,
            );
          }
          repaired++;
        }
        continue;
      }

      if (item.normalized.options.length < 2 || item.normalized.correctAnswer.length < 1) {
        skipped++;
        process.stderr.write(
          `  [questions] invalid normalized shape stemHash=${item.original.data.stemHash}: options=${item.normalized.options.length} answers=${item.normalized.correctAnswer.length}
`,
        );
        continue;
      }

      toInsert.push(item);
    }

    if (dryRun) {
      inserted += toInsert.length;
      process.stderr.write(
        `  [questions] chunk ${i}–${Math.min(i + BATCH_SIZE, upserts.length)}: inserted=${toInsert.length} skipped=${chunk.length - toInsert.length} repaired=${repaired}
`,
      );
      continue;
    }

    if (toInsert.length === 0) {
      process.stderr.write(`  [questions] chunk ${i}–${i + chunk.length}: all skipped (existing/invalid)
`);
      continue;
    }

    await prisma.examQuestion.createMany({
      data: toInsert.map(({ original, normalized }) => ({
        tier: original.data.tier,
        exam: original.data.exam,
        questionType: original.data.questionType,
        status: "published",
        stem: original.data.stem,
        options: normalized.options,
        correctAnswer: normalized.correctAnswer,
        rationale: original.data.rationale,
        difficulty: original.data.difficulty,
        tags: original.data.tags,
        bodySystem: original.data.bodySystem,
        topic: original.data.topic,
        subtopic: original.data.subtopic,
        regionScope: original.data.regionScope,
        stemHash: original.data.stemHash,
        careerType: original.data.careerType,
        countryCode: original.data.countryCode,
        languageCode: original.data.languageCode,
        cognitiveLevel: original.data.cognitiveLevel,
        incorrectAnswerRationale: original.data.incorrectAnswerRationale ?? undefined,
        nclexClientNeedsCategory: original.data.nclexClientNeedsCategory,
        isScenario: original.data.isScenario,
        isMockExamEligible: original.data.isMockExamEligible,
        isAdaptiveEligible: original.data.isAdaptiveEligible,
        isFlashcardSource: original.data.isFlashcardSource,
        isStudyGuideLinked: original.data.isStudyGuideLinked,
        isTutorReady: original.data.isTutorReady,
        publishedAt: new Date(original.data.publishedAt),
        sourceVersion: original.data.sourceVersion,
      })),
      skipDuplicates: true,
    });

    inserted += toInsert.length;
    process.stderr.write(
      `  [questions] chunk ${i}–${Math.min(i + BATCH_SIZE, upserts.length)}: inserted=${toInsert.length} skipped=${chunk.length - toInsert.length} repaired=${repaired}
`,
    );
  }

  return { inserted, skipped, repaired };
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
    questionsRepaired: questionResult.repaired,
    completedAt: new Date().toISOString(),
  };

  process.stderr.write(`
[summary] ${path.basename(filePath)}
  lessons  : inserted=${lessonResult.inserted}  skipped=${lessonResult.skipped}
  questions: inserted=${questionResult.inserted}  skipped=${questionResult.skipped}  repaired=${questionResult.repaired}
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
    const checkpointPath = checkpointPathForFile(checkpointDir, filePath);
    if (!dryRun) {
      const existingCheckpoint = readCheckpoint(checkpointPath);
      if (existingCheckpoint?.completedAt && typeof existingCheckpoint.questionsRepaired === "number") {
        try {
          const runMeta = JSON.parse(fs.readFileSync(filePath, "utf8")) as StagePrismaImport;
          const relativeFile = path.relative(process.cwd(), filePath);
          if (existingCheckpoint.runId === runMeta.runId && existingCheckpoint.file === relativeFile) {
            process.stderr.write(`  [checkpoint] skip completed file: ${path.basename(filePath)}\n`);
            allCheckpoints.push(existingCheckpoint);
            continue;
          }
        } catch (err: unknown) {
          process.stderr.write(`  [checkpoint] failed to read metadata for ${path.basename(filePath)}: ${err instanceof Error ? err.message : String(err)}\n`);
        }
      }
    }

    const checkpoint = await executeFile(filePath, dryRun);
    allCheckpoints.push(checkpoint);

    if (!dryRun) {
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
      questionsRepaired: allCheckpoints.reduce((s, c) => s + c.questionsRepaired, 0),
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
