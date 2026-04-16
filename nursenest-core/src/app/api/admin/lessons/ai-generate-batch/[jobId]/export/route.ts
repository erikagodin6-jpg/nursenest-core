import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_LESSON_BATCH_TOOL,
  formatLessonBatchCsv,
  loadLessonBatchSummaryWithHydration,
} from "@/lib/lessons/admin-ai-lesson-batch";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

type Props = { params: Promise<{ jobId: string }> };

export async function GET(_req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { jobId } = await ctx.params;
  const job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (job.tool !== ADMIN_LESSON_BATCH_TOOL) {
    return NextResponse.json({ error: "Not a lesson batch job" }, { status: 400 });
  }

  const summary = await loadLessonBatchSummaryWithHydration(prisma, jobId);
  if (!summary) {
    return NextResponse.json({ error: "No batch data" }, { status: 404 });
  }

  const csv = formatLessonBatchCsv(jobId, summary.items, summary.settings);
  const safeBase = jobId.replace(/[^a-zA-Z0-9._-]+/g, "_").slice(0, 120);
  const filename = `lesson-batch-${safeBase}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
