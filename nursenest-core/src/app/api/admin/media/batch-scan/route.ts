import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { scanMediaUsage } from "@/lib/media/scan-media-usage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BATCH = 20;

export async function POST(req: Request) {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const ids = (body as { ids?: unknown })?.ids;
  if (!Array.isArray(ids) || !ids.every((x) => typeof x === "string")) {
    return NextResponse.json({ error: "ids must be string[]" }, { status: 400 });
  }

  const slice = ids.slice(0, MAX_BATCH);
  const rows = await prisma.mediaAsset.findMany({
    where: { id: { in: slice } },
    select: { id: true, publicUrl: true, storageKey: true },
  });

  const results: Array<{ id: string; count: number }> = [];

  for (const row of rows) {
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
    results.push({ id: row.id, count });
  }

  return NextResponse.json({ updated: results.length, results });
}
