import "server-only";

import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";

function printableDownloadGroupAllCount(row: {
  _count?: true | { _all?: number; id?: number; printableProductId?: number; userId?: number; pathwayId?: number; source?: number };
}): number {
  const c = row._count;
  if (!c || c === true) return 0;
  const v = (c as { _all?: number })._all;
  return typeof v === "number" ? v : 0;
}

export async function getPrintableProductAnalytics(productId: string) {
  const [total, bySource, uniqueUserGroups, lastDownload] = await Promise.all([
    prisma.printableDownloadEvent.count({ where: { printableProductId: productId } }),
    prisma.printableDownloadEvent.groupBy({
      by: ["source"],
      where: { printableProductId: productId },
      _count: { _all: true },
    }),
    prisma.printableDownloadEvent.groupBy({
      by: ["userId"],
      where: { printableProductId: productId, userId: { not: null } },
      _count: { _all: true },
    }),
    prisma.printableDownloadEvent.findFirst({
      where: { printableProductId: productId },
      orderBy: { downloadedAt: "desc" },
      select: { downloadedAt: true },
    }),
  ]);

  const byDay = await prisma.$queryRaw<{ day: string; downloads: bigint }[]>(Prisma.sql`
    SELECT to_char(date_trunc('day', downloaded_at), 'YYYY-MM-DD') AS day,
           COUNT(*)::bigint AS downloads
    FROM printable_download_events
    WHERE printable_product_id = ${productId}
    GROUP BY date_trunc('day', downloaded_at)
    ORDER BY date_trunc('day', downloaded_at) DESC
    LIMIT 90
  `);

  return {
    totalDownloads: total,
    uniqueUsersDownloaded: uniqueUserGroups.length,
    downloadsBySource: Object.fromEntries(
      bySource.map((r) => [r.source, printableDownloadGroupAllCount(r)]),
    ) as Record<string, number>,
    downloadsByDay: byDay.map((r) => ({
      day: r.day,
      downloads: Number(r.downloads),
    })),
    lastDownloadedAt: lastDownload?.downloadedAt?.toISOString() ?? null,
  };
}

export async function getPrintableAnalyticsSummary(where?: Prisma.PrintableDownloadEventWhereInput) {
  const [total, uniqueUserGroups, byProduct, byPathway, bySource] = await Promise.all([
    prisma.printableDownloadEvent.count({ where }),
    prisma.printableDownloadEvent.groupBy({
      by: ["userId"],
      where: { ...where, userId: { not: null } },
      _count: { _all: true },
    }),
    prisma.printableDownloadEvent.groupBy({
      by: ["printableProductId"],
      where,
      _count: { _all: true },
    }),
    prisma.printableDownloadEvent.groupBy({
      by: ["pathwayId"],
      where,
      _count: { _all: true },
    }),
    prisma.printableDownloadEvent.groupBy({
      by: ["source"],
      where,
      _count: { _all: true },
    }),
  ]);

  const byProductSorted = [...byProduct]
    .sort((a, b) => printableDownloadGroupAllCount(b) - printableDownloadGroupAllCount(a))
    .slice(0, 40);
  const byPathwaySorted = [...byPathway]
    .sort((a, b) => printableDownloadGroupAllCount(b) - printableDownloadGroupAllCount(a))
    .slice(0, 40);

  const productTitles =
    byProductSorted.length > 0
      ? await prisma.printableProduct.findMany({
          where: { id: { in: byProductSorted.map((r) => r.printableProductId) } },
          select: { id: true, title: true, slug: true },
        })
      : [];
  const titleById = new Map(productTitles.map((p) => [p.id, p]));

  const range = extractDownloadedAtRange(where);
  const downloadsByDay = range
    ? await prisma.$queryRaw<{ day: string; downloads: bigint }[]>(Prisma.sql`
        SELECT to_char(date_trunc('day', downloaded_at), 'YYYY-MM-DD') AS day,
               COUNT(*)::bigint AS downloads
        FROM printable_download_events
        WHERE downloaded_at >= ${range.gte} AND downloaded_at <= ${range.lte}
        GROUP BY date_trunc('day', downloaded_at)
        ORDER BY date_trunc('day', downloaded_at) DESC
        LIMIT 90
      `)
    : await prisma.$queryRaw<{ day: string; downloads: bigint }[]>(Prisma.sql`
        SELECT to_char(date_trunc('day', downloaded_at), 'YYYY-MM-DD') AS day,
               COUNT(*)::bigint AS downloads
        FROM printable_download_events
        GROUP BY date_trunc('day', downloaded_at)
        ORDER BY date_trunc('day', downloaded_at) DESC
        LIMIT 90
      `);

  return {
    totalDownloads: total,
    uniqueUsers: uniqueUserGroups.length,
    downloadsByDay: downloadsByDay.map((r) => ({
      day: r.day,
      downloads: Number(r.downloads),
    })),
    mostDownloaded: byProductSorted.map((r) => ({
      printableProductId: r.printableProductId,
      downloads: printableDownloadGroupAllCount(r),
      title: titleById.get(r.printableProductId)?.title ?? null,
      slug: titleById.get(r.printableProductId)?.slug ?? null,
    })),
    downloadsByPathway: byPathwaySorted.map((r) => ({
      pathwayId: r.pathwayId,
      downloads: printableDownloadGroupAllCount(r),
    })),
    downloadsBySource: Object.fromEntries(
      bySource.map((r) => [r.source, printableDownloadGroupAllCount(r)]),
    ) as Record<string, number>,
  };
}

function extractDownloadedAtRange(
  where?: Prisma.PrintableDownloadEventWhereInput,
): { gte: Date; lte: Date } | null {
  const d = where?.downloadedAt;
  if (!d || typeof d !== "object" || Array.isArray(d)) return null;
  const gte = (d as { gte?: Date }).gte;
  const lte = (d as { lte?: Date }).lte;
  if (gte instanceof Date && lte instanceof Date) return { gte, lte };
  return null;
}
