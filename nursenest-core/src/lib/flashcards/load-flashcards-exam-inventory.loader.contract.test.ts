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

  it("emits timed inventory telemetry and critical empty-pool signal in loader", () => {
    const src = readFileSync(join(appRoot, "lib/flashcards/load-flashcards-exam-inventory.server.ts"), "utf8");
    assert.match(src, /FLASHCARDS_CRITICAL_EMPTY_POOL/);
    assert.match(src, /exam_inventory_load_complete/);
  });
});

describe("flashcards inventory API route contracts", () => {
  it("requires subscriber session and pathwayId", () => {
    const src = readFileSync(join(appRoot, "app/api/flashcards/inventory/route.ts"), "utf8");
    assert.match(src, /requireSubscriberSession/);
    assert.match(src, /pathwayId/);
    assert.match(src, /diagnostics/);
    assert.match(src, /inventory_route_ok/);
  });

  it("returns subscription gate before inventory load when hasAccess is false", () => {
    const src = readFileSync(join(appRoot, "app/api/flashcards/inventory/route.ts"), "utf8");
    const tryIdx = src.indexOf("try {");
    assert.ok(tryIdx > 0);
    const tryBody = src.slice(tryIdx, src.indexOf("} catch"));
    const gateIdx = tryBody.indexOf("!gate.entitlement.hasAccess");
    const loadIdx = tryBody.indexOf("await loadFlashcardsExamInventoryForPathway");
    assert.ok(gateIdx > 0 && loadIdx > 0, "expected gate + loader call inside handler try");
    assert.ok(gateIdx < loadIdx, "subscription gate must run before loadFlashcardsExamInventoryForPathway");
  });
});

describe("flashcards exam inventory loader access vs pool SQL ordering", () => {
  it("returns access denial before $queryRaw pool aggregates", () => {
    const src = readFileSync(join(appRoot, "lib/flashcards/load-flashcards-exam-inventory.server.ts"), "utf8");
    const poolScopeIdx = src.indexOf("if (!poolScope)");
    const queryIdx = src.indexOf("$queryRaw");
    assert.ok(poolScopeIdx > 0 && queryIdx > 0);
    assert.ok(poolScopeIdx < queryIdx, "must short-circuit denied access before Prisma aggregate queries");
  });
});
