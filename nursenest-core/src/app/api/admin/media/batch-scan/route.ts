import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { prisma } from "@/lib/db";
import { takeForIdIn } from "@/lib/db/prisma-find-many-bounds";
import { scanMediaUsage } from "@/lib/media/scan-media-usage";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BATCH = 20;

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON", code: "admin_media_batch_scan_invalid_json" },
      { status: 400 },
    );
  }

  const intent = parseAdminJsonMutationIntent(body);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields((body ?? {}) as Record<string, unknown>);
  const ids = stripped.ids as unknown;
  if (!Array.isArray(ids) || !ids.every((x) => typeof x === "string")) {
    return NextResponse.json(
      { error: "ids must be string[]", code: "admin_media_batch_scan_invalid_ids" },
      { status: 400 },
    );
  }

  const slice = ids.slice(0, MAX_BATCH);
  if (intent.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      preview: { wouldScanCount: slice.length, maxBatch: MAX_BATCH },
    });
  }

  const rows = await prisma.mediaAsset.findMany({
    where: { id: { in: slice } },
    select: { id: true, publicUrl: true, storageKey: true },
    take: takeForIdIn(slice, MAX_BATCH),
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
