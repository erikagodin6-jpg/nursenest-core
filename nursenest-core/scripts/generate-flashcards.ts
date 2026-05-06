#!/usr/bin/env tsx
import "../src/lib/db/script-env-bootstrap";

import type { AccessScope } from "../src/lib/entitlements/resolve-entitlement";
import {
  MIN_FLASHCARDS_PER_CATEGORY,
  enforceFlashcardCategoryMinimums,
} from "../src/lib/flashcards/generate-flashcards";

function readPositiveIntFlag(name: string, fallback: number): number {
  const prefix = `--${name}=`;
  const raw = process.argv.find((arg) => arg.startsWith(prefix))?.slice(prefix.length);
  if (!raw) return fallback;
  const parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function main() {
  const [{ CountryCode, TierCode }, { prisma }] = await Promise.all([
    import("@prisma/client"),
    import("./lib/prisma-script-client"),
  ]);
  const ADMIN_FLASHCARD_GENERATION_SCOPE: AccessScope = {
    hasAccess: true,
    reason: "admin_override",
    tier: TierCode.RN,
    country: CountryCode.CA,
    alliedCareer: null,
  };
  try {
    const dryRun = process.argv.includes("--dry-run");
    const minimumPerCategory = readPositiveIntFlag("min", MIN_FLASHCARDS_PER_CATEGORY);
    const summary = await enforceFlashcardCategoryMinimums({
      prisma,
      entitlement: ADMIN_FLASHCARD_GENERATION_SCOPE,
      minimumPerCategory,
      dryRun,
    });

    console.log(
      JSON.stringify(
        {
          dryRun,
          minimumPerCategory,
          totalFlashcardsGenerated: summary.totalGenerated,
          categoriesFilled: summary.categoriesFilled,
          categoriesStillBelowThreshold: summary.categoriesStillBelowThreshold,
        },
        null,
        2,
      ),
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
