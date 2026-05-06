/**
 * Phase 1B: bounded parity audit — pathways where CAT practice pool has rows but flashcards exam
 * inventory (`loadFlashcardsExamInventoryForPathway`) reports zero total (unexpected drift).
 *
 * - Static checks (always): shared SQL gates appear in CAT pool + flashcard learner exam SQL.
 * - DB checks (optional): requires DATABASE_URL + reachable DB (same harness as `audit:core-apis`).
 *
 * **Exception list**: pathways intentionally allowed to diverge (keep small; document why inline).
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { CountryCode, Prisma, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadFlashcardsExamInventoryForPathway } from "@/lib/flashcards/load-flashcards-exam-inventory.server";
import { fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";

/** Pathway ids allowed to show CAT pool > 0 while flashcards SQL inventory is 0 (document each). */
const FLASHCARDS_INVENTORY_PARITY_EXCEPTIONS: readonly string[] = [
  // Example: "xx-yy-exam" — add only with engineering note in PR when data model intentionally diverges.
];

const AUDIT_USER_ID = "audit_flashcards_inventory_parity_script";

function subscriberScopeForPathway(pathway: { stripeTier: TierCode; countryCode: CountryCode }): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: pathway.stripeTier,
    country: pathway.countryCode,
    alliedCareer: null,
  };
}

/** Same bounded core set as `scripts/audit-core-apis.mts` — extend only with care. */
const CORE_PATHWAYS = ["us-rn-nclex-rn", "us-lpn-nclex-pn", "ca-rpn-rex-pn", "us-np-fnp"] as const;

function staticSqlGateParity(): { ok: boolean; failures: string[] } {
  const failures: string[] = [];
  const appRoot = join(process.cwd(), "src");
  const cat = readFileSync(join(appRoot, "lib/practice-tests/cat-pool.ts"), "utf8");
  const flashSql = readFileSync(join(appRoot, "lib/flashcards/flashcard-learner-exam-pool-sql.ts"), "utf8");
  const must = [
    ["cat-pool.ts", cat, "NON_ECG_PRACTICE_EXAM_WHERE"],
    ["cat-pool.ts", cat, "generalStudyBankModuleSurfaceWhere"],
    ["flashcard-learner-exam-pool-sql.ts", flashSql, "GENERAL_STUDY_BANK_MODULE_SCOPE_SQL"],
    ["flashcard-learner-exam-pool-sql.ts", flashSql, "EXAM_QUESTION_NON_ECG_TAG_SQL"],
  ] as const;
  for (const [file, src, needle] of must) {
    if (!src.includes(needle)) failures.push(`${file}: missing ${needle}`);
  }
  return { ok: failures.length === 0, failures };
}

async function main() {
  const staticResult = staticSqlGateParity();
  console.log(
    JSON.stringify(
      { phase: "flashcards_inventory_parity", staticSqlGates: staticResult.ok ? "ok" : "failed", failures: staticResult.failures },
      null,
      2,
    ),
  );
  if (!staticResult.ok) {
    process.exitCode = 1;
    return;
  }

  if (!isDatabaseUrlConfigured()) {
    console.warn("[audit:flashcards-inventory-parity] DATABASE_URL not set — skipping DB parity (static checks only).");
    return;
  }

  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1 AS ok`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.warn("[audit:flashcards-inventory-parity] DB unreachable — skipping row parity:", msg.slice(0, 200));
    return;
  }

  const mismatches: string[] = [];
  const dbSkips: string[] = [];

  for (const pathwayId of CORE_PATHWAYS) {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) {
      mismatches.push(`missing_pathway:${pathwayId}`);
      continue;
    }
    if (FLASHCARDS_INVENTORY_PARITY_EXCEPTIONS.includes(pathwayId)) continue;

    const ent = subscriberScopeForPathway(pathway);
    try {
      const [catPool, inv] = await Promise.all([
        fetchCatPracticePool("audit-flashcards-inventory-parity", ent, {
          questionCount: 75,
          topicNames: [],
          difficultyMin: null,
          difficultyMax: null,
          selectionMode: "random",
          pathwayId,
          selectionStrictness: "soft",
        }),
        loadFlashcardsExamInventoryForPathway({
          userId: AUDIT_USER_ID,
          entitlement: ent,
          pathway,
        }),
      ]);

      const catRows = catPool.pool.length;
      const flashTotal = inv.ok ? inv.total : -1;

      if (catRows > 0 && flashTotal === 0 && !FLASHCARDS_INVENTORY_PARITY_EXCEPTIONS.includes(pathwayId)) {
        mismatches.push(`cat_pool_gt_0_but_flashcards_inventory_zero:${pathwayId}:cat=${catRows}`);
      }
      if (!inv.ok) {
        mismatches.push(`flashcards_inventory_load_failed:${pathwayId}:${inv.code}`);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      dbSkips.push(`${pathwayId}:${msg.slice(0, 160)}`);
    }
  }

  console.log(
    JSON.stringify(
      {
        databaseConnected: true,
        exceptions: FLASHCARDS_INVENTORY_PARITY_EXCEPTIONS,
        mismatches,
        dbSkips: dbSkips.length ? dbSkips : undefined,
      },
      null,
      2,
    ),
  );

  if (dbSkips.length === CORE_PATHWAYS.length) {
    console.warn(
      "[audit:flashcards-inventory-parity] WARN: DB parity could not run for any core pathway (schema drift or DB unreachable). Static SQL gate checks still ran.",
    );
  }

  if (mismatches.length > 0) {
    process.exitCode = 1;
  }
}

main().finally(() => prisma.$disconnect());
