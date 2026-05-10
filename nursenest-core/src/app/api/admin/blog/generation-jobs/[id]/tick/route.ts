import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { parseAdminJsonMutationIntent, stripAdminMutationControlFields } from "@/lib/admin/admin-mutation-intent";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import { processDraftGenerationBatchItems } from "@/lib/blog/blog-draft-generation-batch";
import { DRAFT_BATCH_MAX_ITEMS_PER_PROCESS } from "@/lib/blog/blog-draft-generation-batch-constants";
import { isRnTopicMapShellGenerationBatch } from "@/lib/blog/blog-topic-map-shell-batch-constants";
import { prisma } from "@/lib/db";
import { loadBlogGenerationJobForAdmin } from "@/lib/blog/blog-generation-jobs";
import { safeServerLog } from "@/lib/observability/safe-server-log";


const JOB_TICK_LOAD_DEADLINE_MS = 25_000;

function raceJobLoadForTick<T>(promise: Promise<T>): Promise<T> {
  let to: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    to = setTimeout(() => {
      const err = new Error("Blog generation job load exceeded internal deadline");
      err.name = "JobLoadDeadlineError";
      reject(err);
    }, JOB_TICK_LOAD_DEADLINE_MS);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (to) clearTimeout(to);
  }) as Promise<T>;
}

const bodySchema = z.object({
  limit: z.number().int().min(1).max(DRAFT_BATCH_MAX_ITEMS_PER_PROCESS).optional(),
});

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Bounded server-side advance for one job (optional nudge between cron ticks).
 * Same processing primitive as `/draft-batch/:id/process`; only allowed for `backgroundProcessing` batches.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const batch = await prisma.blogDraftGenerationBatch.findUnique({
    where: { id },
    select: { id: true, backgroundProcessing: true, exam: true },
  });
  if (!batch) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const shellJob = isRnTopicMapShellGenerationBatch(batch);
  if (!shellJob) {
    const aiBlock = adminAiGenerationHttpBlock({ pipeline: "blog" });
    if (aiBlock) return aiBlock;
  }

  if (!batch.backgroundProcessing) {
    return NextResponse.json(
      { error: "This batch is not a background job; use /api/admin/blog/draft-batch/:id/process instead." },
      { status: 409 },
    );
  }

  let raw: unknown = {};
  try {
    raw = await req.json();
  } catch {
    raw = {};
  }
  const intent = parseAdminJsonMutationIntent(raw);
  if (intent instanceof NextResponse) return intent;

  const stripped = stripAdminMutationControlFields((raw ?? {}) as Record<string, unknown>);
  const parsed = bodySchema.safeParse(stripped);
  let limit = 2;
  if (parsed.success && parsed.data.limit != null) limit = parsed.data.limit;

  if (intent.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      preview: `Would tick job ${id.slice(0, 8)}… up to ${limit} item(s).`,
    });
  }

  await prisma.blogDraftGenerationBatch.updateMany({
    where: { id, processorStartedAt: null },
    data: { processorStartedAt: new Date() },
  });

  const out = await processDraftGenerationBatchItems(id, limit);
  safeServerLog("admin", "blog_generation_job_tick", {
    jobId: id,
    processed: out.processed,
    errorCount: out.errors.length,
  });

  if (out.errors.length > 0 && out.processed === 0) {
    const first = out.errors[0] ?? "process_failed";
    const status =
      first === "batch_not_found" ? 404
      : first === "batch_cancelled" ? 409
      : 503;
    const firstItemFail = out.results.find((r) => r.outcome === "failed");
    const message =
      firstItemFail?.message && String(firstItemFail.message).trim() ?
        `${first}: ${String(firstItemFail.message).slice(0, 1500)}`
      : first;
    return NextResponse.json(
      {
        ok: false,
        processed: out.processed,
        results: out.results,
        errors: out.errors,
        code: first === "batch_not_found" ? "BATCH_NOT_FOUND" : first === "batch_cancelled" ? "BATCH_CANCELLED" : "PROCESS_FAILED",
        message,
      },
      { status },
    );
  }

  let job;
  try {
    job = await raceJobLoadForTick(loadBlogGenerationJobForAdmin(id, { maxItems: 40 }));
  } catch (e) {
    if (e instanceof Error && e.name === "JobLoadDeadlineError") {
      safeServerLog("admin", "blog_generation_job_response_read_timeout", {
        jobId: id,
        statusPoll: false,
        lite: false,
        deadlineMs: JOB_TICK_LOAD_DEADLINE_MS,
      });
      return NextResponse.json(
        {
          ok: false,
          code: "JOB_RESPONSE_TIMEOUT",
          message: "Job status load exceeded internal deadline; retry polling shortly.",
        },
        { status: 503 },
      );
    }
    throw e;
  }
  return NextResponse.json({ ok: true, ...out, job });
}
