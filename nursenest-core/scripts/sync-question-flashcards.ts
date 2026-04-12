/**
 * sync-question-flashcards.ts
 *
 * Admin pipeline: converts ExamQuestion rows (isFlashcardSource = true) into
 * Flashcard + FlashcardDeck rows using the deterministic generation functions
 * in src/lib/flashcards/flashcard-generation.ts.
 *
 * Strategy:
 *   - One FlashcardDeck per (tier × bodySystem) combination.
 *   - One Flashcard per ExamQuestion, keyed by sourceKey = "exam_q:{id}".
 *   - One FlashcardTag per bodySystem — enables /flashcards/[bodySystem] topic pages.
 *   - FlashcardDeckOnTag joins each deck to its body-system tag.
 *   - Upserts are idempotent: re-running never duplicates anything.
 *
 * Usage:
 *   npx tsx scripts/sync-question-flashcards.ts [options]
 *
 * Options:
 *   --tier=RN               Only sync questions for a specific tier (default: all)
 *   --body-system=cardiovascular  Only sync one body system
 *   --status=PUBLISHED      Only pull published questions (default: PUBLISHED)
 *   --dry-run               Print counts without writing to DB
 *   --limit=100             Cap how many questions to process (useful for testing)
 *   --publish               Create/promote decks as PUBLISHED + PUBLIC_PREVIEW
 *                           (without this flag decks remain DRAFT + SUBSCRIBER)
 *
 * Run after migration: npx prisma migrate deploy
 * Or in dev:           npx prisma migrate dev
 */

import "../src/lib/db/env-bootstrap";

import { PrismaClient, CountryCode, TierCode, ExamFamily, ContentStatus } from "@prisma/client";
import {
  generateCardsFromExamQuestions,
  type GeneratedFlashcardInput,
} from "../src/lib/flashcards/flashcard-generation";

const prisma = new PrismaClient();

// ── Argument parsing ──────────────────────────────────────────────────────────

function parseArgs() {
  const args: Record<string, string> = {};
  for (const a of process.argv.slice(2)) {
    const m = /^--([\w-]+)(?:=(.*))?$/.exec(a);
    if (m) args[m[1]] = m[2] ?? "true";
  }
  return {
    tier: args["tier"] as TierCode | undefined,
    bodySystem: args["body-system"],
    status: (args["status"] ?? "PUBLISHED") as ContentStatus,
    dryRun: args["dry-run"] === "true",
    publish: args["publish"] === "true",
    limit: args["limit"] ? parseInt(args["limit"], 10) : undefined,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Map a raw question tier string to the Prisma TierCode enum. */
function mapTierCode(raw: string): TierCode {
  const map: Record<string, TierCode> = {
    RN: TierCode.RN,
    NP: TierCode.NP,
    RPN: TierCode.RPN,
    LVN_LPN: TierCode.LVN_LPN,
    ALLIED: TierCode.ALLIED,
    NEW_GRAD: TierCode.NEW_GRAD,
    PRE_NURSING: TierCode.PRE_NURSING,
  };
  return map[raw.toUpperCase()] ?? TierCode.RN;
}

/** Map a raw exam string to the Prisma ExamFamily enum. */
function mapExamFamily(raw: string | null): ExamFamily {
  if (!raw) return ExamFamily.GENERIC;
  const upper = raw.toUpperCase().replace(/[^A-Z_]/g, "_");
  if (upper.includes("NCLEX_RN") || upper.includes("NCLEX-RN")) return ExamFamily.NCLEX_RN;
  if (upper.includes("NCLEX_PN") || upper.includes("NCLEX-PN")) return ExamFamily.NCLEX_PN;
  if (upper.includes("REX_PN") || upper.includes("REX-PN") || upper.includes("REXPN")) return ExamFamily.REX_PN;
  if (upper.includes("NP")) return ExamFamily.NP;
  if (upper.includes("ALLIED")) return ExamFamily.ALLIED;
  return ExamFamily.GENERIC;
}

/** Map a raw countryCode to the Prisma CountryCode enum. */
function mapCountryCode(raw: string | null): CountryCode {
  if (raw === "US") return CountryCode.US;
  if (raw === "CA") return CountryCode.CA;
  return CountryCode.CA; // default; adjust per your setup
}

/** Build a stable deck slug: "q-cards-{tier}-{bodySystem}-{countryCode}". */
function deckSlug(tier: TierCode, bodySystem: string, countryCode: CountryCode): string {
  const bs = bodySystem.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return `q-cards-${tier.toLowerCase()}-${bs}-${countryCode.toLowerCase()}`;
}

/** Build a human deck title: "RN Cardiovascular (CA) — Exam Flashcards". */
function deckTitle(tier: TierCode, bodySystem: string, countryCode: CountryCode): string {
  const bs = bodySystem
    .split(/[-_\s]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `${tier} ${bs} (${countryCode}) — Exam Flashcards`;
}

/** Build a stable category slug for a bodySystem. */
function categorySlug(bodySystem: string): string {
  return bodySystem.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// ── Core sync logic ───────────────────────────────────────────────────────────

async function main() {
  const { tier, bodySystem, status, dryRun, publish, limit } = parseArgs();

  console.log("\n── NurseNest Question → Flashcard Sync ──");
  if (dryRun) console.log("  DRY RUN — no DB writes");
  if (publish) console.log("  --publish: decks will be PUBLISHED + PUBLIC_PREVIEW");

  // Step 1: fetch qualifying ExamQuestion rows
  const where = {
    isFlashcardSource: true,
    status,
    ...(tier ? { tier } : {}),
    ...(bodySystem ? { bodySystem } : {}),
    rationale: { not: null },
  };

  const questions = await prisma.examQuestion.findMany({
    where,
    select: {
      id: true,
      stem: true,
      options: true,
      correctAnswer: true,
      rationale: true,
      keyTakeaway: true,
      memoryHook: true,
      clinicalPearl: true,
      mnemonic: true,
      topic: true,
      bodySystem: true,
      tier: true,
      exam: true,
      countryCode: true,
    },
    orderBy: { createdAt: "asc" },
    ...(limit ? { take: limit } : {}),
  });

  console.log(`  Found ${questions.length} source questions`);

  // Step 2: generate card inputs
  const cardInputs = generateCardsFromExamQuestions(questions);
  console.log(`  Generated ${cardInputs.length} card inputs (${questions.length - cardInputs.length} skipped — insufficient content)`);

  if (cardInputs.length === 0) {
    console.log("  Nothing to sync. Done.");
    return;
  }

  if (dryRun) {
    const bySystem = cardInputs.reduce<Record<string, number>>((acc, c) => {
      const k = c.bodySystem ?? "unknown";
      acc[k] = (acc[k] ?? 0) + 1;
      return acc;
    }, {});
    console.log("\n  Cards by body system:");
    for (const [sys, count] of Object.entries(bySystem).sort()) {
      console.log(`    ${sys}: ${count}`);
    }
    return;
  }

  // Step 3: group by (tier, bodySystem, countryCode) for deck assignment
  // Each card input maps back to its source question for tier/country/topic info.
  const questionMeta = new Map(
    questions.map((q) => [q.id, { tier: q.tier, exam: q.exam, countryCode: q.countryCode, topic: q.topic }]),
  );

  type DeckKey = string;
  const deckKeyOf = (input: GeneratedFlashcardInput): DeckKey => {
    const meta = questionMeta.get(input.sourceId);
    const t = meta?.tier ?? "RN";
    const bs = input.bodySystem ?? "general";
    const cc = meta?.countryCode ?? "CA";
    return `${t}::${bs}::${cc}`;
  };

  const grouped = new Map<DeckKey, GeneratedFlashcardInput[]>();
  for (const card of cardInputs) {
    const key = deckKeyOf(card);
    const group = grouped.get(key) ?? [];
    group.push(card);
    grouped.set(key, group);
  }

  let decksUpserted = 0;
  let cardsUpserted = 0;

  // Step 4: upsert decks, categories, and cards
  for (const [key, cards] of grouped) {
    const [rawTier, rawBodySystem, rawCountry] = key.split("::");
    const tierCode = mapTierCode(rawTier);
    const bs = rawBodySystem ?? "general";

    // Resolve exam family and country from first card's source question
    const firstMeta = questionMeta.get(cards[0].sourceId);
    const examFamilyVal = mapExamFamily(firstMeta?.exam ?? null);
    const countryCodeVal = mapCountryCode(rawCountry ?? firstMeta?.countryCode ?? null);

    // Upsert FlashcardDeck
    const slug = deckSlug(tierCode, bs, countryCodeVal);
    const deckVisibility = publish ? "PUBLIC_PREVIEW" : "SUBSCRIBER";
    const deckStatus = publish ? ContentStatus.PUBLISHED : ContentStatus.DRAFT;
    const deck = await prisma.flashcardDeck.upsert({
      where: { slug },
      create: {
        slug,
        title: deckTitle(tierCode, bs, countryCodeVal),
        description: `Exam-derived flashcards for ${bs.replace(/-/g, " ")} (${tierCode}).`,
        country: countryCodeVal,
        tier: tierCode,
        examFamily: examFamilyVal,
        visibility: deckVisibility,
        status: deckStatus,
        cardCount: cards.length,
      },
      update: {
        cardCount: cards.length,
        // When --publish is passed, promote existing DRAFT decks to published
        ...(publish ? { status: deckStatus, visibility: deckVisibility } : {}),
        updatedAt: new Date(),
      },
    });
    decksUpserted++;

    // Upsert Category (one per bodySystem)
    const catSlug = categorySlug(bs);
    const catName = bs.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    const category = await prisma.category.upsert({
      where: { slug: catSlug },
      create: { slug: catSlug, name: catName },
      update: {},
    });

    // Upsert FlashcardTag for this body system — enables /flashcards/[bodySystem] topic pages
    const tag = await prisma.flashcardTag.upsert({
      where: { slug: catSlug },
      create: { slug: catSlug, name: catName },
      update: {},
    });

    // Link deck ↔ tag (idempotent — composite PK prevents duplicates)
    await prisma.flashcardDeckOnTag.upsert({
      where: { deckId_tagId: { deckId: deck.id, tagId: tag.id } },
      create: { deckId: deck.id, tagId: tag.id },
      update: {},
    });

    // Upsert each Flashcard
    const cardStatus = publish ? ContentStatus.PUBLISHED : ContentStatus.DRAFT;
    for (let i = 0; i < cards.length; i++) {
      const input = cards[i];
      await prisma.flashcard.upsert({
        where: { sourceKey: input.contentKey },
        create: {
          front: input.front,
          back: input.back,
          country: countryCodeVal,
          tier: tierCode,
          examFamily: examFamilyVal,
          status: cardStatus,
          categoryId: category.id,
          deckId: deck.id,
          positionInDeck: i,
          sourceKey: input.contentKey,
        },
        update: {
          front: input.front,
          back: input.back,
          positionInDeck: i,
          ...(publish ? { status: cardStatus } : {}),
          updatedAt: new Date(),
        },
      });
      cardsUpserted++;
    }
  }

  console.log(`\n  ✓ ${decksUpserted} deck(s) upserted`);
  console.log(`  ✓ ${decksUpserted} FlashcardTag(s) upserted (one per body system)`);
  console.log(`  ✓ ${cardsUpserted} card(s) upserted`);
  if (publish) {
    console.log(`\nSync complete. Decks + cards are PUBLISHED + PUBLIC_PREVIEW.`);
    console.log(`Topic pages live at /flashcards/{bodySystem} — e.g. /flashcards/cardiovascular\n`);
  } else {
    console.log(`\nSync complete. Cards are DRAFT — run with --publish to make them public.`);
    console.log(`Or promote individually in the admin panel.\n`);
  }
}

main()
  .catch((e) => {
    console.error("Sync failed:", e instanceof Error ? e.message : e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
