/**
 * Hermetic inventory loader checks (no Stripe; Prisma mocked for happy path).
 * Run: `node --import tsx --test src/lib/flashcards/load-flashcards-exam-inventory.server.test.ts`
 */
import "../../../scripts/stub-server-only.cjs";
import assert from "node:assert/strict";
import { afterEach, describe, it, mock } from "node:test";
import { CountryCode, PrismaClient, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { prisma } from "@/lib/db";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadFlashcardsExamInventoryForPathway } from "./load-flashcards-exam-inventory.server";

const prismaProto = PrismaClient.prototype as unknown as {
  $queryRaw: (...args: unknown[]) => Promise<unknown>;
};

const userId = "usr_flash_inv_loader_test";

function paidUsRnEntitlement(): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: CountryCode.US,
    alliedCareer: null,
  };
}

afterEach(() => {
  mock.restoreAll();
});

describe("loadFlashcardsExamInventoryForPathway", () => {
  it("returns pathway_not_entitled before any aggregate when subscription gate denies access", async () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    let queryRawCalls = 0;
    mock.method(prismaProto, "$queryRaw", async () => {
      queryRawCalls += 1;
      return [{ n: 1n }];
    });

    const out = await loadFlashcardsExamInventoryForPathway({
      userId,
      entitlement: {
        hasAccess: false,
        reason: "no_access",
        tier: TierCode.RN,
        country: CountryCode.US,
        alliedCareer: null,
      },
      pathway,
    });

    assert.equal(out.ok, false);
    if (out.ok) return;
    assert.equal(out.code, "pathway_not_entitled");
    assert.equal(queryRawCalls, 0, "pool SQL must not run when entitlement.hasAccess is false");
  });

  it("does not surface a false zero pool when aggregates return a non-zero exam row count", async () => {
    const pathway = getExamPathwayById("us-rn-nclex-rn");
    assert.ok(pathway);
    let qr = 0;
    mock.method(prismaProto, "$queryRaw", async () => {
      qr += 1;
      if (qr === 1) return [{ n: 1842n }];
      return [{ bodySystem: "cardiovascular", topic: "dysrhythmias", cnt: 1842n }];
    });

    const flashDelegate = prisma.flashcard as unknown as { count: (...args: unknown[]) => Promise<number> };
    const examDelegate = prisma.examQuestion as unknown as { count: (...args: unknown[]) => Promise<number> };
    const origFlashCount = flashDelegate.count.bind(flashDelegate);
    const origExamCount = examDelegate.count.bind(examDelegate);
    flashDelegate.count = async () => 0;
    examDelegate.count = async () => 1800;

    try {
      const out = await loadFlashcardsExamInventoryForPathway({
        userId,
        entitlement: paidUsRnEntitlement(),
        pathway,
      });

      assert.equal(out.ok, true);
      if (!out.ok) return;
      assert.equal(out.total, 1842);
      assert.ok(out.categoryOptions.length > 0);
      assert.equal(out.diagnostics.examQuestionSqlPoolCount, 1842);
    } finally {
      flashDelegate.count = origFlashCount;
      examDelegate.count = origExamCount;
    }
  });
});
