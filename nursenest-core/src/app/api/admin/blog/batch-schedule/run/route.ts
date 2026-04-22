import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { processDueBlogBatchScheduleItems } from "@/lib/blog/blog-batch-schedule";

/**
 * Process due batch schedule items once (admin manual run). Same logic as cron.
 */
export async function POST(req: NextRequest) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const result = await processDueBlogBatchScheduleItems();
  revalidatePath("/blog");
  revalidatePath("/blog", "layout");
  return NextResponse.json({ ok: true, ...result });
}
