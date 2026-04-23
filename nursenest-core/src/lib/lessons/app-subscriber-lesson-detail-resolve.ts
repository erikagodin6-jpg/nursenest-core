import type { CountryCode, Prisma, TierCode } from "@prisma/client";
import { ContentStatus } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { prisma } from "@/lib/db";
import { appPathwayLessonVisibleToSubscriber } from "@/lib/lessons/app-pathway-lesson-list-scope";
import { getPathwayLesson } from "@/lib/lessons/pathway-lesson-loader";
import type { PathwayLessonRecord } from "@/lib/lessons/pathway-lesson-types";
import { PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP } from "@/lib/lessons/pathway-lesson-scale";
import { safeServerLog } from "@/lib/observability/safe-server-log";

/** Minimal `pathway_lessons` row fields used by `/app/lessons/[id]` pathway resolution. */
export type AppSubscriberPathwayLessonDetailRow = Pick<
  {
    id: string;
    pathwayId: string;
    slug: string;
    status: ContentStatus | null;
    countryCode: CountryCode | null;
    tierCode: TierCode | null;
  },
  "id" | "pathwayId" | "slug" | "status" | "countryCode" | "tierCode"
>;

export type AppSubscriberPathwayLessonDetailResolution =
  | { kind: "out_of_plan" }
  | { kind: "not_found" }
  | { kind: "pathway_ok"; record: PathwayLessonRecord; pathwayId: string };

/**
 * Same pathway contract as `/app/lessons/[id]`: entitlement + learner path gate, then
 * {@link getPathwayLesson} for `pathwayId` + `slug` + marketing locale (canonical learner lesson identity).
 */
export async function resolveAppSubscriberPathwayLessonForDetail(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  pwRow: AppSubscriberPathwayLessonDetailRow;
}): Promise<AppSubscriberPathwayLessonDetailResolution> {
  if (!(await appPathwayLessonVisibleToSubscriber(args.entitlement, args.pwRow, args.learnerPath))) {
    return { kind: "out_of_plan" };
  }
  const record = await getPathwayLesson(args.pwRow.pathwayId, args.pwRow.slug, args.marketingLocale);
  if (!record) return { kind: "not_found" };
  return { kind: "pathway_ok", record, pathwayId: args.pwRow.pathwayId };
}

export async function isAppSubscriberPathwayLessonRowResolvableForDetail(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  row: AppSubscriberPathwayLessonDetailRow;
}): Promise<boolean> {
  const r = await resolveAppSubscriberPathwayLessonForDetail(args);
  return r.kind === "pathway_ok";
}

const hubResolverMemo = new Map<string, Promise<boolean>>();

function hubResolverMemoKey(row: AppSubscriberPathwayLessonDetailRow): string {
  return `${row.id}`;
}

async function isAppSubscriberPathwayLessonRowResolvableForDetailMemoized(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  row: AppSubscriberPathwayLessonDetailRow;
}): Promise<boolean> {
  const k = hubResolverMemoKey(args.row);
  const hit = hubResolverMemo.get(k);
  if (hit) return hit;
  const p = isAppSubscriberPathwayLessonRowResolvableForDetail(args);
  hubResolverMemo.set(k, p);
  return p;
}

/** Hub card row shape — matches `/app/lessons` pathway branch `select`. */
export type AppSubscriberPathwayHubListRow = AppSubscriberPathwayLessonDetailRow & {
  title: string;
  seoDescription: string;
  topic: string;
  bodySystem: string;
  updatedAt: Date;
  topicSlug: string;
  previewSectionCount: number;
  seoTitle: string;
  locale: string;
};

/**
 * Walks `pathway_lessons` in hub order and keeps only rows that {@link resolveAppSubscriberPathwayLessonForDetail}
 * would accept (same as `/app/lessons/[id]`). Computes an exact resolvable total when the scan finishes before the cap.
 */
export async function paginatePathwayLessonsForAppSubscriberHubMatchingDetailResolver(args: {
  where: Prisma.PathwayLessonWhereInput;
  page: number;
  pageSize: number;
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
}): Promise<{
  rows: AppSubscriberPathwayHubListRow[];
  totalResolvable: number;
  scanCapped: boolean;
  dbRowsScanned: number;
}> {
  hubResolverMemo.clear();

  const page = Math.max(1, args.page);
  const pageSize = Math.max(1, args.pageSize);
  const start = (page - 1) * pageSize;

  const pageRows: AppSubscriberPathwayHubListRow[] = [];
  let resolvableIndex = 0;
  let dbRowsScanned = 0;
  let scanCapped = false;

  const batchSize = 80;

  while (dbRowsScanned < PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
    const take = Math.min(batchSize, PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP - dbRowsScanned);
    const batch = await prisma.pathwayLesson.findMany({
      where: args.where,
      select: {
        id: true,
        title: true,
        seoDescription: true,
        topic: true,
        bodySystem: true,
        slug: true,
        pathwayId: true,
        updatedAt: true,
        topicSlug: true,
        previewSectionCount: true,
        seoTitle: true,
        locale: true,
        status: true,
        countryCode: true,
        tierCode: true,
      },
      orderBy: { updatedAt: "desc" },
      skip: dbRowsScanned,
      take,
    });

    if (batch.length === 0) break;

    const flags = await Promise.all(
      batch.map((row) =>
        isAppSubscriberPathwayLessonRowResolvableForDetailMemoized({
          entitlement: args.entitlement,
          learnerPath: args.learnerPath,
          marketingLocale: args.marketingLocale,
          row,
        }),
      ),
    );

    for (let i = 0; i < batch.length; i++) {
      if (!flags[i]) continue;
      if (resolvableIndex >= start && pageRows.length < pageSize) {
        pageRows.push(batch[i] as AppSubscriberPathwayHubListRow);
      }
      resolvableIndex++;
    }

    dbRowsScanned += batch.length;

    if (batch.length < take) break;

    if (dbRowsScanned >= PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
      const more = await prisma.pathwayLesson.findFirst({
        where: args.where,
        select: { id: true },
        skip: dbRowsScanned,
      });
      if (more) {
        scanCapped = true;
        safeServerLog("page_lessons", "app_lessons_hub_pathway_detail_resolver_scan_capped", {
          dbRowsScanned: String(dbRowsScanned),
          resolvableCounted: String(resolvableIndex),
        });
      }
      break;
    }
  }

  return {
    rows: pageRows,
    totalResolvable: resolvableIndex,
    scanCapped,
    dbRowsScanned,
  };
}
