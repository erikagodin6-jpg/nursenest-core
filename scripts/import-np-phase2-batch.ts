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
import { STAGE_PRISMA_IMPORT_PROGRAM_MAP } from "./stage-prisma-import-program-map";

const prisma = new PrismaClient();

// ─── Defaults ─────────────────────────────────────────────────────────────────

const DEFAULT_EXAM = "AANP-FNP";
const DEFAULT_TIER = "premium";
const DEFAULT_QUESTION_TYPE = "mcq";
const DEFAULT_PATHWAY = STAGE_PRISMA_IMPORT_PROGRAM_MAP["np"].pathwayId;
const DEFAULT_LOCALE = "en";
const DEFAULT_COUNTRY_CODE = null; // NP is "both" US + CA
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

const DIFFICULTY_LABEL: Record<number, string> = {
  1: "foundation",
  2: "easy",
  3: "medium",
  4: "hard",
  5: "very_hard",
};

function normalizeDifficulty(raw: unknown): number {
  if (typeof raw === "number") return Math.min(5, Math.max(1, Math.round(raw)));
  if (typeof raw === "string") return DIFFICULTY_MAP[raw.toLowerCase().trim()] ?? 3;
  return 3;
}

function difficultyLabel(n: number): string {
  return DIFFICULTY_LABEL[n] ?? "medium";
}

// ─── Slug / tag normalization ─────────────────────────────────────────────────

function normalizeTopicSlug(raw: string | undefined | null): string | null {
  if (!raw) return null;
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map((t) => t.toLowerCase().trim()).filter(Boolean))].sort();
}

// ─── Stem hash ────────────────────────────────────────────────────────────────

function computeStemHash(stem: string): string {
  return createHash("sha256")
    .update(stem.trim().toLowerCase().replace(/\s+/g, " "))
    .digest("hex")
    .slice(0, 32);
}

// ─── Near-duplicate detection (Jaccard on meaningful word tokens) ──────────────

function stemTokens(text: string): Set<string> {
  const STOP = new Set(["the", "a", "an", "and", "or", "of", "in", "is", "to", "for", "with", "that", "this", "are", "was", "were", "has", "have", "had", "his", "her", "she", "he", "they", "who", "what", "which", "when", "not", "most", "more"]);
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 3 && !STOP.has(w)),
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 && b.size === 0) return 1;
  let intersect = 0;
  for (const w of a) if (b.has(w)) intersect++;
  return intersect / (a.size + b.size - intersect);
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
  difficultyLabel: string;
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

  const rawTags: string[] = [
    ...(raw.tags ?? []),
    ...(raw.clinicalPriority ? [raw.clinicalPriority] : []),
    ...(raw.careComplexity ? [raw.careComplexity] : []),
    ...(raw.dispositionTag ? [raw.dispositionTag] : []),
    ...(raw.populationTags ?? []),
    ...(raw.cognitiveLayer ? [raw.cognitiveLayer] : []),
    batchId,
  ].filter(Boolean);
  const tags = normalizeTags(rawTags);

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

  const topicSlug = normalizeTopicSlug(raw.topicSlug);
  const difficulty = normalizeDifficulty(raw.difficulty);

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
    difficulty,
    difficultyLabel: difficultyLabel(difficulty),
    tags,
    bodySystem: topicToBodySystem(topicSlug),
    topic: topicSlug,
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
  const canonicalTopicSlug = normalizeTopicSlug(raw.topicSlug) ?? raw.topicSlug;
  const effectiveSlug = normalizeTopicSlug(raw.lessonSlug ?? raw.topicSlug) ?? raw.topicSlug;
  const slug = `${effectiveSlug}--${batchId}`;

  // Build the lesson data object for section extraction (handles both shapes)
  const lessonData: Record<string, unknown> = raw.lesson ?? {
    objectives: raw.objectives,
    conceptBlocks: raw.conceptBlocks,
    teachingNotes: raw.teachingNotes,
  };
  const sections = lessonToSections(lessonData);
  const bodySystem = topicToBodySystem(canonicalTopicSlug);

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
    topic: canonicalTopicSlug.replace(/-+/g, " "),
    topicSlug: canonicalTopicSlug,
    bodySystem,
    seoTitle,
    seoDescription,
    sections,
    locale: DEFAULT_LOCALE,
    status: "PUBLISHED" as const,
    sortOrder: sortOrderBase,
    tierCode: "PREMIUM" as const,
    countryCode: DEFAULT_COUNTRY_CODE,
  };
}

// ─── Deduplication ────────────────────────────────────────────────────────────

type NormalizedQuestion = ReturnType<typeof normalizeQuestion>;
type NormalizedLesson = ReturnType<typeof normalizeLesson>;

interface DedupReport {
  questions: {
    total: number;
    kept: number;
    droppedExact: number;
    droppedNear: number;
    nearDuplicates: Array<{ kept: string; dropped: string; similarity: number; topic: string | null }>;
  };
  lessons: {
    total: number;
    kept: number;
    droppedExact: number;
  };
}

function deduplicateQuestions(
  questions: NormalizedQuestion[],
  nearThreshold = 0.80,
): { kept: NormalizedQuestion[]; report: DedupReport["questions"] } {
  // 1. Exact dedup by stemHash — keep first occurrence
  const seenHashes = new Map<string, NormalizedQuestion>();
  const exactDropped: NormalizedQuestion[] = [];

  for (const q of questions) {
    if (seenHashes.has(q.stemHash)) {
      exactDropped.push(q);
    } else {
      seenHashes.set(q.stemHash, q);
    }
  }

  const afterExact = [...seenHashes.values()];

  // 2. Near-duplicate detection within same topicSlug using Jaccard similarity
  // Group by topic to limit O(n²) comparisons
  const byTopic = new Map<string, NormalizedQuestion[]>();
  for (const q of afterExact) {
    const key = q.topic ?? "__no-topic__";
    const group = byTopic.get(key) ?? [];
    group.push(q);
    byTopic.set(key, group);
  }

  const nearDuplicates: DedupReport["questions"]["nearDuplicates"] = [];
  const droppedNearIds = new Set<string>();

  for (const group of byTopic.values()) {
    if (group.length < 2) continue;

    const tokenSets = group.map((q) => stemTokens(q.stem));

    for (let i = 0; i < group.length; i++) {
      if (droppedNearIds.has(group[i].stemHash)) continue;
      for (let j = i + 1; j < group.length; j++) {
        if (droppedNearIds.has(group[j].stemHash)) continue;
        const sim = jaccardSimilarity(tokenSets[i], tokenSets[j]);
        if (sim >= nearThreshold) {
          // Drop j (keep i — first encountered, higher quality assumed)
          droppedNearIds.add(group[j].stemHash);
          nearDuplicates.push({
            kept: group[i].stemHash,
            dropped: group[j].stemHash,
            similarity: Math.round(sim * 1000) / 1000,
            topic: group[i].topic,
          });
        }
      }
    }
  }

  const kept = afterExact.filter((q) => !droppedNearIds.has(q.stemHash));

  return {
    kept,
    report: {
      total: questions.length,
      kept: kept.length,
      droppedExact: exactDropped.length,
      droppedNear: droppedNearIds.size,
      nearDuplicates,
    },
  };
}

function deduplicateLessons(
  lessons: NormalizedLesson[],
): { kept: NormalizedLesson[]; report: DedupReport["lessons"] } {
  // Exact dedup by (pathwayId, slug, locale)
  const seen = new Set<string>();
  const kept: NormalizedLesson[] = [];
  let droppedExact = 0;

  for (const l of lessons) {
    const key = `${l.pathwayId}::${l.slug}::${l.locale}`;
    if (seen.has(key)) {
      droppedExact++;
    } else {
      seen.add(key);
      kept.push(l);
    }
  }

  return {
    kept,
    report: { total: lessons.length, kept: kept.length, droppedExact },
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
        status: "published",
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
        countryCode: null, // NP = both US + CA
        regionScope: "BOTH",
        languageCode: "en",
        careerType: "nursing",
        isAdaptiveEligible: true,
        isMockExamEligible: true,
        isFlashcardSource: false,
        isStudyGuideLinked: false,
        isTutorReady: false,
        isScenario: false,
        publishedAt: new Date(),
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
            countryCode: lesson.countryCode,
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

  const cleanMode = argv.includes("--clean");
  const dryRun = cleanMode || !argv.includes("--apply");
  const nearThreshold = parseFloat(get("near-threshold") ?? "0.80");
  const dirArg = get("dir");
  const qbankArg = get("qbank");
  const lessonsArg = get("lessons");
  const examArg = get("exam") ?? DEFAULT_EXAM;
  const pathwayArg = get("pathway") ?? DEFAULT_PATHWAY;

  console.error(`
NP Phase2 Batch Import
  mode    : ${cleanMode ? "CLEAN (normalize+deduplicate, output JSON)" : dryRun ? "DRY-RUN" : "APPLY"}
  exam    : ${examArg}
  pathway : ${pathwayArg}
  dir     : ${dirArg ?? "(not set)"}
  qbank   : ${qbankArg ?? "(not set)"}
  lessons : ${lessonsArg ?? "(not set)"}
  near-threshold : ${nearThreshold}
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

  // ── Load and normalize questions ────────────────────────────────────────────

  let allQuestions: NormalizedQuestion[] = [];

  for (const filePath of qbankFiles) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const batchId: string = raw.batchId ?? path.basename(filePath, ".json");
    const rawQuestions: RawQuestion[] = raw.questions ?? [];

    console.error(`\n[qbank] ${path.basename(filePath)}: ${rawQuestions.length} questions (batchId=${batchId})`);

    const normalized = rawQuestions.map((q) => normalizeQuestion(q, examArg, batchId));
    allQuestions = allQuestions.concat(normalized);
  }

  // ── Deduplicate questions ───────────────────────────────────────────────────

  const qDedup = deduplicateQuestions(allQuestions, nearThreshold);
  const dedupedQuestions = qDedup.kept;

  console.error(
    `\n[dedup:questions] total=${qDedup.report.total} kept=${qDedup.report.kept}` +
    ` droppedExact=${qDedup.report.droppedExact} droppedNear=${qDedup.report.droppedNear}`,
  );
  if (qDedup.report.nearDuplicates.length > 0) {
    for (const nd of qDedup.report.nearDuplicates) {
      console.error(`  [near-dup] topic=${nd.topic} sim=${nd.similarity} kept=${nd.kept} dropped=${nd.dropped}`);
    }
  }

  // ── Load and normalize lessons ──────────────────────────────────────────────

  let allLessons: NormalizedLesson[] = [];
  let sortOrderBase = 1000;

  for (const filePath of lessonFiles) {
    const raw = JSON.parse(fs.readFileSync(filePath, "utf8"));
    const batchId: string = raw.batchId ?? path.basename(filePath, ".json");

    // Support both batch01 (root.lessons[]) and batch02 (root.topics[].lessons[]) shapes
    let rawLessons: RawLesson[] = [];
    if (Array.isArray(raw.lessons)) {
      rawLessons = raw.lessons as RawLesson[];
    } else if (Array.isArray(raw.topics)) {
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

  // ── Deduplicate lessons ─────────────────────────────────────────────────────

  const lDedup = deduplicateLessons(allLessons);
  const dedupedLessons = lDedup.kept;

  console.error(
    `\n[dedup:lessons] total=${lDedup.report.total} kept=${lDedup.report.kept}` +
    ` droppedExact=${lDedup.report.droppedExact}`,
  );

  // ── Clean mode: output normalized + deduplicated JSON, no DB writes ─────────

  if (cleanMode) {
    const cleanOutput = {
      generatedDate: new Date().toISOString().slice(0, 10),
      exam: examArg,
      pathway: pathwayArg,
      deduplication: {
        questions: qDedup.report,
        lessons: lDedup.report,
      },
      questions: dedupedQuestions.map((q) => ({
        id: q.id,
        topicSlug: q.topic,
        bodySystem: q.bodySystem,
        difficulty: q.difficulty,
        difficultyLabel: q.difficultyLabel,
        cognitiveLevel: q.cognitiveLevel,
        tags: q.tags,
        stem: q.stem,
        options: q.options,
        correctAnswer: q.correctAnswer,
        rationale: q.rationale,
        incorrectAnswerRationale: q.incorrectAnswerRationale,
        nclexClientNeedsCategory: q.nclexClientNeedsCategory,
        stemHash: q.stemHash,
        tier: q.tier,
        exam: q.exam,
        questionType: q.questionType,
        status: q.status,
      })),
      lessons: dedupedLessons.map((l) => ({
        pathwayId: l.pathwayId,
        slug: l.slug,
        topicSlug: l.topicSlug,
        bodySystem: l.bodySystem,
        title: l.title,
        topic: l.topic,
        seoTitle: l.seoTitle,
        seoDescription: l.seoDescription,
        locale: l.locale,
        status: l.status,
        sortOrder: l.sortOrder,
        tierCode: l.tierCode,
        countryCode: l.countryCode,
        sections: l.sections,
      })),
    };

    console.log(JSON.stringify(cleanOutput, null, 2));
    return;
  }

  // ── DB import (dry-run or apply) ────────────────────────────────────────────

  const report: Record<string, unknown> = {
    dryRun,
    exam: examArg,
    pathway: pathwayArg,
    qbankFiles: qbankFiles.map((f) => path.basename(f)),
    lessonFiles: lessonFiles.map((f) => path.basename(f)),
    deduplication: {
      questions: qDedup.report,
      lessons: lDedup.report,
    },
    questions: { total: 0, inserted: 0, skipped: 0 },
    lessons: { total: 0, inserted: 0, skipped: 0 },
  };

  if (dedupedQuestions.length > 0) {
    const q = report.questions as { total: number; inserted: number; skipped: number };
    q.total = dedupedQuestions.length;
    const result = await upsertQuestionBatch(dedupedQuestions, dryRun);
    q.inserted = result.inserted;
    q.skipped = result.skipped;
    console.error(`\n[questions] total=${q.total} inserted=${q.inserted} skipped=${q.skipped}`);
  }

  if (dedupedLessons.length > 0) {
    const l = report.lessons as { total: number; inserted: number; skipped: number };
    l.total = dedupedLessons.length;
    const result = await upsertLessonBatch(dedupedLessons, dryRun);
    l.inserted = result.inserted;
    l.skipped = result.skipped;
    console.error(`\n[lessons] total=${l.total} inserted=${l.inserted} skipped=${l.skipped}`);
  }

  console.log(JSON.stringify(report, null, 2));
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
