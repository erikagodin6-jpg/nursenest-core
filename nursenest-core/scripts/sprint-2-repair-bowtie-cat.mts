#!/usr/bin/env tsx
/**
 * Sprint 2 — Repair 392 bowtie questions that fail CAT validation.
 *
 * Root causes (from inventory audit):
 *  A) options missing `format: "bowtie"` key — payload is valid JSON but the
 *     bowtie hint check in validateBowtieQuestionPayload fails.
 *  B) options.bank is absent, malformed, or has < 3 items.
 *  C) correctAnswer.correctMapping is missing condition/intervention/monitoring keys.
 *  D) options stored as plain array instead of the structured bowtie object.
 *
 * Repair strategy (in order):
 *  1. Load question from DB.
 *  2. Run tryNormalizeBowtiePayload — if it succeeds, the payload is already valid;
 *     only the `format` hint was missing → inject it.
 *  3. If normalization fails, attempt structural reconstruction from the raw data.
 *  4. If reconstruction is impossible, flag as NEEDS_MANUAL_REVIEW and skip.
 *  5. Re-run validateBowtieQuestionPayload — only write if validation passes.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/sprint-2-repair-bowtie-cat.mts            # dry-run
 *   npx tsx scripts/sprint-2-repair-bowtie-cat.mts --apply     # write
 *   npx tsx scripts/sprint-2-repair-bowtie-cat.mts --apply --id-file=/tmp/invalid-bowtie-ids.json
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient } from "@prisma/client";

import {
  tryNormalizeBowtiePayload,
  parseBowtieCorrectMapping,
  BOWTIE_SLOT_KEYS,
  type BowtieBankItem,
} from "../src/lib/questions/bowtie-adapter";
import { validateBowtieQuestionPayload } from "../src/lib/questions/bowtie-question-schema";

// ── Config ────────────────────────────────────────────────────────────────────

const APPLY    = process.argv.includes("--apply");
const DRY      = !APPLY;
const BATCH    = 100;

const ID_FILE = (() => {
  const i = process.argv.indexOf("--id-file");
  return i >= 0 ? process.argv[i + 1] : null;
})();

const REPORT_DIR  = resolve(process.cwd(), "reports/sprint/nclex-rn-launch");
const REPORT_PATH = resolve(REPORT_DIR, "sprint-2-bowtie-repair.json");

// ── Env ──────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production.local"]) {
    const f = resolve(process.cwd(), name);
    if (!existsSync(f)) continue;
    const p = parseDotenv(readFileSync(f, "utf8"));
    for (const [k, v] of Object.entries(p)) if (process.env[k] === undefined) process.env[k] = v;
  }
}

// ── Repair logic ─────────────────────────────────────────────────────────────

type RepairOutcome =
  | { ok: true;  repaired: Record<string, unknown>; method: string }
  | { ok: false; reason: string };

function injectFormatHint(opts: Record<string, unknown>): Record<string, unknown> {
  // Deep-clone to avoid mutating the live object
  const out = JSON.parse(JSON.stringify(opts)) as Record<string, unknown>;
  out.format = "bowtie";
  if (out.bowtie && typeof out.bowtie === "object" && !Array.isArray(out.bowtie)) {
    (out.bowtie as Record<string, unknown>).format = "bowtie";
  }
  return out;
}

function tryReconstructBankFromArray(raw: unknown[]): BowtieBankItem[] | null {
  const bank: BowtieBankItem[] = [];
  for (let i = 0; i < raw.length; i++) {
    const item = raw[i];
    if (typeof item === "string") {
      bank.push({ id: `opt_${i}`, label: item.trim() });
      continue;
    }
    if (item && typeof item === "object") {
      const o = item as Record<string, unknown>;
      const id    = String(o.id ?? o.key ?? `opt_${i}`).trim();
      const label = String(o.text ?? o.label ?? o.value ?? o.option ?? "").trim();
      if (!label) return null;
      bank.push({ id, label });
      continue;
    }
    return null;
  }
  return bank.length >= 3 ? bank : null;
}

function repairBowtieOptions(
  questionType: string,
  stem: string,
  options: unknown,
  correctAnswer: unknown,
): RepairOutcome {
  // Attempt 1: just inject format hint if payload is otherwise valid
  if (options && typeof options === "object" && !Array.isArray(options)) {
    const withHint = injectFormatHint(options as Record<string, unknown>);
    const norm = tryNormalizeBowtiePayload(questionType, stem, withHint);
    if (norm) {
      const validation = validateBowtieQuestionPayload({
        questionType,
        stem,
        options: withHint,
        correctAnswer,
        publishMode: true,
        requireRationale: false,
      });
      if (validation.ok) return { ok: true, repaired: withHint, method: "format_hint_inject" };
    }
  }

  // Attempt 2: options is a plain array → wrap as bowtie structure
  if (Array.isArray(options)) {
    const bank = tryReconstructBankFromArray(options as unknown[]);
    if (bank) {
      const wrapped: Record<string, unknown> = {
        format: "bowtie",
        bank,
        scenario: stem.slice(0, 500),
        slotLabels: {
          condition:    "2 conditions most likely",
          intervention: "1 intervention to take",
          monitoring:   "1 monitoring parameter",
        },
      };
      const norm = tryNormalizeBowtiePayload(questionType, stem, wrapped);
      if (norm) {
        const validation = validateBowtieQuestionPayload({
          questionType,
          stem,
          options: wrapped,
          correctAnswer,
          publishMode: true,
          requireRationale: false,
        });
        if (validation.ok) return { ok: true, repaired: wrapped, method: "wrap_array_as_bowtie" };
      }
    }
  }

  // Attempt 3: options is nested under a different key
  if (options && typeof options === "object" && !Array.isArray(options)) {
    const o = options as Record<string, unknown>;
    // Try top-level bank array even without format hint
    const bankRaw = o.bank ?? o.options ?? o.items ?? o.choices;
    if (Array.isArray(bankRaw)) {
      const bank = tryReconstructBankFromArray(bankRaw as unknown[]);
      if (bank) {
        const rebuilt: Record<string, unknown> = {
          format: "bowtie",
          bank,
          scenario: (typeof o.scenario === "string" ? o.scenario : null) ?? stem.slice(0, 500),
          slotLabels: (o.slotLabels as Record<string, string>) ?? {
            condition:    "2 conditions most likely",
            intervention: "1 intervention to take",
            monitoring:   "1 monitoring parameter",
          },
        };
        const norm = tryNormalizeBowtiePayload(questionType, stem, rebuilt);
        if (norm) {
          const validation = validateBowtieQuestionPayload({
            questionType, stem, options: rebuilt, correctAnswer,
            publishMode: true, requireRationale: false,
          });
          if (validation.ok) return { ok: true, repaired: rebuilt, method: "rebuild_from_bank_key" };
        }
      }
    }
  }

  return { ok: false, reason: "Could not reconstruct valid bowtie payload — needs manual review" };
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const dbUrl = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl.includes("PASSWORD") || dbUrl.includes("USER:PASSWORD")) {
    console.error("DATABASE_URL is not configured.");
    process.exit(1);
  }

  const prisma = new PrismaClient({ log: ["error"] });

  // Load IDs: prefer explicit --id-file, else query DB directly
  let targetIds: string[];
  if (ID_FILE && existsSync(ID_FILE)) {
    targetIds = JSON.parse(readFileSync(ID_FILE, "utf8")) as string[];
    console.log(`Loaded ${targetIds.length} IDs from ${ID_FILE}`);
  } else {
    // Identify bowtie questions that fail CAT validation
    const candidates = await prisma.examQuestion.findMany({
      where: {
        status: { in: ["published", "PUBLISHED"] },
        questionType: { contains: "BOWTIE", mode: "insensitive" },
      },
      select: { id: true, questionType: true, stem: true, options: true, correctAnswer: true, rationale: true },
    });
    // Filter those that actually fail validation
    targetIds = candidates
      .filter((q) => {
        const result = validateBowtieQuestionPayload({
          questionType: q.questionType,
          stem: q.stem,
          options: q.options,
          correctAnswer: q.correctAnswer,
          rationale: q.rationale,
          publishMode: true,
          requireRationale: false,
        });
        return !result.ok;
      })
      .map((q) => q.id);
    console.log(`Found ${targetIds.length} bowtie questions failing CAT validation`);
  }

  console.log(`\n=== Sprint 2: Bowtie CAT Repair ===`);
  console.log(`Mode: ${DRY ? "DRY RUN" : "APPLY"}`);
  console.log(`Target: ${targetIds.length} invalid bowtie questions`);
  console.log();

  const repaired: string[]  = [];
  const skipped:  string[]  = [];
  const details:  { id: string; method: string; status: "repaired" | "skipped"; reason?: string }[] = [];

  for (let i = 0; i < targetIds.length; i += BATCH) {
    const chunk = targetIds.slice(i, i + BATCH);
    const rows  = await prisma.examQuestion.findMany({
      where: { id: { in: chunk } },
      select: { id: true, questionType: true, stem: true, options: true, correctAnswer: true },
    });

    for (const q of rows) {
      const outcome = repairBowtieOptions(q.questionType, q.stem, q.options, q.correctAnswer);

      if (!outcome.ok) {
        skipped.push(q.id);
        details.push({ id: q.id, method: "none", status: "skipped", reason: outcome.reason });
        continue;
      }

      repaired.push(q.id);
      details.push({ id: q.id, method: outcome.method, status: "repaired" });

      if (!DRY) {
        await prisma.examQuestion.update({
          where: { id: q.id },
          data: { options: outcome.repaired as Record<string, unknown> },
        });
      }
    }

    process.stdout.write(`\r  Processed: ${Math.min(i + BATCH, targetIds.length)} / ${targetIds.length}`);
  }
  console.log();

  console.log(`\nResults:`);
  console.log(`  Repaired: ${repaired.length}`);
  console.log(`  Needs manual review: ${skipped.length}`);

  if (skipped.length > 0) {
    console.log(`\n⚠ The following ${skipped.length} IDs could not be auto-repaired:`);
    skipped.slice(0, 20).forEach((id) => console.log(`  ${id}`));
    if (skipped.length > 20) console.log(`  ... and ${skipped.length - 20} more`);
  }

  // Write report
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(REPORT_PATH, JSON.stringify({
    generatedAt: new Date().toISOString(),
    mode: DRY ? "dry_run" : "applied",
    totalTarget: targetIds.length,
    repaired: repaired.length,
    needsManualReview: skipped.length,
    skippedIds: skipped,
    details: details.slice(0, 200), // cap for file size
  }, null, 2));
  console.log(`\nReport: ${REPORT_PATH}`);

  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
