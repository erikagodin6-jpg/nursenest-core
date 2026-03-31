#!/usr/bin/env npx tsx
/**
 * Replit export JSON → Prisma (ContentItem, ExamQuestion, FlashcardDeck, Flashcard).
 *
 * - Default: dry-run (no writes). Pass `--apply` to persist.
 * - Never deletes or truncates existing rows.
 * - Deduplicates exam rows by `stem_hash` from JSON, else by `stemHash(stem)`.
 * - Batched DB operations to limit memory and transaction size.
 *
 * Run from `nursenest-core/` with DATABASE_URL set (see `src/lib/db/env-bootstrap.ts`):
 *   npx tsx scripts/import-replit-data.ts
 *   npx tsx scripts/import-replit-data.ts --apply
 *   npx tsx scripts/import-replit-data.ts --dir=./data/replit-exports --apply
 *
 * Optional: after core import, runs `import-allied-json-to-prisma.ts` for allied JSON
 * unless `--skip-allied` is passed.
 */
import "../src/lib/db/env-bootstrap";
import * as fs from "node:fs";
import * as path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  ContentStatus,
  CountryCode,
  ExamFamily,
  Prisma,
  TierCode,
  FlashcardDeckVisibility,
} from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { stemHash as computeStemHash } from "@/lib/content/stem-hash";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NC_ROOT = path.resolve(__dirname, "..");

/** JSON arrays we map to Prisma (other files are listed in analyze only). */
const CATALOG: { file: string; model: string; notes: string }[] = [
  { file: "content_items.json", model: "ContentItem", notes: "Lessons/blog/article → content_items; upsert by slug" },
  { file: "exam_questions.json", model: "ExamQuestion", notes: "Question bank; dedupe stem_hash / stem" },
  { file: "flashcard_decks.json", model: "FlashcardDeck", notes: "Marketing / deck shell; upsert by slug" },
  { file: "deck_flashcards.json", model: "Flashcard", notes: "Cards; requires deck ids from flashcard_decks import" },
  { file: "allied_questions.json", model: "ExamQuestion", notes: "Delegated to import-allied-json-to-prisma.ts" },
  { file: "allied_flashcards.json", model: "Flashcard", notes: "Delegated to import-allied-json-to-prisma.ts" },
  { file: "flashcard_bank.json", model: "(legacy table)", notes: "Not Prisma Flashcard — use monolith import or extend script" },
];

function parseArgs() {
  const argv = process.argv.slice(2);
  const get = (name: string): string | undefined => {
    const pref = `--${name}=`;
    const hit = argv.find((a) => a.startsWith(pref));
    return hit ? hit.slice(pref.length) : undefined;
  };
  const apply = argv.includes("--apply");
  const dryRun = !apply;
  const analyzeOnly = argv.includes("--analyze-only");
  const skipAllied = argv.includes("--skip-allied");
  const dirArg = get("dir");
  const batchSize = Math.min(500, Math.max(25, parseInt(get("batch-size") ?? "150", 10) || 150));
  const defaultCountry = (get("default-country")?.toUpperCase() as CountryCode) || CountryCode.US;
  return { apply, dryRun, analyzeOnly, skipAllied, dirArg, batchSize, defaultCountry };
}

function resolveExportDir(dirArg: string | undefined): string {
  if (dirArg?.trim()) return path.resolve(dirArg);
  const cands = [
    path.join(NC_ROOT, "data", "replit-exports"),
    path.join(NC_ROOT, "..", "data", "replit-exports"),
  ];
  for (const c of cands) {
    if (fs.existsSync(c) && fs.statSync(c).isDirectory()) return c;
  }
  return cands[0]!;
}

function readJsonArray(filePath: string, label: string): unknown[] {
  if (!fs.existsSync(filePath)) {
    console.warn(JSON.stringify({ warn: "missing_file", label, filePath }));
    return [];
  }
  const raw = fs.readFileSync(filePath, "utf8");
  let data: unknown;
  try {
    data = JSON.parse(raw) as unknown;
  } catch (e) {
    throw new Error(`${label}: invalid JSON (${filePath}): ${e instanceof Error ? e.message : e}`);
  }
  if (!Array.isArray(data)) throw new Error(`${label}: expected top-level array in ${filePath}`);
  return data;
}

function pick<T = unknown>(row: Record<string, unknown>, camel: string, snake: string): T | undefined {
  if (camel in row && row[camel] !== undefined) return row[camel] as T;
  if (snake in row && row[snake] !== undefined) return row[snake] as T;
  return undefined;
}

function asStr(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  if (typeof v === "string") return v;
  return String(v);
}

function asInt(v: unknown, fallback: number): number {
  if (typeof v === "number" && Number.isFinite(v)) return Math.trunc(v);
  if (typeof v === "string" && v.trim() !== "") return parseInt(v, 10) || fallback;
  return fallback;
}

function parseDate(v: unknown): Date | undefined {
  if (v === null || v === undefined) return undefined;
  if (v instanceof Date) return v;
  const s = asStr(v);
  if (!s) return undefined;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? undefined : d;
}

function toJsonValue(v: unknown): Prisma.InputJsonValue {
  if (v === undefined || v === null) return [];
  return v as Prisma.InputJsonValue;
}

/** Normalize correct_answer: indices → option label strings for app compatibility. */
function normalizeCorrectAnswer(raw: unknown, options: string[]): Prisma.InputJsonValue {
  if (!Array.isArray(raw)) return toJsonValue(raw);
  if (raw.length === 0) return [];
  const out: string[] = [];
  for (const x of raw) {
    if (typeof x === "number" && options.length > 0) {
      const i = Math.max(0, Math.min(options.length - 1, Math.trunc(x)));
      const lab = options[i];
      if (lab) out.push(lab);
    } else if (typeof x === "string") out.push(x);
  }
  return out;
}

function normalizeOptions(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  const out: string[] = [];
  for (const o of raw) {
    if (typeof o === "string") out.push(o);
    else if (o && typeof o === "object" && "text" in (o as object)) out.push(asStr((o as { text: unknown }).text));
    else if (o && typeof o === "object" && "label" in (o as object)) out.push(asStr((o as { label: unknown }).label));
    else out.push(JSON.stringify(o));
  }
  return out.filter((s) => s.length > 0);
}

function effectiveStemHash(row: Record<string, unknown>, stem: string): string {
  const fromExport = asStr(pick(row, "stemHash", "stem_hash"), "").trim();
  if (fromExport) return fromExport;
  return computeStemHash(stem);
}

function mapTierCode(raw: unknown): TierCode {
  const t = asStr(raw, "free").toLowerCase();
  if (t === "rpn" || t === "lvn" || t === "lpn" || t === "lvn_lpn") return TierCode.RPN;
  if (t === "rn" || t === "nclex" || t === "free") return TierCode.RN;
  if (t === "np") return TierCode.NP;
  if (t === "allied") return TierCode.ALLIED;
  return TierCode.RN;
}

function mapCountryFromScope(regionScope: unknown, fallback: CountryCode): CountryCode {
  const s = asStr(regionScope, "").toUpperCase();
  if (s === "CA" || s === "CAN") return CountryCode.CA;
  if (s === "US" || s === "USA") return CountryCode.US;
  return fallback;
}

function mapDeckVisibility(v: unknown): FlashcardDeckVisibility {
  const s = asStr(v, "private").toLowerCase();
  if (s === "public" || s === "public_preview") return FlashcardDeckVisibility.PUBLIC_PREVIEW;
  if (s === "hidden") return FlashcardDeckVisibility.HIDDEN;
  return FlashcardDeckVisibility.SUBSCRIBER;
}

function mapContentStatusFromDeckTier(_tier: unknown): ContentStatus {
  return ContentStatus.PUBLISHED;
}

function examRowToCreateInput(row: Record<string, unknown>): { ok: true; data: Prisma.ExamQuestionCreateInput } | { ok: false; reason: string } {
  const id = asStr(pick(row, "id", "id"), "").trim();
  const stem = asStr(pick(row, "stem", "stem"), "").trim();
  if (!stem) return { ok: false, reason: "empty_stem" };
  const options = normalizeOptions(pick(row, "options", "options"));
  const correctRaw = pick(row, "correctAnswer", "correct_answer");
  const correctAnswer = normalizeCorrectAnswer(correctRaw, options);

  const data: Prisma.ExamQuestionCreateInput = {
    stem,
    tier: asStr(pick(row, "tier", "tier"), "rn").toLowerCase(),
    exam: asStr(pick(row, "exam", "exam"), "NCLEX-RN"),
    questionType: asStr(pick(row, "questionType", "question_type"), "multiple_choice"),
    status: asStr(pick(row, "status", "status"), "draft"),
    publishAt: parseDate(pick(row, "publishAt", "publish_at")),
    options: toJsonValue(options),
    correctAnswer,
    rationale: asStr(pick(row, "rationale", "rationale"), "") || undefined,
    difficulty: asInt(pick(row, "difficulty", "difficulty"), 3),
    tags: Array.isArray(pick(row, "tags", "tags"))
      ? (pick(row, "tags", "tags") as unknown[]).map((x) => asStr(x))
      : [],
    bodySystem: asStr(pick(row, "bodySystem", "body_system"), "") || undefined,
    topic: asStr(pick(row, "topic", "topic"), "") || undefined,
    subtopic: asStr(pick(row, "subtopic", "subtopic"), "") || undefined,
    caseId: asStr(pick(row, "caseId", "case_id"), "") || undefined,
    exhibitData: pick(row, "exhibitData", "exhibit_data") !== undefined ? toJsonValue(pick(row, "exhibitData", "exhibit_data")) : undefined,
    regionScope: asStr(pick(row, "regionScope", "region_scope"), "BOTH") || "BOTH",
    stemHash: effectiveStemHash(row, stem),
    careerType: asStr(pick(row, "careerType", "career_type"), "nursing") || "nursing",
    scenario: asStr(pick(row, "scenario", "scenario"), "") || undefined,
    clinicalPearl: asStr(pick(row, "clinicalPearl", "clinical_pearl"), "") || undefined,
    examStrategy: asStr(pick(row, "examStrategy", "exam_strategy"), "") || undefined,
    memoryHook: asStr(pick(row, "memoryHook", "memory_hook"), "") || undefined,
    frameworkUsed: asStr(pick(row, "frameworkUsed", "framework_used"), "") || undefined,
    clinicalTrap: asStr(pick(row, "clinicalTrap", "clinical_trap"), "") || undefined,
    distractorRationales:
      pick(row, "distractorRationales", "distractor_rationales") !== undefined
        ? toJsonValue(pick(row, "distractorRationales", "distractor_rationales"))
        : undefined,
    countryCode: asStr(pick(row, "countryCode", "country_code"), "") || undefined,
    regionCode: asStr(pick(row, "regionCode", "region_code"), "") || undefined,
    languageCode: asStr(pick(row, "languageCode", "language_code"), "en") || "en",
    createdAt: parseDate(pick(row, "createdAt", "created_at")) ?? undefined,
    updatedAt: parseDate(pick(row, "updatedAt", "updated_at")) ?? undefined,
    publishedAt: parseDate(pick(row, "publishedAt", "published_at")),
    sourceVersion: asInt(pick(row, "sourceVersion", "source_version"), 1),
  };

  if (id && /^[0-9a-f-]{36}$/i.test(id)) {
    return { ok: true, data: { ...data, id } };
  }
  return { ok: true, data };
}

function contentRowToUpsert(row: Record<string, unknown>): { ok: true; data: Prisma.ContentItemCreateInput } | { ok: false; reason: string } {
  const slug = asStr(pick(row, "slug", "slug"), "").trim();
  const title = asStr(pick(row, "title", "title"), "").trim();
  if (!slug || !title) return { ok: false, reason: "missing_slug_or_title" };
  const id = asStr(pick(row, "id", "id"), "").trim();
  const data: Prisma.ContentItemCreateInput = {
    title,
    slug,
    type: asStr(pick(row, "type", "type"), "lesson"),
    category: asStr(pick(row, "category", "category"), "") || undefined,
    bodySystem: asStr(pick(row, "bodySystem", "body_system"), "") || undefined,
    tier: asStr(pick(row, "tier", "tier"), "") || undefined,
    status: asStr(pick(row, "status", "status"), "draft") || "draft",
    tags: Array.isArray(pick(row, "tags", "tags")) ? (pick(row, "tags", "tags") as unknown[]).map((x) => asStr(x)) : [],
    summary: asStr(pick(row, "summary", "summary"), "") || undefined,
    content: toJsonValue(pick(row, "content", "content") ?? []),
    seoTitle: asStr(pick(row, "seoTitle", "seo_title"), "") || undefined,
    seoDescription: asStr(pick(row, "seoDescription", "seo_description"), "") || undefined,
    seoKeywords: Array.isArray(pick(row, "seoKeywords", "seo_keywords"))
      ? (pick(row, "seoKeywords", "seo_keywords") as unknown[]).map((x) => asStr(x))
      : [],
    regionScope: asStr(pick(row, "regionScope", "region_scope"), "BOTH") || "BOTH",
    sourceVersion: asInt(pick(row, "sourceVersion", "source_version"), 1),
    createdAt: parseDate(pick(row, "createdAt", "created_at")),
    updatedAt: parseDate(pick(row, "updatedAt", "updated_at")),
    publishedAt: parseDate(pick(row, "publishedAt", "published_at")),
  };
  if (id && id.length > 0) {
    return { ok: true, data: { ...data, id } };
  }
  return { ok: true, data };
}

async function ensureDeckCardCategory(prisma: PrismaClient): Promise<{ id: string }> {
  const slug = "replit-import-deck-cards";
  return prisma.category.upsert({
    where: { slug },
    create: { name: "Replit import — deck cards", slug, topicCode: "replit-import" },
    update: {},
    select: { id: true },
  });
}

async function analyze(dir: string) {
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  const rows: { file: string; bytes: number; rows: number | null; error?: string }[] = [];
  for (const f of files.sort()) {
    const fp = path.join(dir, f);
    const st = fs.statSync(fp);
    let n: number | null = null;
    let err: string | undefined;
    try {
      const arr = readJsonArray(fp, f);
      n = arr.length;
    } catch (e) {
      err = e instanceof Error ? e.message : String(e);
    }
    rows.push({ file: f, bytes: st.size, rows: n, error: err });
  }
  const catalog = CATALOG.map((c) => ({
    ...c,
    present: fs.existsSync(path.join(dir, c.file)),
  }));
  console.log(JSON.stringify({ phase: "analyze", exportDir: dir, catalog, files: rows }, null, 2));
}

async function importContentItems(
  prisma: PrismaClient,
  dir: string,
  dryRun: boolean,
  log: { invalid: { reason: string; count: number }[] },
) {
  const fp = path.join(dir, "content_items.json");
  const raw = readJsonArray(fp, "content_items");
  let valid = 0;
  let skipped = 0;
  const toWrite: Prisma.ContentItemCreateInput[] = [];
  for (const r of raw) {
    const row = r as Record<string, unknown>;
    const m = contentRowToUpsert(row);
    if (!m.ok) {
      skipped++;
      const reason = m.reason;
      const hit = log.invalid.find((x) => x.reason === reason);
      if (hit) hit.count++;
      else log.invalid.push({ reason, count: 1 });
      continue;
    }
    valid++;
    toWrite.push(m.data);
  }
  if (dryRun) {
    return { file: "content_items.json", valid, skipped_invalid: skipped, would_upsert: toWrite.length };
  }
  let upserted = 0;
  for (const data of toWrite) {
    const slug = data.slug;
    await prisma.contentItem.upsert({
      where: { slug },
      create: data,
      update: {
        title: data.title,
        type: data.type,
        category: data.category,
        bodySystem: data.bodySystem,
        tier: data.tier,
        status: data.status,
        tags: data.tags,
        summary: data.summary,
        content: data.content,
        seoTitle: data.seoTitle,
        seoDescription: data.seoDescription,
        seoKeywords: data.seoKeywords,
        regionScope: data.regionScope,
        sourceVersion: data.sourceVersion,
        publishedAt: data.publishedAt,
        updatedAt: new Date(),
      },
    });
    upserted++;
  }
  return { file: "content_items.json", valid, skipped_invalid: skipped, upserted };
}

async function importExamQuestions(
  prisma: PrismaClient,
  dir: string,
  dryRun: boolean,
  batchSize: number,
  log: { invalid: { reason: string; count: number }[] },
) {
  const fp = path.join(dir, "exam_questions.json");
  const raw = readJsonArray(fp, "exam_questions");
  const candidates: Prisma.ExamQuestionCreateInput[] = [];
  let skippedInvalid = 0;
  for (const r of raw) {
    const row = r as Record<string, unknown>;
    const m = examRowToCreateInput(row);
    if (!m.ok) {
      skippedInvalid++;
      const reason = m.reason;
      const hit = log.invalid.find((x) => x.reason === reason);
      if (hit) hit.count++;
      else log.invalid.push({ reason, count: 1 });
      continue;
    }
    candidates.push(m.data);
  }

  if (dryRun) {
    return {
      file: "exam_questions.json",
      parsed: candidates.length,
      skipped_invalid: skippedInvalid,
      note: "Dry-run does not query DB for duplicate stem_hash; use --apply for exact skip counts",
    };
  }

  const hashes = [...new Set(candidates.map((c) => asStr(c.stemHash, "")).filter(Boolean))];
  const existingHashes = new Set<string>();
  for (let i = 0; i < hashes.length; i += batchSize) {
    const part = await prisma.examQuestion.findMany({
      where: { stemHash: { in: hashes.slice(i, i + batchSize) } },
      select: { stemHash: true },
    });
    for (const p of part) {
      if (p.stemHash) existingHashes.add(p.stemHash);
    }
  }

  const ids = candidates.map((c) => (c as { id?: string }).id).filter(Boolean) as string[];
  const existingIds = new Set<string>();
  for (let i = 0; i < ids.length; i += batchSize) {
    const part = await prisma.examQuestion.findMany({
      where: { id: { in: ids.slice(i, i + batchSize) } },
      select: { id: true },
    });
    for (const p of part) existingIds.add(p.id);
  }

  let inserted = 0;
  let skippedDup = 0;
  const pending: Prisma.ExamQuestionCreateInput[] = [];
  for (const data of candidates) {
    const h = asStr(data.stemHash, "");
    if (h && existingHashes.has(h)) {
      skippedDup++;
      continue;
    }
    const id = (data as { id?: string }).id;
    if (id && existingIds.has(id)) {
      skippedDup++;
      continue;
    }
    pending.push(data);
  }

  for (let i = 0; i < pending.length; i += batchSize) {
    const chunk = pending.slice(i, i + batchSize);
    await prisma.$transaction(
      chunk.map((data) =>
        prisma.examQuestion.create({
          data,
        }),
      ),
    );
    for (const data of chunk) {
      const h = asStr(data.stemHash, "");
      if (h) existingHashes.add(h);
      const id = (data as { id?: string }).id;
      if (id) existingIds.add(id);
      inserted++;
    }
  }

  return {
    file: "exam_questions.json",
    parsed: candidates.length,
    skipped_invalid: skippedInvalid,
    skipped_duplicate: skippedDup,
    inserted,
  };
}

async function importFlashcardDecksAndCards(
  prisma: PrismaClient,
  dir: string,
  dryRun: boolean,
  defaultCountry: CountryCode,
  batchSize: number,
  log: { invalid: { reason: string; count: number }[] },
) {
  const decksPath = path.join(dir, "flashcard_decks.json");
  const cardsPath = path.join(dir, "deck_flashcards.json");
  const deckRows = readJsonArray(decksPath, "flashcard_decks") as Record<string, unknown>[];
  const cardRows = readJsonArray(cardsPath, "deck_flashcards") as Record<string, unknown>[];

  type DeckIn = {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    country: CountryCode;
    tier: TierCode;
    visibility: FlashcardDeckVisibility;
    status: ContentStatus;
    cardCount: number;
  };

  const decks: DeckIn[] = [];
  for (const row of deckRows) {
    const id = asStr(pick(row, "id", "id"), "").trim();
    const slug = asStr(pick(row, "slug", "slug"), "").trim();
    const title = asStr(pick(row, "title", "title"), "").trim();
    if (!id || !slug || !title) {
      const hit = log.invalid.find((x) => x.reason === "deck_missing_id_slug_title");
      if (hit) hit.count++;
      else log.invalid.push({ reason: "deck_missing_id_slug_title", count: 1 });
      continue;
    }
    const tier = mapTierCode(pick(row, "tier", "tier"));
    const country = defaultCountry;
    decks.push({
      id,
      slug,
      title,
      description: asStr(pick(row, "description", "description"), "") || null,
      country,
      tier,
      visibility: mapDeckVisibility(pick(row, "visibility", "visibility")),
      status: mapContentStatusFromDeckTier(pick(row, "tier", "tier")),
      cardCount: asInt(pick(row, "cardCount", "card_count"), 0),
    });
  }

  if (dryRun) {
    let cardsValid = 0;
    let cardsInvalid = 0;
    const deckIds = new Set(decks.map((d) => d.id));
    for (const row of cardRows) {
      const front = asStr(pick(row, "front", "front"), "").trim();
      const back = asStr(pick(row, "back", "back"), "").trim();
      const deckId = asStr(pick(row, "deckId", "deck_id"), "").trim();
      if (!front || !back || !deckId) {
        cardsInvalid++;
        continue;
      }
      if (!deckIds.has(deckId)) cardsInvalid++;
      else cardsValid++;
    }
    return {
      file: "flashcard_decks + deck_flashcards",
      decks_valid: decks.length,
      cards_valid: cardsValid,
      cards_invalid_or_orphan: cardsInvalid,
    };
  }

  const cat = await ensureDeckCardCategory(prisma);

  for (const d of decks) {
    await prisma.flashcardDeck.upsert({
      where: { slug: d.slug },
      create: {
        id: d.id,
        slug: d.slug,
        title: d.title,
        description: d.description ?? "",
        country: d.country,
        tier: d.tier,
        examFamily: ExamFamily.GENERIC,
        visibility: d.visibility,
        status: d.status,
        sortOrder: 0,
        cardCount: d.cardCount,
      },
      update: {
        title: d.title,
        description: d.description ?? "",
        country: d.country,
        tier: d.tier,
        visibility: d.visibility,
        status: d.status,
        cardCount: d.cardCount,
      },
    });
  }

  const deckIdSet = new Set(decks.map((x) => x.id));
  const pending: {
    id?: string;
    front: string;
    back: string;
    country: CountryCode;
    tier: TierCode;
    status: ContentStatus;
    examFamily: ExamFamily;
    categoryId: string;
    deckId: string;
    positionInDeck: number;
  }[] = [];
  for (const row of cardRows) {
    const id = asStr(pick(row, "id", "id"), "").trim();
    const front = asStr(pick(row, "front", "front"), "").trim();
    const back = asStr(pick(row, "back", "back"), "").trim();
    const deckId = asStr(pick(row, "deckId", "deck_id"), "").trim();
    if (!front || !back || !deckId || !deckIdSet.has(deckId)) {
      const reason = !front || !back ? "card_empty_front_back" : "card_orphan_deck";
      const hit = log.invalid.find((x) => x.reason === reason);
      if (hit) hit.count++;
      else log.invalid.push({ reason, count: 1 });
      continue;
    }
    const deck = decks.find((x) => x.id === deckId);
    const tier = deck?.tier ?? TierCode.RN;
    const country = deck?.country ?? defaultCountry;
    const sortOrder = asInt(pick(row, "sortOrder", "sort_order"), 0);
    const hasUuid = id && /^[0-9a-f-]{36}$/i.test(id);
    pending.push({
      id: hasUuid ? id : undefined,
      front,
      back,
      country,
      tier,
      status: ContentStatus.PUBLISHED,
      examFamily: ExamFamily.GENERIC,
      categoryId: cat.id,
      deckId,
      positionInDeck: sortOrder,
    });
  }

  let written = 0;
  let skipped = 0;
  for (let i = 0; i < pending.length; i += batchSize) {
    const chunk = pending.slice(i, i + batchSize);
    await prisma.$transaction(async (tx) => {
      for (const c of chunk) {
        const base = {
          front: c.front,
          back: c.back,
          country: c.country,
          tier: c.tier,
          status: c.status,
          examFamily: c.examFamily,
          categoryId: c.categoryId,
          deckId: c.deckId,
          positionInDeck: c.positionInDeck,
        };
        try {
          if (c.id) {
            await tx.flashcard.upsert({
              where: { id: c.id },
              create: { id: c.id, ...base },
              update: {
                front: base.front,
                back: base.back,
                positionInDeck: base.positionInDeck,
                status: base.status,
              },
            });
          } else {
            await tx.flashcard.create({ data: base });
          }
          written++;
        } catch {
          skipped++;
        }
      }
    });
  }

  return {
    file: "flashcard_decks + deck_flashcards",
    decks_upserted: decks.length,
    flashcards_processed: pending.length,
    flashcards_written: written,
    flashcards_skipped: skipped,
  };
}

function runAlliedImporter(dir: string, apply: boolean) {
  const q = path.join(dir, "allied_questions.json");
  const f = path.join(dir, "allied_flashcards.json");
  if (!fs.existsSync(q) && !fs.existsSync(f)) {
    return { skipped: true, reason: "no_allied_json" };
  }
  const args = ["tsx", "scripts/import-allied-json-to-prisma.ts", `--questions=${q}`, `--flashcards=${f}`];
  if (apply) args.push("--apply");
  const r = spawnSync("npx", args, { cwd: NC_ROOT, stdio: "inherit", env: process.env });
  return { skipped: false, status: r.status };
}

async function main() {
  const args = parseArgs();
  const exportDir = resolveExportDir(args.dirArg);
  if (!fs.existsSync(exportDir)) {
    console.error(JSON.stringify({ ok: false, error: "export_dir_missing", exportDir }, null, 2));
    process.exit(2);
  }

  if (args.analyzeOnly || args.dryRun) {
    await analyze(exportDir);
  }
  if (args.analyzeOnly) return;

  const log = { invalid: [] as { reason: string; count: number }[] };
  const report: Record<string, unknown> = {
    ok: true,
    dryRun: args.dryRun,
    exportDir,
    phases: [] as unknown[],
  };

  if (args.dryRun) {
    const prisma = new PrismaClient();
    try {
      report.phases.push(await importContentItems(prisma, exportDir, true, log));
      report.phases.push(await importExamQuestions(prisma, exportDir, true, args.batchSize, log));
      report.phases.push(await importFlashcardDecksAndCards(prisma, exportDir, true, args.defaultCountry, args.batchSize, log));
    } finally {
      await prisma.$disconnect();
    }
    if (!args.skipAllied) {
      report.phases.push({
        allied_subprocess: "Would run import-allied-json-to-prisma.ts (dry-run internally — pass --apply on main script)",
      });
    }
    report.invalid_samples = log.invalid;
    console.log(JSON.stringify(report, null, 2));
    console.log("\nDry-run complete. Re-run with `--apply` to write to the database.");
    return;
  }

  const prisma = new PrismaClient();
  try {
    report.phases.push(await importContentItems(prisma, exportDir, false, log));
    report.phases.push(await importExamQuestions(prisma, exportDir, false, args.batchSize, log));
    report.phases.push(await importFlashcardDecksAndCards(prisma, exportDir, false, args.defaultCountry, args.batchSize, log));
  } finally {
    await prisma.$disconnect();
  }

  if (!args.skipAllied) {
    const sub = runAlliedImporter(exportDir, true);
    report.phases.push({ allied_subprocess: sub });
  }

  report.invalid_samples = log.invalid;
  console.log(JSON.stringify(report, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
