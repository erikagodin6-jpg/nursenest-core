/**
 * Ops / CI diagnostic: DB connectivity + core study content pools (no HTTP server).
 *
 * Usage (from `nursenest-core/`):
 *   npm run audit:core-apis
 */
import { CountryCode, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot";
import { loadExamQuestionHubInventoryForPathway } from "@/lib/flashcards/flashcard-exam-bank-hub-inventory";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";

function subscriberRnUs(): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: CountryCode.US,
    alliedCareer: null,
  };
}

async function main() {
  const out: Record<string, unknown> = {
    databaseConfigured: isDatabaseUrlConfigured(),
    flashcards: { status: "skipped" as string, detail: "" },
    practice: { status: "skipped" as string, detail: "" },
    cat: { status: "skipped" as string, detail: "" },
    blog: { status: "skipped" as string, detail: "Use POST /api/admin/blog/generate-ai with admin auth" },
    failing: null as string | null,
  };

  if (!isDatabaseUrlConfigured()) {
    out.flashcards = { status: "error", detail: "DATABASE_URL not set" };
    out.practice = out.flashcards;
    out.cat = out.flashcards;
    out.failing = "database_url_unset";
    console.log(JSON.stringify(out, null, 2));
    process.exitCode = 1;
    return;
  }

  try {
    await prisma.$queryRaw(Prisma.sql`SELECT 1 AS ok`);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    out.failing = `db_ping:${msg.slice(0, 200)}`;
    console.log(JSON.stringify({ ...out, databaseConnected: false }, null, 2));
    process.exitCode = 1;
    return;
  }

  const pathwayId = "us-rn-nclex-rn";
  const pathway = getExamPathwayById(pathwayId);
  const ent = subscriberRnUs();

  if (!pathway) {
    out.failing = "pathway_catalog_missing";
    console.log(JSON.stringify(out, null, 2));
    process.exitCode = 1;
    return;
  }

  const [hubInv, questionSnapshot] = await Promise.all([
    loadExamQuestionHubInventoryForPathway(ent, pathwayId, buildGlobalExamContext(pathwayId, "en"), null),
    loadPathwayQuestionBankSnapshot(pathwayId),
  ]);

  const marketingScoped =
    questionSnapshot.status === "ok" ? questionSnapshot.pathwayScopedCount : null;
  const marketingAdaptive =
    questionSnapshot.status === "ok" ? questionSnapshot.adaptiveEligibleCount : null;

  out.flashcards = {
    status: hubInv.total > 0 ? "ok" : "empty_pool",
    examQuestionHubTotal: hubInv.total,
    pathwayId,
  };
  out.practice = {
    status: hubInv.total > 0 ? "ok" : "empty_pool",
    examQuestionDiscoveryHubTotal: hubInv.total,
    marketingPathwayScopedNonEcg: marketingScoped,
    pathwayId,
  };
  out.cat = {
    status:
      marketingAdaptive != null && marketingAdaptive >= 30
        ? "ok"
        : marketingAdaptive != null && marketingAdaptive > 0
          ? "low_pool"
          : "empty_or_unavailable",
    adaptiveEligibleCompleteMarketing: marketingAdaptive,
    marketingSnapshotStatus: questionSnapshot.status,
    minRecommended: 30,
    pathwayId,
  };

  if (hubInv.total === 0) {
    out.failing = "flashcard_exam_hub_zero_for_rn_pathway";
    process.exitCode = 1;
  } else if (questionSnapshot.status !== "ok") {
    out.failing = "pathway_question_snapshot_unavailable";
    process.exitCode = 1;
  } else if (questionSnapshot.adaptiveEligibleCount < 30) {
    out.failing = "cat_complete_pool_below_minimum";
    process.exitCode = 1;
  }

  console.log(JSON.stringify({ ...out, databaseConnected: true }, null, 2));
}

main().finally(() => prisma.$disconnect());
