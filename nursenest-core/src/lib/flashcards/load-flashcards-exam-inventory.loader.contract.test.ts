/**
 * Contracts: flashcards exam inventory loader uses aggregate queries (no row hydration)
 * and keeps CAT-aligned WHERE construction.
 */
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, it } from "node:test";

const appRoot = join(process.cwd(), "src");

describe("loadFlashcardsExamInventory loader contracts", () => {
  it("uses bounded $queryRaw COUNT + GROUP BY and avoids findMany for hub inventory", () => {
    const src = readFileSync(join(appRoot, "lib/flashcards/load-flashcards-exam-inventory.server.ts"), "utf8");
    assert.match(src, /\$queryRaw/);
    assert.match(src, /SELECT COUNT\(\*\)/i);
    assert.match(src, /GROUP BY body_system, topic/i);
    assert.match(src, /flashcardLearnerExamPoolWhereSql/);
    assert.doesNotMatch(src, /examQuestion\.findMany/);
  });

  it("keeps legacy canonical Prisma count for diagnostics only", () => {
    const src = readFileSync(join(appRoot, "lib/flashcards/load-flashcards-exam-inventory.server.ts"), "utf8");
    assert.match(src, /getCanonicalExamQuestionWhereForPathway/);
    assert.match(src, /legacyCanonicalPrismaPoolCount/);
  });

  it("preserves User coalesce when tier/country missing on entitlement", () => {
    const src = readFileSync(join(appRoot, "lib/flashcards/load-flashcards-exam-inventory.server.ts"), "utf8");
    assert.match(src, /prisma\.user\.findUnique/);
    assert.match(src, /!tier\s*\|\|\s*!country/);
    assert.match(src, /tier\s*=\s*tier\s*\?\?\s*pathway\.stripeTier/);
    assert.match(src, /country\s*=\s*country\s*\?\?\s*pathway\.countryCode/);
  });
});

describe("flashcards inventory API route contracts", () => {
  it("requires subscriber session and pathwayId", () => {
    const src = readFileSync(join(appRoot, "app/api/flashcards/inventory/route.ts"), "utf8");
    assert.match(src, /requireSubscriberSession/);
    assert.match(src, /pathwayId/);
    assert.match(src, /diagnostics/);
    assert.doesNotMatch(src, /CRITICAL_EMPTY_POOL/);
  });
});
