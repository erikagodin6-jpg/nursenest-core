import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { getPrintableProductAnalytics } from "@/lib/printables/printable-analytics.server";
import { assertPrintableAdminSurface } from "@/lib/printables/printable-admin-gate";
import { mergeSubscriberPrivateCacheHeaders } from "@/lib/http/subscriber-api-cache";

export const runtime = "nodejs";

const PRIVATE = { headers: mergeSubscriberPrivateCacheHeaders() } as const;

export async function GET(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const surface = assertPrintableAdminSurface();
  if (surface) return surface;
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const product = await prisma.printableProduct.findUnique({ where: { id }, select: { id: true, title: true, slug: true } });
  if (!product) return NextResponse.json({ ok: false, code: "not_found" }, { status: 404, headers: PRIVATE.headers });

  const analytics = await getPrintableProductAnalytics(id);

  const downloaderRows = await prisma.printableDownloadEvent.findMany({
    where: { printableProductId: id, userId: { not: null } },
    orderBy: { downloadedAt: "desc" },
    take: 500,
    select: { userId: true, downloadedAt: true, source: true },
  });

  const userIds = Array.from(new Set(downloaderRows.map((r) => r.userId).filter(Boolean) as string[])).slice(0, 200);
  const users =
    userIds.length > 0
      ? await prisma.user.findMany({
          where: { id: { in: userIds } },
          select: { id: true, email: true, name: true },
        })
      : [];
  const userById = new Map(users.map((u) => [u.id, u]));

  const usersWhoDownloaded = downloaderRows.map((r) => ({
    userId: r.userId,
    downloadedAt: r.downloadedAt.toISOString(),
    source: r.source,
    email: r.userId ? userById.get(r.userId)?.email ?? null : null,
    name: r.userId ? userById.get(r.userId)?.name ?? null : null,
  }));

  return NextResponse.json(
    { ok: true, product, analytics: { ...analytics, usersWhoDownloaded } },
    { headers: PRIVATE.headers },
  );
}
