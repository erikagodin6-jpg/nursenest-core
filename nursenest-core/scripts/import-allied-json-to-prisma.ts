#!/usr/bin/env npx tsx
/**
 * Idempotent import pipeline: legacy allied JSON → Prisma `exam_questions` + `Flashcard`.
 *
 * Expected JSON shapes match monolith Drizzle tables in `shared/schema.ts`:
 *   alliedQuestions, alliedFlashcards, alliedBlueprints (camelCase in TS / often snake_case in raw SQL dumps).
 *
 * Default: dry-run (no writes). Use `--apply` to insert (requires DATABASE_URL).
 *
 * Blueprint rows have **no Prisma target yet** — parsed, validated, counted, optional `--blueprints-out=` snapshot only.
 *
 * Run from nursenest-core/:
 *   npx tsx scripts/import-allied-json-to-prisma.ts \
 *     --questions=../path/allied_questions.json \
 *     --flashcards=../path/allied_flashcards.json \
 *     --blueprints=../path/allied_blueprints.json
 *
 *   npx tsx scripts/import-allied-json-to-prisma.ts --apply --questions=... --flashcards=...
 */
import "../src/lib/db/env-bootstrap";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  ContentStatus,
  CountryCode,
  ExamFamily,
  Prisma,
  TierCode,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_PUBLISHED = "published" as const;

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    if (hit) return hit.slice(pref.length);
    const idx = argv.indexOf(`--${name}`);
    if (idx >= 0 && argv[idx + 1] && !argv[idx + 1]!.startsWith("--")) return argv[idx + 1];
    return undefined;
  };
  return {
    questionsPath: get("questions"),
    flashcardsPath: get("flashcards"),
    blueprintsPath: get("blueprints"),
    blueprintsOut: get("blueprints-out"),
    apply: argv.includes("--apply"),
    flashcardCountry: (get("flashcard-country")?.toUpperCase() as CountryCode | undefined) ?? CountryCode.US,
  };
}

function readJsonArray(filePath: string | undefined, _label: string): unknown[] {
  if (!filePath?.trim()) {
    return [];
  }
  const p = path.resolve(filePath);
  if (!fs.existsSync(p)) {
    throw new Error(`Missing file (${label}): ${p}`);
  }
  const raw = fs.readFileSync(p, "utf8");
  const data = JSON.parse(raw) as unknown;
  if (!Array.isArray(data)) {
    throw new Error(`Expected top-level JSON array for ${label}, got ${typeof data}`);
  }
  return data;
}

/** Accept camelCase or snake_case keys from export. */
function pick<T = unknown>(row: Record<string, unknown>, camel: string, snake: string): T | undefined {
  if (camel in row) return row[camel] as T;
  if (snake in row) return row[snake] as T;
  return undefined;
}

function asString(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string") return v;
  return String(v);
}

function asInt(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim() !== "") return parseInt(v, 10) || fallback;
  return fallback;
}

/** Normalize options to Prisma JSON: array of option label strings (matches seed style). */
function normalizeOptions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const o of raw) {
    if (typeof o === "string") out.push(o);
    else if (o && typeof o === "object" && "text" in (o as object)) out.push(asString((o as { text: unknown }).text));
    else if (o && typeof o === "object" && "label" in (o as object)) out.push(asString((o as { label: unknown }).label));
    else out.push(JSON.stringify(o));
  }
  return out.filter((s) => s.length > 0);
}

/** Allied stores 0-based index; exam_questions uses answer array of selected option strings. */
function correctAnswerFromIndex(options: string[], correctIndex: number): string[] {
  if (options.length === 0) return [];
  const i = Math.max(0, Math.min(options.length - 1, correctIndex));
  return [options[i]!];
}

function mapAlliedQuestionType(qt: string): string {
  const t = qt.trim().toLowerCase().replace(/-/g, "_");
  if (t === "multiple_choice" || t === "multiplechoice") return "multiple_choice";
  if (t === "sata" || t === "select_all_that_apply") return "sata";
  return t || "multiple_choice";
}

function mapAlliedStatus(st: string | undefined): string {
  const s = (st ?? "").toLowerCase();
  if (s === "approved" || s === "published" || s === "active") return DB_PUBLISHED;
  if (s === "pending") return "draft";
  if (s === "archived" || s === "rejected") return "draft";
  return DB_PUBLISHED;
}

function alliedQuestionRowToExamQuestion(
  row: Record<string, unknown>,
): { ok: true; data: Prisma.ExamQuestionCreateInput } | { ok: false; reason: string } {
  const id = asString(pick(row, "id", "id"), "").trim();
  const careerType = asString(pick(row, "careerType", "career_type"), "").trim() || "allied";
  const stem = asString(pick(row, "stem", "stem"), "").trim();
  if (!stem) return { ok: false, reason: "empty_stem" };

  const options = normalizeOptions(pick(row, "options", "options"));
  const correctIdx = asInt(pick(row, "correctAnswer", "correct_answer"), 0);
  const correctAnswer = correctAnswerFromIndex(options, correctIdx);

  const rationale = asString(pick(row, "rationaleLong", "rationale_long"), "").trim();
  const questionType = mapAlliedQuestionType(asString(pick(row, "questionType", "question_type"), "multiple-choice"));
  const difficulty = asInt(pick(row, "difficulty", "difficulty"), 3);
  const cognitiveLevel = asString(pick(row, "cognitiveLevel", "cognitive_level"), "").trim() || undefined;
  const topic = asString(pick(row, "blueprintCategory", "blueprint_category"), "").trim() || undefined;
  const subtopic = asString(pick(row, "subtopic", "subtopic"), "").trim() || undefined;
  const status = mapAlliedStatus(asString(pick(row, "status", "status"), "approved"));

  const distractors = pick(row, "distractorRationales", "distractor_rationales");
  const clinicalPearls = pick(row, "clinicalPearls", "clinical_pearls");
  const learningObjective = asString(pick(row, "learningObjective", "learning_objective"), "").trim();
  const examTrap = asString(pick(row, "examTrap", "exam_trap"), "").trim();
  const safetyNote = asString(pick(row, "safetyNote", "safety_note"), "").trim();
  const examTag = asString(pick(row, "examTag", "exam_tag"), "").trim();
  const blueprintId = asString(pick(row, "blueprintId", "blueprint_id"), "").trim();
  const batchId = asString(pick(row, "batchId", "batch_id"), "").trim();

  const hash = stemHash(stem);

  const tagParts = ["allied-json-import", careerType, examTag, blueprintId || undefined, batchId || undefined].filter(
    Boolean,
  ) as string[];

  const data: Prisma.ExamQuestionCreateInput = {
    stem,
    options,
    correctAnswer,
    questionType,
    tier: "allied",
    exam: "ALLIED",
    status,
    difficulty,
    rationale: rationale || undefined,
    careerType,
    regionScope: "BOTH",
    topic: topic ?? undefined,
    subtopic: subtopic ?? undefined,
    cognitiveLevel,
    stemHash: hash,
    keyTakeaway: learningObjective || undefined,
    clinicalTrap: examTrap || undefined,
    tags: tagParts,
    distractorRationales:
      distractors === undefined || distractors === null
        ? undefined
        : (distractors as Prisma.InputJsonValue),
    clinicalPearl: undefined,
  };

  if (clinicalPearls != null) {
    try {
      data.clinicalPearl = typeof clinicalPearls === "string" ? clinicalPearls : JSON.stringify(clinicalPearls);
    } catch {
      data.clinicalPearl = String(clinicalPearls);
    }
  }
  if (safetyNote) {
    data.tags = [...(data.tags as string[]), `safety:${safetyNote.slice(0, 120)}`];
  }

  if (id && /^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: true, data: { ...data, id } };
  }
  return { ok: true, data };
}

async function ensureAlliedFlashcardCategory(
  prisma: PrismaClient,
  careerType: string,
  blueprintCategory: string | null,
): Promise<{ id: string }> {
  const slugBase = [careerType, blueprintCategory ?? "general"].join("-").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 80);
  const slug = `allied-${slugBase || "import"}`;
  const name = [careerType, blueprintCategory].filter(Boolean).join(" — ").slice(0, 200) || "Allied import";
  return prisma.category.upsert({
    where: { slug },
    create: { name, slug, topicCode: slug },
    update: {},
    select: { id: true },
  });
}

type AlliedFlashcardNormalized = {
  front: string;
  back: string;
  careerType: string;
  blueprintCategory: string | null;
  id?: string;
};

function alliedFlashcardRow(
  row: Record<string, unknown>,
): { ok: true; value: AlliedFlashcardNormalized } | { ok: false; reason: string } {
  const front = asString(pick(row, "front", "front"), "").trim();
  const back = asString(pick(row, "back", "back"), "").trim();
  if (!front || !back) return { ok: false, reason: "empty_front_or_back" };
  const careerType = asString(pick(row, "careerType", "career_type"), "").trim() || "allied";
  const blueprintCategory = asString(pick(row, "blueprintCategory", "blueprint_category"), "").trim() || null;
  const id = asString(pick(row, "id", "id"), "").trim();
  const value: AlliedFlashcardNormalized = {
    front,
    back,
    careerType,
    blueprintCategory,
    ...(id && /^[0-9a-f-]{36}$/i.test(id) ? { id } : {}),
  };
  return { ok: true, value };
}

async function main() {
  const args = parseArgs();
  const qRows = readJsonArray(args.questionsPath, "questions").map((r) => r as Record<string, unknown>);
  const fRows = readJsonArray(args.flashcardsPath, "flashcards").map((r) => r as Record<string, unknown>);
  const bRows = readJsonArray(args.blueprintsPath, "blueprints").map((r) => r as Record<string, unknown>);

  const report = {
    phase: "dry_run_summary" as const,
    apply: args.apply,
    counts: {
      allied_questions_json: qRows.length,
      allied_flashcards_json: fRows.length,
      allied_blueprints_json: bRows.length,
    },
    questions: { valid: 0, invalid: 0, reasons: {} as Record<string, number> },
    flashcards: { valid: 0, invalid: 0, reasons: {} as Record<string, number> },
    blueprints: { valid: 0, note: "No Prisma table — snapshot only or future migration." },
    exam_questions_would_insert: 0,
    exam_questions_would_skip_dup: 0,
    flashcards_would_insert: 0,
    flashcards_would_skip_dup: 0,
  };

  const normalizedQuestions: Prisma.ExamQuestionCreateInput[] = [];
  for (const row of qRows) {
    const n = alliedQuestionRowToExamQuestion(row);
    if (!n.ok) {
      report.questions.invalid++;
      report.questions.reasons[n.reason] = (report.questions.reasons[n.reason] ?? 0) + 1;
      continue;
    }
    report.questions.valid++;
    normalizedQuestions.push(n.data);
  }

  const normalizedFlashcards: AlliedFlashcardNormalized[] = [];
  for (const row of fRows) {
    const n = alliedFlashcardRow(row);
    if (!n.ok) {
      report.flashcards.invalid++;
      report.flashcards.reasons[n.reason] = (report.flashcards.reasons[n.reason] ?? 0) + 1;
      continue;
    }
    report.flashcards.valid++;
    normalizedFlashcards.push(n.value);
  }

  for (const _b of bRows) {
    report.blueprints.valid++;
  }

  if (args.blueprintsOut && bRows.length > 0) {
    fs.writeFileSync(path.resolve(args.blueprintsOut), JSON.stringify(bRows, null, 2), "utf8");
  }

  if (!args.apply) {
    report.exam_questions_would_insert = normalizedQuestions.length;
    report.flashcards_would_insert = normalizedFlashcards.length;
    console.log(JSON.stringify({ ...report, message: "Dry-run only. Pass --apply to write exam_questions + Flashcard." }, null, 2));
    return;
  }

  const prisma = new PrismaClient();
  try {
    const existingHashes = new Set<string>();
    const hashes = [...new Set(normalizedQuestions.map((q) => stemHash(String(q.stem))))];
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

    const existingIds = new Set<string>();
    const ids = normalizedQuestions.map((q) => (q as { id?: string }).id).filter(Boolean) as string[];
    for (let i = 0; i < ids.length; i += chunk) {
      const part = await prisma.examQuestion.findMany({
        where: { id: { in: ids.slice(i, i + chunk) } },
        select: { id: true },
      });
      for (const p of part) existingIds.add(p.id);
    }

    let insertedQ = 0;
    let skippedQ = 0;
    for (const data of normalizedQuestions) {
      const h = stemHash(String(data.stem));
      if (existingHashes.has(h)) {
        skippedQ++;
        continue;
      }
      const id = (data as { id?: string }).id;
      if (id && existingIds.has(id)) {
        skippedQ++;
        continue;
      }
      try {
        await prisma.examQuestion.create({ data });
        existingHashes.add(h);
        if (id) existingIds.add(id);
        insertedQ++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/Unique constraint|unique constraint/i.test(msg)) {
          skippedQ++;
          continue;
        }
        throw e;
      }
    }

    const catCache = new Map<string, { id: string }>();
    let insertedF = 0;
    let skippedF = 0;
    for (const fc of normalizedFlashcards) {
      const catKey = `${fc.careerType}::${fc.blueprintCategory ?? ""}`;
      let cat = catCache.get(catKey);
      if (!cat) {
        cat = await ensureAlliedFlashcardCategory(prisma, fc.careerType, fc.blueprintCategory);
        catCache.set(catKey, cat);
      }

      const dup = await prisma.flashcard.findFirst({
        where: {
          categoryId: cat.id,
          tier: TierCode.ALLIED,
          country: args.flashcardCountry,
          front: fc.front,
          back: fc.back,
        },
        select: { id: true },
      });
      if (dup) {
        skippedF++;
        continue;
      }

      const createData: Prisma.FlashcardCreateInput = {
        front: fc.front,
        back: fc.back,
        country: args.flashcardCountry,
        tier: TierCode.ALLIED,
        status: ContentStatus.PUBLISHED,
        examFamily: ExamFamily.ALLIED,
        category: { connect: { id: cat.id } },
      };
      if (fc.id) {
        (createData as { id?: string }).id = fc.id;
      }

      try {
        await prisma.flashcard.create({ data: createData });
        insertedF++;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        if (/Unique constraint|unique constraint/i.test(msg)) {
          skippedF++;
          continue;
        }
        throw e;
      }
    }

    console.log(
      JSON.stringify(
        {
          phase: "apply_done",
          exam_questions_inserted: insertedQ,
          exam_questions_skipped: skippedQ,
          flashcards_inserted: insertedF,
          flashcards_skipped: skippedF,
          blueprints: {
            json_rows: bRows.length,
            db_target: "none (add Prisma model + migration to persist blueprints)",
          },
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
