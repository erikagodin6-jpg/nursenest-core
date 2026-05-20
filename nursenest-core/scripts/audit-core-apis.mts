/**
 * Ops / CI diagnostic: DB connectivity + core study content pools (no HTTP server).
 *
 * Usage (from `nursenest-core/`):
 *   npm run audit:core-apis
 */
import { BlogPostStatus, CountryCode, Prisma, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { prisma } from "@/lib/db";
import { isDatabaseUrlConfigured } from "@/lib/db/safe-database";
import { getExamPathwayById } from "@/lib/exam-pathways/exam-product-registry";
import { loadExamQuestionHubInventoryForPathway } from "@/lib/flashcards/flashcard-exam-bank-hub-inventory";
import { buildGlobalExamContext } from "@/lib/exam-context/exam-registry";
import { fetchCatPracticePool } from "@/lib/practice-tests/cat-pool";
import { loadPathwayQuestionBankSnapshot } from "@/lib/exam-pathways/pathway-question-bank-snapshot.server";

/** Match each pathway’s catalog tier/country so NP/PN pools are not falsely empty under an RN-only scope. */
function subscriberScopeForPathway(pathway: { stripeTier: TierCode; countryCode: CountryCode }): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: pathway.stripeTier,
    country: pathway.countryCode,
    alliedCareer: null,
  };
}

const CORE_PATHWAYS = [
  { id: "us-rn-nclex-rn", label: "US_RN_NCLEX_RN" },
  { id: "us-lpn-nclex-pn", label: "US_PN_NCLEX_PN" },
  { id: "ca-rpn-rex-pn", label: "CA_RPN_REX_PN" },
  { id: "us-np-fnp", label: "US_NP_FNP" },
] as const;

async function main() {
  const warnings: string[] = [];
  const out: Record<string, unknown> = {
    databaseConfigured: isDatabaseUrlConfigured(),
    flashcards: { status: "skipped" as string, detail: "" },
    practice: { status: "skipped" as string, detail: "" },
    cat: { status: "skipped" as string, detail: "" },
    blog: { status: "skipped" as string, detail: "" },
    failing: null as string | null,
    warnings,
    pathways: {} as Record<string, unknown>,
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

  const pathwayReports: Record<string, unknown> = {};
  let worstFlash = "ok";
  let worstPractice = "ok";
  let worstCat = "ok";
  let anyHubZero = false;

  for (const { id: pathwayId, label } of CORE_PATHWAYS) {
    const pathway = getExamPathwayById(pathwayId);
    if (!pathway) {
      pathwayReports[label] = { error: "pathway_not_in_catalog" };
      warnings.push(`missing_pathway:${pathwayId}`);
      continue;
    }

    const ent = subscriberScopeForPathway(pathway);
    const [hubInv, questionSnapshot, catPool] = await Promise.all([
      loadExamQuestionHubInventoryForPathway(ent, pathwayId, buildGlobalExamContext(pathwayId, "en"), null),
      loadPathwayQuestionBankSnapshot(pathwayId),
      fetchCatPracticePool("audit-core-apis", ent, {
        questionCount: 75,
        topicNames: [],
        difficultyMin: null,
        difficultyMax: null,
        selectionMode: "random",
        pathwayId,
        selectionStrictness: "soft",
      }),
    ]);

    const marketingScoped = questionSnapshot.status === "ok" ? questionSnapshot.pathwayScopedCount : null;
    const marketingAdaptive = questionSnapshot.status === "ok" ? questionSnapshot.adaptiveEligibleCount : null;
    const catPoolLen = catPool.pool.length;

    const flashStatus = hubInv.total > 0 ? "ok" : "empty_pool";
    const practiceStatus = hubInv.total > 0 ? "ok" : "empty_pool";
    const catStatus =
      catPoolLen >= 30 ? "ok" : catPoolLen > 0 ? "low_pool" : marketingAdaptive != null && marketingAdaptive > 0 ? "low_pool" : "empty_or_unavailable";

    if (flashStatus !== "ok") worstFlash = "empty_pool";
    if (practiceStatus !== "ok") worstPractice = "empty_pool";
    if (catStatus === "empty_or_unavailable") worstCat = "empty_or_unavailable";
    else if (catStatus === "low_pool" && worstCat === "ok") worstCat = "low_pool";

    if (hubInv.total === 0) anyHubZero = true;

    pathwayReports[label] = {
      pathwayId,
      flashcardExamHubTotal: hubInv.total,
      marketingPathwayScopedNonEcg: marketingScoped,
      marketingAdaptiveEligibleCompleteSample: marketingAdaptive,
      catPracticePoolRows: catPoolLen,
      catPoolBuildMeta: catPool.buildMeta,
    };

    if (questionSnapshot.status !== "ok") {
      warnings.push(`pathway_question_snapshot_unavailable:${pathwayId}`);
    } else if (questionSnapshot.adaptiveEligibleCount < 30) {
      warnings.push(`marketing_cat_complete_pool_low:${pathwayId}:${questionSnapshot.adaptiveEligibleCount}`);
    }
    if (catPoolLen < 30 && catPoolLen > 0) {
      warnings.push(`cat_practice_pool_lt_30:${pathwayId}:${catPoolLen}`);
    }
  }

  const primaryPathway = CORE_PATHWAYS[0].id;
  const primaryHub = pathwayReports[CORE_PATHWAYS[0].label] as { flashcardExamHubTotal?: number } | undefined;
  const primaryTotal = typeof primaryHub?.flashcardExamHubTotal === "number" ? primaryHub.flashcardExamHubTotal : 0;

  let blogPublished = 0;
  try {
    blogPublished = await prisma.blogPost.count({
      where: { postStatus: BlogPostStatus.PUBLISHED },
    });
  } catch {
    warnings.push("blog_published_count_failed");
  }

  out.pathways = pathwayReports;
  out.flashcards = {
    status: worstFlash,
    primaryPathway,
    examQuestionHubTotalPrimary: primaryTotal,
    note: "Per-pathway totals in `pathways`",
  };
  out.practice = {
    status: worstPractice,
    primaryPathway,
    note: "Linear practice uses same ExamQuestion pool as CAT (see catPracticePoolRows per pathway)",
  };
  out.cat = {
    status: worstCat,
    minRecommended: 30,
    note: "Uses fetchCatPracticePool (subscriber gates + non-ECG) per pathway",
  };
  out.blog = {
    status: blogPublished > 0 ? "ok" : "no_published_rows",
    publishedBlogPostCount: blogPublished,
    detail: "Generation requires admin + AI; row count verifies BlogPost table reachable",
  };

  if (anyHubZero) {
    out.failing = "flashcard_exam_hub_zero_for_at_least_one_core_pathway";
    process.exitCode = 1;
  } else if (worstCat === "empty_or_unavailable") {
    out.failing = "cat_practice_pool_zero_for_audited_pathways";
    process.exitCode = 1;
  }

  console.log(JSON.stringify({ ...out, databaseConnected: true }, null, 2));
}

main().finally(() => prisma.$disconnect());
