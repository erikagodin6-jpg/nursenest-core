import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import {
  serializeBlogArticleGenerationJob,
  tickBlogArticleGenerationJob,
} from "@/lib/blog/blog-article-generation-job";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type RouteContext = { params: Promise<{ id: string }> };

/**
 * Runs one queued generation job (same primitive as cron). Long-running AI work — client should use a long fetch timeout.
 */
export async function POST(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  try {
    const { id } = await ctx.params;
    const owned = await prisma.blogArticleGenerationJob.findFirst({
      where: { id, createdById: gate.admin.userId },
      select: { id: true },
    });
    if (!owned) {
      return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
    }

    const out = await tickBlogArticleGenerationJob(id);
    safeServerLog("admin", "blog_article_generation_job_tick", {
      jobId: id,
      claimed: out.claimed,
      ran: out.ran,
      ok: out.ok,
    });

    const row = await prisma.blogArticleGenerationJob.findUnique({ where: { id } });
    if (!row) {
      return NextResponse.json(
        { success: false, ok: false, error: "job_missing_after_tick" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: out.ok,
      ok: out.ok,
      claimed: out.claimed,
      ran: out.ran,
      error: out.error,
      job: serializeBlogArticleGenerationJob(row),
    });
  } catch (error) {
    console.error("[BLOG_GENERATION_ERROR]", error);
    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }
    const message = error instanceof Error ? error.message : String(error);
    safeServerLog("admin", "blog_article_generation_job_tick_unexpected", {
      message,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
