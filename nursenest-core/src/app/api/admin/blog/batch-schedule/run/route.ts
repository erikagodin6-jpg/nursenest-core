import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { processDueBlogBatchScheduleItems } from "@/lib/blog/blog-batch-schedule";

/**
 * Process due batch schedule items once (admin manual run). Same logic as cron.
 */
export async function POST() {
  const gate = await requireAdmin();
  if (!gate.ok) return gate.response;

  const result = await processDueBlogBatchScheduleItems();
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  return NextResponse.json({ ok: true, ...result });
}
