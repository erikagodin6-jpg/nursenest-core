import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { scanMediaUsage } from "@/lib/media/scan-media-usage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const row = await prisma.mediaAsset.findUnique({
    where: { id },
    select: { id: true, publicUrl: true, storageKey: true },
  });

  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { refs, count } = await scanMediaUsage(prisma, {
    publicUrl: row.publicUrl,
    storageKey: row.storageKey,
  });

  await prisma.mediaAsset.update({
    where: { id: row.id },
    data: {
      usageRefCount: count,
      usageRefs: refs as object[],
      usageScannedAt: new Date(),
    },
  });

  return NextResponse.json({ count, refs });
}
