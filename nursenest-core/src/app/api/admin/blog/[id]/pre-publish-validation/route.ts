import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/ensure-admin";
import {
  blogPrePublishValidationSelect,
  validateBlogPrePublish,
} from "@/lib/blog/blog-pre-publish-validation";
import { prisma } from "@/lib/db";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, ctx: RouteContext) {
  const gate = await requireAdmin(req);
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const row = await prisma.blogPost.findUnique({
    where: { id },
    select: blogPrePublishValidationSelect,
  });
  if (!row) {
    return NextResponse.json({ error: "Blog post not found" }, { status: 404 });
  }

  const prePublish = await validateBlogPrePublish(row, id);
  return NextResponse.json({ ok: true, prePublish });
}
