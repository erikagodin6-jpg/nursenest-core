import { BlogBatchScheduleItemStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";
import { parseBlogBatchItemRepairMeta } from "@/lib/blog/blog-generation-repair-classifier";

type RouteContext = { params: Promise<{ itemId: string }> };

/**
 * Re-queue a failed batch-schedule row for another generation pass (admin only).
 * Accepts FAILED items where the failure is NOT marked terminal in the repair metadata.
 * Terminal failures (unsafe content, API hard failure) cannot be retried automatically.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { itemId } = await ctx.params;
  const item = await prisma.blogBatchScheduleItem.findUnique({
    where: { id: itemId },
    select: { id: true, status: true, scheduleId: true, failureReason: true },
  });
  if (!item) {
    return NextResponse.json({ ok: false, error: "Item not found" }, { status: 404 });
  }
  if (item.status !== BlogBatchScheduleItemStatus.FAILED) {
    return NextResponse.json(
      { ok: false, error: `Item status is ${item.status}; only FAILED rows can be re-queued.` },
      { status: 400 },
    );
  }

  const meta = parseBlogBatchItemRepairMeta(item.failureReason);
  if (meta.terminal === true) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failure is marked terminal; automatic repair cannot recover this item. Edit the topic or remove the item instead.",
        repairAttempts: meta.repairAttempts,
      },
      { status: 409 },
    );
  }

  await prisma.blogBatchScheduleItem.update({
    where: { id: itemId },
    data: {
      status: BlogBatchScheduleItemStatus.PENDING,
      failureReason: null,
    },
  });

  return NextResponse.json({ ok: true, scheduleId: item.scheduleId, itemId });
}
