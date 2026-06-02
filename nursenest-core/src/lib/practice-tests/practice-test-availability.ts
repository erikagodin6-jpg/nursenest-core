import "server-only";

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { cacheGet, cacheSet } from "@/lib/server/content-cache";
import type { PracticeTestConfigJson } from "@/lib/practice-tests/types";
import type { LinearPoolSelectionMode } from "@/lib/practice-tests/pick-question-ids";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const PRACTICE_TEST_GENERATED_CACHE_TTL_SECONDS = 24 * 60 * 60;

export type PracticeTestAvailabilityKeyInput = {
  pathwayId: string | null;
  categories: string[];
  difficultyMin: number | null;
  difficultyMax: number | null;
  questionCount: number;
  selectionMode?: string;
};

export type PracticeTestCachedQuestion = {
  id: string;
  correctAnswer: unknown;
  rationale: string | null;
  correctAnswerExplanation?: string | null;
  incorrectAnswerRationale?: unknown;
  distractorRationales?: unknown;
  clinicalPearl?: string | null;
  examStrategy?: string | null;
  keyTakeaway?: string | null;
  topic?: string | null;
  subtopic?: string | null;
  difficulty?: number | null;
};

export type PracticeTestAvailabilitySnapshot = {
  version: 1;
  source: "generated" | "pre_generated";
  cacheKey: string;
  createdAt: string;
  expiresAt?: string;
  metadata: {
    pathwayId: string | null;
    categories: string[];
    difficultyMin: number | null;
    difficultyMax: number | null;
    questionCount: number;
    selectionMode: string;
    title?: string | null;
  };
  config: PracticeTestConfigJson | Record<string, unknown>;
  questionIds: string[];
  answerKey: Record<string, unknown>;
  rationales: Record<string, unknown>;
  questions: PracticeTestCachedQuestion[];
};

function repoRoot() {
  return process.cwd();
}

function normalizeCategories(categories: string[]) {
  return [...new Set(categories.map((c) => c.trim()).filter(Boolean))]
    .sort((a, b) => a.localeCompare(b));
}

function hashKey(payload: unknown) {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex").slice(0, 24);
}

export function practiceTestAvailabilityKey(input: PracticeTestAvailabilityKeyInput) {
  const normalized = {
    pathwayId: input.pathwayId?.trim() || "_",
    categories: normalizeCategories(input.categories),
    difficultyMin: input.difficultyMin ?? null,
    difficultyMax: input.difficultyMax ?? null,
    questionCount: Math.max(1, Math.floor(input.questionCount)),
    selectionMode: input.selectionMode ?? "random",
  };
  return `practice:test:generated:v1:${hashKey(normalized)}`;
}

export function isSharedPracticeTestAvailabilityMode(selectionMode: LinearPoolSelectionMode) {
  return selectionMode === "random" || selectionMode === "targeted" || selectionMode === "unseen";
}

function localGeneratedPath(cacheKey: string) {
  return path.join(repoRoot(), "data", "practice-test-cache", `${cacheKey.replace(/[^a-zA-Z0-9_.:-]/g, "_")}.json`);
}

function localPreGeneratedPath(key: PracticeTestAvailabilityKeyInput) {
  const payload = {
    pathwayId: key.pathwayId?.trim() || "_",
    categories: normalizeCategories(key.categories),
    difficultyMin: key.difficultyMin ?? null,
    difficultyMax: key.difficultyMax ?? null,
    questionCount: Math.max(1, Math.floor(key.questionCount)),
  };
  return path.join(repoRoot(), "data", "practice-test-bank", `${hashKey(payload)}.json`);
}

function localPreGeneratedRelaxedPath(key: PracticeTestAvailabilityKeyInput) {
  const payload = {
    pathwayId: key.pathwayId?.trim() || "_",
    categories: [],
    difficultyMin: null,
    difficultyMax: null,
    questionCount: Math.max(1, Math.floor(key.questionCount)),
  };
  return path.join(repoRoot(), "data", "practice-test-bank", `${hashKey(payload)}.json`);
}

export function practiceTestPreGeneratedLocalPath(input: PracticeTestAvailabilityKeyInput) {
  return localPreGeneratedPath(input);
}

async function readJsonFile<T>(filePath: string): Promise<T | null> {
  try {
    return JSON.parse(await readFile(filePath, "utf8")) as T;
  } catch {
    return null;
  }
}

async function writeJsonFile(filePath: string, value: unknown) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

export async function savePracticeTestGeneratedSnapshot(snapshot: PracticeTestAvailabilitySnapshot) {
  await Promise.allSettled([
    cacheSet(snapshot.cacheKey, snapshot, PRACTICE_TEST_GENERATED_CACHE_TTL_SECONDS),
    writeJsonFile(localGeneratedPath(snapshot.cacheKey), snapshot),
    uploadPracticeTestSnapshotToSpaces(snapshot, `generated/${snapshot.cacheKey}.json`),
  ]);
}

export async function readPracticeTestGeneratedSnapshot(
  input: PracticeTestAvailabilityKeyInput,
): Promise<PracticeTestAvailabilitySnapshot | null> {
  const cacheKey = practiceTestAvailabilityKey(input);
  const cached = await cacheGet<PracticeTestAvailabilitySnapshot>(cacheKey);
  if (cached?.questionIds?.length) return cached;

  const local = await readJsonFile<PracticeTestAvailabilitySnapshot>(localGeneratedPath(cacheKey));
  if (!local?.questionIds?.length) return null;

  if (local.expiresAt && Date.parse(local.expiresAt) < Date.now()) return null;
  return local;
}

export async function readPracticeTestPreGeneratedSnapshot(
  input: PracticeTestAvailabilityKeyInput,
): Promise<PracticeTestAvailabilitySnapshot | null> {
  const exact = await readJsonFile<PracticeTestAvailabilitySnapshot>(localPreGeneratedPath(input));
  if (exact?.questionIds?.length) return exact;
  const relaxed = await readJsonFile<PracticeTestAvailabilitySnapshot>(localPreGeneratedRelaxedPath(input));
  if (relaxed?.questionIds?.length) return relaxed;
  return null;
}

export function buildPracticeTestAvailabilitySnapshot(args: {
  source: "generated" | "pre_generated";
  keyInput: PracticeTestAvailabilityKeyInput;
  config: PracticeTestConfigJson | Record<string, unknown>;
  questionIds: string[];
  questions: PracticeTestCachedQuestion[];
  title?: string | null;
}): PracticeTestAvailabilitySnapshot {
  const cacheKey = practiceTestAvailabilityKey(args.keyInput);
  const answerKey: Record<string, unknown> = {};
  const rationales: Record<string, unknown> = {};
  for (const q of args.questions) {
    answerKey[q.id] = q.correctAnswer ?? null;
    rationales[q.id] = {
      rationale: q.rationale ?? null,
      correctAnswerExplanation: q.correctAnswerExplanation ?? null,
      incorrectAnswerRationale: q.incorrectAnswerRationale ?? null,
      distractorRationales: q.distractorRationales ?? null,
      clinicalPearl: q.clinicalPearl ?? null,
      examStrategy: q.examStrategy ?? null,
      keyTakeaway: q.keyTakeaway ?? null,
    };
  }
  return {
    version: 1,
    source: args.source,
    cacheKey,
    createdAt: new Date().toISOString(),
    expiresAt:
      args.source === "generated"
        ? new Date(Date.now() + PRACTICE_TEST_GENERATED_CACHE_TTL_SECONDS * 1000).toISOString()
        : undefined,
    metadata: {
      pathwayId: args.keyInput.pathwayId?.trim() || null,
      categories: normalizeCategories(args.keyInput.categories),
      difficultyMin: args.keyInput.difficultyMin ?? null,
      difficultyMax: args.keyInput.difficultyMax ?? null,
      questionCount: Math.max(1, Math.floor(args.keyInput.questionCount)),
      selectionMode: args.keyInput.selectionMode ?? "random",
      title: args.title ?? null,
    },
    config: args.config,
    questionIds: args.questionIds,
    answerKey,
    rationales,
    questions: args.questions,
  };
}

async function uploadPracticeTestSnapshotToSpaces(
  snapshot: PracticeTestAvailabilitySnapshot,
  relativeKey: string,
) {
  const required = ["SPACES_ENDPOINT", "SPACES_BUCKET", "SPACES_KEY", "SPACES_SECRET"];
  if (!required.every((key) => process.env[key]?.trim())) return;
  try {
    const { S3Client, PutObjectCommand } = await import("@aws-sdk/client-s3");
    const endpoint = process.env.SPACES_ENDPOINT!.trim();
    const bucket = process.env.SPACES_BUCKET!.trim();
    const region = process.env.SPACES_REGION?.trim() || "us-east-1";
    const prefix = (process.env.SPACES_PREFIX?.trim() || "practice-test-bank").replace(/\/$/, "");
    const client = new S3Client({
      endpoint,
      region,
      credentials: {
        accessKeyId: process.env.SPACES_KEY!.trim(),
        secretAccessKey: process.env.SPACES_SECRET!.trim(),
      },
      forcePathStyle: false,
    });
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: `${prefix}/${relativeKey.replace(/^\/+/, "")}`,
      Body: Buffer.from(JSON.stringify(snapshot)),
      ContentType: "application/json; charset=utf-8",
      CacheControl: "private, max-age=86400",
    }));
  } catch (error) {
    safeServerLog("practice_tests", "practice_test_snapshot_spaces_upload_failed", {
      cache_key: snapshot.cacheKey,
      error_message: error instanceof Error ? error.message.slice(0, 240) : String(error).slice(0, 240),
    });
  }
}
