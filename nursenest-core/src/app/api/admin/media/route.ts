import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const pageSize = Math.min(80, Math.max(1, Number(url.searchParams.get("pageSize") || 24)));
  const q = url.searchParams.get("q")?.trim() || "";
  const type = url.searchParams.get("type")?.trim() || "all";
  const tag = url.searchParams.get("tag")?.trim() || "";
  const used = url.searchParams.get("used")?.trim() || "any";

  const and: Prisma.MediaAssetWhereInput[] = [];

  if (type !== "all" && (type === "image" || type === "pdf" || type === "media")) {
    and.push({ kind: type });
  }

  if (tag) {
    and.push({ tags: { has: tag } });
  }

  if (used === "yes") {
    and.push({ usageRefCount: { gt: 0 } });
  } else if (used === "no") {
    and.push({
      OR: [{ usageRefCount: 0 }, { usageRefCount: null }],
    });
  }

  if (q) {
    and.push({
      OR: [
        { filename: { contains: q, mode: "insensitive" } },
        { publicUrl: { contains: q, mode: "insensitive" } },
        { altText: { contains: q, mode: "insensitive" } },
        { tags: { has: q } },
      ],
    });
  }

  const where: Prisma.MediaAssetWhereInput = and.length ? { AND: and } : {};

  const [total, rows] = await Promise.all([
    prisma.mediaAsset.count({ where }),
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        publicUrl: true,
        storageKey: true,
        filename: true,
        mimeType: true,
        kind: true,
        fileSizeBytes: true,
        width: true,
        height: true,
        altText: true,
        tags: true,
        usageRefCount: true,
        usageRefs: true,
        usageScannedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return NextResponse.json({
    items: rows.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      usageScannedAt: r.usageScannedAt?.toISOString() ?? null,
    })),
    total,
    page,
    pageSize,
  });
}
