import { BlogDraftGenerationBatchItemStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ itemId: string }> };

/**
 * Re-queue a failed draft-batch row for another generation pass (admin only).
 * Accepts FAILED items (including after repair exhaustion).
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { itemId } = await ctx.params;
  const item = await prisma.blogDraftGenerationBatchItem.findUnique({
    where: { id: itemId },
    select: { id: true, status: true, batchId: true },
  });
  if (!item) {
    return NextResponse.json({ ok: false, error: "Item not found" }, { status: 404 });
  }
  if (item.status !== BlogDraftGenerationBatchItemStatus.FAILED) {
    return NextResponse.json(
      { ok: false, error: `Item status is ${item.status}; only FAILED rows can be re-queued here.` },
      { status: 400 },
    );
  }

  await prisma.blogDraftGenerationBatchItem.update({
    where: { id: itemId },
    data: {
      status: BlogDraftGenerationBatchItemStatus.PENDING,
      error: null,
      blogPostId: null,
    },
  });

  return NextResponse.json({ ok: true, batchId: item.batchId, itemId });
}
