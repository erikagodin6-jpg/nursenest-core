/**
 * NDJSON or JSON array import:
 * `{ "decks": [ { "title", "pathwayId", "cards": [{ "front","back","categoryId?" }] } ] }`
 * or one deck per line NDJSON.
 *
 * All imported decks are PRIVATE, source LEGACY_IMPORT, verification UNVERIFIED, moderation APPROVED (private),
 * never PUBLIC, never published.
 */
import { readFile } from "node:fs/promises";

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

type LegacyCard = { front: string; back: string; categoryId?: string | null };
type LegacyDeck = { title: string; pathwayId: string; cards: LegacyCard[]; professionKey?: string | null };

async function main() {
  const file = process.argv[2];
  const ownerId = process.env.LEGACY_STUDY_CARDS_OWNER_ID?.trim();
  if (!file || !ownerId) {
    console.error("Usage: LEGACY_STUDY_CARDS_OWNER_ID=<userId> npx tsx scripts/migrate-legacy-study-cards.ts <export.json|ndjson>");
    process.exit(1);
  }

  const raw = await readFile(file, "utf8");
  let decks: LegacyDeck[] = [];
  if (raw.trim().startsWith("[")) {
    decks = JSON.parse(raw) as LegacyDeck[];
  } else if (raw.includes('"decks"')) {
    decks = (JSON.parse(raw) as { decks: LegacyDeck[] }).decks;
  } else {
    for (const line of raw.split("\n")) {
      const t = line.trim();
      if (!t) continue;
      decks.push(JSON.parse(t) as LegacyDeck);
    }
  }

  const batch = `legacy-study-cards:${Date.now()}`;
  for (const d of decks) {
    const deck = await prisma.verifiedStudyDeck.create({
      data: {
        title: d.title.slice(0, 200),
        pathwayId: d.pathwayId.trim(),
        professionKey: d.professionKey?.trim() || null,
        ownerId,
        visibility: "PRIVATE",
        verificationStatus: "UNVERIFIED",
        moderationStatus: "APPROVED",
        sourceType: "LEGACY_IMPORT",
        legacyImportBatch: batch,
      },
    });
    if (d.cards?.length) {
      await prisma.verifiedStudyCard.createMany({
        data: d.cards.map((c, i) => ({
          deckId: deck.id,
          position: i,
          promptFront: c.front,
          answerBack: c.back,
          canonicalCategoryId: c.categoryId?.trim() || null,
          referencesJson: [] satisfies Prisma.InputJsonValue,
          verificationStatus: "UNVERIFIED" as const,
        })),
      });
    }
    console.log("imported", deck.id, deck.title);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
