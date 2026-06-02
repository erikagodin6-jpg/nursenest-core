import { JobStatus } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Re-queue a FAILED background job (cron worker). Does not run the job inline.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const job = await prisma.backgroundJob.findUnique({
    where: { id },
    select: { id: true, status: true, type: true, attempts: true, maxAttempts: true },
  });
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }
  if (job.status !== JobStatus.FAILED) {
    return NextResponse.json(
      { error: "Only FAILED jobs can be re-queued from this action.", status: job.status },
      { status: 400 },
    );
  }

  const updated = await prisma.backgroundJob.update({
    where: { id: job.id },
    data: {
      status: JobStatus.PENDING,
      scheduledFor: new Date(),
      lastError: null,
      attempts: 0,
    },
    select: {
      id: true,
      type: true,
      status: true,
      attempts: true,
      maxAttempts: true,
      scheduledFor: true,
    },
  });

  return NextResponse.json({
    ok: true,
    job: {
      ...updated,
      scheduledFor: updated.scheduledFor.toISOString(),
    },
  });
}
