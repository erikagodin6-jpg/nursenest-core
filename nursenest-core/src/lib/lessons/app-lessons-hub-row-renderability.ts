/**
 * Subscriber `/app/lessons` hub — **single renderability contract** aligned with `/app/lessons/[id]`.
 *
 * Every hub source (`pathway_lessons`, `content_items`, `legacy_content_map`) must pass these predicates before
 * a row is emitted. Pathway rows use {@link resolveAppSubscriberPathwayLessonForDetail} — the same resolver as detail.
 *
 * `content_items` are **not** pathway lessons: detail resolves them only after `type: "lesson"` discovery plus
 * `lessonAccessWhere(entitlement)`. The hub must not treat a content row as interchangeable pathway identity or
 * infer pathway slug semantics from `content_items` ids — that is why we re-check the Prisma contract here instead
 * of trusting catalog list shape alone.
 */
import type { Prisma } from "@prisma/client";
import type { AccessScope } from "@/lib/entitlements/resolve-entitlement";
import { lessonAccessWhere } from "@/lib/entitlements/content-access-scope";
import { prisma } from "@/lib/db";
import {
  resolveAppSubscriberPathwayLessonForDetail,
  type AppSubscriberPathwayHubListRow,
  type AppSubscriberPathwayLessonDetailRow,
} from "@/lib/lessons/app-subscriber-lesson-detail-resolve";
import {
  canAccessLegacyContentMapLesson,
  getLegacyContentMapLessonById,
  listLegacyContentMapLessonsForScope,
  type LegacyContentMapListRow,
} from "@/lib/lessons/legacy-content-map-lessons";
import {
  CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP,
  PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP,
} from "@/lib/lessons/pathway-lesson-scale";
import {
  pickAppLessonsHubListSource,
  type AppLessonsHubListSource,
} from "@/lib/lessons/app-lessons-hub-list-source";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import {
  contentItemLessonAccessToHubRowResult,
  legacyLessonAccessToHubRowResult,
  pathwayResolutionToHubRowResult as pathwayResolutionToHubRowResultFold,
  type AppLessonsHubRowDropReason,
  type AppLessonsHubRowRenderabilityResult,
  type PathwayHubDetailFoldResolution,
} from "@/lib/lessons/app-lessons-hub-row-renderability.invariants";

export type { AppLessonsHubListSource };
export { pickAppLessonsHubListSource };

export type { AppLessonsHubRowDropReason, AppLessonsHubRowRenderabilityResult };
export { contentItemLessonAccessToHubRowResult, legacyLessonAccessToHubRowResult };

/** Re-export with Prisma row typing — implementation lives in {@link app-lessons-hub-row-renderability.invariants.ts}. */
export function pathwayResolutionToHubRowResult(
  r: { kind: "out_of_plan" } | { kind: "not_found" } | { kind: "pathway_ok"; pathwayId: string; record: unknown },
  pwRow: AppSubscriberPathwayLessonDetailRow,
): AppLessonsHubRowRenderabilityResult {
  return pathwayResolutionToHubRowResultFold(r as PathwayHubDetailFoldResolution, pwRow);
}

function bumpReason(map: Record<string, number>, reason: AppLessonsHubRowDropReason): void {
  map[reason] = (map[reason] ?? 0) + 1;
}

/**
 * Pathway hub row: same contract as `/app/lessons/[id]` when `id` is a `pathway_lessons.id`.
 */
export async function evaluateAppLessonsHubPathwayRowRenderability(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  row: AppSubscriberPathwayLessonDetailRow;
}): Promise<AppLessonsHubRowRenderabilityResult> {
  const r = await resolveAppSubscriberPathwayLessonForDetail({
    entitlement: args.entitlement,
    learnerPath: args.learnerPath,
    marketingLocale: args.marketingLocale,
    pwRow: args.row,
  });
  return pathwayResolutionToHubRowResult(r, args.row);
}

/**
 * `content_items` lesson row: mirrors `/app/lessons/[id]` content branch (`findFirst` type lesson, then entitlement row).
 */
export async function evaluateAppLessonsHubContentItemRowRenderability(args: {
  entitlement: AccessScope;
  id: string;
}): Promise<AppLessonsHubRowRenderabilityResult> {
  const id = args.id?.trim() ?? "";
  const contentLesson = id
    ? await prisma.contentItem.findFirst({
        where: { id, type: "lesson" },
        select: { id: true },
      })
    : null;
  const row = id
    ? await prisma.contentItem.findFirst({
        where: { AND: [{ id }, { type: "lesson" }, lessonAccessWhere(args.entitlement)] },
        select: { id: true },
      })
    : null;
  return contentItemLessonAccessToHubRowResult({
    id,
    lessonTypeExists: Boolean(contentLesson),
    entitledRowExists: Boolean(row),
  });
}

/**
 * Legacy monolith map row: same checks as `/app/lessons/[id]` legacy branch (`getLegacyContentMapLessonById` + tier gate).
 */
export async function evaluateAppLessonsHubLegacyRowRenderability(args: {
  entitlement: AccessScope;
  id: string;
}): Promise<AppLessonsHubRowRenderabilityResult> {
  const id = args.id?.trim() ?? "";
  if (!id) return { ok: false, source: "legacy_content_map", reason: "slug_invalid" };
  const lesson = await getLegacyContentMapLessonById(id);
  return legacyLessonAccessToHubRowResult({
    id,
    lessonHit: Boolean(lesson),
    canAccess: lesson ? canAccessLegacyContentMapLesson(args.entitlement, id, lesson) : false,
  });
}

const pathwayHubMemo = new Map<string, Promise<boolean>>();

function clearPathwayHubDetailMemo(): void {
  pathwayHubMemo.clear();
}

async function isPathwayHubRowRenderableMemoized(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  row: AppSubscriberPathwayLessonDetailRow;
}): Promise<boolean> {
  const k = args.row.id;
  const hit = pathwayHubMemo.get(k);
  if (hit) return hit;
  const p = evaluateAppLessonsHubPathwayRowRenderability(args).then((r) => r.ok);
  pathwayHubMemo.set(k, p);
  return p;
}

/**
 * Walks `pathway_lessons` in hub order and keeps only rows that pass {@link evaluateAppLessonsHubPathwayRowRenderability}
 * (same detail contract as `/app/lessons/[id]`).
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
  clearPathwayHubDetailMemo();
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
        isPathwayHubRowRenderableMemoized({
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
  return { rows: pageRows, totalResolvable: resolvableIndex, scanCapped, dbRowsScanned };
}

const contentHubMemo = new Map<string, Promise<boolean>>();

function clearContentHubDetailMemo(): void {
  contentHubMemo.clear();
}

async function isContentItemHubRowResolvableMemoized(args: {
  entitlement: AccessScope;
  id: string;
}): Promise<boolean> {
  const k = args.id;
  const hit = contentHubMemo.get(k);
  if (hit) return hit;
  const p = evaluateAppLessonsHubContentItemRowRenderability(args).then((r) => r.ok);
  contentHubMemo.set(k, p);
  return p;
}

/**
 * Paginates `content_items` lessons using the same renderability predicate as the hub (bounded scan).
 */
export async function paginateContentItemsForAppSubscriberHubMatchingDetailResolver(args: {
  where: Prisma.ContentItemWhereInput;
  page: number;
  pageSize: number;
  entitlement: AccessScope;
}): Promise<{
  rows: { id: string; title: string; summary: string | null }[];
  totalResolvable: number;
  scanCapped: boolean;
  dbRowsScanned: number;
}> {
  clearContentHubDetailMemo();
  const page = Math.max(1, args.page);
  const pageSize = Math.max(1, args.pageSize);
  const start = (page - 1) * pageSize;
  const pageRows: { id: string; title: string; summary: string | null }[] = [];
  let resolvableIndex = 0;
  let dbRowsScanned = 0;
  let scanCapped = false;
  const batchSize = 80;

  while (dbRowsScanned < CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
    const take = Math.min(batchSize, CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP - dbRowsScanned);
    const batch = await prisma.contentItem.findMany({
      where: args.where,
      select: { id: true, title: true, summary: true },
      orderBy: { updatedAt: "desc" },
      skip: dbRowsScanned,
      take,
    });
    if (batch.length === 0) break;
    const flags = await Promise.all(
      batch.map((row) => isContentItemHubRowResolvableMemoized({ entitlement: args.entitlement, id: row.id })),
    );
    for (let i = 0; i < batch.length; i++) {
      if (!flags[i]) continue;
      if (resolvableIndex >= start && pageRows.length < pageSize) {
        pageRows.push({ id: batch[i]!.id, title: batch[i]!.title, summary: batch[i]!.summary ?? null });
      }
      resolvableIndex++;
    }
    dbRowsScanned += batch.length;
    if (batch.length < take) break;
    if (dbRowsScanned >= CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
      const more = await prisma.contentItem.findFirst({
        where: args.where,
        select: { id: true },
        skip: dbRowsScanned,
      });
      if (more) {
        scanCapped = true;
        safeServerLog("page_lessons", "app_lessons_hub_content_detail_resolver_scan_capped", {
          dbRowsScanned: String(dbRowsScanned),
          resolvableCounted: String(resolvableIndex),
        });
      }
      break;
    }
  }
  return { rows: pageRows, totalResolvable: resolvableIndex, scanCapped, dbRowsScanned };
}

function filterLegacyRowsByQuery(rows: LegacyContentMapListRow[], q: string | null | undefined): LegacyContentMapListRow[] {
  const qn = q?.trim().toLowerCase() ?? "";
  if (qn.length === 0) return rows;
  return rows.filter((r) => {
    const s = (r.summary ?? "").toLowerCase();
    return r.title.toLowerCase().includes(qn) || s.includes(qn) || r.category.toLowerCase().includes(qn);
  });
}

/**
 * Legacy hub list: same ordering/filter as {@link paginateLegacyContentMapLessons}, but only rows that pass
 * {@link evaluateAppLessonsHubLegacyRowRenderability} are counted or returned (detail contract).
 */
export async function paginateLegacyContentMapLessonsForAppSubscriberHubMatchingDetailResolver(
  scope: AccessScope,
  page: number,
  pageSize: number,
  q?: string | null,
): Promise<{ total: number; page: number; pageCount: number; rows: LegacyContentMapListRow[] }> {
  const all = await listLegacyContentMapLessonsForScope(scope);
  const filtered = filterLegacyRowsByQuery(all, q);
  const resolvable: LegacyContentMapListRow[] = [];
  const batch = 64;
  for (let i = 0; i < filtered.length; i += batch) {
    const slice = filtered.slice(i, i + batch);
    const flags = await Promise.all(
      slice.map((r) => evaluateAppLessonsHubLegacyRowRenderability({ entitlement: scope, id: r.id }).then((x) => x.ok)),
    );
    for (let j = 0; j < slice.length; j++) {
      if (flags[j]) resolvable.push(slice[j]!);
    }
  }
  const total = resolvable.length;
  const pageCount = Math.max(1, Math.ceil(total / pageSize) || 1);
  const safePage = Math.min(Math.max(1, page), pageCount);
  const start = (safePage - 1) * pageSize;
  const rows = resolvable.slice(start, start + pageSize);
  return { total, page: safePage, pageCount, rows };
}

export type AppLessonsHubPreparedInventoryAuditReport = {
  listSource: AppLessonsHubListSource;
  /** Rows that would survive the renderability predicate over the scanned candidate set. */
  keptPreparedRowCount: number;
  droppedPreparedRowCount: number;
  dropReasonsBySource: Record<AppLessonsHubListSource, Partial<Record<AppLessonsHubRowDropReason, number>>>;
  dbRowsScanned: Partial<Record<AppLessonsHubListSource, number>>;
  scanCapped: Partial<Record<AppLessonsHubListSource, boolean>>;
};

/**
 * Bounded scan of the **same** Prisma-shaped candidates the hub page considers, classifying each row with
 * {@link evaluateAppLessonsHubPathwayRowRenderability} / content / legacy predicates. Used by release audits — not hot path.
 */
export async function scanAppLessonsHubCandidateInventoryWithDropReasons(args: {
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  pathwayWhereWithSafety: Prisma.PathwayLessonWhereInput;
  contentScopedWhere: Prisma.ContentItemWhereInput;
  pathwaySampleExists: boolean;
  contentTotalRaw: number;
  pathwayIdFilter: string | null | undefined;
}): Promise<AppLessonsHubPreparedInventoryAuditReport> {
  const listSource = pickAppLessonsHubListSource({
    pathwaySampleExists: args.pathwaySampleExists,
    contentTotal: args.contentTotalRaw,
    pathwayIdFilter: args.pathwayIdFilter,
  });
  const dropReasonsBySource: AppLessonsHubPreparedInventoryAuditReport["dropReasonsBySource"] = {
    pathway_lessons: {},
    content_items: {},
    legacy_content_map: {},
  };
  const dbRowsScanned: AppLessonsHubPreparedInventoryAuditReport["dbRowsScanned"] = {};
  const scanCapped: AppLessonsHubPreparedInventoryAuditReport["scanCapped"] = {};

  if (listSource === "pathway_lessons") {
    clearPathwayHubDetailMemo();
    let scanned = 0;
    let capped = false;
    const batchSize = 80;
    while (scanned < PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
      const take = Math.min(batchSize, PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP - scanned);
      const batch = await prisma.pathwayLesson.findMany({
        where: args.pathwayWhereWithSafety,
        select: {
          id: true,
          pathwayId: true,
          slug: true,
          status: true,
          countryCode: true,
          tierCode: true,
        },
        orderBy: { updatedAt: "desc" },
        skip: scanned,
        take,
      });
      if (batch.length === 0) break;
      for (const row of batch) {
        const ev = await evaluateAppLessonsHubPathwayRowRenderability({
          entitlement: args.entitlement,
          learnerPath: args.learnerPath,
          marketingLocale: args.marketingLocale,
          row,
        });
        if (!ev.ok) bumpReason(dropReasonsBySource.pathway_lessons, ev.reason);
      }
      scanned += batch.length;
      if (batch.length < take) break;
      if (scanned >= PATHWAY_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
        const more = await prisma.pathwayLesson.findFirst({
          where: args.pathwayWhereWithSafety,
          select: { id: true },
          skip: scanned,
        });
        if (more) capped = true;
        break;
      }
    }
    dbRowsScanned.pathway_lessons = scanned;
    scanCapped.pathway_lessons = capped;
  } else if (listSource === "content_items") {
    clearContentHubDetailMemo();
    let scanned = 0;
    let capped = false;
    const batchSize = 80;
    while (scanned < CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
      const take = Math.min(batchSize, CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP - scanned);
      const batch = await prisma.contentItem.findMany({
        where: args.contentScopedWhere,
        select: { id: true },
        orderBy: { updatedAt: "desc" },
        skip: scanned,
        take,
      });
      if (batch.length === 0) break;
      for (const row of batch) {
        const ev = await evaluateAppLessonsHubContentItemRowRenderability({
          entitlement: args.entitlement,
          id: row.id,
        });
        if (!ev.ok) bumpReason(dropReasonsBySource.content_items, ev.reason);
      }
      scanned += batch.length;
      if (batch.length < take) break;
      if (scanned >= CONTENT_ITEMS_APP_SUBSCRIBER_HUB_DETAIL_RESOLVER_SCAN_CAP) {
        const more = await prisma.contentItem.findFirst({
          where: args.contentScopedWhere,
          select: { id: true },
          skip: scanned,
        });
        if (more) capped = true;
        break;
      }
    }
    dbRowsScanned.content_items = scanned;
    scanCapped.content_items = capped;
  } else {
    const all = await listLegacyContentMapLessonsForScope(args.entitlement);
    const filtered = filterLegacyRowsByQuery(all, null);
    for (const row of filtered) {
      const ev = await evaluateAppLessonsHubLegacyRowRenderability({ entitlement: args.entitlement, id: row.id });
      if (!ev.ok) bumpReason(dropReasonsBySource.legacy_content_map, ev.reason);
    }
    dbRowsScanned.legacy_content_map = filtered.length;
  }

  const dr = dropReasonsBySource[listSource]!;
  const droppedPreparedRowCount = Object.values(dr).reduce((a, b) => a + (b ?? 0), 0);
  const scanned =
    listSource === "pathway_lessons"
      ? (dbRowsScanned.pathway_lessons ?? 0)
      : listSource === "content_items"
        ? (dbRowsScanned.content_items ?? 0)
        : (dbRowsScanned.legacy_content_map ?? 0);
  const keptPreparedRowCount = Math.max(0, scanned - droppedPreparedRowCount);

  return {
    listSource,
    keptPreparedRowCount,
    droppedPreparedRowCount,
    dropReasonsBySource,
    dbRowsScanned,
    scanCapped,
  };
}

export class AppLessonsHubPreparedRowUnresolvedError extends Error {
  constructor(
    message: string,
    readonly failures: { source: AppLessonsHubListSource; id: string }[],
  ) {
    super(message);
    this.name = "AppLessonsHubPreparedRowUnresolvedError";
  }
}

/**
 * After hub pagination, **hard-fail** if any prepared row does not re-resolve through the same detail predicates.
 */
export async function assertAppLessonsHubPreparedRowsResolveThroughDetailContract(args: {
  source: AppLessonsHubListSource;
  entitlement: AccessScope;
  learnerPath: string | null;
  marketingLocale: string | undefined;
  pathwayRows: AppSubscriberPathwayHubListRow[];
  contentRows: { id: string }[];
  legacyRows: LegacyContentMapListRow[];
}): Promise<void> {
  const failures: { source: AppLessonsHubListSource; id: string }[] = [];
  if (args.source === "pathway_lessons") {
    for (const row of args.pathwayRows) {
      const ev = await evaluateAppLessonsHubPathwayRowRenderability({
        entitlement: args.entitlement,
        learnerPath: args.learnerPath,
        marketingLocale: args.marketingLocale,
        row,
      });
      if (!ev.ok) failures.push({ source: "pathway_lessons", id: row.id });
    }
  } else if (args.source === "content_items") {
    for (const row of args.contentRows) {
      const ev = await evaluateAppLessonsHubContentItemRowRenderability({
        entitlement: args.entitlement,
        id: row.id,
      });
      if (!ev.ok) failures.push({ source: "content_items", id: row.id });
    }
  } else {
    for (const row of args.legacyRows) {
      const ev = await evaluateAppLessonsHubLegacyRowRenderability({
        entitlement: args.entitlement,
        id: row.id,
      });
      if (!ev.ok) failures.push({ source: "legacy_content_map", id: row.id });
    }
  }
  if (failures.length > 0) {
    throw new AppLessonsHubPreparedRowUnresolvedError(
      `app_lessons_hub_audit: ${failures.length} prepared row(s) failed detail contract re-check`,
      failures,
    );
  }
}
