import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  ADMIN_QUESTION_BATCH_JOB_TOOL,
  isTerminalQuestionBatchStatus,
  parseQuestionBatchSummary,
  reviveStaleQuestionBatchItems,
} from "@/lib/ai/admin-ai-question-batch";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ jobId: string }> };

export async function GET(req: Request, ctx: Props) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { jobId } = await ctx.params;
  let job = await prisma.aiGenerationJob.findUnique({ where: { id: jobId } });
  if (!job) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (job.createdById !== gate.admin.userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (job.tool !== ADMIN_QUESTION_BATCH_JOB_TOOL) {
    return NextResponse.json({ error: "Not a question batch job" }, { status: 400 });
  }

  let summary = parseQuestionBatchSummary(job.resultSummary);
  if (summary) {
    const { summary: revived, mutated } = reviveStaleQuestionBatchItems(summary);
    if (mutated) {
      const allDone = revived.items.every((i) => isTerminalQuestionBatchStatus(i.status));
      await prisma.aiGenerationJob.update({
        where: { id: jobId },
        data: {
          resultSummary: revived as object,
          status: allDone ? JobStatus.COMPLETED : JobStatus.RUNNING,
        },
      });
      job = (await prisma.aiGenerationJob.findUnique({ where: { id: jobId } })) ?? job;
      summary = parseQuestionBatchSummary(job.resultSummary) ?? revived;
    } else {
      summary = revived;
    }
  }

  return NextResponse.json({
    job: {
      id: job.id,
      status: job.status,
      model: job.model,
      error: job.error,
      tokensUsed: job.tokensUsed,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    },
    summary,
    inputPayload: job.inputPayload,
  });
}
