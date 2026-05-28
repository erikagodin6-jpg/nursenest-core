/**
 * Export resilience question packs by tier and topic for DB failover and offline mode.
 *
 * Each pack: up to 150 published questions with full content (stem, options, answer, rationale).
 * Questions are shuffled deterministically by tier+topic key.
 *
 * Writes to:
 *   {STUDY_PUBLISHED_SNAPSHOT_DIR}/questions/{tier}/{topicSlug}.json
 *
 * Also uploads to Spaces when SPACES_* env vars are configured.
 *
 * Usage:
 *   STUDY_PUBLISHED_SNAPSHOT_DIR=/var/study-snapshots \
 *     npx tsx scripts/study-snapshots/export-question-packs.mts [tier] [topic]
 *
 *   # Export all tiers and topics:
 *   npx tsx scripts/study-snapshots/export-question-packs.mts
 *
 *   # Export single tier:
 *   npx tsx scripts/study-snapshots/export-question-packs.mts rn
 *
 *   # Export single tier+topic:
 *   npx tsx scripts/study-snapshots/export-question-packs.mts rn cardiovascular
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

const PACK_SIZE = 150;

const TIERS = ["RN", "RPN", "NP"] as const;

/** Core topics exported for every tier. Topic names must match DB `topic` column. */
const CORE_TOPICS = [
  "cardiovascular",
  "respiratory",
  "pharmacology",
  "mental-health",
  "maternal",
  "pediatrics",
  "leadership",
  "clinical-skills",
  "renal",
  "neurological",
  "gastrointestinal",
  "endocrine",
  "musculoskeletal",
  "infection-control",
  "perioperative",
];

// ─── Types ───────────────────────────────────────────────────────────────────

interface ResilienceQuestion {
  id: string;
  stem: string;
  options: unknown;
  correctAnswer: unknown;
  rationale: string;
  difficulty: number | null;
  topic: string | null;
  bodySystem: string | null;
  questionType: string;
}

interface QuestionPackPayload {
  tier: string;
  topic: string;
  questionCount: number;
  questions: ResilienceQuestion[];
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function topicToSlug(topic: string): string {
  return topic.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 64);
}

function seededShuffle<T>(arr: T[], seed: string): T[] {
  // Deterministic Fisher-Yates using seed-derived offsets
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

async function exportPack(
  tier: string,
  topic: string,
  baseDir: string,
): Promise<{ ok: boolean; filePath: string; count: number }> {
  const tierNorm = tier.toUpperCase();
  const topicSlug = topicToSlug(topic);

  // Count first to choose a random window (avoids RANDOM() full-table sort)
  const total = await prisma.examQuestion.count({
    where: {
      status: "published",
      tier: tierNorm,
      topic: { contains: topic, mode: "insensitive" },
      stem: { not: "" },
      rationale: { not: "" },
    },
  });

  const takeN = Math.min(PACK_SIZE, total);
  const skip = total > takeN ? randomInt(0, total - takeN + 1) : 0;

  const rows = await prisma.examQuestion.findMany({
    where: {
      status: "published",
      tier: tierNorm,
      topic: { contains: topic, mode: "insensitive" },
      stem: { not: "" },
      rationale: { not: "" },
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
    },
    orderBy: { id: "asc" },
    skip,
    take: takeN,
  });

  const shuffled = seededShuffle(rows, `${tierNorm}:${topicSlug}:v1`);
  const questions: ResilienceQuestion[] = shuffled.map((r) => ({
    id: r.id,
    stem: r.stem ?? "",
    options: r.options,
    correctAnswer: r.correctAnswer,
    rationale: r.rationale ?? "",
    difficulty: r.difficulty,
    topic: r.topic,
    bodySystem: r.bodySystem,
    questionType: r.questionType,
  }));

  const payload: QuestionPackPayload = {
    tier: tierNorm,
    topic,
    questionCount: questions.length,
    questions,
  };

  const version = process.env.STUDY_SNAPSHOT_VERSION?.trim() || `git-${Date.now()}`;
  const envelope: StudyPublishedSnapshotEnvelope<QuestionPackPayload> = {
    schema: "nursenest.study_snapshot.v1",
    surface: "question_pack",
    version,
    capturedAt: new Date().toISOString(),
    payload,
  };

  const relDir = path.join(baseDir, "questions", tierNorm.toLowerCase());
  await mkdir(relDir, { recursive: true });
  const filePath = path.join(relDir, `${topicSlug}.json`);
  await writeFile(filePath, JSON.stringify(envelope), "utf8");

  return { ok: true, filePath, count: questions.length };
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const [, , tierArg, topicArg] = process.argv;
  const baseDir = process.env.STUDY_PUBLISHED_SNAPSHOT_DIR?.trim();
  if (!baseDir) {
    console.error("STUDY_PUBLISHED_SNAPSHOT_DIR is required");
    process.exit(1);
  }

  const tiersToRun = tierArg ? [tierArg.toUpperCase()] : [...TIERS];
  const topicsToRun = topicArg ? [topicArg] : [...CORE_TOPICS];

  const useSpaces = spacesConfigured();
  if (useSpaces) console.log("[question-packs] Spaces upload enabled");
  else console.log("[question-packs] Spaces not configured — filesystem only");

  let totalFiles = 0;
  let totalFailed = 0;

  for (const tier of tiersToRun) {
    for (const topic of topicsToRun) {
      try {
        const { filePath, count } = await exportPack(tier, topic, baseDir);
        console.log(`[question-packs] ${tier}/${topic}: ${count} questions → ${filePath}`);
        totalFiles++;

        if (useSpaces && count > 0) {
          const relKey = `questions/${tier.toLowerCase()}/${topicToSlug(topic)}.json`;
          await uploadSnapshotToSpaces(filePath, relKey);
        }
      } catch (err: unknown) {
        console.error(`[question-packs] FAILED ${tier}/${topic}:`, err);
        totalFailed++;
      }
    }
  }

  await touchStudySnapshotManifest(baseDir, "question_pack");
  console.log(`\n[question-packs] Done: ${totalFiles} exported, ${totalFailed} failed`);

  if (totalFailed > 0) process.exit(1);
}

main().catch((e) => {
  console.error("[question-packs] Fatal:", e);
  process.exit(1);
});
