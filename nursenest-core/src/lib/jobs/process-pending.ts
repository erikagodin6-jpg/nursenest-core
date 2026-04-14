import { BlogImageStatus, JobStatus } from "@prisma/client";
import { stemHash } from "@/lib/content/stem-hash";
import { CronAdvisoryLock } from "@/lib/cron/cron-advisory-lock";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";
import { productEvent } from "@/lib/observability/product-events";

const BATCH = 5;

/**
 * Process a small batch of pending jobs (idempotent). Safe to call from cron.
 * Add handlers in `handleJob` as you introduce automation.
 */
export async function processPendingJobs(): Promise<{ processed: number; failed: number }> {
  await prisma.$executeRaw`SELECT pg_advisory_lock(${CronAdvisoryLock.backgroundJobs})`;
  let processed = 0;
  let failed = 0;
  try {
    const pending = await prisma.backgroundJob.findMany({
      where: { status: JobStatus.PENDING, scheduledFor: { lte: new Date() } },
      orderBy: { scheduledFor: "asc" },
      take: BATCH,
    });

    for (const job of pending) {
      await prisma.backgroundJob.update({
        where: { id: job.id },
        data: { status: JobStatus.RUNNING, attempts: { increment: 1 } },
      });

      try {
        await handleJob(job.type, job.payload);
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: { status: JobStatus.COMPLETED, lastError: null },
        });
        processed += 1;
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        const attemptCount = job.attempts + 1;
        const shouldRetry = attemptCount < job.maxAttempts;
        await prisma.backgroundJob.update({
          where: { id: job.id },
          data: {
            status: shouldRetry ? JobStatus.PENDING : JobStatus.FAILED,
            lastError: msg,
            scheduledFor: shouldRetry ? new Date(Date.now() + 60_000 * attemptCount) : undefined,
          },
        });
        failed += 1;
        safeServerLog("jobs", "job_failed", { id: job.id, type: job.type, msg });
      }
    }

    productEvent("cron_jobs_batch", { processed, failed });
    return { processed, failed };
  } finally {
    await prisma.$executeRaw`SELECT pg_advisory_unlock(${CronAdvisoryLock.backgroundJobs})`;
  }
}

async function handleJob(type: string, payload: unknown): Promise<void> {
  switch (type) {
    case "analytics.recompute_stub":
      return;
    case "content.recompute_stem_hashes": {
      const rows = await prisma.examQuestion.findMany({
        where: { stemHash: null },
        select: { id: true, stem: true },
        take: 500,
      });
      for (const r of rows) {
        const hash = stemHash(r.stem);
        await prisma.examQuestion.update({ where: { id: r.id }, data: { stemHash: hash } });
      }
      return;
    }
    case "blog.image.generate_featured": {
      const p = payload as { postId?: string; prompt?: string };
      if (!p?.postId) throw new Error("Missing postId for blog.image.generate_featured");
      // Provider integration point: keep flow production-safe even without API keys.
      // If no provider is configured, mark failed-image state explicitly for admin retry.
      const provider = process.env.BLOG_IMAGE_PROVIDER?.trim();
      if (!provider) {
        await prisma.blogPost.update({
          where: { id: p.postId },
          data: {
            imageStatus: BlogImageStatus.FAILED,
            rankingNote: "Image generation requested but BLOG_IMAGE_PROVIDER is not configured.",
          },
        });
        return;
      }
      await prisma.blogPost.update({
        where: { id: p.postId },
        data: {
          imageStatus: BlogImageStatus.FAILED,
          rankingNote: `Image provider "${provider}" is configured but generator adapter is not yet wired.`,
        },
      });
      return;
    }
    default:
      throw new Error(`Unknown job type: ${type}`);
  }
}
