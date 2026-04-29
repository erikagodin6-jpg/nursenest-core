#!/usr/bin/env node
/**
 * Local performance gate for `/app/lessons` hub data path (subscriber pathway list + detail resolver).
 * Fails when the representative hub pagination exceeds 5s (cold-ish run in dev/CI with DATABASE_URL).
 */
import { performance } from "node:perf_hooks";
import { CountryCode, TierCode } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/user-access-types";
import { pathwayLessonAppHubSafetyPrismaWhere } from "@/lib/lessons/app-lessons-hub-pathway-safety-where";
import { paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver } from "@/lib/lessons/app-lessons-hub-row-renderability";
import { pathwayLessonsAppListWhereWithTopicFilter } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import {
  getCatalogLessonsRaw,
  getCatalogPathwayLessonsSync,
  resetCatalogLessonsRawMergeCacheForTests,
} from "@/lib/lessons/pathway-lesson-catalog-sync";

const MAX_MS = 5000;
const PATHWAY_ID = "ca-rn-nclex-rn";

function paidRnCaScope(): AccessScope {
  return {
    hasAccess: true,
    reason: "active_subscription",
    tier: TierCode.RN,
    country: CountryCode.CA,
    alliedCareer: null,
  };
}

async function main(): Promise<void> {
  const tCatalog0 = performance.now();
  resetCatalogLessonsRawMergeCacheForTests();
  const first = getCatalogLessonsRaw(PATHWAY_ID).length;
  const tCatalog1 = performance.now();
  const second = getCatalogLessonsRaw(PATHWAY_ID).length;
  const tCatalog2 = performance.now();
  const buildMs = Math.round(tCatalog1 - tCatalog0);
  const cachedMs = Math.round(tCatalog2 - tCatalog1);
  console.info(
    `[lessons-perf] verify_catalog_merge pathway=${PATHWAY_ID} first_build_ms=${buildMs} second_lookup_ms=${cachedMs} rows=${first}/${second}`,
  );
  if (second !== first) {
    console.error("[verify:lessons-performance] catalog row count mismatch between calls");
    process.exitCode = 1;
    return;
  }
  if (cachedMs > 50) {
    console.error(
      `[verify:lessons-performance] expected cached getCatalogLessonsRaw to be cheap; got ${cachedMs}ms (regression in merge cache?)`,
    );
    process.exitCode = 1;
    return;
  }

  resetCatalogLessonsRawMergeCacheForTests();
  const norm0 = performance.now();
  const n1 = getCatalogPathwayLessonsSync(PATHWAY_ID).length;
  const norm1 = performance.now();
  const n2 = getCatalogPathwayLessonsSync(PATHWAY_ID).length;
  const norm2 = performance.now();
  const normBuildMs = Math.round(norm1 - norm0);
  const normCachedMs = Math.round(norm2 - norm1);
  console.info(
    `[lessons-perf] verify_normalized_catalog pathway=${PATHWAY_ID} first_build_ms=${normBuildMs} second_lookup_ms=${normCachedMs} rows=${n1}/${n2}`,
  );
  if (n1 !== n2) {
    console.error("[verify:lessons-performance] normalized catalog row count mismatch between calls");
    process.exitCode = 1;
    return;
  }
  if (normCachedMs > 50) {
    console.error(
      `[verify:lessons-performance] expected cached getCatalogPathwayLessonsSync to be cheap; got ${normCachedMs}ms`,
    );
    process.exitCode = 1;
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.info("[verify:lessons-performance] skip hub pagination (no DATABASE_URL); catalog merge check passed.");
    return;
  }

  const entitlement = paidRnCaScope();
  const marketingLocale = await getMarketingLocaleForDefaultRoute();
  const pathwayWhere = await pathwayLessonsAppListWhereWithTopicFilter(entitlement, PATHWAY_ID, {
    topic: null,
    topicSlug: null,
    pathwayId: PATHWAY_ID,
  });
  const pathwayWhereWithSafety = {
    AND: [pathwayWhere, pathwayLessonAppHubSafetyPrismaWhere()],
  };

  const t0 = performance.now();
  const page = await paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver({
    where: pathwayWhereWithSafety,
    page: 1,
    pageSize: 24,
    entitlement,
    learnerPath: PATHWAY_ID,
    marketingLocale,
  });
  const ms = Math.round(performance.now() - t0);
  console.info(
    `[lessons-perf] verify_hub_pagination pathway=${PATHWAY_ID} duration_ms=${ms} rows=${page.rows.length} totalResolvable=${page.totalResolvable} scanCapped=${page.scanCapped}`,
  );
  if (ms > MAX_MS) {
    console.error(`[verify:lessons-performance] hub pagination exceeded ${MAX_MS}ms (got ${ms}ms)`);
    process.exitCode = 1;
    return;
  }
  if (page.rows.length === 0) {
    console.error("[verify:lessons-performance] expected at least one pathway lesson row for ca-rn-nclex-rn (empty DB seed?)");
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
