#!/usr/bin/env npx tsx
/**
 * import-np-phase2-batch.ts
 *
 * Idempotent import pipeline for NP advanced-practice phase2 generated content.
 * Imports:
 *   1. ExamQuestion rows from *-qbank.json files
 *   2. PathwayLesson rows from *-lessons.json files
 *
 * Safety guarantees:
 *   - Default is DRY-RUN (no writes). Pass --apply to write.
 *   - Deduplicated by stemHash (questions) and (pathwayId, slug) (lessons).
 *   - Batched writes (default 50) to avoid OOM or DB lock pressure.
 *   - Bounded: only reads files explicitly listed or in --dir.
 *   - Resumable: skips already-imported rows silently.
 *
 * Usage:
 *   # Dry-run (default) — prints what would be imported
 *   npx tsx scripts/import-np-phase2-batch.ts --dir=data/phase2
 *
 *   # Write to DB
 *   npx tsx scripts/import-np-phase2-batch.ts --dir=data/phase2 --apply
 *
 *   # Single qbank file
 *   npx tsx scripts/import-np-phase2-batch.ts \
 *     --qbank=data/phase2/np-advanced-batch-01-qbank.json \
 *     --apply
 *
 *   # With explicit pathway target
 *   npx tsx scripts/import-np-phase2-batch.ts --dir=data/phase2 --pathway=us-np-fnp --apply
 *
 * Env: DATABASE_URL must be set (loaded from .env or environment).
 */

import "../src/lib/db/env-bootstrap";
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_EXAM = "np-aanp";
const DEFAULT_TIER = "premium";
const DEFAULT_QUESTION_TYPE = "mcq";
const DEFAULT_PATHWAY = "us-np-fnp";
const DEFAULT_LOCALE = "en";
const DEFAULT_BODY_SYSTEM = "general";
const BATCH_SIZE = 50;

// ─── Difficulty normalization ─────────────────────────────────────────────────

const DIFFICULTY_MAP: Record<string, number> = {
  easy: 2,
  medium: 3,
  hard: 4,
  very_hard: 5,
  foundation: 1,
  foundational: 1,
  intermediate: 3,
  advanced: 4,
};

function normalizeDifficulty(raw: unknown): number {
  if (typeof raw === "number") return Math.min(5, Math.max(1, Math.round(raw)));
  if (typeof raw === "string") return DIFFICULTY_MAP[raw.toLowerCase().trim()] ?? 3;
  return 3;
}

// ─── Stem hash ────────────────────────────────────────────────────────────────

function computeStemHash(stem: string): string {
  return createHash("sha256")
    .update(stem.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex")
    .slice(0, 32);
}

// ─── Lesson sections builder ──────────────────────────────────────────────────

interface LessonBlock {
  id: string;
  heading: string;
  kind: string;
  body: string;
}

function lessonToSections(lessonData: Record<string, unknown>): LessonBlock[] {
  const sections: LessonBlock[] = [];

  function addSection(heading: string, body: unknown, kind = "text") {
    if (!body) return;
    const text = typeof body === "string" ? body : JSON.stringify(body, null, 2);
    if (!text.trim() || text === "null") return;
    sections.push({
      id: heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      heading,
      kind,
      body: text,
    });
  }

  // Batch01 shape: flat named sections
  if (lessonData.clinicalFraming || lessonData.managementApproach) {
    addSection("Clinical Framing", lessonData.clinicalFraming);
    addSection("Core Concepts & Differential", lessonData.coreConceptsAndDifferential, "json");
    addSection("Management Approach", lessonData.managementApproach, "json");
    addSection("Red Flags & Escalation", lessonData.redFlagsEscalation, "json");
    addSection("Population Considerations", lessonData.populationConsiderations, "json");
    addSection("Follow-Up & Monitoring", lessonData.followUpAndMonitoring, "json");
    return sections;
  }

  // Batch02 shape: conceptBlocks array
  if (Array.isArray(lessonData.conceptBlocks)) {
    if (lessonData.objectives) {
      addSection("Learning Objectives", lessonData.objectives, "json");
    }
    for (const block of lessonData.conceptBlocks as Array<{ blockTitle?: string; keyPoints?: unknown }>) {
      if (!block) continue;
      const heading = block.blockTitle ?? "Concept";
      const body = block.keyPoints;
      if (body) {
        sections.push({
          id: heading.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          heading,
          kind: "json",
          body: typeof body === "string" ? body : JSON.stringify(body, null, 2),
        });
      }
    }
    if (lessonData.teachingNotes) {
      addSection("Teaching Notes", lessonData.teachingNotes, "json");
    }
    return sections;
  }

  return sections;
}

// ─── Topic → bodySystem heuristic ─────────────────────────────────────────────

const TOPIC_SYSTEM_MAP: Record<string, string> = {
  knee: "musculoskeletal",
  msk: "musculoskeletal",
  ortho: "musculoskeletal",
  uti: "genitourinary",
  urinary: "genitourinary",
  diabetes: "endocrine",
  t2dm: "endocrine",
  copd: "respiratory",
  pulmonary: "respiratory",
  headache: "neurological",
  neuro: "neurological",
  syncope: "neurological",
  hypertension: "cardiovascular",
  cardiac: "cardiovascular",
  hiv: "infectious-disease",
  prep: "infectious-disease",
  geriatric: "general",
  frailty: "general",
  deprescribing: "pharmacology",
  polypharmacy: "pharmacology",
  psoriasis: "dermatology",
  dermatitis: "dermatology",
  skin: "dermatology",
  smoking: "respiratory",
  cancer: "hematology-oncology",
};

function topicToBodySystem(topicSlug: string | undefined | null): string {
  if (!topicSlug) return DEFAULT_BODY_SYSTEM;
  const lower = topicSlug.toLowerCase();
  for (const [key, system] of Object.entries(TOPIC_SYSTEM_MAP)) {
    if (lower.includes(key)) return system;
  }
  return DEFAULT_BODY_SYSTEM;
}

// ─── cognitiveLevel mapping ───────────────────────────────────────────────────

const LAYER_TO_BLOOM: Record<string, string> = {
  L1: "remember",
  L2: "apply",
  L3: "analysis",
};

// ─── Question parsers ─────────────────────────────────────────────────────────

interface RawQuestion {
  // batch01 shape
  questionId?: string;
  // batch02 shape
  id?: string;
  topicSlug?: string;
  lessonSlug?: string;
  caseAxis?: string;
  clinicalPriority?: string;
  careComplexity?: string;
  cognitiveLayer?: string;
  difficulty?: string | number;
  stem: string;
  options: Record<string, string>;
  correctAnswer: string;
  rationale?: string;
  incorrectOptionExplanations?: Record<string, string>;
  keyConceptTested?: string;
  dispositionTag?: string | null;
  populationTags?: string[] | null;
  tags?: string[];
}

function normalizeQuestion(
  raw: RawQuestion,
  exam: string,
  batchId: string,
): {
  id: string;
  tier: string;
  exam: string;
  questionType: string;
  status: string;
  stem: string;
  options: Record<string, string>;
  correctAnswer: string;
  rationale: string | null;
  difficulty: number;
  tags: string[];
  bodySystem: string;
  topic: string | null;
  subtopic: string | null;
  cognitiveLevel: string | null;
  stemHash: string;
  incorrectAnswerRationale: Record<string, string> | null;
  nclexClientNeedsCategory: string | null;
} {
  const id = raw.id ?? raw.questionId ?? `${batchId}-${computeStemHash(raw.stem).slice(0, 8)}`;

  const tags: string[] = [
    ...(raw.tags ?? []),
    ...(raw.clinicalPriority ? [raw.clinicalPriority] : []),
    ...(raw.careComplexity ? [raw.careComplexity] : []),
    ...(raw.dispositionTag ? [raw.dispositionTag] : []),
    ...(raw.populationTags ?? []),
    ...(raw.cognitiveLayer ? [raw.cognitiveLayer] : []),
    batchId,
  ].filter(Boolean);

  const cognitiveLevel = raw.cognitiveLayer
    ? (LAYER_TO_BLOOM[raw.cognitiveLayer] ?? null)
    : null;

  // Map clinicalPriority → NCLEX category (rough)
  const nclexMap: Record<string, string> = {
    "high-risk": "safety-and-infection-control",
    "core": "physiological-adaptation",
    "special-population": "health-promotion-and-maintenance",
    "supporting": "basic-care-and-comfort",
  };
  const nclexClientNeedsCategory = raw.clinicalPriority ? (nclexMap[raw.clinicalPriority] ?? null) : null;

  return {
    id,
    tier: DEFAULT_TIER,
    exam,
    questionType: DEFAULT_QUESTION_TYPE,
    status: "draft",
    stem: raw.stem.trim(),
    options: raw.options,
    correctAnswer: raw.correctAnswer,
    rationale: raw.rationale?.trim() ?? null,
    difficulty: normalizeDifficulty(raw.difficulty),
    tags: [...new Set(tags)],
    bodySystem: topicToBodySystem(raw.topicSlug),
    topic: raw.topicSlug ?? null,
    subtopic: null,
    cognitiveLevel,
    stemHash: computeStemHash(raw.stem),
    incorrectAnswerRationale: raw.incorrectOptionExplanations ?? null,
    nclexClientNeedsCategory,
  };
}

// ─── Lesson parser ────────────────────────────────────────────────────────────

interface RawLesson {
  topicSlug: string;
  topicName?: string;
  // batch01 shape
  caseAxis?: string;
  clinicalPriority?: string;
  careComplexity?: string;
  populationTags?: string[];
  domain?: string;
  lesson?: Record<string, unknown>;
  // batch02 shape (topics[].lessons[])
  lessonSlug?: string;
  lessonTitle?: string;
  objectives?: unknown;
  conceptBlocks?: Array<{ blockTitle?: string; keyPoints?: unknown }>;
  teachingNotes?: unknown;
  // batch02 topic wrapper fields (merged in from parent)
  _complexity?: string;
  _axisTags?: string[];
}

function normalizeLesson(
  raw: RawLesson,
  pathwayId: string,
  batchId: string,
  sortOrderBase: number,
) {
  // Resolve lesson identity — batch01 uses topicSlug, batch02 uses lessonSlug
  const effectiveSlug = raw.lessonSlug ?? raw.topicSlug;
  const slug = `${effectiveSlug}--${batchId}`;

  // Build the lesson data object for section extraction (handles both shapes)
  const lessonData: Record<string, unknown> = raw.lesson ?? {
    objectives: raw.objectives,
    conceptBlocks: raw.conceptBlocks,
    teachingNotes: raw.teachingNotes,
  };
  const sections = lessonToSections(lessonData);
  const bodySystem = topicToBodySystem(raw.topicSlug);

  const title = raw.lessonTitle ?? raw.topicName ?? raw.topicSlug;
  const seoTitle = `${title} | NP Clinical Review`;
  const complexity = raw.careComplexity ?? raw._complexity ?? "";
  const seoDescription = `Advanced NP clinical review: ${title}. ${
    complexity === "advanced"
      ? "Advanced prescribing, management, and decision-making for NP boards."
      : "Clinical reasoning and management for NP primary care practice."
  }`.slice(0, 160);

  return {
    pathwayId,
    slug,
    title,
    topic: raw.topicSlug.replace(/-+/g, " "),
    topicSlug: raw.topicSlug,
    bodySystem,
    seoTitle,
    seoDescription,
    sections,
    locale: DEFAULT_LOCALE,
    status: "DRAFT" as const,
    sortOrder: sortOrderBase,
    tierCode: "PREMIUM" as const,
  };
}

// ─── File discovery ───────────────────────────────────────────────────────────

function discoverFiles(dir: string): { qbankFiles: string[]; lessonFiles: string[] } {
  const all = fs.readdirSync(dir).map((f) => path.join(dir, f));
  const qbankFiles = all.filter(
    (f) => f.endsWith("-qbank.json") || f.endsWith(".qbank.json"),
  );
  const lessonFiles = all.filter(
    (f) => f.endsWith("-lessons.json") || f.endsWith(".lessons.json"),
  );
  return { qbankFiles, lessonFiles };
}

// ─── Batch upsert helpers ─────────────────────────────────────────────────────

async function upsertQuestionBatch(
  questions: ReturnType<typeof normalizeQuestion>[],
  dryRun: boolean,
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < questions.length; i += BATCH_SIZE) {
    const chunk = questions.slice(i, i + BATCH_SIZE);

    if (dryRun) {
      inserted += chunk.length;
      continue;
    }

    // Check which stem hashes already exist
    const hashes = chunk.map((q) => q.stemHash).filter(Boolean) as string[];
    const existing = await prisma.examQuestion.findMany({
      where: { stemHash: { in: hashes } },
      select: { stemHash: true },
    });
    const existingSet = new Set(existing.map((e) => e.stemHash));

    const toInsert = chunk.filter(
      (q) => q.stemHash && !existingSet.has(q.stemHash),
    );
    skipped += chunk.length - toInsert.length;

    if (toInsert.length === 0) continue;

    await prisma.examQuestion.createMany({
      data: toInsert.map((q) => ({
        id: q.id,
        tier: q.tier,
        exam: q.exam,
        questionType: q.questionType,
        status: q.status,
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        rationale: q.rationale,
        difficulty: q.difficulty,
        tags: q.tags,
        bodySystem: q.bodySystem,
        topic: q.topic,
        subtopic: q.subtopic,
        cognitiveLevel: q.cognitiveLevel,
        stemHash: q.stemHash,
        incorrectAnswerRationale: q.incorrectAnswerRationale ?? undefined,
        nclexClientNeedsCategory: q.nclexClientNeedsCategory,
        isAdaptiveEligible: true,
        isMockExamEligible: true,
      })),
      skipDuplicates: true,
    });

    inserted += toInsert.length;
    process.stderr.write(`  [questions] chunk ${i}-${i + chunk.length}: inserted ${toInsert.length}, skipped ${chunk.length - toInsert.length}\n`);
  }

  return { inserted, skipped };
}

async function upsertLessonBatch(
  lessons: ReturnType<typeof normalizeLesson>[],
  dryRun: boolean,
): Promise<{ inserted: number; skipped: number }> {
  let inserted = 0;
  let skipped = 0;

  for (let i = 0; i < lessons.length; i += BATCH_SIZE) {
    const chunk = lessons.slice(i, i + BATCH_SIZE);

    for (const lesson of chunk) {
      if (dryRun) {
        inserted++;
        continue;
      }

      try {
        await prisma.pathwayLesson.upsert({
          where: {
            pathwayId_slug_locale: {
              pathwayId: lesson.pathwayId,
              slug: lesson.slug,
              locale: lesson.locale,
            },
          },
          update: {
            title: lesson.title,
            sections: lesson.sections,
            seoTitle: lesson.seoTitle,
            seoDescription: lesson.seoDescription,
            updatedAt: new Date(),
          },
          create: {
            pathwayId: lesson.pathwayId,
            slug: lesson.slug,
            title: lesson.title,
            topic: lesson.topic,
            topicSlug: lesson.topicSlug,
            bodySystem: lesson.bodySystem,
            seoTitle: lesson.seoTitle,
            seoDescription: lesson.seoDescription,
            sections: lesson.sections,
            locale: lesson.locale,
            status: lesson.status,
            sortOrder: lesson.sortOrder,
            tierCode: lesson.tierCode,
          },
        });
        inserted++;
      } catch (err) {
        console.error(`  [lessons] upsert failed for slug=${lesson.slug}:`, err);
        skipped++;
      }
    }

    if (!dryRun) {
      process.stderr.write(`  [lessons] chunk ${i}-${i + chunk.length}: processed ${chunk.length}\n`);
    }
  }

  return { inserted, skipped };
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const argv = process.argv.slice(2);
  const get = (name: string) => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };

  const dryRun = !argv.includes("--apply");
  const dirArg = get("dir");
  const qbankArg = get("qbank");
  const lessonsArg = get("lessons");
  const examArg = get("exam") ?? DEFAULT_EXAM;
  const pathwayArg = get("pathway") ?? DEFAULT_PATHWAY;

  console.error(`
NP Phase2 Batch Import
  dry-run : ${dryRun} (pass --apply to write)
  exam    : ${examArg}
  pathway : ${pathwayArg}
  dir     : ${dirArg ?? "(not set)"}
  qbank   : ${qbankArg ?? "(not set)"}
  lessons : ${lessonsArg ?? "(not set)"}
`);

  let qbankFiles: string[] = [];
  let lessonFiles: string[] = [];

  if (dirArg) {
    const absDir = path.resolve(process.cwd(), dirArg);
    const discovered = discoverFiles(absDir);
    qbankFiles = discovered.qbankFiles;
    lessonFiles = discovered.lessonFiles;
  }
  if (qbankArg) qbankFiles.push(path.resolve(process.cwd(), qbankArg));
  if (lessonsArg) lessonFiles.push(path.resolve(process.cwd(), lessonsArg));

  if (qbankFiles.length === 0 && lessonFiles.length === 0) {
    console.error("No files found. Use --dir=<path> or --qbank=<file> --lessons=<file>.");
    process.exit(1);
  }

  const report: Record<string, unknown> = {
    dryRun,
    exam: examArg,
    pathway: pathwayArg,
    qbankFiles: qbankFiles.map((f) => path.basename(f)),
    lessonFiles: lessonFiles.map((f) => path.basename(f)),
    questions: { total: 0, inserted: 0, skipped: 0 },
    lessons: { total: 0, inserted: 0, skipped: 0 },
  };

  // ── Import questions ────────────────────────────────────────────────────────

  let allQuestions: ReturnType<typeof normalizeQuestion>[] = [];

  for (const filePath of qbankFiles) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const batchId: string = raw.batchId ?? path.basename(filePath, ".json");
    const rawQuestions: RawQuestion[] = raw.questions ?? [];

    console.error(`\n[qbank] ${path.basename(filePath)}: ${rawQuestions.length} questions (batchId=${batchId})`);

    const normalized = rawQuestions.map((q) => normalizeQuestion(q, examArg, batchId));
    allQuestions = allQuestions.concat(normalized);
  }

  if (allQuestions.length > 0) {
    const q = report.questions as { total: number; inserted: number; skipped: number };
    q.total = allQuestions.length;
    const result = await upsertQuestionBatch(allQuestions, dryRun);
    q.inserted = result.inserted;
    q.skipped = result.skipped;
    console.error(`\n[questions] total=${q.total} inserted=${q.inserted} skipped=${q.skipped}`);
  }

  // ── Import lessons ──────────────────────────────────────────────────────────

  let allLessons: ReturnType<typeof normalizeLesson>[] = [];
  let sortOrderBase = 1000; // start high to not conflict with existing lessons

  for (const filePath of lessonFiles) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const batchId: string = raw.batchId ?? path.basename(filePath, ".json");

    // Support both batch01 (root.lessons[]) and batch02 (root.topics[].lessons[]) shapes
    let rawLessons: RawLesson[] = [];
    if (Array.isArray(raw.lessons)) {
      rawLessons = raw.lessons as RawLesson[];
    } else if (Array.isArray(raw.topics)) {
      // Flatten topics[].lessons[] → individual lesson rows with parent topic fields merged
      for (const topic of raw.topics as Array<{
        topicSlug: string;
        topicTitle?: string;
        complexity?: string;
        axisTags?: string[];
        lessons?: RawLesson[];
      }>) {
        for (const lesson of topic.lessons ?? []) {
          rawLessons.push({
            ...lesson,
            topicSlug: topic.topicSlug,
            topicName: topic.topicTitle ?? topic.topicSlug,
            _complexity: topic.complexity,
            _axisTags: topic.axisTags,
          });
        }
      }
    }

    console.error(`\n[lessons] ${path.basename(filePath)}: ${rawLessons.length} lessons (batchId=${batchId})`);

    const normalized = rawLessons.map((l, idx) =>
      normalizeLesson(l, pathwayArg, batchId, sortOrderBase + idx),
    );
    allLessons = allLessons.concat(normalized);
    sortOrderBase += rawLessons.length;
  }

  if (allLessons.length > 0) {
    const l = report.lessons as { total: number; inserted: number; skipped: number };
    l.total = allLessons.length;
    const result = await upsertLessonBatch(allLessons, dryRun);
    l.inserted = result.inserted;
    l.skipped = result.skipped;
    console.error(`\n[lessons] total=${l.total} inserted=${l.inserted} skipped=${l.skipped}`);
  }

  // ── Final report (stdout) ───────────────────────────────────────────────────

  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
