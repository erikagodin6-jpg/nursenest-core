import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { contentBulkEnqueueBodySchema, contentBulkUtilityEnqueueSchema } from "@/lib/admin/content-bulk/content-bulk-request-body";
import { BLOG_BULK_CHUNK_SIZE } from "@/lib/admin/content-bulk/blog-bulk-schema";
import { resolveBlogBulkTargets } from "@/lib/admin/content-bulk/resolve-blog-bulk-ids";
import { enqueueJob } from "@/lib/jobs/enqueue";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";

const bodySchema = z.union([
  z.object({ scope: z.literal("blog"), blog: contentBulkEnqueueBodySchema }),
  z.object({ scope: z.literal("utility"), utility: contentBulkUtilityEnqueueSchema }),
]);

function chunkArray<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out.length ? out : [[]];
}

export async function POST(req: Request) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body", details: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;
  const correlationId = randomUUID().slice(0, 32);
  const createdById = gate.admin.userId;

  if (body.scope === "utility") {
    if (body.utility.kind === "sitemap_revalidate") {
      const job = await enqueueJob("content.bulk.sitemap_revalidate", {
        correlationId,
        createdById,
      });
      safeServerLog("content_bulk", "enqueue", { scope: "utility", kind: "sitemap_revalidate", correlationId });
      return NextResponse.json({
        ok: true,
        correlationId,
        jobs: [job],
        message: "Sitemap revalidation job queued. Ensure cron or /api/admin/ops/run run_job_worker processes the queue.",
      });
    }
    const job = await enqueueJob("content.recompute_stem_hashes", {});
    safeServerLog("content_bulk", "enqueue", { scope: "utility", kind: "question_stem_hashes", correlationId });
    return NextResponse.json({
      ok: true,
      correlationId,
      jobs: [job],
      message: "Stem hash job queued (existing worker type).",
    });
  }

  const { operation, filters, taxonomy, confirmation: _c } = body.blog;
  void _c;

  const rows = await resolveBlogBulkTargets(filters);
  const ids = rows.map((r) => r.id);
  if (ids.length === 0) {
    return NextResponse.json({ ok: false, error: "No posts matched filters." }, { status: 400 });
  }

  const chunks = chunkArray(ids, BLOG_BULK_CHUNK_SIZE).filter((c) => c.length > 0);
  const jobs = [];
  let chunkIndex = 0;
  for (const postIds of chunks) {
    const job = await enqueueJob("content.bulk.blog_chunk", {
      operation,
      postIds,
      correlationId,
      chunkIndex,
      totalChunks: chunks.length,
      createdById,
      ...(taxonomy ? { taxonomy } : {}),
    });
    jobs.push(job);
    chunkIndex += 1;
  }

  safeServerLog("content_bulk", "enqueue", {
    scope: "blog",
    operation,
    correlationId,
    posts: ids.length,
    chunks: jobs.length,
    actorPrefix: createdById.slice(0, 8),
  });

  return NextResponse.json({
    ok: true,
    correlationId,
    operation,
    postsEnqueued: ids.length,
    chunkJobs: jobs.length,
    jobs,
    message:
      "Chunk jobs queued. Processing runs via background job worker (cron or super-admin ops/run_job_worker). Each chunk writes an automation log row.",
  });
}
