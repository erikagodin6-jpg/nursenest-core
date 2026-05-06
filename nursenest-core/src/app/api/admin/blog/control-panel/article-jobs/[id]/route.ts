import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  serializeBlogArticleGenerationJob,
} from "@/lib/blog/blog-article-generation-job";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const row = await prisma.blogArticleGenerationJob.findFirst({
    where: { id, createdById: gate.admin.userId },
  });
  if (!row) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ ok: true, job: serializeBlogArticleGenerationJob(row) });
}
