#!/usr/bin/env tsx
/**
 * Sprint 3 — Generate rationales for 638 NCLEX-RN questions missing them.
 *
 * Also fills:
 *   - clinicalPearl          (one-sentence clinical fact)
 *   - examStrategy           (test-taking tip)
 *   - keyTakeaway            (one-sentence exam point)
 *   - distractorRationales   (per-option explanations)
 *
 * Uses the Anthropic claude-sonnet-4-6 API (claude-sonnet-4-6) via the
 * codebase's ANTHROPIC_API_KEY / OPENROUTER_API_KEY env vars with prompt caching.
 *
 * Checkpointing: writes a local JSON checkpoint every 50 questions so partial
 * runs can resume without re-generating already-completed items.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/sprint-3-generate-missing-rationales.mts            # dry-run
 *   npx tsx scripts/sprint-3-generate-missing-rationales.mts --apply     # generate + write
 *   npx tsx scripts/sprint-3-generate-missing-rationales.mts --apply --concurrency=3
 *   npx tsx scripts/sprint-3-generate-missing-rationales.mts --apply --id-file=/tmp/missing-rationale-ids.json
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";

// ── Config ────────────────────────────────────────────────────────────────────

const APPLY       = process.argv.includes("--apply");
const DRY         = !APPLY;
const CONCURRENCY = (() => { const i = process.argv.indexOf("--concurrency"); return i >= 0 ? parseInt(process.argv[i+1]??'3',10) : 3; })();
const ID_FILE     = (() => { const i = process.argv.indexOf("--id-file"); return i >= 0 ? process.argv[i+1] : null; })();
const MAX_RETRIES = 3;
const CHECKPOINT_EVERY = 50;

const REPORT_DIR       = resolve(process.cwd(), "reports/sprint/nclex-rn-launch");
const CHECKPOINT_PATH  = resolve(REPORT_DIR, "sprint-3-checkpoint.json");
const REPORT_PATH      = resolve(REPORT_DIR, "sprint-3-rationale-generation.json");

const MODEL = "claude-sonnet-4-6";

// ── Env ──────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production.local"]) {
    const f = resolve(process.cwd(), name);
    if (!existsSync(f)) continue;
    const p = parseDotenv(readFileSync(f, "utf8"));
    for (const [k, v] of Object.entries(p)) if (process.env[k] === undefined) process.env[k] = v;
  }
}

// ── AI system prompt ──────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are a senior nursing certification item writer for NurseNest.
Your task is to write high-quality rationales and supplementary content for NCLEX-RN exam questions.

Rules:
- Output JSON ONLY. No markdown fences, no prose, no commentary.
- rationale: step-by-step (≥ 100 words). Explain: (1) why the correct answer is right, (2) the underlying clinical principle, (3) why it matters for patient safety.
- distractorRationales: an object with option text as key, concise explanation (≤ 120 words) as value. Include every WRONG option only.
- clinicalPearl: single sentence (≤ 80 words). A memorable clinical fact relevant to the question. Null if not applicable.
- examStrategy: single sentence (≤ 80 words). A test-taking tip specific to this question type/content. Null if not applicable.
- keyTakeaway: single sentence (≤ 80 words). The most important exam point. Null if not applicable.
- Never invent drug doses, lab values, or clinical thresholds outside accepted evidence.
- Write for RN-level nurses preparing for NCLEX-RN.`;

type GeneratedRationale = {
  rationale: string;
  distractorRationales: Record<string, string>;
  clinicalPearl: string | null;
  examStrategy: string | null;
  keyTakeaway: string | null;
};

type QuestionRow = {
  id: string;
  stem: string;
  options: unknown;
  correctAnswer: unknown;
  questionType: string;
  bodySystem: string | null;
  topic: string | null;
};

// ── Generation ────────────────────────────────────────────────────────────────

function buildPrompt(q: QuestionRow): string {
  const optionsList = Array.isArray(q.options)
    ? (q.options as string[]).map((o, i) => `  ${String.fromCharCode(65 + i)}. ${o}`).join("\n")
    : JSON.stringify(q.options, null, 2);

  const correct = Array.isArray(q.correctAnswer)
    ? (q.correctAnswer as string[]).join(", ")
    : String(q.correctAnswer);

  return `Question Type: ${q.questionType}
Body System: ${q.bodySystem ?? "unspecified"}
Topic: ${q.topic ?? "unspecified"}

STEM:
${q.stem}

OPTIONS:
${optionsList}

CORRECT ANSWER: ${correct}

Generate a complete rationale JSON object with these exact keys:
{
  "rationale": "...",
  "distractorRationales": { "<option_text>": "<explanation>", ... },
  "clinicalPearl": "..." or null,
  "examStrategy": "..." or null,
  "keyTakeaway": "..." or null
}`;
}

async function generateRationale(
  client: Anthropic,
  q: QuestionRow,
  retries = 0,
): Promise<GeneratedRationale | null> {
  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildPrompt(q) }],
    });

    const text = response.content
      .filter((b) => b.type === "text")
      .map((b) => (b as { type: "text"; text: string }).text)
      .join("");

    // Strip any accidental markdown fences
    const cleaned = text.replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const parsed = JSON.parse(cleaned) as GeneratedRationale;

    // Validate required fields
    if (typeof parsed.rationale !== "string" || parsed.rationale.length < 50) {
      throw new Error("Rationale too short or missing");
    }

    return parsed;
  } catch (err) {
    if (retries < MAX_RETRIES) {
      await new Promise((r) => setTimeout(r, 1000 * (retries + 1)));
      return generateRationale(client, q, retries + 1);
    }
    console.error(`  ✗ Failed after ${MAX_RETRIES} retries for ${q.id}: ${String(err).slice(0, 80)}`);
    return null;
  }
}

// Concurrent processing with a simple semaphore
async function processWithConcurrency<T, R>(
  items: T[],
  fn: (item: T) => Promise<R>,
  concurrency: number,
): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let idx = 0;

  async function worker(): Promise<void> {
    while (idx < items.length) {
      const i = idx++;
      results[i] = await fn(items[i]!);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, () => worker()));
  return results;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl.includes("PASSWORD") || dbUrl.includes("USER:PASSWORD")) {
    console.error("DATABASE_URL is not configured.");
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey && !DRY) {
    console.error("ANTHROPIC_API_KEY is not set. Needed for generation.");
    process.exit(1);
  }

  const prisma = new PrismaClient({ log: ["error"] });
  const client = apiKey ? new Anthropic({ apiKey }) : null;

  // Load checkpoint
  const checkpoint = new Set<string>(
    existsSync(CHECKPOINT_PATH)
      ? (JSON.parse(readFileSync(CHECKPOINT_PATH, "utf8")) as string[])
      : [],
  );
  if (checkpoint.size > 0) {
    console.log(`Resuming from checkpoint: ${checkpoint.size} already done`);
  }

  // Load target IDs
  let targetIds: string[];
  if (ID_FILE && existsSync(ID_FILE)) {
    targetIds = JSON.parse(readFileSync(ID_FILE, "utf8")) as string[];
  } else {
    const rows = await prisma.examQuestion.findMany({
      where: {
        status: { in: ["published", "PUBLISHED"] },
        exam: { in: ["NCLEX-RN", "NCLEX_RN"] },
        rationale: null,
      },
      select: { id: true },
    });
    targetIds = rows.map((r) => r.id);
  }

  // Filter already checkpointed
  const remaining = targetIds.filter((id) => !checkpoint.has(id));

  console.log(`\n=== Sprint 3: Generate Missing Rationales ===`);
  console.log(`Mode: ${DRY ? "DRY RUN" : "APPLY"}`);
  console.log(`Target: ${targetIds.length} total, ${remaining.length} remaining`);
  console.log(`Concurrency: ${CONCURRENCY}`);
  console.log();

  if (DRY) {
    console.log("DRY RUN — no AI calls, no DB writes.");
    console.log(`Would generate rationales for ${remaining.length} questions.`);
    await prisma.$disconnect();
    return;
  }

  // Fetch question content for remaining IDs in batches of 100
  const FETCH_BATCH = 100;
  let generated = 0;
  let failed = 0;

  mkdirSync(REPORT_DIR, { recursive: true });

  for (let i = 0; i < remaining.length; i += FETCH_BATCH) {
    const chunk = remaining.slice(i, i + FETCH_BATCH);
    const rows  = await prisma.examQuestion.findMany({
      where: { id: { in: chunk } },
      select: {
        id: true, stem: true, options: true, correctAnswer: true,
        questionType: true, bodySystem: true, topic: true,
      },
    });

    // Generate concurrently
    const results = await processWithConcurrency(rows, async (q) => {
      const gen = await generateRationale(client!, q);
      return { id: q.id, gen };
    }, CONCURRENCY);

    // Write to DB
    for (const { id, gen } of results) {
      if (!gen) {
        failed++;
        continue;
      }
      await prisma.examQuestion.update({
        where: { id },
        data: {
          rationale:            gen.rationale,
          distractorRationales: gen.distractorRationales as Record<string, string>,
          clinicalPearl:        gen.clinicalPearl ?? undefined,
          examStrategy:         gen.examStrategy  ?? undefined,
          keyTakeaway:          gen.keyTakeaway   ?? undefined,
        },
      });
      checkpoint.add(id);
      generated++;
    }

    // Checkpoint every N
    if ((i + FETCH_BATCH) % CHECKPOINT_EVERY === 0 || i + FETCH_BATCH >= remaining.length) {
      writeFileSync(CHECKPOINT_PATH, JSON.stringify([...checkpoint], null, 2));
    }

    process.stdout.write(
      `\r  Generated: ${generated} | Failed: ${failed} | Progress: ${Math.min(i + FETCH_BATCH, remaining.length)}/${remaining.length}`,
    );
  }
  console.log();

  console.log(`\n✓ Sprint 3 complete.`);
  console.log(`  Generated: ${generated}`);
  console.log(`  Failed:    ${failed}`);

  writeFileSync(REPORT_PATH, JSON.stringify({
    generatedAt:  new Date().toISOString(),
    mode:         "applied",
    totalTarget:  targetIds.length,
    skippedFromCheckpoint: targetIds.length - remaining.length,
    generated,
    failed,
    failedIds:    remaining.filter((id) => !checkpoint.has(id)),
  }, null, 2));
  console.log(`\nReport: ${REPORT_PATH}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
