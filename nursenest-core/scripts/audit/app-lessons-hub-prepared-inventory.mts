#!/usr/bin/env npx tsx
/**
 * Audit: subscriber `/app/lessons` prepared inventory — same candidate filters as the page, same renderability
 * predicates, then hard-fail if any first-page row fails a detail-contract re-check.
 *
 * Usage (requires DATABASE_URL, optional legacy bundles):
 *   cd nursenest-core && npx tsx scripts/audit/app-lessons-hub-prepared-inventory.mts
 *
 * Env:
 *   AUDIT_APP_LESSONS_HUB_USER_ID — required subscriber user id (must have hasAccess for meaningful audit)
 */
import { prisma } from "@/lib/db";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { resolveEntitlementForPage } from "@/lib/entitlements/resolve-entitlement-for-page";
import { getMarketingLocaleForDefaultRoute } from "@/lib/i18n/marketing-locale-server";
import { pathwayLessonsAppListWhereWithTopicFilter } from "@/lib/lessons/app-pathway-lesson-list-scope";
import {
  assertAppLessonsHubPreparedRowsResolveThroughDetailContract,
  paginateContentItemsForAppSubscriberHubMatchingDetailResolver,
  paginateLegacyContentMapLessonsForAppSubscriberHubMatchingDetailResolver,
  paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver,
  pickAppLessonsHubListSource,
  scanAppLessonsHubCandidateInventoryWithDropReasons,
} from "@/lib/lessons/app-lessons-hub-row-renderability";

/** Keep in sync with `app/(learner)/lessons/page.tsx` — pathway hub safety gate. */
function pathwayLessonSafetyGateWhere() {
  return {
    AND: [
      { title: { not: "" } },
      { slug: { not: "" } },
      { topic: { not: "" } },
      { topicSlug: { not: "" } },
      { previewSectionCount: { gt: 0 } },
      {
        OR: [{ seoDescription: { not: "" } }, { seoTitle: { not: "" } }],
      },
      {
        NOT: [
          { title: { contains: "placeholder", mode: "insensitive" as const } },
          { title: { contains: "tbd", mode: "insensitive" as const } },
          { slug: { startsWith: "tmp-" } },
          { slug: { startsWith: "draft-" } },
        ],
      },
    ],
  };
}

async function main() {
  const userId = process.env.AUDIT_APP_LESSONS_HUB_USER_ID?.trim();
  if (!userId) {
    console.error("AUDIT_APP_LESSONS_HUB_USER_ID is required");
    process.exit(1);
  }
  const entitlement = await resolveEntitlementForPage(userId);
  if (entitlement === "error" || !entitlement.hasAccess) {
    console.error("User must resolve to a subscriber entitlement with hasAccess");
    process.exit(1);
  }
  const learnerPathRow = await prisma.user.findUnique({ where: { id: userId }, select: { learnerPath: true } });
  const learnerPath = learnerPathRow?.learnerPath ?? null;
  const marketingLocale = await getMarketingLocaleForDefaultRoute();
  const contentWhere = lessonAccessWhere(entitlement);
  const contentTotal = await prisma.contentItem.count({ where: contentWhere });
  const pathwayWhere = await pathwayLessonsAppListWhereWithTopicFilter(entitlement, learnerPath, {});
  const pathwayWhereWithSafety = { AND: [pathwayWhere, pathwayLessonSafetyGateWhere()] };
  const pathwaySample = await prisma.pathwayLesson.findFirst({
    where: pathwayWhereWithSafety,
    select: { id: true },
  });
  const listSource = pickAppLessonsHubListSource({
    pathwaySampleExists: Boolean(pathwaySample),
    contentTotal,
    pathwayIdFilter: null,
  });

  const scan = await scanAppLessonsHubCandidateInventoryWithDropReasons({
    entitlement,
    learnerPath,
    marketingLocale,
    pathwayWhereWithSafety,
    contentScopedWhere: contentWhere,
    pathwaySampleExists: Boolean(pathwaySample),
    contentTotalRaw: contentTotal,
    pathwayIdFilter: null,
  });

  console.log(
    JSON.stringify(
      {
        listSource: scan.listSource,
        keptPreparedRowCount: scan.keptPreparedRowCount,
        droppedPreparedRowCount: scan.droppedPreparedRowCount,
        dropReasonsBySource: scan.dropReasonsBySource[scan.listSource],
        dbRowsScanned: scan.dbRowsScanned,
        scanCapped: scan.scanCapped,
      },
      null,
      2,
    ),
  );

  const pageSize = 50;
  if (listSource === "pathway_lessons") {
    const paginated = await paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver({
      where: pathwayWhereWithSafety,
      page: 1,
      pageSize,
      entitlement,
      learnerPath,
      marketingLocale,
    });
    await assertAppLessonsHubPreparedRowsResolveThroughDetailContract({
      source: "pathway_lessons",
      entitlement,
      learnerPath,
      marketingLocale,
      pathwayRows: paginated.rows,
      contentRows: [],
      legacyRows: [],
    });
  } else if (listSource === "content_items") {
    const paginated = await paginateContentItemsForAppSubscriberHubMatchingDetailResolver({
      where: contentWhere,
      page: 1,
      pageSize,
      entitlement,
    });
    await assertAppLessonsHubPreparedRowsResolveThroughDetailContract({
      source: "content_items",
      entitlement,
      learnerPath,
      marketingLocale,
      pathwayRows: [],
      contentRows: paginated.rows,
      legacyRows: [],
    });
  } else {
    const paginated = await paginateLegacyContentMapLessonsForAppSubscriberHubMatchingDetailResolver(
      entitlement,
      1,
      pageSize,
      null,
    );
    await assertAppLessonsHubPreparedRowsResolveThroughDetailContract({
      source: "legacy_content_map",
      entitlement,
      learnerPath,
      marketingLocale,
      pathwayRows: [],
      contentRows: [],
      legacyRows: paginated.rows,
    });
  }

  console.log("app-lessons-hub-prepared-inventory: OK — first page re-check passed");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
