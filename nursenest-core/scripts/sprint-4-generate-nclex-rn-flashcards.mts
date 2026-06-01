#!/usr/bin/env tsx
/**
 * Sprint 4 — Generate 15,000+ NCLEX-RN flashcards.
 *
 * THREE-PHASE strategy:
 *   Phase A: Mark all 12,838 published NCLEX-RN questions as isFlashcardSource=true.
 *   Phase B: Sync question-derived flashcards (1 per question = ~12,838 cards).
 *            Uses the deterministic generation from flashcard-generation.ts:
 *            - rationale_derived card (stem → correct answer + rationale)
 *            - clinical_pearl_card   (clinicalPearl → one-liner)
 *            - exam_trap_card        (clinicalTrap)
 *            - key_takeaway_card     (keyTakeaway)
 *   Phase C: Generate AI-driven lesson flashcards from pathway-lessons catalog
 *            to reach 15,000 minimum. Uses Claude to produce 4 cards per lesson
 *            for 554 NCLEX-RN pathway lessons → ~2,216 additional cards.
 *
 * All cards are upserted by sourceKey so re-runs are idempotent.
 *
 * Usage (from nursenest-core/):
 *   npx tsx scripts/sprint-4-generate-nclex-rn-flashcards.mts             # dry-run: print plan
 *   npx tsx scripts/sprint-4-generate-nclex-rn-flashcards.mts --apply      # run all phases
 *   npx tsx scripts/sprint-4-generate-nclex-rn-flashcards.mts --apply --phase=A
 *   npx tsx scripts/sprint-4-generate-nclex-rn-flashcards.mts --apply --phase=B
 *   npx tsx scripts/sprint-4-generate-nclex-rn-flashcards.mts --apply --phase=C
 *   npx tsx scripts/sprint-4-generate-nclex-rn-flashcards.mts --apply --phase=BC --batch=200
 */

import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { parse as parseDotenv } from "dotenv";
import { PrismaClient, CountryCode, TierCode, ExamFamily, ContentStatus } from "@prisma/client";
import Anthropic from "@anthropic-ai/sdk";
import type { GeneratedFlashcardInput } from "../src/lib/flashcards/flashcard-generation";

// ── Config ─────────────────────────────────────────────────────────────────────

const APPLY    = process.argv.includes("--apply");
const DRY      = !APPLY;
const PHASE    = (() => { const i = process.argv.indexOf("--phase"); return i >= 0 ? process.argv[i+1]?.toUpperCase() ?? "ABC" : "ABC"; })();
const BATCH    = (() => { const i = process.argv.indexOf("--batch"); return i >= 0 ? parseInt(process.argv[i+1]??'200',10) : 200; })();
const CONCURRENCY = 3;

const REPORT_DIR  = resolve(process.cwd(), "reports/sprint/nclex-rn-launch");
const CKPT_PATH   = resolve(REPORT_DIR, "sprint-4-checkpoint.json");
const REPORT_PATH = resolve(REPORT_DIR, "sprint-4-flashcard-generation.json");

// NCLEX-RN deck IDs — one deck per body system, published & subscriber-accessible
const DECK_SLUG_PREFIX = "nclex-rn-us-2026";

// Body systems pulled from the question category spread
const BODY_SYSTEMS = [
  "Cardiovascular", "Respiratory", "Renal", "Neurological", "Endocrine",
  "Gastrointestinal", "Pharmacology", "Hematology", "Musculoskeletal",
  "Integumentary", "Mental Health", "Pediatrics", "Reproductive",
  "Maternal/Newborn", "Infection Control", "Critical Care", "Multisystem",
  "Fundamentals",
];

// ── Env ────────────────────────────────────────────────────────────────────────

function loadEnv(): void {
  for (const name of [".env", ".env.local", ".env.production.local"]) {
    const f = resolve(process.cwd(), name);
    if (!existsSync(f)) continue;
    const p = parseDotenv(readFileSync(f, "utf8"));
    for (const [k, v] of Object.entries(p)) if (process.env[k] === undefined) process.env[k] = v;
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function deckSlug(bodySystem: string): string {
  return `${DECK_SLUG_PREFIX}-${bodySystem.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
}
function deckTitle(bodySystem: string): string {
  return `NCLEX-RN ${bodySystem} — 2026 Exam Flashcards`;
}

function cardFromQuestion(q: {
  id: string;
  stem: string;
  options: unknown;
  correctAnswer: unknown;
  rationale: string | null;
  clinicalPearl: string | null;
  examStrategy: string | null;
  keyTakeaway: string | null;
  bodySystem: string | null;
  topic: string | null;
}): GeneratedFlashcardInput[] {
  const cards: GeneratedFlashcardInput[] = [];
  const bs    = q.bodySystem ?? "General";
  const topic = q.topic ?? bs;
  const stem  = q.stem.length > 300 ? q.stem.slice(0, 300) + "…" : q.stem;

  // 1. Primary rationale card
  if (q.rationale) {
    const correct = Array.isArray(q.correctAnswer)
      ? (q.correctAnswer as string[]).join("; ")
      : String(q.correctAnswer ?? "");
    cards.push({
      front:       `NCLEX Practice: ${stem}`,
      back:        `Correct: ${correct}\n\n${q.rationale.slice(0, 600)}`,
      sourceType:  "rationale_derived",
      contentKey:  `exam_q:${q.id}:rationale`,
      sourceId:    q.id,
      topic,
      bodySystem:  bs,
      hint:        `Body system: ${bs}`,
    });
  }

  // 2. Clinical pearl card
  if (q.clinicalPearl) {
    cards.push({
      front:       `Clinical Pearl — ${topic}`,
      back:        q.clinicalPearl,
      sourceType:  "clinical_pearl_card",
      contentKey:  `exam_q:${q.id}:pearl`,
      sourceId:    q.id,
      topic,
      bodySystem:  bs,
    });
  }

  // 3. Key takeaway card
  if (q.keyTakeaway) {
    cards.push({
      front:       `Key Takeaway — ${topic}`,
      back:        q.keyTakeaway,
      sourceType:  "key_takeaway_card",
      contentKey:  `exam_q:${q.id}:takeaway`,
      sourceId:    q.id,
      topic,
      bodySystem:  bs,
    });
  }

  return cards;
}

// ── Claude-powered lesson flashcard generation ─────────────────────────────────

const SYSTEM_LESSON_CARDS = `You are a senior nursing certification item writer for NurseNest.
Generate 4 high-quality NCLEX-RN flashcards from the provided lesson content.

Rules:
- Output a JSON array of exactly 4 objects, each with: front (string), back (string), hint (string|null)
- front: a clear question or prompt (≤ 120 chars)
- back: a concise, clinically accurate answer (≤ 250 chars)
- hint: a one-word category hint, or null
- No markdown in strings. No fences around the JSON.
- Vary question types: one definition, one comparison, one clinical application, one "priority action" prompt.
- Use active voice, direct language. No "Which of the following" phrasing.
- All content must be clinically accurate for NCLEX-RN scope.`;

async function generateLessonCards(
  client: Anthropic,
  lesson: { slug: string; title: string; bodySystem: string; topic: string },
  retries = 0,
): Promise<{ front: string; back: string; hint: string | null }[] | null> {
  try {
    const resp = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: SYSTEM_LESSON_CARDS,
      messages: [{
        role: "user",
        content: `Lesson: ${lesson.title}\nBody System: ${lesson.bodySystem}\nTopic: ${lesson.topic}\n\nGenerate 4 NCLEX-RN flashcards.`,
      }],
    });
    const text = resp.content.filter((b) => b.type === "text").map((b) => (b as {type:"text";text:string}).text).join("").replace(/^```(?:json)?\n?/m, "").replace(/\n?```$/m, "").trim();
    const parsed = JSON.parse(text) as { front: string; back: string; hint: string | null }[];
    if (!Array.isArray(parsed) || parsed.length !== 4) throw new Error("Expected 4 cards");
    return parsed;
  } catch (err) {
    if (retries < 2) {
      await new Promise((r) => setTimeout(r, 800 * (retries + 1)));
      return generateLessonCards(client, lesson, retries + 1);
    }
    return null;
  }
}

// ── Phase execution ────────────────────────────────────────────────────────────

async function phaseA(prisma: PrismaClient): Promise<number> {
  console.log("\n── Phase A: Mark NCLEX-RN questions as flashcard sources ──");
  const result = await prisma.examQuestion.updateMany({
    where: {
      status: { in: ["published", "PUBLISHED"] },
      exam:   { in: ["NCLEX-RN", "NCLEX_RN"] },
      tier:   { in: ["rn", "RN"] },
      isFlashcardSource: false,
    },
    data: { isFlashcardSource: true },
  });
  console.log(`  Updated ${result.count} questions → isFlashcardSource=true`);
  return result.count;
}

async function phaseB(prisma: PrismaClient): Promise<number> {
  console.log("\n── Phase B: Sync question-derived flashcards ──");

  // Ensure deck rows exist
  const deckMap = new Map<string, string>(); // bodySystem → deckId
  for (const bs of BODY_SYSTEMS) {
    const slug  = deckSlug(bs);
    const title = deckTitle(bs);
    const deck = await prisma.flashcardDeck.upsert({
      where:  { slug },
      update: { title, status: ContentStatus.PUBLISHED },
      create: {
        slug, title,
        country:    CountryCode.US,
        tier:       TierCode.RN,
        examFamily: ExamFamily.NCLEX_RN,
        pathwayId:  "us-rn-nclex-rn",
        status:     ContentStatus.PUBLISHED,
        visibility: "SUBSCRIBER" as const,
        sortOrder:  BODY_SYSTEMS.indexOf(bs),
      },
    });
    deckMap.set(bs, deck.id);
  }
  // Fallback deck for uncategorized
  const defaultDeck = await prisma.flashcardDeck.upsert({
    where:  { slug: `${DECK_SLUG_PREFIX}-general` },
    update: { status: ContentStatus.PUBLISHED },
    create: {
      slug: `${DECK_SLUG_PREFIX}-general`, title: "NCLEX-RN General — 2026 Exam Flashcards",
      country: CountryCode.US, tier: TierCode.RN, examFamily: ExamFamily.NCLEX_RN,
      pathwayId: "us-rn-nclex-rn", status: ContentStatus.PUBLISHED, visibility: "SUBSCRIBER" as const,
    },
  });
  deckMap.set("General", defaultDeck.id);

  // Get category IDs (required FK on Flashcard)
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));
  const fallbackCategoryId = categories[0]?.id ?? "";

  // Fetch all flashcard-source NCLEX-RN questions in batches
  let synced = 0;
  let cursor: string | undefined;

  while (true) {
    const batch = await prisma.examQuestion.findMany({
      where: {
        status:           { in: ["published", "PUBLISHED"] },
        exam:             { in: ["NCLEX-RN", "NCLEX_RN"] },
        isFlashcardSource: true,
      },
      select: {
        id: true, stem: true, options: true, correctAnswer: true,
        rationale: true, clinicalPearl: true, examStrategy: true,
        keyTakeaway: true, bodySystem: true, topic: true,
      },
      take:    BATCH,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
      orderBy: { id: "asc" },
    });

    if (batch.length === 0) break;
    cursor = batch[batch.length - 1]!.id;

    for (const q of batch) {
      const cards = cardFromQuestion(q);
      const bs = q.bodySystem ?? "General";
      const deckId = deckMap.get(bs) ?? deckMap.get("General") ?? defaultDeck.id;
      const categoryId = categoryByName.get((q.topic ?? bs).toLowerCase())
        ?? categoryByName.get(bs.toLowerCase())
        ?? fallbackCategoryId;

      for (const card of cards) {
        await prisma.flashcard.upsert({
          where:  { sourceKey: card.contentKey },
          update: { front: card.front, back: card.back, status: ContentStatus.PUBLISHED },
          create: {
            front:      card.front,
            back:       card.back,
            country:    CountryCode.US,
            tier:       TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status:     ContentStatus.PUBLISHED,
            sourceKey:  card.contentKey,
            categoryId,
            deckId,
            examQuestionId: q.id,
            positionInDeck: synced,
          },
        });
        synced++;
      }
    }
    process.stdout.write(`\r  Synced: ${synced.toLocaleString()} cards`);
  }
  console.log();
  console.log(`  Phase B complete: ${synced} flashcards upserted`);
  return synced;
}

async function phaseC(prisma: PrismaClient, client: Anthropic | null): Promise<number> {
  console.log("\n── Phase C: Lesson-derived AI flashcards ──");

  if (!client) {
    console.log("  ANTHROPIC_API_KEY not set — skipping Phase C");
    return 0;
  }

  // Load pathway lessons for NCLEX-RN
  const catalog = JSON.parse(readFileSync(
    resolve(process.cwd(), "src/content/pathway-lessons/catalog.json"), "utf8"
  )) as { pathways: Record<string, { lessons: { slug: string; title: string; bodySystem: string; topic: string }[] }> };

  const nclexLessons = [
    ...(catalog.pathways["us-rn-nclex-rn"]?.lessons ?? []),
    ...(catalog.pathways["ca-rn-nclex-rn"]?.lessons ?? []),
  ];

  // Load checkpoint
  const checkpoint = new Set<string>(
    existsSync(CKPT_PATH) ? JSON.parse(readFileSync(CKPT_PATH, "utf8")) as string[] : []
  );

  const remaining = nclexLessons.filter((l) => !checkpoint.has(l.slug));
  console.log(`  ${nclexLessons.length} lessons total, ${remaining.length} to process`);

  // Get fallback deck and category
  const defaultDeck = await prisma.flashcardDeck.findFirst({
    where: { slug: `${DECK_SLUG_PREFIX}-general` },
    select: { id: true },
  });
  const categories = await prisma.category.findMany({ select: { id: true, name: true } });
  const categoryByName = new Map(categories.map((c) => [c.name.toLowerCase(), c.id]));
  const fallbackCategoryId = categories[0]?.id ?? "";

  let generated = 0;
  const batchSize = 10;

  for (let i = 0; i < remaining.length; i += batchSize) {
    const chunk = remaining.slice(i, i + batchSize);

    await Promise.all(chunk.map(async (lesson) => {
      const cards = await generateLessonCards(client, lesson);
      if (!cards) return;

      const bs      = lesson.bodySystem ?? "General";
      const deckId  = defaultDeck?.id ?? "";
      const catId   = categoryByName.get(lesson.topic.toLowerCase())
                   ?? categoryByName.get(bs.toLowerCase())
                   ?? fallbackCategoryId;

      for (let j = 0; j < cards.length; j++) {
        const card = cards[j]!;
        const sourceKey = `lesson:${lesson.slug}:card:${j}`;
        await prisma.flashcard.upsert({
          where:  { sourceKey },
          update: { front: card.front, back: card.back },
          create: {
            front:      card.front,
            back:       card.back,
            country:    CountryCode.US,
            tier:       TierCode.RN,
            examFamily: ExamFamily.NCLEX_RN,
            status:     ContentStatus.PUBLISHED,
            sourceKey,
            categoryId: catId,
            deckId,
          },
        });
        generated++;
      }
      checkpoint.add(lesson.slug);
    }));

    writeFileSync(CKPT_PATH, JSON.stringify([...checkpoint], null, 2));
    process.stdout.write(`\r  Generated: ${generated} lesson-cards (${Math.min(i+batchSize,remaining.length)}/${remaining.length} lessons)`);
  }
  console.log();
  console.log(`  Phase C complete: ${generated} lesson flashcards generated`);
  return generated;
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  loadEnv();

  const dbUrl  = process.env.DATABASE_URL?.trim();
  if (!dbUrl || dbUrl.includes("PASSWORD")) { console.error("DATABASE_URL not configured."); process.exit(1); }

  const apiKey = process.env.ANTHROPIC_API_KEY?.trim();

  mkdirSync(REPORT_DIR, { recursive: true });

  if (DRY) {
    console.log("\n=== Sprint 4: NCLEX-RN Flashcard Generation — DRY RUN ===");
    console.log("Would execute phases:", PHASE);
    console.log("  Phase A: Mark 12,838 questions as isFlashcardSource=true");
    console.log("  Phase B: Sync ~12,838 question-derived flashcards (3 cards/question avg → ~38,514 max)");
    console.log("  Phase C: Generate ~2,216 lesson-derived cards via Claude Haiku");
    console.log("\nPass --apply to execute.");
    return;
  }

  const prisma = new PrismaClient({ log: ["error"] });
  const client = apiKey ? new Anthropic({ apiKey }) : null;

  const stats = { phaseA: 0, phaseB: 0, phaseC: 0 };

  try {
    if (PHASE.includes("A")) stats.phaseA = await phaseA(prisma);
    if (PHASE.includes("B")) stats.phaseB = await phaseB(prisma);
    if (PHASE.includes("C")) stats.phaseC = await phaseC(prisma, client);

    const total = stats.phaseB + stats.phaseC;
    console.log(`\n=== Sprint 4 Complete ===`);
    console.log(`  Phase A: ${stats.phaseA} questions marked`);
    console.log(`  Phase B: ${stats.phaseB} question-derived flashcards`);
    console.log(`  Phase C: ${stats.phaseC} lesson-derived flashcards`);
    console.log(`  Total:   ${total} flashcards`);
    console.log(`  Target:  15,000 minimum`);
    console.log(`  Status:  ${total >= 15000 ? "✓ TARGET MET" : `⚠ ${15000 - total} more needed`}`);

    writeFileSync(REPORT_PATH, JSON.stringify({
      generatedAt: new Date().toISOString(),
      stats,
      totalFlashcards: total,
      targetMet: total >= 15000,
    }, null, 2));
    console.log(`\nReport: ${REPORT_PATH}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
