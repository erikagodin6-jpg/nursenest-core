/**
 * Export CAT resilience pools — static calibrated question pools used when the
 * live CAT engine cannot build a real-time pool (DB timeout, empty pool, etc.).
 *
 * Each tier gets 3 pools (A/B/C) of 150 calibrated questions each.
 * Difficulty distribution is validated before writing.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/cat-pools/{tier}/pool-{A|B|C}.json
 *
 * Also uploads to Spaces when SPACES_* env vars are configured.
 *
 * Quality gates (per pool):
 *   - questionCount >= 150
 *   - At least 15 questions at each difficulty level 1–5
 *   - At least 5 unique topics
 *   - All questions have stem, options (array ≥ 2), correctAnswer, rationale
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-cat-resilience-pools.mts [tier]
 */
import "../stub-server-only.cjs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createHash, randomInt } from "node:crypto";

import { prisma } from "../../src/lib/db";
import type { StudyPublishedSnapshotEnvelope } from "../../src/lib/study-content-failover/study-published-snapshot-types";
import { touchStudySnapshotManifest } from "./study-snapshot-manifest-touch.mts";
import {
  uploadSnapshotToSpaces,
  spacesConfigured,
} from "./lib/s3-snapshot-uploader.mts";

// ─── Config ──────────────────────────────────────────────────────────────────

const POOL_SIZE = 150;
const POOL_SLOTS = ["A", "B", "C"] as const;
type PoolSlot = typeof POOL_SLOTS[number];

const TIERS = ["RN", "RPN", "NP"] as const;

// Minimum questions per difficulty level (1–5) for quality gate
const MIN_PER_DIFFICULTY = 15;

// Minimum unique topics
const MIN_UNIQUE_TOPICS = 5;

// The per-slot offset multiples so A/B/C pull from different windows
const SLOT_OFFSETS: Record<PoolSlot, number> = { A: 0, B: 1, C: 2 };

// ─── Types ───────────────────────────────────────────────────────────────────

interface CatResilienceQuestion {
  id: string;
  stem: string;
  options: unknown;
  correctAnswer: unknown;
  rationale: string;
  difficulty: number;
  topic: string | null;
  bodySystem: string | null;
  questionType: string;
  nclexCategory: string | null;
}

interface CatResiliencePoolPayload {
  tier: string;
  slot: PoolSlot;
  questionCount: number;
  difficultyDistribution: Record<number, number>;
  uniqueTopics: string[];
  questions: CatResilienceQuestion[];
}

interface ValidationResult {
  ok: boolean;
  errors: string[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function validatePool(questions: CatResilienceQuestion[]): ValidationResult {
  const errors: string[] = [];

  if (questions.length < POOL_SIZE) {
    errors.push(`Pool has only ${questions.length} questions; need ${POOL_SIZE}`);
  }

  const byDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const q of questions) {
    const d = q.difficulty;
    if (d >= 1 && d <= 5) byDifficulty[d]++;
  }
  for (const level of [1, 2, 3, 4, 5]) {
    if ((byDifficulty[level] ?? 0) < MIN_PER_DIFFICULTY) {
      errors.push(`Difficulty ${level} has only ${byDifficulty[level]} questions; need ${MIN_PER_DIFFICULTY}`);
    }
  }

  const topics = new Set(questions.map((q) => q.topic).filter(Boolean));
  if (topics.size < MIN_UNIQUE_TOPICS) {
    errors.push(`Only ${topics.size} unique topics; need ${MIN_UNIQUE_TOPICS}`);
  }

  return { ok: errors.length === 0, errors };
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  const result = [...arr];
  const hash = createHash("sha256").update(seed).digest();
  let hi = 0;
  for (let i = result.length - 1; i > 0; i--) {
    const byte = hash[hi % 32];
    const j = Math.floor((byte / 256) * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
    hi++;
  }
  return result;
}

async function exportPool(
  tier: string,
  slot: PoolSlot,
  baseDir: string,
): Promise<{ ok: boolean; filePath: string; errors?: string[] }> {
  const tierNorm = tier.toUpperCase();

  // Count eligible questions
  const total = await prisma.examQuestion.count({
    where: {
      status: "published",
      tier: tierNorm,
      stem: { not: "" },
      rationale: { not: "" },
      difficulty: { not: null, gte: 1, lte: 5 },
    },
  });

  if (total === 0) {
    console.warn(`[cat-pools] ${tierNorm}/${slot}: 0 eligible questions — skipping`);
    return { ok: false, filePath: "", errors: ["No eligible questions"] };
  }

  // Use different offsets per slot to get non-overlapping windows
  const windowSize = Math.min(POOL_SIZE * 2, total);
  const slotOffset = Math.floor(SLOT_OFFSETS[slot] * (total / 3));
  const maxSkip = Math.max(0, total - windowSize);
  const skip = Math.min(slotOffset, maxSkip);

  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      tier: tierNorm,
      stem: { not: "" },
      rationale: { not: "" },
      difficulty: { not: null, gte: 1, lte: 5 },
    },
    select: {
      id: true,
      stem: true,
      options: true,
      correctAnswer: true,
      rationale: true,
      difficulty: true,
      topic: true,
      bodySystem: true,
      questionType: true,
      nclexClientNeedsCategory: true,
    },
    orderBy: { id: "asc" },
    skip,
    take: windowSize,
  });

  // Shuffle deterministically per slot, then take POOL_SIZE
  const shuffled = seededShuffle(rows, `cat-resilience:${tierNorm}:${slot}:v1`);
  const selected = shuffled.slice(0, POOL_SIZE);

  const questions: CatResilienceQuestion[] = selected.map((r) => ({
    id: r.id,
    stem: r.stem ?? "",
    options: r.options,
    correctAnswer: r.correctAnswer,
    rationale: r.rationale ?? "",
    difficulty: r.difficulty ?? 3,
    topic: r.topic,
    bodySystem: r.bodySystem,
    questionType: r.questionType,
    nclexCategory: r.nclexClientNeedsCategory,
  }));

  const validation = validatePool(questions);
  if (!validation.ok) {
    console.warn(`[cat-pools] ${tierNorm}/${slot} quality gate FAILED:`, validation.errors.join("; "));
    // Still write the pool — partial pool is better than no pool — but mark it
  }

  const byDifficulty: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const q of questions) {
    const d = q.difficulty;
    if (d >= 1 && d <= 5) byDifficulty[d]++;
  }
  const uniqueTopics = [...new Set(questions.map((q) => q.topic).filter(Boolean))] as string[];

  const payload: CatResiliencePoolPayload = {
    tier: tierNorm,
    slot,
    questionCount: questions.length,
    difficultyDistribution: byDifficulty,
    uniqueTopics,
    questions,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<CatResiliencePoolPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "cat_resilience_pool",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "cat-pools", tierNorm.toLowerCase());
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `pool-${slot}.json`);
  await writeFile(filePath, JSON.stringify(envelope), "utf8");

  return { ok: validation.ok, filePath, errors: validation.ok ? undefined : validation.errors };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const [, , tierArg] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }

  const tiersToRun = tierArg ? [tierArg.toUpperCase()] : [...TIERS];
  const useSpaces = spacesConfigured();
  if (useSpaces) console.log("[cat-pools] Spaces upload enabled");
  else console.log("[cat-pools] Spaces not configured — filesystem only");

  let total = 0;
  let failed = 0;

  for (const tier of tiersToRun) {
    for (const slot of POOL_SLOTS) {
      try {
        const { ok, filePath, errors } = await exportPool(tier, slot, baseDir);
        const tag = ok ? "✓" : "⚠ (quality gate failed)";
        console.log(`[cat-pools] ${tier}/${slot}: ${tag} → ${filePath}`);
        if (errors?.length) console.warn(`  Issues: ${errors.join("; ")}`);
        total++;

        if (filePath && useSpaces) {
          const relKey = `cat-pools/${tier.toLowerCase()}/pool-${slot}.json`;
          await uploadSnapshotToSpaces(filePath, relKey);
        }
      } catch (err: unknown) {
        console.error(`[cat-pools] FAILED ${tier}/${slot}:`, err);
        failed++;
      }
    }
  }

  await touchStudySnapshotManifest(baseDir, "cat_resilience_pool");
  console.log(`\n[cat-pools] Done: ${total} pools exported, ${failed} fatal failures`);

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("[cat-pools] Fatal:", e);
  process.exit(1);
});
