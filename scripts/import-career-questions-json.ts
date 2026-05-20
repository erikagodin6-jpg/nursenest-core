#!/usr/bin/env npx tsx
/**
 * Idempotent import: monolith `data/career-questions/*.json` → Prisma `exam_questions`.
 *
 * Row shape: { id?, stem, options[], correctIndex, rationale, difficulty?, category?, topic? }
 *
 * Default: dry-run (no writes). `--apply` inserts. Requires DATABASE_URL.
 *
 * Run from nursenest-core/:
 *   npm run import:career-questions -- --dry-run
 *   npm run import:career-questions -- --apply --dir=../data/career-questions
 */
import "../src/lib/db/env-bootstrap";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Prisma, PrismaClient } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PUBLISHED = "published" as const;

function monorepoRoot(): string {
  return path.resolve(__dirname, "../..");
}

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    return undefined;
  };
  const dir = path.resolve(process.cwd(), get("dir") ?? path.join(monorepoRoot(), "data", "career-questions"));
  const apply = argv.includes("--apply");
  const dryRun = argv.includes("--dry-run") || !apply;
  return { dir, apply: !dryRun };
}

function careerTypeFromFilename(file: string): string {
  const base = path.basename(file, ".json");
  const withoutBatch = base.replace(/-batch\d+$/i, "");
  const m = withoutBatch.match(/^(.+)-questions$/i);
  const raw = m ? m[1]! : withoutBatch.replace(/-questions.*$/i, "");
  return raw.replace(/-/g, "_").toLowerCase() || "allied";
}

function normalizeOptions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((o) => (typeof o === "string" ? o : JSON.stringify(o))).filter((s) => s.length > 0);
}

function rowToCreate(
  row: Record<string, unknown>,
  careerType: string,
): { ok: true; data: Prisma.ExamQuestionCreateInput } | { ok: false; reason: string } {
  const stem = typeof row.stem === "string" ? row.stem.trim() : "";
  if (!stem) return { ok: false, reason: "empty_stem" };
  const options = normalizeOptions(row.options);
  if (options.length < 2) return { ok: false, reason: "options_short" };

  const ci =
    typeof row.correctIndex === "number"
      ? row.correctIndex
      : typeof row.correctIndex === "string"
        ? parseInt(row.correctIndex, 10)
        : typeof row.correct_index === "number"
          ? row.correct_index
          : -1;
  if (ci < 0 || ci >= options.length) return { ok: false, reason: "bad_correct_index" };

  const correctAnswer = [options[ci]!];
  const rationale = typeof row.rationale === "string" ? row.rationale.trim() : "";
  const difficulty =
    typeof row.difficulty === "number"
      ? row.difficulty
      : typeof row.difficulty === "string"
        ? parseInt(row.difficulty, 10) || 3
        : 3;
  const topic = typeof row.category === "string" ? row.category.trim() : undefined;
  const subtopic = typeof row.topic === "string" ? row.topic.trim() : undefined;
  const id = typeof row.id === "string" && /^[0-9a-f-]{36}$/i.test(row.id) ? row.id : undefined;
  /** Same stem in different allied careers must not dedupe against each other. */
  const hash = stemHash(`${careerType}\n${stem}`);

  const data: Prisma.ExamQuestionCreateInput = {
    stem,
    options,
    correctAnswer,
    questionType: "multiple_choice",
    tier: "allied",
    exam: "ALLIED",
    status: DB_PUBLISHED,
    difficulty,
    rationale: rationale || undefined,
    careerType,
    regionScope: "BOTH",
    topic: topic || undefined,
    subtopic: subtopic || undefined,
    stemHash: hash,
    tags: ["career-questions-json", careerType],
  };

  if (id) Object.assign(data, { id });
  return { ok: true, data };
}

async function main() {
  const { dir, apply } = parseArgs();
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) {
    console.error(JSON.stringify({ error: "dir_not_found", dir }, null, 2));
    process.exit(1);
  }

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json")).sort();
  let totalRows = 0;
  let validationPassed = 0;
  let invalid = 0;
  let skippedInFileDuplicate = 0;
  const invalidReasons: Record<string, number> = {};
  const creates: Prisma.ExamQuestionCreateInput[] = [];
  const seenStemHashes = new Set<string>();

  for (const f of files) {
    const fp = path.join(dir, f);
    const careerType = careerTypeFromFilename(f);
    const raw = JSON.parse(fs.readFileSync(fp, "utf8")) as unknown;
    if (!Array.isArray(raw)) continue;
    for (const row of raw) {
      totalRows++;
      if (!row || typeof row !== "object") {
        invalid++;
        invalidReasons.non_object = (invalidReasons.non_object ?? 0) + 1;
        continue;
      }
      const n = rowToCreate(row as Record<string, unknown>, careerType);
      if (!n.ok) {
        invalid++;
        invalidReasons[n.reason] = (invalidReasons[n.reason] ?? 0) + 1;
        continue;
      }
      validationPassed++;
      const h = n.data.stemHash;
      if (!h || seenStemHashes.has(h)) {
        skippedInFileDuplicate++;
        continue;
      }
      seenStemHashes.add(h);
      creates.push(n.data);
    }
  }

  const uniqueRowsAfterInFileDedupe = creates.length;

  const report = {
    phase: apply ? "apply" : "dry_run",
    dir,
    filesScanned: files.length,
    totalRows,
    validationPassed,
    skippedInFileDuplicate,
    uniqueRowsAfterInFileDedupe,
    invalid,
    invalidReasons,
    wouldInsert: uniqueRowsAfterInFileDedupe,
  };

  if (!apply) {
    console.log(JSON.stringify({ ...report, message: "No DB writes. Pass --apply to insert." }, null, 2));
    return;
  }

  const prisma = new PrismaClient();
  let inserted = 0;
  let skippedDbDuplicate = 0;
  let failed = 0;

  try {
    const dedupeKey = (c: Prisma.ExamQuestionCreateInput) => String(c.stemHash ?? "");
    const hashes = [...new Set(creates.map(dedupeKey).filter(Boolean))];
    const existingHashes = new Set<string>();
    const chunk = 500;
    for (let i = 0; i < hashes.length; i += chunk) {
      const part = await prisma.examQuestion.findMany({
        where: { stemHash: { in: hashes.slice(i, i + chunk) } },
        select: { stemHash: true },
      });
      for (const p of part) {
        if (p.stemHash) existingHashes.add(p.stemHash);
      }
    }

    const ids = creates.map((c) => (c as { id?: string }).id).filter(Boolean) as string[];
    const existingIds = new Set<string>();
    for (let i = 0; i < ids.length; i += chunk) {
      const part = await prisma.examQuestion.findMany({
        where: { id: { in: ids.slice(i, i + chunk) } },
        select: { id: true },
      });
      for (const p of part) existingIds.add(p.id);
    }

    for (const data of creates) {
      const h = dedupeKey(data);
      if (existingHashes.has(h)) {
        skippedDbDuplicate++;
        continue;
      }
      const id = (data as { id?: string }).id;
      if (id && existingIds.has(id)) {
        skippedDbDuplicate++;
        continue;
      }
      try {
        await prisma.examQuestion.create({ data });
        existingHashes.add(h);
        if (id) existingIds.add(id);
        inserted++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/Unique constraint/i.test(msg)) {
          skippedDbDuplicate++;
        } else {
          failed++;
          console.error(JSON.stringify({ err: "create_failed", message: msg, stem: String(data.stem).slice(0, 80) }));
        }
      }
    }

    console.log(JSON.stringify({ ...report, inserted, skippedDbDuplicate, failed }, null, 2));
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
