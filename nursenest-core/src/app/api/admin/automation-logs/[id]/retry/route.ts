import {
  BlogDraftGenerationBatchItemStatus,
  ContentAutomationLogCategory,
  ContentAutomationLogStatus,
} from "@prisma/client";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { blogSimpleAiDraftBodySchema } from "@/lib/admin/blog-simple-ai-draft-schema";
import { logSimpleAiDraftRun } from "@/lib/admin/blog-content-automation-log";
import { isAdminAiGenerationEnabled } from "@/lib/ai/admin-ai-policy";
import { assertOpenAiKeyConfigured } from "@/lib/ai/openai-env";
import { processDraftGenerationBatchItems } from "@/lib/blog/blog-draft-generation-batch";
import { generateBlogPost } from "@/lib/blog/generate-blog-ai-draft";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Safe retries: draft-batch FAILED rows (reset + process one chunk), or legacy simple AI draft (FAILED only) using stored payload.
 */
export async function POST(_req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(_req);
  if (!gate.ok) return gate.response;

  const { id: logId } = await ctx.params;
  const logRow = await prisma.contentAutomationLog.findUnique({ where: { id: logId } });
  if (!logRow) {
    return NextResponse.json({ error: "Log not found" }, { status: 404 });
  }

  if (
    logRow.category === ContentAutomationLogCategory.BLOG_AI_BATCH_ITEM &&
    logRow.sourceItemId &&
    logRow.correlationId
  ) {
    if (logRow.status !== ContentAutomationLogStatus.FAILED) {
      return NextResponse.json({ error: "Only FAILED batch-item logs support queue retry" }, { status: 400 });
    }
    const item = await prisma.blogDraftGenerationBatchItem.findFirst({
      where: { id: logRow.sourceItemId, batchId: logRow.correlationId },
    });
    if (!item) {
      return NextResponse.json({ error: "Batch item missing" }, { status: 404 });
    }
    if (item.status !== BlogDraftGenerationBatchItemStatus.FAILED) {
      return NextResponse.json(
        { error: `Item is ${item.status}; only FAILED rows are reset here.` },
        { status: 400 },
      );
    }
    await prisma.blogDraftGenerationBatchItem.update({
      where: { id: item.id },
      data: { status: BlogDraftGenerationBatchItemStatus.PENDING, error: null },
    });
    const out = await processDraftGenerationBatchItems(logRow.correlationId, 1);
    return NextResponse.json({ ok: true, kind: "draft_batch_item", process: out });
  }

  if (
    logRow.category === ContentAutomationLogCategory.BLOG_AI_SIMPLE &&
    logRow.status === ContentAutomationLogStatus.FAILED
  ) {
    if (!isAdminAiGenerationEnabled()) {
      return NextResponse.json(
        { error: "AI admin generation disabled", hint: "Set AI_ADMIN_GENERATION_ENABLED=true" },
        { status: 403 },
      );
    }
    const keyCheck = assertOpenAiKeyConfigured();
    if (!keyCheck.ok) {
      return NextResponse.json({ error: keyCheck.message }, { status: 503 });
    }

    const meta = logRow.metadata as { retryPayload?: unknown } | null;
    const parsed = blogSimpleAiDraftBodySchema.safeParse(meta?.retryPayload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "No valid retryPayload on this log — re-run from the generator UI." },
        { status: 400 },
      );
    }
    const d = parsed.data;

    const result = await generateBlogPost({
      topic: d.topic,
      keywords: d.keywords,
      exam: d.exam,
      country: d.country,
      template: d.template,
      intent: d.intent,
      funnelStage: d.funnelStage,
      tone: d.tone,
      includeImage: d.includeImage,
      includeAiImage: d.includeAiImage,
      targetKeyword: d.targetKeyword,
      keywordCluster: d.keywordCluster,
      countryTarget: d.countryTarget,
      sourceRecords: d.sourceRecords,
      slug: d.slug,
      allowDuplicateCanonicalTopic: d.allowDuplicateCanonicalTopic,
    });

    await logSimpleAiDraftRun({
      createdById: gate.admin.userId,
      body: d,
      result,
      retryOfId: logRow.id,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false, error: result.error, kind: "simple_ai" }, { status: 502 });
    }
    if (result.skipped) {
      return NextResponse.json({ ok: true, skipped: true, reason: result.reason, kind: "simple_ai" });
    }
    return NextResponse.json({ ok: true, post: result.post, kind: "simple_ai" });
  }

  return NextResponse.json(
    { error: "Retry is not implemented for this log category / status." },
    { status: 400 },
  );
}
