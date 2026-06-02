import fs from "node:fs/promises";
import path from "node:path";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { cacheSet } from "@/lib/server/content-cache";
import {
  buildPracticeTestAvailabilitySnapshot,
  PRACTICE_TEST_GENERATED_CACHE_TTL_SECONDS,
  practiceTestPreGeneratedLocalPath,
  type PracticeTestAvailabilityKeyInput,
  type PracticeTestCachedQuestion,
} from "@/lib/practice-tests/practice-test-availability";

const repoRoot = process.cwd();
const outputDir = path.join(repoRoot, "data", "practice-test-bank");
const reportPath = path.join(repoRoot, "reports", "practice-test-availability-pregeneration.json");

const pathwayGroups: Record<string, string[]> = {
  RN: ["us-rn-nclex-rn", "ca-rn-nclex-rn"],
  RPN: ["ca-rpn-rex-pn"],
  PN: ["us-lpn-nclex-pn"],
  NP: ["us-np-fnp", "ca-np-cnple", "us-np-agpcnp", "us-np-pmhnp", "us-np-whnp", "us-np-pnp-pc"],
};

const counts = [50, 100, 150];

if (process.argv.includes("--help")) {
  console.log("Generate RN/RPN/PN/NP pre-generated practice-test bank snapshots.");
  console.log("Usage: npm run practice-tests:pregenerate-bank");
  process.exit(0);
}

function stableSortKey(seed: string, id: string) {
  let h = 2166136261;
  const s = `${seed}:${id}`;
  for (let i = 0; i < s.length; i += 1) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

async function uploadToSpaces(relativeKey: string, json: string) {
  const required = ["SPACES_ENDPOINT", "SPACES_BUCKET", "SPACES_KEY", "SPACES_SECRET"];
  if (!required.every((key) => process.env[key]?.trim())) {
    return { ok: false, skipped: true, reason: "spaces_not_configured" };
  }
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
    Body: Buffer.from(json),
    ContentType: "application/json; charset=utf-8",
    CacheControl: "private, max-age=86400",
  }));
  return { ok: true, skipped: false, key: `${prefix}/${relativeKey}` };
}

async function loadPublishedQuestions(pathwayId: string, take: number, seed: string): Promise<PracticeTestCachedQuestion[]> {
  const rows = await prisma.examQuestion.findMany({
    where: {
      isMockExamEligible: true,
      studyLinkPathwayId: pathwayId,
      OR: [{ status: { in: ["published", "PUBLISHED", "active", "ACTIVE"] } }, { publishedAt: { not: null } }],
      stem: { not: "" },
      rationale: { not: null },
      correctAnswer: { not: Prisma.DbNull },
    },
    select: {
      id: true,
      correctAnswer: true,
      rationale: true,
      correctAnswerExplanation: true,
      incorrectAnswerRationale: true,
      distractorRationales: true,
      clinicalPearl: true,
      examStrategy: true,
      keyTakeaway: true,
      topic: true,
      subtopic: true,
      difficulty: true,
    },
    take: Math.max(take * 4, take),
  });
  return rows
    .sort((a, b) => stableSortKey(seed, a.id) - stableSortKey(seed, b.id))
    .slice(0, take) as PracticeTestCachedQuestion[];
}

const results = [];

async function main() {
  if (!process.env.DATABASE_URL?.trim()) {
    results.push({ status: "blocked_missing_database_url" });
    await fs.mkdir(path.dirname(reportPath), { recursive: true });
    await fs.writeFile(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`, "utf8");
    throw new Error("DATABASE_URL is required to pre-generate practice-test bank snapshots.");
  }

  await fs.mkdir(outputDir, { recursive: true });

  for (const [group, pathwayIds] of Object.entries(pathwayGroups)) {
    for (const pathwayId of pathwayIds) {
      for (const questionCount of counts) {
        const keyInput: PracticeTestAvailabilityKeyInput = {
          pathwayId,
          categories: [],
          difficultyMin: null,
          difficultyMax: null,
          questionCount,
          selectionMode: "random",
        };
        const questions = await loadPublishedQuestions(pathwayId, questionCount, `${group}:${pathwayId}:${questionCount}`);
        if (questions.length < questionCount) {
          results.push({ group, pathwayId, questionCount, status: "skipped_insufficient_questions", available: questions.length });
          continue;
        }
        const snapshot = buildPracticeTestAvailabilitySnapshot({
          source: "pre_generated",
          keyInput,
          config: {
            questionCount,
            topicNames: [],
            difficultyMin: null,
            difficultyMax: null,
            selectionMode: "random",
            pathwayId,
            timedMode: true,
            timeLimitSec: Math.min(14_400, Math.max(300, questionCount * 90)),
            linearDeliveryMode: "exam",
            linearRationaleVisibility: "end_of_exam",
          },
          questionIds: questions.map((q) => q.id),
          questions,
          title: `${group} ${questionCount}-question practice exam`,
        });
        const json = `${JSON.stringify(snapshot, null, 2)}\n`;
        const filePath = practiceTestPreGeneratedLocalPath(keyInput);
        await fs.writeFile(filePath, json, "utf8");
        await cacheSet(snapshot.cacheKey, snapshot, PRACTICE_TEST_GENERATED_CACHE_TTL_SECONDS);
        const upload = await uploadToSpaces(`pregenerated/${path.basename(filePath)}`, json).catch((error) => ({
          ok: false,
          skipped: false,
          reason: error instanceof Error ? error.message : String(error),
        }));
        results.push({
          group,
          pathwayId,
          questionCount,
          status: "stored",
          localPath: path.relative(repoRoot, filePath),
          cacheKey: snapshot.cacheKey,
          spaces: upload,
        });
        console.log(`[practice-test-bank] stored ${group} ${pathwayId} ${questionCount}q -> ${path.relative(repoRoot, filePath)}`);
      }
    }
  }

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2)}\n`, "utf8");
  console.log(`[practice-test-bank] report=${path.relative(repoRoot, reportPath)}`);
}

try {
  await main();
} catch (error) {
  console.error(`[practice-test-bank] ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 1;
} finally {
  await prisma.$disconnect();
}
