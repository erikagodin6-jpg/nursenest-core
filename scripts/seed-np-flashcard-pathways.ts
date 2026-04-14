import "../src/lib/db/env-bootstrap";

import { ContentStatus, CountryCode, ExamFamily, FlashcardDeckVisibility, PrismaClient, TierCode } from "@prisma/client";
import { EXAM_PATHWAYS } from "../src/lib/exam-pathways/exam-product-registry";

type SeedOptions = {
  apply: boolean;
  dryRun: boolean;
};

type SeedCounters = {
  created: number;
  updated: number;
  skipped: number;
  failed: number;
};

const PHASE_1_PATHWAY_ORDER = [
  "us-np-fnp",
  "us-np-pmhnp",
  "us-np-agpcnp",
  "us-np-whnp",
  "us-np-pnp-pc",
  "ca-np-cnple",
] as const;

const prisma = new PrismaClient();

function parseOptions(argv: string[]): SeedOptions {
  const hasApply = argv.includes("--apply");
  const hasDryRun = argv.includes("--dry-run");
  return {
    apply: hasApply,
    dryRun: hasDryRun || !hasApply,
  };
}

function deckSlugForPathway(pathwayId: string): string {
  return `np-pathway-${pathwayId}-flashcards`;
}

async function main() {
  const options = parseOptions(process.argv.slice(2));
  const counters: SeedCounters = { created: 0, updated: 0, skipped: 0, failed: 0 };

  const pathwayById = new Map(EXAM_PATHWAYS.map((pathway) => [pathway.id, pathway]));
  const orderedPathways = PHASE_1_PATHWAY_ORDER.map((pathwayId) => pathwayById.get(pathwayId)).filter(Boolean);

  console.log("NP flashcard pathway scaffold seed");
  console.log(`mode=${options.apply ? "apply" : "dry-run"}`);
  console.log(`pathways=${orderedPathways.length}`);

  for (const pathway of orderedPathways) {
    if (!pathway) continue;
    const slug = deckSlugForPathway(pathway.id);
    const title = `${pathway.shortName} flashcards (in progress)`;
    const description =
      `${pathway.displayName}: flashcard coverage is in progress. ` +
      `Use lessons and question bank while this deck is being populated.`;

    try {
      const existing = await prisma.flashcardDeck.findUnique({
        where: { slug },
        select: { id: true, pathwayId: true, cardCount: true, title: true, status: true, visibility: true },
      });

      if (!existing) {
        counters.created += 1;
        console.log(`[create] ${pathway.id} slug=${slug}`);
        if (options.apply) {
          await prisma.flashcardDeck.create({
            data: {
              slug,
              title,
              description,
              country: pathway.countryCode as CountryCode,
              tier: TierCode.NP,
              examFamily: ExamFamily.NP,
              pathwayId: pathway.id,
              visibility: FlashcardDeckVisibility.SUBSCRIBER,
              status: ContentStatus.PUBLISHED,
              sortOrder: 9900,
              cardCount: 0,
            },
          });
        }
        continue;
      }

      const needsUpdate =
        existing.pathwayId !== pathway.id ||
        existing.title !== title ||
        existing.status !== ContentStatus.PUBLISHED ||
        existing.visibility !== FlashcardDeckVisibility.SUBSCRIBER;

      if (!needsUpdate) {
        counters.skipped += 1;
        console.log(`[skip]   ${pathway.id} slug=${slug}`);
        continue;
      }

      counters.updated += 1;
      console.log(`[update] ${pathway.id} slug=${slug}`);
      if (options.apply) {
        await prisma.flashcardDeck.update({
          where: { slug },
          data: {
            title,
            description,
            country: pathway.countryCode as CountryCode,
            tier: TierCode.NP,
            examFamily: ExamFamily.NP,
            pathwayId: pathway.id,
            visibility: FlashcardDeckVisibility.SUBSCRIBER,
            status: ContentStatus.PUBLISHED,
          },
        });
      }
    } catch (error) {
      counters.failed += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.error(`[failed] ${pathway.id} slug=${slug} error=${message}`);
    }
  }

  console.log("summary");
  console.log(JSON.stringify(counters, null, 2));
  if (!options.apply) {
    console.log("dry-run only: rerun with --apply to persist changes");
  }
}

main()
  .catch((error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`seed failed: ${message}`);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
