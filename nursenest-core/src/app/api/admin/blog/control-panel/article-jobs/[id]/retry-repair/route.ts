import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import { adminAiGenerationHttpBlock } from "@/lib/ai/admin-ai-policy";
import {
  retryRepairBlogArticleGenerationJob,
  serializeBlogArticleGenerationJob,
} from "@/lib/blog/blog-article-generation-job";
import { prisma } from "@/lib/db";
import { safeServerLog } from "@/lib/observability/safe-server-log";

export const dynamic = "force-dynamic";
export const maxDuration = 300;

type RouteContext = { params: Promise<{ id: string }> };

export async function POST(_req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const aiBlock = adminAiGenerationHttpBlock();
  if (aiBlock) return aiBlock;

  const { id } = await ctx.params;
  const owned = await prisma.blogArticleGenerationJob.findFirst({
    where: { id, createdById: gate.admin.userId },
    select: { id: true },
  });
  if (!owned) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const out = await retryRepairBlogArticleGenerationJob(id);
  safeServerLog("admin", "blog_article_generation_job_retry_repair", { jobId: id, ok: out.ok });

  const row = await prisma.blogArticleGenerationJob.findUnique({ where: { id } });
  if (!row) {
    return NextResponse.json({ ok: false, error: "job_missing" }, { status: 500 });
  }

  return NextResponse.json({
    ok: out.ok,
    error: out.error,
    job: serializeBlogArticleGenerationJob(row),
  });
}
